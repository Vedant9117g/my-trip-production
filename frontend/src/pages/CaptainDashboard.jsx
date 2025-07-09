import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { FaCarSide, FaCheckCircle, FaClock, FaUser, FaStar, FaRupeeSign } from "react-icons/fa";
import { motion } from "framer-motion";

const CaptainDashboard = () => {
  const navigate = useNavigate();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRides: 0,
    completed: 0,
    upcoming: 0,
    rating: 0,
    totalEarnings: 0,
  });

  // Fetch captain's rides (similar to Profile.jsx)
  const fetchRides = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Unauthorized. Redirecting...");
      navigate("/login");
      return;
    }
    try {
      const response = await axios.get(
        "https://my-trip-production-1.onrender.com/api/rides/captain/rides",
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      const ridesData = response.data?.rides || [];
      setRides(ridesData);

      // Calculate stats
      const completedRides = ridesData.filter(r => r.status === "completed");
      const completed = completedRides.length;
      const upcoming = ridesData.filter(r => r.status !== "completed" && dayjs(r.departureTime).isAfter(dayjs())).length;
      const totalEarnings = completedRides.reduce(
        (sum, r) => sum + (r.finalFare || (r.fare && r.fare.total) || 0),
        0
      );
      setStats({
        totalRides: ridesData.length,
        completed,
        upcoming,
        rating: 4.8, // Replace with real rating if available
        totalEarnings,
      });
    } catch (error) {
      toast.error("Failed to load rides.");
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
        <h1 className="text-2xl font-semibold">Loading Dashboard...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-400 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 transition-colors duration-300 p-0 md:p-8">
      <div className="max-w-6xl mx-auto py-8">
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-3xl md:text-4xl font-extrabold text-blue-700 dark:text-blue-200 mb-8 text-center"
        >
          Captain Dashboard
        </motion.h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-xl shadow-lg p-6 flex flex-col items-center border border-blue-100 dark:border-gray-800"
          >
            <FaCarSide className="text-blue-500 text-2xl" />
            <div className="text-2xl font-bold mt-2 text-blue-700 dark:text-blue-200">{stats.totalRides}</div>
            <div className="text-sm text-blue-900 dark:text-blue-100">Total Rides</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-xl shadow-lg p-6 flex flex-col items-center border border-blue-100 dark:border-gray-800"
          >
            <FaCheckCircle className="text-green-500 text-2xl" />
            <div className="text-2xl font-bold mt-2 text-blue-700 dark:text-blue-200">{stats.completed}</div>
            <div className="text-sm text-blue-900 dark:text-blue-100">Completed</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-xl shadow-lg p-6 flex flex-col items-center border border-blue-100 dark:border-gray-800"
          >
            <FaClock className="text-yellow-500 text-2xl" />
            <div className="text-2xl font-bold mt-2 text-blue-700 dark:text-blue-200">{stats.upcoming}</div>
            <div className="text-sm text-blue-900 dark:text-blue-100">Upcoming</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-xl shadow-lg p-6 flex flex-col items-center border border-blue-100 dark:border-gray-800"
          >
            <FaStar className="text-yellow-400 text-2xl" />
            <div className="text-2xl font-bold mt-2 text-blue-700 dark:text-blue-200">{stats.rating}</div>
            <div className="text-sm text-blue-900 dark:text-blue-100">Rating</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-xl shadow-lg p-6 flex flex-col items-center border border-blue-100 dark:border-gray-800"
          >
            <FaRupeeSign className="text-green-600 text-2xl" />
            <div className="text-2xl font-bold mt-2 text-blue-700 dark:text-blue-200">
              ₹ {stats.totalEarnings}
            </div>
            <div className="text-sm text-blue-900 dark:text-blue-100">Total Earnings</div>
          </motion.div>
        </div>

        {/* Rides Table */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-100 dark:border-gray-800 p-6"
        >
          <h2 className="text-xl font-bold text-blue-700 dark:text-blue-200 mb-4">
            My Rides
          </h2>
          {rides.length === 0 ? (
            <div className="text-blue-900 dark:text-blue-100">No rides found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr>
                    <th className="py-2 px-3 text-blue-900 dark:text-blue-100">From</th>
                    <th className="py-2 px-3 text-blue-900 dark:text-blue-100">To</th>
                    <th className="py-2 px-3 text-blue-900 dark:text-blue-100">Date</th>
                    <th className="py-2 px-3 text-blue-900 dark:text-blue-100">Time</th>
                    <th className="py-2 px-3 text-blue-900 dark:text-blue-100">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rides.map((ride, idx) => (
                    <motion.tr
                      key={ride._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      className="hover:bg-blue-50 dark:hover:bg-gray-800/60 transition"
                    >
                      <td className="py-2 px-3">{ride.origin}</td>
                      <td className="py-2 px-3">{ride.destination}</td>
                      <td className="py-2 px-3">{ride.departureTime ? dayjs(ride.departureTime).format("YYYY-MM-DD") : ""}</td>
                      <td className="py-2 px-3">{ride.departureTime ? dayjs(ride.departureTime).format("hh:mm A") : ""}</td>
                      <td className="py-2 px-3">
                        <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 text-xs font-semibold">
                          {ride.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CaptainDashboard;