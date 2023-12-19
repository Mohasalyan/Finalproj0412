import { useSelector } from "react-redux";
import Logo from "../Logo/Logo";
import { userLinks, adminLinks } from "../Navbar/links";
import "./Footer.scss";
import { Link } from "react-router-dom";
import { Box, IconButton, Stack } from "@mui/material";
import { Facebook, Instagram, Telegram, WhatsApp } from "@mui/icons-material";
function Footer() {
  const { user, token } = useSelector((state) => state.auth);
  const links = user?.role !== "seller" ? userLinks : adminLinks;

  return (
    <div className="footer">
      <div className="container">
        <Box>
          <Logo />
          <Stack direction={"row"} spacing={2}>
            {links.map((item, i) => {
              return (
                <Link
                  key={i}
                  to={item.link}
                  className={`navbar-links-link ${
                    location.pathname === item.link ? "active" : ""
                  }`}
                  onClick={() => setShow(false)}>
                  {item.name}
                </Link>
              );
            })}
          </Stack>
          <Stack direction={"row"} spacing={2} justifyContent={"space-between"}>
            <IconButton>
              <Facebook />
            </IconButton>
            <IconButton>
              <Instagram />
            </IconButton>
            <IconButton>
              <WhatsApp />
            </IconButton>
            <IconButton>
              <Telegram />
            </IconButton>
          </Stack>
        </Box>
      </div>
    </div>
  );
}

export default Footer;
