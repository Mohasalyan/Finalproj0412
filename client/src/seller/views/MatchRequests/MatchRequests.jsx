import React, { useEffect, useState, useTransition } from "react";
import { Box, Button, Stack } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  setMatchRequests,
  setMyProducts,
  setUpdateMatchRequests,
} from "@store/seller/sellerSlice";
import Loading from "@components/common/Loading/Loading";
import UniTable from "@seller/components/Common/UniversalTable/UniTable";
import {
  useGetMyMatchRequestsQuery,
  useGetMyProductsQuery,
  useHandleMatchRequestMutation,
} from "@store/Products/productsApiSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function MatchRequests() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token } = useSelector((state) => state.auth);
  const { allMatchRequests } = useSelector(
    (state) => state.seller.matchRequests
  );
  const headers = [
    { id: "productName", label: "Product" },
    { id: "sender", label: "Sender" },
    { id: "status", label: "Status" },
    { id: "mqActions", label: "Action" },
    { id: "chatBtn", label: "" },
  ];
  const [
    handleMatchRequest,
    {
      isError: mrIsError,
      error: mrError,
      isLoading: mrIsLoading,
      isSuccess: mrIsSuccess,
    },
  ] = useHandleMatchRequestMutation();

  const rejectHandler = async (item) => {
    const action = { action: "reject" };
    const params = {
      requestId: item._id,
      productId: item.productId,
    };
    const mrData = await handleMatchRequest({ action, params, token }).unwrap();
    dispatch(setUpdateMatchRequests(mrData));
  };
  const confirmHandler = async (item) => {
    const action = { action: "accept" };
    const params = {
      requestId: item._id,
      productId: item.productId,
    };
    const mrData = await handleMatchRequest({ action, params, token }).unwrap();
    dispatch(setUpdateMatchRequests(mrData));
  };

  const { data, isLoading, isError, error, isSuccess, refetch } =
    useGetMyMatchRequestsQuery(token);
  useEffect(() => {
    if (mrIsSuccess) {
      toast.success("Updated!");
    }
    if (mrIsError) {
      toast.error(mrError.data);
    }
    if (isSuccess || data) {
      dispatch(setMatchRequests(data));
    }
  }, [isSuccess, data, mrIsSuccess, mrIsError]);

  useEffect(() => {
    refetch();
  }, []);

  return isLoading ? (
    <Loading />
  ) : (
    <div className="reservations page-h">
      <div className="container">
        <Box component="div" sx={{ mt: 4 }}>
          <UniTable
            headers={headers}
            data={allMatchRequests || []}
            rejectActionHandler={rejectHandler}
            confirmActionHandler={confirmHandler}
            title={"Match Requests"}
            noDataMsg={"No Match Requests Yet"}
            // clickHandler={(id) => navigate(`/seller/products/${id}`)}
          />
        </Box>
      </div>
    </div>
  );
}

export default MatchRequests;
