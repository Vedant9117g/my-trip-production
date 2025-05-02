import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import LocationSearchPanel from "./LocationSearchPanel";
import { SocketContext } from "@/context/SocketContext";
import { useLoadUserQuery } from "@/features/api/authApi";
import {
  MapPin,
  Navigation,
  Car,
  Users,
  CalendarDays,
  LocateIcon,
  Clock,
} from "lucide-react";

const SearchCard = () => {
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

  useEffect(() => {
    if (!isLoading && userData?.user) {
      console.log("User socketId:", userData.user.socketId); // Log the socketId
    }
  }, [isLoading, userData]);

  useEffect(() => {
    socket.on("rideAccepted", (data) => {
      console.log("Ride accepted by captain:", data);
      alert(`Your ride has been accepted by ${data.captain.name}.`);
    });

    return () => {
      socket.off("rideAccepted");
    };
  }, [socket]);

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
    <>
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
          <LocateIcon className="inline-block mr-2 text-blue-600" />
          Find a Ride
        </h1>

        <div className="space-y-5">
          {/* Origin */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <MapPin className="inline-block w-4 h-4 mr-1 text-blue-500" />
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
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-300 text-gray-900 dark:text-white dark:bg-gray-700"
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <Navigation className="inline-block w-4 h-4 mr-1 text-green-500" />
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
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-300 text-gray-900 dark:text-white dark:bg-gray-700"
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <Clock className="inline-block w-4 h-4 mr-1 text-purple-500" />
              Ride Type
            </label>
            <select
              value={rideType}
              onChange={(e) => setRideType(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg shadow-sm text-gray-900 dark:bg-gray-700 dark:text-white"
            >
              <option value="scheduled">Scheduled</option>
              <option value="instant">Instant</option>
            </select>
          </div>

          {/* Vehicle Type */}
          {rideType === "scheduled" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Car className="inline-block w-4 h-4 mr-1 text-amber-500" />
                Vehicle Type
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg shadow-sm text-gray-900 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Vehicle Type</option>
                <option value="car">Car</option>
                <option value="bike">Bike</option>
                <option value="auto">Auto</option>
              </select>
            </div>
          )}

          {rideType === "scheduled" && (
            <div className="flex flex-col md:flex-row gap-4">
              {/* Date */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <CalendarDays className="inline-block w-4 h-4 mr-1 text-indigo-500" />
                  Date of Ride
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm 
                   text-gray-900 dark:text-white bg-white dark:bg-gray-700 
                   placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              {/* Number of Seats */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Users className="inline-block w-4 h-4 mr-1 text-pink-500" />
                  Number of Seats
                </label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={seats}
                  onChange={(e) => setSeats(Number(e.target.value))}
                  placeholder="Enter seats"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm 
                   text-gray-900 dark:text-white bg-white dark:bg-gray-700 
                   placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-lg transition duration-200"
          >
            🔍 Search Rides
          </button>
        </div>

        {/* Floating Component for Instant Ride */}
        {showFareComponent && fareDetails && (
          <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl lg:mt-0 mt-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-center">
              Select Vehicle Type
            </h3>
            <div className="space-y-4">
              {[
                {
                  type: "car",
                  label: "Car",
                  img: "https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg",
                },
                {
                  type: "bike",
                  label: "Bike",
                  img: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",
                },
                {
                  type: "auto",
                  label: "Auto",
                  img: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png",
                },
              ].map(({ type, label, img }) => (
                <button
                  key={type}
                  onClick={() => handleVehicleTypeSelection(type)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md border 
            ${
              vehicleType === type
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-transparent"
            }`}
                  disabled={loading}
                >
                  <img
                    src={img}
                    alt={label}
                    className="w-10 h-10 rounded-md object-cover"
                  />
                  <span className="text-sm font-medium">
                    {label} - ₹{fareDetails[type]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SearchCard;
