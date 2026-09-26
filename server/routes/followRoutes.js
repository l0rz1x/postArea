const express = require("express");
const router = express.Router();
const followController = require("../controllers/followController");
const { validateToken, optionalToken } = require("../middlewares/authMiddleware");

// POST /follow/:userId -> Toggle follow
router.post("/:userId", validateToken, followController.toggleFollow);

// GET /follow/status/:userId -> Get follow status
router.get("/status/:userId", validateToken, followController.getFollowStatus);

// GET /follow/followers/:userId -> Get followers list
router.get("/followers/:userId", optionalToken, followController.getFollowers);

// GET /follow/following/:userId -> Get following list
router.get("/following/:userId", optionalToken, followController.getFollowing);

module.exports = router;
