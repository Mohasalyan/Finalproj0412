import { Avatar, Box, Grid, Rating, Stack, Typography } from "@mui/material";
import { API_URL } from "@src/constants";
import React from "react";
import { useSelector } from "react-redux";

function SellerReviews() {
  const { userDetails: user } = useSelector((state) => state.users);
  return (
    <Box component={"div"}>
      <Typography sx={{ fontSize: 12 }}> {user?.reviews?.length} Reviewed this seller </Typography>
      <Grid container sx={{ mt: 4,height:"240px",overflowY:"auto" }} spacing={2}>
        {user?.reviews?.map((item) => (
          <Grid key={item._id} item xs={12} sm={6}>
            <Box
              component={"div"}
              sx={{
                backgroundColor: "#f5f5f5",
                p: 2,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
                transition: ".3s ease",
                "&:hover": {
                  backgroundColor: "#eee",
                },
              }}>
              <Avatar src={`${API_URL}/${item?.user?.photo}`} />
              <Stack>
                <Typography sx={{ fontSize: 10, fontWeight: 700 }}>
                  {item.user.fullName}
                </Typography>
                <Rating
                  name="read-only"
                  value={item?.rating}
                  readOnly
                  size="small"
                  sx={{
                    "& .MuiSvgIcon-root ": {
                      width: 12,
                      height: 12,
                    },
                  }}
                />
                <Typography sx={{ fontSize: 12, mt: 2 }}>
                  {item.comment}
                </Typography>
              </Stack>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default SellerReviews;
