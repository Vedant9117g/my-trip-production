const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false // ✅ make optional
    },
    captainId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false // ✅ make optional
    },

    origin: { type: String, required: true }, // Pickup Location Name
    destination: { type: String, required: true }, // Drop Location Name

    coordinates: {
      origin: {
        lat: { type: Number },
        lng: { type: Number },
      },
      destination: {
        lat: { type: Number },
        lng: { type: Number },
      },
    }, // Auto-filled using Map API

    distance: { type: Number }, // In meters (calculated via API)
    duration: { type: Number }, // In seconds (calculated via API)
    fare: { type: Object, required: true }, // Estimated or manual pricing
    finalFare: { type: Number }, // Final fare after negotiation
    seatsBooked: { type: Number, default: 1 }, // For carpooling
    totalSeats: { type: Number, required: true }, // Available seats

    departureTime: { type: Date }, // Scheduled or instant ride time
    estimatedArrivalTime: { type: Date }, // Auto-calculated based on live traffic

    rideType: {
      type: String,
      enum: ["instant", "scheduled", "recurring"],
      default: "instant",
    },

    frequency: {
      type: [String], // ["Monday", "Tuesday", ...] for scheduled rides
      default: [],
    },

    status: {
      type: String,
      enum: ["searching", "driver_assigned", "ongoing", "completed", "canceled"],
      default: "searching",
    },
    isCaptainCreated: { type: Boolean, default: false }, // true if captain created it

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ride", rideSchema);
