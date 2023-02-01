'use strict'

const addAutocomplete = require('./common')

const mavStationsApi = {
  url: '/mav-stations',
  query: {
    limit: 5,
    excludeCountryIso: 'HU',
  },
  adapter: res => res.map(e => e.name),
}

addAutocomplete(mavStationsApi)
