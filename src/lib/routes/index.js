import createGreetingRoute from './greeting/index.js';
import createStartRoute from './start/index.js';
import createDayRoute from './day/index.js';
import createCalendarRoute from './calendar/index.js';
import createImprintRoute from './imprint/index.js';
import createFaqRoute from './faq/index.js';
import createMavStationsRoute from './mav-stations/index.js';

const createRoutes = (api) => {
  const greetingRoute = createGreetingRoute(api);
  const startRoute = createStartRoute(api);
  const dayRoute = createDayRoute(api);
  const calendarRoute = createCalendarRoute(api);
  const imprintRoute = createImprintRoute(api);
  const faqRoute = createFaqRoute(api);
  const mavStations = createMavStationsRoute(api);
  return {
    greetingRoute,
    startRoute,
    dayRoute,
    calendarRoute,
    imprintRoute,
    faqRoute,
    mavStations,
  };
};

export default createRoutes;
