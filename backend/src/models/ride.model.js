const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    captainId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    origin: { type: String, required: true },
    destination: { type: String, required: true },

    coordinates: {
      origin: {
        lat: { type: Number },
        lng: { type: Number },
      },
      destination: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },

    distance: { type: Number },
    duration: { type: Number },

    fare: { type: Object, required: true },
    finalFare: { type: Number },
    customFare: { type: Number, default: null }, // Optional custom fare (ignored for instant rides)

    seatsBooked: { type: Number, default: 1 },
    totalSeats: { type: Number, required: true },
    availableSeats: { type: Number }, // For tracking remaining seats in carpool

    departureTime: { type: Date },
    estimatedArrivalTime: { type: Date },

    rideType: {
      type: String,
      enum: ["instant", "scheduled", "recurring"],
      default: "instant",
    },

    scheduledType: {
      type: String,
      enum: ["carpool", "cab"],
      required: function () {
        return this.rideType === "scheduled";
      },
    },

    frequency: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: [
        "searching",
        "accepted",
        "scheduled",
        "ongoing",
        "completed",
        "canceled",
        "expired",
      ],
      default: "searching",
    },
    canceledBy: {
      type: String,
      enum: ["passenger", "captain", "system", null],
      default: null,
    },
    canceledReason: {
      type: String,
      enum: [
        "passenger_no_show",
        "captain_no_show",
        "passenger_cancel",
        "captain_cancel",
        "system_cancel",
        null,
      ],
      default: null,
    },
    isCaptainAccepted: { type: Boolean, default: false },
    isCaptainCreated: { type: Boolean, default: false },
    socketId: { type: String, default: null }, // For real-time updates

    otp: { type: String, default: null },
    otpExpires: { type: Date, default: null, index: { expires: "5m" } }, 
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ride", rideSchema);
