import React, { useEffect, useState,useContext } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../context/SocketContext"; // Import SocketContext
import { useLoadUserQuery } from "../features/api/authApi";

const RideCard = ({ ride }) => {
  return (
    <div className="p-4 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
      <p className="text-gray-900 dark:text-white font-medium">
        {ride.origin} → {ride.destination}
      </p>
      <p className="text-gray-700 dark:text-gray-300">
        <strong>Departure:</strong>{" "}
        {dayjs(ride.departureTime).format("DD MMM YYYY, hh:mm A")}
      </p>
      <p className="text-gray-700 dark:text-gray-300">
        <strong>Fare:</strong> ₹{ride.finalFare}
      </p>
      <p className="text-gray-700 dark:text-gray-300">
        <strong>Seats:</strong>{" "}
        {ride.scheduledType === "carpool"
          ? `${ride.totalSeats - ride.availableSeats}/${ride.totalSeats}`
          : `${ride.seatsBooked}/${ride.totalSeats}`}
      </p>
    </div>
  );
};

const CaptainHome = () => {
  const [activeRides, setActiveRides] = useState([]);
  const [settledRides, setSettledRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    totalSeats: 1,
    rideType: "scheduled",
    scheduledType: "cab",
    departureTime: "",
    vehicleType: "car",
    customFare: "",
  });

  const { socket } = useContext(SocketContext); // Access the socket instance
  const { data: userData, isLoading } = useLoadUserQuery();
  const navigate = useNavigate();

  const fetchRides = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Unauthorized. Redirecting to login...");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:5000/api/rides/my-rides",
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setActiveRides(response.data.active || []);
      setSettledRides(response.data.settled || []);
    } catch (error) {
      console.error("Error fetching rides:", error);
      toast.error("Failed to load rides.");
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Emit the "join" event with the userId when the component mounts
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
    // Ensure the "new-ride" event listener is registered only once
    const handleNewRide = (data) => {
      console.log("New ride received:", data);
    };
  
    // Remove any existing listener before adding a new one
    socket.off("new-ride");
    socket.on("new-ride", handleNewRide);
  
    // Cleanup the event listener when the component unmounts
    return () => {
      socket.off("new-ride", handleNewRide);
    };
  }, [socket]);


  useEffect(() => {
    fetchRides();
  }, [navigate]);

  useEffect(() => {
    if (!isLoading && userData?.user) {
      console.log("User socketId:", userData.user.socketId); // Log the socketId
    }
  }, [isLoading, userData]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePublishRide = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Unauthorized. Redirecting to login...");
      navigate("/login");
      return;
    }

    const payload = { ...formData, totalSeats: Number(formData.totalSeats) };
    if (payload.scheduledType === "cab") {
      payload.customFare = payload.customFare
        ? Number(payload.customFare)
        : undefined;
    } else {
      delete payload.customFare;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/rides/create",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      toast.success(response.data.message || "Ride created successfully!");
      setFormData({
        origin: "",
        destination: "",
        totalSeats: 1,
        rideType: "scheduled",
        scheduledType: "cab",
        departureTime: "",
        vehicleType: "car",
        customFare: "",
      });
      fetchRides();
    } catch (error) {
      console.error("Error creating ride:", error);
      toast.error(error.response?.data?.message || "Failed to create ride.");
    }
  };

  if (loading) return <h1 className="text-center text-xl">Loading Rides...</h1>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-4">
          Captain Dashboard
        </h2>

        {/* Publish Ride Form */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Publish a New Ride
          </h3>
          <form onSubmit={handlePublishRide} className="space-y-4">
            <input
              type="text"
              name="origin"
              placeholder="Origin"
              value={formData.origin}
              onChange={handleInputChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              required
            />
            <input
              type="text"
              name="destination"
              placeholder="Destination"
              value={formData.destination}
              onChange={handleInputChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              required
            />
            <input
              type="datetime-local"
              name="departureTime"
              value={formData.departureTime}
              onChange={handleInputChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              required
            />
            <input
              type="number"
              name="totalSeats"
              placeholder="Total Seats"
              value={formData.totalSeats}
              onChange={handleInputChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              min={1}
              required
            />
            <select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleInputChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="car">Car</option>
              <option value="bike">Bike</option>
              <option value="auto">Auto</option>
            </select>

            <select
              name="scheduledType"
              value={formData.scheduledType}
              onChange={handleInputChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            >
              <option value="cab">Cab</option>
              <option value="carpool">Carpool</option>
            </select>

            {formData.scheduledType === "cab" && (
              <input
                type="number"
                name="customFare"
                placeholder="Optional Custom Fare"
                value={formData.customFare}
                onChange={handleInputChange}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                min={1}
              />
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Publish Ride
            </button>
          </form>
        </div>

        {/* Active Rides */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Active Rides
          </h3>
          {activeRides.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">
              No active rides found.
            </p>
          ) : (
            <div className="space-y-4">
              {activeRides.map((ride) => (
                <RideCard key={ride._id} ride={ride} />
              ))}
            </div>
          )}
        </div>

        {/* Settled Rides */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Settled Rides
          </h3>
          {settledRides.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">
              No settled rides found.
            </p>
          ) : (
            <div className="space-y-4">
              {settledRides.map((ride) => (
                <RideCard key={ride._id} ride={ride} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaptainHome;
