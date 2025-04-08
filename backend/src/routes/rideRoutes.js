const express = require("express");
const { 
  createRideController,
  searchScheduledRidesController
} = require("../controllers/rideController");
const isAuthenticated = require("../middlewares/isAuthenticated");

const router = express.Router();

router.post("/create", isAuthenticated, createRideController);
router.get("/search-scheduled", isAuthenticated, searchScheduledRidesController);

module.exports = router;
