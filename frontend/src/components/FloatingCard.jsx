import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { MdOutlineDirectionsCar } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import { BsClockHistory } from "react-icons/bs";

const FloatingCard = () => {
  const rideDetails = useSelector((state) => state.ride.rideDetails);
  const userRole = useSelector((state) => state.auth.user?.role); // Get user role from Redux
  const navigate = useNavigate();
  const location = useLocation();
  const constraintRef = useRef(null);

  // Hide if rideDetails invalid or user is already on the target page
  if (
    !rideDetails ||
    !["searching", "accepted", "ongoing"].includes(rideDetails.status) ||
    (userRole === "passenger" && location.pathname === "/waiting-for-driver") ||
    (userRole === "captain" && location.pathname === "/instant-ride-detail")
  ) {
    return null;
  }

  const statusMap = {
    searching: { label: "Searching for a Driver", color: "bg-yellow-100 text-yellow-800" },
    accepted: { label: "Driver Found!", color: "bg-green-100 text-green-800" },
    ongoing: { label: "Ride in Progress", color: "bg-blue-100 text-blue-800" },
  };

  const statusStyle = statusMap[rideDetails.status];

  return (
    <>
      {/* Constraint area */}
      <div ref={constraintRef} className="fixed inset-0 z-[49] pointer-events-none" />

      {/* Draggable Floating Card */}
      <motion.div
        drag
        dragConstraints={constraintRef}
        dragElastic={0.2}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 12 }}
        whileDrag={{ scale: 1.03 }}
        className="fixed bottom-6 right-6 w-80 z-50 pointer-events-auto cursor-grab active:cursor-grabbing"
      >
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-5 space-y-3 transition-all">
          {/* Ride status */}
          <div className={`inline-block px-3 py-1 text-sm rounded-full font-medium ${statusStyle.color}`}>
            {statusStyle.label}
          </div>

          {/* Route Info */}
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm font-medium">
            <FaMapMarkerAlt className="text-blue-600" />
            <span>{rideDetails.origin}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm font-medium">
            <FaMapMarkerAlt className="text-red-600" />
            <span>{rideDetails.destination}</span>
          </div>

          {/* Vehicle Info */}
          {rideDetails.vehicleType && (
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
              <MdOutlineDirectionsCar className="text-lg" />
              <span className="capitalize">{rideDetails.vehicleType}</span>
            </div>
          )}

          {/* Time Info */}
          {rideDetails.departureTime && (
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
              <BsClockHistory className="text-lg" />
              <span>
                {new Date(rideDetails.departureTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          )}

          {/* CTA Button */}
          <button
            className="w-full mt-3 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            onClick={(e) => {
              e.stopPropagation();
              if (userRole === "passenger") {
                navigate("/waiting-for-driver"); // Navigate to passenger page
              } else if (userRole === "captain") {
                navigate("/instant-ride-detail"); // Navigate to captain page
              }
            }}
          >
            View Details
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default FloatingCard;