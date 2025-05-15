
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  conversations: [], // List of conversations
  messages: {}, // Messages for each conversation
  activeChat: null, // Currently active chat user
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },
    addMessage: (state, action) => {
      const { receiverId, message } = action.payload;
      if (!state.messages[receiverId]) {
        state.messages[receiverId] = [];
      }
      state.messages[receiverId].push(message);
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
  },
});

export const { setActiveChat, addMessage ,setMessages } = conversationSlice.actions;
export default conversationSlice.reducer;
