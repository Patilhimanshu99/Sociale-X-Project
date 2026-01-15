const Post = require("../models/Post");
const User = require("../models/User");

// ================= CREATE POST =================
const createPost = async (req, res) => {
  try {
    const { fileType, file, description, location } = req.body;

    if (!fileType || !file) {
      return res.status(400).json({
        message: "File type and file are required"
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const newPost = new Post({
      userId: user._id,
      username: user.username,
      fileType,
      file,
      description,
      location
    });

    await newPost.save();

    res.status(201).json({
      message: "Post created successfully",
      post: newPost
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create post",
      error: error.message
    });
  }
};

// ================= GET ALL POSTS =================
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch posts",
      error: error.message
    });
  }
};

// ================= LIKE / UNLIKE POST =================
const likePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId
      );
      await post.save();

      return res.status(200).json({
        message: "Post unliked",
        likesCount: post.likes.length
      });
    } else {
      post.likes.push(userId);
      await post.save();

      return res.status(200).json({
        message: "Post liked",
        likesCount: post.likes.length
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to like/unlike post",
      error: error.message
    });
  }
};

// ================= ADD COMMENT =================
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.postId;

    if (!text) {
      return res.status(400).json({
        message: "Comment text is required"
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    const newComment = {
      userId: user._id,
      username: user.username,
      text
    };

    post.comments.push(newComment);
    await post.save();

    res.status(201).json({
      message: "Comment added",
      comments: post.comments
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add comment",
      error: error.message
    });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  likePost,
  addComment
};
