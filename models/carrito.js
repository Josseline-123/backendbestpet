module.exports = (sequelize, DataTypes) => {
  const Carrito = sequelize.define('Carrito', {
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: { min: 1 },
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuarios',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    productoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Productos',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  }, {
    tableName: 'Carritos',
    timestamps: true,
  });

  Carrito.associate = function(models) {
    Carrito.belongsTo(models.Usuario, { foreignKey: 'usuarioId', as: 'Usuario' });
    Carrito.belongsTo(models.Producto, { foreignKey: 'productoId', as: 'Producto' });
  };

  return Carrito;
};
