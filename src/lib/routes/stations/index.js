import * as helpers from '../helpers.js';

const createStationsRoute = (api) => async (req, res) => {
  const { query, limit: limitParam, excludeCountryIso: excludeParam } = req.query;
  const limit = limitParam ? Number.parseInt(limitParam) : 10;
  const searchterm = query ? helpers.cleanStr(query) : null;
  const excludeCountryIso = excludeParam ? helpers.cleanStr(excludeParam) : null;

  let stations = await api.stationList();

  // Only show rail stations (exclude bus stops)
  stations = stations.filter((station) => station.transportMode?.code !== 200);

  if (searchterm) {
    const words = searchterm.split(/\s+/);
    stations = stations.filter((station) => {
      const name = helpers.cleanStr(station.name);
      return words.every((word) => name.includes(word));
    });
  }

  if (excludeCountryIso) {
    stations = stations.filter(
      (station) => helpers.cleanStr(station.countryIso) !== excludeCountryIso
    );
  }

  res.send(stations.slice(0, limit));
};

export default createStationsRoute;
