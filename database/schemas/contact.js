const { Schema, Types } = require("mongoose");

const contacts = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Types.ObjectId,
      ref: 'user',
    }
  },
  {
    versionKey: false,
  }
);

module.exports = {
  contacts,
};
