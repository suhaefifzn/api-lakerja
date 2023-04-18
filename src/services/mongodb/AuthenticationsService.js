const { InvariantError } = require('../../exceptions/InvariantError');

class AuthenticationsService {
  async addRefreshToken(request, token) {
    await request.mongo.db.collection('authentications').insertOne({ token });
  }

  async verifyRefreshToken(request, token) {
    const result = await request.mongo.db.collection('authentications').findOne({ token });

    if (!result) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }

  async deleteRefreshToken(request, token) {
    await request.mongo.db.collection('authentications').deleteOne({ token });
  }
}

module.exports = { AuthenticationsService };