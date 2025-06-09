import React from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  MapPin,
  Route,
  BadgeCheck,
  Users,
  User,
} from "lucide-react";
import { format } from "date-fns";

const RideDetailsDialog = ({ ride, onClose, loggedInUser }) => {
  const navigate = useNavigate();
  if (!ride) return null;

  // Determine user role
  const isCarpool = ride.scheduledType === "carpool";

  const isPassenger = isCarpool
    ? ride.bookedUsers?.some((entry) => entry.userId._id === loggedInUser._id)
    : ride.userId?._id === loggedInUser._id;

  const userRole = isPassenger ? "passenger" : "captain";

  const formattedDeparture = format(new Date(ride.departureTime), "PPpp");
  const formattedBookingTime = format(new Date(ride.createdAt), "PPpp");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="bg-blue-600 text-white px-6 py-4">
          <h2 className="text-lg font-semibold">Ride Details</h2>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 text-sm text-gray-800 dark:text-gray-200">
          {/* Ride Info */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span className="font-medium text-gray-600 dark:text-gray-400">
              From:
            </span>
            <span className="ml-auto">{ride.origin}</span>
          </div>

          <div className="flex items-center gap-2">
            <Route className="w-4 h-4 text-blue-500" />
            <span className="font-medium text-gray-600 dark:text-gray-400">
              To:
            </span>
            <span className="ml-auto">{ride.destination}</span>
          </div>

          <div className="flex items-center gap-2">
            <BadgeCheck className="w-4 h-4 text-blue-500" />
            <span className="font-medium text-gray-600 dark:text-gray-400">
              Status:
            </span>
            <span className="ml-auto capitalize">{ride.status}</span>
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-blue-500" />
            <span className="font-medium text-gray-600 dark:text-gray-400">
              Departure:
            </span>
            <span className="ml-auto">{formattedDeparture}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="font-medium text-gray-600 dark:text-gray-400">
              Booked On:
            </span>
            <span className="ml-auto">{formattedBookingTime}</span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="font-medium text-gray-600 dark:text-gray-400">
              Seats Booked:
            </span>
            <span className="ml-auto">
              {ride.seatsBooked}/{ride.totalSeats}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-600 dark:text-gray-400">
              Fare:
            </span>
            <span className="ml-auto text-green-600 dark:text-green-400 font-semibold">
              ₹{ride.finalFare}
            </span>
          </div>

          {/* Show Captain Details for Passengers */}
          {userRole === "passenger" && ride.captainId && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Captain Details
              </h3>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-500" />
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  Name:
                </span>
                <span className="ml-auto">{ride.captainId.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  Email:
                </span>
                <span className="ml-auto">{ride.captainId.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  Phone:
                </span>
                <span className="ml-auto">{ride.captainId.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  Vehicle:
                </span>
                <span className="ml-auto">
                  {ride.captainId.vehicle.model} (
                  {ride.captainId.vehicle.numberPlate})
                </span>
              </div>
            </div>
          )}

          {/* Show Booked Users if Captain */}
          {userRole === "captain" &&
            isCarpool &&
            ride.bookedUsers?.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Booked Passengers
                </h3>
                <div className="space-y-2">
                  {ride.bookedUsers.map((user, index) => (
                    <div
                      key={user.userId?._id || index}
                      className="flex flex-col gap-1 border-b pb-2 border-gray-300 dark:border-gray-600"
                    >
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-500" />
                        <span className="font-medium text-gray-600 dark:text-gray-400">
                          Name:
                        </span>
                        <span className="ml-auto">
                          {user.userId?.name || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-600 dark:text-gray-400">
                          Email:
                        </span>
                        <span className="ml-auto">
                          {user.userId?.email || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-600 dark:text-gray-400">
                          Phone:
                        </span>
                        <span className="ml-auto">
                          {user.userId?.phone || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-600 dark:text-gray-400">
                          Seats:
                        </span>
                        <span className="ml-auto font-semibold">
                          {user.seats}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Show Passenger Details if Non-Carpool and Captain */}
          {userRole === "captain" && !isCarpool && ride.userId && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Passenger Details
              </h3>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-500" />
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  Name:
                </span>
                <span className="ml-auto">{ride.userId.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  Email:
                </span>
                <span className="ml-auto">{ride.userId.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  Phone:
                </span>
                <span className="ml-auto">{ride.userId.phone}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 text-right space-x-4">
          <button
            onClick={onClose}
            className="inline-block px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose(); // Close the dialog
              navigate(`/ride/${ride._id}`); // Navigate to the ride details page
            }}
            className="inline-block px-4 py-2 rounded-lg text-sm font-medium bg-gray-600 text-white hover:bg-gray-700 transition"
          >
            View More
          </button>
        </div>
      </div>
    </div>
  );
};

export default RideDetailsDialog;
