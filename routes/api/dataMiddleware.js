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

const checkData = (shema, data, req, next) => {
  if (shema) {
    const { error, value } = shema.validate(data);
    if (!error) {
      req.query = value;
      return next();
    }
    return next(badRequestError(error.message));
  }
  next();
};

const checkQueries = (req, res, next) => {
  checkData(res.queryShema, req.query, req, next);
};

const checkParams = (req, res, next) => {
  checkData(res.paramsShema, req.params, req, next);
};

const checkBody = (req, res, next) => {
  checkData(res.bodyShema, req.body, req, next);
};

const getData = async (req, res, next) => {
  const { statusCode = 200, dataFunc } = res;

  if (dataFunc) {
    const _id = req.params.contactId;
    const owner = req.user._id;
    const ids = { _id, owner };

    const data = await dataFunc(ids, req.value, req.query).catch(next);
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
  checkBody,
  checkParams,
  checkQueries,
};
