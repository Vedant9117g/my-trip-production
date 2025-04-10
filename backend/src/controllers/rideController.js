const {
  createRide,
  searchScheduledRides,
  getRideById,
  bookSeatsInRide
} = require("../services/rideService");

async function createRideController(req, res) {
  try {
    const { origin, destination, rideType, departureTime, vehicleType } = req.body;
    let seats = parseInt(req.body.totalSeats || req.body.seatsBooked || 1);
    const userId = req.user._id;
    const role = req.user.role;

    const ride = await createRide(
      userId,
      role,
      origin,
      destination,
      seats,
      rideType,
      departureTime,
      vehicleType,
      req.app.get("io")
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
    const trimmedOrigin = origin?.trim() || "";
    const trimmedDestination = destination?.trim() || "";

    const rides = await searchScheduledRides(trimmedOrigin, trimmedDestination, date);
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

    const updatedRide = await bookSeatsInRide(rideId, userId, seatsToBook);
    res.status(200).json({ message: "Seats booked successfully!", ride: updatedRide });
  } catch (error) {
    console.error("Book seats error:", error);
    res.status(400).json({ message: error.message });
  }
}

module.exports = {
  createRideController,
  searchScheduledRidesController,
  getRideByIdController,
  bookSeatsController
};
