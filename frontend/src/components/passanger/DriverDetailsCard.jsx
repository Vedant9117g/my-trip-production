import React, { useState } from "react";
import { Phone, Mail, Car, User, BadgeCheck, KeyRound, MessageCircle } from "lucide-react";
import MessageDialog from "../MessageDialog";

const DriverDetailsCard = ({ captain, ride }) => {
  const [showMessageDialog, setShowMessageDialog] = useState(false);

  const {
    name,
    email,
    phone,
    profilePhoto,
    vehicle = {},
    isVerified,
  } = captain || {};

  const {
    origin,
    destination,
    fare,
    otp,
    status,
  } = ride || {};

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
      {/* Captain Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 flex flex-col items-center text-center space-y-4">
        <img
          src={profilePhoto || "/default-profile.png"}
          alt="Captain"
          className="w-28 h-28 rounded-full object-cover border-4 border-blue-500 shadow"
        />
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <User className="w-5 h-5 text-blue-500" />
          {name || "Captain"}
          {isVerified && (
            <BadgeCheck className="w-5 h-5 text-green-500" title="Verified" />
          )}
        </h2>
        <div className="text-gray-700 dark:text-gray-300 text-sm">
          <p className="flex items-center gap-2">
            <Mail className="w-4 h-4" /> {email}
          </p>
          <p className="flex items-center gap-2">
            <Phone className="w-4 h-4" /> {phone}
          </p>
          <p className="flex items-center gap-2">
            <Car className="w-4 h-4" />
            {vehicle?.model || "Unknown"} ({vehicle?.vehicleType || "Type N/A"})
          </p>
        </div>
        <button
          className="bg-gray-100 dark:bg-gray-700 p-3 rounded-xl flex flex-col items-center hover:scale-105 transition mt-4"
          onClick={() => setShowMessageDialog(true)}
        >
          <MessageCircle className="mb-1" />
          Message Captain
        </button>
      </div>

      {/* Ride Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 text-gray-800 dark:text-gray-200 space-y-3">
        <h3 className="text-xl font-semibold text-blue-600 mb-2">
          Ride Summary
        </h3>
        <p>
          <strong>Origin:</strong> {origin}
        </p>
        <p>
          <strong>Destination:</strong> {destination}
        </p>
        <p>
          <strong>Fare:</strong> ₹{fare?.car}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={`font-medium ${
              status === "accepted" ? "text-green-500" : "text-red-500"
            }`}
          >
            {status}
          </span>
        </p>
        <p className="flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-yellow-500" />
          <strong>OTP:</strong> <span className="text-lg font-bold">{otp}</span>
        </p>
      </div>

      {/* Message Dialog */}
      {showMessageDialog && (
        <MessageDialog
          onClose={() => setShowMessageDialog(false)}
        />
      )}
    </div>
  );
};

export default DriverDetailsCard;