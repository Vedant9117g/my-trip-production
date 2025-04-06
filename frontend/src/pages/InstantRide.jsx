import React, { useState } from "react";

const InstantRide = () => {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [rideType, setRideType] = useState("economy"); // Default ride type
  const [isBooking, setIsBooking] = useState(false);

  const handleRideBooking = () => {
    if (!pickup || !dropoff) {
      alert("Please enter both pickup and drop-off locations.");
      return;
    }

    setIsBooking(true);

    // Simulate API call for booking a ride
    setTimeout(() => {
      alert(`Ride booked successfully! Pickup: ${pickup}, Drop-off: ${dropoff}, Ride Type: ${rideType}`);
      setIsBooking(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col md:flex-row items-center justify-center p-6 gap-6">
      {/* Form Section */}
      <div className="w-full md:w-1/2 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Instant Ride</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pickup Location</label>
            <input
              type="text"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              placeholder="Enter pickup location"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Drop-off Location</label>
            <input
              type="text"
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
              placeholder="Enter drop-off location"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ride Type</label>
            <select
              value={rideType}
              onChange={(e) => setRideType(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="economy">Economy</option>
              <option value="premium">Premium</option>
              <option value="shared">Shared</option>
            </select>
          </div>
          <button
            onClick={handleRideBooking}
            disabled={isBooking}
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {isBooking ? "Booking..." : "Book Ride"}
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

export default InstantRide;