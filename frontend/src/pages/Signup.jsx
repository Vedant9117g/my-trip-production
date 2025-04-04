import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from "../features/api/authApi";
import { toast } from "sonner";

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
      navigate("/"); // Redirect to home on success
    } catch (error) {
      toast.error(error.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-4">
          Sign Up
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form Fields */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;