const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { Orden, OrdenProducto } = require('../models');

// POST /api/ordenes
router.post('/', authMiddleware, async (req, res) => {
  const usuarioId = req.user.id; // asegúrate que en el authMiddleware usas req.usuario
  const { productos } = req.body; // Array de productos: [{ productoId, cantidad }]

  if (!productos || !Array.isArray(productos) || productos.length === 0) {
    return res.status(400).json({ error: 'Debes enviar al menos un producto para la orden.' });
  }

  try {
    // 1. Crear la orden
    const nuevaOrden = await Orden.create({ usuarioId });

    // 2. Agregar productos a la orden (relación muchos a muchos)
    for (const item of productos) {
      await OrdenProducto.create({
        ordenId: nuevaOrden.id,
        productoId: item.productoId,
        cantidad: item.cantidad
      });
    }

    res.status(201).json({
      mensaje: 'Orden creada exitosamente',
      ordenId: nuevaOrden.id
    });
  } catch (error) {
    console.error('Error al crear orden:', error);
    res.status(500).json({ error: 'Error al crear la orden' });
  }
});

module.exports = router;

