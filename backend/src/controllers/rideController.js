const { createRide } = require("../services/rideService");

async function createRideController(req, res) {
    try {
        const { origin, destination, seatsBooked, rideType, departureTime, vehicleType } = req.body;
        const userId = req.user.id;

        const ride = await createRide(userId, origin, destination, seatsBooked, rideType, departureTime, vehicleType, req.app.get("io"));

        res.status(201).json({
            message: "Ride created successfully!",
            ride
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createRideController,
};


//before commit