import * as helpers from '../helpers.js';

const formatResult = (result) =>
  Object.assign(result, {
    formattedPrice: helpers.formatPrice(result.price.amount),
  });

const markCheapest = (results) => {
  if (!results) return null;
  // add handy short-hand attributes like "duration"
  for (const journey of results) {
    const departure = new Date(journey.legs[0].departure);
    const arrival = new Date(journey.legs[journey.legs.length - 1].arrival);
    const duration = +arrival - +departure;
    journey.duration = duration;
  }
  // Find cheapest journey(s)
  let cheapest = null;
  for (const journey of results) {
    if (
      journey.formattedPrice &&
      (!cheapest || +journey.formattedPrice.euros < cheapest)
    )
      cheapest = +journey.formattedPrice.euros;
  }
  // Mark cheapest journey(s)
  for (const journey of results) {
    if (journey.formattedPrice)
      journey.cheapest = +journey.formattedPrice.euros === cheapest;
  }
  return results;
};

const day = (api, params) => {
  return api
    .journeys(params, params.date)
    .then((results) => results.filter((r) => r.price.amount))
    .then((results) => markCheapest(results.map(formatResult)))
    .catch((err) => {
      console.log(err);
      return null;
    });
};

export default day;
