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

const checkQueries = (req, res, next) => {
  const { queryShema } = res;
  if (queryShema) {
    const { error, value } = queryShema.validate(req.query);
    if (!error) {
      req.query = value;
      return next();
    }
    return next(badRequestError(error.message));
  }
  next();
}

const checkParams = (req, res, next) => {
  const { shema } = res;
  if (shema) {
    const { error, value } = shema.validate(req.body);
    if (!error) {
      req.value = value;
      return next();
    }
    return next(badRequestError(error.message));
  }
  next();
};

const getData = async (req, res, next) => {
  const { statusCode, statusMessage, dataFunc } = res;

  if (dataFunc) {
    const _id = req.params.contactId;
    const owner = req.user._id;
    const ids = { _id, owner };
    
    const data = await dataFunc(ids, req.value, req.query).catch(next);
    if (data) {
      return res.json({
        code: statusCode,
        message: statusMessage,
        data,
      });
    }
  }
  next(notFoundError);
};

module.exports = {
  getData,
  validateId,
  checkParams,
  checkQueries,
};
