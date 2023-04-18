/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();

// config and helper
const config = require('./utils/config');

// exceptions
const { ClientError } = require('./exceptions/ClientError');

// hapi
const hapi = require('@hapi/hapi');
const jwt = require('@hapi/jwt');

// users plugin
const users = require('./api/users');
const { UsersValidator } = require('./validator/users');
const { UsersService } = require('./services/mongodb/UsersService');

// authentications plugin
const authentications = require('./api/authentications');
const { AuthenticationsService } = require('./services/mongodb/AuthenticationsService');
const { AuthenticationsValidator } = require('./validator/authentications');
const { TokenManager } = require('./tokenize/TokenManager');

// roles plugin
const roles = require('./api/roles');
const { RolesService } = require('./services/mongodb/RolesService');
const { RolesValidator } = require('./validator/roles');

// user roles plugin
const userRoles = require('./api/user_roles');
const { UserRolesService } = require('./services/mongodb/UserRolesService');
const { UserRolesValidator } = require('./validator/user_roles');

// categories of report plugin
const categories = require('./api/categories');
const { CategoriesService } = require('./services/mongodb/CategoriesService');
const { CategoriesValidator } = require('./validator/categories');

// reports plugin
const reports = require('./api/reports');
const { ReportsService } = require('./services/mongodb/ReportsService');
const { ReportsValidator } = require('./validator/reports');

const init = async () => {
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const rolesService = new RolesService();
  const userRolesService = new UserRolesService();
  const categoriesService = new CategoriesService();
  const reportsService = new ReportsService();

  const server = hapi.server({
    port: config.app.port || '5000',
    host: config.app.host || 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // register mongodb plugin
  await server.register([
    {
      plugin: jwt,
    },
    {
      plugin: require('hapi-mongodb'),
      options: {
        url: config.db.client,
        settings: {
          maxPoolSize: 100,
          useUnifiedTopology: true,
        },
        decorate: true,
      },
    },
  ]);

  // JWT authentications strategy
  server.auth.strategy('lakerja_jwt', 'jwt', {
    keys: config.token.access,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: config.token.age,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  // register other plugins
  await server.register([
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        usersService,
        authenticationsService,
        tokenManager: TokenManager,
        authenticationsValidator: AuthenticationsValidator,
      },
    },
    {
      plugin: roles,
      options: {
        rolesService,
        usersService,
        rolesValidator: RolesValidator,
      },
    },
    {
      plugin: userRoles,
      options: {
        usersService,
        rolesService,
        userRolesService,
        userRolesValidator: UserRolesValidator,
      },
    },
    {
      plugin: categories,
      options: {
        usersService,
        categoriesService,
        categoriesValidator: CategoriesValidator,
      },
    },
    {
      plugin: reports,
      options: {
        reportsService,
        usersService,
        categoriesService,
        reportsValidator: ReportsValidator,
      },
    },
  ]);

  // error handling
  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: response.message,
        }).code(response.statusCode);
      }

      if (!response.isServer) {
        return h.continue;
      }

      return h.response({
        status: 'fail',
        message: 'Oops maaf, telah terjadi kesalahan pada server.',
      }).code(500);
    }

    return h.continue;
  });

  await server.start();

  console.log(`Server berjalan di ${server.info.uri}`);
};

init();