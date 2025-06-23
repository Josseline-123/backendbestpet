const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  agregarAlCarrito,
  obtenerCarrito,
  eliminarDelCarrito,
  eliminarCarrito,
} = require('../controllers/carritoController');

router.get('/', authMiddleware, obtenerCarrito);
router.post('/', authMiddleware, agregarAlCarrito);
router.delete('/:id', authMiddleware, eliminarDelCarrito);
router.delete('/', authMiddleware, eliminarCarrito); // <<--- Esta es la que se usa en el Checkout

module.exports = router;


