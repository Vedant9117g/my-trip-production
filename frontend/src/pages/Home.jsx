import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LocationSearchPanel from "../components/passanger/LocationSearchPanel";

const Home = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [rideType, setRideType] = useState("scheduled");
  const [vehicleType, setVehicleType] = useState("car");
  const [seats, setSeats] = useState(1);
  const [date, setDate] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeField, setActiveField] = useState("");
  const panelRef = useRef(null);

  const navigate = useNavigate();

  const fetchSuggestions = async (input) => {
    if (!input) return;
    try {
      const res = await fetch(`http://localhost:5000/api/maps/suggestions?input=${input}`);
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  };

  const handleSubmit = () => {
    if (!origin || !destination || !vehicleType || !rideType || !seats) {
      alert("Please fill all fields.");
      return;
    }

    if (rideType === "scheduled") {
      if (!date) {
        alert("Please select a date for scheduled rides.");
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
      navigate("/instant-ride"); // Placeholder
    }
  };

  const handleClickOutside = (e) => {
    if (panelRef.current && !panelRef.current.contains(e.target)) {
      setPanelOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">Find a Ride</h1>

        <div className="space-y-4">
          {/* Origin */}
          <div className="relative">
            <label className="block text-sm text-gray-700 dark:text-gray-300">Origin</label>
            <input
              type="text"
              value={origin}
              onChange={(e) => {
                setOrigin(e.target.value);
                if (e.target.value.length > 2) fetchSuggestions(e.target.value);
              }}
              onFocus={() => {
                setPanelOpen(true);
                setActiveField("origin");
              }}
              placeholder="Enter origin"
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
            />
            {panelOpen && activeField === "origin" && (
              <div ref={panelRef}>
                <LocationSearchPanel
                  suggestions={suggestions}
                  setPickup={setOrigin}
                  activeField="origin"
                  setPanelOpen={setPanelOpen}
                />
              </div>
            )}
          </div>

          {/* Destination */}
          <div className="relative">
            <label className="block text-sm text-gray-700 dark:text-gray-300">Destination</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                if (e.target.value.length > 2) fetchSuggestions(e.target.value);
              }}
              onFocus={() => {
                setPanelOpen(true);
                setActiveField("destination");
              }}
              placeholder="Enter destination"
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
            />
            {panelOpen && activeField === "destination" && (
              <div ref={panelRef}>
                <LocationSearchPanel
                  suggestions={suggestions}
                  setDestination={setDestination}
                  activeField="destination"
                  setPanelOpen={setPanelOpen}
                />
              </div>
            )}
          </div>

          {/* Ride Type */}
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300">Ride Type</label>
            <select
              value={rideType}
              onChange={(e) => setRideType(e.target.value)}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
            >
              <option value="scheduled">Scheduled</option>
              <option value="instant">Instant</option>
            </select>
          </div>

          {/* Vehicle Type */}
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300">Vehicle Type</label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
            >
              <option value="car">Car</option>
              <option value="bike">Bike</option>
              <option value="auto">Auto</option>
            </select>
          </div>

          {/* Seats */}
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300">Seats</label>
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
              <label className="block text-sm text-gray-700 dark:text-gray-300">Date</label>
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
    </div>
  );
};

export default Home;
