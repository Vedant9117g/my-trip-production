const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    rideId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ride",
      default: null,
    },
    type: {
      type: String,
      enum: ["info", "success", "warning", "error"], // Notification types
      default: "info",
    },
    isRead: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);