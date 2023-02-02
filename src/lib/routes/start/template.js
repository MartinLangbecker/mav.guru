import { h } from 'hastscript';
// eslint-disable-next-line n/no-deprecated-api
import { resolve } from 'url';
import * as helpers from '../helpers.js';

const head = (api) => {
  const elements = [
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
  ];
  return h('head', elements);
};

const errorBox = (error) => {
  if (error && error.message)
    return h('div', { id: 'error', class: 'subtitle' }, [
      h('span', error.message),
    ]);
  return [];
};

const createTemplate =
  (api) =>
  ({ params, error }) => {
    if (!params) params = {};
    const body = [
      h('form', { id: 'page', action: './calendar', method: 'GET' }, [
        h('div#header', [h('h1', 'Preiskalender')]),
        h('div', { id: 'success', class: 'subtitle' }, [
          h(
            'div',
            'Finde den günstigsten Preis innerhalb der nächsten Wochen.'
          ),
          h(
            'div',
            { class: 'note' },
            "So funktioniert's: Die Tickets sind meist günstiger, weil Routen über Ungarn und die Ticketsuche der Ungarischen Staatsbahn MÁV genutzt werden. Damit kannst du wie üblich auch nur in Deutschland oder anderen Ländern fahren – auf dem Ticket steht lediglich, dass du über Ungarn fährst."
          ),
          h(
            'div',
            { class: 'note' },
            'Die Suche ist aktuell noch recht langsam (30-60 Sekunden). Hab ein wenig Geduld, es lohnt sich.'
          ),
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
            }),
          ]),
          h('div', { id: 'destination', class: 'station' }, [
            h('span', 'An'),
            h('input', {
              id: 'destinationInput',
              name: 'destination',
              type: 'text',
              value: params.destination ? params.destination.name : '',
              placeholder: api.settings.destinationPlaceholder,
              size: 1,
            }),
          ]),
          h('div#go', [
            h('input', {
              id: 'submit',
              name: 'submit',
              type: 'submit',
              value: 'Suchen',
            }),
          ]),
        ]),
        h('div#options', api.options.input(params)),
      ]),
      h('div#footer', [
        h('a', { id: 'faq', href: './faq' }, 'FAQ'),
        h('span', ' – '),
        h('a', { id: 'imprint', href: './imprint' }, 'Rechtliches'),
      ]),
    ];

    for (const script of api.settings.scripts) {
      body.push(h('script', { src: resolve('/assets/scripts/', script) }));
    }

    const document = helpers.toHtmlString([head(api), h('body', body)]);
    return document;
  };

export default createTemplate;
