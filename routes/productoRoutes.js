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

// Rutas públicas (sin auth)
router.get('/filtro', filtrarProductos);
router.get('/', obtenerProductos);

// Rutas protegidas (requieren token)
router.get('/mios', authMiddleware, obtenerMisProductos);

router.post(
  '/',
  authMiddleware,
  upload.single('imagen'),   // el campo form-data debe llamarse "imagen"
  crearProducto
);

router.put(
  '/:id',
  authMiddleware,
  upload.single('imagen'),
  editarProducto
);

router.delete('/:id', authMiddleware, eliminarProducto);

module.exports = router;


