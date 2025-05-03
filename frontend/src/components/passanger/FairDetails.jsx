import React, { useEffect } from "react";
import { X, Bike, Car, Bus } from "lucide-react";

const FareDetails = ({
  fareDetails,
  vehicleType,
  onVehicleSelect,
  onConfirm,
  loading,
  onClose,
}) => {
  const vehicles = [
    {
      type: "car",
      label: "Car",
      icon: <Car className="w-5 h-5 mr-2" />,
      img: "https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg",
      info: "Comfortable ride for up to 4 passengers",
    },
    {
      type: "bike",
      label: "Bike",
      icon: <Bike className="w-5 h-5 mr-2" />,
      img: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",
      info: "Fast and affordable for solo travel",
    },
    {
      type: "auto",
      label: "Auto",
      icon: <Bus className="w-5 h-5 mr-2" />,
      img: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png",
      info: "Convenient 3-seater for short trips",
    },
  ];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
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
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Choose Your Ride
        </h2>

        <div className="grid gap-4">
          {vehicles.map(({ type, label, icon, img, info }) => (
            <button
              key={type}
              onClick={() => onVehicleSelect(type)}
              disabled={loading}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 shadow-sm w-full
                ${
                  vehicleType === type
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700"
                } hover:shadow-lg`}
            >
              <img
                src={img}
                alt={label}
                className="w-16 h-16 object-cover rounded-md shadow-sm"
              />
              <div className="flex flex-col items-start">
                <span className="text-lg font-semibold flex items-center">
                  {icon}
                  {label}
                </span>
                <span className="text-sm">{info}</span>
                <span className="text-sm font-medium mt-1">
                  Estimated Fare: ₹{fareDetails[type]}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Confirm Button */}
        <div className="mt-6">
          <button
            onClick={onConfirm}
            disabled={!vehicleType || loading}
            className={`w-full py-3 rounded-xl text-white font-semibold transition duration-200 ${
              vehicleType
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Confirm Ride
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

export default FareDetails;









