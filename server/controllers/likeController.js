const { likes } = require("../models");
const { Op } = require("sequelize");

const toggleLike = async (req, res, next) => {
  try {
    const { postId } = req.body;
    const userId = req.user.id;

    if (!postId) {
      return res.status(400).json({ error: "Post ID is required." });
    }

    const found = await likes.findOne({
      where: {
        postId: postId,
        [Op.or]: [{ UserId: userId }, { userId: userId }],
      },
    });

    if (!found) {
      await likes.create({ postId: postId, UserId: userId });
      const currentLikesCount = await likes.count({ where: { postId: postId } });
      return res.status(200).json({
        liked: true,
        likesCount: currentLikesCount,
      });
    } else {
      await likes.destroy({
        where: {
          postId: postId,
          [Op.or]: [{ UserId: userId }, { userId: userId }],
        },
      });
      const currentLikesCount = await likes.count({ where: { postId: postId } });
      return res.status(200).json({
        liked: false,
        likesCount: currentLikesCount,
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  toggleLike,
};
