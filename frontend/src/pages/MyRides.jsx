import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { SlidersHorizontal, SortAsc } from "lucide-react"; // Filter and Sort icons
import MyRidesFilterDialog from "../components/MyRidesFilterDialog";
import MyRidesSortDialog from "../components/MyRidesSortDialog";
import RideDetailsDialog from "../components/RideDetailsDialog"; // Import RideDetailsDialog

const pageSize = 10;

const MyRides = () => {
  const [rides, setRides] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [filteredRides, setFilteredRides] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    rideType: "",
    origin: "",
    destination: "",
    departureTime: "",
    canceledBy: "",
  });
  const [sortParameter, setSortParameter] = useState({ field: "", order: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showSortDialog, setShowSortDialog] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null); // State for selected ride

  const user = useSelector((state) => state.auth.user);

  const fetchRides = async (
    filtersToApply = {},
    sortParam = { field: "", order: "" }
  ) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("User not authenticated.");
        setLoading(false);
        return;
      }

      const validFilters = Object.fromEntries(
        Object.entries(filtersToApply).filter(([_, value]) => value)
      );

      const queryParams = new URLSearchParams(validFilters).toString();
      const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/api/rides/my-rides`;
      const url = queryParams ? `${baseUrl}?${queryParams}` : baseUrl;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      let ridesData = response.data.rides || [];

      // Apply sorting
      if (sortParam.field) {
        ridesData = ridesData.sort((a, b) => {
          const fieldA =
            sortParam.field === "fare"
              ? a.finalFare || 0
              : new Date(a.departureTime);
          const fieldB =
            sortParam.field === "fare"
              ? b.finalFare || 0
              : new Date(b.departureTime);

          if (sortParam.order === "asc") {
            return fieldA - fieldB;
          } else if (sortParam.order === "desc") {
            return fieldB - fieldA;
          }
          return 0;
        });
      }

      setRides(ridesData);
      setFilteredRides(ridesData);
    } catch (error) {
      console.error(
        "Error fetching rides:",
        error.response?.data || error.message
      );
      setError("Failed to fetch rides. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides(); // Load all rides initially
  }, []);

  const applyFilters = (appliedFilters) => {
    fetchRides(appliedFilters, sortParameter);
    setShowFilterDialog(false); // Close filter dialog
  };

  const applySort = (sortParam) => {
    setSortParameter(sortParam);
    fetchRides(filters, sortParam); // Fetch rides with the current filters and new sort parameter
    setShowSortDialog(false); // Close sort dialog
  };

  const handleRideClick = async (ride) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `http://localhost:5000/api/rides/${ride._id}`, // Fetch full ride details
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setSelectedRide(response.data.ride); // Set the full ride details
    } catch (error) {
      console.error("Failed to fetch ride details:", error);
    }
  };

  const closeRideDetailsDialog = () => {
    setSelectedRide(null); // Close the dialog
  };

  const totalRides = filteredRides.length;
  const noOfPages = Math.ceil(totalRides / pageSize);
  const start = currentPage * pageSize;
  const end = start + pageSize;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-6">
      {/* Title, Filter, and Sort Buttons */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">My Rides</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFilterDialog(true)}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span className="text-sm font-medium">Filters</span>
          </button>
          <button
            onClick={() => setShowSortDialog(true)}
            className="flex items-center gap-2 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md transition"
          >
            <SortAsc className="w-5 h-5" />
            <span className="text-sm font-medium">Sort</span>
          </button>
        </div>
      </div>

      {/* Filter Dialog */}
      {showFilterDialog && (
        <MyRidesFilterDialog
          filters={filters}
          setFilters={setFilters}
          onApply={applyFilters}
          onClose={() => setShowFilterDialog(false)}
        />
      )}

      {/* Sort Dialog */}
      {showSortDialog && (
        <MyRidesSortDialog
          sortParameter={sortParameter}
          onApply={applySort}
          onClose={() => setShowSortDialog(false)}
        />
      )}

      {/* Ride Details Dialog */}
      {selectedRide && (
        <RideDetailsDialog
          ride={selectedRide}
          onClose={closeRideDetailsDialog}
          loggedInUser={user}
        />
      )}

      {/* Loading/Error Messages */}
      {loading && (
        <p className="text-center text-gray-600 dark:text-gray-400">
          Loading rides...
        </p>
      )}
      {error && (
        <p className="text-center text-red-600 dark:text-red-400">{error}</p>
      )}

      {/* Tabbed Section for Status Filters */}
      <div className="flex justify-center gap-3 mb-6">
        {["All", "Active", "Past", "Canceled"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setFilters((prev) => ({
                ...prev,
                status:
                  tab === "All"
                    ? ""
                    : tab === "Active"
                    ? "scheduled,ongoing"
                    : tab === "Past"
                    ? "completed"
                    : "canceled",
              }));
              fetchRides(
                {
                  ...filters,
                  status:
                    tab === "All"
                      ? ""
                      : tab === "Active"
                      ? "scheduled,ongoing"
                      : tab === "Past"
                      ? "completed"
                      : "canceled",
                },
                sortParameter
              );
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition duration-200 ${
              (filters.status === "" && tab === "All") ||
              (filters.status.includes("scheduled") && tab === "Active") ||
              (filters.status === "completed" && tab === "Past") ||
              (filters.status === "canceled" && tab === "Canceled")
                ? "bg-blue-700 text-white shadow"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Rides */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRides.slice(start, end).map((ride) => (
          <div
            key={ride._id}
            onClick={() => handleRideClick(ride)}
            className="cursor-pointer rounded-2xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300 p-5 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {ride.origin} <span className="text-blue-500">→</span>{" "}
                {ride.destination}
              </h2>
              <div
                className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide ${
                  ride.status === "completed"
                    ? "bg-green-100 text-green-700 dark:bg-green-700 dark:text-white"
                    : ride.status === "canceled"
                    ? "bg-red-100 text-red-700 dark:bg-red-700 dark:text-white"
                    : ride.status === "ongoing"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-white"
                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-white"
                }`}
              >
                {ride.status}
              </div>
            </div>

            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <div className="flex justify-between">
                <span className="font-medium">Ride Type:</span>
                <span className="capitalize">{ride.rideType}</span>
              </div>

              {ride.rideType === "scheduled" && (
                <div className="flex justify-between">
                  <span className="font-medium">Scheduled Type:</span>
                  <span className="capitalize">
                    {ride.scheduledType || "N/A"}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="font-medium">Departure:</span>
                <span>
                  {ride.departureTime
                    ? new Date(ride.departureTime).toLocaleString()
                    : "N/A"}
                </span>
              </div>

              {ride.estimatedArrivalTime && (
                <div className="flex justify-between">
                  <span className="font-medium">ETA:</span>
                  <span>
                    {new Date(ride.estimatedArrivalTime).toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="font-medium">Fare:</span>
                <span className="text-green-600 dark:text-green-400 font-semibold">
                  ₹{ride.finalFare ?? "N/A"}
                </span>
              </div>

              {ride.customFare && (
                <div className="flex justify-between text-yellow-600 dark:text-yellow-400">
                  <span className="font-medium">Custom Fare:</span>
                  <span>₹{ride.customFare}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="font-medium">Seats Booked:</span>
                <span>
                  {ride.seatsBooked} / {ride.totalSeats}
                </span>
              </div>

              {ride.availableSeats != null && (
                <div className="flex justify-between">
                  <span className="font-medium">Available Seats:</span>
                  <span>{ride.availableSeats}</span>
                </div>
              )}

              {ride.canceledBy && (
                <div className="flex justify-between text-red-600 dark:text-red-400">
                  <span className="font-medium">Canceled By:</span>
                  <span className="capitalize">{ride.canceledBy}</span>
                </div>
              )}

              {ride.canceledReason && (
                <div className="flex justify-between text-red-400 dark:text-red-300 text-xs italic">
                  <span className="font-medium">Reason:</span>
                  <span>{ride.canceledReason.replace(/_/g, " ")}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div>
        {/* Pagination Controls */}
        {noOfPages > 1 && (
          <div className="flex items-center justify-center mt-8 gap-2 flex-wrap">
            {/* Prev Button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className={`px-4 py-2 rounded-xl transition duration-200 shadow-sm ${
                currentPage === 0
                  ? "bg-gray-300 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              ← Prev
            </button>

            {/* Page Numbers */}
            <div className="flex gap-1">
              {[...Array(noOfPages).keys()].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition duration-200 ${
                    currentPage === page
                      ? "bg-blue-700 text-white shadow-md"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {page + 1}
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, noOfPages - 1))
              }
              disabled={currentPage === noOfPages - 1}
              className={`px-4 py-2 rounded-xl transition duration-200 shadow-sm ${
                currentPage === noOfPages - 1
                  ? "bg-gray-300 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* No Rides */}
      {filteredRides.length === 0 && !loading && !error && (
        <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
          No rides found matching the filters.
        </p>
      )}
    </div>
  );
};

export default MyRides;
