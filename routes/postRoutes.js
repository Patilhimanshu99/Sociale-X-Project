const express = require("express");
const router = express.Router();

const {
  createPost,
  getAllPosts,
  likePost,
  addComment
} = require("../controllers/postController");

const authMiddleware = require("../middleware/authMiddleware");

// CREATE POST
router.post("/", authMiddleware, createPost);

// GET FEED
router.get("/", authMiddleware, getAllPosts);

// LIKE / UNLIKE
router.put("/like/:postId", authMiddleware, likePost);

// ADD COMMENT
router.post("/comment/:postId", authMiddleware, addComment);

module.exports = router;
