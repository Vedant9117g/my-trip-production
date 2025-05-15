import React, { useState } from "react";
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
import MessageDialog from "../MessageDialog";

const StartRidePanel = ({
  rideDetails,
  passenger,
  otp,
  setOtp,
  handleStartRide,
  isStartingRide,
  setShowCancelDialog,
  handleCompleteRide,
}) => {
  const [showMessageDialog, setShowMessageDialog] = useState(false);

  return (
    <div className="p-6 pt-4 overflow-y-auto h-full bg-white dark:bg-gray-900 rounded-2xl shadow-inner text-gray-800 dark:text-gray-100 space-y-6">
      <h2 className="text-2xl font-bold text-center mb-2 text-blue-600 dark:text-blue-400">
        Ride Overview
      </h2>

      {/* Ride Information Card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 space-y-5 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
          <MapPin className="w-5 h-5 text-red-500" />
          Ride Information
        </h3>
        <div className="text-sm space-y-3 text-gray-800 dark:text-gray-300">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 font-medium">
              <MapPin className="w-4 h-4 text-red-500" />
              Route:
            </div>
            <div className="text-base font-bold text-gray-900 dark:text-white">
              {rideDetails.origin} <span className="text-blue-500">→</span>{" "}
              {rideDetails.destination}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 font-medium">
              🗓️ Date:
            </div>
            <div>{new Date(rideDetails.departureTime).toLocaleDateString()}</div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 font-medium">⏰ Time:</div>
            <div>{new Date(rideDetails.departureTime).toLocaleTimeString()}</div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 font-medium">💰 Fare:</div>
            <div className="font-semibold text-green-700 dark:text-green-400">
              ₹{rideDetails.finalFare}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 font-medium">🎟️ Seats:</div>
            <div>
              {rideDetails.seatsBooked} / {rideDetails.totalSeats}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 font-medium">📌 Status:</div>
            <div className="capitalize font-semibold">{rideDetails.status}</div>
          </div>

          {rideDetails.status === "scheduled" && rideDetails.otp && (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 font-medium">🔐 OTP:</div>
              <div className="font-bold">{rideDetails.otp}</div>
            </div>
          )}
        </div>
      </div>

      {/* Passenger Information Card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 space-y-4 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
          <User className="w-5 h-5 text-green-500" />
          Passenger Information
        </h3>
        <div className="text-sm space-y-2 text-gray-800 dark:text-gray-300">
          <p>
            <strong>Name:</strong> {passenger.name || "Not available"}
          </p>
          <p>
            <strong>Phone:</strong> {passenger.phone || "Not available"}
          </p>
          <p>
            <strong>Email:</strong> {passenger.email || "Not available"}
          </p>
          <p>
            <strong>Rating:</strong> ⭐ 4.8 (placeholder)
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <button className="bg-blue-100 dark:bg-blue-800 text-blue-900 dark:text-blue-100 p-4 rounded-2xl flex flex-col items-center hover:scale-105 transition">
            <Phone className="mb-1 w-5 h-5" />
            Call
          </button>
          <button className="bg-yellow-100 dark:bg-yellow-700 text-yellow-900 dark:text-yellow-100 p-4 rounded-2xl flex flex-col items-center hover:scale-105 transition">
            <Share2 className="mb-1 w-5 h-5" />
            Share
          </button>
          <button className="bg-green-100 dark:bg-green-700 text-green-900 dark:text-green-100 p-4 rounded-2xl flex flex-col items-center hover:scale-105 transition">
            <ShieldCheck className="mb-1 w-5 h-5" />
            Safety
          </button>
          <button
            onClick={() => setShowMessageDialog(true)}
            className="bg-gray-100 dark:bg-gray-700 p-4 rounded-2xl flex flex-col items-center hover:scale-105 transition"
          >
            <MessageCircle className="mb-1 w-5 h-5" />
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
              className="w-full px-4 py-2 border border-gray-300 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-400"
              placeholder="Enter OTP"
            />
          </div>
        ) : null}

        {/* Ride Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4 mb-8">
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

      {/* Message Dialog */}
      {showMessageDialog && (
        <MessageDialog
          passenger={passenger}
          rideDetails={rideDetails}
          onClose={() => setShowMessageDialog(false)}
        />
      )}
    </div>
  );
};

export default StartRidePanel;
