module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'Usuarios',
    timestamps: true,
  });

  Usuario.associate = function(models) {
    Usuario.hasMany(models.Producto, {
      foreignKey: 'usuarioId',
      as: 'productos'
    });

    Usuario.hasMany(models.Orden, {
      foreignKey: 'usuarioId',
      as: 'ordenes'
    });

    Usuario.hasMany(models.Carrito, {
      foreignKey: 'usuarioId',
      as: 'carritoItems'
    });
  };

  return Usuario;
};
