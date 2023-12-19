/* eslint-disable consistent-return */

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import useSocket from "../components/common/socketConfig";
import { toast } from "react-toastify";
import {
  setAddNotification,
  setNotification,
} from "@store/notifications/notificationsSlice";
import { API_URL } from "@src/constants";
import { setNewMessage } from "@store/chat/chatSlice";

const useNotificationSocket = () => {
  const { socket, error } = useSocket({
    serverUrl: `${API_URL}/clients`,
    path: "/ws",
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error("Socket connection error:", error);
      return;
    }

    const handleNotification = (data) => {
      dispatch(setNotification(data));
      dispatch(setAddNotification(data));
      if (data.type === "message") {
        dispatch(setNewMessage(data));
      }
    };
    const handleWelcome = (data) => {
      dispatch(setNotification({ body: data }));
      dispatch(setAddNotification({ body: data }));
    };

    if (socket) {
      socket.on("notification", handleNotification);
      socket.on("welcome", handleWelcome);
    }

    return () => {
      if (socket) {
        socket.off("notification", handleNotification);
        socket.off("welcome", handleWelcome);
      }
    };
  }, [socket, error, dispatch]);

  return socket;
};

export default useNotificationSocket;
