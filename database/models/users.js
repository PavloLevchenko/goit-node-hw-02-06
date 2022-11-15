const { model } = require("mongoose");
const { users } = require("../schemas/users");

const Users = model("users", users);

const getUserById = async (UserId) => {
  return await Users.findById(UserId);
};

const checkUserEmail = async (email) => {
  return (await Users.findOne({ email })) != null;
};

const getUserByEmail = async ({ email }) => {
  return await Users.findOne({ email });
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
  getUserById,
  checkUserEmail,
  getUserByEmail,
  addUser,
  updateUser,
};
