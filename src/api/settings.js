import { h } from 'hastscript';

const settings = {
  title: 'Bahn-Preiskalender',
  description:
    'Der Bahn-Guru hilft dir dabei, die günstigsten Sparpreise der Ungarischen Bahn (MÁV) zu finden. 🚅',
  // analyticsId: '8b11a68a-f01c-4019-a4d2-1033ca10bc16',
  timezone: 'Europe/Berlin',
  scripts: ['./bundle/bahn.js'],
  styles: ['./bahn.css'],
  icon: './bahn.png',
  ogTitle: 'bahn.guru - der Bahn-Preiskalender',
  ogDescription:
    'Der Bahn-Guru hilft dir dabei, die günstigsten Sparpreise der Ungarischen Bahn (MÁV) zu finden. 🚅',
  ogImage: 'https://bahn.guru/assets/screenshot.png',
  originPlaceholder: 'Startbahnhof',
  destinationPlaceholder: 'Zielbahnhof',
  shopLinkTitle: 'zum Bahn-Shop',
  faq: [
    {
      title: 'Ist dies eine offizielle Website der Ungarischen Bahn?',
      description: [
        'Nein, der Bahn-Guru ist ein Projekt ehrenamtlicher Open-Source-Softwareentwickler. Alle Preisdaten sind daher unverbindlich. Bitte überprüfen Sie Ihre Suchergebnisse auf der Website der ',
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
          'inoffizielle Schnittstelle'
        ),
        ' der Ungarischen Bahn (Magyar Államvasutak, MÁV). Kurzgefasst: Wie Scraping, nur mit weniger Aufwand und Traffic für alle Beteiligten.',
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
          'ISC-lizenzierte'
        ),
        ' Quellcode kann auf ',
        h(
          'a',
          { href: 'https://github.com/martinlangbecker/mav.guru' },
          'GitHub'
        ),
        ' abgerufen werden.',
      ],
    },
  ],
  greeting: null,
};
export default settings;
