// rideController.js

const rideModel = require("../models/ride.model"); // Import rideModel

const {
  createRide,
  searchScheduledRides,
  getRideById,
  bookSeatsInRide,
  getCaptainRides,
  startRide,
  completeRide,
  getFare,
} = require("../services/rideService");

async function createRideController(req, res) {
  try {
    const {
      origin,
      destination,
      rideType,
      departureTime,
      vehicleType,
      scheduledType,
      customFare,
      totalSeats // totalOrBookedSeats depending on role
    } = req.body;

    const seats = parseInt(totalSeats || 1);
    const userId = req.user._id;
    const role = req.user.role;

    const ride = await createRide(
      userId,
      role,
      origin?.trim(),
      destination?.trim(),
      seats,
      rideType,
      departureTime,
      vehicleType,
      req.app.get("io"),
      scheduledType,
      customFare
    );

    res.status(201).json({ message: "Ride created successfully!", ride });
  } catch (error) {
    console.error("Create ride error:", error);
    res.status(500).json({ message: error.message });
  }
}

async function searchScheduledRidesController(req, res) {
  try {
    const { origin, destination, date } = req.query;
    const rides = await searchScheduledRides(origin?.trim(), destination?.trim(), date);
    res.status(200).json({ rides });
  } catch (error) {
    console.error("Search scheduled rides error:", error);
    res.status(500).json({ message: error.message });
  }
}

async function getRideByIdController(req, res) {
  try {
    const ride = await getRideById(req.params.id);
    if (!ride) return res.status(404).json({ message: "Ride not found" });
    res.status(200).json({ ride });
  } catch (error) {
    console.error("Get ride by ID error:", error);
    res.status(500).json({ message: error.message });
  }
}

async function bookSeatsController(req, res) {
  try {
    const rideId = req.params.id;
    const userId = req.user._id;
    const seatsToBook = parseInt(req.body.seats || 1);

    const { ride, otp } = await bookSeatsInRide(rideId, userId, seatsToBook);

    if (otp) {
      console.log(`Generated OTP for passenger: ${otp}`);
    } else {
      console.log(`No new OTP generated. Ride was already scheduled.`);
    }

    res.status(200).json({
      message: "Seats booked successfully!",
      ride,
      ...(otp && { otp }), // Only include otp if newly generated
    });
  } catch (error) {
    console.error("Book seats error:", error);
    res.status(400).json({ message: error.message });
  }
}


async function getCaptainRidesController(req, res) {
  try {
    const captainId = req.user._id;
    const { active, settled } = await getCaptainRides(captainId);
    res.status(200).json({ active, settled });
  } catch (error) {
    console.error("Get captain rides error:", error);
    res.status(500).json({ message: error.message });
  }
}


const { getRideBookedUsers } = require("../services/rideService");

async function getRideBookedUsersController(req, res) {
  try {
    const rideId = req.params.id;
    const rideDetails = await getRideBookedUsers(rideId);

    if (!rideDetails) {
      return res.status(404).json({ message: "Ride not found" });
    }

    res.status(200).json({ success: true, ride: rideDetails });
  } catch (error) {
    console.error("Error fetching ride booked users:", error);
    res.status(500).json({ message: "Failed to fetch ride details" });
  }
}


async function startRideController(req, res) {
  try {
    const { rideId, otp } = req.body;
    const captainId = req.user._id;

    console.log("Start Ride Request:", { rideId, otp, captainId });

    const ride = await startRide(rideId, captainId, otp);

    res.status(200).json({ message: "Ride started successfully", ride });
  } catch (error) {
    console.error("Start ride error:", error);
    res.status(400).json({ message: error.message });
  }
}

async function cancelRideController(req, res) {
  try {
    const { rideId, reason } = req.body;
    const userId = req.user._id;
    const role = req.user.role;

    console.log("Cancel Ride Request:", { rideId, reason, userId, role });

    const ride = await rideModel.findById(rideId);
    if (!ride) {
      console.error("Ride not found");
      return res.status(404).json({ message: "Ride not found" });
    }

    if (ride.status !== "scheduled") {
      console.error("Ride is not in a scheduled state");
      return res.status(400).json({ message: "Only scheduled rides can be canceled" });
    }

    if (role === "captain" && ride.captainId.toString() !== userId.toString()) {
      console.error("Unauthorized captain");
      return res.status(403).json({ message: "You are not authorized to cancel this ride" });
    }

    if (role === "passenger" && ride.userId.toString() !== userId.toString()) {
      console.error("Unauthorized passenger");
      return res.status(403).json({ message: "You are not authorized to cancel this ride" });
    }

    // Provide a default valid reason if none is provided
    let validReason = reason;
    if (!reason) {
      if (role === "passenger") {
        validReason = "change_of_plans"; // Default reason for passengers
      } else if (role === "captain") {
        validReason = "ride_conflict"; // Default reason for captains
      } else {
        validReason = "ride_expired"; // Default reason for the system
      }
    }

    ride.status = "canceled";
    ride.canceledBy = role;
    ride.canceledReason = validReason; // Use the valid reason
    await ride.save();

    console.log("Ride canceled successfully");
    res.status(200).json({ message: "Ride canceled successfully", ride });
  } catch (error) {
    console.error("Cancel ride error:", error);
    res.status(500).json({ message: "Failed to cancel the ride" });
  }
}

async function completeRideController(req, res) {
  try {
    const { rideId } = req.body;
    const captainId = req.user._id;

    console.log("Complete Ride Request:", { rideId, captainId });

    const ride = await completeRide(rideId, captainId);

    res.status(200).json({ message: "Ride completed successfully", ride });
  } catch (error) {
    console.error("Complete ride error:", error);
    res.status(400).json({ message: error.message });
  }
}


async function getFareController(req, res) {
  try {
    const { origin, destination } = req.query;

    if (!origin || !destination) {
      return res.status(400).json({ message: "Origin and destination are required" });
    }

    const fareDetails = await getFare(origin, destination);
    res.status(200).json(fareDetails);
  } catch (error) {
    console.error("Error fetching fare details:", error);
    res.status(500).json({ message: "Failed to fetch fare details" });
  }
}

module.exports = {
  createRideController,
  searchScheduledRidesController,
  getRideByIdController,
  bookSeatsController,
  getCaptainRidesController,
  getRideBookedUsersController, // Add this export
  startRideController,
  cancelRideController,
  completeRideController,
  getFareController,
};