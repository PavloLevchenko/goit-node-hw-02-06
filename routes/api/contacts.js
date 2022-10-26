const express = require("express");
const {
  contactAddSchema,
  contactUpdateSchema,
  contactUpdateFavoriteSchema,
} = require("../../routes/validation/schemas");

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
} = require("../../database");

function status(code, message, data = null) {
  return {
    code,
    message,
    data,
  };
}

const router = express.Router();

router.get("/", async (req, res, next) => {
  res.json(status(200, "Success", await listContacts()));
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  if (!contact) {
    res.statusCode = 404;
    next();
    return;
  }
  res.json(status(200, "Success", contact));
});

router.post("/", async (req, res, next) => {
  const { error, value } = contactAddSchema.validate(req.body);
  if (error) {
    res.json(status(400, error.message));
    return;
  }
  const contact = await addContact(value);
  res.json(status(200, "Contact added", contact));
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await removeContact(contactId);
  if (!contact) {
    res.statusCode = 404;
    next();
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
  const contact = await updateContact(contactId, value);
  if (!contact) {
    res.statusCode = 404;
    next();
    return;
  }
  res.json(status(200, "Contact updated", contact));
});

router.patch("/:contactId/favorite", async (req, res, next) => {
  const { contactId } = req.params;
  const { error, value } = contactUpdateFavoriteSchema.validate(req.body);
  if (error) {
    res.json(status(400, error.message));
    return;
  }
  const contact = await updateStatusContact(contactId, value);
  if (!contact) {
    res.statusCode = 404;
    next();
    return;
  }
  res.json(status(200, "Contact updated", contact));
});

module.exports = router;
