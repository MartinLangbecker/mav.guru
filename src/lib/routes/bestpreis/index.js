import createParseParams from '../params.js';
import createTemplate from './template.js';

const createForwardError = (req, next) => (code) => {
  req.query.error = code;
  next();
};

const parseDate = (date) => {
  if (!date) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }
  if (date.includes('-')) {
    const [yyyy, mm, dd] = date.split('-');
    return new Date(+yyyy, +mm - 1, +dd);
  }
  const [dd, mm, yyyy] = date.split('.');
  return new Date(+yyyy, +mm - 1, +dd);
};

const createBestpreisRoute = (api) => {
  const parseParams = createParseParams(api);
  const template = createTemplate(api);
  return async (req, res, next) => {
    const forwardError = createForwardError(req, next);
    try {
      const { params, error } = await parseParams(req.query);
      if (error) return forwardError(error);

      params.date = parseDate(req.query.date);

      const results = await api.journeys(params, params.date);
      const withPrices = results.filter((journey) => journey.price.amount);

      if (!withPrices.length) return forwardError('no-results');

      withPrices.sort((a, b) => a.price.amount - b.price.amount);

      return res.send(template({ input: params, results: withPrices }));
    } catch (err) {
      console.error(err);
      return forwardError('unknown');
    }
  };
};

export default createBestpreisRoute;
