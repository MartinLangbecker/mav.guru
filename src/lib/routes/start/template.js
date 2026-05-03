import { h } from 'hastscript';
import * as helpers from '../helpers.js';

const head = (api) =>
  h('head', [
    ...helpers.staticHeader(api),
    h('title', api.settings.title),
    ...helpers.opengraph({ api, extraTitle: null }),
    h('link', {
      rel: 'stylesheet',
      type: 'text/css',
      href: '/assets/styles/main.css',
    }),
    h('link', {
      rel: 'stylesheet',
      type: 'text/css',
      href: '/assets/styles/autocomplete.css',
    }),
  ]);

const errorBox = (error) => {
  if (error && error.message)
    return h('div', { id: 'error', class: 'subtitle' }, [
      h('span', error.message),
    ]);
  return [];
};

const formatMinutes = (m) => {
  const hh = String(Math.floor(m / 60)).padStart(2, '0');
  const mm = String(m % 60).padStart(2, '0');
  return `${hh}:${mm}`;
};

const createTemplate =
  (api) =>
  ({ params, error }) => {
    if (!params) params = {};
    const body = [
      h('form', { id: 'page', action: './bestpreis', method: 'GET' }, [
        h('div#header', [h('h1', 'Bestpreissuche')]),
        h('div', { id: 'success', class: 'subtitle' }, [
          h('div', 'Finde den günstigsten Preis für deine Verbindung.'),
        ]),
        errorBox(error),
        h('div#form', [
          h('div', { id: 'origin', class: 'station' }, [
            h('span', 'Ab'),
            h('input', {
              id: 'originInput',
              name: 'origin',
              type: 'text',
              value: params.origin ? params.origin.name : '',
              placeholder: api.settings.originPlaceholder,
              size: 1,
              autocomplete: 'one-time-code',
            }),
          ]),
          h(
            'button',
            {
              type: 'button',
              id: 'swap',
              title: 'Stationen tauschen',
              'aria-label': 'Start und Ziel tauschen',
            },
            '⇅',
          ),
          h('div', { id: 'destination', class: 'station' }, [
            h('span', 'An'),
            h('input', {
              id: 'destinationInput',
              name: 'destination',
              type: 'text',
              value: params.destination ? params.destination.name : '',
              placeholder: api.settings.destinationPlaceholder,
              size: 1,
              autocomplete: 'one-time-code',
            }),
          ]),
          h('div#date-row', [
            h('label', { for: 'date' }, 'Datum: '),
            h('input', {
              id: 'date',
              name: 'date',
              type: 'date',
              value: params.date || '',
            }),
          ]),
          h('div#go', [
            h('input', { id: 'submit', type: 'submit', value: 'Suchen' }),
          ]),
        ]),
        h('details', { id: 'options-details' }, [
          h('summary', 'Optionen & Filter'),
          h('div#options', [
            h('div.options-section', [
              h('span.section-label', 'Reisende'),
              ...api.options.input(params),
            ]),
            h('div.options-section', [
              h('span.section-label', 'Filter'),
              h('div.filter-grid', [
                h('span.optRow', [
                  h('label', [
                    'Abfahrt ab: ',
                    h('input', {
                      type: 'text',
                      placeholder: '--:--',
                      value:
                        params.departureAfter != null
                          ? formatMinutes(params.departureAfter)
                          : '',
                      name: 'departureAfter',
                    }),
                  ]),
                ]),
                h('span.optRow', [
                  'max. ',
                  h('label', [
                    h('input', {
                      type: 'text',
                      placeholder: '∞',
                      value:
                        Number.isInteger(params.maxChanges) &&
                        params.maxChanges >= 0
                          ? params.maxChanges
                          : '',
                      name: 'maxChanges',
                    }),
                    ' Umstiege',
                  ]),
                ]),
                h('span.optRow', [
                  h('label', [
                    'Ankunft bis: ',
                    h('input', {
                      type: 'text',
                      placeholder: '--:--',
                      value:
                        params.arrivalBefore != null
                          ? formatMinutes(params.arrivalBefore)
                          : '',
                      name: 'arrivalBefore',
                    }),
                  ]),
                ]),
                h('span.optRow', [
                  'max. ',
                  h('label', [
                    h('input', {
                      type: 'text',
                      placeholder: '24',
                      value: params.duration || '',
                      name: 'duration',
                    }),
                    ' h Fahrzeit',
                  ]),
                ]),
              ]),
            ]),
          ]),
        ]),
      ]),
      h('div#footer', [
        h('a', { id: 'faq', href: './faq' }, 'FAQ'),
        h('span', ' – '),
        h('a', { id: 'imprint', href: './imprint' }, 'Rechtliches'),
      ]),
    ];

    for (const script of api.settings.scripts) {
      body.push(h('script', { src: `/assets/scripts/${script}` }));
    }

    return helpers.toHtmlString([head(api), h('body', body)]);
  };

export default createTemplate;
