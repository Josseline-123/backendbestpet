const { Sequelize, DataTypes } = require('sequelize');

const ProductoModel = require('./producto');
const UsuarioModel = require('./usuario');
const OrdenModel = require('./orden');
const OrdenProductoModel = require('./ordenProducto');
const CarritoModel = require('./carrito');

let sequelize;

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
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST,
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

// Ejecutar asociaciones
Object.values(db).forEach(model => {
  if (model.associate) {
    model.associate(db);
  }
});

module.exports = db;












