import React from "react";
import { X } from "lucide-react";

const MyRidesSortDialog = ({ sortParameter, onApply, onClose }) => {
  const [selectedField, setSelectedField] = React.useState(sortParameter.field || "");
  const [selectedOrder, setSelectedOrder] = React.useState(sortParameter.order || "");

  const handleApply = () => {
    onApply({ field: selectedField, order: selectedOrder });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Sort Rides
        </h2>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Sort By
            </label>
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-300 rounded-md shadow-sm"
            >
              <option value="">Select Field</option>
              <option value="fare">Fare</option>
              <option value="departureTime">Departure Time</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Order
            </label>
            <select
              value={selectedOrder}
              onChange={(e) => setSelectedOrder(e.target.value)}
              className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-300 rounded-md shadow-sm"
            >
              <option value="">Select Order</option>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        {/* Confirm Button */}
        <div className="mt-6">
          <button
            onClick={handleApply}
            className="w-full py-3 rounded-xl text-white font-semibold transition duration-200 bg-blue-600 hover:bg-blue-700"
          >
            Apply Sort
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyRidesSortDialog;