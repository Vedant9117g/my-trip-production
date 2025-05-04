import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Loader2, User, Phone, Car, Star, Mail, MapPin } from "lucide-react"; // Icons
import { SocketContext } from "@/context/SocketContext";
import { setCaptainDetails } from "@/features/api/rideSlice";

const WaitingForDriver = () => {
  const { socket } = useContext(SocketContext);
  const { rideId, status } = useSelector((state) => state.ride);
  const captainDetails = useSelector((state) => state.ride.captainDetails);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(120);

  useEffect(() => {
    console.log("Updated captainDetails:", captainDetails); // Debugging log
  }, [captainDetails]);

  useEffect(() => {
    if (!socket || typeof socket.on !== "function") {
      console.error("Socket is not initialized or invalid");
      return;
    }

    if (!rideId) {
      alert("No ride ID found. Redirecting to home.");
      navigate("/");
      return;
    }

    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Listen for ride acceptance from the server
    socket.on("rideAccepted", (data) => {
      console.log("Ride accepted by captain:", data); // Debugging log
      console.log("Redux rideId:", rideId); // Debugging log
      console.log("Event rideId:", data.rideId); // Debugging log
      console.log("status:", data.status); // Debugging log
      console.log("Captain details payload:", data.captain); // Log captain details

      if (data.rideId === rideId) {
        dispatch(setCaptainDetails(data.captain)); // Update captain details in Redux
        clearInterval(timer); // Stop the timer only after dispatching
      }
    });

    // Cleanup
    return () => {
      clearInterval(timer);
      socket.off("rideAccepted");
    };
  }, [socket, rideId, dispatch, navigate]);

  useEffect(() => {
    if (timeLeft === 0 && status === "searching") {
      alert("No driver accepted your ride. Please try again.");
      navigate("/");
    }
  }, [timeLeft, status, navigate]);

  if (captainDetails) {
    // Provide dummy data for missing fields
    const {
      name = "Unknown Captain",
      email = "Not Available",
      phone = "Not Available",
      profilePhoto = "/default-profile.png", // Default profile photo
      role = "Captain",
      rating = "N/A",
      vehicle = {
        vehicleType: "Unknown",
        model: "Unknown",
        numberPlate: "Not Available",
        seats: "N/A",
      },
    } = captainDetails;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <h1 className="text-3xl font-bold mb-4">Driver Found!</h1>
        <p className="text-lg mb-6">Your ride has been accepted by:</p>

        {/* Captain Details Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center w-full max-w-md">
          <img
            src={profilePhoto}
            alt="Captain Profile"
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {name}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            <Mail className="inline-block w-5 h-5 mr-2 text-blue-600" />
            {email}
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            <Phone className="inline-block w-5 h-5 mr-2 text-green-600" />
            {phone}
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            <User className="inline-block w-5 h-5 mr-2 text-yellow-600" />
            Role: {role}
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            <Star className="inline-block w-5 h-5 mr-2 text-yellow-500" />
            Rating: {rating}
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            <Car className="inline-block w-5 h-5 mr-2 text-red-600" />
            Vehicle: {vehicle.model} ({vehicle.vehicleType})
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            <MapPin className="inline-block w-5 h-5 mr-2 text-purple-600" />
            Number Plate: {vehicle.numberPlate}
          </p>
        </div>

        <button
          onClick={() => navigate(`/ride/${rideId}`)}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold text-lg transition duration-200"
        >
          View Ride Details
        </button>
      </div>
    );
  }

  // Waiting Screen
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-4">Waiting for a Driver</h1>
      <p className="text-lg mb-6">
        Please wait while we find a driver for you.
      </p>

      <div className="flex items-center gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="text-lg font-medium">Searching...</span>
      </div>

      <div className="w-full max-w-md mt-6 bg-gray-300 dark:bg-gray-700 rounded-full h-4">
        <div
          className="bg-blue-600 h-4 rounded-full transition-all duration-1000"
          style={{ width: `${(120 - timeLeft) / 1.2}%` }}
        ></div>
      </div>

      <p className="mt-4 text-sm">
        Time left: <span className="font-bold">{timeLeft} seconds</span>
      </p>
    </div>
  );
};

export default WaitingForDriver;