import { h } from 'hastscript';
import * as helpers from '../helpers.js';

const HEGYESHALOM_NAME = 'Hegyeshalom';
const MAV_URL = 'https://jegy.mav.hu';
const TZ = 'Europe/Budapest';

const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString('de-DE', {
    timeZone: TZ,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

const formatDuration = (ms) => {
  const totalMin = Math.round(ms / 60000);
  const hours = Math.floor(totalMin / 60);
  const minutes = totalMin % 60;
  return `${hours}:${String(minutes).padStart(2, '0')}`;
};

const formatDate = (d) => {
  const date = d instanceof Date ? d : new Date(d);
  return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
};

const bookingInfo = (params, journey) => {
  const departure = formatTime(journey.legs[0].departure);
  const date = formatDate(params.date);

  if (params.borderRouting === 1) {
    // Hegyeshalom as origin, user's origin as via
    return `${HEGYESHALOM_NAME} → ${params.destination.name}, über ${params.origin.name}, ${date}, ab ${departure}`;
  }
  if (params.borderRouting === 2) {
    // User's origin as origin, user's destination as via, Hegyeshalom as destination
    return `${params.origin.name} → ${HEGYESHALOM_NAME}, über ${params.destination.name}, ${date}, ab ${departure}`;
  }
  // Direct (at least one HU station)
  return `${params.origin.name} → ${params.destination.name}, ${date}, ab ${departure}`;
};

const head = (api, params) => {
  const title = `${params.origin.name} → ${params.destination.name} | Bestpreis`;
  return h('head', [
    ...helpers.staticHeader(api),
    h('title', `${title} | ${api.settings.title}`),
    ...helpers.opengraph({ api, extraTitle: title }),
    h('link', {
      rel: 'stylesheet',
      type: 'text/css',
      href: '/assets/styles/day.css',
    }),
  ]);
};

const resultRow = (params, journey) => {
  const departure = new Date(journey.legs[0].departure);
  const arrival = new Date(journey.legs[journey.legs.length - 1].arrival);
  const duration = +arrival - +departure;
  const price = helpers.formatPrice(journey.price.amount);
  const products = [
    ...new Set(journey.legs.map((leg) => leg.product).filter(Boolean)),
  ];

  return h('tr', [
    h('td', formatTime(journey.legs[0].departure)),
    h('td', formatTime(journey.legs[journey.legs.length - 1].arrival)),
    h('td', formatDuration(duration)),
    h('td.changes', String(journey.legs.filter((l) => l.mode !== 'walking').length - 1)),
    h('td', products.join(', ') || '–'),
    h('td.price', `${price.euros},${price.cents} €`),
    h('td.booking', [
      h('details', [
        h('summary', 'Buchen'),
        h('p', bookingInfo(params, journey)),
        h(
          'a',
          { href: MAV_URL, target: '_blank', rel: 'noopener noreferrer' },
          'jegy.mav.hu →',
        ),
      ]),
    ]),
  ]);
};

const buildSearchUrl = (input, date) => {
  const d = date instanceof Date ? date : new Date(date);
  const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const params = [
    `origin=${encodeURIComponent(input.origin.name)}`,
    `destination=${encodeURIComponent(input.destination.name)}`,
    `date=${dateStr}`,
  ];
  if (input.class && input.class !== 2) params.push(`class=${input.class}`);
  if (input.bc) params.push(`bc=${input.bc}`);
  if (input.age !== 30) params.push(`age=${input.age}`);
  if (input.departureAfter != null) params.push(`departureAfter=${input.departureAfter}`);
  if (input.arrivalBefore != null) params.push(`arrivalBefore=${input.arrivalBefore}`);
  if (input.maxChanges != null) params.push(`maxChanges=${input.maxChanges}`);
  if (input.duration) params.push(`duration=${input.duration}`);
  return `./bestpreis?${params.join('&')}`;
};

const prevDay = (date) => {
  const d = new Date(date);
  d.setDate(d.getDate() - 1);
  return d;
};

const nextDay = (date) => {
  const d = new Date(date);
  d.setDate(d.getDate() + 1);
  return d;
};

const createTemplate = (api) => (data) => {
  const { input, results } = data;
  const cheapest = helpers.formatPrice(results[0].price.amount);
  const backUrl = buildSearchUrl(input, input.date).replace('./bestpreis', './start');

  return helpers.toHtmlString([
    head(api, input),
    h('body', [
      h('div#page', [
        h('div#nav', [
          h('a.back-btn', { href: backUrl, title: 'Suche ändern' }, '← Neue Suche'),
        ]),
        h('div#header', [h('h1', 'Bestpreissuche')]),
        h('div', { class: 'subtitle' }, [
          h('span', [input.origin.name, ' → ', input.destination.name]),
        ]),
        h('div', { id: 'date', class: 'subtitle' }, [
          h('a.date-nav', { href: buildSearchUrl(input, prevDay(input.date)), title: 'Vortag' }, '◀'),
          h('span', ` ${formatDate(input.date)} `),
          h('a.date-nav', { href: buildSearchUrl(input, nextDay(input.date)), title: 'Nächster Tag' }, '▶'),
        ]),
        h('div#bestpreis-result', [
          h('div.cheapest-price', [
            h('span.label', 'Bestpreis: '),
            h('span.amount', `${cheapest.euros},${cheapest.cents} €`),
          ]),
          h(
            'p.info',
            `${results.length} Verbindung${results.length > 1 ? 'en' : ''} gefunden`,
          ),
        ]),
        h('table#journeys', [
          h('thead', [
            h('tr', [
              h('th', 'Ab'),
              h('th', 'An'),
              h('th', 'Dauer'),
              h('th.changes', 'Umst.'),
              h('th', 'Typ'),
              h('th', 'Preis'),
              h('th', ''),
            ]),
          ]),
          h(
            'tbody',
            results.map((journey) => resultRow(input, journey)),
          ),
        ]),
      ]),
      h('div#footer', [
        h('a', { id: 'faq', href: './faq' }, 'FAQ'),
        h('span', ' – '),
        h('a', { id: 'imprint', href: './imprint' }, 'Rechtliches'),
      ]),
    ]),
  ]);
};

export default createTemplate;
