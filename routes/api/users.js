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

router.get("/logout", auth, async (req, res, next) => {
  const _id = req.user;

  if (_id) {
    await updateUser(_id, { token: null });
    res.status(204).json();
  }
  return next(new Error());
});

router.get("/current", auth, async (req, res, next) => {
  const _id = req.user;
  const user = await getUserById(_id);
  if (user) {
    const { email, subscription } = user;
    res.json({
      user: { email, subscription },
    });
  }
  return next(new Error());
});

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
