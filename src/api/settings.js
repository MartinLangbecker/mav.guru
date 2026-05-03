import { h } from 'hastscript';

const settings = {
  title: 'mav.guru – Bestpreissuche',
  description:
    'Finde die günstigsten Sparpreise der Ungarischen Bahn (MÁV) für deine Verbindung. 🚅',
  timezone: 'Europe/Budapest',
  scripts: ['bahn.js'],
  styles: ['bahn.css'],
  icon: 'bahn.png',
  ogTitle: 'mav.guru – MÁV-Bestpreissuche',
  ogDescription:
    'Finde die günstigsten Sparpreise der Ungarischen Bahn (MÁV) für deine Verbindung. 🚅',
  ogImage: 'https://bahn.guru/assets/screenshot.png',
  originPlaceholder: 'Startbahnhof',
  destinationPlaceholder: 'Zielbahnhof',
  faq: [
    {
      title: 'Ist dies eine offizielle Website der Ungarischen Bahn?',
      description: [
        'Nein, mav.guru ist ein Projekt ehrenamtlicher Open-Source-Softwareentwickler. Alle Preisdaten sind daher unverbindlich. Bitte überprüfen Sie Ihre Suchergebnisse auf der Website der ',
        h('a', { href: 'https://jegy.mav.hu/' }, 'MÁV'),
        '.',
      ],
    },
    {
      title: 'Woher stammen die Daten?',
      description: [
        'Diese Website nutzt eine ',
        h(
          'a',
          { href: 'https://github.com/martinlangbecker/mav-prices' },
          'inoffizielle Schnittstelle',
        ),
        ' der Ungarischen Bahn (Magyar Államvasutak, MÁV).',
      ],
    },
    {
      title: 'Welche Fahrten kann ich suchen?',
      description: [
        'Es können sowohl internationale Fahrten als auch Fahrten innerhalb Ungarns gesucht werden. ',
        'Für Verbindungen außerhalb Ungarns wird automatisch über einen ungarischen Grenzbahnhof geroutet, ',
        'um Preise aus dem MÁV-System abfragen zu können (siehe nächste Frage).',
      ],
    },
    {
      title: 'Was ist "Border Routing"?',
      description: [
        'Die MÁV-API liefert nur Preise, wenn mindestens ein Endpunkt in Ungarn liegt. ',
        'Für Verbindungen außerhalb Ungarns wird daher automatisch der Grenzbahnhof Hegyeshalom als Start oder Ziel verwendet. ',
        'Die Richtung wird anhand der geografischen Nähe der Bahnhöfe zu Ungarn bestimmt.',
        h('br'),
        h('br'),
        'Beispiel: Bei "Hamburg → Wien" wird automatisch "Hamburg → Hegyeshalom (über Wien)" gesucht. ',
        'Angezeigt werden nur die relevanten Verbindungsdaten bis Wien.',
        h('br'),
        h('br'),
        'Die Buchungshinweise zeigen die vollständige Route, die auf ',
        h('a', { href: 'https://jegy.mav.hu/' }, 'jegy.mav.hu'),
        ' eingegeben werden muss.',
      ],
    },
    {
      title: 'Hast du die Software komplett selbst geschrieben?',
      description: [
        'Nein, den größten Teil habe ich von ',
        h('a', { href: 'https://bahn.guru/' }, 'bahn.guru'),
        ' kopiert und lediglich für eine andere API angepasst.',
      ],
    },
    {
      title: 'Wo finde ich den Quellcode?',
      description: [
        'Der ',
        h(
          'a',
          {
            href: 'https://github.com/martinlangbecker/mav.guru/blob/main/license',
          },
          'ISC-lizenzierte',
        ),
        ' Quellcode kann auf ',
        h(
          'a',
          { href: 'https://github.com/martinlangbecker/mav.guru' },
          'GitHub',
        ),
        ' abgerufen werden.',
      ],
    },
  ],
  greeting: null,
};
export default settings;
