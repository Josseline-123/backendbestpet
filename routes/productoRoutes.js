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

// Rutas públicas
router.get('/', obtenerProductos);
router.get('/filtro', filtrarProductos);

// Rutas privadas (requieren token)
router.get('/mios', authMiddleware, obtenerMisProductos);
router.post('/', authMiddleware, upload.single('imagen'), crearProducto);
router.put('/:id', authMiddleware, upload.single('imagen'), editarProducto);
router.delete('/:id', authMiddleware, eliminarProducto);

module.exports = router;

