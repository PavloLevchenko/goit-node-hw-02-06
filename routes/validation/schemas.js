const Joi = require("joi");

const contactAddSchema = Joi.object({
  name: Joi.string()
    .required()
    .error(new Error('Missing required "name" field')),
  email: Joi.string()
    .required()
    .error(new Error('Missing required "email" field')),
  phone: Joi.string()
    .required()
    .error(new Error('Missing required "phone" field')),
}).required();

const contactUpdateSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
})
  .min(1)
  .required();

const contactUpdateFavoriteSchema = Joi.object({
  favorite: Joi.bool().required().error(new Error("Missing field favorite")),
}).required();

module.exports = {
  contactAddSchema,
  contactUpdateSchema,
  contactUpdateFavoriteSchema,
};
