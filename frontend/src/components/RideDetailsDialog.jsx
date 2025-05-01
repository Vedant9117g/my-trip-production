import React from "react";
import { CalendarDays, Clock, MapPin, Route, BadgeCheck, Users, User } from "lucide-react";
import { format } from "date-fns";

const RideDetailsDialog = ({ ride, onClose, loggedInUser }) => {
  if (!ride) return null;

  // Determine the role dynamically
  const userRole = loggedInUser._id === ride.userId._id ? "passenger" : "captain";

  const formattedDeparture = format(new Date(ride.departureTime), "PPpp");
  const formattedBookingTime = format(new Date(ride.createdAt), "PPpp");

  console.log("Ride Details:", ride);
  console.log("User Role:", userRole);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="bg-blue-600 text-white px-6 py-4">
          <h2 className="text-lg font-semibold">Ride Details</h2>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 text-sm text-gray-800 dark:text-gray-200">
          {/* Ride Information */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span className="font-medium text-gray-600 dark:text-gray-400">From:</span>
            <span className="ml-auto">{ride.origin}</span>
          </div>

          <div className="flex items-center gap-2">
            <Route className="w-4 h-4 text-blue-500" />
            <span className="font-medium text-gray-600 dark:text-gray-400">To:</span>
            <span className="ml-auto">{ride.destination}</span>
          </div>

          <div className="flex items-center gap-2">
            <BadgeCheck className="w-4 h-4 text-blue-500" />
            <span className="font-medium text-gray-600 dark:text-gray-400">Status:</span>
            <span className="ml-auto capitalize">{ride.status}</span>
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-blue-500" />
            <span className="font-medium text-gray-600 dark:text-gray-400">Departure:</span>
            <span className="ml-auto">{formattedDeparture}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="font-medium text-gray-600 dark:text-gray-400">Booked On:</span>
            <span className="ml-auto">{formattedBookingTime}</span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="font-medium text-gray-600 dark:text-gray-400">Seats Booked:</span>
            <span className="ml-auto">{ride.seatsBooked}/{ride.totalSeats}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-600 dark:text-gray-400">Fare:</span>
            <span className="ml-auto text-green-600 dark:text-green-400 font-semibold">₹{ride.finalFare}</span>
          </div>

          {/* Conditional Section for Captain or Passenger Details */}
          {userRole === "passenger" && ride.captainId && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Captain Details</h3>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-500" />
                <span className="font-medium text-gray-600 dark:text-gray-400">Name:</span>
                <span className="ml-auto">{ride.captainId.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600 dark:text-gray-400">Email:</span>
                <span className="ml-auto">{ride.captainId.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600 dark:text-gray-400">Phone:</span>
                <span className="ml-auto">{ride.captainId.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600 dark:text-gray-400">Vehicle:</span>
                <span className="ml-auto">{ride.captainId.vehicle.model} ({ride.captainId.vehicle.numberPlate})</span>
              </div>
            </div>
          )}

          {userRole === "captain" && ride.userId && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Passenger Details</h3>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-500" />
                <span className="font-medium text-gray-600 dark:text-gray-400">Name:</span>
                <span className="ml-auto">{ride.userId.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600 dark:text-gray-400">Email:</span>
                <span className="ml-auto">{ride.userId.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600 dark:text-gray-400">Phone:</span>
                <span className="ml-auto">{ride.userId.phone}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 text-right">
          <button
            onClick={onClose}
            className="inline-block px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RideDetailsDialog;