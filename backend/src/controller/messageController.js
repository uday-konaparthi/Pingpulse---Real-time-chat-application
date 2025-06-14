const mongoose = require("mongoose");
const Message = require("../model/messageSchema");
const cloudinary = require('../utils/cloudinary');

const handleFetchMessages = async (req, res) => {
  const userId = req.userId;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid or missing userId" });
  }

  try {
    const { receiverId } = req.body;

    if (!receiverId || !mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ message: "Invalid or missing receiverId" });
    }

    const senderId = userId;

    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    }).sort({ createdAt: 1 }); // ascending order

    return res.status(200).json({ messages });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

const handleSendMessage = async (req, res) => {
  const userId = req.userId;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid or missing userId" });
  }

  try {
    const { receiverId, content } = req.body;
    if (!receiverId || !content || !mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ message: "Invalid or missing receiverId or content" });
    }

    let imageUrl = null;

    if (req.file) {
      imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'chat-images' },
          (error, result) => {
            if (result) {
              resolve(result.secure_url);
            } else {
              reject(error);
            }
          }
        );
        stream.end(req.file.buffer);
      });
    }

    const message = new Message({
      senderId: userId,
      receiverId,
      content,
      imageUrl,
    });

    console.log("message: ", message)
    const savedMessage = await message.save();

    return res.status(201).json({ message: savedMessage });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

module.exports = { handleFetchMessages, handleSendMessage };
