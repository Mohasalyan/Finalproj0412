import SellerProducts from "@components/User/SellerProducts";
import SellerReviews from "@components/User/SellerReviews";
import Loading from "@components/common/Loading/Loading";
import {
  Avatar,
  Box,
  Chip,
  Divider,
  Grid,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import { API_URL } from "@src/constants";
import {
  setMostRequested,
  setSellerProducts,
} from "@store/Products/productSlice";
import {
  useGetMostRequestedProductsQuery,
  useGetProductsQuery,
} from "@store/Products/productsApiSlice";
import { useGetUserQuery } from "@store/users/usersApiSlice";
import { setUserDetails } from "@store/users/usersSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

function User() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { profile, userDetails: user } = useSelector((state) => state.users);
  const { sellerProducts } = useSelector((state) => state.products);

  // Get seller's products
  const { data: productsData, isSuccess: mostRequestIsSuccess } =
    useGetProductsQuery({ seller: id });
  // Get user details
  const {
    data: userDetails,
    isError,
    error,
    isSuccess,
    refetch,
  } = useGetUserQuery(id);

  // Get seller's products
  const { data: userData, isLoading } = useGetProductsQuery({ seller: id });

  useEffect(() => {
    if (mostRequestIsSuccess) {
      dispatch(setSellerProducts(productsData));
    }
    if (isSuccess) {
      dispatch(setUserDetails(userDetails));
    }
    if (isError) {
      toast.error(error);
    }
  }, [isSuccess, isError, mostRequestIsSuccess]);

  useEffect(() => {
    refetch();
  }, []);
  return isLoading ? (
    <Loading />
  ) : (
    <div className="user page-h">
      <Grid container>
        <Grid item xs={12} md={3} sx={{ borderRight: "1px solid #f5f5f5" }}>
          {isSuccess && (
            <>
              <Stack alignItems={"center"} spacing={2} p={4}>
                <Avatar src={`${API_URL}/${user?.photo}`} />
                <Typography> {user?.fullName} </Typography>
                <Typography sx={{ fontSize: 12, color: "#999" }}>
                  {user?.email}
                </Typography>
                <Chip
                  label={user?.role}
                  color="error"
                  sx={{ fontSize: 12, fontWeight: 600 }}
                />
              </Stack>
              <Divider />
              <Box sx={{ p: 3 }}>
                <div className="flex-items-center mb-2 gap-2">
                  <Typography sx={{ fontSize: 10, fontWeight: 600 }}>
                    Products
                  </Typography>

                  <Chip
                    label={sellerProducts?.length}
                    size="small"
                    sx={{ fontSize: 10, fontWeight: 600 }}
                  />
                </div>
                <div className="flex-items-center mb-2 gap-2">
                  <Typography sx={{ fontSize: 10, fontWeight: 600 }}>
                    Rating
                  </Typography>

                  <Rating
                    name="read-only"
                    value={userDetails?.sellerRating}
                    readOnly
                    size="small"
                  />
                </div>
              </Box>
            </>
          )}
        </Grid>
        <Grid item xs={12} md={9} sx={{ p: 3 }}>
          <Box>
            <Typography
              sx={{
                textTransform: "capitalize",
                fontSize: 12,
                fontWeight: 600,
              }}>
              seller products
            </Typography>
            <SellerProducts />
          </Box>
          <Box>
            <Typography
              sx={{
                textTransform: "capitalize",
                fontSize: 12,
                fontWeight: 600,
              }}>
              Reviews
            </Typography>
            <SellerReviews />
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

export default User;
