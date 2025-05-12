// rideController.js

const rideModel = require("../models/ride.model"); // Import rideModel
const { getRideBookedUsers } = require("../services/rideService");
const { sendMessageToSocketId } = require("../socket");

const {
  createRide,
  searchScheduledRides,
  getRideById,
  bookSeatsInRide,
  getCaptainRides,
  startRide,
  completeRide,
  getFare, cancelRide,
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
    console.log("Ride created successfully. Ride data:", ride);

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

    // Fetch the updated ride with all captain details
    const updatedRide = await rideModel.findById(rideId)
      .populate([
        {
          path: "captainId",
          select: "-password -__v", // Exclude sensitive fields like password and __v
        },
        {
          path: "userId",
          select: "name email phone socketId", // Include only necessary fields for the passenger
        },
      ])
      .lean();

    console.log("Updated Ride:", updatedRide);

    // Send the updated ride details to the passenger via socket
    const passengerSocketId = updatedRide.userId?.socketId;
    if (passengerSocketId) {
      sendMessageToSocketId(passengerSocketId, {
        event: "rideStatusUpdate",
        data: {
          ...updatedRide,
          captain: updatedRide.captainId, // Include all captain details
          rideId: updatedRide._id, // Add rideId explicitly
        },
      });
    }

    res.status(200).json({ message: "Ride started successfully", ride: updatedRide });
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

    const ride = await cancelRide(rideId, userId, role, reason);

    // Fetch the updated ride with all details
    const updatedRide = await rideModel.findById(rideId)
      .populate([
        {
          path: "captainId",
          select: "-password -__v", // Exclude sensitive fields
        },
        {
          path: "userId",
          select: "name email phone socketId", // Include necessary fields
        },
      ])
      .lean();

    console.log("Updated Ride after cancellation:", updatedRide);

    // Send cancellation details to the passenger or captain via socket
    const targetSocketId =
      role === "captain" ? updatedRide.userId?.socketId : updatedRide.captainId?.socketId;

    if (targetSocketId) {
      sendMessageToSocketId(targetSocketId, {
        event: "rideCanceled",
        data: {
          ...updatedRide,
          canceledBy: role,
          canceledReason: reason,
          rideId: updatedRide._id, // Add rideId explicitly
        },
      });
    }

    console.log("Ride canceled successfully");
    res.status(200).json({ message: "Ride canceled successfully", ride: updatedRide });
  } catch (error) {
    console.error("Cancel ride error:", error);
    res.status(500).json({ message: error.message });
  }
}

async function completeRideController(req, res) {
  try {
    const { rideId } = req.body;
    const captainId = req.user._id;

    console.log("Complete Ride Request:", { rideId, captainId });

    const ride = await completeRide(rideId, captainId);

    const updatedRide = await rideModel.findById(rideId)
      .populate([
        {
          path: "captainId",
          select: "-password -__v",
        },
        {
          path: "userId",
          select: "name email phone socketId"
        },
      ])
      .lean();

    const passengerSocketId = updatedRide.userId?.socketId;
    if (passengerSocketId) {
      sendMessageToSocketId(passengerSocketId, {
        event: "rideCompleted",
        data: {
          ...updatedRide,
          captain: updatedRide.captainId, // Include all captain details
          rideId: updatedRide._id, // Add rideId explicitly
        },
      });
    }

    res.status(200).json({ message: "Ride completed successfully", ride: updatedRide });
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

const acceptRideController = async (req, res) => {
  try {
    const rideId = req.params.id;
    const captainId = req.user._id;

    console.log("Accept Ride Request:", { rideId, captainId });

    const ride = await rideModel.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    // Ensure the ride is in the "searching" state
    if (ride.status !== "searching") {
      return res.status(400).json({ message: "Ride is not available for acceptance" });
    }

    // Update the ride status and assign the captain
    ride.status = "accepted";
    ride.captainId = captainId;
    await ride.save();

    // Fetch the updated ride with all captain details
    const updatedRide = await rideModel.findById(rideId)
      .populate([
        {
          path: "captainId",
          select: "-password -__v", // Exclude sensitive fields like password and __v
        },
        {
          path: "userId",
          select: "name email phone socketId", // Include only necessary fields for the passenger
        },
      ])
      .lean();

    console.log("Updated Ride:", updatedRide);

    // Send the captain's details to the passenger via socket
    const passengerSocketId = updatedRide.userId?.socketId;
    if (passengerSocketId) {
      sendMessageToSocketId(passengerSocketId, {
        event: "rideAccepted",
        data: {
          ...updatedRide,
          captain: updatedRide.captainId, // Include all captain details
          rideId: updatedRide._id, // Add rideId explicitly
        },
      });
    }

    res.status(200).json({ message: "Ride accepted successfully", ride: updatedRide });
  } catch (error) {
    console.error("Accept ride error:", error);
    res.status(500).json({ message: "Failed to accept the ride" });
  }
};

async function getMyRidesController(req, res) {
  try {
    const userId = req.user._id;
    const role = req.user.role;

    // Base query: Fetch rides based on the user's role
    const query = role === "captain" ? { captainId: userId } : { userId };

    // Apply filters from query parameters
    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.rideType) {
      query.rideType = req.query.rideType;
    }

    if (req.query.origin) {
      query.origin = { $regex: req.query.origin, $options: "i" }; // Case-insensitive match
    }

    if (req.query.destination) {
      query.destination = { $regex: req.query.destination, $options: "i" }; // Case-insensitive match
    }

    if (req.query.departureTime) {
      const startOfDay = new Date(req.query.departureTime);
      const endOfDay = new Date(req.query.departureTime);
      endOfDay.setHours(23, 59, 59, 999);

      query.departureTime = { $gte: startOfDay, $lte: endOfDay };
    }

    if (req.query.canceledBy) {
      query.canceledBy = req.query.canceledBy;
    }

    // Fetch rides from the database
    const rides = await rideModel.find(query).sort({ createdAt: -1 }).lean();

    res.status(200).json({ rides });
  } catch (error) {
    console.error("Error fetching rides:", error);
    res.status(500).json({ message: "Failed to fetch rides" });
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
  acceptRideController,
  cancelRideController,
  getMyRidesController,
};