import React, { useEffect } from "react";
import ComingSoon from "@components/common/ComingSoon/ComingSoon";
import { categories } from "@src/data/data";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

import "@components/Home/LatestAds/LatestAds.scss";
import "@components/Home/Categories/Categories.scss";
import { Link } from "react-router-dom";
import { useGetCategoriesQuery } from "@store/Products/productsApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setCategories } from "@store/Products/productSlice";
import { toast } from "react-toastify";
import { API_URL } from "@src/constants";
import { useTopRatedQuery } from "@store/users/usersApiSlice";
import { Box, Stack, Typography } from "@mui/material";

import { setTopRated } from "@store/users/usersSlice";
import TopRatedSellers from "@components/Categories/TopRatedSellers";

function Categories() {
  const dispatch = useDispatch();
  const { category } = useSelector((state) => state.products);
  let init = 100;
  const {
    data: categoriesData,
    isLoading,
    isError,
    error,
    isSuccess,
    refetch,
  } = useGetCategoriesQuery();
  const {
    data: usersData,
    isLoading: topRatedIsLoading,
    isSuccess: topRatedIsSuccess,
  } = useTopRatedQuery();

  useEffect(() => {
    if (isSuccess) {
      dispatch(setCategories(categoriesData));
    }
    if (topRatedIsSuccess) {
      dispatch(setTopRated(usersData));
    }
    if (isError) {
      toast.error(error);
    }
  }, [isSuccess, topRatedIsSuccess, isError]);
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
  return (
    <div className="categories page-h">
      <div className="container">
        {category?.categories?.map((item) => {
          init += 200;
          return (
            <Link
              to={`/products?category=${item._id}`}
              key={item._id}
              className="categories-category"
              data-aos="fade-left"
              data-aos-delay={init}>
              <div className="categories-category" key={item._id}>
                <div className="categories-category-img">
                  <img src={`${API_URL}/${item.icon}`} alt="category" />
                </div>
                <div className="categories-category-text">{item.name}</div>
              </div>
            </Link>
          );
        })}
      </div>
      <div className="container mt-2">
        <Box component={"div"}>
          <Stack sx={{ mb: 5,mt:10 }}>
            <Typography sx={{ fontSize: 20, fontWeight: 700 }}>
              Top Rated Sellers
            </Typography>
            <Typography sx={{ fontSize: 10 }}>
              {" "}
              Explore Excellence - Top Rated Sellers Spotlight{" "}
            </Typography>
          </Stack>

          <TopRatedSellers />
        </Box>
      </div>
    </div>
  );
}

export default Categories;
