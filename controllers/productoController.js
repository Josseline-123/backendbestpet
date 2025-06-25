// Importaciones necesarias
const { Producto } = require('../models');
const { subirImagenCloudinary } = require('../utils/cloudinary');

// Crear nuevo producto
const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoria } = req.body;
    let imagenUrl = null;

    // Validar categoría permitida
    const categoriasValidas = ['perros', 'gatos', 'otras-mascotas'];
    if (!categoriasValidas.includes(categoria)) {
      return res.status(400).json({ error: 'Categoría no válida' });
    }

    // Validar que el precio sea un número válido y positivo
    const precioNumero = parseFloat(precio);
    if (isNaN(precioNumero) || precioNumero <= 0) {
      return res.status(400).json({ error: 'Precio inválido' });
    }

    // Subir imagen a Cloudinary si hay
    if (req.file) {
      const result = await subirImagenCloudinary(req.file.buffer);
      imagenUrl = result.secure_url;
    }

    // Crear producto en la base de datos
    const nuevoProducto = await Producto.create({
      nombre,
      descripcion,
      precio: precioNumero,
      categoria,
      imagen: imagenUrl,
      usuarioId: req.user.id, // Asumiendo que tienes middleware que setea req.user
    });

    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error('❌ Error al crear producto:', error);
    res.status(500).json({ error: error.message || 'Error al crear producto' });
  }
};

// Obtener todos los productos
const obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll();
    res.json(productos);
  } catch (error) {
    console.error('❌ Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

// Obtener productos del usuario logueado
const obtenerMisProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll({
      where: { usuarioId: req.user.id }
    });
    res.json(productos);
  } catch (error) {
    console.error('❌ Error al obtener mis productos:', error);
    res.status(500).json({ error: 'Error al obtener mis productos' });
  }
};

// Editar un producto por id
const editarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, categoria } = req.body;
    let imagenUrl;

    // Buscar producto y validar que pertenece al usuario
    const producto = await Producto.findOne({ where: { id, usuarioId: req.user.id } });
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado o no autorizado' });
    }

    // Si hay nueva imagen, subir a Cloudinary
    if (req.file) {
      const result = await subirImagenCloudinary(req.file.buffer);
      imagenUrl = result.secure_url;
    }

    // Actualizar datos
    producto.nombre = nombre || producto.nombre;
    producto.descripcion = descripcion || producto.descripcion;
    producto.precio = precio ? parseFloat(precio) : producto.precio;
    producto.categoria = categoria || producto.categoria;
    if (imagenUrl) producto.imagen = imagenUrl;

    await producto.save();

    res.json(producto);
  } catch (error) {
    console.error('❌ Error al editar producto:', error);
    res.status(500).json({ error: error.message || 'Error al editar producto' });
  }
};

// Eliminar un producto por id
const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar producto y validar que pertenece al usuario
    const producto = await Producto.findOne({ where: { id, usuarioId: req.user.id } });
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado o no autorizado' });
    }

    await producto.destroy();

    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar producto:', error);
    res.status(500).json({ error: error.message || 'Error al eliminar producto' });
  }
};

// Filtrar productos por categoría o rango de precio
const filtrarProductos = async (req, res) => {
  try {
    const { categoria, precioMin, precioMax } = req.query;
    const where = {};

    if (categoria) {
      where.categoria = categoria;
    }
    if (precioMin) {
      where.precio = { ...where.precio, $gte: parseFloat(precioMin) };
    }
    if (precioMax) {
      where.precio = { ...where.precio, $lte: parseFloat(precioMax) };
    }

    const productos = await Producto.findAll({ where });
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
