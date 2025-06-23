require('dotenv').config(); // 👈 Importante para que .env funcione

const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

const allowedOrigins = ['https://pffronend.vercel.app', 'http://localhost:5173'];

app.use(cors({
  origin: function(origin, callback) {
    // Permite solicitudes sin origen (como Postman o curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `La política CORS no permite acceso desde el origen: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // si usas cookies o headers con credenciales
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const ordenRoutes = require('./routes/ordenRoutes');
const productoRoutes = require('./routes/productoRoutes');
const authRoutes = require('./routes/authRoutes');
const carritoRoutes = require('./routes/carritoRoutes');

app.use('/api/ordenes', ordenRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/carrito', carritoRoutes);

const { sequelize } = require('./models');
const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Base de datos sincronizada');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error al sincronizar la base de datos:', err);
  });
