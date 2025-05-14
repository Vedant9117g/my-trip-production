const express = require("express");
const {
  sendMessageController,
  getMessageController,
} = require("../controllers/messageController");
const isAuthenticated = require("../middlewares/isAuthenticated");

const router = express.Router();

// Route to send a message
router.post("/send/:id", isAuthenticated, sendMessageController);

// Route to get messages
router.get("/:id", isAuthenticated, getMessageController);

module.exports = router;