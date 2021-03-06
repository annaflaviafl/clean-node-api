jest.mock("validator", () => ({
  isEmailValid: true,
  email: "",

  isEmail(email) {
    this.email = email;
    return this.isEmailValid;
  },
}));

const EmailValidator = require("./email-validator");
const validator = require("validator");
const { MissingParamError } = require("../errors/");

const makeSut = () => {
  return new EmailValidator();
};
describe("Email validator", () => {
  test("Shold return true if validator returns true", () => {
    const sut = makeSut();
    const isEmailValid = sut.isValid("valid_email@mail.com");

    expect(isEmailValid).toBe(true);
  });

  test("Shold return false if validator returns false", () => {
    validator.isEmailValid = false;
    const sut = makeSut();
    const isEmailValid = sut.isValid("invalid_email@mail.com");

    expect(isEmailValid).toBe(false);
  });

  test("Shold call validator with correct email", () => {
    const sut = makeSut();
    sut.isValid("any_email@mail.com");

    expect(validator.email).toBe("any_email@mail.com");
  });

  test("Should throw if no email are provided", async () => {
    const sut = makeSut();

    expect(() => {
      sut.isValid();
    }).toThrow(new MissingParamError("email"));
  });
});
