const parseTime = (time) => {
  if (!time) return null;
  // Handle colon-separated input
  if (time.includes(':')) {
    const [h, m] = time.split(':').map(Number);
    if (
      !Number.isNaN(h) &&
      !Number.isNaN(m) &&
      h >= 0 &&
      h < 24 &&
      m >= 0 &&
      m < 60
    )
      return h * 60 + m;
    return null;
  }
  // Handle bare number: 1-2 digits = hours, 3-4 digits = HHMM
  const num = +time;
  if (Number.isNaN(num) || num < 0) return null;
  if (time.length <= 2) {
    if (num >= 0 && num < 24) return num * 60;
  } else {
    const minutes = num % 100;
    const hours = Math.floor(num / 100);
    if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60)
      return hours * 60 + minutes;
  }
  return null;
};

const discountCards = [
  [0, '--'],
  [1, 'BahnCard 25 (DE)'],
  [3, 'BahnCard 50 (DE)'],
  [5, 'BahnCard 100 (DE)'],
  [8, 'Vorteilscard (AT)'],
  [11, 'Klimaticket (AT)'],
  [12, 'Österreichcard (AT)'],
  [9, 'Generalabonnement (CH)'],
  [10, 'Halbtaxabonnement (CH)'],
  [13, 'SwissPass 50% (CH)'],
  [14, 'SwissPass 100% (CH)'],
  [15, 'MAXI KLASIK (CZ/SK)'],
  [16, 'InKarta 25 (CZ/SK)'],
  [17, 'InKarta 50 (CZ/SK)'],
  [18, 'InKarta 100 (CZ/SK)'],
  [19, 'START Klub (HU)'],
  [22, 'Interrail/Eurail-Pass'],
  [25, 'Eisenbahner-Ausweis (HU)'],
  [26, 'FIP-Freifahrtschein'],
  [27, 'FIP-Freifahrtschein (Einzelland)'],
  [28, 'FIP-Ausweis'],
  [31, 'FIP-Ausweis 1. Klasse (HU)'],
  [32, 'Országbérlet (HU)'],
  [33, 'MagyarOrszág24 (HU)'],
];

const resolveDiscount = (input) => {
  if (!input || input === '--') return 0;
  // Try as numeric ID first
  const num = +input;
  if (!Number.isNaN(num) && discountCards.some(([id]) => id === num))
    return num;
  // Try as label match (case-insensitive)
  const lower = input.toLowerCase();
  const match = discountCards.find(
    ([, label]) => label.toLowerCase() === lower,
  );
  return match ? match[0] : 0;
};

const parseParams = (params) => {
  const settings = {
    class: 2,
    bc: 0,
    age: 30,
    duration: null,
    departureAfter: null,
    arrivalBefore: null,
    maxChanges: null,
  };

  if (+params.class === 1 || +params.class === 2)
    settings.class = +params.class;

  if ([1, 3, 5].includes(+params.bc)) settings.bc = +params.bc;
  else settings.bc = resolveDiscount(params.bc);

  const age = +params.age;
  if (!Number.isNaN(age) && age >= 0 && age <= 99) settings.age = age;

  if (+params.duration && +params.duration > 0 && +params.duration <= 24)
    settings.duration = +params.duration;

  settings.departureAfter = parseTime(params.departureAfter);
  settings.arrivalBefore = parseTime(params.arrivalBefore);
  if (
    settings.departureAfter !== null &&
    settings.arrivalBefore !== null &&
    settings.arrivalBefore < settings.departureAfter
  )
    settings.arrivalBefore = null;

  const maxChanges = +params.maxChanges;
  if (
    params.maxChanges !== '' &&
    Number.isInteger(maxChanges) &&
    maxChanges >= 0
  )
    settings.maxChanges = maxChanges;

  return settings;
};

export default parseParams;
