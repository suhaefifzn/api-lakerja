const { ClientError } = require('../exceptions/ClientError');
const { InvariantError } = require('../exceptions/InvariantError');
const config = require('./config');

module.exports = {
  user: {
    hasRole: async (request, userId) => {
      const result = await request.mongo.db.collection('user_roles')
        .findOne({ user_id: userId });

      if (!result) {
        throw new InvariantError('User belum memiliki role');
      }
    },
    isAdmin: async (request, userId) => {
      const userRole = await request.mongo.db.collection('user_roles')
        .findOne({ user_id: userId });

      if (!userRole) {
        throw new InvariantError('User belum memiliki role');
      }

      const role = await request.mongo.db.collection('roles')
        .findOne({ _id: userRole.role_id });

      if (role.level !== config.user.level.admin) {
        throw new ClientError('Akses dilarang', 403);
      }
    },
    notEmployee: async (request, userId) => {
      const userRole = await request.mongo.db.collection('user_roles')
        .findOne({ user_id: userId });

      if (!userRole) {
        throw new InvariantError('User belum memiliki role');
      }

      const role = await request.mongo.db.collection('roles')
        .findOne({ _id: userRole.role_id });

      if (role.level === config.user.level.employee) {
        throw new ClientError('Akses dilarang', 403);
      }
    },
    account: {
      containsWhitespace: (title, value) => {
        const status = /\s/.test(value);

        if (status) {
          throw new InvariantError(`${title} tidak boleh mengandung whitespace`);
        }
      },
    },
  },
};