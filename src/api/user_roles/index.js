const { routes } = require('./routes');
const { UserRolesHandler } = require('./handler');

module.exports = {
  name: 'user_roles',
  version: '1.0.0',
  register: async (server, {
    userRolesService, userRolesValidator, usersService, rolesService,
  }) => {
    const userRolesHandler = new UserRolesHandler({
      userRolesService, userRolesValidator, usersService, rolesService,
    });
    server.route(routes(userRolesHandler));
  },
};