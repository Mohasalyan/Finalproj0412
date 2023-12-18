import { createSlice } from "@reduxjs/toolkit";
// Attempt to retrieve user and token from localStorage

const userSlice = createSlice({
  name: "user",
  initialState: {
    profile: null,
    userDetails: null,
    myNotifications: null,
    topRatedUsers: null,
    mostRequested: null,
  },
  reducers: {
    setProfile: (state, { payload }) => {
      state.profile = payload;
    },
    setTopRated: (state, { payload }) => {
      state.topRatedUsers = payload;
    },
    setMostRequested: (state, { payload }) => {
      state.mostRequested = payload;
    },
    setUserDetails: (state, { payload }) => {
      state.userDetails = payload;
    },
  },
});

export const { setProfile, setTopRated, setMostRequested, setUserDetails } =
  userSlice.actions;
export default userSlice.reducer;
