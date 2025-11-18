const express = require("express");
const { validateToken } = require("../middlewares/authMiddleware");
const router = express.Router();
const { posts, likes } = require("../models/");
const { route } = require("./comments");

router.get("/", validateToken, async (req, res) => {
  const listOfPosts = await posts.findAll({ include: [likes] });
  const likedPosts = await likes.findAll({ where: { userId: req.user.id } });
  res.json({ listOfPosts: listOfPosts, likedPosts: likedPosts });
});
router.get("/byId/:id", async (req, res) => {
  const id = req.params.id;
  const postData = await posts.findByPk(id);
  res.json(postData);
});

router.get("/byuserId/:id", async (req, res) => {
  const id = req.params.id;
  const postData = await posts.findAll({
    where: {
      UserId: id,
    },
    include: [likes],
  });
  res.json(postData);
});

router.post("/", validateToken, async (req, res) => {
  const post = req.body;
  post.userName = req.user.userName;
  post.UserId = req.user.id;
  await posts.create(post);
  res.json(post);
});

router.delete("/:postId", validateToken, async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user.id;

  const rowsDeleted = await posts.destroy({
    where: {
      id: postId,
      UserId: userId,
    },
  });
  if (rowsDeleted === 0) {
    res.json({ error: "Post bulunamadı veya silme yetkiniz yok." });
  } else {
    res.json("DELETED SUCCESSFULLY");
  }
});

module.exports = router;
