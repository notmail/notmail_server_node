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

class Removed extends Error {
  constructor(message) {
    super(message);
    this.name = 'Removed';
  }
}

class AuthenticationFailure extends Error {
  constructor(message) {
    super(message);
    this.name = 'Authentication Failure';
  }
}

class SecurityError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Security Error';
  }
}

class SubscriptionError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Subscription Error';
  }
}

module.exports = {
    BadRequest: BadRequest,
    Unauthorized: Unauthorized,
    Forbidden: Forbidden,
    Unknown: Unknown,
    AuthenticationFailure: AuthenticationFailure,
    SecurityError: SecurityError,
    Removed: Removed,
    SubscriptionError: SubscriptionError
}