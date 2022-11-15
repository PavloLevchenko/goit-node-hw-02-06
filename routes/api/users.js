const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const { auth } = require("./jwtMiddleware");
const { checkParams } = require("./dataMiddleware");
const { emailError, loginError } = require("./httpErrors");

const secret = process.env.SECRET;
const {
  checkUserEmail,
  getUserByEmail,
  addUser,
  updateUser,
} = require("../../database");
const {
  userSignupSchema,
  userUpdateSubscriptionSchema,
} = require("../validation/users");
const upload = require("./path/multer");
const resizeAndSave = require("./path/jimp");

router.post("/signup", async (req, res, next) => {
  res.shema = userSignupSchema;
  next();
});

router.post("/login", async (req, res, next) => {
  res.shema = userSignupSchema;
  next();
});

router.patch("/", async (req, res, next) => {
  res.shema = userUpdateSubscriptionSchema;
  next();
});

router.use(checkParams);

router.post("/signup", async (req, res, next) => {
  const { mail } = req.value;
  const emailIsBusy = await checkUserEmail(mail);
  if (emailIsBusy) {
    return next(emailError);
  }
  const avatarURL = gravatar.url(mail, { s: "250" });
  const user = await addUser({ ...req.value, avatarURL });
  const { email, subscription } = user;
  res.status(201).json({
    status: "Created",
    code: 201,
    data: {
      user: { email, subscription },
    },
  });
});

router.post("/login", async (req, res, next) => {
  let user = await getUserByEmail(req.value);
  const { password } = req.value;
  if (!user || !(await user.validPassword(password))) {
    return next(loginError);
  }
  const payload = {
    id: user.id,
  };

  const token = jwt.sign(payload, secret, { expiresIn: "10h" });
  user = await updateUser(user.id, { token });

  const { email, subscription } = user;
  res.json({
    status: "success",
    code: 200,
    data: {
      token,
      user: { email, subscription },
    },
  });
});

router.get("/logout", auth, async (req, res, next) => {
  const { _id } = req.user;
  if (_id) {
    await updateUser(_id, { token: null });
    res.json({
      status: "No Content",
      code: 204,
    });
  }
});

router.get("/current", auth, async (req, res, next) => {
  const user = req.user;
  if (user) {
    const { email, subscription } = user;
    res.json({
      status: "success",
      code: 200,
      data: {
        user: { email, subscription },
      },
    });
  }
});

router.patch("/", auth, async (req, res, next) => {
  const { _id } = req.user;

  if (_id) {
    const user = await updateUser(_id, req.value);
    if (user) {
      const { email, subscription } = user;
      return res.json({
        status: "Subscription updated",
        code: 200,
        data: {
          user: { email, subscription },
        },
      });
    }
    return next(new Error());
  }
});

router.patch(
  "/avatars",
  auth,
  upload.single("avatar"),
  async (req, res, next) => {
    const user = req.user;
    const path = req.file ? req.file.path : "";
    if (user && path) {
      const { _id, email } = user;
      const image = await resizeAndSave(path, email);
      const avatarURL =
        req.protocol + "://" + req.headers.host + req.path + "/" + image;
      if (await updateUser(_id, { avatarURL })) {
        return res.status(200).json({
          data: {
            avatarURL,
          },
        });
      }
    }
    return next(new Error());
  }
);

module.exports = router;
