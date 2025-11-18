module.exports = (sequelize, DataType) => {
  const posts = sequelize.define("posts", {
    title: {
      type: DataType.STRING,
      allowNull: false,
    },
    PostText: {
      type: DataType.TEXT,
      allowNull: false,
    },
    userName: {
      type: DataType.STRING,
      allowNull: false,
    },
  });

  posts.associate = (models) => {
    posts.hasMany(models.comments, {
      onDelete: "cascade",
    });

    posts.hasMany(models.likes, {
      onDelete: "cascade",
    });
  };
  return posts;
};
