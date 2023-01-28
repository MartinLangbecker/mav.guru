import { readStations } from 'mav-stations';

const station = async (name) => {
  // eslint-disable-next-line prefer-promise-reject-errors
  if (!name) return Promise.reject(false);

  for await (const station of readStations()) {
    if (station.name === name || station.aliasNames.indexOf(name) !== -1) {
      return Promise.resolve(station);
    } else {
      return Promise.reject(false);
    }
  }
};

export default station;
