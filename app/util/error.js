
class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.name = 'BadRequest';
  }
}

module.exports = {
    BadRequest: BadRequest
}