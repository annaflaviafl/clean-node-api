const { MissingParamError, InvalidParamError } = require("../../utils/errors");

module.exports = class AuthUseCase {
  constructor({
    loadUserByEmailRepository,
    updateAcessTokenRepository,
    encrypter,
    tokenGenerator,
  } = {}) {
    this.loadUserByEmailRepository = loadUserByEmailRepository;
    this.updateAcessTokenRepository = updateAcessTokenRepository;
    this.encrypter = encrypter;
    this.tokenGenerator = tokenGenerator;
  }

  async auth(email, password) {
    if (!email) {
      throw new MissingParamError("email");
    }
    if (!password) {
      throw new MissingParamError("password");
    }
    if (!this.loadUserByEmailRepository) {
      throw new MissingParamError("loadUserByEmailRepository");
    }
    if (!this.loadUserByEmailRepository.load) {
      throw new InvalidParamError("loadUserByEmailRepository");
    }

    const user = await this.loadUserByEmailRepository.load(email);
    const isValid =
      user && (await this.encrypter.compare(password, user.password));
    if (isValid) {
      const acessToken = await this.tokenGenerator.generate(user._id);
      await this.updateAcessTokenRepository.update(user._id, acessToken);
      return acessToken;
    }

    return null;
  }
};
