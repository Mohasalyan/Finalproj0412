import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import sellerSlice from "./seller/sellerSlice";
import authSlice from "./auth/authSlice";
import usersSlice from "./users/usersSlice";
import settingsSlice from "./settings/settingsSlice";
import notificationsSlice from "./notifications/notificationsSlice";
import chatSlice from "./chat/chatSlice";
import productSlice from "./Products/productSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    seller: sellerSlice,
    auth: authSlice,
    users: usersSlice,
    products: productSlice,
    settings: settingsSlice,
    notifications: notificationsSlice,
    chat: chatSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
