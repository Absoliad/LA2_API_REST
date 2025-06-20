const { INTERNAL_SERVER_ERROR } = require('./httpStatusCodes');

module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || INTERNAL_SERVER_ERROR.code;
  const message = err.message || INTERNAL_SERVER_ERROR.message;

  const response = { status: statusCode, message };
  
  if (err.details) response.details = err.details;
  if (req.app.get('env') === 'development' && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
