const mapService = require("../services/mapService");

const getCoordinates = async (req, res) => {
  const { address } = req.query;
  if (!address) return res.status(400).json({ error: "Address is required" });

  try {
    const coordinates = await mapService.getAddressCoordinate(address);
    res.json(coordinates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDistanceAndTime = async (req, res) => {
  const { origin, destination } = req.query;
  if (!origin || !destination) {
    return res.status(400).json({ error: "Origin and destination are required" });
  }

  try {
    const data = await mapService.getDistanceTime(origin, destination);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSuggestions = async (req, res) => {
  const { input } = req.query;
  if (!input) return res.status(400).json({ error: "Input is required" });

  try {
    const suggestions = await mapService.getAutoCompleteSuggestions(input);
    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getCoordinates, getDistanceAndTime, getSuggestions };
