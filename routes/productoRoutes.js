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

// Filtrar productos (público)
router.get('/filtro', filtrarProductos);


// Listar todos los productos (público)
router.get('/', obtenerProductos);

// Listar productos del usuario logueado (protegido)
router.get('/mios', authMiddleware, obtenerMisProductos);

// Crear producto con imagen (protegido + multer)
router.post(
  '/',
  authMiddleware,
  upload.single('imagen'),   // el campo form-data debe llamarse "imagen"
  crearProducto
);

// Editar producto (incluye posible nueva imagen)
router.put(
  '/:id',
  authMiddleware,
  upload.single('imagen'),
  editarProducto
);

// Eliminar producto
router.delete('/:id', authMiddleware, eliminarProducto);

module.exports = router;

