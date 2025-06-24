const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Cloudinary tomará automáticamente CLOUDINARY_URL desde el entorno
cloudinary.config(); 

module.exports = cloudinary;



