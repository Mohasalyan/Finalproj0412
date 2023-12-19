import React, { useEffect, useState, useTransition } from "react";
import { Box, Button, Stack } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setMyProducts } from "@store/seller/sellerSlice";
import Loading from "@components/common/Loading/Loading";
import UniTable from "@seller/components/Common/UniversalTable/UniTable";
import {
  useDeleteProductMutation,
  useGetMyProductsQuery,
  useUpdateProductMutation,
} from "@store/Products/productsApiSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token } = useSelector((state) => state.auth);
  const { allProducts } = useSelector((state) => state.seller.products);
  const headers = [
    { id: "_id", label: "ID" },
    { id: "name", label: "name" },
    { id: "status", label: "status" },
    { id: "image", label: "image" },
    { id: "price", label: "price" },
    { id: "color", label: "color" },
    { id: "category", label: "category" },
    { id: "productActions", label: "" },
  ];
  const [
    deleteProduct,
    {
      isError: deleteIsError,
      error: deleteError,
      isLoading: deleteIsLoading,
      isSuccess: deleteIsSuccess,
    },
  ] = useDeleteProductMutation();
  const [
    updateProduct,
    {
      isError: updateIsError,
      error: updateError,
      isLoading: updateIsLoading,
      isSuccess: updateIsSuccess,
    },
  ] = useUpdateProductMutation();

  const cancelHandler = (item) => {};

  const {
    data: productsData,
    isLoading,
    isError,
    error,
    isSuccess,
    refetch,
  } = useGetMyProductsQuery(token);
  useEffect(() => {
    if (isSuccess || productsData) {
      dispatch(setMyProducts(productsData));
    }
  }, [isSuccess, productsData]);

  const updateProductStatus = async (item) => {
    const product = await updateProduct({
      token,
      params: { id: item?._id },
      data: { status: "used" },
    }).unwrap();
    if (product) {
      toast.success("Updated!");
      refetch();
    }
  };
  const deleteProductHandler = async (item) => {
    const userData = await deleteProduct({
      token,
      params: { id: item?._id },
    }).unwrap();
  };

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (deleteIsSuccess) {
      toast.success("Deleted!");
      refetch();
    }
  }, [updateIsSuccess, deleteIsSuccess]);

  return isLoading ? (
    <Loading />
  ) : (
    <div className="reservations page-h">
      <div className="container">
        <Box component="div" sx={{ mt: 4 }}>
          <div className="flex-center">
            <Button variant="contained" sx={{ width: "fit-content" }}>
              <Link to="/seller/products/create-product">Create Product </Link>
            </Button>
          </div>
          <UniTable
            headers={headers}
            data={allProducts || []}
            actionHandler={cancelHandler}
            title={"Products"}
            noDataMsg={"No Products Yet"}
            clickHandler={(id) => navigate(`/seller/products/${id}`)}
            confirmActionHandler={updateProductStatus}
            rejectActionHandler={deleteProductHandler}
          />
        </Box>
      </div>
    </div>
  );
}

export default Home;
