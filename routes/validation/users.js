const Joi = require("joi");

const userUpdateSubscriptionSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
}).required();

const userVerificationSchema = Joi.object({
  verificationToken: Joi.string().required(),
}).required();

const emailVerificationSchema = Joi.object({
  email: Joi.string()
    .required()
    .error(new Error("Missing required field email")),
}).required();

const userSignupSchema = Joi.object({
  email: Joi.string()
    .pattern(/[^@\s]+@[^@\s]+\.[^@\s]+/)
    .required()
    .error(new Error("The mail must be in the format user@gmail.com")),
  password: Joi.string()
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    .required()
    .error(
      new Error(
        "The password must contain minimum eight characters, at least one letter and one number"
      )
    ),
}).required().meta({ schemaOverride: Joi.object({ email: Joi.string(), password: Joi.string() })});

module.exports = {
  userSignupSchema,
  userUpdateSubscriptionSchema,
  userVerificationSchema,
  emailVerificationSchema,
};
