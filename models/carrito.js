module.exports = (sequelize, DataTypes) => {
  const Carrito = sequelize.define('Carrito', {
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  });

  Carrito.associate = function(models) {
    Carrito.belongsTo(models.Usuario, { foreignKey: 'usuarioId' });
    Carrito.belongsTo(models.Producto, { foreignKey: 'productoId' });
  };

  return Carrito;
};
