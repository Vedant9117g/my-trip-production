import React, { useEffect } from "react";
import { X, MapPin, User, DollarSign, Users, Car, Clock, Compass } from "lucide-react";

const RideRequestPopup = ({ ride, onAccept, onReject }) => {
  if (!ride) return null; // Don't render if no ride is passed

  useEffect(() => {
    document.body.style.overflow = "hidden"; // Disable scrolling when popup is open
    return () => {
      document.body.style.overflow = "auto"; // Re-enable scrolling when popup is closed
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div
        className="relative w-full max-w-lg bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl animate-fade-in scale-in"
        style={{ animation: "fadeIn 0.3s ease, scaleIn 0.3s ease" }}
      >
        {/* Close Button */}
        <button
          onClick={onReject}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          New Ride Request
        </h2>

        {/* Ride Details */}
        <div className="space-y-4">
          {/* From and To */}
          <div className="flex items-center gap-4">
            <MapPin className="w-6 h-6 text-blue-500" />
            <div className="flex-1">
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                <strong>From:</strong> {ride.origin}
              </p>
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                <strong>To:</strong> {ride.destination}
              </p>
            </div>
          </div>

          {/* Passenger Details */}
          <div className="flex items-center gap-4">
            <User className="w-6 h-6 text-green-500" />
            <div className="flex-1">
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                <strong>Passenger:</strong> {ride.userId.name} ({ride.userId.phone})
              </p>
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                <strong>Email:</strong> {ride.userId.email}
              </p>
            </div>
          </div>

          {/* Fare and Distance */}
          <div className="flex items-center gap-4">
            <DollarSign className="w-6 h-6 text-yellow-500" />
            <div className="flex-1">
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                <strong>Fare:</strong> ₹{ride.finalFare}
              </p>
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                <strong>Distance:</strong> {(ride.distance / 1000).toFixed(2)} km
              </p>
            </div>
          </div>

          {/* Seats and Vehicle */}
          <div className="flex items-center gap-4">
            <Users className="w-6 h-6 text-pink-500" />
            <div className="flex-1">
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                <strong>Seats:</strong> {ride.seatsBooked}/{ride.totalSeats}
              </p>
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                <strong>Vehicle:</strong> {ride.vehicleType}
              </p>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-4">
            <Clock className="w-6 h-6 text-indigo-500" />
            <div className="flex-1">
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                <strong>Duration:</strong> {(ride.duration / 3600).toFixed(2)} hours
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={onAccept}
            className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition duration-200 flex items-center justify-center gap-2"
          >
            <DollarSign className="w-5 h-5" />
            Accept Ride
          </button>
          <button
            onClick={onReject}
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition duration-200 flex items-center justify-center gap-2"
          >
            <X className="w-5 h-5" />
            Reject Ride
          </button>
        </div>
      </div>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.95);
          }
          to {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default RideRequestPopup;