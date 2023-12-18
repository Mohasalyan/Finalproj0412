import { createSlice } from "@reduxjs/toolkit";

//slices
const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    myNotifications: null,
    allNotifications: null,
    notification: null,
  },
  reducers: {
    reset: (state) => {},
    setMyNotifications: (state, { payload }) => {
      state.myNotifications = payload;
    },
    setNotifications: (state, { payload }) => {
      state.allNotifications = payload;
    },
    setNotification: (state, { payload }) => {
      state.notification = payload;
    },
    setAddNotification: (state, { payload }) => {
      const existingNotification = state.myNotifications?.find(
        (item) => item._id === payload._id
      );
      if (existingNotification) {
        if (payload.seen) {
          const filteredNotification = state.myNotifications?.filter(
            (item) => item._id !== payload._id
          );
          state.myNotifications = filteredNotification;
        }
      } else {
        state.myNotifications.unshift(payload);
      }
    },
  },
});

export const {
  reset,
  setNotifications,
  setNotification,
  setMyNotifications,
  setAddNotification,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
