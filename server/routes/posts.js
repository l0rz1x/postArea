const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const { validateToken, optionalToken } = require("../middlewares/authMiddleware");

// GET /posts -> Get all posts (optionalToken allows feed to know if viewer liked them)
router.get("/", optionalToken, postController.getAllPosts);

// GET /posts/byId/:id -> Get post by ID
router.get("/byId/:id", postController.getPostById);

// GET /posts/byuserId/:id -> Get posts by user ID
router.get("/byuserId/:id", postController.getPostsByUserId);

// POST /posts -> Create a post (requires auth)
router.post("/", validateToken, postController.createPost);

// DELETE /posts/:postId -> Delete post (requires auth & ownership)
router.delete("/:postId", validateToken, postController.deletePost);

module.exports = router;
