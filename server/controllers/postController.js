const { posts, likes, comments, Users, follows } = require("../models");
const { Op } = require("sequelize");

const getAllPosts = async (req, res, next) => {
  try {
    const feedType = req.query.feed || "explore";
    let whereCondition = {};

    if (feedType === "following") {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Please log in to view posts from accounts you follow." });
      }

      const followedList = await follows.findAll({
        where: { followerId: req.user.id },
        attributes: ["followingId"],
      });

      const followingIds = followedList.map((f) => f.followingId);

      if (followingIds.length === 0) {
        let likedPosts = [];
        if (req.user && req.user.id) {
          likedPosts = await likes.findAll({
            where: { [Op.or]: [{ UserId: req.user.id }, { userId: req.user.id }] },
          });
        }
        return res.status(200).json({
          listOfPosts: [],
          likedPosts: likedPosts,
          feed: "following",
          followingCount: 0,
        });
      }

      whereCondition = {
        UserId: followingIds,
      };
    }

    const authorInclude = {
      model: Users,
      as: "author",
      attributes: ["id", "userName", "fullName", "avatar", "hideUsername", "isPrivate"],
    };

    if (feedType === "explore") {
      if (req.user && req.user.id) {
        authorInclude.where = {
          [Op.or]: [{ isPrivate: false }, { id: req.user.id }],
        };
      } else {
        authorInclude.where = {
          isPrivate: false,
        };
      }
    }

    const listOfPosts = await posts.findAll({
      where: whereCondition,
      include: [
        { model: likes },
        { model: comments, attributes: ["id"] },
        authorInclude,
      ],
      order: [
        ["createdAt", "DESC"],
        ["id", "DESC"],
      ],
    });

    let likedPosts = [];
    if (req.user && req.user.id) {
      likedPosts = await likes.findAll({
        where: { [Op.or]: [{ UserId: req.user.id }, { userId: req.user.id }] },
      });
    }

    return res.status(200).json({
      listOfPosts: listOfPosts,
      likedPosts: likedPosts,
      feed: feedType,
    });
  } catch (err) {
    next(err);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await posts.findByPk(id, {
      include: [
        { model: likes },
        { model: comments },
        {
          model: Users,
          as: "author",
          attributes: ["id", "userName", "fullName", "avatar", "hideUsername", "isPrivate"],
        },
      ],
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    // If author has a private account, only followers and the author can view
    if (post.author && post.author.isPrivate) {
      const isOwner = req.user && req.user.id === post.UserId;
      let isFollowing = false;
      if (req.user && req.user.id && !isOwner) {
        const followRecord = await follows.findOne({
          where: { followerId: req.user.id, followingId: post.UserId },
        });
        isFollowing = !!followRecord;
      }

      if (!isOwner && !isFollowing) {
        return res.status(403).json({ error: "This post belongs to a private account." });
      }
    }

    return res.status(200).json(post);
  } catch (err) {
    next(err);
  }
};

const getPostsByUserId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const targetUser = await Users.findByPk(id);
    if (!targetUser) {
      return res.status(404).json({ error: "User not found." });
    }

    const isOwner = req.user && req.user.id === parseInt(id, 10);
    let isFollowing = false;
    if (req.user && req.user.id && !isOwner) {
      const followRecord = await follows.findOne({
        where: { followerId: req.user.id, followingId: id },
      });
      isFollowing = !!followRecord;
    }

    // If account is private and viewer is neither owner nor follower, do not expose posts
    if (targetUser.isPrivate && !isOwner && !isFollowing) {
      return res.status(200).json([]);
    }

    const userPosts = await posts.findAll({
      where: { UserId: id },
      include: [
        { model: likes },
        { model: comments, attributes: ["id"] },
        {
          model: Users,
          as: "author",
          attributes: ["id", "userName", "fullName", "avatar", "hideUsername", "isPrivate"],
        },
      ],
      order: [
        ["createdAt", "DESC"],
        ["id", "DESC"],
      ],
    });

    return res.status(200).json(userPosts);
  } catch (err) {
    next(err);
  }
};

const createPost = async (req, res, next) => {
  try {
    const { title, PostText } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Post title is required." });
    }

    if (!PostText || !PostText.trim()) {
      return res.status(400).json({ error: "Post content is required." });
    }

    const newPost = await posts.create({
      title: title.trim(),
      PostText: PostText.trim(),
      userName: req.user.userName,
      UserId: req.user.id,
    });

    return res.status(201).json(newPost);
  } catch (err) {
    next(err);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await posts.findByPk(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    if (post.UserId !== userId) {
      return res.status(403).json({ error: "Unauthorized. You can only delete your own posts." });
    }

    await post.destroy();
    return res.status(200).json({ message: "Post deleted successfully." });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  getPostsByUserId,
  createPost,
  deletePost,
};
