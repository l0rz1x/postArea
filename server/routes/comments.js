const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const { validateToken } = require("../middlewares/authMiddleware");

// GET /comments/:postId -> List comments for a post
router.get("/:postId", commentController.getCommentsByPostId);

// POST /comments -> Add comment (requires auth)
router.post("/", validateToken, commentController.createComment);

// DELETE /comments/:commentId -> Delete comment (requires auth & ownership)
router.delete("/:commentId", validateToken, commentController.deleteComment);

module.exports = router;
