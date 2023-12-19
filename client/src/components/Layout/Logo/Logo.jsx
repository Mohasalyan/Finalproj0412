import { Link } from "react-router-dom";
import logo from "@assets/logo.png";
import "./Logo.scss";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
function Logo() {
  const { user } = useSelector((state) => state.auth);
  return (
    <Box
      component={"div"}
      className="logo"
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Link to={user?.role === "seller " ? "/seller" : "/"}>
        <img src={logo} alt="logo" width={50} />
      </Link>
    </Box>
  );
}

export default Logo;
