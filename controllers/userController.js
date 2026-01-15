const User = require("../models/User");
const Post = require("../models/Post");

// ================= GET USER PROFILE =================
const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user profile",
      error: error.message
    });
  }
};

// ================= GET USER POSTS =================
const getUserPosts = async (req, res) => {
  try {
    const userId = req.params.userId;

    const posts = await Post.find({ userId })
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user posts",
      error: error.message
    });
  }
};

module.exports = {
  getUserProfile,
  getUserPosts
};
