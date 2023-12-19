const createError = (message, code) => {
  const error = new Error();
  error.code = code;
  error.message = message;
  return error;
};
module.exports = createError;
