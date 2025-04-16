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

      {/* Display passenger details for cab rides */}
      {userRole === "captain" && ride.scheduledType === "cab" && ride.userId && (
        <div className="mt-4">
          <strong className="text-gray-900 dark:text-white">Passenger:</strong>
          <p className="text-gray-700 dark:text-gray-300">
            {ride.userId.name} ({ride.userId.phone})
          </p>
        </div>
      )}

      {/* Display passenger details for carpool rides */}
      {userRole === "captain" &&
        ride.scheduledType === "carpool" &&
        ride.bookedUsers &&
        ride.bookedUsers.length > 0 && (
          <div className="mt-4">
            <strong className="text-gray-900 dark:text-white">Passengers:</strong>
            <ul className="text-gray-700 dark:text-gray-300">
              {ride.bookedUsers.map((user) => (
                <li key={user.userId?._id}>
                  {user.userId?.name || "Unknown"} ({user.userId?.phone || "N/A"}) -{" "}
                  {user.seats} seat(s)
                </li>
              ))}
            </ul>
          </div>
        )}

      {/* Display captain details for passengers */}
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
    </div>
  );
};

export default RideCard;