import { createSlice } from "@reduxjs/toolkit";

//slices
const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    pageTitle: {
      title: "",
      breadcrumbs: [],
    },
  },
  reducers: {
    reset: (state) => {},
    setPageTitle: (state, { payload }) => {
      state.pageTitle = payload;
    },
  },
});

export const { reset, setSelectedUser, setPageTitle } = settingsSlice.actions;

export default settingsSlice.reducer;
