const createParseParams = (api) => async (rawParams, opt) => {
  const { stationsOptional } = opt || {};
  const parsed = {
    params: api.params(rawParams),
    error: false,
  };

  try {
    const [origin, destination] = await Promise.all([
      // eslint-disable-next-line n/handle-callback-err
      api.station(rawParams.origin).catch((_) => null),
      // eslint-disable-next-line n/handle-callback-err
      api.station(rawParams.destination).catch((_) => null),
    ]);
    if (!stationsOptional && !(origin && destination))
      throw new Error('invalid stations');

    parsed.params.origin = origin;
    parsed.params.destination = destination;
  } catch (error) {
    parsed.error = 'invalid-stations';
  }

  return parsed;
};

export default createParseParams;
