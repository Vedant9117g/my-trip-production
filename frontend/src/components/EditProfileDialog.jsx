import React from "react";

const EditProfileDialog = ({
  name,
  setName,
  phone,
  setPhone,
  role,
  setRole,
  vehicle,
  setVehicle,
  profilePhoto,
  onChangeHandler,
  updateUserHandler,
  updateUserIsLoading,
}) => {
  return (
    <dialog
      id="edit-profile-modal"
      className="rounded-lg p-6 bg-white dark:bg-gray-800 shadow-lg"
    >
      <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
        Edit Profile
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateUserHandler();
        }}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Phone
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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
              onChange={(e) =>
                setVehicle({ ...vehicle, vehicleType: e.target.value })
              }
              placeholder="Vehicle Type"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <input
              type="text"
              value={vehicle.model}
              onChange={(e) =>
                setVehicle({ ...vehicle, model: e.target.value })
              }
              placeholder="Model"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <input
              type="text"
              value={vehicle.numberPlate}
              onChange={(e) =>
                setVehicle({ ...vehicle, numberPlate: e.target.value })
              }
              placeholder="Number Plate"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <input
              type="number"
              value={vehicle.seats}
              onChange={(e) =>
                setVehicle({ ...vehicle, seats: e.target.value })
              }
              placeholder="Seats"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
            onClick={() =>
              document.getElementById("edit-profile-modal").close()
            }
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
  );
};

export default EditProfileDialog;