// Crear nuevo producto
const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoria } = req.body;
    let imagenUrl = null;

    // ✅ Validar categoría permitida
    const categoriasValidas = ['perros', 'gatos', 'otras-mascotas'];
    if (!categoriasValidas.includes(categoria)) {
      return res.status(400).json({ error: 'Categoría no válida' });
    }

    // ✅ Validar que el precio sea un número válido y positivo
    const precioNumero = parseFloat(precio);
    if (isNaN(precioNumero) || precioNumero <= 0) {
      return res.status(400).json({ error: 'Precio inválido' });
    }

    // ✅ Subir imagen a Cloudinary si hay
    if (req.file) {
      const result = await subirImagenCloudinary(req.file.buffer);
      imagenUrl = result.secure_url;
    }

    const nuevoProducto = await Producto.create({
      nombre,
      descripcion,
      precio: precioNumero, // guardamos como número
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

