const m2s = require("mongoose-to-swagger");
const { Contacts } = require("../database");

const contactsApiResponse = m2s(Contacts);

const shemes = {
  contactsApiResponse,
  userSignupApiResponse: {
    type: "object",
    properties: {
      email: { type: "string" },
      subscription: { type: "string" },
    },
  },
  userLoginApiResponse: {
    type: "object",
    properties: {
      token: { type: "string" },
      user: {
        type: "object",
        properties: {
          email: { type: "string" },
          subscription: { type: "string" },
        },
      },
    },
  },
  changeAvatarApiResponse: {
    type: "object",
    properties: {
      avatarURL: { type: "string" },
    },
  },
};

module.exports = shemes;
