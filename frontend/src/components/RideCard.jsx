import React, { useState } from "react";
import dayjs from "dayjs";
import axios from "axios";
import CancelRideDialog from "./CancelRideDialog";

const RideCard = ({ ride, userRole, onRideUpdate }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const handleStartRide = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/rides/start",
        { rideId: ride._id, otp },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          withCredentials: true,
        }
      );
      alert(response.data.message);
      onRideUpdate();
    } catch (error) {
      console.error("Start ride error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to start the ride");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRide = async (reason) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/rides/cancel",
        {
          rideId: ride._id,
          reason,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          withCredentials: true,
        }
      );
      alert(response.data.message);
      onRideUpdate();
    } catch (error) {
      console.error(
        "Cancel ride error:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.message || "Failed to cancel the ride");
    } finally {
      setLoading(false);
      setShowCancelDialog(false);
    }
  };

  const handleCompleteRide = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/rides/complete",
        { rideId: ride._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          withCredentials: true,
        }
      );
      alert(response.data.message);
      onRideUpdate(); // Refresh the ride list
    } catch (error) {
      console.error("Complete ride error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to complete the ride");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cursor-pointer rounded-2xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300 p-5 border border-gray-200 dark:border-gray-700">
      {/* Ride Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {ride.origin} <span className="text-blue-500">→</span> {ride.destination}
        </h2>
        <div
          className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide ${
            ride.status === "completed"
              ? "bg-green-100 text-green-700 dark:bg-green-700 dark:text-white"
              : ride.status === "canceled"
              ? "bg-red-100 text-red-700 dark:bg-red-700 dark:text-white"
              : ride.status === "ongoing"
              ? "bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-white"
              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-white"
          }`}
        >
          {ride.status}
        </div>
      </div>

      {/* Ride Details */}
      <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
        <div className="flex justify-between">
          <span className="font-medium">Departure:</span>
          <span>{dayjs(ride.departureTime).format("DD MMM YYYY, hh:mm A")}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Fare:</span>
          <span className="text-green-600 dark:text-green-400 font-semibold">
            ₹{ride.finalFare}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Seats:</span>
          <span>
            {userRole === "captain"
              ? `${ride.seatsBooked}/${ride.totalSeats}`
              : ride.seatsBooked}
          </span>
        </div>
      </div>

      {/* Passenger Info for Captains */}
      {userRole === "captain" && ride.scheduledType === "cab" && ride.userId && (
        <div className="mt-4">
          <strong className="text-gray-900 dark:text-white">Passenger:</strong>
          <p className="text-gray-700 dark:text-gray-300">
            {ride.userId.name} ({ride.userId.phone})
          </p>
        </div>
      )}

      {userRole === "captain" &&
        ride.scheduledType === "carpool" &&
        ride.bookedUsers?.length > 0 && (
          <div className="mt-4">
            <strong className="text-gray-900 dark:text-white">Passengers:</strong>
            <ul className="text-gray-700 dark:text-gray-300">
              {ride.bookedUsers.map((user) => (
                <li key={user.userId?._id}>
                  {user.userId?.name || "Unknown"} (
                  {user.userId?.phone || "N/A"}) - {user.seats} seat(s)
                </li>
              ))}
            </ul>
          </div>
        )}

      {/* Captain Info for Passengers */}
      {userRole === "passenger" && ride.captainId && (
        <div className="mt-4">
          <strong className="text-gray-900 dark:text-white">Captain:</strong>
          <p className="text-gray-700 dark:text-gray-300">
            {ride.captainId.name} ({ride.captainId.phone})
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <strong>Vehicle:</strong> {ride.captainId.vehicle.vehicleType} -{" "}
            {ride.captainId.vehicle.model} ({ride.captainId.vehicle.numberPlate})
          </p>
        </div>
      )}

      {/* Start Ride (Captains Only) */}
      {userRole === "captain" && ride.status === "scheduled" && (
        <div className="mt-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="p-2 border rounded w-full mb-2"
          />
          <button
            onClick={handleStartRide}
            disabled={loading || !otp}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Starting Ride..." : "Start Ride"}
          </button>
        </div>
      )}

      {/* Cancel Ride */}
      {ride.status === "scheduled" && (
        <div className="mt-4">
          <button
            onClick={() => setShowCancelDialog(true)}
            disabled={loading}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          >
            Cancel Ride
          </button>
        </div>
      )}

      {/* Cancel Dialog */}
      {showCancelDialog && (
        <CancelRideDialog
          rideId={ride._id}
          userRole={userRole}
          onClose={() => setShowCancelDialog(false)}
          onSuccess={() => {
            setShowCancelDialog(false);
            onRideUpdate();
          }}
        />
      )}

      {/* Complete Ride (Captains Only) */}
      {ride.status === "ongoing" && userRole === "captain" && (
        <div className="mt-4">
          <button
            onClick={handleCompleteRide}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? "Completing Ride..." : "Complete Ride"}
          </button>
        </div>
      )}
    </div>
  );
};

export default RideCard;