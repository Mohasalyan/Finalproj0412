import { Box, Typography } from "@mui/material";

function ComingSoon() {
  return (
    <Box className="flex-center">
      <Typography sx={{ fontSize: {ls:"7rem",sm:"4rem",xs:"2rem"},fontWeight:"500",textTransform:"uppercase" }}>Coming Soon</Typography>
    </Box>
  );
}

export default ComingSoon;
