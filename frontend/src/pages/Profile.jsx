import React, { useEffect, useState } from "react";
import { useLoadUserQuery, useUpdateUserMutation } from "../features/api/authApi";
import { toast } from "sonner";

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
    {
      data: updateUserData,
      isLoading: updateUserIsLoading,
      isError,
      error,
      isSuccess,
    },
  ] = useUpdateUserMutation();

  // Initialize state with fetched user data
  useEffect(() => {
    if (data?.user) {
      setName(data.user.name || "");
      setPhone(data.user.phone || "");
      setRole(data.user.role || "");
      setVehicle(data.user.vehicle || { vehicleType: "", model: "", numberPlate: "", seats: 1 });
      setProfilePhoto(data.user.profilePhoto || "");
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
    formData.append("profilePhoto", profilePhoto);

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

  const user = data?.user || {}; // Fallback to an empty object if `data` or `user` is undefined

  return (
    <div className="max-w-4xl mx-auto px-4 my-10">
      <h1 className="font-bold text-2xl text-center md:text-left">PROFILE</h1>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
        <div className="flex flex-col items-center">
          <div className="h-24 w-24 md:h-32 md:w-32 mb-4 rounded-full overflow-hidden border border-gray-300">
            <img
              src={user?.profilePhoto || "https://github.com/shadcn.png"}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Name:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user?.name || "N/A"}
              </span>
            </h1>
          </div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Email:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user?.email || "N/A"}
              </span>
            </h1>
          </div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Phone:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user?.phone || "N/A"}
              </span>
            </h1>
          </div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Role:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user?.role?.toUpperCase() || "N/A"}
              </span>
            </h1>
          </div>
          {user?.role === "captain" && user?.vehicle && (
            <div className="mb-2">
              <h1 className="font-semibold text-gray-900 dark:text-gray-100">
                Vehicle:
                <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                  {`${user.vehicle.vehicleType || "N/A"} - ${user.vehicle.model || "N/A"} (${user.vehicle.numberPlate || "N/A"})`}
                </span>
              </h1>
            </div>
          )}
          <button
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => document.getElementById("edit-profile-modal").showModal()}
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <dialog id="edit-profile-modal" className="rounded-lg p-6 bg-white shadow-lg">
        <h2 className="text-lg font-bold mb-4">Edit Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="passenger">Passenger</option>
              <option value="captain">Captain</option>
              <option value="both">Both</option>
            </select>
          </div>
          {role === "captain" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Vehicle Details</label>
              <input
                type="text"
                value={vehicle.vehicleType}
                onChange={(e) => setVehicle({ ...vehicle, vehicleType: e.target.value })}
                placeholder="Vehicle Type"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                value={vehicle.model}
                onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })}
                placeholder="Model"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                value={vehicle.numberPlate}
                onChange={(e) => setVehicle({ ...vehicle, numberPlate: e.target.value })}
                placeholder="Number Plate"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="number"
                value={vehicle.seats}
                onChange={(e) => setVehicle({ ...vehicle, seats: e.target.value })}
                placeholder="Seats"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={onChangeHandler}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={() => document.getElementById("edit-profile-modal").close()}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={updateUserHandler}
            disabled={updateUserIsLoading}
          >
            {updateUserIsLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </dialog>
    </div>
  );
};

export default Profile;