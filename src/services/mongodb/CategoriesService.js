const { InvariantError } = require('../../exceptions/InvariantError');
const { nanoid } = require('nanoid');

class CategoriesService {
  async addCategory(mongo, payload) {
    const _id = `category-${nanoid(16)}`;
    const category = {
      _id,
      ...payload,
    };
    const result = await mongo.db.collection('categories').insertOne(category);

    if (!result.acknowledged) {
      throw new InvariantError('Category gagal ditambahkan');
    }

    return result.insertedId;
  }

  async getAllCategories(mongo) {
    const result = await mongo.db.collection('categories').find({}).toArray();
    return result;
  }

  async verifyCategoryId(mongo, id) {
    const result = await mongo.db.collection('categories').findOne({ _id: id });

    if (!result) {
      throw new InvariantError('Id category tidak ditemukan');
    }
  }
}

module.exports = { CategoriesService };