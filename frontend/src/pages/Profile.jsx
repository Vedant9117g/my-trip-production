import React, { useEffect, useState } from "react";
import {
  useLoadUserQuery,
  useUpdateUserMutation,
} from "../features/api/authApi";
import { toast } from "sonner";
import dayjs from "dayjs";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RideCard from "../components/RideCard"; // Import RideCard
import EditProfileDialog from "../components/EditProfileDialog"; // Import EditProfileDialog

const Profile = () => {
  const navigate = useNavigate();
  const [rides, setRides] = useState({ active: [], settled: [] });
  const [loadingRides, setLoadingRides] = useState(true);

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

  const isActive = (departureTime) => dayjs(departureTime).isAfter(now);
  const isSettled = (departureTime) => dayjs(departureTime).isBefore(now);

  // Move fetchRides outside of useEffect
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
          "http://localhost:5000/api/rides/my-rides",
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setRides(response.data);
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
      const now = dayjs();

      // Updated logic for active and settled rides
      const active = rideList.filter(
        (ride) =>
          ride.status !== "completed" &&
          ride.status !== "canceled" &&
          (!ride.departureTime || dayjs(ride.departureTime).isAfter(now)) // Time-based logic
      );

      const settled = rideList.filter(
        (ride) =>
          ride.status === "completed" ||
          ride.status === "canceled" ||
          (ride.departureTime && dayjs(ride.departureTime).isBefore(now)) // Time-based logic
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

  if (isLoading || loadingRides)
    return <h1 className="text-center text-xl">Loading Profile...</h1>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-4">
          Profile
        </h2>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="flex flex-col items-center">
            <div className="h-24 w-24 md:h-32 md:w-32 mb-4 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600">
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

          <div className="w-full">
            <div className="mb-4">
              <strong className="text-gray-900 dark:text-gray-100">
                Name:
              </strong>{" "}
              <span className="text-gray-700 dark:text-gray-300">
                {user.name || "N/A"}
              </span>
            </div>
            <div className="mb-4">
              <strong className="text-gray-900 dark:text-gray-100">
                Email:
              </strong>{" "}
              <span className="text-gray-700 dark:text-gray-300">
                {user.email || "N/A"}
              </span>
            </div>
            <div className="mb-4">
              <strong className="text-gray-900 dark:text-gray-100">
                Phone:
              </strong>{" "}
              <span className="text-gray-700 dark:text-gray-300">
                {user.phone || "N/A"}
              </span>
            </div>
            <div className="mb-4">
              <strong className="text-gray-900 dark:text-gray-100">
                Role:
              </strong>{" "}
              <span className="text-gray-700 dark:text-gray-300">
                {user.role?.toUpperCase()}
              </span>
            </div>
            {user.role === "captain" && user.vehicle && (
              <div className="mb-4">
                <strong className="text-gray-900 dark:text-gray-100">
                  Vehicle:
                </strong>{" "}
                <span className="text-gray-700 dark:text-gray-300">
                  {user.vehicle.vehicleType} - {user.vehicle.model} (
                  {user.vehicle.numberPlate})
                </span>
              </div>
            )}
            <button
              className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              onClick={() =>
                document.getElementById("edit-profile-modal").showModal()
              }
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Rides Section */}
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {user.role === "captain" ? "Published Rides" : "Booked Rides"}
        </h2>

        {/* Active Rides */}
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
          Active
        </h3>
        {rides.active.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No active rides.
          </p>
        ) : (
          <div className="space-y-4 mb-6">
            {rides.active.map((ride) => (
              <RideCard
                key={ride._id}
                ride={ride}
                userRole={user.role}
                onRideUpdate={fetchRides}
              />
            ))}
          </div>
        )}

        {/* Settled Rides */}
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
          Settled
        </h3>
        {rides.settled.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No settled rides.</p>
        ) : (
          <div className="space-y-4">
            {rides.settled.map((ride) => (
              <RideCard
                key={ride._id}
                ride={ride}
                userRole={user.role}
                onRideUpdate={fetchRides}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Profile Dialog */}
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
