const routes = (handler) => [
  {
    method: 'POST',
    path: '/user-roles',
    handler: handler.postUserRoleHandler,
    options: {
      auth: 'lakerja_jwt',
    },
  },
  {
    method: 'PUT',
    path: '/user-roles',
    handler: handler.putNewUserRoleHandler,
    options: {
      auth: 'lakerja_jwt',
    },
  },
  {
    method: 'GET',
    path: '/user-roles/{userId}',
    handler: handler.getUserRoleIdHandler,
    options: {
      auth: 'lakerja_jwt',
    },
  },
];

module.exports = { routes };