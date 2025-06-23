// middlewares/multerConfig.js
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".gif"].includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes"));
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;

