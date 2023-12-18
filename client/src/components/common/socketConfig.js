// hooks/useSocket.js
/* eslint-disable import/no-extraneous-dependencies */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import io from "socket.io-client";

const useSocket = ({ serverUrl, path }) => {
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    if (user) {
      const newSocket = io(serverUrl, {
        path,
        auth: {
          userId:user?._id,
        },
      });
  
      newSocket.on("connect_error", (err) => {
        setError(err.message);
        toast.error(err.message)
      });
  
      newSocket.on("connect", () => {
        setError(null);
      });
  
      setSocket(newSocket);
  
      return () => {
        newSocket.disconnect();
      };
    }
  }, [serverUrl, path]);

  return { socket, error };
};

export default useSocket;
