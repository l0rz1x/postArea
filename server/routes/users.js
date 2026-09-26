const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { validateToken, optionalToken } = require("../middlewares/authMiddleware");

// POST /auth -> Register
router.post("/", authController.register);

// POST /auth/login -> Login
router.post("/login", authController.login);

// GET /auth/check -> Check active token
router.get("/check", validateToken, authController.checkAuth);

// GET /auth/search?q=... -> Search users by name/username with privacy rules
router.get("/search", optionalToken, authController.searchUsers);

// GET /auth/info/:id -> User profile & stats (with optionalToken to know if viewer follows them)
router.get("/info/:id", optionalToken, authController.getUserProfile);

// PUT /auth/profile -> Update bio & avatar
router.put("/profile", validateToken, authController.updateProfile);

module.exports = router;
