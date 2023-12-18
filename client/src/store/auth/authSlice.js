import { createSlice } from "@reduxjs/toolkit";
// Attempt to retrieve user and token from localStorage

const storedUser = tryParse(localStorage.getItem("user"));
const storedToken = tryParse(localStorage.getItem("token"));
function tryParse(data) {
  try {
    return JSON.parse(data);
  } catch (error) {
    return data;
  }
}
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser,
    token: storedToken,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      try {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", JSON.stringify(token));
      } catch (error) {
        console.error("Error storing data in localStorage:", error);
      }
      state.user = user;
      state.token = token;
    },
    logOut: (state, action) => {
      try {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } catch (error) {
        console.error("Error removing data from localStorage:", error);
      }
      state.user = null;
      state.token = null;
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
