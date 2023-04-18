const { nanoid } = require('nanoid');
const { InvariantError } = require('../../exceptions/InvariantError');

class UserRolesService {
  async addUserRole(mongo, userRole) {
    const id = `user_role-${nanoid(16)}`;
    const newUserRole = {
      _id: id,
      user_id: userRole.user_id,
      role_id: userRole.role_id,
    };

    const result = await mongo.db.collection('user_roles').insertOne(newUserRole);

    if (!result.acknowledged) {
      throw new InvariantError('Role user gagal ditambahkan');
    }

    return result.insertedId;
  }

  async editUserRole(mongo, userRole) {
    const result = await mongo.db.collection('user_roles')
      .updateOne({ user_id: userRole.user_id }, { $set: { role_id: userRole.role_id } });

    if (!result.acknowledged) {
      throw new InvariantError('Role user gagal diubah');
    }
  }

  async getUserRoleById(mongo, userId) {
    const result = await mongo.db.collection('user_roles')
      .findOne({ user_id: userId });

    if (!result) {
      throw new InvariantError('User belum memiliki role');
    }

    return result;
  }

  async verifyUserRoleId(mongo, userId) {
    const result = await mongo.db.collection('user_roles').findOne({ user_id: userId });

    if (result) {
      throw new InvariantError('User sudah memiliki role');
    }
  }
}

module.exports = { UserRolesService };