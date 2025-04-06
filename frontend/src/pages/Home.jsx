import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleRideSelection = (type) => {
    if (type === "instant") {
      navigate("/instant-ride");
    } else if (type === "scheduled") {
      navigate("/scheduled-ride");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Welcome to Ride Finder</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Ride Finder is your ultimate solution for finding rides quickly and conveniently. Whether you need an
          instant ride or want to schedule one for later, we've got you covered.
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Choose between an <strong>Instant Ride</strong> for immediate travel or a <strong>Scheduled Ride</strong> to
          plan your journey in advance.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button
            onClick={() => handleRideSelection("instant")}
            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Instant Ride
          </button>
          <button
            onClick={() => handleRideSelection("scheduled")}
            className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          >
            Scheduled Ride
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;