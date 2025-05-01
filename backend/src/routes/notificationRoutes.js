const express = require("express");
const { getNotifications } = require("../services/rideService");
const isAuthenticated = require("../middlewares/isAuthenticated");

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

module.exports = router;