const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const register = async (req, res) => {
  const { nombre, email, password } = req.body;
  console.log('🔐 Email recibido:', email);
  console.log('🔐 Password recibido:', password);

  if (!nombre || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password: hashedPassword,
    });

    // Generar token
    const token = jwt.sign(
      { id: nuevoUsuario.id },
      process.env.SECRET_KEY,
      { expiresIn: '1d' }
    );

    // Enviar respuesta
    res.status(201).json({
      message: 'Usuario creado exitosamente',
      token,
      user: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
      },
    });

  } catch (error) {
    console.error('❌ Error en el registro:', error);
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;
  console.log('🔐 Login recibido con email:', email);

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const esPasswordValido = await bcrypt.compare(password, usuario.password);
    if (!esPasswordValido) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: usuario.id },
      process.env.SECRET_KEY,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
      },
    });
  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};

module.exports = { register, login };
