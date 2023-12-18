import { createSlice } from "@reduxjs/toolkit";
// Attempt to retrieve user and token from localStorage

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chatDetails: null,
    myChats: null,
    newMsgs: 0,
  },
  reducers: {
    setChat: (state, { payload }) => {
      state.chatDetails = payload;
    },
    setMyChats: (state, { payload }) => {
      state.myChats = payload;
      const newMsgs = state.myChats?.filter((item) => item.isNewMsg === true);
      state.newMsgs = newMsgs.length;
    },
    setChatMessage: (state, { payload }) => {
      state.chatDetails?.messages?.push(payload);
    },
  },
});

export const { setChat, setChatMessage, setMyChats } = chatSlice.actions;
export default chatSlice.reducer;
