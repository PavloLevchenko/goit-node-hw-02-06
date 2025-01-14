const { model } = require("mongoose");
const { users } = require("../schemas/users");

const Users = model("users", users);

const getUserById = async (UserId) => {
  return await Users.findById(UserId);
};

const checkUserEmail = async (email) => {
  return (await Users.findOne({ email })) != null;
};

const getVerificationToken = async (email) => {
  return (await Users.findOne({ email })).verificationToken;
};

const isUserVerified = async (email) => {
  return (await Users.findOne({ email })).verify;
};

const getUserByEmail = async (email) => {
  return await Users.findOne({ email });
};

const verifyUser = async (verificationToken) => {
  return await Users.findOneAndUpdate({ verificationToken }, { verificationToken: null, verify: true });
};

const addUser = async (body) => {
  return await Users.create(body);
};

const updateUser = async (UserId, body) => {
  const user = await Users.findByIdAndUpdate(UserId, body, {
    new: true,
    runValidators: true,
  });
  return user;
};

module.exports = {
  Users,
  getUserById,
  checkUserEmail,
  isUserVerified,
  getUserByEmail,
  getVerificationToken,
  verifyUser,
  addUser,
  updateUser,
};
