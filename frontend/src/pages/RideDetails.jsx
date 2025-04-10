// src/pages/RideDetails.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const RideDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seatsToBook, setSeatsToBook] = useState(1);

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`http://localhost:5000/api/rides/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        setRide(response.data.ride);
      } catch (error) {
        console.error("Failed to fetch ride details:", error);
        if (error.response?.status === 401) {
          alert("Please log in again.");
          localStorage.removeItem("authToken");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRide();
  }, [id, navigate]);

  const handleBook = async () => {
    try {
      const token = localStorage.getItem("authToken");

      const res = await axios.post(
        `http://localhost:5000/api/rides/${id}/book`,
        { seats: seatsToBook },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      alert("Seats booked successfully!");
      setRide(res.data.ride);
    } catch (error) {
      console.error("Booking failed:", error);
      alert(error.response?.data?.message || "Booking failed.");
    }
  };

  if (loading) return <p className="text-center">Loading ride details...</p>;
  if (!ride) return <p className="text-center text-red-500">Ride not found.</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">🚘 Ride Details</h2>
      <p className="mb-2 text-gray-700 dark:text-gray-300">
        <strong>Captain:</strong> {ride.captainId?.name} ({ride.captainId?.phone})
      </p>
      <p className="mb-2 text-gray-700 dark:text-gray-300">
        <strong>Route:</strong> {ride.origin} ➡️ {ride.destination}
      </p>
      <p className="mb-2 text-gray-700 dark:text-gray-300">
        <strong>Departure:</strong> {new Date(ride.departureTime).toLocaleString()}
      </p>
      <p className="mb-2 text-gray-700 dark:text-gray-300">
        <strong>Vehicle:</strong>{" "}
        {ride.captainId?.vehicle
          ? `${ride.captainId.vehicle.model} (${ride.captainId.vehicle.numberPlate})`
          : "Not Available"}
      </p>
      <p className="mb-2 text-gray-700 dark:text-gray-300">
        <strong>Fare:</strong> ₹{ride.finalFare}
      </p>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        <strong>Seats Booked:</strong> {ride.seatsBooked}/{ride.totalSeats}
      </p>

      <div className="flex items-center gap-4">
        <input
          type="number"
          min="1"
          max={ride.totalSeats - ride.seatsBooked}
          value={seatsToBook}
          onChange={(e) => setSeatsToBook(e.target.value)}
          className="px-4 py-2 border rounded-md w-28"
        />
        <button
          onClick={handleBook}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Book Seat(s)
        </button>
      </div>
    </div>
  );
};

export default RideDetails;
