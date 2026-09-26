const { follows, Users } = require("../models");

const toggleFollow = async (req, res, next) => {
  try {
    const targetUserId = parseInt(req.params.userId, 10);
    const followerId = req.user.id;

    if (isNaN(targetUserId)) {
      return res.status(400).json({ error: "Invalid user ID." });
    }

    if (followerId === targetUserId) {
      return res.status(400).json({ error: "You cannot follow yourself." });
    }

    const targetUser = await Users.findByPk(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ error: "User to follow not found." });
    }

    const existingFollow = await follows.findOne({
      where: { followerId: followerId, followingId: targetUserId },
    });

    if (existingFollow) {
      await existingFollow.destroy();
      const followerCount = await follows.count({
        where: { followingId: targetUserId },
      });
      return res.status(200).json({
        following: false,
        followerCount: followerCount,
        message: "Unfollowed successfully.",
      });
    } else {
      await follows.create({
        followerId: followerId,
        followingId: targetUserId,
      });
      const followerCount = await follows.count({
        where: { followingId: targetUserId },
      });
      return res.status(200).json({
        following: true,
        followerCount: followerCount,
        message: "Followed successfully.",
      });
    }
  } catch (err) {
    next(err);
  }
};

const getFollowStatus = async (req, res, next) => {
  try {
    const targetUserId = parseInt(req.params.userId, 10);
    const followerId = req.user.id;

    if (isNaN(targetUserId)) {
      return res.status(400).json({ error: "Invalid user ID." });
    }

    const existingFollow = await follows.findOne({
      where: { followerId: followerId, followingId: targetUserId },
    });

    return res.status(200).json({
      isFollowing: !!existingFollow,
    });
  } catch (err) {
    next(err);
  }
};

const getFollowers = async (req, res, next) => {
  try {
    const targetUserId = parseInt(req.params.userId, 10);

    if (isNaN(targetUserId)) {
      return res.status(400).json({ error: "Invalid user ID." });
    }

    const targetUser = await Users.findByPk(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ error: "User not found." });
    }

    const isOwner = req.user && req.user.id === targetUserId;
    let isFollowing = false;
    if (req.user && req.user.id && !isOwner) {
      const followRecord = await follows.findOne({
        where: { followerId: req.user.id, followingId: targetUserId },
      });
      isFollowing = !!followRecord;
    }

    if (targetUser.isPrivate && !isOwner && !isFollowing) {
      return res.status(403).json({ error: "Only approved followers can view the followers list of a private account." });
    }

    const followersList = await follows.findAll({
      where: { followingId: targetUserId },
      include: [
        {
          model: Users,
          as: "followerUser",
          attributes: ["id", "userName", "fullName", "avatar", "createdAt"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const users = followersList
      .map((f) => f.followerUser)
      .filter((u) => u !== null);

    return res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

const getFollowing = async (req, res, next) => {
  try {
    const targetUserId = parseInt(req.params.userId, 10);

    if (isNaN(targetUserId)) {
      return res.status(400).json({ error: "Invalid user ID." });
    }

    const targetUser = await Users.findByPk(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ error: "User not found." });
    }

    const isOwner = req.user && req.user.id === targetUserId;
    let isFollowing = false;
    if (req.user && req.user.id && !isOwner) {
      const followRecord = await follows.findOne({
        where: { followerId: req.user.id, followingId: targetUserId },
      });
      isFollowing = !!followRecord;
    }

    if (targetUser.isPrivate && !isOwner && !isFollowing) {
      return res.status(403).json({ error: "Only approved followers can view the following list of a private account." });
    }

    const followingList = await follows.findAll({
      where: { followerId: targetUserId },
      include: [
        {
          model: Users,
          as: "followingUser",
          attributes: ["id", "userName", "fullName", "avatar", "createdAt"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const users = followingList
      .map((f) => f.followingUser)
      .filter((u) => u !== null);

    return res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  toggleFollow,
  getFollowStatus,
  getFollowers,
  getFollowing,
};
