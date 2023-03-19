'use strict';

const addAutocomplete = require('./common');

const mavStationsApi = {
  url: '/stations',
  query: {
    limit: 5,
    // excludeCountryIso: 'HU', // exclude countries in suggest
  },
  adapter: (res) => res.map((e) => e.name),
};

addAutocomplete(mavStationsApi);
