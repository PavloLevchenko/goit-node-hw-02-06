const j2s = require("joi-to-swagger");
const {
  contactAddSchema,
  contactUpdateSchema,
  contactUpdateFavoriteSchema,
} = require("../routes/validation/contacts");
const {
  userSignupSchema,
  userUpdateSubscriptionSchema,
  emailVerificationSchema,
} = require("../routes/validation/users");

const { swagger: contactAdd } = j2s(contactAddSchema);
const { swagger: contactUpdate } = j2s(contactUpdateSchema);
const { swagger: contactUpdateFavorite } = j2s(contactUpdateFavoriteSchema);
const { swagger: userSignup } = j2s(userSignupSchema);
const { swagger: userUpdateSubscription } = j2s(userUpdateSubscriptionSchema);
const { swagger: emailVerification } = j2s(emailVerificationSchema);

const requestBodies = {
  contactAdd,
  contactUpdate,
  contactUpdateFavorite,
  userSignup,
  userUpdateSubscription,
  avatarUpload: {
    type: "object",
    properties: {
      avatar: { type: "string", format: "binary" },
    },
  },
  emailVerification,
};

module.exports = requestBodies;
