import { createSlice } from "@reduxjs/toolkit";
// Attempt to retrieve user and token from localStorage

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chatDetails: null,
    myChats: null,
    newMsgs: 0,
    newMsg: false,
  },
  reducers: {
    resetNewMsg: (state, { payload }) => {
      state.newMsg = false;
    },
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
    setNewMessage: (state, { payload }) => {
      state.newMsg = true;
    },
  },
});

export const { resetNewMsg, setChat, setChatMessage, setMyChats, setNewMessage } =
  chatSlice.actions;
export default chatSlice.reducer;
