const { RolesHandler } = require('./handler');
const { routes } = require('./routes');

module.exports = {
  name: 'roles',
  version: '1.0.0',
  register: async (server, { rolesService, rolesValidator, usersService }) => {
    const rolesHandler = new RolesHandler({ rolesService, rolesValidator, usersService });
    server.route(routes(rolesHandler));
  },
};