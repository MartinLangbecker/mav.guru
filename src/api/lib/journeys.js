import { queryPrices } from 'mav-prices';
import moment from 'moment-timezone';
import settings from '../settings.js';
import isNull from 'lodash/isNull.js';

const journeys = (params, day) => {
  const dayTimestamp = +moment.tz(day, settings.timezone).startOf('day');

  // Hegyeshalom trick
  let origin, destination, via;
  const hegyeshalom = '005501362'; // station id
  if (params.trick === 1) {
    origin = hegyeshalom;
    via = params.origin.id;
    destination = params.destination.id;
  } else if (params.trick === 2) {
    origin = params.origin.id;
    via = params.destination.id;
    destination = hegyeshalom;
  } else {
    origin = params.origin.id;
    via = undefined;
    destination = params.destination.id;
  }

  return queryPrices(origin, destination, moment(day).toDate(), {
    class: params.class,
    duration: 1440,
    intermediateStations: via ? [{ stationCode: via, durationOfStay: 0 }] : [],
    travellers: [{ type: params.age, discounts: params.bc ? [params.bc] : [] }],
  })
    .then((results) =>
      results.filter((j) => {
        const departure = new Date(j.legs[0].departure);
        const arrival = new Date(j.legs[j.legs.length - 1].arrival);
        const duration = +arrival - +departure;
        const changes = j.legs.length - 1;
        return (
          (!params.duration || duration <= params.duration * 60 * 60 * 1000) &&
          (!params.departureAfter ||
            +departure >= +params.departureAfter + dayTimestamp) &&
          (!params.arrivalBefore ||
            +arrival <= +params.arrivalBefore + dayTimestamp) &&
          (isNull(params.maxChanges) || params.maxChanges >= changes) &&
          j.legs.some((l) => l.line && l.line.product !== 'BUS')
        );
      })
    )
    .then((results) => {
      for (const journey of results) {
        for (const leg of journey.legs) {
          leg.product = leg.line ? leg.line.product : null;
        }
      }
      return results;
    })
    .catch((err) => {
      console.error(err);
      return [];
    });
};

export default journeys;
