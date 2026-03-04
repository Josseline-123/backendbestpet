require('dotenv').config(); // ✅ Cargar variables del archivo .env

const { Sequelize, DataTypes } = require('sequelize');

const ProductoModel = require('./producto');
const UsuarioModel = require('./usuario');
const OrdenModel = require('./orden');
const OrdenProductoModel = require('./ordenProducto');
const CarritoModel = require('./carrito');

let sequelize;

// ✅ Si estás en producción (Render, Railway), usar DATABASE_URL
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
} else {
  // ✅ En desarrollo local o Docker
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS, // ✅ Aquí está el cambio importante
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: false,
    }
  );
}

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Usuario = UsuarioModel(sequelize, DataTypes);
db.Producto = ProductoModel(sequelize, DataTypes);
db.Orden = OrdenModel(sequelize, DataTypes);
db.OrdenProducto = OrdenProductoModel(sequelize, DataTypes);
db.Carrito = CarritoModel(sequelize, DataTypes);

// Asociaciones (si tus modelos las definen)
Object.values(db).forEach(model => {
  if (model.associate) {
    model.associate(db);
  }
});

module.exports = db;












