module.exports = (sequelize, DataType) => {
  const likes = sequelize.define("likes");
  return likes;
};
