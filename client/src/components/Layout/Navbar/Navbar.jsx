import { Link, useLocation } from "react-router-dom";
import { adminLinks, userLinks } from "./links";
import NotificationIcon from "@mui/icons-material/Notifications";
import MsgsIcon from "@mui/icons-material/ChatBubbleOutline";
import "../Layout.scss";
import UserInfo from "./UserInfo";
import { IconButton, useMediaQuery } from "@mui/material";
import Logo from "../Logo/Logo";
import { useSelector } from "react-redux";
import NotificationsMenu from "./NotificationsMenu";
import { MED_SCREEN, SMALL_SCREEN } from "@src/constants";
import { Close, Menu } from "@mui/icons-material";
import { useState } from "react";

function Navbar() {
  const location = useLocation();
  const { user, token } = useSelector((state) => state.auth);
  const links = user?.role !== "seller" ? userLinks : adminLinks;
  const { myChats, newMsgs } = useSelector((state) => state.chat);
  let init = 100;
  const isSmallScreen = useMediaQuery(`(${MED_SCREEN})`);
  const [show, setShow] = useState(false);
  return (
    <div className="navbar">
      <div className="container">
        <Logo />

        <div
          className={
            isSmallScreen
              ? `navbar-links small-screen${show ? "-show" : ""} `
              : "navbar-links"
          }>
          {links.map((item, i) => {
            init += 250;
            return (
              <Link
                key={i}
                to={item.link}
                className={`navbar-links-link ${
                  location.pathname === item.link ? "active" : ""
                }`}
                // data-aos="fade-down"
                data-aos-delay={init || 100}
                onClick={() => setShow(false)}>
                {item.name}
              </Link>
            );
          })}
          {!token && (
            <Link
              to={"login"}
              className={`navbar-links-link`}
              data-aos="fade-down"
              data-aos-delay={init || 100}>
              login
            </Link>
          )}
        </div>
        <div className="flex-items-center gap-2">
          {user && (
            <div className="navbar-box">
              {!isSmallScreen && (
                <div className="navbar-box-user">
                  <UserInfo />
                </div>
              )}
              <NotificationsMenu />
              <IconButton
                size="small"
                sx={{ ml: 2, borderRadius: ".5rem", gap: 2 }}>
                <Link to="/messages" className="navbar-box-messages icon">
                  <MsgsIcon sx={{ fontSize: 30 }} />
                  {newMsgs > 0 && <div className="count"> {newMsgs} </div>}
                </Link>
              </IconButton>
            </div>
          )}
          <div className="flex-items-center">
            {isSmallScreen && show ? (
              <Close
                onClick={() => setShow(false)}
                sx={{ zIndex: 1000, position: "fixed", right: 15 }}
              />
            ) : (
              isSmallScreen && <Menu onClick={() => setShow(true)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
