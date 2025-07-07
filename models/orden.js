module.exports = (sequelize, DataTypes) => {
  const Orden = sequelize.define('Orden', {
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pendiente',
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
  }, {
    tableName: 'Ordenes',
    timestamps: true,
  });

  Orden.associate = function(models) {
    Orden.belongsTo(models.Usuario, {
      foreignKey: 'usuarioId',
      as: 'Usuario',
    });

    Orden.belongsToMany(models.Producto, {
      through: models.OrdenProducto,
      foreignKey: 'ordenId',
      as: 'productos',
    });
  };

  return Orden;
};
