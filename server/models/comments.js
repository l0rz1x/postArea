module.exports = (sequelize, DataType) => {
  const comments = sequelize.define("comments", {
    commentBody: {
      type: DataType.STRING,
      allowNull: false,
    },
  });
  return comments;
};
