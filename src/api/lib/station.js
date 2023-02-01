import { readStations } from 'mav-stations';

/**
 * get a station matching by name
 *
 * @param name of station
 * @returns station found by name
 */
const station = async (name) => {
  // eslint-disable-next-line prefer-promise-reject-errors
  if (!name) return Promise.reject(false);

  return new Promise((resolve, reject) => {
    const stations = readStations();
    stations
      .on('data', (station) => {
        if (station.name === name || station.aliasNames.indexOf(name) !== -1) {
          resolve(station);
          stations().removeAllListeners();
        }
      })
      .on('error', () => {
        reject('MÁV station not found');
      });
  });
};

/**
 * returns all stations
 *
 * @return list of all stations
 */
const stationList = async () => {
  // eslint-disable-next-line prefer-promise-reject-errors
  const result = [];

  return new Promise((resolve, reject) => {
    readStations()
      .on('data', (station) => result.push(station))
      .on('end', () => resolve(result))
      .on('error', () => {
        reject('MÁV station not found');
      });
  });
};

export { station, stationList };
