// routes/productoRoutes.js
const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/multerConfig');

const {
  crearProducto,
  obtenerProductos,
  obtenerMisProductos,
  editarProducto,
  eliminarProducto,
  filtrarProductos
} = require('../controllers/productoController');

// ✅ Rutas públicas
router.get('/', obtenerProductos);
router.get('/filtro', filtrarProductos);

// ✅ Rutas privadas (protegidas con token)
router.get('/mios', authMiddleware, obtenerMisProductos);

router.post(
  '/',
  authMiddleware,
  upload.single('imagen'), // campo en form-data debe ser 'imagen'
  crearProducto
);

router.put(
  '/:id',
  authMiddleware,
  upload.single('imagen'), // si viene nueva imagen se sube a Cloudinary
  editarProducto
);

router.delete('/:id', authMiddleware, eliminarProducto);

module.exports = router;



