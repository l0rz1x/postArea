const express = require("express");
const router = express.Router();
const likeController = require("../controllers/likeController");
const { validateToken } = require("../middlewares/authMiddleware");

// POST /like -> Toggle like on post (requires auth)
router.post("/", validateToken, likeController.toggleLike);

module.exports = router;
