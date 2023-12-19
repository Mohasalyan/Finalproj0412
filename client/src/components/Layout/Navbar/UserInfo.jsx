import { useState } from "react";
import Menu from "@mui/material/Menu";
import {
  Avatar,
  Divider,
  IconButton,
  ListItemIcon,
  MenuItem,
  Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import avatar from "@assets/avatar.jpg";
import { logOut } from "@store/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";

function UserInfo() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const { user } = useSelector(state => state.auth)
  const { profile } = useSelector((state) => state.users);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  

  return (
    <>
      <div className="topNav-userInfo">
        <div className="topNav-userInfo-img">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2, borderRadius: ".5rem", gap: 2 }}>
            <img
              src={
                profile?.photo
                  ? `${import.meta.env.VITE_API_URL}/${profile?.photo}`
                  : avatar
              }
              alt="avatar"
              width={50}
              height={50}
              style={{ objectFit: "contain" }}
            />
            <div className="topNav-userInfo-name">
              <Typography fontSize={15} fontWeight={500} noWrap>
                {profile?.fullName}
              </Typography>
            </div>
          </IconButton>
        </div>
      </div>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 22,
              height: 22,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
        {/* <Divider /> */}
        <MenuItem onClick={() => navigate("/profile")} sx={{ fontSize: 15 }}>
          <ListItemIcon>
            <Avatar />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => dispatch(logOut())} sx={{ fontSize: 15 }}>
          <ListItemIcon>
            <LogoutIcon
              sx={{
                width: 22,
                height: 22,
                ml: -0.5,
                mr: 1,
              }}
            />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}

export default UserInfo;
