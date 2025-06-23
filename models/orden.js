module.exports = (sequelize, DataTypes) => {
  const Orden = sequelize.define("Orden", {
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    estado: {
      type: DataTypes.STRING,
      defaultValue: "pendiente"
    }
  });


  Orden.associate = (models) => {
    Orden.belongsTo(models.Usuario, { foreignKey: "usuarioId" });
    Orden.belongsToMany(models.Producto, {
      through: models.OrdenProducto,
      foreignKey: "ordenId"
    });
  };


  return Orden;
};

