const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  dest: path.resolve("../../public", "tmp"),
});

const upload = multer({
  dest: "../../tmp",
  limits: {
    fileSize: 10485760, // 10MB in bytes
  },
});

module.exports = {
  upload,
};
