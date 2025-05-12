import React, { useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { SocketContext } from "@/context/SocketContext";
import { setRideDetails , clearRide } from "@/features/api/rideSlice";
import { useLoadUserQuery } from "@/features/api/authApi";
import CancelRideDialog from "@/components/CancelRideDialog";
import StartRidePanel from "@/components/captain/StartRidePanel"; // Import StartRidePanel

const InstantRideDetail = () => {
  const navigate = useNavigate();
  const rideDetails = useSelector((state) => state.ride.rideDetails);
  const { socket } = useContext(SocketContext);
  const dispatch = useDispatch();
  const { data: userData } = useLoadUserQuery();

  const [otp, setOtp] = useState("");
  const [isStartingRide, setIsStartingRide] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  if (!rideDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <p className="text-lg font-medium">No ride details available.</p>
      </div>
    );
  }

  const handleStartRide = async () => {
    try {
      setIsStartingRide(true);
      const response = await axios.post(
        "http://localhost:5000/api/rides/start",
        { rideId: rideDetails._id, otp },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          withCredentials: true,
        }
      );

      toast.success("Ride started successfully!");
      dispatch(setRideDetails(response.data.ride));

      socket.emit("rideStatusUpdate", {
        rideId: rideDetails._id,
        status: "ongoing",
        captain: {
          name: userData.user.name,
          vehicleType: rideDetails.vehicleType,
          phone: userData.user.phone,
        },
      });
    } catch (error) {
      console.error("Error starting ride:", error);
      toast.error(error.response?.data?.message || "Failed to start the ride.");
    } finally {
      setIsStartingRide(false);
    }
  };

  const handleCompleteRide = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/rides/complete",
        { rideId: rideDetails._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          withCredentials: true,
        }
      );

      toast.success("Ride completed successfully!");
      dispatch(clearRide()); // Clear Redux state
      localStorage.removeItem("rideState"); // Clear localStorage

      socket.emit("rideCompleted", {
        rideId: rideDetails._id,
        status: "completed",
      });

      navigate("/"); // Redirect to the home page

    } catch (error) {
      console.error("Error completing ride:", error);
      toast.error(
        error.response?.data?.message || "Failed to complete the ride."
      );
    }
  };

  const handleCancelSuccess = () => {
    setShowCancelDialog(false);
    toast.success("Ride canceled successfully!");
  };

  const passenger = rideDetails.userId || {};

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Map Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt="Map Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Bottom Sheet */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-10 rounded-t-3xl shadow-2xl transition-all duration-500 ease-in-out overflow-hidden ${
          isExpanded ? "h-[90%]" : "h-[20%]"
        } bg-white dark:bg-gray-800`}
      >
        {/* Toggle Arrow */}
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full"
          >
            {isExpanded ? <ChevronDown /> : <ChevronUp />}
          </button>
        </div>

        {/* Condensed View */}
        {!isExpanded && (
          <div className="h-full px-4 flex flex-col justify-center items-center overflow-hidden">
            <div className="flex items-center gap-3 text-gray-800 dark:text-white text-lg font-semibold">
              <MapPin className="text-blue-500" />
              <p className="truncate max-w-[80vw] font-medium">
                {rideDetails.origin} <span className="text-gray-500">→</span>{" "}
                {rideDetails.destination}
              </p>
            </div>
          </div>
        )}

        {/* Expanded View */}
        {isExpanded && (
          <StartRidePanel
            rideDetails={rideDetails}
            passenger={passenger}
            otp={otp}
            setOtp={setOtp}
            handleStartRide={handleStartRide}
            isStartingRide={isStartingRide}
            setShowCancelDialog={setShowCancelDialog}
            handleCompleteRide={handleCompleteRide} // Pass the complete ride handler
          />
        )}
      </div>

      {/* CancelRideDialog */}
      {showCancelDialog && (
        <CancelRideDialog
        rideId={rideDetails._id}
        userRole="captain"
        onClose={() => setShowCancelDialog(false)}
        onSuccess={handleCancelSuccess}
        dispatch={dispatch} // Pass dispatch
        setRideDetails={setRideDetails} // Pass setRideDetails action
      />
      )}
    </div>
  );
};

export default InstantRideDetail;
