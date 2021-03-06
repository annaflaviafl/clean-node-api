const MissingParamError = require("../../utils/errors/missing-param-error");
const MongoHelper = require("../helpers/mongo-helper");

module.exports = class UpdateAcessTokenRepository {
  async update(userId, acessToken) {
    if (!userId) {
      throw new MissingParamError("userId");
    }
    if (!acessToken) {
      throw new MissingParamError("acessToken");
    }
    const userModel = await MongoHelper.getCollection("users");
    await userModel.updateOne(
      {
        _id: userId,
      },
      {
        $set: { acessToken },
      }
    );
  }
};
