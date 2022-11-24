const { isValidObjectId } = require("mongoose");
const { notFoundError, badRequestError } = require("./httpErrors");

const validateId = (req, _, next) => {
  const { contactId } = req.params;
  if (contactId && !isValidObjectId(contactId)) {
    const error = badRequestError(`${contactId} is not correct`);
    next(error);
  }
  next();
};

const checkShema = (data, res, req, next) => {
  const shema = res[data + "Shema"];
  if (shema) {
    const { error, value } = shema.validate(req[data]);
    if (error) {
      return next(badRequestError(error.message)); 
    }
    req[data] = value;
  }
};

const checkData = (req, res, next) => {
  checkShema("query", res, req, next);
  checkShema("params", res, req, next);
  checkShema("body", res, req, next);
  next();
};

const getData = async (req, res, next) => {
  const { statusCode = 200, dataFunc } = res;

  if (dataFunc) {
    const _id = req.params.contactId;
    const owner = req.user._id;
    const ids = { _id, owner };

    const data = await dataFunc(ids, req.body, req.query).catch(next);

    if (data) {
      return res.status(statusCode).json({
        ...data,
      });
    }
  }

  next(notFoundError);
};

module.exports = {
  getData,
  validateId,
  checkData,
};
