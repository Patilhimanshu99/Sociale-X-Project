const Chat = require("../models/Chat");
const Message = require("../models/message");

// ================= CREATE CHAT =================
const createChat = async (req, res) => {
  try {
    const { receiverId } = req.body;

    const chat = new Chat({
      members: [req.user.id, receiverId]
    });

    await chat.save();

    res.status(201).json({
      message: "Chat created",
      chat
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create chat",
      error: error.message
    });
  }
};

// ================= SEND MESSAGE (REAL-TIME) =================
const sendMessage = async (req, res) => {
  try {
    const { chatId, text, receiverId } = req.body;

    const newMessage = new Message({
      chatId,
      senderId: req.user.id,
      text
    });

    await newMessage.save();

    // 🔴 REAL-TIME EMIT
    const io = req.app.get("io");
    io.emit("receiveMessage", {
      chatId,
      senderId: req.user.id,
      text
    });

    res.status(201).json({
      message: "Message sent",
      data: newMessage
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to send message",
      error: error.message
    });
  }
};

// ================= GET MESSAGES =================
const getMessages = async (req, res) => {
  try {
    const chatId = req.params.chatId;

    const messages = await Message.find({ chatId }).sort({
      createdAt: 1
    });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch messages",
      error: error.message
    });
  }
};

module.exports = {
  createChat,
  sendMessage,
  getMessages
};
