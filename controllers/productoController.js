const { Producto } = require('../models');
const { Op } = require('sequelize');
const cloudinary = require('../config/cloudinaryConfig');
const fs = require('fs');
const path = require('path');

// Crear nuevo producto
const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoria } = req.body;
    let imagenUrl = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'productos-bestpet',
      });
      imagenUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const nuevoProducto = await Producto.create({
      nombre,
      descripcion,
      precio,
      categoria,
      imagen: imagenUrl,
      usuarioId: req.user.id,
    });

    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error('❌ Error al crear producto:', error);
    res.status(500).json({ error: error.message || 'Error al crear el producto' });
  }
};


// Obtener todos los productos (público)
const obtenerProductos = async (_req, res) => {
  try {
    const productos = await Producto.findAll();
    res.json(productos);
  } catch (error) {
    console.error('❌ Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

// Obtener productos del usuario autenticado
const obtenerMisProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll({ where: { usuarioId: req.user.id } });
    res.json(productos);
  } catch (error) {
    console.error('❌ Error al obtener tus productos:', error);
    res.status(500).json({ error: 'Error al obtener tus productos' });
  }
};

// Editar producto
const editarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    if (producto.usuarioId !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permiso para editar este producto' });
    }

    // Subir nueva imagen si hay archivo
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'productos-bestpet',
      });
      fs.unlinkSync(req.file.path);
      req.body.imagen = result.secure_url;
    }

    await producto.update(req.body);
    res.json(producto);
  } catch (error) {
    console.error('❌ Error al editar producto:', error);
    res.status(500).json({ error: 'Error al editar producto' });
  }
};

// Eliminar producto
const eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    if (producto.usuarioId !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este producto' });
    }

    await producto.destroy();
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    console.error('❌ Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};

// Filtrar productos
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
    console.error('❌ Error al filtrar productos:', error);
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
