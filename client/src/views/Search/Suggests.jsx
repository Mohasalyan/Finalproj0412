import { Box, IconButton, Typography } from "@mui/material";
import { useGetProductsNamesQuery } from "@store/Products/productsApiSlice";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { setProductsNames } from "@store/Products/productSlice";
import SmallTitle from "@seller/components/Common/SmallTitle/SmallTitle";
import "./Suggests.scss";

export default function Suggests({
  searchKeyword,
  setSearchKeyword,
  handleKeyPress,
  handleSearch,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);
  const { productsNames } = useSelector((state) => state.products);
  const { myNotifications } = useSelector((state) => state.notifications);
  const [filteredProductNames, setFilteredProductNames] = useState([]);
  const [open, setOpen] = useState(false);

  const {
    data: namesData,
    isLoading,
    isError,
    error,
    isSuccess,
    refetch,
  } = useGetProductsNamesQuery();

  const inputRef = useRef(null);
  const menuRef = useRef(null);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setSearchKeyword(value);
    if (searchKeyword.length > 0) {
      // Filter product names based on the search term
      const filteredNames = productsNames?.filter((name) =>
        name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProductNames(filteredNames);
    } else {
      setFilteredProductNames([]);
    }
    console.log({ filteredProductNames });
  };

  const handleInputFocus = () => {
    setOpen(true);
  };

  const handleInputBlur = () => {
    // Add a small delay to handle the focus on menu items
    setTimeout(() => {
      if (
        !menuRef.current ||
        !menuRef.current.contains(document.activeElement)
      ) {
        setOpen(false);
      }
    }, 100);
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(setProductsNames(namesData));
    }
    if (isError) {
      toast.error(error);
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Detach the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <IconButton
        id="demo-customized-button"
        variant="contained"
        size="small"
        sx={{ ml: 2, borderRadius: ".5rem", gap: 2, width: "100%" }}
        disableRipple>
        <div
          className="products-search-bar"
          ref={inputRef}
          onClick={handleClick}>
          <div className="products-search-bar-input">
            <input
              type="text"
              placeholder="What are you looking for...?"
              value={searchKeyword}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              style={{ zIndex: 999 }}
            />
          </div>
          <div
            className="products-search-bar-icon pointer"
            onClick={handleSearch}>
            <SearchIcon />
          </div>
        </div>
      </IconButton>

      <div
        className={
          open && searchKeyword.length > 0
            ? "suggests-menu show"
            : "suggests-menu hide"
        }
        ref={menuRef}>
        <Box sx={{ mx: 1, my: 2, display: "flex" }}>
          <SmallTitle text={"Are you looking for..."} />
        </Box>
        <div style={{ maxHeight: "200px", overflow: "auto" }}>
          {filteredProductNames?.length > 0 ? (
            filteredProductNames?.map((item) => (
              <div
                key={item._id}
                className="suggests-menu-item"
                onClick={() => {
                  handleClose();
                  // Additional actions if needed
                }}>
                <div
                  className="flex-items-center gap-1 w-100"
                  onClick={() => {
                    setSearchKeyword(item);
                    handleSearch();
                  }}>
                  <li className="flex-items-center gap-2">
                    <SearchIcon sx={{fontSize:12}} /> {item}
                  </li>
                </div>
              </div>
            ))
          ) : (
            <Typography sx={{ p: 2, fontSize: 10, color: "#999" }}>
              No Suggestions!
            </Typography>
          )}
        </div>
      </div>
    </div>
  );
}
