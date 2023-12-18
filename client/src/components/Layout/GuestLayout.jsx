import { Outlet, useLocation } from "react-router-dom";
import {
  Box,
  Grid,
  Stack,
  useMediaQuery,
  useTheme,
  Paper,
} from "@mui/material";
import "./Layout.scss";
import { useEffect, useState } from "react";

import { styled } from "@mui/material/styles";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import useNotificationSocket from "@src/hooks/notificationSocket";
import useWelcomeSocket from "@src/hooks/welcomeSocket";
import { io } from "socket.io-client";
import { API_URL } from "@src/constants";
import { useDispatch, useSelector } from "react-redux";
import {
  setMyNotifications,
  setNotification,
} from "@store/notifications/notificationsSlice";
import { Zoom, toast } from "react-toastify";
import { useGetMyNotificationsQuery } from "@store/notifications/notificationsApiSlice";
import { useGetMyChatsQuery } from "@store/chat/chatApiSlice";
import { setMyChats } from "@store/chat/chatSlice";

function GuestLayout() {
  const dispatch = useDispatch();
  const location = useLocation();

  const { token } = useSelector((state) => state.auth);
  const { notification } = useSelector((state) => state.notifications);

  const isLargeScreen = useMediaQuery("(min-width: 992px)");
  const shouldShowBorder = location.pathname !== "/"; // Check if the current route is not the home page

  const [openSidebar, setOpenSidebar] = useState(false);

  useEffect(() => {
    if (isLargeScreen) {
      setOpenSidebar(false);
    }
  }, [isLargeScreen]);

  return (
    <div className="app">
      <main className="app-main">
        <Grid container>
          <Grid
            sx={{
              flex: 1,
              width: isLargeScreen ? "80%" : "100%",
              height: "100%",
            }}>
            <Stack sx={{ color: "#3D434A" }}>
              <Navbar />
              {shouldShowBorder && ( // Conditionally render the Box component
                <Box
                  sx={{
                    border: "1px solid #eee",
                    marginX: 10,
                    borderRadius: 10,
                  }}>
                  <Outlet />
                </Box>
              )}
              {!shouldShowBorder && <Outlet />}
              <Box marginTop={10}>
                <Footer />
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </main>
    </div>
  );
}

export default GuestLayout;
