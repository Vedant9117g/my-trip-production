import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const MESSAGE_API = "https://my-trip-production-1.onrender.com/api/messages/";

export const conversationApi = createApi({
  reducerPath: "conversationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: MESSAGE_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: ({ receiverId, message }) => ({
        url: `send/${receiverId}`,
        method: "POST",
        body: { message },
      }),
    }),
    getMessages: builder.query({
      query: (receiverId) => ({
        url: `${receiverId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useSendMessageMutation,
  useGetMessagesQuery,
} = conversationApi;
