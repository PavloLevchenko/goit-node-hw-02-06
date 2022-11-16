const express = require("express");
const {
  getData,
  validateId,
  checkParams,
  checkQueries,
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
  checkQueries,
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
    res.shema = contactAddSchema;
    res.dataFunc = addContact;
    next();
  },
  validateId,
  checkParams,
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
    res.shema = contactUpdateSchema;
    res.dataFunc = updateContact;
    next();
  },
  validateId,
  checkParams,
  getData
);

router.patch(
  "/:contactId/favorite",
  (_, res, next) => {
    res.shema = contactUpdateFavoriteSchema;
    res.dataFunc = updateContact;
    next();
  },
  validateId,
  checkParams,
  getData
);

module.exports = router;
