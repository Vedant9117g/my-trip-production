const mongoose = require("mongoose");

const passengerCancelReasons = [
  "change_of_plans",
  "booked_by_mistake",
  "waited_too_long",
  "captain_not_moving",
  "got_another_ride",
  "fare_too_high",
  "captain_asked_to_cancel",
  "pickup_location_incorrect",
  "vehicle_not_as_expected",
  "travel_delayed_or_canceled",
];

const captainCancelReasons = [
  "vehicle_breakdown",
  "emergency_at_home",
  "traffic_restrictions",
  "ride_conflict",
  "low_passenger_count",
  "passenger_unreachable",
  "change_in_schedule",
  "incorrect_pickup_location",
  "weather_conditions",
];

const systemCancelReasons = [
  "captain_no_response",
  "passenger_no_response",
  "ride_expired",
  "auto_canceled_due_to_timeout",
];


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
    bookedUsers: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        seats: { type: Number, required: true }, // Number of seats booked by the user
      },
    ],
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
      default: null,
      validate: {
        validator: function (value) {
          if (!value) return true;
    
          if (this.canceledBy === "passenger") {
            return passengerCancelReasons.includes(value);
          } else if (this.canceledBy === "captain") {
            return captainCancelReasons.includes(value);
          } else if (this.canceledBy === "system") {
            return systemCancelReasons.includes(value);
          }
    
          return false;
        },
        message: (props) =>
          `Invalid cancel reason '${props.value}' for ${props.instance.canceledBy}`,
      },
    },
    
    isCaptainAccepted: { type: Boolean, default: false },
    isCaptainCreated: { type: Boolean, default: false },
    socketId: { type: String, default: null }, // For real-time updates

    otp: { type: String, default: null },
    otpExpires: { type: Date, default: null}, 
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ride", rideSchema);

//2