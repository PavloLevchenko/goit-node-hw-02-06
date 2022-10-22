const express = require("express");
const {
  contactAddSchema,
  contactUpdateSchema,
} = require("../../routes/validation/schemas");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts");

const status = (code, msg, data = null) => {
  return {
    status: code,
    message: msg,
    data,
  };
};

const router = express.Router();

router.get("/", async (req, res, next) => {
  res.json(status(200, "Success", await listContacts()));
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(String(contactId));
  if (!contact) {
    res.json(status(404, "Not found"));
    return;
  }
  res.json(status(200, "Success", contact));
});

router.post("/", async (req, res, next) => {
  const { error, value } = contactAddSchema.validate(req.body);
  console.log(error);
  if (error) {
    res.json(status(400, error.message));
    return;
  }
  const contact = await addContact(value);
  res.json(status("Contact added", contact));
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await removeContact(String(contactId));
  if (!contact) {
    res.json(status(404, "Not found"));
    return;
  }
  res.json(status(200, "Contact deleted", contact));
});

router.put("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const { error, value } = contactUpdateSchema.validate(req.body);
  if (error) {
    res.json(status(400, "Missing fields"));
    return;
  }
  const contact = await updateContact(String(contactId), value);
  if (!contact) {
    res.json(status(404, "Not found"));
    return;
  }
  res.json(status(200, "Contact updated", contact));
});

module.exports = router;
