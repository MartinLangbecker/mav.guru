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
  ogTitle: 'mav.guru - der MÁV-Preiskalender',
  ogDescription:
    'Der MÁV-Guru hilft dir dabei, die günstigsten Sparpreise der Ungarischen Bahn (MÁV) zu finden. 🚅',
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
    {
      title: 'Was ist der "Hegyeshalom-Trick"?',
      description: [
        'Bei der ungarischen Bahn lassen sich nur Tickets buchen, wenn sich mindestens der Start- oder Zielbahnhof in Ungarn befinden. ',
        'Diese Regel kann man gewissermaßen umgehen, indem man im Vor- bzw. Nachlauf zur eigentlich geplanten Fahrt eine Verbindung nach Ungarn anfragt. ',
        'Aus Westeuropa kommend bietet sich hier Hegyeshalom an, welches ein Grenzbahnhof in der nordwestlichsten Ecke Ungarns ist. ',
        h('br'),
        h('br'),
        'In der Vergangenheit war es so möglich, mittels des Angebots "Start Europa" an sehr günstige Tickets zu gelangen. ',
        'Mittlerweile ist es eher eine Notwendigkeit, um Ticketpreise für Verbindungen ermitteln zu können, welche nicht von oder nach Ungarn verlaufen.',
        h('br'),
        h('br'),
        'Beispiel: Bei der Verbindung "Hamburg Hbf - Wien Hbf" mit "Hegyeshalom-Tick: Ende" wird eine Verbindungssuche für "Hamburg Hbf - Hegyeshalom" mit Zwischenhalt Wien Hbf gestartet.',
      ],
    },
  ],
  greeting: null,
};
export default settings;
