// rideController.js
const {
  createRide,
  searchScheduledRides,
  getRideById,
  bookSeatsInRide,
  getCaptainRides
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

module.exports = {
  createRideController,
  searchScheduledRidesController,
  getRideByIdController,
  bookSeatsController,
  getCaptainRidesController,
  getRideBookedUsersController, // Add this export
};