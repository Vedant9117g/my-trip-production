const express = require("express");
const {
  createRideController,
  searchScheduledRidesController,
  getRideByIdController,
  bookSeatsController,
  getCaptainRidesController
} = require("../controllers/rideController");
const isAuthenticated = require("../middlewares/isAuthenticated");

const router = express.Router();

router.post("/create", isAuthenticated, createRideController);
router.get("/search-scheduled", isAuthenticated, searchScheduledRidesController);
router.get("/my-rides", isAuthenticated, getCaptainRidesController); // ✅ Captain home
router.get("/:id", isAuthenticated, getRideByIdController);
router.post("/:id/book", isAuthenticated, bookSeatsController);

module.exports = router;
