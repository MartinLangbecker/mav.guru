/**
 * Border Routing
 *
 * The MÁV API only returns prices when at least one endpoint is Hungarian.
 * For non-Hungarian routes, we automatically route via the border station
 * Hegyeshalom to access MÁV pricing. The direction is determined by which
 * user station is geographically closer to Hegyeshalom:
 *
 *   0 = direct (at least one station is Hungarian)
 *   1 = Hegyeshalom as origin (user's origin is closer to Hungary)
 *   2 = Hegyeshalom as destination (user's destination is closer to Hungary)
 *
 * The user-facing display always shows only the relevant portion of the route
 * (legs are trimmed in journeys.js). Booking instructions show the full route
 * needed to purchase the ticket on jegy.mav.hu.
 */

const HEGYESHALOM = { lat: 47.7126, lng: 17.1571 };

const toRad = (deg) => (deg * Math.PI) / 180;

const haversine = (a, b) => {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h =
    sinLat * sinLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng;
  return 2 * Math.asin(Math.sqrt(h));
};

const locationOf = (station) => {
  if (!station.location) return null;
  return { lat: station.location.latitude, lng: station.location.longitude };
};

const isHungarian = (station) => station.id.startsWith('0055');

const computeTrick = (origin, destination) => {
  if (isHungarian(origin) || isHungarian(destination)) return 0;

  const originLoc = locationOf(origin);
  const destLoc = locationOf(destination);
  if (!originLoc || !destLoc) return null; // error case

  const originDist = haversine(originLoc, HEGYESHALOM);
  const destDist = haversine(destLoc, HEGYESHALOM);
  return originDist <= destDist ? 1 : 2;
};

const createParseParams = (api) => async (rawParams, opt) => {
  const { stationsOptional } = opt || {};
  const parsed = {
    params: api.params(rawParams),
    error: false,
  };

  try {
    const [origin, destination] = await Promise.all([
      api.station(rawParams.origin).catch(() => null),
      api.station(rawParams.destination).catch(() => null),
    ]);

    if (!stationsOptional && !(origin && destination)) {
      throw new Error('invalid stations');
    }

    parsed.params.origin = origin;
    parsed.params.destination = destination;

    if (origin && destination) {
      const borderRouting = computeTrick(origin, destination);
      if (borderRouting === null) {
        parsed.error = 'missing-location';
        return parsed;
      }
      parsed.params.borderRouting = borderRouting;
    }
  } catch {
    parsed.error = 'invalid-stations';
  }

  return parsed;
};

export default createParseParams;
