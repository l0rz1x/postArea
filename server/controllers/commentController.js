const { comments, posts, Users } = require("../models");

const getCommentsByPostId = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const postComments = await comments.findAll({
      where: { postId: postId },
      order: [["createdAt", "ASC"]],
    });

    const userNames = [...new Set(postComments.map((c) => c.userName))];
    const authorMap = new Map();
    if (userNames.length > 0) {
      const authors = await Users.findAll({
        where: { userName: userNames },
        attributes: ["id", "userName", "fullName", "avatar", "hideUsername"],
      });
      authors.forEach((a) => authorMap.set(a.userName, a.toJSON()));
    }

    const commentsWithAuthor = postComments.map((comment) => {
      const c = comment.toJSON();
      c.author = authorMap.get(comment.userName) || {
        userName: comment.userName,
        fullName: "",
        avatar: "",
        hideUsername: false,
      };
      return c;
    });

    return res.status(200).json(commentsWithAuthor);
  } catch (err) {
    next(err);
  }
};

const createComment = async (req, res, next) => {
  try {
    const { commentBody, postId } = req.body;

    if (!commentBody || !commentBody.trim()) {
      return res.status(400).json({ error: "Comment text cannot be empty." });
    }

    if (!postId) {
      return res.status(400).json({ error: "Post ID is required." });
    }

    const post = await posts.findByPk(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    const newComment = await comments.create({
      commentBody: commentBody.trim(),
      postId: postId,
      userName: req.user.userName,
      userId: req.user.id,
    });

    const user = await Users.findByPk(req.user.id, {
      attributes: ["id", "userName", "fullName", "avatar", "hideUsername"],
    });

    const commentData = newComment.toJSON();
    commentData.author = user
      ? user.toJSON()
      : {
          id: req.user.id,
          userName: req.user.userName,
          fullName: "",
          avatar: "",
          hideUsername: false,
        };

    return res.status(201).json(commentData);
  } catch (err) {
    next(err);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const comment = await comments.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found." });
    }

    // Check if the current user is either the comment creator OR the owner of the post
    const post = await posts.findByPk(comment.postId);
    const isCommentAuthor = comment.userName === req.user.userName || comment.userId === req.user.id;
    const isPostOwner = post && post.UserId === req.user.id;

    if (!isCommentAuthor && !isPostOwner) {
      return res.status(403).json({ error: "Unauthorized. You cannot delete this comment." });
    }

    await comment.destroy();
    return res.status(200).json({ message: "Comment deleted successfully." });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCommentsByPostId,
  createComment,
  deleteComment,
};
