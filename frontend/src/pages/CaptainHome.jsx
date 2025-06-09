import React, { useState, useEffect, useContext } from "react";
import PublishRideCard from "@/components/captain/PublishRideCard";
import RideRequestPopup from "@/components/captain/RideRequestPopup";
import { SocketContext } from "../context/SocketContext";
import { useLoadUserQuery } from "../features/api/authApi";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Car, ClipboardList, Users, DollarSign } from "lucide-react";

import { useDispatch } from "react-redux";
import { setRideDetails } from "@/features/api/rideSlice";

const CaptainHome = () => {
  const { socket } = useContext(SocketContext); // Access the socket instance
  const { data: userData, isLoading } = useLoadUserQuery();
  const [ride, setRide] = useState(null); // Track the ride for the popup
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      setRide(data);
    };

    // Remove any existing listener before adding a new one
    socket.off("new-ride");
    socket.on("new-ride", handleNewRide);

    // Cleanup the event listener when the component unmounts
    return () => {
      socket.off("new-ride", handleNewRide);
    };
  }, [socket]);

  const handleAcceptRide = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Unauthorized. Redirecting to login...");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `https://my-trip-production-1.onrender.com/api/rides/${ride._id}/accept`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      toast.success("Ride accepted successfully!");
      console.log("Ride accepted:", response.data.ride);

      // Dispatch ride details to Redux
      dispatch(setRideDetails(response.data.ride));
      // Navigate to InstantRideDetail page
      navigate("/instant-ride-detail");
      // Emit rideAccepted event to the passenger

      socket.emit("rideAccepted", {
        rideId: ride._id,
        captain: {
          name: userData.user.name,
          vehicleType: ride.vehicleType,
          phone: userData.user.phone,
        },
      });

      setRide(null);
    } catch (error) {
      console.error("Error accepting ride:", error);
      toast.error(
        error.response?.data?.message || "Failed to accept the ride."
      );
    }
  };

  const handleRejectRide = () => {
    console.log("Ride rejected:", ride);
    toast.error("Ride rejected!");
    setRide(null); // Clear the popup after rejecting
  };

  useEffect(() => {
    if (!isLoading && userData?.user) {
      console.log("User socketId:", userData.user.socketId); // Log the socketId
    }
  }, [isLoading, userData]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Hero Section */}
      <header className="w-full py-16 text-center bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-gray-900 dark:to-gray-800 text-white">
        <h1 className="text-5xl font-bold mb-4">
          Welcome to Captain Dashboard
        </h1>
        <p className="text-lg font-medium">
          Manage your rides, track requests, and earn rewards. Your journey
          starts here!
        </p>
        {/* Publish Ride Section */}
        <section className="flex justify-center py-16 px-6">
          <PublishRideCard />
        </section>
      </header>

      {/* Features Section */}
      <section className="w-full max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center mb-8">
          Why Be a Captain?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-6 rounded-lg shadow-lg flex flex-col items-center">
            <ClipboardList className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Manage Rides</h3>
            <p className="text-center">
              Easily publish and manage your rides. Stay in control of your
              schedule and preferences.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-6 rounded-lg shadow-lg flex flex-col items-center">
            <Users className="w-12 h-12 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Track Requests</h3>
            <p className="text-center">
              Get real-time ride requests and accept or reject them with ease.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-6 rounded-lg shadow-lg flex flex-col items-center">
            <DollarSign className="w-12 h-12 text-purple-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Earn Rewards</h3>
            <p className="text-center">
              Earn money and rewards for every ride you complete. Drive smarter,
              earn better.
            </p>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="w-full bg-indigo-700 dark:bg-gray-900 py-16 text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to Publish Your Ride?</h2>
        <p className="text-lg mb-8">
          Start your journey as a captain today and make a difference in the way
          people travel.
        </p>
        <button
          onClick={() => navigate("/publish")}
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold text-lg transition duration-200"
        >
          Publish a Ride
        </button>
      </section>

      {/* Ride Request Popup */}
      <RideRequestPopup
        ride={ride}
        onAccept={handleAcceptRide}
        onReject={handleRejectRide}
      />
    </div>
  );
};

export default CaptainHome;
