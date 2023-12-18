import { Typography } from "@mui/material";

function NoDataMsg({ msg,style }) {
  return (
    <Typography
      sx={{
        marginBlock:"2rem",
        fontSize: {
          md: "6rem",
          xs:"3rem"
        },
        textAlign: "center",
        color: "#ddd8",
        fontWeight: 500,
        ...style
      }}>
      {msg}
    </Typography>
  );
}

export default NoDataMsg;
