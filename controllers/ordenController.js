const { Orden, OrdenProducto, Producto, Usuario, Carrito } = require('../models');

// POST /api/ordenes
const crearOrden = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    // Obtener los productos del carrito del usuario
    const carrito = await Carrito.findAll({
      where: { usuarioId },
      include: [Producto],
    });

    if (!carrito.length) {
      return res.status(400).json({ mensaje: 'El carrito está vacío' });
    }

    // Crear nueva orden
    const nuevaOrden = await Orden.create({ usuarioId });

    // Agregar productos a la orden
    for (let item of carrito) {
      await OrdenProducto.create({
        ordenId: nuevaOrden.id,
        productoId: item.productoId,
        cantidad: item.cantidad
      });
    }

    // Vaciar el carrito
    await Carrito.destroy({ where: { usuarioId } });

    res.status(201).json({
      mensaje: 'Orden creada con éxito',
      ordenId: nuevaOrden.id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear la orden' });
  }
};

// GET /api/ordenes/mias
const obtenerMisOrdenes = async (req, res) => {
  try {
    const ordenes = await Orden.findAll({
      where: { usuarioId: req.usuario.id },
      include: [
        {
          model: Producto,
          through: { attributes: ['cantidad'] }
        }
      ]
    });

    res.json(ordenes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener tus órdenes' });
  }
};

// GET /api/ordenes/:id
const obtenerOrdenPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const orden = await Orden.findByPk(id, {
      include: [
        {
          model: Producto,
          through: { attributes: ['cantidad'] }
        },
        {
          model: Usuario,
          attributes: ['id', 'nombre', 'email']
        }
      ]
    });

    if (!orden) return res.status(404).json({ mensaje: 'Orden no encontrada' });

    if (orden.usuarioId !== req.usuario.id) {
      return res.status(403).json({ mensaje: 'Acceso no autorizado' });
    }

    res.json(orden);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener la orden' });
  }
};

// PUT /api/ordenes/:id
const marcarOrdenComoCompletada = async (req, res) => {
  const { id } = req.params;

  try {
    const orden = await Orden.findByPk(id);

    if (!orden) return res.status(404).json({ mensaje: 'Orden no encontrada' });

    if (orden.usuarioId !== req.usuario.id) {
      return res.status(403).json({ mensaje: 'No tienes permiso para actualizar esta orden' });
    }

    orden.estado = 'completada';
    await orden.save();

    res.json({ mensaje: 'Orden actualizada', orden });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar la orden' });
  }
};

module.exports = {
  crearOrden,
  obtenerMisOrdenes,
  obtenerOrdenPorId,
  marcarOrdenComoCompletada,
};
