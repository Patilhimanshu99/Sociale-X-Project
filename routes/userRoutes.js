const express = require("express");
const router = express.Router();

const {
  getUserProfile,
  getUserPosts
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");

// GET USER PROFILE
router.get("/:userId", authMiddleware, getUserProfile);

// GET USER POSTS
router.get("/:userId/posts", authMiddleware, getUserPosts);

module.exports = router;
