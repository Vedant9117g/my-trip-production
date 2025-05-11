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

  const [timeLeft, setTimeLeft] = useState(10);
  const [isRideAccepted, setIsRideAccepted] = useState(false); // Track ride acceptance
  const [isRideStarted, setIsRideStarted] = useState(false); // Track ride start
  const [isRideCompleted, setIsRideCompleted] = useState(false); // Track ride start
  const [isRideCanceled, setIsRideCanceled] = useState(false); // Track ride start

  // Rehydrate Redux state from localStorage on component mount
  useEffect(() => {
    if (!rideDetails) {
      const savedState = localStorage.getItem("rideState");
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        const savedRide = parsed.rideDetails;

        dispatch(setRideDetails(parsedState.rideDetails)); // Rehydrate Redux state

        if (savedRide?.status === "accepted") setIsRideAccepted(true);
        if (savedRide?.status === "ongoing") setIsRideStarted(true);
        if (savedRide?.status === "completed") setIsRideCompleted(true);
        if (savedRide?.status === "canceled") setIsRideCanceled(true);
      } else {
        alert("No ride found. Redirecting to home.");
        navigate("/");
      }
    } else {
      if (rideDetails.status === "accepted") setIsRideAccepted(true);
      if (rideDetails.status === "ongoing") setIsRideStarted(true);
      if (rideDetails.status === "completed") setIsRideCompleted(true);
      if (rideDetails.status === "canceled") setIsRideCanceled(true);
    }
  }, [rideDetails, dispatch, navigate]);

  useEffect(() => {
    if (!socket || typeof socket.on !== "function") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Listen for rideAccepted event
    socket.on("rideAccepted", (data) => {
      console.log("Full Ride Details:", data); // Log full ride details in the console
      dispatch(setRideDetails(data)); // Store the full ride details in Redux
      localStorage.setItem("rideState", JSON.stringify({ rideDetails: data }));
      setIsRideAccepted(true); // Mark ride as accepted
      clearInterval(timer);
    });

    // Listen for rideStatusUpdate event (for ride started)
    socket.on("rideStatusUpdate", (data) => {
      console.log("Ride status updated:", data);
      dispatch(setRideDetails(data)); // Update Redux state with new ride details
      localStorage.setItem("rideState", JSON.stringify({ rideDetails: data }));

      if (data.status === "ongoing") {
        setIsRideStarted(true); // Mark ride as started
        alert("Your ride has started!");
      } else if (data.status === "canceled") {
        alert("Your ride has been canceled by the driver.");
        navigate("/"); // Redirect to the home page
      }
    });

    socket.on("rideCompleted", (data) => {
      console.log("Ride completed:", data);
      dispatch(setRideDetails(data)); // Update Redux state
      localStorage.setItem("rideState", JSON.stringify({ rideDetails: data }));

      if (data.status === "completed") {
        setIsRideCompleted(true); // Mark ride as started
        alert("Your ride has completed!");
      } else {
        alert("failed to complete.");
      }
    });

    socket.on("rideCanceled", (data) => {
      console.log("Ride canceled:", data);
      dispatch(setRideDetails(data)); // Update Redux state
      localStorage.setItem("rideState", JSON.stringify({ rideDetails: data }));

      if (data.status === "canceled") {
        setIsRideCanceled(true); // Mark ride as started
        alert("Your ride has canceled!");
      } else {
        alert("failed to cancel.");
      }
    });


    return () => {
      clearInterval(timer);
      socket.off("rideAccepted");
      socket.off("rideStatusUpdate");
      socket.off("rideCompleted");
      socket.off("rideCanceled");
    };
  }, [socket, dispatch, navigate]);

  // Timeout fallback
  useEffect(() => {
    if (timeLeft === 0 && rideDetails && rideDetails.status === "searching") {
      alert("No driver accepted your ride. Try again.");
      navigate("/");
    }
  }, [timeLeft, rideDetails, navigate]);

  if (rideDetails) {
    if (rideDetails.status === "ongoing") {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
          <h1 className="text-3xl font-bold mb-2 text-center">
            Ride in Progress
          </h1>
          <p className="text-lg mb-4 text-center">
            Your ride has started. Enjoy your journey!
          </p>
          <DriverDetailsCard
            captain={rideDetails.captainId}
            ride={rideDetails}
          />
        </div>
      );
    }

    if (rideDetails.status === "accepted") {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
          <h1 className="text-3xl font-bold mb-2 text-center">Driver Found!</h1>
          <p className="text-lg mb-4 text-center">
            Your ride has been accepted.
          </p>
          <DriverDetailsCard
            captain={rideDetails.captainId}
            ride={rideDetails}
          />
        </div>
      );
    }

    if (rideDetails.status === "completed") {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
          <h1 className="text-3xl font-bold mb-2 text-center">Ride Complted!</h1>
          <p className="text-lg mb-4 text-center">
            Your ride has been Completed.
          </p>
          <DriverDetailsCard
            captain={rideDetails.captainId}
            ride={rideDetails}
          />
        </div>
      );
    }

    if (rideDetails.status === "canceled") {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
          <h1 className="text-3xl font-bold mb-2 text-center">Ride Canceled!</h1>
          <p className="text-lg mb-4 text-center">
            Your ride has been canceled.
          </p>
          <DriverDetailsCard
            captain={rideDetails.captainId}
            ride={rideDetails}
          />
        </div>
      );
    }
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
          style={{ width: `${(10 - timeLeft) * 10}%` }}
        ></div>
      </div>

      <p className="mt-4 text-sm">
        Time left: <span className="font-bold">{timeLeft} seconds</span>
      </p>
    </div>
  );
};

export default WaitingForDriver;
