import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
        const response = await axios.get(
          "http://localhost:5000/api/rides/search-scheduled",
          {
            params: { origin, destination, date },
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true, // optional if backend uses cookies
          }
        );

        console.log("Fetched rides:", response.data.rides);
        console.log("vehicleType from query:", vehicleType);
        console.log("seats from query:", seats);

        const filtered = response.data.rides.filter((ride) => {
          const rideVehicleType =
            ride?.captainId?.vehicle?.vehicleType?.toLowerCase();
          const requestedVehicleType = vehicleType?.toLowerCase();
          return rideVehicleType === requestedVehicleType;
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Scheduled Rides from {origin} to {destination} on {date}
      </h1>

      {loading ? (
        <p className="text-gray-700 dark:text-gray-300">Loading rides...</p>
      ) : rides.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">
          No rides found matching your criteria.
        </p>
      ) : (
        <div className="grid gap-4">
          {rides.map((ride) => (
            <div
              key={ride._id}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
            >
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                {ride.origin} ➡️ {ride.destination}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Captain:</strong> {ride.captainId.name} (
                {ride.captainId.phone})
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Vehicle:</strong> {ride.captainId.vehicle.model} (
                {ride.captainId.vehicle.numberPlate})
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Seats:</strong> {ride.seatsBooked}/{ride.totalSeats}{" "}
                {ride.totalSeats - ride.seatsBooked <= 0 && (
                  <span className="text-red-500 font-semibold"> (Full)</span>
                )}
              </p>

              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Departure:</strong>{" "}
                {new Date(ride.departureTime).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Fare:</strong> ₹
                {ride.finalFare || ride.fare?.[vehicleType] || "N/A"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScheduledRide;
