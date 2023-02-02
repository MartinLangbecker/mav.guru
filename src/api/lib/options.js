import { h } from 'hastscript';
import isNull from 'lodash/isNull.js';

const optionHTML = (value, text, checked) => {
  const opt = { value };
  if (checked) opt.selected = true;
  return h('option', opt, text);
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
    'BahnCard: ',
    h('select', { name: 'bc', id: 'bc' }, [
      optionHTML(0, '--', params.bc === 0),
      optionHTML(1, '25', params.bc === 1),
      optionHTML(3, '50', params.bc === 3),
      optionHTML(5, '100', params.bc === 5),
    ]),
  ]),
  h('span.optRow', [
    'Alter: ',
    h('select', { name: 'age', id: 'age' }, [
      optionHTML(0, '0-4', params.age === 0),
      optionHTML(1, '4-6', params.age === 1),
      optionHTML(2, '6-12', params.age === 2),
      optionHTML(3, '12-14', params.age === 3),
      optionHTML(4, '14-15', params.age === 4),
      optionHTML(5, '15-16', params.age === 5),
      optionHTML(6, '16-18', params.age === 6),
      optionHTML(7, '18-26', params.age === 7),
      optionHTML(8, '26+', params.age === 8),
    ]),
  ]),
  h('span.optRow', [
    h('label#departureAfter', [
      'ab: ',
      h('input', {
        type: 'text',
        placeholder: '--:--',
        value: params.departureAfter
          ? params.departureAfter.format('hh:mm')
          : '',
        name: 'departureAfter',
      }),
      ' Uhr',
    ]),
  ]),
  h('span.optRow', [
    h('label#arrivalBefore', [
      'bis: ',
      h('input', {
        type: 'text',
        placeholder: '--:--',
        value: params.arrivalBefore ? params.arrivalBefore.format('hh:mm') : '',
        name: 'arrivalBefore',
      }),
      ' Uhr',
    ]),
  ]),
  h('span.optRow', [
    'max. ',
    h('label#duration', [
      h('input', {
        type: 'text',
        placeholder: 24,
        value: params.duration || '',
        name: 'duration',
      }),
      ' h Fahrzeit',
    ]),
  ]),
  h('span.optRow', [
    'max. ',
    h('label#maxChanges', [
      h('input', {
        type: 'text',
        placeholder: '∞',
        value:
          Number.isInteger(params.maxChanges) && params.maxChanges >= 0
            ? params.maxChanges
            : '',
        name: 'maxChanges',
      }),
      ' Umstiege',
    ]),
  ]),
  h('span.optRow', [
    'Ungarn-Trick: ',
    h('select', { name: 'trick', id: 'trick' }, [
      optionHTML(0, '--', params.trick === 0),
      optionHTML(1, 'Ungarn als Start', !params.trick || params.trick === 1),
      optionHTML(2, 'Ungarn als Ziel', params.trick === 2),
    ]),
  ]),
];

export const text = (params) => {
  const result = [];
  if (params.class === 1) result.push(params.class + '. Klasse', ', ');
  if (params.bc) {
    if (params.bc === 1) result.push('mit BahnCard 25', ', ');
    if (params.bc === 3) result.push('mit BahnCard 50', ', ');
    if (params.bc === 5) result.push('mit BahnCard 100', ', ');
  }
  if (params.age) {
    if (params.age === 0) result.push('0-4 Jahre', ', ');
    if (params.age === 1) result.push('4-6 Jahre', ', ');
    if (params.age === 2) result.push('6-12 Jahre', ', ');
    if (params.age === 3) result.push('12-14 Jahre', ', ');
    if (params.age === 4) result.push('14-15 Jahre', ', ');
    if (params.age === 5) result.push('15-16 Jahre', ', ');
    if (params.age === 6) result.push('16-18 Jahre', ', ');
    if (params.age === 7) result.push('18-26 Jahre', ', ');
  }
  if (params.departureAfter && +params.departureAfter > 0)
    result.push('ab ' + params.departureAfter.format('HH:mm') + ' Uhr', ', ');
  if (params.arrivalBefore && +params.arrivalBefore > 0)
    result.push('bis ' + params.arrivalBefore.format('HH:mm') + ' Uhr', ', ');
  if (params.duration && params.duration > 0)
    result.push('Fahrzeit bis ' + params.duration + ' Stunden', ', ');
  if (params.maxChanges) {
    if (params.maxChanges === 0) result.push('keine Umstiege', ', ');
    else if (params.maxChanges === 1)
      result.push('max. ' + params.maxChanges + ' Umstieg', ', ');
    else result.push('max. ' + params.maxChanges + ' Umstiege', ', ');
  }
  if (params.trick) {
    if (params.trick === 1) result.push('Ungarn als Start', ', ');
    if (params.trick === 2) result.push('Ungarn als Ziel', ', ');
  }
  if (result.length) result.pop();
  return result;
};

export const url = (params) => {
  const result = [];
  if (params.class) result.push('class=' + params.class);
  if (params.bc) result.push('bc=' + params.bc);
  if (params.age) result.push('age=' + params.age);
  if (params.departureAfter)
    result.push('departureAfter=' + params.departureAfter.format('HH:mm'));
  if (params.arrivalBefore)
    result.push('arrivalBefore=' + params.arrivalBefore.format('HH:mm'));
  if (params.duration) result.push('duration=' + params.duration);
  if (!isNull(params.maxChanges))
    result.push('maxChanges=' + params.maxChanges);
  if (params.trick) result.push('trick=' + params.trick);
  return result;
};
