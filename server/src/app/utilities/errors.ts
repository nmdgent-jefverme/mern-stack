class HttpError extends Error {
  public status: Number = 500;
}

class NotFoundError extends HttpError {
  constructor () {
    super();
    this.status = 404;
  }
}

export {
  NotFoundError,
  HttpError,
}