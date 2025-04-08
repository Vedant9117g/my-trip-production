import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import { authApi } from "@/features/api/authApi";
import { mapApi } from "@/features/api/mapApi"; // Import mapApi

const rootRedcuer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [mapApi.reducerPath]: mapApi.reducer, // Add mapApi reducer
  auth: authReducer,
});

export default rootRedcuer;