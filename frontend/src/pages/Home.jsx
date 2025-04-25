
import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import LocationSearchPanel from "../components/passanger/LocationSearchPanel";
import { SocketContext } from "../context/SocketContext"; // Import SocketContext
import { useLoadUserQuery } from "../features/api/authApi"; // Import the hook to fetch user data

const Home = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [rideType, setRideType] = useState("scheduled");
  const [vehicleType, setVehicleType] = useState(""); // Vehicle type for both scheduled and instant rides
  const [seats, setSeats] = useState(1);
  const [date, setDate] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(""); // Track which field is active (origin or destination)
  const [fareDetails, setFareDetails] = useState(null); // Store fare details
  const [showFareComponent, setShowFareComponent] = useState(false); // Control floating component visibility
  const [loading, setLoading] = useState(false); // Loading state for creating a ride
  const panelRef = useRef(null);

  const navigate = useNavigate();
  const { socket } = useContext(SocketContext); // Access the socket instance
  const { data: userData, isLoading } = useLoadUserQuery(); // Fetch user data

  useEffect(() => {
    if (!isLoading && userData?.user) {
      const userId = userData.user._id; // Extract userId from the fetched user data
      if (userId && !socket.hasEmittedJoin) {
        socket.emit("join", { userId }); // Emit the join event with userId
        socket.hasEmittedJoin = true; // Mark that the join event has been emitted
        console.log("Emitted 'join' event with userId:", userId);
      }
    }

    // Listen for server responses
    socket.on("joinSuccess", (message) => {
      console.log("Server response to join:", message);
    });

    return () => {
      // Clean up the event listener
      socket.off("joinSuccess");
    };
  }, [socket, isLoading, userData]);

  const fetchSuggestions = async (input) => {
    if (!input) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/maps/suggestions?input=${input}`
      );
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  };

  const handleSelectSuggestion = (place) => {
    if (activeField === "origin") {
      setOrigin(place);
    } else if (activeField === "destination") {
      setDestination(place);
    }
    setSuggestions([]); // Clear suggestions after selection
  };

  const handleClickOutside = (event) => {
    if (panelRef.current && !panelRef.current.contains(event.target)) {
      setSuggestions([]); // Clear suggestions when clicking outside
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchFareDetails = async () => {
    if (!origin || !destination) {
      alert("Please enter both origin and destination to calculate fare.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/rides/fare?origin=${encodeURIComponent(
          origin
        )}&destination=${encodeURIComponent(destination)}`,
        {
          method: "GET",
          credentials: "include", // Include credentials (cookies)
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      const data = await res.json();
      setFareDetails(data); // Set fare details
      setShowFareComponent(true); // Show the floating component
    } catch (err) {
      console.error("Error fetching fare details:", err);
      alert("Failed to fetch fare details.");
    }
  };

  const handleVehicleTypeSelection = async (type) => {
    setVehicleType(type);
    setLoading(true);

    // Create ride with selected vehicle type
    try {
      const res = await fetch("http://localhost:5000/api/rides/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Include the token
        },
        credentials: "include", // Include credentials (cookies)
        body: JSON.stringify({
          origin,
          destination,
          rideType: "instant",
          vehicleType: type,
          totalSeats: seats,
          finalFare: fareDetails[type], // Set the selected vehicle's fare
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create ride");
      }

      const data = await res.json();
      alert("Ride created successfully!");
      // navigate(`/ride/${data.ride._id}`); // Redirect to the ride details page
    } catch (err) {
      console.error("Error creating ride:", err);
      alert("Failed to create ride.");
    } finally {
      setLoading(false);
      setShowFareComponent(false); // Hide the floating component
    }
  };

  const handleSubmit = () => {
    if (!origin || !destination || !rideType || !seats) {
      alert("Please fill all fields.");
      return;
    }

    if (rideType === "scheduled") {
      if (!date) {
        alert("Please select a date for scheduled rides.");
        return;
      }

      if (!vehicleType) {
        alert("Please select a vehicle type for scheduled rides.");
        return;
      }

      const query = new URLSearchParams({
        origin,
        destination,
        vehicleType,
        seats,
        date,
      }).toString();

      navigate(`/scheduled-rides?${query}`);
    } else {
      fetchFareDetails(); // Fetch fare details for instant rides
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Find a Ride
        </h1>

        <div className="space-y-4">
          {/* Origin */}
          <div className="relative">
            <label className="block text-sm text-gray-700 dark:text-gray-300">
              Origin
            </label>
            <input
              type="text"
              value={origin}
              onChange={(e) => {
                setOrigin(e.target.value);
                setActiveField("origin");
                if (e.target.value.length > 2) fetchSuggestions(e.target.value);
              }}
              placeholder="Enter origin"
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
            />
            {activeField === "origin" && suggestions.length > 0 && (
              <div ref={panelRef}>
                <LocationSearchPanel
                  suggestions={suggestions}
                  onSelect={handleSelectSuggestion}
                />
              </div>
            )}
          </div>

          {/* Destination */}
          <div className="relative">
            <label className="block text-sm text-gray-700 dark:text-gray-300">
              Destination
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setActiveField("destination");
                if (e.target.value.length > 2) fetchSuggestions(e.target.value);
              }}
              placeholder="Enter destination"
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
            />
            {activeField === "destination" && suggestions.length > 0 && (
              <div ref={panelRef}>
                <LocationSearchPanel
                  suggestions={suggestions}
                  onSelect={handleSelectSuggestion}
                />
              </div>
            )}
          </div>

          {/* Ride Type */}
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300">
              Ride Type
            </label>
            <select
              value={rideType}
              onChange={(e) => setRideType(e.target.value)}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
            >
              <option value="scheduled">Scheduled</option>
              <option value="instant">Instant</option>
            </select>
          </div>

          {/* Vehicle Type (for scheduled rides) */}
          {rideType === "scheduled" && (
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300">
                Vehicle Type
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Vehicle Type</option>
                <option value="car">Car</option>
                <option value="bike">Bike</option>
                <option value="auto">Auto</option>
              </select>
            </div>
          )}

          {/* Seats */}
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300">
              Seats
            </label>
            <input
              type="number"
              min="1"
              max="6"
              value={seats}
              onChange={(e) => setSeats(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Date (for scheduled) */}
          {rideType === "scheduled" && (
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              />
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Search Rides
          </button>
        </div>
      </div>

      {/* Floating Component for Instant Ride */}
      {showFareComponent && fareDetails && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg w-80">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Select Vehicle Type
          </h3>
          <div className="space-y-2">
            {["car", "bike", "auto"].map((type) => (
              <button
                key={type}
                onClick={() => handleVehicleTypeSelection(type)}
                className={`w-full px-4 py-2 rounded-md ${
                  vehicleType === type
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                }`}
                disabled={loading}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)} - ₹
                {fareDetails[type]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;