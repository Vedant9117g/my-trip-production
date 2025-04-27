import React from "react";

const RideRequestPopup = ({ ride, onAccept, onReject }) => {
  if (!ride) return null; // Don't render if no ride is passed

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-800 shadow-lg p-4 z-50">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            New Ride Request
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            <strong>From:</strong> {ride.origin}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <strong>To:</strong> {ride.destination}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <strong>Passenger:</strong> {ride.userId.name} ({ride.userId.phone})
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <strong>Fare:</strong> ₹{ride.finalFare}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <strong>Seats:</strong> {ride.seatsBooked}/{ride.totalSeats}
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={onAccept}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Accept
          </button>
          <button
            onClick={onReject}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default RideRequestPopup;