import { useEffect } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Pagination, Autoplay } from "swiper/modules";
import "../Home/LatestAds/LatestAds.scss";
import { Link } from "react-router-dom";
import { useGetProductsQuery } from "@store/Products/productsApiSlice";
import { setProducts } from "@store/Products/productSlice";
import { API_URL } from "@src/constants";
import NoDataMsg from "@components/common/NoDataMsg/NoDataMsg";
import {
  Avatar,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Rating,
  Stack,
  Typography,
} from "@mui/material";

function TopRatedSellers() {
  const dispatch = useDispatch();
  const {
    data: productsData,
    isLoading,
    isError,
    error,
    isSuccess,
    refetch,
  } = useGetProductsQuery("");
  const { latestProducts } = useSelector((state) => state.products);
  const { topRatedUsers } = useSelector((state) => state.users);

  useEffect(() => {
    if (isSuccess) {
      dispatch(setProducts(productsData));
    }
    if (isError) {
      toast.error(error);
    }
  }, [isError, isSuccess]);
  // Swiper
  let init = 100;
  const params = {
    // spaceBetween: 30,
    centeredSlides: false,
    slidesPerGroup: 1,
    pagination: { clickable: true },
    modules: [Pagination, Autoplay],
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },
    breakpoints: {
      // when window width is >= 640px
      400: {
        slidesPerView: 1,
        spaceBetween: 5,
      },
      // when window width is >= 768px
      768: {
        slidesPerView: 3,
        spaceBetween: 15,
      },
      992: {
        slidesPerView: 4,
        spaceBetween: 35,
      },
    },
    loop: true,
  };
  return isLoading
    ? ""
    : topRatedUsers && (
        <div className="sellers">
          <div className="container">
            <Grid
              container
              spacing={10}
              sx={{
                justifyContent: {
                  xs: "center",
                  sm: "flex-start",
                },
              }}>
              {topRatedUsers.length > 0 ? (
                topRatedUsers.map((item) => (
                  <Grid item>
                    <Card elevation={0}>
                      <CardActionArea>
                        <CardContent>
                          <Link
                            to={`/users/${item._id}`}
                            className="sellers-item"
                            data-aos="fade-left"
                            data-aos-delay={init}>
                            <div className="flex-center mb-2">
                              <Avatar
                                src={`${API_URL}/${item.photo}`}
                                alt="user"
                                className="contain"
                                sx={{ width: 80, height: 80 }}
                              />
                            </div>
                            <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
                              {item.fullName}
                            </Typography>
                            <Stack alignItems={"center"}>
                              <Rating
                                name="read-only"
                                value={item?.sellerRating}
                                readOnly
                                size="small"
                              />
                              <Typography
                                sx={{
                                  fontSize: 12,
                                  fontWeight: 500,
                                  color: "#999",
                                }}>
                                ({item.reviewsCount}) reviews
                              </Typography>
                            </Stack>
                          </Link>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))
              ) : (
                <NoDataMsg msg={"No Latest Products Yet!"} />
              )}
            </Grid>
          </div>
        </div>
      );
}

export default TopRatedSellers;
