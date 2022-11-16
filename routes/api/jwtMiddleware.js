const passport = require("passport");
const passportJWT = require("passport-jwt");
const jwt = require("jsonwebtoken");
const { notAutorizedError } = require("./httpErrors");
const { getUserById } = require("../../database");

const secret = process.env.JWT_SECRET;

const ExtractJWT = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;

const params = {
  secretOrKey: secret,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
};

// JWT Strategy
passport.use(
  new Strategy(params, async function (payload, done) {
    const user = await getUserById(payload.id);
    const dbTocken = jwt.decode(user.token, { secretOrKey: secret });
    const tockenCreationTimestamp = dbTocken ? dbTocken.iat : 0;
    if (!user || payload.iat !== tockenCreationTimestamp) {
      return done(notAutorizedError);
    }
    const { _id } = user;
    return done(null, _id);
  })
);

const auth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (!user || err) {
      return next(notAutorizedError);
    }
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = {
  auth,
};
