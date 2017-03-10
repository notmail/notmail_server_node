
class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.name = 'Bad Request';
  }
}

class Unauthorized extends Error {
  constructor(message) {
    super(message);
    this.name = 'Unauthorized';
  }
}

class Forbidden extends Error {
  constructor(message) {
    super(message);
    this.name = 'Forbidden';
  }
}

class Unknown extends Error {
  constructor(message) {
    super(message);
    this.name = 'Unknown';
  }
}

module.exports = {
    BadRequest: BadRequest,
    Unauthorized: Unauthorized,
    Forbidden: Forbidden,
    Unknown: Unknown
}