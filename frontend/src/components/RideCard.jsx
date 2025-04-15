import React from "react";
import dayjs from "dayjs";

const RideCard = ({ ride, userRole }) => {
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
        <strong>Departure:</strong> {dayjs(ride.departureTime).format("DD MMM YYYY, hh:mm A")}
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
      {ride.captainId && (
        <p className="text-gray-700 dark:text-gray-300">
          <strong>Captain:</strong> {ride.captainId.name} ({ride.captainId.phone})
        </p>
      )}
    </div>
  );
};

export default RideCard;