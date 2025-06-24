module.exports = (sequelize, DataTypes) => {
  const Producto = sequelize.define('Producto', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    precio: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: {
          msg: 'El precio debe ser un número válido',
        },
        min: {
          args: [0.01],
          msg: 'El precio debe ser mayor a 0',
        }
      },
    },
    descripcion: {
      type: DataTypes.TEXT,
    },
    imagen: {
      type: DataTypes.STRING,
    },
    categoria: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuarios',
        key: 'id',
      },
    },
  });

  Producto.associate = function(models) {
    Producto.belongsTo(models.Usuario, { foreignKey: 'usuarioId' });
  };

  return Producto;
};




