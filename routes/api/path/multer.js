const multer = require("multer");
const path = require("path");

const upload = multer({
  dest:  path.resolve(path.dirname(require.main.filename), "tmp"),
  limits: {
    fileSize: 10485760, // 10MB in bytes
  },
});

module.exports = upload;
