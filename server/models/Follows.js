module.exports = (sequelize, DataType) => {
  const follows = sequelize.define(
    "follows",
    {
      followerId: {
        type: DataType.INTEGER,
        allowNull: false,
      },
      followingId: {
        type: DataType.INTEGER,
        allowNull: false,
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["followerId", "followingId"],
        },
      ],
    }
  );

  follows.associate = (models) => {
    follows.belongsTo(models.Users, {
      foreignKey: "followerId",
      as: "followerUser",
      onDelete: "cascade",
    });
    follows.belongsTo(models.Users, {
      foreignKey: "followingId",
      as: "followingUser",
      onDelete: "cascade",
    });
  };

  return follows;
};
