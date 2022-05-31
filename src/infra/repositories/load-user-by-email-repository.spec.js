const MongoHelper = require("../helpers/mongo-helper");
const LoadUserByEmailRepository = require("./load-user-by-email-repository");
const MissingParamError = require("../../utils/errors/missing-param-error");
let client, db;

const makeSut = () => {
  const userModel = db.collection("users");
  const sut = new LoadUserByEmailRepository(userModel);

  return { userModel, sut };
};
describe("LoadUserByEmail Repository", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
    db = await MongoHelper.db;
  });

  beforeEach(async () => {
    await db.collection("users").deleteMany();
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test("Should return null if no user is found", async () => {
    const { sut } = makeSut();
    const user = await sut.load("invalid_email@mail.com");
    expect(user).toBeNull();
  });

  test("Should return an user if user is found", async () => {
    const { sut, userModel } = makeSut();
    const fakeUser = await userModel.insertOne({
      email: "valid_email@mail.com",
      password: "hashed_password",
    });

    const user = await sut.load("valid_email@mail.com");
    expect(user).toEqual({
      _id: fakeUser.insertedId,
      password: "hashed_password",
    });
  });

  test("Should throws if no userModel is provided", async () => {
    const sut = new LoadUserByEmailRepository();
    const promise = sut.load("any_email@mail.com");
    expect(promise).rejects.toThrow();
  });

  test("Should throws if no email is provided", async () => {
    const { sut } = makeSut();
    const promise = sut.load();
    expect(promise).rejects.toThrow(new MissingParamError("email"));
  });
});