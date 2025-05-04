import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  rideId: null,
  rideType: null,
  status: "searching",
  captainDetails: null,
};

const rideSlice = createSlice({
  name: "ride",
  initialState,
  reducers: {
    setRideDetails: (state, action) => {
      state.rideId = action.payload.rideId;
      state.rideType = action.payload.rideType;
      state.status = action.payload.status || "searching";
    },
    setCaptainDetails: (state, action) => {
        console.log("setCaptainDetails payload:", action.payload); // Debugging log
        state.captainDetails = action.payload; // Update captain details
        state.status = "accepted"; // Update the status to "accepted"
      },
    clearRide: (state) => {
      state.rideId = null;
      state.rideType = null;
      state.status = "searching";
      state.captainDetails = null;
    },
  },
});

export const { setRideDetails, setCaptainDetails, clearRide } = rideSlice.actions;
export default rideSlice.reducer;
