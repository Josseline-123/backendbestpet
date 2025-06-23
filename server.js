require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/ordenes', require('./routes/ordenRoutes'));
app.use('/api/productos', require('./routes/productoRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/carrito', require('./routes/carritoRoutes'));

const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos exitosa');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error al conectar con la base de datos:', error);
  });
