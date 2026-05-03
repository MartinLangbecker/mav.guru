import { readStations } from 'mav-stations';

let stationsCache = null;

const loadStations = async () => {
  if (stationsCache) return stationsCache;
  const result = [];
  for await (const station of readStations()) {
    result.push(station);
  }
  stationsCache = result;
  return result;
};

const station = async (name) => {
  if (!name) return null;
  const stations = await loadStations();
  return stations.find(
    (entry) => entry.name === name || (entry.aliasNames && entry.aliasNames.includes(name))
  ) || null;
};

const stationList = async () => loadStations();

export { station, stationList };
