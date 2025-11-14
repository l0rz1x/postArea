const express = require("express");
const router = express.Router();
const { likes } = require("../models/");
const { validateToken } = require("../middlewares/authMiddleware");

router.post("/", validateToken, async (req, res) => {
  const { postId } = req.body;
  const UserId = req.user.id;
  const found = await likes.findOne({
    where: { postId: postId, UserId: UserId },
  });
  if (!found) {
    await likes.create({ postId: postId, UserId: UserId });
    res.json({ liked: true });
  } else {
    await likes.destroy({ where: { postId: postId, UserId: UserId } });
    res.json({ liked: false });
  }
});

module.exports = router;
