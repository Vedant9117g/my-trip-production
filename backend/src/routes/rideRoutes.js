const express = require("express");
const {
  createRideController,
  searchScheduledRidesController,
  getRideByIdController,
  bookSeatsController,
  getCaptainRidesController,
  getRideBookedUsersController,
  startRideController,
  cancelRideController,
  completeRideController,
  getFareController,
  acceptRideController,
  getMyRidesController
} = require("../controllers/rideController");
const isAuthenticated = require("../middlewares/isAuthenticated");

const router = express.Router();

router.get("/fare", isAuthenticated, getFareController); 

router.get("/my-rides", isAuthenticated, getMyRidesController); 


router.post("/create", isAuthenticated, createRideController);
router.get("/search-scheduled", isAuthenticated, searchScheduledRidesController);
router.get("/my-ridesss", isAuthenticated, getCaptainRidesController); // ✅ Captain home
router.get("/:id", isAuthenticated, getRideByIdController);
router.post("/:id/book", isAuthenticated, bookSeatsController);
router.get("/:id/booked-users", isAuthenticated, getRideBookedUsersController);
router.post("/start", isAuthenticated, startRideController); // Start a ride
router.post("/cancel", isAuthenticated, cancelRideController);
router.post("/complete", isAuthenticated, completeRideController); 
const Ride = require("../models/ride.model");

// routes for instant ride .
router.post("/:id/accept", isAuthenticated, acceptRideController); // Add this route


// GET /api/rides/captain/rides
router.get("/captain/rides", isAuthenticated, async (req, res) => {
  try {
    // req.user._id should be set by your isAuthenticated middleware
    const rides = await Ride.find({ captainId: req.user._id });
    res.json({ rides });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch rides" });
  }
});


module.exports = router;
