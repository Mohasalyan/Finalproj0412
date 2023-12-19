import { Avatar, Box, Grid, Rating, Stack, Typography } from "@mui/material";
import { API_URL } from "@src/constants";
import React from "react";
import { useSelector } from "react-redux";

function MyReviews() {
    const { profile } = useSelector((state) => state.users);
    
  return (
    <Box component={"div"} sx={{px:5,mt:20}}>
      <Typography sx={{ fontSize: 12 }}> {profile?.reviews?.length} Reviews </Typography>
      <Grid container sx={{ mt: 4,height:"240px",overflowY:"auto" }} spacing={2}>
        {profile?.reviews?.map((item) => (
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

export default MyReviews;
