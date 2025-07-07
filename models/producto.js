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
        isFloat: { msg: 'El precio debe ser un número válido' },
        min: { args: [0.01], msg: 'El precio debe ser mayor a 0' },
      },
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imagen: {
      type: DataTypes.STRING,
      allowNull: true,
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
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  }, {
    tableName: 'Productos',
    timestamps: true,
  });

  Producto.associate = function(models) {
    // 👇 CAMBIO: el alias ahora es 'vendedor'
    Producto.belongsTo(models.Usuario, {
      foreignKey: 'usuarioId',
      as: 'vendedor',
    });

    Producto.belongsToMany(models.Orden, {
      through: models.OrdenProducto,
      foreignKey: 'productoId',
      as: 'ordenes',
    });

    Producto.hasMany(models.Carrito, {
      foreignKey: 'productoId',
      as: 'carritoItems',
    });
  };

  return Producto;
};
