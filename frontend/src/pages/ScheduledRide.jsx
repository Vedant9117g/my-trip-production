import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const ScheduledRide = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  const query = new URLSearchParams(location.search);
  const origin = query.get("origin");
  const destination = query.get("destination");
  const date = query.get("date");
  const vehicleType = query.get("vehicleType");
  const seats = query.get("seats");

  useEffect(() => {
    const fetchRides = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.warn("No token found. Redirecting to login...");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("https://my-trip-production-1.onrender.com/api/rides/search-scheduled", {
          params: { origin, destination, date },
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        const filtered = response.data.rides.filter((ride) => {
          const rideVehicleType = ride?.captainId?.vehicle?.vehicleType?.toLowerCase();
          return rideVehicleType === vehicleType?.toLowerCase();
        });

        setRides(filtered);
      } catch (error) {
        console.error("Failed to fetch rides:", error);
        if (error.response?.status === 401) {
          alert("Session expired or unauthorized. Please log in again.");
          localStorage.removeItem("authToken");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    if (origin && destination && date) {
      fetchRides();
    }
  }, [origin, destination, date, vehicleType, seats, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 p-6">
      <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
        🚗 Scheduled Rides: {origin} ➡️ {destination} on {date}
      </h1>

      {loading ? (
        <p className="text-center text-gray-600 dark:text-gray-300 text-lg">Loading rides...</p>
      ) : rides.length === 0 ? (
        <p className="text-center text-red-600 dark:text-red-400 text-lg">No rides found for your selection.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rides.map((ride) => (
            <div
              key={ride._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition transform hover:scale-105"
            >
              <div className="flex items-center gap-4 p-4 border-b border-gray-200 dark:border-gray-700">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/1999/1999625.png"
                  alt="Captain Avatar"
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {ride.captainId.name}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{ride.captainId.phone}</p>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <p className="text-gray-700 dark:text-gray-200">
                  <strong>Route:</strong> {ride.origin} ➡️ {ride.destination}
                </p>
                <p className="text-gray-700 dark:text-gray-200">
                  <strong>Departure:</strong> {new Date(ride.departureTime).toLocaleString()}
                </p>
                <p className="text-gray-700 dark:text-gray-200">
                  <strong>Vehicle:</strong>{" "}
                  {ride.captainId.vehicle
                    ? `${ride.captainId.vehicle.model} (${ride.captainId.vehicle.numberPlate})`
                    : "Not Available"}
                </p>
                <p className="text-gray-700 dark:text-gray-200">
                  <strong>Fare:</strong> ₹{ride.finalFare || ride.fare?.[vehicleType] || "N/A"}
                </p>
                <p className="text-gray-700 dark:text-gray-200">
                  <strong>Seats:</strong> {ride.seatsBooked}/{ride.totalSeats}
                </p>

                <Link
                  to={`/ride/${ride._id}`}
                  className="block text-center bg-blue-600 text-white mt-4 py-2 rounded hover:bg-blue-700"
                >
                  View & Book
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScheduledRide;
