const { createRide, searchScheduledRides } = require("../services/rideService");

async function createRideController(req, res) {
  try {
    const { origin, destination, rideType, departureTime, vehicleType } = req.body;
    let seats = parseInt(req.body.totalSeats || req.body.seatsBooked || 1);
    const userId = req.user._id;
    const role = req.user.role;

    console.log("Creating ride for", userId, "role:", role);

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

    res.status(201).json({
      message: "Ride created successfully!",
      ride,
    });
  } catch (error) {
    console.error("Create ride error:", error);
    res.status(500).json({ message: error.message });
  }
}

async function searchScheduledRidesController(req, res) {
  try {
    const { origin, destination, date } = req.query;

    // Optionally trim inputs
    const trimmedOrigin = origin?.trim() || "";
    const trimmedDestination = destination?.trim() || "";

    const rides = await searchScheduledRides(trimmedOrigin, trimmedDestination, date);

    res.status(200).json({ rides });
  } catch (error) {
    console.error("Search scheduled rides error:", error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createRideController,
  searchScheduledRidesController,
};
