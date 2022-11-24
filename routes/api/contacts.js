const express = require("express");
const { getData, validateId, checkData } = require("./dataMiddleware");
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

/**
 * @openapi
 *
 * /api/contacts:
 *   get:
 *      tags:
 *        - Contacts
 *      description: Get all contacts
 *      parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The number of page of contacts list
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: The numbers of contacts to return in list
 *       - in: query
 *         name: favorite
 *         schema:
 *           type: boolean
 *         description: Filter on favorite attribute of contacts
 *      responses:
 *        200:
 *          description: Successful response, send array of contacts
 *          content:
 *             application/json:
 *               schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/shemes/contactsApiResponse'
 *        401:
 *          description: Missing header with authorization token
 */

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

/**
 * @openapi
 *
 * /api/contacts/{contactId}:
 *   get:
 *      tags:
 *        - Contacts
 *      description: Add contact by id
 *      parameters:
 *       - $ref: '#/components/parameters/contactId'
 *      responses:
 *        200:
 *          description: Successful response, send existed contact
 *          content:
 *             application/json:
 *               schema:
 *                $ref: '#/components/shemes/contactsApiResponse'
 *        401:
 *          description: Missing header with authorization token
 *        404:
 *          description: Contact not found
 */

router.get(
  "/:contactId",
  (req, res, next) => {
    res.dataFunc = getContactById;
    next();
  },
  validateId,
  getData
);

/**
 * @openapi
 *
 * /api/contacts:
 *   post:
 *     tags:
 *        - Contacts
 *     description: Add new contact
 *     requestBody:
 *      required: true
 *      content:
 *       application/json:
 *        schema:
 *            $ref: '#/components/requestBodies/contactAdd'
 *     responses:
 *        201:
 *          description: Successful response, send added contact
 *          content:
 *             application/json:
 *               schema:
 *                $ref: '#/components/shemes/contactsApiResponse'
 *        400:
 *          description: Missing required name field
 *        401:
 *          description: Missing header with authorization token
 */

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

/**
 * @openapi
 *
 * /api/contacts/{contactId}:
 *   delete:
 *      tags:
 *        - Contacts
 *      description: Remove contact by id
 *      parameters:
 *      - $ref: '#/components/parameters/contactId'
 *      responses:
 *        200:
 *          description: Successful response, send deleted contact
 *          content:
 *             application/json:
 *               schema:
 *                $ref: '#/components/shemes/contactsApiResponse'
 *        401:
 *          description: Missing header with authorization token
 *        404:
 *          description: Contact not found
 */

router.delete(
  "/:contactId",
  (_, res, next) => {
    res.dataFunc = removeContact;
    next();
  },
  validateId,
  getData
);

/**
 * @openapi
 *
 * /api/contacts/{contactId}:
 *   put:
 *     tags:
 *        - Contacts
 *     description: Update existing contact
 *     parameters:
 *      - $ref: '#/components/parameters/contactId'
 *     requestBody:
 *      required: true
 *      content:
 *       application/json:
 *        schema:
 *            $ref: '#/components/requestBodies/contactUpdate'
 *     responses:
 *        200:
 *          description: Successful response, send updated contact
 *          content:
 *             application/json:
 *               schema:
 *                $ref: '#/components/shemes/contactsApiResponse'
 *        400:
 *          description: Missing required name field
 *        401:
 *          description: Missing header with authorization token
 *        404:
 *          description: Contact not found
 */

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

/**
 * @openapi
 *
 * /api/contacts/{contactId}/favorite:
 *   put:
 *     tags:
 *        - Contacts
 *     description: Update favorite field in contact
 *     parameters:
 *      - $ref: '#/components/parameters/contactId'
 *     requestBody:
 *      required: true
 *      content:
 *       application/json:
 *        schema:
 *            $ref: '#/components/requestBodies/contactUpdateFavorite'
 *     responses:
 *        200:
 *          description: Successful response, send updated contact
 *          content:
 *             application/json:
 *               schema:
 *                $ref: '#/components/shemes/contactsApiResponse'
 *        400:
 *          description: Missing required favorite field
 *        401:
 *          description: Missing header with authorization token
 *        404:
 *          description: Contact not found
 */

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
