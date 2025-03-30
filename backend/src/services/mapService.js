const axios = require("axios");

const BASE_URL = "https://api.openrouteservice.org";
const apiKey = process.env.ORS_API_KEY;

// Generic function to fetch data from ORS
const fetchFromORS = async (url, method = "GET", body = null) => {
  try {
    const options = {
      method,
      url,
      headers: {
        Authorization: `Bearer ${apiKey}`, // Use Bearer token for authentication
        "Content-Type": "application/json",
      },
    };

    if (body) options.data = body; // Add body for POST requests

    const response = await axios(options);
    return response.data;
  } catch (error) {
    console.error(`ORS API Error (${url}):`, error.response?.data || error.message);
    return Promise.reject(new Error("Failed to fetch data from OpenRouteService"));
  }
};

// Get Coordinates for an Address
const getAddressCoordinate = async (address) => {
  const url = `${BASE_URL}/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(address)}`;
  const data = await fetchFromORS(url);

  if (data.features?.length > 0) {
    const [lng, lat] = data.features[0].geometry.coordinates;
    return { lng, lat };
  }

  return Promise.reject(new Error("No location found for the given address"));
};

// Get Distance & Time Between Two Locations
const getDistanceTime = async (origin, destination) => {
  if (!origin || !destination) return Promise.reject(new Error("Origin and destination are required"));

  const originCoords = await getAddressCoordinate(origin).catch(() => null);
  const destinationCoords = await getAddressCoordinate(destination).catch(() => null);

  if (!originCoords || !destinationCoords) {
    return Promise.reject(new Error("Invalid origin or destination"));
  }

  const body = {
    locations: [
      [originCoords.lng, originCoords.lat],
      [destinationCoords.lng, destinationCoords.lat],
    ],
    metrics: ["duration", "distance"],
    units: "m",
  };

  const url = `${BASE_URL}/v2/matrix/driving-car`;
  const data = await fetchFromORS(url, "POST", body);

  if (data.durations && data.distances) {
    return {
      origin: { name: origin, coordinates: originCoords },
      destination: { name: destination, coordinates: destinationCoords },
      distance: Math.ceil(data.distances[0][1]), // Distance in meters
      duration: Math.ceil(data.durations[0][1]), // Duration in seconds
    };
  }

  return Promise.reject(new Error("Unable to fetch distance and time"));
};

// Get AutoComplete Suggestions for an Address
const getAutoCompleteSuggestions = async (input) => {
  const url = `${BASE_URL}/geocode/autocomplete?api_key=${apiKey}&text=${encodeURIComponent(input)}`;
  const data = await fetchFromORS(url);

  if (data.features) {
    return data.features.map((feature) => feature.properties.label);
  }

  return Promise.reject(new Error("No autocomplete suggestions found"));
};

module.exports = { getAddressCoordinate, getDistanceTime, getAutoCompleteSuggestions };
