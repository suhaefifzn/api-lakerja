const { nanoid } = require('nanoid');
const { InvariantError } = require('../../exceptions/InvariantError');

class RolesService {
  async addRole(mongo, payload) {
    const _id = `role-${nanoid(16)}`;
    const { role, level } = payload;

    const newRole = {
      _id,
      role,
      level,
    };

    const result = await mongo.db.collection('roles').insertOne(newRole);

    if (!result.acknowledged) {
      throw new InvariantError('Role gagal ditambahkan');
    }

    return result.insertedId;
  }

  async getAllRoles(mongo) {
    const result = await mongo.db.collection('roles').find({}).toArray();
    return result;
  }

  async verifyRoleId(mongo, roleId) {
    const result = await mongo.db.collection('roles').findOne({ _id: roleId });

    if (!result) {
      throw new InvariantError('Role tidak ditemukan');
    }
  }
}

module.exports = { RolesService };