import React, { useEffect, useState } from "react";
import { useLoadUserQuery, useUpdateUserMutation } from "../features/api/authApi";
import { toast } from "sonner";
import dayjs from "dayjs";

const Profile = () => {
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
    { data: updateUserData, isLoading: updateUserIsLoading, isError, error, isSuccess },
  ] = useUpdateUserMutation();

  // Set initial state from user data
  useEffect(() => {
    if (data?.user) {
      const user = data.user;
      setName(user.name || "");
      setPhone(user.phone || "");
      setRole(user.role || "");
      setVehicle(user.vehicle || { vehicleType: "", model: "", numberPlate: "", seats: 1 });
      setProfilePhoto(user.profilePhoto || "");
    }
  }, [data]);

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
  }, [error, updateUserData, isSuccess, isError]);

  if (isLoading) return <h1 className="text-center text-xl">Loading Profile...</h1>;

  const user = data?.user || {};

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-4">Profile</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
          View and update your profile information.
        </p>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="flex flex-col items-center">
            <div className="h-24 w-24 md:h-32 md:w-32 mb-4 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600">
              <img
                src={
                  typeof user?.profilePhoto === "string"
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
              <h1 className="font-semibold text-gray-900 dark:text-gray-100">
                Name:
                <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                  {user?.name || "N/A"}
                </span>
              </h1>
            </div>
            <div className="mb-4">
              <h1 className="font-semibold text-gray-900 dark:text-gray-100">
                Email:
                <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                  {user?.email || "N/A"}
                </span>
              </h1>
            </div>
            <div className="mb-4">
              <h1 className="font-semibold text-gray-900 dark:text-gray-100">
                Phone:
                <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                  {user?.phone || "N/A"}
                </span>
              </h1>
            </div>
            <div className="mb-4">
              <h1 className="font-semibold text-gray-900 dark:text-gray-100">
                Role:
                <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                  {user?.role?.toUpperCase() || "N/A"}
                </span>
              </h1>
            </div>
            {user?.role === "captain" && user?.vehicle && (
              <div className="mb-4">
                <h1 className="font-semibold text-gray-900 dark:text-gray-100">
                  Vehicle:
                  <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                    {`${user.vehicle.vehicleType || "N/A"} - ${user.vehicle.model || "N/A"} (${user.vehicle.numberPlate || "N/A"})`}
                  </span>
                </h1>
              </div>
            )}
            <button
              className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center"
              onClick={() => document.getElementById("edit-profile-modal").showModal()}
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Booked Rides Section */}
        {user?.role === "passenger" && user?.bookedRides?.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Booked Rides</h2>
            <div className="space-y-4">
              {user.bookedRides.map((ride) => (
                <div
                  key={ride._id}
                  className="p-4 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                >
                  <p className="text-gray-800 dark:text-gray-200">
                    <strong>From:</strong> {ride.origin} | <strong>To:</strong> {ride.destination}
                  </p>
                  <p className="text-gray-800 dark:text-gray-200">
                    <strong>Date:</strong>{" "}
                    {dayjs(ride.departureTime).format("DD MMM YYYY, hh:mm A")}
                  </p>
                  <p className="text-gray-800 dark:text-gray-200">
                    <strong>Fare:</strong> ₹{ride.finalFare}
                  </p>
                  <p className="text-gray-800 dark:text-gray-200">
                    <strong>Seats Booked:</strong> {ride.seatsBooked}
                  </p>
                  <p className="text-gray-800 dark:text-gray-200">
                    <strong>Captain:</strong> {ride?.captainId?.name} ({ride?.captainId?.phone})
                  </p>
                  <p className="text-gray-800 dark:text-gray-200">
                    <strong>Vehicle:</strong>{" "}
                    {ride?.captainId?.vehicle
                      ? `${ride.captainId.vehicle.vehicleType} - ${ride.captainId.vehicle.model} (${ride.captainId.vehicle.numberPlate})`
                      : "N/A"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <dialog id="edit-profile-modal" className="rounded-lg p-6 bg-white dark:bg-gray-800 shadow-lg">
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Edit Profile</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateUserHandler();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone"
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
            >
              <option value="passenger">Passenger</option>
              <option value="captain">Captain</option>
              <option value="both">Both</option>
            </select>
          </div>
          {role === "captain" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Vehicle Details
              </label>
              <input
                type="text"
                value={vehicle.vehicleType}
                onChange={(e) => setVehicle({ ...vehicle, vehicleType: e.target.value })}
                placeholder="Vehicle Type"
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              />
              <input
                type="text"
                value={vehicle.model}
                onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })}
                placeholder="Model"
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              />
              <input
                type="text"
                value={vehicle.numberPlate}
                onChange={(e) => setVehicle({ ...vehicle, numberPlate: e.target.value })}
                placeholder="Number Plate"
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              />
              <input
                type="number"
                value={vehicle.seats}
                onChange={(e) => setVehicle({ ...vehicle, seats: e.target.value })}
                placeholder="Seats"
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Profile Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={onChangeHandler}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => document.getElementById("edit-profile-modal").close()}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateUserIsLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {updateUserIsLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
};

export default Profile;
