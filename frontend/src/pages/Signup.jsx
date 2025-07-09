import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useRegisterUserMutation } from "../features/api/authApi";
import { motion } from "framer-motion";

const Signup = () => {
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "passenger",
    vehicleType: "car",
    model: "",
    numberPlate: "",
    seats: 1,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData =
      formData.role === "captain" || formData.role === "both"
        ? {
            ...formData,
            vehicle: {
              vehicleType: formData.vehicleType,
              model: formData.model,
              numberPlate: formData.numberPlate,
              seats: Number(formData.seats),
            },
          }
        : formData;

    try {
      const result = await registerUser(userData).unwrap();
      toast.success(result.message || "Signup successful!");
      navigate("/login");
    } catch (error) {
      toast.error(error.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-400 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 transition-colors duration-300 relative overflow-hidden">
      {/* Decorative Blobs */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 0.22 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className="absolute -top-32 -left-32 w-96 h-96 bg-blue-300 dark:bg-blue-900 rounded-full blur-3xl z-0"
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1.1, opacity: 0.15 }}
        transition={{ duration: 1.2, delay: 0.4 }}
        className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200 dark:bg-blue-950 rounded-full blur-3xl z-0"
      />

      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, type: "spring" }}
        className="relative w-full max-w-md h-auto overflow-hidden rounded-2xl shadow-2xl border border-blue-100 dark:border-gray-800 bg-white/30 dark:bg-gray-900/60 backdrop-blur-xl p-8 z-10"
        style={{ WebkitBackdropFilter: "blur(18px)", backdropFilter: "blur(18px)" }}
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-extrabold text-blue-700 dark:text-blue-200 text-center mb-2 drop-shadow"
        >
          Create Account
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-blue-900/80 dark:text-blue-100/80 text-center mb-6"
        >
          Join MyTrip and start your journey!
        </motion.p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
          >
            <label
              htmlFor="name"
              className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-1"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-700 bg-white/70 dark:bg-gray-800/80 text-blue-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.38 }}
          >
            <label
              htmlFor="email"
              className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-700 bg-white/70 dark:bg-gray-800/80 text-blue-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.41 }}
          >
            <label
              htmlFor="password"
              className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-700 bg-white/70 dark:bg-gray-800/80 text-blue-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.44 }}
          >
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-1"
            >
              Phone
            </label>
            <input
              type="text"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="w-full px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-700 bg-white/70 dark:bg-gray-800/80 text-blue-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.47 }}
          >
            <label
              htmlFor="role"
              className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-1"
            >
              Role
            </label>
            <select
              name="role"
              id="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-700 bg-white/70 dark:bg-gray-800/80 text-blue-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              <option value="passenger">Passenger</option>
              <option value="captain">Captain</option>
              <option value="both">Both</option>
            </select>
          </motion.div>
          {(formData.role === "captain" || formData.role === "both") && (
            <>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label
                  htmlFor="vehicleType"
                  className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-1"
                >
                  Vehicle Type
                </label>
                <select
                  name="vehicleType"
                  id="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-700 bg-white/70 dark:bg-gray-800/80 text-blue-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                >
                  <option value="car">Car</option>
                  <option value="bike">Bike</option>
                  <option value="auto">Auto</option>
                </select>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.53 }}
              >
                <label
                  htmlFor="model"
                  className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-1"
                >
                  Vehicle Model
                </label>
                <input
                  type="text"
                  name="model"
                  id="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="Enter vehicle model"
                  className="w-full px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-700 bg-white/70 dark:bg-gray-800/80 text-blue-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  required
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.56 }}
              >
                <label
                  htmlFor="numberPlate"
                  className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-1"
                >
                  Number Plate
                </label>
                <input
                  type="text"
                  name="numberPlate"
                  id="numberPlate"
                  value={formData.numberPlate}
                  onChange={handleChange}
                  placeholder="Enter vehicle number plate"
                  className="w-full px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-700 bg-white/70 dark:bg-gray-800/80 text-blue-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  required
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.59 }}
              >
                <label
                  htmlFor="seats"
                  className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-1"
                >
                  Seats
                </label>
                <input
                  type="number"
                  name="seats"
                  id="seats"
                  value={formData.seats}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-700 bg-white/70 dark:bg-gray-800/80 text-blue-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  required
                />
              </motion.div>
            </>
          )}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-2 bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-800 dark:to-blue-900 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Signing Up...
              </>
            ) : (
              "Sign Up"
            )}
          </motion.button>
        </form>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-center"
        >
          <span className="text-sm text-blue-900/80 dark:text-blue-100/80">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              Login
            </a>
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;