const { model } = require("mongoose");
const { contacts } = require("../schemas/contact");

const Contacts = model("contacts", contacts);

const listContacts = async ({ owner }, _, { page, limit = 20, favorite }) => {
  if (page) {
    const skip = (page - 1) * limit;
    return await Contacts.find({ owner }).skip(skip).limit(limit);
  }
  if (favorite) {
    return await Contacts.find({ owner, favorite });
  }
  if (page && favorite) {
    const skip = (page - 1) * limit;
    return await Contacts.find({ owner, favorite }).skip(skip).limit(limit);
  }
  return await Contacts.find({ owner });
};

const getContactById = async (ids) => {
  const { _id, name, email, phone, favorite } = await Contacts.findOne(ids);
  return { _id, name, email, phone, favorite };
};

const removeContact = async (ids) => {
  return await Contacts.findOneAndDelete(ids);
};

const addContact = async ({ owner }, body) => {
  const { _id, name, email, phone, favorite } = await Contacts.create({ ...body, owner });
  return { _id, name, email, phone, favorite };
};

const updateContact = async (ids, body) => {
  return await Contacts.findOneAndUpdate(ids, body, {
    new: true,
    runValidators: true,
  });
};

module.exports = {
  Contacts,
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
