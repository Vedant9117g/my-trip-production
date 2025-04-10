const express = require("express");
const {
  createRideController,
  searchScheduledRidesController,
  getRideByIdController,
  bookSeatsController
} = require("../controllers/rideController");
const isAuthenticated = require("../middlewares/isAuthenticated");

const router = express.Router();

router.post("/create", isAuthenticated, createRideController);
router.get("/search-scheduled", isAuthenticated, searchScheduledRidesController);
router.get("/:id", isAuthenticated, getRideByIdController); // ✅ Get ride details
router.post("/:id/book", isAuthenticated, bookSeatsController); // ✅ Book seat(s)

module.exports = router;
