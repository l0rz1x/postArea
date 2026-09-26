module.exports = (sequelize, DataType) => {
  const Users = sequelize.define("Users", {
    userName: {
      type: DataType.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataType.STRING,
      allowNull: false,
    },
    fullName: {
      type: DataType.STRING,
      allowNull: true,
      defaultValue: "",
    },
    bio: {
      type: DataType.STRING(250),
      allowNull: true,
      defaultValue: "",
    },
    avatar: {
      type: DataType.STRING,
      allowNull: true,
      defaultValue: "",
    },
    hideUsername: {
      type: DataType.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isPrivate: {
      type: DataType.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });

  Users.associate = (models) => {
    Users.hasMany(models.likes, {
      foreignKey: "UserId",
      onDelete: "cascade",
    });
    Users.hasMany(models.posts, {
      foreignKey: "UserId",
      onDelete: "cascade",
    });
    Users.hasMany(models.follows, {
      foreignKey: "followerId",
      as: "following",
      onDelete: "cascade",
    });
    Users.hasMany(models.follows, {
      foreignKey: "followingId",
      as: "followers",
      onDelete: "cascade",
    });
  };

  return Users;
};
