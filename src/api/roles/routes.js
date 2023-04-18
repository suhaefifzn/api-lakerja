const routes = (handler) => [
  {
    method: 'POST',
    path: '/roles',
    handler: handler.postRoleHandler,
  },
  {
    method: 'GET',
    path: '/roles',
    handler: handler.getAllRolesHandler,
    options: {
      auth: 'lakerja_jwt',
    },
  },
];

module.exports = { routes };