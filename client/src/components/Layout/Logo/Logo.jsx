import { Link } from "react-router-dom";
import logo from "@assets/logo.png";
import "./Logo.scss";
import { Box } from "@mui/material";
function Logo() {
  return (
    <Box
      component={"div"}
      className="logo"
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Link to={"/"}>
        <img src={logo} alt="logo" width={50} />
      </Link>
    </Box>
  );
}

export default Logo;
