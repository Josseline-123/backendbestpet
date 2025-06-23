const jwt = require('jsonwebtoken');


const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;


  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }


  const token = authHeader.split(' ')[1]; // Obtener solo el token


  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;  // <-- Aquí asignamos a req.user
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};


module.exports = authMiddleware;

