/* eslint-disable consistent-return */

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import useSocket from "../components/common/socketConfig";

import { toast } from "react-toastify";
import { setNotification } from "@store/notifications/notificationsSlice";
import { API_URL } from "@src/constants";

const useWelcomeSocket = () => {
  const { socket, error } = useSocket({
    serverUrl: `http://localhost:5000/clients`,
    path: "/ws",
  });
  const dispatch = useDispatch();
  const user = localStorage.getItem("user");
  useEffect(() => {
    if (user) {
      if (error) {
        toast.error(error);
        return;
      }

      const handleWelcome = (data) => {
        dispatch(setNotification({ body: data }));
      };

      if (socket) {
        socket.on("welcome", handleWelcome);
      }

      return () => {
        if (socket) {
          socket.off("welcome", handleWelcome);
        }
      };
    }
  }, [socket, error, dispatch]);

  return socket;
};

export default useWelcomeSocket;
