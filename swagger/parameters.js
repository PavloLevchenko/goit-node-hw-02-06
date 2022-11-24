const j2s = require("joi-to-swagger");
const { contactQuerySchema } = require("../routes/validation/contacts");
const { swagger: contactQuery } = j2s(contactQuerySchema);

const parameters = {
  contactQuery,
  contactId: {
    in: "path",
    name: "contactId",
    required: true,
    schema: {
      type: "string",
    },
    description: "The contact id",
  },
  verificationToken: {
    in: "path",
    name: "verificationToken",
    required: true,
    schema: {
      type: "string",
    },
    description: "The verification token",
  },
};

module.exports = parameters;
