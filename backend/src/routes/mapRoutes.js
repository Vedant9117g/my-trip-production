const express = require("express");
const router = express.Router();
const mapController = require("../controllers/mapController");

router.get("/coordinates", mapController.getCoordinates);
router.get("/distance-time", mapController.getDistanceAndTime);
router.get("/suggestions", mapController.getSuggestions);

module.exports = router;
