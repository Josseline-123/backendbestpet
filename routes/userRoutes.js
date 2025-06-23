const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { Usuario, Producto } = require('../models');


router.get('/perfil', authMiddleware, async (req, res) => {
  try {
    const usuarioId = req.user.id;
   
    // Buscar usuario y sus productos
    const usuario = await Usuario.findByPk(usuarioId, {
      attributes: ['id', 'nombre', 'email'], // Ajusta según tus campos
      include: [{
        model: Producto,
        as: 'productos',  // Verifica la asociación en tu modelo
      }],
    });


    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }


    res.json(usuario);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
});


module.exports = router;
