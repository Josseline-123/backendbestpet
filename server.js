require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

// Ruta raíz para probar que el servidor funciona
app.get('/', (req, res) => {
  res.send('API BestPet funcionando correctamente 🚀');
});

// Declarar allowedOrigins una sola vez
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://pffronend.vercel.app'
];

// Configuración CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Servir archivos de imágenes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Importar y usar rutas
const ordenRoutes = require('./routes/ordenRoutes');
const productoRoutes = require('./routes/productoRoutes');
const authRoutes = require('./routes/authRoutes');
const carritoRoutes = require('./routes/carritoRoutes');

app.use('/api/ordenes', ordenRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/carrito', carritoRoutes);

// Conexión a la base de datos y servidor
const { sequelize } = require('./models');
const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Base de datos sincronizada');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error al sincronizar la base de datos:', err);
  });
