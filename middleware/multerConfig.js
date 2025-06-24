// middleware/multerConfig.js
const multer = require("multer");

const storage = multer.memoryStorage(); // No usa disco, ideal para producción

const fileFilter = (req, file, cb) => {
  const ext = file.originalname.toLowerCase();
  if (/\.(jpg|jpeg|png|gif)$/.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes"));
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
