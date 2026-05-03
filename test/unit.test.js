import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import parseParams from '../src/api/lib/params.js';
import { formatPrice, cleanStr } from '../src/lib/routes/helpers.js';
import createParseParams from '../src/lib/routes/params.js';

describe('parseParams', () => {
  it('returns defaults for empty input', () => {
    const result = parseParams({});
    assert.equal(result.class, 2);
    assert.equal(result.bc, 0);
    assert.equal(result.age, 30);
    assert.equal(result.duration, null);
    assert.equal(result.departureAfter, null);
    assert.equal(result.arrivalBefore, null);
    assert.equal(result.maxChanges, null);
  });

  it('parses class', () => {
    assert.equal(parseParams({ class: '1' }).class, 1);
    assert.equal(parseParams({ class: '2' }).class, 2);
    assert.equal(parseParams({ class: '3' }).class, 2); // invalid → default
  });

  it('parses BahnCard', () => {
    assert.equal(parseParams({ bc: '1' }).bc, 1);
    assert.equal(parseParams({ bc: '3' }).bc, 3);
    assert.equal(parseParams({ bc: '5' }).bc, 5);
    assert.equal(parseParams({ bc: '2' }).bc, 0); // invalid → default
  });

  it('parses age as number', () => {
    assert.equal(parseParams({ age: '25' }).age, 25);
    assert.equal(parseParams({ age: '0' }).age, 0);
    assert.equal(parseParams({ age: '99' }).age, 99);
    assert.equal(parseParams({ age: '100' }).age, 30); // out of range → default
    assert.equal(parseParams({ age: 'abc' }).age, 30); // invalid → default
  });

  it('parses duration', () => {
    assert.equal(parseParams({ duration: '12' }).duration, 12);
    assert.equal(parseParams({ duration: '0' }).duration, null); // 0 → null
    assert.equal(parseParams({ duration: '25' }).duration, null); // >24 → null
  });

  it('parses departureAfter and arrivalBefore', () => {
    assert.equal(parseParams({ departureAfter: '8:30' }).departureAfter, 510);
    assert.equal(parseParams({ arrivalBefore: '18:00' }).arrivalBefore, 1080);
    assert.equal(parseParams({ departureAfter: '14' }).departureAfter, 840);
    // without colon
    assert.equal(parseParams({ departureAfter: '830' }).departureAfter, 510);
    assert.equal(parseParams({ arrivalBefore: '1800' }).arrivalBefore, 1080);
    assert.equal(parseParams({ departureAfter: '0' }).departureAfter, 0);
  });

  it('rejects arrivalBefore if before departureAfter', () => {
    const result = parseParams({
      departureAfter: '14:00',
      arrivalBefore: '10:00',
    });
    assert.equal(result.departureAfter, 840);
    assert.equal(result.arrivalBefore, null);
  });

  it('parses maxChanges', () => {
    assert.equal(parseParams({ maxChanges: '0' }).maxChanges, 0);
    assert.equal(parseParams({ maxChanges: '2' }).maxChanges, 2);
    assert.equal(parseParams({ maxChanges: '' }).maxChanges, null);
    assert.equal(parseParams({ maxChanges: '-1' }).maxChanges, null);
  });
});

describe('formatPrice', () => {
  it('splits into euros and cents', () => {
    assert.deepEqual(formatPrice(12.5), { euros: '12', cents: '50' });
    assert.deepEqual(formatPrice(0.99), { euros: '0', cents: '99' });
    assert.deepEqual(formatPrice(100), { euros: '100', cents: '00' });
    assert.deepEqual(formatPrice(7.1), { euros: '7', cents: '10' });
  });
});

describe('cleanStr', () => {
  it('lowercases and trims', () => {
    assert.equal(cleanStr('  Budapest  '), 'budapest');
    assert.equal(cleanStr('WIEN'), 'wien');
    assert.equal(cleanStr('Hamburg Hbf'), 'hamburg hbf');
  });
});

describe('auto border routing (route-level params)', () => {
  const mockApi = {
    params: () => ({
      class: 2,
      bc: 0,
      age: 30,
      duration: null,
      departureAfter: null,
      arrivalBefore: null,
      maxChanges: null,
    }),
    station: async (name) => {
      const stations = {
        'Budapest Keleti': {
          id: '005510017',
          name: 'Budapest Keleti',
          location: { type: 'location', latitude: 47.499, longitude: 19.025 },
        },
        'Hamburg Hbf': {
          id: '008099970',
          name: 'Hamburg Hbf',
          location: { type: 'location', latitude: 53.553, longitude: 10.007 },
        },
        'München Hbf': {
          id: '008099972',
          name: 'München Hbf',
          location: { type: 'location', latitude: 48.14, longitude: 11.558 },
        },
        'Wien Hbf': {
          id: '008199990',
          name: 'Wien Hbf',
          location: { type: 'location', latitude: 48.185, longitude: 16.376 },
        },
      };
      return stations[name] || null;
    },
  };

  const parseRouteParams = createParseParams(mockApi);

  it('no borderRouting when origin is Hungarian', async () => {
    const { params } = await parseRouteParams({
      origin: 'Budapest Keleti',
      destination: 'Hamburg Hbf',
    });
    assert.equal(params.borderRouting, 0);
  });

  it('no borderRouting when destination is Hungarian', async () => {
    const { params } = await parseRouteParams({
      origin: 'Hamburg Hbf',
      destination: 'Budapest Keleti',
    });
    assert.equal(params.borderRouting, 0);
  });

  it('borderRouting=2 when destination is closer to Hegyeshalom', async () => {
    const { params } = await parseRouteParams({
      origin: 'Hamburg Hbf',
      destination: 'Wien Hbf',
    });
    assert.equal(params.borderRouting, 2);
  });

  it('borderRouting=1 when origin is closer to Hegyeshalom', async () => {
    const { params } = await parseRouteParams({
      origin: 'Wien Hbf',
      destination: 'Hamburg Hbf',
    });
    assert.equal(params.borderRouting, 1);
  });

  it('error when station not found', async () => {
    const { error } = await parseRouteParams({
      origin: 'Nonexistent',
      destination: 'Hamburg Hbf',
    });
    assert.equal(error, 'invalid-stations');
  });

  it('error when station has no location', async () => {
    const apiNoLoc = {
      ...mockApi,
      station: async (name) => {
        if (name === 'NoLoc') return { id: '009900001', name: 'NoLoc' };
        return mockApi.station(name);
      },
    };
    const parse = createParseParams(apiNoLoc);
    const { error } = await parse({
      origin: 'NoLoc',
      destination: 'Hamburg Hbf',
    });
    assert.equal(error, 'missing-location');
  });
});
