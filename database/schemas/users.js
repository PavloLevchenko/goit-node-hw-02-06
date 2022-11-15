const { Schema } = require("mongoose");
const bCrypt = require("bcryptjs");

const hashPassword = async function (password) {
  const salt = await bCrypt.genSalt();
  const hashedPassword = await bCrypt.hash(password, salt);
  return hashedPassword;
};

const comparePassword = async function (password, hashedPassword) {
  return await bCrypt.compare(password, hashedPassword);
};

const users = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: String,
  },
  {
    versionKey: false,
    strictPopulate:true,
  }
);

users.pre('save', async function save(next) {
  try {
    this.password = await hashPassword(this.password);
    return next();
  } catch (err) {
    return next(err);
  }
});

users.methods.validPassword = async function (password) {
  return await comparePassword(password, this.password);
};

module.exports = {
  users,
};
