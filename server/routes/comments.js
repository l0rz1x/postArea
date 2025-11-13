const express = require("express");
const router = express.Router();
const { comments } = require("../models/");
const { validateToken } = require("../middlewares/authMiddleware");

router.get("/:postId", async (req, res) => {
  const postId = req.params.postId;
  const comment = await comments.findAll({ where: { postId: postId } });
  res.json(comment);
});
router.post("/", validateToken, async (req, res) => {
  const comment = req.body;
  const userName = req.user.userName;
  const newComment = await comments.create({
    commentBody: comment.commentBody,
    postId: comment.postId,
    userName: userName,
  });

  res.json(newComment);
});
router.delete("/:commentId", validateToken, async (req, res) => {
  const commentId = req.params.commentId;

  await comments.destroy({
    where: {
      id: commentId,
    },
  });

  res.json("deleted Successfuly");
});
module.exports = router;
