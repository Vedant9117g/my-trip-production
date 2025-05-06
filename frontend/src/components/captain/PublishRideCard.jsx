import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  CalendarDays,
  Users,
  DollarSign,
  Car,
  Send,
  ClipboardList,
} from "lucide-react";

const PublishRideCard = () => {
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    totalSeats: 1,
    rideType: "scheduled",
    scheduledType: "cab",
    departureTime: "",
    vehicleType: "car",
    customFare: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePublishRide = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Unauthorized. Redirecting to login...");
      navigate("/login");
      return;
    }

    const payload = { ...formData, totalSeats: Number(formData.totalSeats) };
    if (payload.scheduledType === "cab") {
      payload.customFare = payload.customFare
        ? Number(payload.customFare)
        : undefined;
    } else {
      delete payload.customFare;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/rides/create",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      toast.success(response.data.message || "Ride created successfully!");
      setFormData({
        origin: "",
        destination: "",
        totalSeats: 1,
        rideType: "scheduled",
        scheduledType: "cab",
        departureTime: "",
        vehicleType: "car",
        customFare: "",
      });
    } catch (error) {
      console.error("Error creating ride:", error);
      toast.error(error.response?.data?.message || "Failed to create ride.");
    }
  };

  return (
    <div className="max-w-2xl w-full bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl">
      <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
        <ClipboardList className="inline-block mr-2 text-blue-600" />
        Publish a New Ride
      </h1>

      <form onSubmit={handlePublishRide} className="space-y-5">
        {/* Origin */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <MapPin className="inline-block w-4 h-4 mr-1 text-blue-500" />
            Origin
          </label>
          <input
            type="text"
            name="origin"
            placeholder="Enter origin"
            value={formData.origin}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-300 text-gray-900 dark:text-white dark:bg-gray-700"
            required
          />
        </div>

        {/* Destination */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <MapPin className="inline-block w-4 h-4 mr-1 text-green-500" />
            Destination
          </label>
          <input
            type="text"
            name="destination"
            placeholder="Enter destination"
            value={formData.destination}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-300 text-gray-900 dark:text-white dark:bg-gray-700"
            required
          />
        </div>

        {/* Row: Departure Time and Total Seats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Departure Time */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <CalendarDays className="inline-block w-4 h-4 mr-1 text-indigo-500" />
              Departure Time
            </label>
            <input
              type="datetime-local"
              name="departureTime"
              value={formData.departureTime}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-300 text-gray-900 dark:text-white dark:bg-gray-700"
              required
            />
          </div>

          {/* Total Seats */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <Users className="inline-block w-4 h-4 mr-1 text-pink-500" />
              Total Seats
            </label>
            <input
              type="number"
              name="totalSeats"
              placeholder="Enter total seats"
              value={formData.totalSeats}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-300 text-gray-900 dark:text-white dark:bg-gray-700"
              min={1}
              required
            />
          </div>
        </div>

        {/* Row: Vehicle Type and Ride Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Vehicle Type */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <Car className="inline-block w-4 h-4 mr-1 text-amber-500" />
              Vehicle Type
            </label>
            <select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg shadow-sm text-gray-900 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="car">Car</option>
              <option value="bike">Bike</option>
              <option value="auto">Auto</option>
            </select>
          </div>

          {/* Ride Type */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Ride Type
            </label>
            <select
              name="scheduledType"
              value={formData.scheduledType}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg shadow-sm text-gray-900 dark:bg-gray-700 dark:text-white"
            >
              <option value="cab">Cab</option>
              <option value="carpool">Carpool</option>
            </select>
          </div>
        </div>

        {/* Custom Fare (Optional) */}
        {formData.scheduledType === "cab" && (
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <DollarSign className="inline-block w-4 h-4 mr-1 text-gray-500" />
              Custom Fare (Optional)
            </label>
            <input
              type="number"
              name="customFare"
              placeholder="Enter custom fare"
              value={formData.customFare}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-300 text-gray-900 dark:text-white dark:bg-gray-700"
              min={1}
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-lg transition duration-200 flex items-center justify-center gap-2"
        >
          <Send className="h-5 w-5" />
          Publish Ride
        </button>
      </form>
    </div>
  );
};

export default PublishRideCard;