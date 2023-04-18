const { routes } = require('./routes');
const { AuthenticationsHandler } = require('./handler');

module.exports = {
  name: 'authentications',
  version: '1.0.0',
  register: async (server, {
    authenticationsService,
    authenticationsValidator,
    usersService,
    tokenManager,
  }) => {
    const authenticationsHandler = new AuthenticationsHandler({
      authenticationsService,
      authenticationsValidator,
      usersService,
      tokenManager,
    });
    server.route(routes(authenticationsHandler));
  },
};