import React, { useState } from "react";
import axios from "axios";

const cancelReasons = {
  passenger: [
    { value: "change_of_plans", label: "Change of plans" },
    { value: "booked_by_mistake", label: "Booked by mistake" },
    { value: "waited_too_long", label: "Waited too long" },
    { value: "captain_not_moving", label: "Captain not moving" },
    { value: "got_another_ride", label: "Got another ride" },
    { value: "fare_too_high", label: "Fare too high" },
    { value: "captain_asked_to_cancel", label: "Captain asked to cancel" },
    { value: "pickup_location_incorrect", label: "Pickup location incorrect" },
    { value: "vehicle_not_as_expected", label: "Vehicle not as expected" },
    { value: "travel_delayed_or_canceled", label: "Travel delayed or canceled" },
  ],
  captain: [
    { value: "vehicle_breakdown", label: "Vehicle breakdown" },
    { value: "emergency_at_home", label: "Emergency at home" },
    { value: "traffic_restrictions", label: "Traffic restrictions" },
    { value: "ride_conflict", label: "Ride conflict" },
    { value: "low_passenger_count", label: "Low passenger count" },
    { value: "passenger_unreachable", label: "Passenger unreachable" },
    { value: "change_in_schedule", label: "Change in schedule" },
    { value: "incorrect_pickup_location", label: "Incorrect pickup location" },
    { value: "weather_conditions", label: "Weather conditions" },
  ],
};

const CancelRideDialog = ({ rideId, userRole, onClose, onSuccess }) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (!selectedReason) {
      alert("Please select a reason");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/rides/cancel",
        { rideId, reason: selectedReason },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          withCredentials: true,
        }
      );
      alert(response.data.message || "Ride canceled successfully");
      onSuccess();
    } catch (err) {
      console.error("Cancel ride error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to cancel ride");
    } finally {
      setLoading(false);
    }
  };

  const reasons = cancelReasons[userRole] || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Cancel Ride</h2>

        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select a reason:
        </label>
        <select
          className="w-full p-2 border rounded mb-4"
          value={selectedReason}
          onChange={(e) => setSelectedReason(e.target.value)}
        >
          <option value="">-- Select Reason --</option>
          {reasons.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
          >
            Close
          </button>
          <button
            onClick={handleCancel}
            disabled={loading || !selectedReason}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? "Canceling..." : "Confirm Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelRideDialog;
