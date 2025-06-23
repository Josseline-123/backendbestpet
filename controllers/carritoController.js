const { Carrito, Producto } = require('../models');

// Agregar producto al carrito
const agregarAlCarrito = async (req, res) => {
  const { productoId, cantidad } = req.body;
  const usuarioId = req.user.id;

  try {
    const existente = await Carrito.findOne({ where: { usuarioId, productoId } });

    if (existente) {
      existente.cantidad += cantidad;
      await existente.save();
      return res.json(existente);
    }

    const item = await Carrito.create({ usuarioId, productoId, cantidad });
    res.status(201).json(item);
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    res.status(500).json({ error: 'Error al agregar al carrito' });
  }
};

// Obtener carrito del usuario
const obtenerCarrito = async (req, res) => {
  try {
    const usuarioId = req.user.id;

    const items = await Carrito.findAll({
      where: { usuarioId },
      include: [{ model: Producto }],
    });

    res.json(items); // Devuelve un array de ítems
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
};

// Eliminar un ítem específico del carrito
const eliminarDelCarrito = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Carrito.findByPk(id);

    if (!item || item.usuarioId !== req.user.id) {
      return res.status(404).json({ error: 'No encontrado o sin permiso' });
    }

    await item.destroy();
    res.json({ message: 'Item eliminado del carrito' });
  } catch (error) {
    console.error('Error al eliminar del carrito:', error);
    res.status(500).json({ error: 'Error al eliminar del carrito' });
  }
};

// Eliminar todo el carrito del usuario
const eliminarCarrito = async (req, res) => {
  try {
    await Carrito.destroy({ where: { usuarioId: req.user.id } });
    res.status(200).json({ mensaje: 'Carrito eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el carrito:', error);
    res.status(500).json({ error: 'Error al eliminar el carrito' });
  }
};

module.exports = {
  agregarAlCarrito,
  obtenerCarrito,
  eliminarDelCarrito,
  eliminarCarrito, // <<--- Esto es lo que te faltaba
};
