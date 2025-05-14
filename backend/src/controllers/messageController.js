const Conversation = require("../models/conversationModel").Conversation;
const Message = require("../models/messageModel").Message;
const { getReceiverSocketId } = require("../socket");

async function sendMessageController(req, res) {
  try {
    const senderId = req.user._id; // Extract sender ID from authenticated user
    const receiverId = req.params.id; // Extract receiver ID from route params
    const { message } = req.body; // Extract message content from request body

    // Validate message content
    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message content cannot be empty" });
    }

    // Find or create a conversation between the sender and receiver
    let gotConversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!gotConversation) {
      gotConversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    // Create a new message
    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
    });

    // Add the new message to the conversation
    gotConversation.messages.push(newMessage._id);
    await Promise.all([gotConversation.save(), newMessage.save()]);

    // Emit the new message to the receiver via Socket.IO
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      req.io.to(receiverSocketId).emit("newMessage", {
        senderId,
        receiverId,
        message: newMessage.message,
        createdAt: newMessage.createdAt,
      });
    }

    // Respond with the created message
    res.status(201).json({ message: "Message sent successfully!", newMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getMessageController(req, res) {
  try {
    const receiverId = req.params.id; // Extract receiver ID from route params
    const senderId = req.user._id; // Extract sender ID from authenticated user

    // Find the conversation between the sender and receiver
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Respond with the messages in the conversation
    res.status(200).json({ messages: conversation.messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  sendMessageController,
  getMessageController,
};