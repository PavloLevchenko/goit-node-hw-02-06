const httpErr = require("http-errors");

const emailError = httpErr(409, "Email in use");

const loginError = httpErr(401, "Email or password is wrong");

const notAutorizedError = httpErr(401, "Not authorized");

const badRequestError = (message = "Bad Request") => {
  return httpErr(400, message);
};

const notFoundError = httpErr(404, "Not found");

module.exports = {
  emailError,
  loginError,
  notAutorizedError,
  badRequestError,
  notFoundError,
};
