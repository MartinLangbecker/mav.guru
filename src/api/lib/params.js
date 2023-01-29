import moment from 'moment-timezone';
// eslint-disable-next-line no-unused-vars
import mdf from 'moment-duration-format';
import isNaN from 'lodash/isNaN.js';

const parseTime = (time) => {
  if (!time) return null;
  time = time.split(':');
  if (time.length === 1) {
    const hours = +time[0];
    if (!isNaN(hours) && hours >= 0 && hours < 24)
      return moment.duration(hours, 'hours');
  }
  if (time.length === 2) {
    const hours = +time[0];
    const minutes = +time[1];
    if (
      !isNaN(hours) &&
      !isNaN(minutes) &&
      hours >= 0 &&
      hours < 24 &&
      minutes >= 0 &&
      minutes < 60
    )
      return moment.duration(60 * hours + minutes, 'minutes');
  }
  return null;
};

const parseParams = (params) => {
  // defaults
  const settings = {
    class: 2,
    bc: 0,
    age: 8,
    duration: null,
    departureAfter: null,
    arrivalBefore: null,
    maxChanges: null,
  };
  // class
  if (+params.class === 1 || +params.class === 2)
    settings.class = +params.class;
  // BahnCard
  if ([1, 3, 5].indexOf(+params.bc) !== -1) {
    settings.bc = +params.bc;
  }
  if ([...Array(9).keys()].indexOf(+params.age) !== -1) {
    settings.age = +params.age;
  }
  // duration
  if (+params.duration && +params.duration > 0 && +params.duration < 24)
    settings.duration = +params.duration;
  // departureAfter & arrivalBefore
  settings.departureAfter = parseTime(params.departureAfter);
  settings.arrivalBefore = parseTime(params.arrivalBefore);
  if (
    settings.departureAfter &&
    settings.arrivalBefore &&
    +settings.arrivalBefore.format('m') < +settings.departureAfter.format('m')
  )
    settings.arrivalBefore = null;

  // maxChanges
  const maxChanges = +params.maxChanges;
  if (
    params.maxChanges !== '' &&
    Number.isInteger(maxChanges) &&
    maxChanges >= 0
  )
    settings.maxChanges = maxChanges;

  // Hegyeshalom trick
  if ([1, 2].indexOf(+params.trick) !== -1) {
    settings.trick = +params.trick;
  }

  return settings;
};

export default parseParams;
