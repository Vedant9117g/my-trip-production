const rideModel = require("../models/ride.model");
const userModel = require("../models/User");
const mapService = require("./mapService");
const crypto = require("crypto");
const { getSocketIdFromUserId } = require("../socket");

/**
 * Calculate fare based on distance and time
 */
async function getFare(origin, destination) {
  const distanceTime = await mapService.getDistanceTime(origin, destination);

  const baseFare = { auto: 30, car: 50, bike: 20 };
  const perKmRate = { auto: 10, car: 11, bike: 8 };
  const perMinuteRate = { auto: 2, car: 3, bike: 1.5 };

  const fare = {
    auto: Math.round(baseFare.auto + ((distanceTime.distance / 1000) * perKmRate.auto) + ((distanceTime.duration / 60) * perMinuteRate.auto)),
    car: Math.round(baseFare.car + ((distanceTime.distance / 1000) * perKmRate.car) + ((distanceTime.duration / 60) * perMinuteRate.car)),
    bike: Math.round(baseFare.bike + ((distanceTime.distance / 1000) * perKmRate.bike) + ((distanceTime.duration / 60) * perMinuteRate.bike))
  };

  return { ...fare, distance: distanceTime.distance, duration: distanceTime.duration };
}

/**
 * Generate a random OTP for ride confirmation
 */
function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

/**
 * Create a new ride
 */
async function createRide(userId, origin, destination, seatsBooked, rideType, departureTime, vehicleType, io) {
  try {
    if (!origin || !destination) {
      throw new Error("Origin and destination are required");
    }

    const originCoords = await mapService.getAddressCoordinate(origin);
    const destinationCoords = await mapService.getAddressCoordinate(destination);

    if (!originCoords || !destinationCoords) {
      throw new Error("Invalid origin or destination");
    }

    const fare = await getFare(origin, destination);
    const otp = generateOtp();
    const finalDepartureTime = rideType === "instant" ? null : departureTime;

    const newRide = new rideModel({
      userId,
      origin,
      destination,
      coordinates: { origin: originCoords, destination: destinationCoords },
      distance: fare.distance,
      duration: fare.duration,
      fare,
      finalFare: fare[vehicleType] || fare.car, // Default to car if vehicleType is not provided
      seatsBooked,
      totalSeats: seatsBooked,
      rideType,
      departureTime: finalDepartureTime,
      vehicleType,
      status: "searching",
      otp,
    });

    await newRide.save();

    // Populate the ride details with user info
    const populatedRide = await rideModel
      .findById(newRide._id)
      .populate("userId", "name email phone")
      .lean(); // Convert Mongoose object to plain JSON

    // Append OTP, vehicleType, and finalFare to the response
    populatedRide.otp = otp;
    populatedRide.vehicleType = vehicleType;
    populatedRide.finalFare = fare[vehicleType] || fare.car;


    // Notify captains about the new ride
    notifyCaptains(originCoords, populatedRide, io);

    return populatedRide;
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Notify captains about ride request
 */
async function notifyCaptains(originCoords, ride, io) {
  const radius = 5000;

  const nearbyCaptains = await userModel.find({
    role: { $in: ["captain", "both"] },
    "location.coordinates": {
      $geoWithin: { $centerSphere: [[originCoords.lng, originCoords.lat], radius / 6371000] },
    },
  });

  nearbyCaptains.forEach((captain) => {
    io.to(captain.socketId).emit("rideRequest", { ride });
  });

  console.log(`Notified ${nearbyCaptains.length} captains`);
}

module.exports = { createRide};


//before commit .