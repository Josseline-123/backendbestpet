module.exports = (sequelize, DataTypes) => { 
  const Carrito = sequelize.define('Carrito', {
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
      },
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuarios', // nombre de la tabla Usuario en plural (ajusta si usas otro)
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    productoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Productos', // nombre de la tabla Producto en plural
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  });

  Carrito.associate = function(models) {
    Carrito.belongsTo(models.Usuario, { foreignKey: 'usuarioId' });
    Carrito.belongsTo(models.Producto, { foreignKey: 'productoId' });
  };

  return Carrito;
};
