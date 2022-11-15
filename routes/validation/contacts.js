const Joi = require("joi");

const contactQuerySchema = Joi.object({
  page: Joi.number(),
  limit: Joi.number(),
  favorite: Joi.bool(),
});

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
  favorite: Joi.bool(),
}).required();

const contactUpdateSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
})
  .or("name", "email", "phone")
  .error(new Error("Missing fields"))
  .required();

const contactUpdateFavoriteSchema = Joi.object({
  favorite: Joi.bool().required().error(new Error("Missing field favorite")),
}).required();

module.exports = {
  contactQuerySchema,
  contactAddSchema,
  contactUpdateSchema,
  contactUpdateFavoriteSchema,
};
