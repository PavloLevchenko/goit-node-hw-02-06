const { BadRequest, NotFound, Unauthorized, Conflict } = require("http-errors");

const emailError = Conflict("Email in use");

const loginError = Unauthorized("Email or password is wrong");

const notAutorizedError = Unauthorized("Not authorized");

const badRequestError = (message = "Bad Request") => {
  return BadRequest(message);
};

const notFoundError = NotFound();
const userNotFoundError = NotFound("User not found");
const emailVerificationError = Unauthorized("Email verification required");
const verificationError = BadRequest("Verification has already been passed");

module.exports = {
  emailError,
  loginError,
  notAutorizedError,
  badRequestError,
  notFoundError,
  userNotFoundError,
  emailVerificationError,
  verificationError,
};
