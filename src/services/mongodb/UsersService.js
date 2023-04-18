const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');
const { AuthenticationError } = require('../../exceptions/AuthenticationError');
const { InvariantError } = require('../../exceptions/InvariantError');
const { NotFoundError } = require('../../exceptions/NotFoundError');

class UsersService {
  async addUser(request, user) {
    await this.verifyUsername(request, user.username);

    const _id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = {
      _id,
      username: user.username,
      password: hashedPassword,
      fullname: user.fullname,
      email: user.email,
      phone: user.phone,
    };

    try {
      const result = await request.mongo.db.collection('users').insertOne(newUser);
      return result.insertedId;
    } catch {
      throw new InvariantError('User gagal ditambahkan');
    }
  }

  async getUser(request, userId) {
    const user = await request.mongo.db.collection('users')
      .findOne({ _id: userId });
    const userRole = await request.mongo.db.collection('user_roles')
      .findOne({ user_id: userId });
    const role = await request.mongo.db.collection('roles')
      .findOne({ _id: userRole.role_id });

    if (!user) {
      throw new InvariantError('User tidak ditemukan');
    }

    if (!userRole) {
      throw new InvariantError('User belum memiliki role');
    }

    const result = {
      id: userId,
      username: user.username,
      fullname: user.fullname,
      phone: user.phone,
      email: user.email,
      role: role.role,
    };

    return result;
  }

  async getAllUsers(request) {
    const users = await request.mongo.db.collection('users').find({}).toArray();

    const mappedUsers = await Promise.all(users.map(async (item) => {
      const roleId = await request.mongo.db
        .collection('user_roles').findOne({ user_id: item._id }, { _id: 0, user_id: 0 });

      let roleUser = null;

      if (roleId) {
        const roleName = await request.mongo.db
          .collection('roles').findOne({ _id: roleId.role_id }, { _id: 0 });
        roleUser = roleName.role;
      }

      return {
        user_id: item._id,
        username: item.username,
        fullname: item.fullname,
        role: roleUser,
      };
    }));

    return mappedUsers;
  }

  async editUser({ request, authUserId, payload }) {
    const oldUser = await request.mongo.db
      .collection('users').findOne({ _id: authUserId });
    const statusUsername = await request.mongo.db
      .collection('users').findOne({ username: payload.username });

    if ((payload.username === oldUser.username) || !statusUsername) {
      const matchPassword = await bcrypt.compare(payload.password, oldUser.password);

      if (!matchPassword) {
        throw new AuthenticationError('Kredensial yang Anda berikan salah');
      }

      const newUserData = {
        username: payload.username,
        fullname: payload.fullname,
        email: payload.email,
        phone: payload.phone,
      };

      const result = await request.mongo.db
        .collection('users').updateOne({ _id: authUserId }, { $set: newUserData });

      if (!result.acknowledged) {
        throw new InvariantError('User gagal diperbarui');
      }
    }

    if (statusUsername && (payload.username !== oldUser.username)) {
      throw new InvariantError('Username telah digunakan');
    }
  }

  async editUserPassword({ request, authUserId, payload }) {
    const user = await request.mongo.db
      .collection('users').findOne({ _id: authUserId });
    const matchPassword = await bcrypt.compare(payload.oldPassword, user.password);

    if (!matchPassword) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    const hashedPassword = await bcrypt.hash(payload.newPassword, 10);

    const result = await request.mongo.db
      .collection('users')
      .updateOne(
        { _id: authUserId },
        { $set: { password: hashedPassword } },
      );

    if (!result.acknowledged) {
      throw new InvariantError('Password gagal diperbarui');
    }
  }

  async verifyUsername(request, username) {
    const result = await request.mongo.db.collection('users').findOne({ username });

    if (result) {
      throw new InvariantError('User gagal ditambahkan, username telah digunakan.');
    }
  }

  async verifyUserCredential({ request, username, password }) {
    const result = await request.mongo.db.collection('users').findOne({ username });

    if (!result) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    const { _id, password: hashedPassword } = result;
    const matchPassword = await bcrypt.compare(password, hashedPassword);

    if (!matchPassword) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    return _id;
  }

  async verifyUserId(request, id) {
    const result = await request.mongo.db.collection('users')
      .findOne({ _id: id });

    if (!result) {
      throw new NotFoundError('User tidak ditemukan');
    }
  }
}

module.exports = { UsersService };