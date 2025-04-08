import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const MAP_API = "http://localhost:5000/api/maps/";

export const mapApi = createApi({
  reducerPath: "mapApi",
  baseQuery: fetchBaseQuery({
    baseUrl: MAP_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getCoordinates: builder.query({
      query: (address) => ({
        url: "coordinates",
        method: "GET",
        params: { address },
      }),
    }),
    getDistanceAndTime: builder.query({
      query: ({ origin, destination }) => ({
        url: "distance-time",
        method: "GET",
        params: { origin, destination },
      }),
    }),
    getSuggestions: builder.query({
      query: (input) => ({
        url: "suggestions",
        method: "GET",
        params: { input },
      }),
    }),
  }),
});

export const {
  useGetCoordinatesQuery,
  useGetDistanceAndTimeQuery,
  useGetSuggestionsQuery, // Use this for lazy queries
} = mapApi;