# mav.guru

This project aims to copy [bahn.guru](https://bahn.guru) and adapt it to the price API of [Magyar Államvasutak](https://jegy.mav.hu/) (MÁV, Hungarian State Railways).

![ISC-licensed](https://img.shields.io/github/license/martinlangbecker/mav-stations.svg)
[![Contact me](https://img.shields.io/badge/contact-email-turquoise)](mailto:martin.langbecker@gmail.com)

Screenshot of bahn.guru:

[![bahn.guru](https://i.imgur.com/bJmvAJp.png)](https://bahn.guru)

## Installation

This project uses [pnpm](https://pnpm.io/) as a package manager. If you already have npm, you can install pnpm by running:

```shell
npm install -g pnpm
```

Then, in the root directory of this project, run:

```shell
pnpm install

// on Windws systems, run:
pnpm run build-windows

// otherwise, run:
pnpm run build
```

## Usage

You can start the software by running:

```shell
// on Windws systems, run:
pnpm run start-windows

// otherwise, run:
pnpm run start
```

It will be served to [localhost:3000](http://localhost:3000/) which you can open in your favorite browser.

## TODOs

- improve shop link
- optimize search time by passing parameters for departure & arrival time & max. changes
- add additional discount cards (see mav-prices)
- fix formatting for start & end time (add colon if missing)
- search form: show loading indicator on submit

## See also

- [mav-prices](https://github.com/martinlangbecker/mav-prices#mav-prices) – Find journey prices using the MAV API.
- [travel-price-map](https://github.com/juliuste/travel-price-map/) – Map of low-cost tickets ("Sparpreise") for several european cities

## Contributing

If you found a bug or want to propose a feature, feel free to visit [the issues page](https://github.com/martinlangbecker/mav.guru/issues).
