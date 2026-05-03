import createParseParams from '../params.js';
import createTemplate from './template.js';

const errors = {
  'no-results': {
    code: 400,
    message: 'Leider wurden für Ihre Anfrage keine Verbindungen gefunden.',
  },
  'invalid-stations': {
    code: 400,
    message: 'Bitte geben Sie einen gültigen Start- und Zielbahnhof an.',
  },
  'missing-location': {
    code: 400,
    message:
      'Für mindestens einen Bahnhof fehlen Koordinaten. Diese Verbindung wird derzeit nicht unterstützt.',
  },
  unknown: {
    code: 500,
    message:
      'Unbekannter Fehler. Bitte versuchen Sie es erneut oder kontaktieren Sie uns.',
  },
};

const createStartRoute = (api) => {
  const parseParams = createParseParams(api);
  const template = createTemplate(api);
  return async (req, res) => {
    try {
      const { params, error: paramError } = await parseParams(req.query, {
        stationsOptional: true,
      });
      params.date = req.query.date || '';
      const errorId = req.query.error || paramError;
      if (errorId) {
        const error = errors[errorId] || errors.unknown;
        return res.status(error.code).send(template({ params, error }));
      }
      return res.send(template({ params }));
    } catch {
      const error = errors.unknown;
      return res.status(error.code).send(template({ error }));
    }
  };
};

export default createStartRoute;
