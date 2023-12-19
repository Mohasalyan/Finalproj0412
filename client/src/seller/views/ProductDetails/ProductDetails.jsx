import Loading from "@components/common/Loading/Loading";
import { Paper } from "@mui/material";
import CreateProductFrom from "@seller/components/Home/CreateProductFrom/CreateProductFrom";
import {
  useGetCategoriesQuery,
  useGetProductQuery,
} from "@store/Products/productsApiSlice";
import { setProduct, setSellerCategory } from "@store/seller/sellerSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "../CreateProduct/style.scss";

function ProductDetails() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);
  const { productDetails } = useSelector((state) => state.seller.products);
  // Get Product
  const {
    data: productData,
    isLoading: productLoading,
    isSuccess: productSuccess,
    isError: productIsError,
    error: productError,
    refetch,
  } = useGetProductQuery({ token, params: { productId: id } });

  useEffect(() => {
    refetch();
  }, []);

  const {
    data: categoriesData,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useGetCategoriesQuery(token);

  useEffect(() => {
    if (isError) {
      toast.error(error.data);
    }
    if (isSuccess) {
      dispatch(setSellerCategory(categoriesData));
    }
    if (productData || productSuccess) {
      dispatch(setProduct(productData));
    }
  }, [isError, isSuccess, productData, productSuccess]);

  return productLoading ? (
    <Loading />
  ) : (
    <div className="updateProduct page-h">
      <div className="container">
        <Paper sx={{ py: 4 }}>
          {productLoading && !productDetails ? (
            <Loading />
          ) : (
            <CreateProductFrom
              productData={productData}
              productSuccess={productSuccess}
            />
          )}
        </Paper>
      </div>
    </div>
  );
}

export default ProductDetails;
