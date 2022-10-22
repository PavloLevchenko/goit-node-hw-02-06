const path = require("path");
const { nanoid } = require("nanoid");
const { read, write } = require("./fs");

const contactsPath = path.resolve("models", "contacts.json");

const listContacts = async () => {
  return await read(contactsPath);
};

const getContactById = async (contactId) => {
  const contactsArr = await read(contactsPath);
  const contact = contactsArr.find((contact) => contact.id === contactId);
  if (contact) {
    return contact;
  }
  return null;
};

const removeContact = async (contactId) => {
  const contactsArr = await read(contactsPath);
  const contact = contactsArr.find((contact) => contact.id === contactId);
  if (contact) {
    const newContacts = contactsArr.filter(
      (contact) => contact.id !== contactId
    );
    await write(contactsPath, newContacts);
    return contact;
  }
  return null;
};

const addContact = async (body) => {
  const contact = { id: nanoid(), ...body };
  const contactsArr = await read(contactsPath);
  await write(contactsPath, [...contactsArr, contact]);
  return contact;
};

const updateContact = async (contactId, body) => {
  const contactsArr = await read(contactsPath);
  const oldContact = contactsArr.find((contact) => contact.id === contactId);
  if (oldContact) {
    const newContact = { ...oldContact, ...body };
    const newContacts = contactsArr.map((contact) =>
      contact.id !== contactId ? contact : newContact
    );
    await write(contactsPath, newContacts);
    return newContact;
  }
  return null;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
