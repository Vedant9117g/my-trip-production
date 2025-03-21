const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
  {
    captain: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to Captain
    source: { type: String, required: true },
    destination: { type: String, required: true },
    route: [{ type: String }], // Waypoints (optional)
    departureTime: { type: Date, required: true },
    availableSeats: { type: Number, required: true },
    price: { type: Number, required: true }, // Either estimated or manual pricing
    radius: { type: Number, required: true }, // Matching radius in km
    frequency: {
      type: [String], // ["Monday", "Tuesday", ...] for recurring rides
      default: [],
    },
    status: { type: String, enum: ["scheduled", "ongoing", "completed", "canceled"], default: "scheduled" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ride", rideSchema);
