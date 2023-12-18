import { useEffect, useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import { Avatar, Box, IconButton, Stack, Typography } from "@mui/material";
import NotificationIcon from "@mui/icons-material/Notifications";
import { API_URL } from "@src/constants";
import dayjs from "dayjs";
import SmallTitle from "@seller/components/Common/SmallTitle/SmallTitle";
import { useDispatch, useSelector } from "react-redux";
import { useMarkAsSeenMutation } from "@store/notifications/notificationsApiSlice";
import { Link, useNavigate } from "react-router-dom";
import { setAddNotification } from "@store/notifications/notificationsSlice";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

export default function NotificationsMenu() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);
  const { myNotifications } = useSelector((state) => state.notifications);
  const [anchorEl, setAnchorEl] = useState(null);
  const [markAsSeen, { isError, error, isLoading, isSuccess }] =
    useMarkAsSeenMutation();

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const markAsReedHandler = async (item) => {
    const data = await markAsSeen({ token, id: item._id }).unwrap();
    dispatch(setAddNotification(data));
  };
  const navigateTo = async (item) => {
    let link;
    switch (item.type) {
      case "matchReq":
        user.role === "seller"
          ? navigate("/seller/match-requests")
          : navigate(`/chat/${item.product}`);
        break;
      case "message":
        navigate(`/chat/${item.product}`);
      default:
        link = "";
        break;
    }
    return link;
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        id="demo-customized-button"
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="contained"
        disableelevation="true"
        size="small"
        sx={{ ml: 2, borderRadius: ".5rem", gap: 2 }}
        onClick={handleClick}>
        <div className="navbar-box-notification icon">
          <NotificationIcon sx={{ fontSize: 20 }} />
          {myNotifications?.length > 0 && (
            <div className="count">{myNotifications?.length}</div>
          )}
        </div>
      </IconButton>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}>
        <Box sx={{ mx: 2, my: 2, display: "flex" }}>
          <NotificationIcon sx={{ fontSize: 15 }} />
          <SmallTitle text={"Notifications"} />
        </Box>
        <Divider />
        <div style={{ maxHeight: "200px", overflow: "auto" }}>
          {myNotifications?.length > 0 ? (
            myNotifications?.map((item,i) => (
              <MenuItem
                key={item._id || i}
                disableRipple
                sx={{ cursor: "auto", width: "100%" }}>
                <div className="flex-items-center gap-1 w-100">
                  <Avatar src={`${API_URL}/${item.sender?.photo}`} />
                  <Stack sx={{ width: "100%" }}>
                    <div className="flex-between">
                      <Typography
                        sx={{ fontSize: 15, color: "#555", cursor: "pointer" }}
                        onClick={() => navigateTo(item)}>
                        {item.sender?.fullName}
                      </Typography>
                      <Typography
                        onClick={() => markAsReedHandler(item)}
                        className="link"
                        sx={{
                          fontSize: 8,
                          textTransform: "capitalize",
                          fontWeight: 600,
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}>
                        mark as read
                      </Typography>
                    </div>
                    <Typography
                      sx={{ fontSize: 12, color: "#888", cursor: "pointer" }}
                      onClick={() => navigateTo(item)}>
                      {item.body}
                    </Typography>
                    <Typography sx={{ fontSize: 8, color: "#999" }}>
                      {dayjs(item.createdAt).fromNow()}
                    </Typography>
                  </Stack>
                </div>
              </MenuItem>
            ))
          ) : (
            <Typography sx={{ p: 2, fontSize: 10, color: "#999" }}>
              No Notifications Yet
            </Typography>
          )}
        </div>
      </StyledMenu>
    </div>
  );
}
