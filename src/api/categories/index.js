const { routes } = require('./routes');
const { CategoriesHandler } = require('./handler');

module.exports = {
  name: 'categories',
  version: '1.0.0',
  register: async (server, {
    categoriesService, categoriesValidator, usersService,
  }) => {
    const categoriesHandler = new CategoriesHandler({
      categoriesService, categoriesValidator, usersService,
    });
    server.route(routes(categoriesHandler));
  },
};