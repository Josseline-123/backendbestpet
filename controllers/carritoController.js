const { Carrito, Producto, Usuario } = require('../models');

// ✅ Agregar producto al carrito
const agregarAlCarrito = async (req, res) => {
  const { productoId, cantidad } = req.body;
  const usuarioId = req.user.id;

  try {
    // Verificar si el producto existe y obtener al vendedor
    const producto = await Producto.findByPk(productoId);

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Evitar que el usuario compre su propio producto
    if (producto.usuarioId === usuarioId) {
      return res.status(400).json({ error: 'No puedes comprar tu propio producto' });
    }

    const existente = await Carrito.findOne({
      where: { usuarioId, productoId }
    });

    if (existente) {
      existente.cantidad += cantidad;
      await existente.save();
      return res.json(existente);
    }

    const nuevoItem = await Carrito.create({
      usuarioId,
      productoId,
      cantidad
    });

    res.status(201).json(nuevoItem);
  } catch (error) {
    console.error('❌ Error al agregar al carrito:', error);
    res.status(500).json({ error: 'Error al agregar al carrito' });
  }
};

// ✅ Obtener carrito del usuario con datos del producto y del vendedor
const obtenerCarrito = async (req, res) => {
  console.log('🚀 Petición a obtenerCarrito recibida, userId:', req.user?.id);

  try {
    const usuarioId = req.user.id;

    const items = await Carrito.findAll({
      where: { usuarioId },
      include: [
        {
          model: Producto,
          as: 'Producto',
          include: [
            {
              model: Usuario,
              as: 'vendedor',
              attributes: ['id', 'nombre', 'email']
            }
          ]
        }
      ]
    });

    console.log('📦 Carrito con productos y vendedores:', JSON.stringify(items, null, 2));

    res.json(items);
  } catch (error) {
    console.error('❌ Error al obtener el carrito:', error);
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
};

// ✅ Eliminar ítem específico del carrito
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
    console.error('❌ Error al eliminar del carrito:', error);
    res.status(500).json({ error: 'Error al eliminar del carrito' });
  }
};

// ✅ Eliminar todo el carrito
const eliminarCarrito = async (req, res) => {
  try {
    await Carrito.destroy({ where: { usuarioId: req.user.id } });
    res.status(200).json({ mensaje: 'Carrito eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar el carrito:', error);
    res.status(500).json({ error: 'Error al eliminar el carrito' });
  }
};

module.exports = {
  agregarAlCarrito,
  obtenerCarrito,
  eliminarDelCarrito,
  eliminarCarrito
};
