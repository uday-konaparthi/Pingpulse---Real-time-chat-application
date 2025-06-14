const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const messageStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "pingpulse/messages",
      resource_type: "auto", // auto-detect image/video
      format: file.mimetype.split("/")[1], // extract format from mime
    };
  },
});

const upload = multer({ storage: messageStorage });

module.exports = upload;
