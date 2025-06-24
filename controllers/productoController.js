const { Producto } = require('../models');
const { Op } = require('sequelize');

// Crear nuevo producto
const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoria } = req.body;
    const imagen = req.file ? req.file.filename : null;

    const nuevoProducto = await Producto.create({
      nombre,
      descripcion,
      precio,
      categoria,
      imagen,
      usuarioId: req.user.id, // middleware auth debe definir req.user
    });

    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
};

// Obtener todos los productos (público)
const obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll();
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

// Obtener productos del usuario autenticado
const obtenerMisProductos = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const productos = await Producto.findAll({ where: { usuarioId } });
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos del usuario:', error);
    res.status(500).json({ error: 'Error al obtener tus productos' });
  }
};

// Editar producto (solo propietario)
const editarProducto = async (req, res) => {
  try {
    const id = req.params.id;
    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    if (producto.usuarioId !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permiso para editar este producto' });
    }

    await producto.update(req.body);
    res.json(producto);
  } catch (error) {
    console.error('Error al editar producto:', error);
    res.status(500).json({ error: 'Error al editar producto' });
  }
};

// Eliminar producto (solo propietario)
const eliminarProducto = async (req, res) => {
  try {
    const id = req.params.id;
    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    if (producto.usuarioId !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este producto' });
    }

    await producto.destroy();
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};

// Filtrar productos por categoría y rango de precio (público)
const filtrarProductos = async (req, res) => {
  try {
    const { categoria, precioMin, precioMax } = req.query;
    const condiciones = {};

    if (categoria) condiciones.categoria = categoria;
    if (precioMin || precioMax) {
      condiciones.precio = {};
      if (precioMin) condiciones.precio[Op.gte] = parseFloat(precioMin);
      if (precioMax) condiciones.precio[Op.lte] = parseFloat(precioMax);
    }

    const productos = await Producto.findAll({ where: condiciones });
    res.json(productos);
  } catch (error) {
    console.error('Error al filtrar productos:', error);
    res.status(500).json({ error: 'Error al filtrar productos' });
  }
};

module.exports = {
  crearProducto,
  obtenerProductos,
  obtenerMisProductos,
  editarProducto,
  eliminarProducto,
  filtrarProductos,
};
