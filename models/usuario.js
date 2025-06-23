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
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });


  Usuario.associate = (models) => {
  Usuario.hasMany(models.Producto, {
    foreignKey: 'usuarioId',
    as: 'productos'
  });
};




  return Usuario;
};
