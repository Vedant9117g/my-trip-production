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
  acceptRideController
} = require("../controllers/rideController");
const isAuthenticated = require("../middlewares/isAuthenticated");

const router = express.Router();

router.get("/fare", isAuthenticated, getFareController); 

router.post("/create", isAuthenticated, createRideController);
router.get("/search-scheduled", isAuthenticated, searchScheduledRidesController);
router.get("/my-rides", isAuthenticated, getCaptainRidesController); // ✅ Captain home
router.get("/:id", isAuthenticated, getRideByIdController);
router.post("/:id/book", isAuthenticated, bookSeatsController);
router.get("/:id/booked-users", isAuthenticated, getRideBookedUsersController);
router.post("/start", isAuthenticated, startRideController); // Start a ride
router.post("/cancel", isAuthenticated, cancelRideController);
router.post("/complete", isAuthenticated, completeRideController); 


// routes for instant ride .
router.post("/:id/accept", isAuthenticated, acceptRideController); // Add this route


module.exports = router;
