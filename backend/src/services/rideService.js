const rideModel = require("../models/ride.model");
const userModel = require("../models/User");
const mapService = require("./mapService");
const crypto = require("crypto");

async function getFare(origin, destination) {
  const { distance, duration } = await mapService.getDistanceTime(origin, destination);

  const baseFare = { auto: 30, car: 50, bike: 20 };
  const perKmRate = { auto: 10, car: 11, bike: 8 };
  const perMinuteRate = { auto: 2, car: 3, bike: 1.5 };

  const fare = {
    auto: Math.round(baseFare.auto + (distance / 1000) * perKmRate.auto + (duration / 60) * perMinuteRate.auto),
    car: Math.round(baseFare.car + (distance / 1000) * perKmRate.car + (duration / 60) * perMinuteRate.car),
    bike: Math.round(baseFare.bike + (distance / 1000) * perKmRate.bike + (duration / 60) * perMinuteRate.bike),
  };

  return { ...fare, distance, duration };
}

function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

async function createRide(userId, role, origin, destination, seatsBooked, rideType, departureTime, vehicleType, io) {
  if (!origin || !destination) throw new Error("Origin and destination are required");

  const originCoords = await mapService.getAddressCoordinate(origin);
  const destinationCoords = await mapService.getAddressCoordinate(destination);
  if (!originCoords || !destinationCoords) throw new Error("Invalid origin or destination");

  const fare = await getFare(origin, destination);
  const otp = generateOtp();

  const rideData = {
    origin,
    destination,
    coordinates: { origin: originCoords, destination: destinationCoords },
    distance: fare.distance,
    duration: fare.duration,
    fare,
    finalFare: fare[vehicleType] || fare.car,
    seatsBooked,
    totalSeats: seatsBooked,
    rideType,
    departureTime: rideType === "instant" ? null : departureTime,
    vehicleType,
    status: "searching",
    otp,
  };

  // Assign userId based on role
  if (role === "captain" || role === "both") {
    rideData.captainId = userId;
  } else {
    rideData.userId = userId;
  }

  const newRide = await rideModel.create(rideData);

  const populatedRide = await rideModel.findById(newRide._id)
    .populate("userId", "name email phone")
    .populate("captainId", "name email phone")
    .lean();

  populatedRide.otp = otp;

  if (rideType === "instant" && role === "passenger") {
    notifyCaptains(originCoords, populatedRide, io);
  }

  return populatedRide;
}

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

async function searchScheduledRides(origin, destination, date) {
  if (!origin || !destination || !date) throw new Error("Origin, destination and date are required");

  const startOfDay = new Date(date);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return rideModel.find({
    origin,
    destination,
    rideType: "scheduled",
    departureTime: { $gte: startOfDay, $lte: endOfDay },
    captainId: { $ne: null },
    status: { $in: ["searching", "driver_assigned"] },
  }).populate("captainId", "name phone vehicle").lean();
}

module.exports = {
  createRide,
  searchScheduledRides,
};
