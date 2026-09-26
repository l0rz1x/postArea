module.exports = (sequelize, DataType) => {
  const likes = sequelize.define("likes");

  likes.associate = (models) => {
    likes.belongsTo(models.posts, {
      foreignKey: "postId",
      onDelete: "cascade",
    });
    likes.belongsTo(models.Users, {
      foreignKey: "UserId",
      onDelete: "cascade",
    });
  };

  return likes;
};
