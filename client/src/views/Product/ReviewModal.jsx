import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Avatar, Rating, Stack, TextField } from "@mui/material";
import { API_URL } from "@src/constants";
import { useReviewSellerMutation } from "@store/users/usersApiSlice";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function BasicModal({ open, setOpen, seller, refetch }) {
  const { token } = useSelector((state) => state.auth);
  const [sellerRating, setSellerRating] = useState(1);
  const [comment, setComment] = useState("");
  const [reviewSeller, { isError, error, isLoading, isSuccess }] =
    useReviewSellerMutation();
  const handleConfirm = async () => {
    const data = { rating: sellerRating, comment, sellerId: seller._id };
    const userData = await reviewSeller({ data, token }).unwrap();
  };
  const handleClose = () => setOpen(false);
  useEffect(() => {
    if (isSuccess) {
      toast.success("Review Added Successfully");
      setOpen(false);
      refetch();
    }
    if (isError) {
      toast.error(error);
    }
  }, [isSuccess, isError]);

  return (
    <div>
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Typography sx={{ fontSize: 12, mb: 2 }}> Seller </Typography>
          <Stack
            direction={"row"}
            className="flex-items-center"
            spacing={2}
            mb={2}>
            <Avatar src={`${API_URL}/${seller?.photo}`} />
            <div> {seller?.fullName} </div>
          </Stack>

          <Typography sx={{ fontSize: 12, mt: 4 }}> Rating </Typography>
          <Rating
            name="simple-controlled"
            value={sellerRating}
            onChange={(event, newValue) => {
              setSellerRating(newValue);
            }}
          />

          <TextField
            label="Comment"
            variant="filled"
            color="success"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            fullWidth
            focused
            sx={{ my: 4 }}
          />

          <Stack>
            <Button
              onClick={handleConfirm}
              disabled={!comment || !sellerRating}>
              Confirm
            </Button>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}
