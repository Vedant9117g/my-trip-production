import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import { authApi } from "@/features/api/authApi";
import { mapApi } from "@/features/api/mapApi"; // Import mapApi
import rideReducer from "@/features/api/rideSlice"; // Import rideSlice
import { conversationApi } from "@/features/api/conversationApi"; // Import conversationApi
import conversationReducer from "../features/conversationSlice"; 
import socketReducer from "../features/socketSlice"; 

const rootRedcuer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [mapApi.reducerPath]: mapApi.reducer, // Add mapApi reducer
  [conversationApi.reducerPath]: conversationApi.reducer,

  auth: authReducer,
  ride: rideReducer,
  conversation: conversationReducer,
  socket: socketReducer, // Add socketReducer
});

export default rootRedcuer;

