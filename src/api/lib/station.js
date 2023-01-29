import { readStations } from 'mav-stations';

const station = async (name) => {
  // eslint-disable-next-line prefer-promise-reject-errors
  if (!name) return Promise.reject(false);

  return new Promise((resolve, reject) => {
    const stations = readStations;
    stations().on('data', (station) => {
      if (station.name === name || station.aliasNames.indexOf(name) !== -1) {
        resolve(station);
        stations().removeAllListeners();
      }
    });
    stations().on('end', () => {
      reject('MÁV station not found');
    });
  });
};

export default station;
