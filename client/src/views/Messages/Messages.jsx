import { Avatar, Typography } from "@mui/material";
import { API_URL } from "@src/constants";
import { useGetMyChatsQuery } from "@store/chat/chatApiSlice";
import { setMyChats } from "@store/chat/chatSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "./Messages.scss";
import { Link } from "react-router-dom";
import Loading from "@components/common/Loading/Loading";
import NoDataMsg from "@components/common/NoDataMsg/NoDataMsg";

function Messages() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const { myChats } = useSelector((state) => state.chat);
  const {
    data: chatsData,
    isLoading,
    isError,
    error,
    isSuccess,
    refetch,
  } = useGetMyChatsQuery(token);
  useEffect(() => {
    if (isSuccess || chatsData) {
      dispatch(setMyChats(chatsData));
    }
    if (isError) {
      toast.error(error);
    }
  }, [isError, isSuccess, chatsData]);
  useEffect(() => {
    refetch();
  }, []);

  return isLoading ? (
    <Loading />
  ) : myChats?.length < 1 ? (
    <div className="page-h">
      <NoDataMsg msg="No Chat Rooms yet" />
    </div>
  ) : (
    <div className="messages page-h">
      <div className="container">
        {myChats?.map((item) => {
          const sender = item.participants.find((p) => p._id !== user._id);
          const lastMsg = item.messages.at(-1);
          return (
            <Link
              to={`/chat/${item?.product?._id}`}
              key={item._id}
              className="messages-msg flex-items-center gap-1">
              <div className="flex-items-center gap-1">
                <div className="messages-msg-userImg">
                  <Avatar src={`${API_URL}/${sender.photo}`} />
                </div>
                <div className="messages-msg-info">
                  <div className="messages-msg-info-username">
                    {sender.username}
                    {item.isNewMsg && <span className="newMsg"></span>}
                  </div>
                  <div className="messages-msg-info-msgContent">
                    {lastMsg?.text}
                  </div>
                </div>
              </div>
              <Typography sx={{fontSize:12}} className="messages-msg-product">
                <Typography sx={{fontSize:8,fontWeight:600}}>Product:</Typography>
                {item?.product?.name}
              </Typography>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Messages;
