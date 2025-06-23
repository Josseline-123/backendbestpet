const { Sequelize, DataTypes } = require('sequelize');

// Modelos
const ProductoModel = require('./producto');
const UsuarioModel = require('./usuario');
const OrdenModel = require('./orden');
const OrdenProductoModel = require('./ordenProducto');
const CarritoModel = require('./carrito');

let sequelize;

// 🌐 Producción (Render) con DATABASE_URL y SSL
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
  // 💻 Desarrollo local
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST,
      dialect: 'postgres',
    }
  );
}

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Inicialización de modelos
db.Usuario = UsuarioModel(sequelize, DataTypes);
db.Producto = ProductoModel(sequelize, DataTypes);
db.Orden = OrdenModel(sequelize, DataTypes);
db.OrdenProducto = OrdenProductoModel(sequelize, DataTypes);
db.Carrito = CarritoModel(sequelize, DataTypes);

// Relaciones
db.Usuario.hasMany(db.Producto, { foreignKey: 'usuarioId' });
db.Producto.belongsTo(db.Usuario, { foreignKey: 'usuarioId' });

db.Usuario.hasMany(db.Orden, { foreignKey: 'usuarioId' });
db.Orden.belongsTo(db.Usuario, { foreignKey: 'usuarioId' });

db.Orden.belongsToMany(db.Producto, {
  through: db.OrdenProducto,
  foreignKey: 'ordenId',
});
db.Producto.belongsToMany(db.Orden, {
  through: db.OrdenProducto,
  foreignKey: 'productoId',
});

// Asociaciones definidas en modelos
Object.values(sequelize.models).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(sequelize.models);
  }
});

module.exports = db;







