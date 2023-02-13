import * as helpers from '../helpers.js';

/**
 * get train stations from mav-stations API
 *
 * @param api mav-station API
 * @returns list of matching stations
 */
const createStationsRoute = (api) => async (req, res, next) => {
  const params = req.query;
  // default result limit is 10
  const limit = params.limit ? Number.parseInt(params.limit) : 10;
  const searchterm = params.query ? helpers.cleanStr(params.query) : undefined;
  const excludeCountryIso = params.excludeCountryIso
    ? helpers.cleanStr(params.excludeCountryIso)
    : undefined;

  await api.stationList().then((result) => {
    // filter search term
    if (searchterm && searchterm.length) {
      result = result.filter((station) =>
        helpers.cleanStr(station.name).includes(searchterm)
      );
    }

    // filter country
    if (excludeCountryIso && excludeCountryIso.length) {
      result = result.filter(
        (station) => helpers.cleanStr(station.countryIso) !== excludeCountryIso
      );
    }

    // limit result
    result = result.slice(0, limit);

    res.send(result);
  });
};

export default createStationsRoute;
