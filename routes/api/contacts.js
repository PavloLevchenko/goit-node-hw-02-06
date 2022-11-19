const express = require("express");
const {
  getData,
  validateId,
  checkData,
} = require("./dataMiddleware");
const {
  contactQuerySchema,
  contactAddSchema,
  contactUpdateSchema,
  contactUpdateFavoriteSchema,
} = require("../validation/contacts");

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../database");
const { auth } = require("./jwtMiddleware");

const router = express.Router();

router.use(auth);

router.get(
  "/",
  (_, res, next) => {
    res.queryShema = contactQuerySchema;
    res.dataFunc = listContacts;
    next();
  },
  checkData,
  getData
);

router.get(
  "/:contactId",
  (req, res, next) => {
    res.dataFunc = getContactById;
    next();
  },
  validateId,
  getData
);

router.post(
  "/",
  (_, res, next) => {
    res.statusCode = 201;
    res.bodyShema = contactAddSchema;
    res.dataFunc = addContact;
    next();
  },
  validateId,
  checkData,
  getData
);

router.delete(
  "/:contactId",
  (_, res, next) => {
    res.dataFunc = removeContact;
    next();
  },
  validateId,
  getData
);

router.put(
  "/:contactId",
  (_, res, next) => {
    res.bodyShema = contactUpdateSchema;
    res.dataFunc = updateContact;
    next();
  },
  validateId,
  checkData,
  getData
);

router.patch(
  "/:contactId/favorite",
  (_, res, next) => {
    res.bodyShema = contactUpdateFavoriteSchema;
    res.dataFunc = updateContact;
    next();
  },
  validateId,
  checkData,
  getData
);

module.exports = router;
