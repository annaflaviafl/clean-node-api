const bcrypt = require('bcrypt')
class Encrypter {
  async compare (value, hash) {
    const isValid = await bcrypt.compare(value, hash)
    return isValid
  }
}
describe('', () => {
  test('Should return true if bcrypt returns true', async () => {
    const sut = new Encrypter()
    const isValid = await sut.compare('any_value', 'hashed_value')

    expect(isValid).toBeTruthy()
  })

  test('Should return true if bcrypt returns true', async () => {
    const sut = new Encrypter()
    bcrypt.isValid = false
    const isValid = await sut.compare('any_value', 'hashed_value')

    expect(isValid).toBeFalsy()
  })
})