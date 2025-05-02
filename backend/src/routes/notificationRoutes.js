const express = require("express");
const { getNotifications } = require("../services/rideService");
const isAuthenticated = require("../middlewares/isAuthenticated");
const Notification = require("../models/notification.model");
const router = express.Router();

// Route to fetch all notifications for the logged-in user
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const notifications = await getNotifications(req.user._id);
    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

router.put("/mark-as-read", isAuthenticated, async (req, res) => {
    try {
      await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
      res.status(200).json({ message: "Notifications marked as read" });
    } catch (error) {
      console.error("Error marking notifications as read:", error);
      res.status(500).json({ message: "Failed to mark notifications as read" });
    }
  });

module.exports = router;