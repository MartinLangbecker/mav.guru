import { URL } from 'url';

export { default as params } from './lib/params.js';
export * as options from './lib/options.js';
export { station, stationList } from './lib/station.js';
export { default as journeys } from './lib/journeys.js';
export { default as settings } from './settings.js';

export const shopLink = (origin, destination, trick, date) => {
  const hegyeshalom = '005501362';
  let via = '';
  if (trick === 1) {
    via = origin;
    origin = hegyeshalom;
  } else if (trick === 2) {
    via = destination;
    destination = hegyeshalom;
  }

  // https://jegy.mav.hu/menetrend/viszonylati?i=008016043&e=005501362&d=2023-01-30T23:00:00.000Z&k=008101003
  const url = new URL('https://jegy.mav.hu/menetrend/viszonylati');
  url.searchParams.append('i', origin);
  url.searchParams.append('k', via);
  url.searchParams.append('e', destination);
  url.searchParams.append('d', date);
  return url.toString();
};
