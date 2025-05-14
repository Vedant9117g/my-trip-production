import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useLoadUserQuery } from "../features/api/authApi"; // Import useLoadUserQuery
import CancelRideDialog from "../components/CancelRideDialog";
import {
  UserIcon,
  UsersIcon,
  PhoneIcon,
  MailIcon,
  CarIcon,
  MapPinIcon,
  ClockIcon,
  CalendarIcon,
  IndianRupee,
  TicketIcon,
  CheckCircleIcon,
} from "lucide-react";

const RideDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: userData, isLoading: userLoading } = useLoadUserQuery(); // Fetch current user
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seatsToBook, setSeatsToBook] = useState(1);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [otp, setOtp] = useState(""); // For starting the ride

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `http://localhost:5000/api/rides/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        console.log("Ride fetched successfully:", response.data.ride); // Debugging log
        setRide(response.data.ride);
      } catch (error) {
        console.error("Failed to fetch ride details:", error);
        if (error.response?.status === 401) {
          alert("Please log in again.");
          localStorage.removeItem("authToken");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRide();
  }, [id, navigate]);

  const handleStartRide = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/rides/start",
        { rideId: ride._id, otp },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          withCredentials: true,
        }
      );
      alert(response.data.message);
      setRide(response.data.ride); // Update ride details
    } catch (error) {
      console.error("Start ride error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to start the ride");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRide = async (reason) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/rides/cancel",
        {
          rideId: ride._id,
          reason,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          withCredentials: true,
        }
      );
      alert(response.data.message);
      setRide(response.data.ride); // Update ride details
    } catch (error) {
      console.error(
        "Cancel ride error:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.message || "Failed to cancel the ride");
    } finally {
      setLoading(false);
      setShowCancelDialog(false);
    }
  };

  const handleCompleteRide = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/rides/complete",
        { rideId: ride._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          withCredentials: true,
        }
      );
      alert(response.data.message);
      setRide(response.data.ride); // Update ride details
    } catch (error) {
      console.error(
        "Complete ride error:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.message || "Failed to complete the ride");
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.post(
        `http://localhost:5000/api/rides/${id}/book`,
        { seats: seatsToBook },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      alert("Seats booked successfully!");
      console.log("Ride updated after booking:", res.data.ride); // Debugging log
      setRide(res.data.ride); // Update ride to reflect latest booking
    } catch (error) {
      console.error("Booking failed:", error);
      alert(error.response?.data?.message || "Booking failed.");
    }
  };

  const handleCancelSuccess = () => {
    setShowCancelDialog(false);
    alert("Ride canceled successfully!");
    navigate("/my-rides");
  };

  if (loading || userLoading)
    return (
      <p className="text-center text-lg mt-10 text-white">
        Loading ride details...
      </p>
    );
  if (!ride)
    return <p className="text-center text-red-500 mt-10">Ride not found.</p>;

  const currentUserId = userData?.user?._id; // Get current user ID from useLoadUserQuery
  const userRole = userData?.user?.role; // Get the role of the logged-in user
  console.log("Current User ID:", currentUserId); // Debugging log
  console.log("User Role:", userRole); // Debugging log
  console.log("Ride Booked Users:", ride.bookedUsers); // Debugging log

  const availableSeats = ride.totalSeats - ride.seatsBooked;

  // Updated logic to check if the user has booked the ride
  const userHasBooked =
    ride.scheduledType === "cab"
      ? ride.userId?._id === currentUserId // For cab rides, check userId
      : ride.bookedUsers?.some((user) => {
          if (typeof user === "string") {
            return user === currentUserId;
          } else if (typeof user === "object") {
            return user.userId === currentUserId || user._id === currentUserId;
          }
          return false;
        });

  console.log("User Has Booked:", userHasBooked); // Debugging log

  return (
    <div className="min-h-screen bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 from-sky-400 to-indigo-600 flex justify-center items-start py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl space-y-8 bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white flex items-center gap-2">
          <CarIcon className="w-6 h-6 text-gray-700 dark:text-white" /> Ride
          Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Captain Info */}
          {userRole === "passenger" && (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 space-y-4 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-indigo-600" /> Captain Info
              </h3>

              <div className="flex gap-4 items-center">
                <img
                  src={
                    ride.captainId?.profilePhoto ||
                    "https://via.placeholder.com/100"
                  }
                  alt="Captain"
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-400 dark:border-gray-600"
                />

                <div className="w-full space-y-2 text-sm text-gray-800 dark:text-gray-300">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 font-medium">
                      <UserIcon className="w-4 h-4 text-indigo-600" />
                      Name:
                    </span>
                    <span>{ride.captainId?.name || "N/A"}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 font-medium">
                      <PhoneIcon className="w-4 h-4 text-blue-500" />
                      Phone:
                    </span>
                    <span>{ride.captainId?.phone || "N/A"}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 font-medium">
                      <MailIcon className="w-4 h-4 text-pink-500" />
                      Email:
                    </span>
                    <span>{ride.captainId?.email || "N/A"}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 font-medium">
                      <CarIcon className="w-4 h-4 text-gray-700 dark:text-gray-200" />
                      Vehicle:
                    </span>
                    <span>
                      {ride.captainId?.vehicle
                        ? `${ride.captainId.vehicle.model} (${ride.captainId.vehicle.numberPlate})`
                        : "Not available"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Passenger Info */}
          {userRole === "captain" && (
            <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-md space-y-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <UsersIcon className="w-5 h-5 text-indigo-600" />
                Passenger Info
              </h3>

              {/* CAB Ride – Single Passenger */}
              {ride.scheduledType === "cab" && ride.userId && (
                <div className="space-y-3 text-sm text-gray-800 dark:text-gray-300">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 font-medium">
                      <UserIcon className="w-4 h-4 text-indigo-600" />
                      Name:
                    </span>
                    <span>{ride.userId.name || "N/A"}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 font-medium">
                      <PhoneIcon className="w-4 h-4 text-blue-500" />
                      Phone:
                    </span>
                    <span>{ride.userId.phone || "N/A"}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 font-medium">
                      <MailIcon className="w-4 h-4 text-pink-500" />
                      Email:
                    </span>
                    <span>{ride.userId.email || "N/A"}</span>
                  </div>
                </div>
              )}

              {ride.rideType === "instant" && ride.userId && (
                <div className="space-y-3 text-sm text-gray-800 dark:text-gray-300">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 font-medium">
                      <UserIcon className="w-4 h-4 text-indigo-600" />
                      Name:
                    </span>
                    <span>{ride.userId.name || "N/A"}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 font-medium">
                      <PhoneIcon className="w-4 h-4 text-blue-500" />
                      Phone:
                    </span>
                    <span>{ride.userId.phone || "N/A"}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 font-medium">
                      <MailIcon className="w-4 h-4 text-pink-500" />
                      Email:
                    </span>
                    <span>{ride.userId.email || "N/A"}</span>
                  </div>
                </div>
              )}

              {/* Carpool Ride – Multiple Passengers */}
              {ride.scheduledType === "carpool" &&
                Array.isArray(ride.bookedUsers) && (
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {ride.bookedUsers.map((booking) => (
                      <div
                        key={booking._id}
                        className="border border-gray-200 dark:border-gray-700 rounded-2xl p-3 bg-white dark:bg-gray-800 shadow-sm space-y-2 text-sm text-gray-800 dark:text-gray-300"
                      >
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-2 font-medium">
                            <UserIcon className="w-4 h-4 text-indigo-600" />
                            Name:
                          </span>
                          <span>{booking.userId?.name || "N/A"}</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-2 font-medium">
                            <PhoneIcon className="w-4 h-4 text-blue-500" />
                            Phone:
                          </span>
                          <span>{booking.userId?.phone || "N/A"}</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-2 font-medium">
                            <MailIcon className="w-4 h-4 text-pink-500" />
                            Email:
                          </span>
                          <span>{booking.userId?.email || "N/A"}</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-2 font-medium">
                            <TicketIcon className="w-4 h-4 text-sky-500" />
                            Seats:
                          </span>
                          <span>
                            {booking.seats} seat{booking.seats > 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    ))}

                    <p className="text-center text-xs text-gray-400 mt-2">
                      — That’s all users —
                    </p>
                  </div>
                )}
            </div>
          )}

          {/* Ride Info */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 space-y-5 border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
              <MapPinIcon className="w-6 h-6 text-red-500" /> Ride Information
            </h3>

            <div className="text-sm space-y-3 text-gray-800 dark:text-gray-300">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 font-medium">
                  <MapPinIcon className="w-4 h-4 text-red-500" />
                  Route:
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {ride.origin} <span className="text-blue-500">→</span>{" "}
                  {ride.destination}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 font-medium">
                  <CalendarIcon className="w-4 h-4 text-amber-500" />
                  Date:
                </div>
                <div>{new Date(ride.departureTime).toLocaleDateString()}</div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 font-medium">
                  <ClockIcon className="w-4 h-4 text-purple-500" />
                  Time:
                </div>
                <div>{new Date(ride.departureTime).toLocaleTimeString()}</div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 font-medium">
                  <IndianRupee className="w-4 h-4 text-green-600" />
                  Fare:
                </div>
                <div className="font-semibold text-green-700 dark:text-green-400">
                  ₹{ride.finalFare}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 font-medium">
                  <TicketIcon className="w-4 h-4 text-sky-500" />
                  Seats Booked:
                </div>
                <div>
                  {ride.seatsBooked} / {ride.totalSeats}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                  Status:
                </div>
                <div className="capitalize font-semibold">{ride.status}</div>
              </div>

              {userRole === "passenger" &&
                ride.status === "scheduled" &&
                ride.otp && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 font-medium">
                      <CheckCircleIcon className="w-4 h-4 text-blue-500" />
                      OTP:
                    </div>
                    <div className="font-bold">{ride.otp}</div>
                  </div>
                )}

              {ride.canceledBy && (
                <div className="flex items-start gap-2 text-red-600 dark:text-red-400 mt-4">
                  <AlertCircleIcon className="w-5 h-5 mt-0.5" />
                  <div>
                    <strong>{ride.canceledBy}</strong> canceled this ride due
                    to: <em>{ride.canceledReason.replace(/_/g, " ")}</em>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Passenger Actions */}
        {userRole === "passenger" && ride.status !== "ongoing" && (
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            {ride.status === "canceled" ? (
              <button
                onClick={() => navigate("/")}
                className="bg-gray-600 hover:bg-gray-700 transition text-white px-6 py-2 rounded-md"
              >
                View More
              </button>
            ) : ride.status === "completed" ? (
              <button
                onClick={() => navigate("/")}
                className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-2 rounded-md"
              >
                Book Again
              </button>
            ) : userHasBooked && ride.status === "scheduled" ? (
              <>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  ❌ Cancel Your Ride
                </h3>
                <button
                  onClick={() => setShowCancelDialog(true)}
                  className="bg-red-600 hover:bg-red-700 transition text-white px-6 py-2 rounded-md"
                >
                  Cancel Ride
                </button>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  🎟️ Book Your Seat
                </h3>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <input
                    type="number"
                    min="1"
                    max={availableSeats}
                    value={seatsToBook}
                    onChange={(e) =>
                      setSeatsToBook(
                        Math.min(Number(e.target.value), availableSeats)
                      )
                    }
                    className="w-32 px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                  <button
                    onClick={handleBook}
                    className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-2 rounded-md"
                    disabled={availableSeats === 0}
                  >
                    Confirm Booking
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {availableSeats} seat{availableSeats !== 1 ? "s" : ""} left
                </p>
              </>
            )}
          </div>
        )}

        {/* Captain Actions */}
        {userRole === "captain" && (
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            {ride.status === "scheduled" && (
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="p-2 border rounded w-full mb-2"
                />
                <button
                  onClick={handleStartRide}
                  disabled={loading || !otp}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {loading ? "Starting Ride..." : "Start Ride"}
                </button>
              </div>
            )}

            {ride.status === "ongoing" && (
              <div className="mt-4">
                <button
                  onClick={handleCompleteRide}
                  disabled={loading}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                >
                  {loading ? "Completing Ride..." : "Complete Ride"}
                </button>
              </div>
            )}

            {ride.status === "scheduled" && (
              <div className="mt-4">
                <button
                  onClick={() => setShowCancelDialog(true)}
                  disabled={loading}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                >
                  Cancel Ride
                </button>
              </div>
            )}
          </div>
        )}

        {/* Cancel Ride Dialog */}
        {showCancelDialog && (
          <CancelRideDialog
            rideId={ride._id}
            userRole={userRole}
            onClose={() => setShowCancelDialog(false)}
            onSuccess={(updatedRide) => {
              setShowCancelDialog(false);
              setRide(updatedRide);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default RideDetails;
