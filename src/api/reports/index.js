const { routes } = require('./routes');
const { ReportsHandler } = require('./handler');

module.exports = {
  name: 'reports',
  version: '1.0.0',
  register: async (server, {
    reportsService, reportsValidator, usersService, categoriesService,
  }) => {
    const reportsHandler = new ReportsHandler({
      reportsService, reportsValidator, usersService, categoriesService,
    });
    server.route(routes(reportsHandler));
  },
};