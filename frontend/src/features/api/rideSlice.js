import { createSlice } from "@reduxjs/toolkit";

// Helper function to save state to localStorage
const saveToLocalStorage = (state) => {
  localStorage.setItem("rideState", JSON.stringify(state));
};

// Helper function to load state from localStorage
const loadFromLocalStorage = () => {
  const savedState = localStorage.getItem("rideState");
  return savedState ? JSON.parse(savedState) : null;
};

// Load initial state from localStorage or use default values
const initialState = loadFromLocalStorage() || {
  rideId: null,
  rideType: null,
  status: "searching",
  rideDetails: null, // Store the full ride details here
};

const rideSlice = createSlice({
  name: "ride",
  initialState,
  reducers: {
    setRideDetails: (state, action) => {
      state.rideId = action.payload.rideId; // Set rideId from payload
      state.rideType = action.payload.rideType; // Set rideType from payload
      state.status = action.payload.status || "searching"; // Set status
      state.rideDetails = action.payload; // Store the full ride details
      console.log("setRideDetails payload:", action.payload); // Debugging log
      saveToLocalStorage(state); // Save updated state to localStorage
    },
    clearRide: (state) => {
      state.rideId = null;
      state.rideType = null;
      state.status = "searching";
      state.rideDetails = null; // Clear the full ride details
      saveToLocalStorage(state); // Clear state in localStorage
    },
  },
});

export const { setRideDetails, clearRide } = rideSlice.actions;
export default rideSlice.reducer;