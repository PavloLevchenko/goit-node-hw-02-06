const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const { nanoid } = require("nanoid");
const jwt = require("jsonwebtoken");
const { auth } = require("./jwtMiddleware");
const { checkData } = require("./dataMiddleware");

const secret = process.env.JWT_SECRET;

const {
  userNotFoundError,
  emailError,
  loginError,
  emailVerificationError,
  verificationError,
} = require("./httpErrors");

const {
  checkUserEmail,
  isUserVerified,
  getUserById,
  getUserByEmail,
  getVerificationToken,
  verifyUser,
  addUser,
  updateUser,
} = require("../../database");

const {
  userSignupSchema,
  userUpdateSubscriptionSchema,
  userVerificationSchema,
  emailVerificationSchema,
} = require("../validation/users");

const upload = require("./path/multer");
const resizeAndSave = require("./path/jimp");
const {
  getVerificationUrl,
  sendVerificationMail,
} = require("./emailVerivication");

router.post("/signup", async (_, res, next) => {
  res.bodyShema = userSignupSchema;
  next();
});

router.post("/login", async (_, res, next) => {
  res.bodyShema = userSignupSchema;
  next();
});

router.patch("/", async (_, res, next) => {
  res.bodyShema = userUpdateSubscriptionSchema;
  next();
});

router.get("/verify/:verificationToken", async (_, res, next) => {
  res.paramsShema = userVerificationSchema;
  next();
});

router.post("/verify", async (_, res, next) => {
  res.bodyShema = emailVerificationSchema;
  next();
});

/**
 * @openapi
 *
 * /api/users/signup:
 *   post:
 *     tags:
 *        - Users
 *     description: Add new user
 *     requestBody:
 *      required: true
 *      content:
 *       application/json:
 *        schema:
 *            $ref: '#/components/requestBodies/userSignup'
 *     responses:
 *        201:
 *          description: Successful response, send email and subscription
 *          content:
 *             application/json:
 *               schema:
 *                $ref: '#/components/shemes/userSignupApiResponse'
 *        400:
 *          description: Missing required fields or invalid data format.
 *           The mail must be in the format user@gmail.com, the password must contain minimum eight characters, 
 *           at least one letter and one number.
 *        409:
 *          description: Email in use, try another
 */

router.post("/signup", checkData, async (req, res, next) => {
  const { email: userEmail } = req.body;
  const emailIsBusy = await checkUserEmail(userEmail);
  if (emailIsBusy) {
    return next(emailError);
  }
  const avatarURL = gravatar.url(userEmail, { s: "250" });
  const verificationToken = nanoid();
  const user = await addUser({ ...req.body, avatarURL, verificationToken });
  const { email, subscription } = user;
  const verificationUrl = getVerificationUrl(req, verificationToken);
  sendVerificationMail(email, verificationUrl)
    .then(() => {
      return res.status(201).json({
        message:
          "Check email with subject 'Email verification from phonebook' and activate user account",
        user: { email, subscription },
      });
    })
    .catch(next);
});

/**
 * @openapi
 *
 * /api/users/login:
 *   post:
 *     tags:
 *        - Users
 *     description: User authentication and authorisation tocken delivery
 *     requestBody:
 *      required: true
 *      content:
 *       application/json:
 *        schema:
 *            $ref: '#/components/requestBodies/userSignup'
 *     responses:
 *        200:
 *          description: Successful response, send access token and user object
 *          content:
 *             application/json:
 *               schema:
 *                $ref: '#/components/shemes/userLoginApiResponse'
 *        400:
 *          description: Missing required fields or email is not verify
 *        401:
 *          description: Email or password is wrong
 */

router.post("/login", checkData, async (req, res, next) => {
  const { email: userEmail, password } = req.body;
  let user = await getUserByEmail(userEmail);
  if (!user || !(await user.validPassword(password))) {
    return next(loginError);
  }
  if (!user.verify) {
    return next(emailVerificationError);
  }

  const payload = {
    id: user.id,
  };

  const token = jwt.sign(payload, secret, { expiresIn: "10h" });
  user = await updateUser(user.id, { token });

  const { email, subscription } = user;
  res.json({
    token,
    user: { email, subscription },
  });
});

/**
 * @openapi
 *
 * /api/users/logout:
 *   get:
 *     tags:
 *        - Users
 *     description: Log out, authorisation tocken disabling
 *     responses:
 *        204:
 *          description: Successful response
 *        401:
 *          description: Missing header with authorization token
 */

router.get("/logout", auth, async (req, res, next) => {
  const _id = req.user;

  if (_id) {
    await updateUser(_id, { token: null });
    return res.status(204).json();
  }
  return next(new Error());
});

/**
 * @openapi
 *
 * /api/users/current:
 *   get:
 *     tags:
 *        - Users
 *     description: Get current user data
 *     responses:
 *        200:
 *          description: Successful response
 *          content:
 *             application/json:
 *               schema:
 *                $ref: '#/components/shemes/userSignupApiResponse'
 *        401:
 *          description: Missing header with authorization token
 */

router.get("/current", auth, async (req, res, next) => {
  const _id = req.user;
  const user = await getUserById(_id);
  if (user) {
    const { email, subscription } = user;
    return res.json({
      user: { email, subscription },
    });
  }
  return next(new Error());
});

/**
 * @openapi
 *
 * /api/users:
 *   patch:
 *     tags:
 *        - Users
 *     description: Update user subscription
 *     requestBody:
 *      required: true
 *      content:
 *       application/json:
 *        schema:
 *            $ref: '#/components/requestBodies/userUpdateSubscription'
 *     responses:
 *        200:
 *          description: Successful response, user data with new subscription
 *          content:
 *             application/json:
 *               schema:
 *                $ref: '#/components/shemes/userSignupApiResponse'
 *        400:
 *          description: Subscription must be one of the following values "starter", "pro", "business"
 *        401:
 *          description: Missing header with authorization token
 */

router.patch("/", auth, checkData, async (req, res, next) => {
  const _id = req.user;

  if (_id) {
    const user = await updateUser(_id, req.body);
    if (user) {
      const { email, subscription } = user;
      return res.json({
        user: { email, subscription },
      });
    }
  }
  return next(new Error());
});

/**
 * @openapi
 *
 * /api/users/avatars:
 *   patch:
 *     tags:
 *        - Users
 *     description: Update user avatar
 *     requestBody:
 *      required: true
 *      content:
 *       multipart/form-data:
 *        schema:
 *            $ref: '#/components/requestBodies/avatarUpload'
 *     responses:
 *        200:
 *          description: Successful response
 *          content:
 *             application/json:
 *               schema:
 *                $ref: '#/components/shemes/changeAvatarApiResponse'
 *        400:
 *          description: Avatar file is missing or in wrong format or bigger then 10 mb
 *        401:
 *          description: Missing header with authorization token
 */

router.patch(
  "/avatars",
  auth,
  upload.single("avatar"),
  async (req, res, next) => {
    const _id = req.user;

    const path = req.file ? req.file.path : "";
    if (_id && path) {
      const { email } = await getUserById(_id);
      const image = await resizeAndSave(path, email);
      const avatarURL =
        req.protocol + "://" + req.headers.host + req.path + "/" + image;
      if (await updateUser(_id, { avatarURL })) {
        return res.json({
          avatarURL,
        });
      }
    }
    return next(new Error());
  }
);

/**
 * @openapi
 *
 * /api/users/verify/{verificationToken}:
 *   get:
 *     tags:
 *        - Users
 *     description: Verificate user email
 *     parameters:
 *      - $ref: '#/components/parameters/verificationToken'
 *     responses:
 *        200:
 *          description: Verification successful
 *        400:
 *          description: Verification token is mising
 *        404:
 *          description: User for verification Not Found
 */

router.get("/verify/:verificationToken", checkData, async (req, res, next) => {
  const verificationToken = req.params.verificationToken;
  const user = await verifyUser(verificationToken);
  if (user) {
    return res.json({
      message: "Verification successful",
    });
  }
  return next(userNotFoundError);
});

/**
 * @openapi
 *
 * /api/users/verify:
 *   post:
 *     tags:
 *        - Users
 *     description: Resending verification email
 *     requestBody:
 *      required: true
 *      content:
 *       application/json:
 *        schema:
 *            $ref: '#/components/requestBodies/emailVerification'
 *     responses:
 *        200:
 *          description: Successful response, Verification email sent
 *        400:
 *          description: Verification has already been passed or missing required field email
 */

router.post("/verify", checkData, async (req, res, next) => {
  const { email } = req.body;
  if (isUserVerified(email)) {
    return next(verificationError);
  }
  const verificationToken = await getVerificationToken(email);
  const verificationUrl = getVerificationUrl(req, verificationToken);
  sendVerificationMail(email, verificationUrl)
    .then(() => {
      return res.json({
        message: "Verification email sent",
      });
    })
    .catch(next);
});

module.exports = router;
