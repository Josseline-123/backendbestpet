const multer = require("multer");

// Guardar archivo temporal en disco para luego subirlo a Cloudinary
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // carpeta temporal
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

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
