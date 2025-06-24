const { Producto } = require('../models');
const { Op } = require('sequelize');
const cloudinary = require('../config/cloudinaryConfig');
const streamifier = require('streamifier');

// Función auxiliar para subir imagen a Cloudinary desde buffer
const subirImagenCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'productos-bestpet' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

// Crear nuevo producto
const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoria } = req.body;
    let imagenUrl = null;

    // Si viene una imagen, súbela a Cloudinary desde el buffer
    if (req.file) {
      const result = await subirImagenCloudinary(req.file.buffer);
      imagenUrl = result.secure_url;
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

    // Subir nueva imagen si hay archivo, desde buffer
    if (req.file) {
      const result = await subirImagenCloudinary(req.file.buffer);
      req.body.imagen = result.secure_url;
    }

    await producto.update(req.body);
    res.json(producto);
  } catch (error) {
    console.error('❌ Error al editar producto:', error);
    res.status(500).json({ error: error.message || 'Error al editar producto' });
  }
};

// ... el resto queda igual (obtenerProductos, obtenerMisProductos, eliminarProducto, filtrarProductos)

module.exports = {
  crearProducto,
  obtenerProductos,
  obtenerMisProductos,
  editarProducto,
  eliminarProducto,
  filtrarProductos,
};
