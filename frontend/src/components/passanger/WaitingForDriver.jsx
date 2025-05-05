import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Loader2 } from "lucide-react";
import { SocketContext } from "@/context/SocketContext";
import { setRideDetails } from "@/features/api/rideSlice";
import DriverDetailsCard from "./DriverDetailsCard";

const WaitingForDriver = () => {
  const { socket } = useContext(SocketContext);
  const { rideDetails } = useSelector((state) => state.ride); // Access full ride details
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(120);
  const [isRideAccepted, setIsRideAccepted] = useState(false); // Track ride acceptance

  // Rehydrate Redux state from localStorage on component mount
  useEffect(() => {
    if (!rideDetails) {
      const savedState = localStorage.getItem("rideState");
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        dispatch(setRideDetails(parsedState.rideDetails)); // Rehydrate Redux state
        if (parsedState.rideDetails?.status === "accepted") {
          setIsRideAccepted(true); // Mark ride as accepted if already accepted
        }
      } else {
        alert("No ride details found. Redirecting to home.");
        navigate("/");
      }
    } else if (rideDetails.status === "accepted") {
      setIsRideAccepted(true); // Mark ride as accepted if already accepted
    }
  }, [rideDetails, dispatch, navigate]);

  useEffect(() => {
    if (!socket || typeof socket.on !== "function") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    socket.on("rideAccepted", (data) => {
      console.log("Full Ride Details:", data); // Log full ride details in the console
      dispatch(setRideDetails(data)); // Store the full ride details in Redux
      setIsRideAccepted(true); // Mark ride as accepted
      clearInterval(timer);
    });

    return () => {
      clearInterval(timer);
      socket.off("rideAccepted");
    };
  }, [socket, dispatch]);

  useEffect(() => {
    if (timeLeft === 0 && !isRideAccepted) {
      alert("No driver accepted your ride. Try again.");
      navigate("/");
    }
  }, [timeLeft, isRideAccepted, navigate]);

  if (isRideAccepted && rideDetails) {
    const {
      captainId: captainDetails,
      otp,
      origin,
      destination,
      fare,
      status,       
    } = rideDetails;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
          <h1 className="text-3xl font-bold mb-2 text-center">Driver Found!</h1>
          <p className="text-lg mb-4 text-center">Your ride has been accepted.</p>
          <DriverDetailsCard captain={rideDetails.captainId} ride={rideDetails} />
        </div>
      );
  }

  // Show timer and waiting message until ride is accepted
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