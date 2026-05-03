import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';

import createServer from '../src/lib/index.js';

let server;
let baseUrl;

before(async () => {
  server = createServer();
  await new Promise((resolve) => {
    server.listen(0, () => {
      const { port } = server.address();
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
});

after(() => {
  server.close();
});

describe('GET /start', () => {
  it('returns 200 with HTML', async () => {
    const res = await fetch(`${baseUrl}/start`);
    assert.equal(res.status, 200);
    const body = await res.text();
    assert.ok(body.includes('Bestpreissuche'));
    assert.ok(body.includes('originInput'));
  });
});

describe('GET /stations', () => {
  it('returns JSON array for query', async () => {
    const res = await fetch(`${baseUrl}/stations?query=budapest&limit=3`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data));
    assert.ok(data.length > 0);
    assert.ok(data[0].name.toLowerCase().includes('budapest'));
  });

  it('respects limit parameter', async () => {
    const res = await fetch(`${baseUrl}/stations?query=wien&limit=2`);
    const data = await res.json();
    assert.ok(data.length <= 2);
  });
});

describe('GET /faq', () => {
  it('returns 200 with FAQ content', async () => {
    const res = await fetch(`${baseUrl}/faq`);
    assert.equal(res.status, 200);
    const body = await res.text();
    assert.ok(body.includes('FAQ'));
  });
});

describe('GET /imprint', () => {
  it('returns 200', async () => {
    const res = await fetch(`${baseUrl}/imprint`);
    assert.equal(res.status, 200);
  });
});
