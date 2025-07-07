module.exports = (sequelize, DataTypes) => {
  const OrdenProducto = sequelize.define('OrdenProducto', {
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
      },
    },
    ordenId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Ordenes',
        key: 'id',
      },
    },
    productoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Productos',
        key: 'id',
      },
    },
  }, {
    tableName: 'OrdenProductos',
    timestamps: false,
  });

  return OrdenProducto;
};
