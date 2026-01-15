const router = require("express").Router();
const Chat = require("../models/Chat");
const auth = require("../middleware/authMiddleware");

// Create or get chat between two users
router.post("/", auth, async (req, res) => {
  const { receiverId } = req.body;

  try {
    let chat = await Chat.findOne({
      members: { $all: [req.user.id, receiverId] }
    });

    if (!chat) {
      chat = new Chat({
        members: [req.user.id, receiverId]
      });
      await chat.save();
    }

    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: "Chat error" });
  }
});

module.exports = router;
