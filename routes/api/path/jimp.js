const Jimp = require("jimp");
const path = require("path");
const { unlink } = require("fs/promises");

const resizeAndSave = (filePath, userEmail) =>
  Jimp.read(filePath)
    .then((avatar) => {
      const dest = path.resolve(
        path.dirname(require.main.filename),
        "public/avatars"
      );
      const image = userEmail + "." + avatar.getExtension();
      const imagePath = path.join(dest, image);
      return avatar
        .resize(250, 250)
        .writeAsync(imagePath)
        .then(() => {
          unlink(filePath);
          return image;
        });
    })
    .catch((err) => {
      console.error(err);
    });

module.exports = resizeAndSave;
