import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import useSocket from '../components/common/socketConfig';
import { API_URL } from '@src/constants';
import { setChatMessage } from '@store/chat/chatSlice';

const useChatSocket = () => {
  const { socket, error } = useSocket({
    serverUrl: `${API_URL}/clients`,
    path: '/ws',
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error('Socket connection error:', error);
      return;
    }

    const handleNewMessage = (data) => {
      // Assuming that your Redux store has a slice for chat messages
      dispatch(setChatMessage(data));
      
    };

    if (socket) {
      // Replace 'newMessage' with the event name used on the server
      socket.on('newMessage', handleNewMessage);
    }

    return () => {
      if (socket) {
        socket.off('newMessage', handleNewMessage);
      }
    };
  }, [socket, error, dispatch]);

  return socket;
};

export default useChatSocket;
