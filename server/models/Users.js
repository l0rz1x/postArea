module.exports = (sequelize, DataType) => {
  const Users = sequelize.define("Users", {
    userName: {
      type: DataType.STRING,
      allowNull: false,
    },
    password: {
      type: DataType.STRING,
      allowNull: false,
    },
  });

  Users.associate = (models) => {
    Users.hasMany(models.likes, {
      onDelete: "cascade",
    });
    Users.hasMany(models.posts, {
      onDelete: "cascade",
    });
  };
  return Users;
};
