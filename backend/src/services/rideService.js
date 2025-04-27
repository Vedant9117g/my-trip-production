// rideService.js
const rideModel = require("../models/ride.model");
const userModel = require("../models/User");
const mapService = require("./mapService");
const crypto = require("crypto");
const { sendMessageToSocketId } = require("../socket");

function extractMainCity(place) {
  if (!place) return "";
  return place.split(",")[0].replace(/( City| District)$/i, "").trim();
}

function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

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

async function createRide(
  userId,
  role,
  origin,
  destination,
  totalOrBookedSeats,
  rideType,
  departureTime,
  vehicleType,
  io,
  scheduledType,
  customFare = null
) {
  if (!origin || !destination) throw new Error("Origin and destination are required");

  const originCoords = await mapService.getAddressCoordinate(origin);
  const destinationCoords = await mapService.getAddressCoordinate(destination);
  if (!originCoords || !destinationCoords) throw new Error("Invalid origin or destination");

  const fare = await getFare(origin, destination);
  const otp = generateOtp();

  let baseFinalFare = customFare || fare[vehicleType] || fare.car;

  // Adjust fare per seat for captain-created carpool scheduled rides
  if (role === "captain" && rideType === "scheduled" && scheduledType === "carpool") {
    baseFinalFare = Math.round(baseFinalFare / totalOrBookedSeats);
  }

  const rideData = {
    origin,
    destination,
    coordinates: { origin: originCoords, destination: destinationCoords },
    distance: fare.distance,
    duration: fare.duration,
    fare,
    finalFare: baseFinalFare,
    rideType,
    scheduledType: rideType === "scheduled" ? scheduledType : undefined,
    departureTime: rideType === "instant" ? null : departureTime,
    vehicleType,
    status: "searching",
    otp,
  };

  if (role === "captain" || role === "both") {
    rideData.captainId = userId;
    rideData.totalSeats = totalOrBookedSeats;
    rideData.availableSeats = totalOrBookedSeats;
    rideData.seatsBooked = 0;
    rideData.isCaptainCreated = true;
  } else {
    rideData.userId = userId;
    rideData.totalSeats = totalOrBookedSeats;
    rideData.seatsBooked = totalOrBookedSeats;
    rideData.availableSeats = 0;
    rideData.isCaptainCreated = false;
  }

  const newRide = await rideModel.create(rideData);

  const populatedRide = await rideModel.findById(newRide._id)
    .populate("userId", "name email phone socketId")
    .populate("captainId", "name email phone")
    .lean();

  populatedRide.otp = otp;

  if (rideType === "instant" && role === "passenger") {
    // Fetch captains with valid socketId
    const captains = await userModel.find({ // Use userModel instead of User
      role: { $in: ["captain", "both"] },
      socketId: { $ne: null }, // Only captains with valid socketId
    }).select("socketId name");

    console.log(`Found ${captains.length} captains to notify.`);

    captains.forEach((captain) => {
      try {
        sendMessageToSocketId(captain.socketId, {
          event: "new-ride",
          data: populatedRide,
        });
        console.log(`Ride sent to captain ${captain.name} (${captain.socketId})`);
      } catch (error) {
        console.error(`Failed to send ride to captain ${captain.name}:`, error.message);
      }
    });
  }

  return populatedRide;
}

async function getRideById(rideId) {
  return rideModel.findById(rideId)
    .populate("userId", "name email phone")
    .populate("captainId", "name email phone vehicle")
    .lean();
}

async function bookSeatsInRide(rideId, userId, seatsToBook) {
  const ride = await rideModel.findById(rideId);
  if (!ride) throw new Error("Ride not found");

  if (ride.scheduledType === "cab") {
    // For cab, the passenger must book the entire ride
    if (ride.seatsBooked > 0) throw new Error("This cab is already booked");
    if (seatsToBook !== ride.totalSeats) throw new Error("You must book the entire cab");

    ride.seatsBooked = ride.totalSeats;
    ride.availableSeats = 0;
    ride.userId = userId; // Assign the passenger to the ride
  } else if (ride.scheduledType === "carpool") {
    // For carpool, passengers can book individual seats
    const remainingSeats = ride.totalSeats - ride.seatsBooked;
    if (seatsToBook > remainingSeats) throw new Error("Not enough available seats");

    ride.seatsBooked += seatsToBook;
    ride.availableSeats -= seatsToBook;

    // Add the passenger to the list of users who booked the ride
    if (!ride.bookedUsers) ride.bookedUsers = [];
    ride.bookedUsers.push({ userId, seats: seatsToBook });
  } else {
    throw new Error("Invalid scheduledType");
  }

  // Update ride status and generate OTP if necessary
  let otpToSend = null;
  if (ride.status === "searching") {
    ride.status = "scheduled";
    otpToSend = generateOtp();
    ride.otp = otpToSend;
    ride.otpExpires = null;
  }

  await ride.save();

  // Update the user's booked rides
  await userModel.findByIdAndUpdate(userId, {
    $addToSet: { bookedRides: rideId },
  });

  // Fetch the updated ride and populate user details
  const updatedRide = await rideModel.findById(rideId)
    .populate("userId", "name email phone") // Populate user details for cab rides
    .populate("captainId", "name email phone vehicle") // Populate captain details
    .populate("bookedUsers.userId", "name email phone") // Populate booked users for carpool
    .lean();

  return {
    ride: updatedRide,
    otp: otpToSend, // May be null if ride was already scheduled
  };
}
//2

async function searchScheduledRides(origin, destination, date) {
  if (!origin || !destination || !date) throw new Error("Origin, destination and date are required");

  const startOfDay = new Date(date);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const originKeyword = extractMainCity(origin);
  const destinationKeyword = extractMainCity(destination);

  return rideModel.find({
    origin: { $regex: originKeyword, $options: "i" },
    destination: { $regex: destinationKeyword, $options: "i" },
    rideType: "scheduled",
    departureTime: { $gte: startOfDay, $lte: endOfDay },
    captainId: { $ne: null },
  }).populate("captainId", "name phone vehicle").lean();
}

async function notifyCaptains(originCoords, ride, io) {
  const radius = 5000; // 5km radius

  const nearbyCaptains = await userModel.find({
    role: { $in: ["captain", "both"] },
    "location.coordinates": {
      $geoWithin: { $centerSphere: [[originCoords.lng, originCoords.lat], radius / 6371000] },
    },
  });

  nearbyCaptains.forEach((captain) => {
    if (captain.socketId) {
      io.to(captain.socketId).emit("rideRequest", { ride });
    }
  });

  console.log(`Notified ${nearbyCaptains.length} captains`);
}

async function getCaptainRides(captainId) {
  const now = new Date();

  const allRides = await rideModel.find({ captainId }).sort({ departureTime: 1 })
    .populate("userId", "name phone")
    .populate("bookedUsers.userId", "name phone")
    .lean();

  const active = allRides.filter(ride =>
    ride.status !== "completed" &&
    ride.status !== "canceled" &&
    (!ride.departureTime || new Date(ride.departureTime) >= now)
  );

  const settled = allRides.filter(ride =>
    ride.status === "completed" ||
    ride.status === "canceled" ||
    (ride.departureTime && new Date(ride.departureTime) < now)
  );

  return { active, settled };
}

async function getRideBookedUsers(rideId) {
  const ride = await rideModel
    .findById(rideId)
    .populate("bookedUsers.userId", "name email phone") // Populate passenger details
    .populate("captainId", "name email phone vehicle") // Populate captain details
    .lean();

  return ride;
}

async function startRide(rideId, captainId, otp) {
  const ride = await rideModel.findById(rideId);
  if (!ride) throw new Error("Ride not found");

  // Ensure the captain is authorized to start the ride
  if (ride.captainId.toString() !== captainId.toString()) {
    throw new Error("You are not authorized to start this ride");
  }

  // Ensure the ride is in the scheduled state
  if (ride.status !== "scheduled") {
    throw new Error("Ride is not in a scheduled state");
  }

  // Verify the OTP
  if (ride.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  // Update the ride status to ongoing and clear the OTP
  ride.status = "ongoing";
  ride.otp = null; // Clear the OTP after successful verification
  await ride.save();

  // Return the updated ride
  const updatedRide = await rideModel.findById(rideId)
    .populate("userId", "name email phone")
    .populate("captainId", "name email phone vehicle")
    .populate("bookedUsers.userId", "name email phone")
    .lean();

  return updatedRide;
}

async function completeRide(rideId, captainId) {
  const ride = await rideModel.findById(rideId);
  if (!ride) throw new Error("Ride not found");

  // Ensure the captain is authorized to complete the ride
  if (ride.captainId.toString() !== captainId.toString()) {
    throw new Error("You are not authorized to complete this ride");
  }

  // Ensure the ride is in the ongoing state
  if (ride.status !== "ongoing") {
    throw new Error("Ride is not in an ongoing state");
  }

  // Update the ride status to completed
  ride.status = "completed";
  await ride.save();

  // Return the updated ride
  const updatedRide = await rideModel.findById(rideId)
    .populate("userId", "name email phone")
    .populate("captainId", "name email phone vehicle")
    .populate("bookedUsers.userId", "name email phone")
    .lean();

  return updatedRide;
}

module.exports = {
  createRide,
  getFare,
  getRideById,
  bookSeatsInRide,
  searchScheduledRides,
  getCaptainRides,
  getRideBookedUsers, // Add this export
  startRide,
  completeRide,
};