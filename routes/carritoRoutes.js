const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  agregarAlCarrito,
  obtenerCarrito,
  eliminarDelCarrito,
  eliminarCarrito,
} = require('../controllers/carritoController');

// Obtener los items del carrito del usuario autenticado
router.get('/', authMiddleware, obtenerCarrito);

// Agregar un producto al carrito del usuario autenticado
router.post('/', authMiddleware, agregarAlCarrito);

// Eliminar un item específico del carrito por su id
router.delete('/:id', authMiddleware, eliminarDelCarrito);

// Eliminar todo el carrito del usuario (por ejemplo, en el checkout)
router.delete('/', authMiddleware, eliminarCarrito);

module.exports = router;



