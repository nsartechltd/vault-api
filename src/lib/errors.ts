class ExtendableError extends Error {
  err: string;
  status: number;

  constructor(err) {
    super(err);
    Object.setPrototypeOf(this, ExtendableError.prototype);

    this.name = this.constructor.name;
    this.err = err;
  }
}

export class AuthError extends ExtendableError {
  statusCode = 401;

  constructor(err) {
    super(err);

    this.status = 401;
  }
}

export class NotFoundError extends ExtendableError {
  constructor(err) {
    super(err);

    this.status = 404;
  }
}
