import { queryPrices } from 'mav-prices';
import settings from '../settings.js';

const startOfDayInTz = (date, tz) => {
  const str = date.toLocaleDateString('sv-SE', { timeZone: tz });
  return new Date(`${str}T00:00:00`).getTime();
};

const journeys = async (params, day) => {
  const dayDate = day instanceof Date ? day : new Date(day);
  const dayTimestamp = startOfDayInTz(dayDate, settings.timezone);

  // Border routing — route via Hegyeshalom for non-Hungarian connections
  const hegyeshalom = '005501362';
  let origin, destination, via;

  if (params.borderRouting === 1) {
    origin = hegyeshalom;
    via = params.origin.id;
    destination = params.destination.id;
  } else if (params.borderRouting === 2) {
    origin = params.origin.id;
    via = params.destination.id;
    destination = hegyeshalom;
  } else {
    origin = params.origin.id;
    destination = params.destination.id;
    via = undefined;
  }

  // Optimize search window: narrow departure time and duration
  const departureMinutes = params.departureAfter ?? 0;
  const arrivalMinutes = params.arrivalBefore ?? 1440;
  const searchDuration = arrivalMinutes - departureMinutes;
  const searchDate = new Date(dayTimestamp + departureMinutes * 60 * 1000);

  try {
    const results = await queryPrices(origin, destination, searchDate, {
      class: params.class,
      duration: searchDuration,
      directConnection: params.maxChanges === 0,
      intermediateStations: via
        // TODO: revert to durationOfStay: 0 once mav-prices exposes intermediate
        // stops. The 10-min layover forces the API to split legs at the via station
        // so trimming works, but may alter search results slightly.
        ? [{ stationCode: via, durationOfStay: 10 }]
        : [],
      travellers: [
        { age: params.age, discounts: params.bc ? [params.bc] : [] },
      ],
    });

    // Trim legs for border routing, then filter
    const hegyeshalomId = '005501362';
    // Product name mapping (Hungarian → standard abbreviations)
    const productMap = {
      személyvonat: 'Sz',
      'regionális vonat': 'RB',
      sebesvonat: 'S',
      gyorsvonat: 'Gy',
      InterCity: 'IC',
      EuroCity: 'EC',
      EuroNight: 'EN',
      'railjet xpress': 'RJX',
      railjet: 'RJ',
      rjx: 'RJX',
      rj: 'RJ',
      Sz: 'Sz',
      R: 'R',
      'Pótló': 'SEV',
    };

    for (const journey of results) {
      for (const leg of journey.legs) {
        const raw = leg.line ? leg.line.product : null;
        leg.product = (raw && productMap[raw]) || raw;
      }
      if (params.borderRouting === 1) {
        // Query: Hegyeshalom → dest via userOrigin
        // Find the user's origin station in the legs by name prefix and cut before it.
        const viaName = params.origin.name.replace(/\*$/, '').toLowerCase();
        let cutAt = 0;
        for (let i = 0; i < journey.legs.length; i++) {
          if (journey.legs[i].origin.name.toLowerCase().startsWith(viaName)) {
            cutAt = i;
            break;
          }
        }
        if (cutAt > 0) {
          journey.legs = journey.legs.slice(cutAt);
        }
      } else if (params.borderRouting === 2) {
        // Query: origin → Hegyeshalom via userDest
        // The via station (user's destination) may be a meta-station (e.g. MÜNCHEN*)
        // that resolves to a real station (e.g. München Hbf) in the legs.
        // Match by name prefix (strip trailing *) to find the cutoff point.
        // Check both leg.destination and leg.origin (next leg) since the via
        // station may be a through-stop that doesn't terminate a leg.
        const viaName = params.destination.name
          .replace(/\*$/, '')
          .toLowerCase();
        const viaId = params.destination.id;
        let cutAt = journey.legs.length;
        for (let i = 0; i < journey.legs.length; i++) {
          const leg = journey.legs[i];
          if (
            leg.destination.name.toLowerCase().startsWith(viaName) ||
            leg.destination.id === viaId
          ) {
            cutAt = i + 1;
            break;
          }
          // Via station is origin of next leg (transfer there)
          if (
            leg.origin.name.toLowerCase().startsWith(viaName) ||
            leg.origin.id === viaId
          ) {
            cutAt = i;
            break;
          }
        }
        // If no match found by endpoints, the via is a mid-leg through-stop.
        // In that case, find the leg that spans the via station: it departs
        // before the via and arrives after. We keep up to and including that leg.
        if (cutAt === journey.legs.length && journey.legs.length > 1) {
          for (let i = 0; i < journey.legs.length; i++) {
            const nextLeg = journey.legs[i + 1];
            if (
              nextLeg &&
              (nextLeg.origin.name.toLowerCase().startsWith(viaName) ||
                nextLeg.origin.id === viaId)
            ) {
              cutAt = i + 1;
              break;
            }
          }
        }
        if (cutAt < journey.legs.length) {
          journey.legs = journey.legs.slice(0, cutAt);
        }
      }
    }

    const filtered = results.filter((journey) => {
      if (!journey.legs.length) return false;
      const departure = new Date(journey.legs[0].departure);
      const arrival = new Date(journey.legs[journey.legs.length - 1].arrival);
      const duration = +arrival - +departure;
      const changes =
        journey.legs.filter((leg) => leg.mode !== 'walking').length - 1;
      return (
        (!params.duration || duration <= params.duration * 60 * 60 * 1000) &&
        (params.departureAfter === null ||
          +departure >= params.departureAfter * 60 * 1000 + dayTimestamp) &&
        (params.arrivalBefore === null ||
          +arrival <= params.arrivalBefore * 60 * 1000 + dayTimestamp) &&
        (params.maxChanges === null || params.maxChanges >= changes) &&
        journey.legs.some((leg) => leg.line && leg.line.product !== 'BUS')
      );
    });

    return filtered;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export default journeys;
