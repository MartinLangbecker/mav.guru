import { h } from 'hastscript';

const optionHTML = (value, text, checked) => {
  const opt = { value };
  if (checked) opt.selected = true;
  return h('option', opt, text);
};

// Discount cards with human-readable labels (ID → label)
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

const formatMinutes = (m) => {
  const hh = String(Math.floor(m / 60)).padStart(2, '0');
  const mm = String(m % 60).padStart(2, '0');
  return `${hh}:${mm}`;
};

export const input = (params) => [
  h('span.optRow', [
    h('select', { name: 'class', id: 'class' }, [
      optionHTML(1, '1.', params.class === 1),
      optionHTML(2, '2.', params.class !== 1),
    ]),
    ' Klasse',
  ]),
  h('span.optRow', [
    'Ermäßigung: ',
    h('input', {
      type: 'text',
      name: 'bc',
      id: 'bc',
      list: 'bc-list',
      value: params.bc
        ? discountCards.find(([id]) => id === params.bc)?.[1] || ''
        : '',
      placeholder: 'keine',
      autocomplete: 'off',
    }),
    h(
      'datalist',
      { id: 'bc-list' },
      discountCards
        .filter(([id]) => id !== 0)
        .map(([, label]) => h('option', { value: label })),
    ),
  ]),
  h('span.optRow', [
    'Alter: ',
    h('input', {
      type: 'number',
      name: 'age',
      id: 'age',
      min: 0,
      max: 99,
      value: params.age,
      size: 3,
    }),
  ]),
];

export const text = (params) => {
  const result = [];
  if (params.class === 1) result.push(params.class + '. Klasse', ', ');
  if (params.bc) {
    const card = discountCards.find(([id]) => id === params.bc);
    if (card) result.push('mit ' + card[1], ', ');
  }
  if (params.age !== 30) {
    result.push(params.age + ' Jahre', ', ');
  }
  if (params.departureAfter !== null && params.departureAfter > 0)
    result.push('ab ' + formatMinutes(params.departureAfter) + ' Uhr', ', ');
  if (params.arrivalBefore !== null && params.arrivalBefore > 0)
    result.push('bis ' + formatMinutes(params.arrivalBefore) + ' Uhr', ', ');
  if (params.duration && params.duration > 0)
    result.push('Fahrzeit bis ' + params.duration + ' Stunden', ', ');
  if (params.maxChanges) {
    if (params.maxChanges === 0) result.push('keine Umstiege', ', ');
    else if (params.maxChanges === 1)
      result.push('max. ' + params.maxChanges + ' Umstieg', ', ');
    else result.push('max. ' + params.maxChanges + ' Umstiege', ', ');
  }
  if (result.length) result.pop();
  return result;
};

export const url = (params) => {
  const result = [];
  if (params.class) result.push('class=' + params.class);
  if (params.bc) result.push('bc=' + params.bc);
  if (params.age !== 30) result.push('age=' + params.age);
  if (params.departureAfter !== null)
    result.push('departureAfter=' + formatMinutes(params.departureAfter));
  if (params.arrivalBefore !== null)
    result.push('arrivalBefore=' + formatMinutes(params.arrivalBefore));
  if (params.duration) result.push('duration=' + params.duration);
  if (params.maxChanges !== null)
    result.push('maxChanges=' + params.maxChanges);
  return result;
};
