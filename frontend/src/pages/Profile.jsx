import React, { useEffect, useState, useRef } from "react";
import {
  useLoadUserQuery,
  useUpdateUserMutation,
} from "../features/api/authApi";
import { toast } from "sonner";
import dayjs from "dayjs";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RideCard from "../components/RideCard";
import EditProfileDialog from "../components/EditProfileDialog";

const Profile = () => {
  const navigate = useNavigate();

  const [rides, setRides] = useState({ active: [], settled: [] });
  const [loadingRides, setLoadingRides] = useState(true);
  const [showActiveRides, setShowActiveRides] = useState(true);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [vehicle, setVehicle] = useState({
    vehicleType: "",
    model: "",
    numberPlate: "",
    seats: 1,
  });
  const [profilePhoto, setProfilePhoto] = useState("");

  const { data, isLoading, refetch } = useLoadUserQuery();
  const [
    updateUser,
    {
      data: updateUserData,
      isLoading: updateUserIsLoading,
      isError,
      error,
      isSuccess,
    },
  ] = useUpdateUserMutation();

  const user = data?.user || {};
  const now = dayjs();

  const rideListRef = useRef(null);
  const [reachedEnd, setReachedEnd] = useState(false);

  const handleScroll = () => {
    const list = rideListRef.current;
    if (list && list.scrollTop + list.clientHeight >= list.scrollHeight - 10) {
      setReachedEnd(true);
    } else {
      setReachedEnd(false);
    }
  };

  const fetchRides = async () => {
    if (user.role === "captain") {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Unauthorized. Redirecting...");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          "https://my-trip-production-1.onrender.com/api/rides/my-ridesss",
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        const activeRides = response.data?.active || [];
        const settledRides = response.data?.settled || [];
        setRides({ active: activeRides, settled: settledRides });
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to load rides.");
        if (error.response?.status === 401) {
          localStorage.removeItem("authToken");
          navigate("/login");
        }
      } finally {
        setLoadingRides(false);
      }
    } else {
      const rideList = user.bookedRides || [];
      const active = rideList.filter(
        (ride) =>
          ride.status !== "completed" &&
          ride.status !== "canceled" &&
          (!ride.departureTime || dayjs(ride.departureTime).isAfter(now))
      );

      const settled = rideList.filter(
        (ride) =>
          ride.status === "completed" ||
          ride.status === "canceled" ||
          (ride.departureTime && dayjs(ride.departureTime).isBefore(now))
      );

      setRides({ active, settled });
      setLoadingRides(false);
    }
  };

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setRole(user.role || "");
      setVehicle(
        user.vehicle || {
          vehicleType: "",
          model: "",
          numberPlate: "",
          seats: 1,
        }
      );
      setProfilePhoto(user.profilePhoto || "");
    }
  }, [user]);

  useEffect(() => {
    if (user?.role) fetchRides();
  }, [user, navigate]);

  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
  };

  const updateUserHandler = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("role", role);
    formData.append("vehicle", JSON.stringify(vehicle));
    if (profilePhoto && typeof profilePhoto !== "string") {
      formData.append("profilePhoto", profilePhoto);
    }
    await updateUser(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(updateUserData?.message || "Profile updated.");
    }
    if (isError) {
      toast.error(error?.data?.message || "Failed to update profile");
    }
  }, [isSuccess, isError, updateUserData, error, refetch]);

  if (isLoading || loadingRides) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
        <h1 className="text-2xl font-semibold">Loading Profile...</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-100 via-blue-100 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6">
      {/* Left Section */}
      <div className="w-full md:w-1/3 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl mb-6 md:mb-0 md:mr-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
          My Profile
        </h2>
        <div className="flex flex-col items-center mb-6">
          <div className="h-28 w-28 md:h-32 md:w-32 rounded-full overflow-hidden border-4 border-blue-400 dark:border-purple-400 shadow-lg">
            <img
              src={
                typeof user.profilePhoto === "string"
                  ? user.profilePhoto
                  : "https://github.com/shadcn.png"
              }
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="text-gray-700 dark:text-gray-300 space-y-3">
          <p>
            <strong>Name:</strong> {user.name || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {user.email || "N/A"}
          </p>
          <p>
            <strong>Phone:</strong> {user.phone || "N/A"}
          </p>
          <p>
            <strong>Role:</strong> {user.role?.toUpperCase()}
          </p>
          {user.role === "captain" && user.vehicle && (
            <p>
              <strong>Vehicle:</strong> {user.vehicle.vehicleType} -{" "}
              {user.vehicle.model} ({user.vehicle.numberPlate})
            </p>
          )}
        </div>
        <button
          className="w-full mt-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-md hover:from-blue-600 hover:to-purple-600 transition"
          onClick={() =>
            document.getElementById("edit-profile-modal").showModal()
          }
        >
          Edit Profile
        </button>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-2/3 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          {user.role === "captain" ? "Published Rides" : "Booked Rides"}
        </h2>

        {/* Toggle */}
        <div className="flex justify-center space-x-2 mb-6">
          <button
            className={`px-6 py-2 rounded-full text-sm font-semibold transition ${
              showActiveRides
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
            onClick={() => setShowActiveRides(true)}
          >
            Active
          </button>
          <button
            className={`px-6 py-2 rounded-full text-sm font-semibold transition ${
              !showActiveRides
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
            onClick={() => setShowActiveRides(false)}
          >
            Settled
          </button>
        </div>

        {/* Ride List */}
        <div
          ref={rideListRef}
          onScroll={handleScroll}
          className="h-[calc(100vh-250px)] overflow-y-auto space-y-4 pr-1 scroll-smooth"
        >
          {(showActiveRides ? rides.active : rides.settled).length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center">
              No {showActiveRides ? "active" : "settled"} rides found.
            </p>
          ) : (
            <>
              {(showActiveRides ? rides.active : rides.settled).map((ride) => (
                <RideCard
                  key={ride._id}
                  ride={ride}
                  userRole={user.role}
                  onRideUpdate={fetchRides}
                />
              ))}
              {reachedEnd && (
                <p className="text-center text-sm text-gray-400 dark:text-gray-500 mt-4 animate-fade-in">
                🚗 You’ve reached the end of your {showActiveRides ? "active" : "settled"} rides.
              </p>
              
              )}
            </>
          )}
        </div>
      </div>

      <EditProfileDialog
        name={name}
        setName={setName}
        phone={phone}
        setPhone={setPhone}
        role={role}
        setRole={setRole}
        vehicle={vehicle}
        setVehicle={setVehicle}
        profilePhoto={profilePhoto}
        onChangeHandler={onChangeHandler}
        updateUserHandler={updateUserHandler}
        updateUserIsLoading={updateUserIsLoading}
      />
    </div>
  );
};

export default Profile;
