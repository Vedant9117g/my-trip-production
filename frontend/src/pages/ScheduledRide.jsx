import React, { useState, useEffect, useRef } from "react";
import LocationSearchPanel from "../components/passanger/LocationSearchPanel";

const ScheduledRide = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [rideType, setRideType] = useState("car"); // Default ride type
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isScheduling, setIsScheduling] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeField, setActiveField] = useState(""); // Tracks which field is active
  const panelRef = useRef(null);

  const fetchSuggestions = async (input) => {
    try {
      const response = await fetch(`http://localhost:5000/api/maps/suggestions?input=${input}`);
      const data = await response.json();
      setSuggestions(data); // Update suggestions state
      console.log("Suggestions:", data); // Log suggestions to the console
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handlePickupChange = (e) => {
    const value = e.target.value;
    setPickup(value);
    if (value.length > 2) {
      fetchSuggestions(value); // Fetch suggestions when input length > 2
    }
  };

  const handleDestinationChange = (e) => {
    const value = e.target.value;
    setDestination(value);
    if (value.length > 2) {
      fetchSuggestions(value); // Fetch suggestions when input length > 2
    }
  };

  const handleClickOutside = (event) => {
    if (panelRef.current && !panelRef.current.contains(event.target)) {
      setPanelOpen(false); // Close the panel if clicked outside
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleRideScheduling = () => {
    if (!pickup || !destination || !date || !time) {
      alert("Please fill in all fields.");
      return;
    }

    setIsScheduling(true);

    // Simulate API call for scheduling a ride
    setTimeout(() => {
      alert(
        `Ride scheduled successfully! Pickup: ${pickup}, Destination: ${destination}, Ride Type: ${rideType}, Date: ${date}, Time: ${time}`
      );
      setIsScheduling(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col md:flex-row items-center justify-center p-6 gap-6">
      {/* Form Section */}
      <div className="w-full md:w-1/2 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg relative">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Scheduled Ride</h1>
        <div className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pickup Location</label>
            <input
              type="text"
              value={pickup}
              onChange={handlePickupChange}
              onFocus={() => {
                setPanelOpen(true);
                setActiveField("pickup");
              }}
              placeholder="Enter pickup location"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            {panelOpen && activeField === "pickup" && (
              <div ref={panelRef}>
                <LocationSearchPanel
                  suggestions={suggestions}
                  setPickup={setPickup}
                  setDestination={setDestination}
                  activeField={activeField}
                  setPanelOpen={setPanelOpen}
                />
              </div>
            )}
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Destination</label>
            <input
              type="text"
              value={destination}
              onChange={handleDestinationChange}
              onFocus={() => {
                setPanelOpen(true);
                setActiveField("destination");
              }}
              placeholder="Enter destination"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            {panelOpen && activeField === "destination" && (
              <div ref={panelRef}>
                <LocationSearchPanel
                  suggestions={suggestions}
                  setPickup={setPickup}
                  setDestination={setDestination}
                  activeField={activeField}
                  setPanelOpen={setPanelOpen}
                />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ride Type</label>
            <select
              value={rideType}
              onChange={(e) => setRideType(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="car">Car</option>
              <option value="bike">Bike</option>
              <option value="auto">Auto</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button
            onClick={handleRideScheduling}
            disabled={isScheduling}
            className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
          >
            {isScheduling ? "Scheduling..." : "Schedule Ride"}
          </button>
        </div>
      </div>

      {/* Map Section */}
      <div className="w-full md:w-1/2">
        <img
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt="Map"
          className="w-full h-64 md:h-full object-cover rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default ScheduledRide;