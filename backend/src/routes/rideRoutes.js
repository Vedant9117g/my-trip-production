const express = require("express");
const { 
  createRideController, 
} = require("../controllers/rideController");
const isAuthenticated = require("../middlewares/isAuthenticated");

const router = express.Router();

router.post("/create", isAuthenticated, createRideController);

module.exports = router;


// before commit.