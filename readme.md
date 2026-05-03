# mav.guru

Find the cheapest [MÁV](https://jegy.mav.hu/) (Hungarian State Railways) ticket prices for any connection and date.

Search origin → destination + date, get all available prices sorted cheapest-first with booking instructions.

![ISC-licensed](https://img.shields.io/github/license/martinlangbecker/mav-stations.svg)
[![Contact me](https://img.shields.io/badge/contact-email-turquoise)](mailto:martin.langbecker@gmail.com)

## Features

- **Best price search** — single-day price search, all results sorted by price
- **Automatic border routing** — non-Hungarian routes are automatically routed via Hegyeshalom to access MÁV pricing (no manual configuration needed)
- **Filters** — departure/arrival time, max changes, max travel time
- **Options** — travel class, age, discount cards (BahnCard, Vorteilscard, Klimaticket, etc.)
- **Booking instructions** — shows exactly what to enter on jegy.mav.hu

## Installation

Requires Node.js >= 22.

```shell
npm install
```

## Usage

```shell
# development (auto-reload on changes)
npm run dev

# production
npm start
```

Served at [localhost:3000](http://localhost:3000/).

## How border routing works

The MÁV API only returns prices when at least one endpoint is a Hungarian station. For connections outside Hungary (e.g. Hamburg → Wien), the app automatically routes via the border station Hegyeshalom. The direction is determined by geographic proximity — whichever station is closer to Hungary becomes the "Hungarian end" of the search.

Displayed results show only the user's actual journey. Booking instructions show the full route needed to purchase the ticket.

## Important notes

- Only connections for which MÁV can determine a price are shown. Not all connections may be known to the MÁV system, and some known connections may not have prices available.
- All prices are non-binding suggestions. Booking happens on [jegy.mav.hu](https://jegy.mav.hu/) — final prices may differ.

## TODOs

- Cache eviction: add max size / LRU to prevent unbounded memory growth
- Station search ranking: exact match first, then starts-with, then contains; prioritize major stations
- Dynamic border station selection (not just Hegyeshalom)
- Multi-tariff search (border routing on both ends for different country fares)
- DB price comparison
- Integrate mav-booking to automate booking flow

## See also

- [mav-prices](https://github.com/martinlangbecker/mav-prices#mav-prices) – Find journey prices using the MÁV API.
- [mav-stations](https://github.com/martinlangbecker/mav-stations) – Station dataset with 36,400+ stations.
- [mav-booking](https://github.com/martinlangbecker/mav-booking) – CLI booking tool for MÁV.

## Contributing

If you found a bug or want to propose a feature, feel free to visit [the issues page](https://github.com/martinlangbecker/mav.guru/issues).
