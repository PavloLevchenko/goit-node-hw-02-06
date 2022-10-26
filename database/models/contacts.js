const { model, Types } = require("mongoose");
const { contacts } = require("../schemas/contact");

const Contacts = model("contacts", contacts);

function query(func, ...args) {
  try {
    const contact = func.bind(Contacts)(...args);
    if (contact) {
      return contact;
    }
    return null;
  } catch (err) {
    console.error(err);
  }
}

const listContacts = async () => {
  return await query(Contacts.find);
};

const getContactById = async (contactId) => {
  if (Types.ObjectId.isValid(contactId)) {
    return await query(Contacts.findById, contactId);
  }
};

const removeContact = async (contactId) => {
  if (Types.ObjectId.isValid(contactId)) {
    return await query(Contacts.findByIdAndDelete, contactId);
  }
};

const addContact = async (body) => {
  return await query(Contacts.create, body);
};

const updateContact = async (contactId, body) => {
  if (Types.ObjectId.isValid(contactId)) {
    return await query(Contacts.findByIdAndUpdate, contactId, body, {
      new: true,
    });
  }
};

const updateStatusContact = async (contactId, body) => {
  if (Types.ObjectId.isValid(contactId)) {
    return await query(Contacts.findByIdAndUpdate, contactId, body, {
      new: true,
    });
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
