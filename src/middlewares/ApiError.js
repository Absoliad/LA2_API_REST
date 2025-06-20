class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.stack = null;
  }
}

module.exports = ApiError;