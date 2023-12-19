import React, { useState, useEffect, useRef } from "react";
import SendIcon from "@mui/icons-material/Send";
import { Avatar, Box, Button, Grid, Stack, Typography } from "@mui/material";
import "./Chat.scss";
import useChatSocket from "@src/hooks/messagesSocket";
import {
  useGetChatQuery,
  useSendMessageMutation,
  useSendNewMessageMutation,
} from "@store/chat/chatApiSlice";
import { setChat } from "@store/chat/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import NoDataMsg from "@components/common/NoDataMsg/NoDataMsg";
import { API_URL } from "@src/constants";
import dayjs from "dayjs";
import Loading from "@components/common/Loading/Loading";

function Chat() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const lastMessageRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { token, user } = useSelector((state) => state.auth);
  const { chatDetails } = useSelector((state) => state.chat);
  const {
    data: chatData,
    isLoading,
    isError,
    error,
    isSuccess,
    refetch,
  } = useGetChatQuery({ token, productId: id });
  const [
    sendNewMessage,
    {
      isError: isErrorSendMsg,
      error: errorSendMsg,
      isLoading: isLoadingSendMsg,
      isSuccess: isSuccessSendMsg,
    },
  ] = useSendNewMessageMutation();
  const socket = useChatSocket();
  const otherParticipant = chatDetails?.participants?.find(
    (item) => item._id !== user._id
  );
  useEffect(() => {
    socket?.on("newMessage", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket?.off("newMessage");
    };
  }, [socket]);

  const scrollToBottom = () => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };
  const sendMessageHandler = async () => {
    await socket.emit("sendMessage", {
      chatId: chatDetails?._id,
      text: newMessage,
    });
    await sendNewMessage({
      text: newMessage,
      chatId: chatDetails?._id,
      token,
    }).unwrap();

    setNewMessage("");

    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessageHandler();
    }
  };
  useEffect(() => {
    if (chatData) {
      dispatch(setChat(chatData));
    }
  }, [chatData]);
  useEffect(() => {
    scrollToBottom();
  }, [chatDetails]);
  useEffect(() => {
    refetch();
  }, []);
  return isLoading ? (
    <Loading />
  ) : (
    <Grid container className="chat page-h" spacing={4}>
      <Grid item xs={12} md={4}>
        <Stack>
          <img
            src={`${API_URL}/${chatDetails?.product?.image}`}
            alt="product"
            style={{
              borderRadius: 20,
              margin: "10px",
              borderTopLeftRadius: 35,
            }}
          />
        </Stack>
        <Box component={"div"} sx={{ py: 2, px: 2 }}>
          <Typography
            sx={{
              fontWeight: 600,
            }}>
            {chatDetails?.product?.name}
          </Typography>
          <Stack direction="row" spacing={2} mt={2}>
            <Typography sx={{ fontWeight: 600, fontSize: 12 }}>
              Price:
            </Typography>
            <Typography sx={{ fontSize: 12 }}>
              ${chatDetails?.product?.price}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2} mt={2}>
            <Typography sx={{ fontWeight: 600, fontSize: 12 }}>
              Status:
            </Typography>
            <Typography sx={{ fontSize: 12 }}>
              {chatDetails?.product?.status}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2} mt={2}>
            <Typography sx={{ fontWeight: 600, fontSize: 12 }}>
              Type:
            </Typography>
            <Typography sx={{ fontSize: 12 }}>
              {chatDetails?.product?.option}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            mt={2}
            className="flex-items-center">
            <Typography sx={{ fontWeight: 600, fontSize: 12 }}>
              Color:
            </Typography>
            <Box
              sx={{
                background: chatDetails?.product?.color,
                width: "10px",
                height: "10px",
                borderRadius: 50,
              }}
            />
          </Stack>
          <Button variant="outlined" sx={{ mt: 10 }} fullWidth>
            <Link to={`/seller/products/${chatDetails?.product?._id}`}>
              More Details
            </Link>
          </Button>
        </Box>
      </Grid>
      <Grid item xs={12} md={8}>
        <div className="chat-productInfo">
          <div className="container">
            {/* <Stack
              direction="row"
              sx={{
                border: "1px solid #000",
                p: "10px 20px",
                mb: 4,
                borderRadius: 20,
                mx: "auto",
              }}>
              This Chat is related to product
              <Typography
                className="link underline"
                sx={{ ml: 2, fontWeight: 600, cursor: "pointer" }}>
                <Link
                  to={
                    user.role === "seller"
                      ? `/seller/products/${chatDetails?.product?._id}`
                      : `/products/${chatDetails?.product?._id}`
                  }>
                  {chatDetails?.product?.name}
                </Link>
              </Typography>
            </Stack> */}
          </div>
          <div className="container">
            <div className="chat-productInfo-img">
              <Avatar src={`${API_URL}/${otherParticipant?.photo}`} />
            </div>
            <Stack>
              <div className="chat-productInfo-name">
                {otherParticipant?.fullName}
              </div>
              <Typography sx={{ fontSize: 10 }}>
                {otherParticipant?.role}
              </Typography>
            </Stack>
          </div>
        </div>
        <div className="container">
          <div className="chat-messages">
            {chatDetails?.messages.length < 1 ? (
              <NoDataMsg msg={"No messages yet!"} />
            ) : (
              chatDetails?.messages?.map((message, index) => (
                <div
                  key={message._id}
                  ref={
                    index === chatDetails.messages.length - 1
                      ? lastMessageRef
                      : null
                  }
                  className={`chat-messages-message ${
                    message.sender === user?._id
                      ? "myMessage"
                      : "message-received"
                  }`}>
                  <div className="chat-messages-message-text">
                    {message.text}
                  </div>
                  <Typography sx={{ fontSize: 10, color: "GrayText" }}>
                    {dayjs(message.timestamp).fromNow()}
                  </Typography>
                </div>
              ))
            )}
          </div>
          <div className="chat-controls">
            <div className="chat-controls-input">
              <input
                type="text"
                className="form-control"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <div className="chat-controls-send">
              <Button
                variant="text"
                endIcon={<SendIcon />}
                onClick={sendMessageHandler}>
                Send
              </Button>
            </div>
          </div>
        </div>
      </Grid>
    </Grid>
  );
}

export default Chat;
