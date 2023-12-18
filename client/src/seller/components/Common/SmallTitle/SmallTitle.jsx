import { Typography } from "@mui/material";
import React from "react";

function SmallTitle({ text, styles }) {
  return (
    <Typography sx={{ fontSize: 10, fontWeight: 600, mb: 1,...styles }}>
      {" "}
      {text}{" "}
    </Typography>
  );
}

export default SmallTitle;
