import React from "react";
import {
  MapPin,
  User,
  DollarSign,
  Star,
  Phone,
  Share2,
  ShieldCheck,
  MessageCircle,
  KeyRound,
  CheckCircle,
} from "lucide-react";

const StartRidePanel = ({
  rideDetails,
  passenger,
  otp,
  setOtp,
  handleStartRide,
  isStartingRide,
  setShowCancelDialog,
  handleCompleteRide, // Add handler for completing the ride
}) => {
  return (
    <div className="p-6 pt-4 overflow-y-auto h-full space-y-6 text-gray-800 dark:text-gray-100">
      <h2 className="text-xl font-semibold text-center">Ride Overview</h2>

      <div className="flex flex-col gap-4">
        {/* Origin and Destination */}
        <div className="flex items-center gap-3">
          <MapPin className="text-blue-500" />
          <div>
            <p>
              <strong>From:</strong> {rideDetails.origin}
            </p>
            <p>
              <strong>To:</strong> {rideDetails.destination}
            </p>
          </div>
        </div>

        {/* Passenger Details */}
        <div className="flex items-center gap-3">
          <User className="text-green-500" />
          <div>
            <p>
              <strong>Name:</strong> {passenger.name || "Not available"}
            </p>
            <p>
              <strong>Phone:</strong> {passenger.phone || "Not available"}
            </p>
            <p>
              <strong>Email:</strong> {passenger.email || "Not available"}
            </p>
          </div>
        </div>

        {/* Fare and Distance */}
        <div className="flex items-center gap-3">
          <DollarSign className="text-yellow-500" />
          <div>
            <p>
              <strong>Fare:</strong> ₹{rideDetails.finalFare}
            </p>
            <p>
              <strong>Distance:</strong>{" "}
              {(rideDetails.distance / 1000).toFixed(2)} km
            </p>
          </div>
        </div>

        {/* Passenger Rating */}
        <div className="flex items-center gap-3">
          <Star className="text-purple-500" />
          <p>
            <strong>Passenger Rating:</strong> ⭐ 4.8 (placeholder)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-center">
          <button className="bg-blue-100 dark:bg-blue-800 p-3 rounded-xl flex flex-col items-center hover:scale-105 transition">
            <Phone className="mb-1" />
            Call
          </button>
          <button className="bg-yellow-100 dark:bg-yellow-800 p-3 rounded-xl flex flex-col items-center hover:scale-105 transition">
            <Share2 className="mb-1" />
            Share Trip
          </button>
          <button className="bg-green-100 dark:bg-green-800 p-3 rounded-xl flex flex-col items-center hover:scale-105 transition">
            <ShieldCheck className="mb-1" />
            Safety
          </button>
          <button className="bg-gray-100 dark:bg-gray-700 p-3 rounded-xl flex flex-col items-center hover:scale-105 transition">
            <MessageCircle className="mb-1" />
            Message
          </button>
        </div>

        {/* OTP Input */}
        {!rideDetails.status || rideDetails.status !== "ongoing" ? (
          <div>
            <label className="block text-sm font-medium mb-1">
              Enter OTP to Start Ride:
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
              placeholder="Enter OTP"
            />
          </div>
        ) : null}

        {/* Start, Cancel, and Complete Buttons */}
        <div className="flex justify-center gap-4 mt-4">
          {!rideDetails.status || rideDetails.status !== "ongoing" ? (
            <>
              <button
                onClick={handleStartRide}
                disabled={isStartingRide}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-xl flex items-center gap-2 transition"
              >
                <KeyRound className="w-5 h-5" />
                Start Ride
              </button>

              <button
                onClick={() => setShowCancelDialog(true)}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-xl flex items-center gap-2 transition"
              >
                Cancel Ride
              </button>
            </>
          ) : (
            <button
              onClick={handleCompleteRide}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-xl flex items-center gap-2 transition"
            >
              <CheckCircle className="w-5 h-5" />
              Complete Ride
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartRidePanel;