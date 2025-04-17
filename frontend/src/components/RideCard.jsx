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

  return (
    <div className="p-4 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
      <p className="text-gray-900 dark:text-white font-medium">
        {ride.origin} → {ride.destination}
      </p>
      {ride.otp && (
        <p className="text-gray-700 dark:text-gray-300">
          <strong>OTP:</strong> {ride.otp}
        </p>
      )}
      <p className="text-gray-700 dark:text-gray-300">
        <strong>Departure:</strong>{" "}
        {dayjs(ride.departureTime).format("DD MMM YYYY, hh:mm A")}
      </p>
      <p className="text-gray-700 dark:text-gray-300">
        <strong>Fare:</strong> ₹{ride.finalFare}
      </p>
      <p className="text-gray-700 dark:text-gray-300">
        <strong>Seats:</strong>{" "}
        {userRole === "captain"
          ? `${ride.seatsBooked}/${ride.totalSeats}`
          : ride.seatsBooked}
      </p>

      {/* Passenger info for captains */}
      {userRole === "captain" &&
        ride.scheduledType === "cab" &&
        ride.userId && (
          <div className="mt-4">
            <strong className="text-gray-900 dark:text-white">
              Passenger:
            </strong>
            <p className="text-gray-700 dark:text-gray-300">
              {ride.userId.name} ({ride.userId.phone})
            </p>
          </div>
        )}

      {userRole === "captain" &&
        ride.scheduledType === "carpool" &&
        ride.bookedUsers?.length > 0 && (
          <div className="mt-4">
            <strong className="text-gray-900 dark:text-white">
              Passengers:
            </strong>
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

      {/* Captain info for passengers */}
      {userRole === "passenger" && ride.captainId && (
        <div className="mt-4">
          <strong className="text-gray-900 dark:text-white">Captain:</strong>
          <p className="text-gray-700 dark:text-gray-300">
            {ride.captainId.name} ({ride.captainId.phone})
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <strong>Vehicle:</strong> {ride.captainId.vehicle.vehicleType} -{" "}
            {ride.captainId.vehicle.model} ({ride.captainId.vehicle.numberPlate}
            )
          </p>
        </div>
      )}

      {/* Start ride (for captains only) */}
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

      {/* Cancel ride (for both roles) */}
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
    </div>
  );
};

export default RideCard;
