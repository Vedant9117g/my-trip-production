const { createRide, searchScheduledRides } = require("../services/rideService");

async function createRideController(req, res) {
    try {
        const { origin, destination, seatsBooked, rideType, departureTime, vehicleType } = req.body;
        const userId = req.user._id; 
        const role = req.user.role;
        console.log("Creating ride for", userId, "role:", role);


        const ride = await createRide(userId, role, origin, destination, seatsBooked, rideType, departureTime, vehicleType, req.app.get("io"));

        res.status(201).json({
            message: "Ride created successfully!",
            ride
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function searchScheduledRidesController(req, res) {
    try {
        const { origin, destination, date } = req.query;
        const rides = await searchScheduledRides(origin, destination, date);
        res.status(200).json({ rides });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createRideController,
    searchScheduledRidesController,
};
