module.exports = (sequelize, DataTypes) => {
  const OrdenProducto = sequelize.define("OrdenProducto", {
    ordenId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Orden', // nombre de la tabla en la DB
        key: 'id'
      }
    },
    productoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Productos',
        key: 'id'
      }
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  return OrdenProducto;
};

