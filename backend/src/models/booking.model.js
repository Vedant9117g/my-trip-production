const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    ride: { type: mongoose.Schema.Types.ObjectId, ref: "Ride", required: true },
    passenger: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    seatsBooked: { type: Number, required: true },
    status: { type: String, enum: ["pending", "confirmed", "canceled", "completed"], default: "pending" },
    fare: { type: Number, required: true },
    otp: { type: String, default: null }, // OTP for ride confirmation
    otpExpires: { type: Date, default: null }, // Expiration time for OTP
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
