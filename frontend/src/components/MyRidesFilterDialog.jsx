import React from "react";
import { X } from "lucide-react";

const MyRidesFilterDialog = ({ filters, setFilters, onApply, onClose }) => {
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    onApply(filters);
  };

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
          Filter Rides
        </h2>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-300 rounded-md shadow-sm"
            >
              <option value="">All</option>
              <option value="searching">Searching</option>
              <option value="accepted">Accepted</option>
              <option value="scheduled">Scheduled</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="canceled">Canceled</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Ride Type
            </label>
            <select
              name="rideType"
              value={filters.rideType}
              onChange={handleFilterChange}
              className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-300 rounded-md shadow-sm"
            >
              <option value="">All</option>
              <option value="instant">Instant</option>
              <option value="scheduled">Scheduled</option>
              <option value="recurring">Recurring</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Origin
            </label>
            <input
              type="text"
              name="origin"
              value={filters.origin}
              onChange={handleFilterChange}
              className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-300 rounded-md shadow-sm"
              placeholder="Enter origin"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Destination
            </label>
            <input
              type="text"
              name="destination"
              value={filters.destination}
              onChange={handleFilterChange}
              className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-300 rounded-md shadow-sm"
              placeholder="Enter destination"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Departure Date
            </label>
            <input
              type="date"
              name="departureTime"
              value={filters.departureTime}
              onChange={handleFilterChange}
              className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Canceled By
            </label>
            <select
              name="canceledBy"
              value={filters.canceledBy}
              onChange={handleFilterChange}
              className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-300 rounded-md shadow-sm"
            >
              <option value="">All</option>
              <option value="passenger">Passenger</option>
              <option value="captain">Captain</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>

        {/* Confirm Button */}
        <div className="mt-6">
          <button
            onClick={handleApply}
            className="w-full py-3 rounded-xl text-white font-semibold transition duration-200 bg-blue-600 hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyRidesFilterDialog;