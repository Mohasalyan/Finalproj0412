import Loading from "@components/common/Loading/Loading";
import { Avatar, Box, Button, Rating, Stack, Typography } from "@mui/material";
import { API_URL } from "@src/constants";
import { setProduct } from "@store/Products/productSlice";
import {
  useGetProductQuery,
  useSendMatchReqMutation,
} from "@store/Products/productsApiSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "./Product.scss";
import { red } from "@mui/material/colors";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Chat, Reviews, Star } from "@mui/icons-material";
import BasicModal from "./ReviewModal";

function Product() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();
  const { token, user } = useSelector((state) => state.auth);
  const { productDetails } = useSelector((state) => state.products);
  const [openRatingModal, setOpenRatingModal] = useState(false);
  const {
    data: productData,
    isLoading,
    isError,
    error,
    isSuccess,
    refetch,
  } = useGetProductQuery({
    params: { productId: id, userId: user?._id },
  });

  const [
    sendMatchReq,
    {
      isError: isErrorSendMatchReq,
      error: errorSendMatchReq,
      isLoading: isLoadingSendMatchReq,
      isSuccess: isSuccessSendMatchReq,
    },
  ] = useSendMatchReqMutation();

  const sendMatchReqHandler = async () => {
    await sendMatchReq({ productId: id, token }).unwrap();
  };

  // Product loading and error process
  useEffect(() => {
    refetch();
  }, []);
  useEffect(() => {
    if (isSuccess || productData) {
      dispatch(setProduct(productData));
    }
    if (isError) {
      toast.error(error.data);
    }
    if (isErrorSendMatchReq) {
      toast.error(errorSendMatchReq.data);
    }
    if (isSuccessSendMatchReq) {
      toast.success("Match req sent successfully");
    }
  }, [
    isSuccess,
    isError,
    isSuccessSendMatchReq,
    isErrorSendMatchReq,
    productData,
  ]);

  return isLoading ? (
    <Loading />
  ) : (
    <div className="product">
      <div className="container top">
        <div className="product-img">
          <img src={`${API_URL}/${productDetails?.image}`} alt="" />
        </div>
        <div className="product-info">
          <Stack>
            <Typography className="product-info-name">
              {productDetails?.name}
            </Typography>
          </Stack>
          <Stack direction={"row"} spacing={2}>
            <div className="product-info-price">${productDetails?.price}</div>
          </Stack>
          <div className="product-info-details">
            <div className="product-info-details-item">
              <div className="product-info-details-item-title">category</div>
              {productDetails?.category?.name}
            </div>
            {productDetails?.type && (
              <div className="product-info-details-item">
                <div className="product-info-details-item-title">type</div>
                {productDetails?.type}
              </div>
            )}
            {productDetails?.status && (
              <div className="product-info-details-item">
                <div className="product-info-details-item-title">status</div>
                {productDetails?.status}
              </div>
            )}
            {productDetails?.color && (
              <div className="product-info-details-item">
                <div className="product-info-details-item-title">color</div>
                <Box
                  sx={{
                    background: productDetails?.color,
                    width: "20px",
                    height: "20px",
                    borderRadius: 50,
                  }}
                />
              </div>
            )}
          </div>
          <div className="product-info-btns">
            {productDetails?.status !== "used" && token ? (
              <>
                {productDetails?.isChatEnabled ? (
                  <Stack direction="row" spacing={4}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => navigate(`/chat/${productDetails?._id}`)}
                      startIcon={<Chat />}>
                      Chat
                    </Button>
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => setOpenRatingModal(true)}
                      startIcon={<Star />}>
                      Review Seller
                    </Button>
                  </Stack>
                ) : (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => sendMatchReqHandler()}>
                    send match request
                  </Button>
                )}
              </>
            ) : (
              <div className="flex-items-center gap-2">
                <Button variant="outlined" size="small" disabled>
                  send match request
                </Button>
                {productDetails?.status === "new" && (
                  <Typography
                    sx={{ fontSize: 12, fontWeight: 600, color: red[700] }}
                    className="flex-items-center">
                    <WarningAmberIcon sx={{ fontSize: 12, mr: 2 }} />
                    login to send a match request
                  </Typography>
                )}
              </div>
            )}
          </div>
          <Stack className="product-info-seller" sx={{ mt: 5 }}>
            <Link to={`/users/${productDetails?.user?._id}`}>
              <Typography sx={{ fontSize: 12, mb: 2 }}>Seller</Typography>
              <div className="flex-items-center gap-1">
                <div>
                  <Avatar src={`${API_URL}/${productDetails?.user.photo}`} />
                </div>
                <div>
                  <Typography
                    sx={{ fontSize: 12 }}
                    className="product-info-seller-name">
                    {productDetails?.user.fullName}
                  </Typography>
                  <Rating
                    name="read-only"
                    value={productDetails?.user?.sellerRating || 0}
                    readOnly
                    size="small"
                  />
                </div>
              </div>
            </Link>
          </Stack>
        </div>
      </div>
      <Stack sx={{ my: 10 }} className="product-tips">
        <div className="container">
          <Typography sx={{ fontSize: 12, fontWeight: 600 }}> Tips </Typography>
          <div dangerouslySetInnerHTML={{ __html: productDetails?.tips }} />
        </div>
      </Stack>
      <BasicModal
        open={openRatingModal}
        setOpen={setOpenRatingModal}
        seller={productDetails?.user}
        refetch={refetch}
      />
    </div>
  );
}

export default Product;
