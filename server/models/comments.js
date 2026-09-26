module.exports = (sequelize, DataType) => {
  const comments = sequelize.define("comments", {
    commentBody: {
      type: DataType.STRING,
      allowNull: false,
    },
    userName: {
      type: DataType.STRING,
      allowNull: false,
    },
  });

  comments.associate = (models) => {
    comments.belongsTo(models.posts, {
      foreignKey: "postId",
      onDelete: "cascade",
    });
  };

  return comments;
};
