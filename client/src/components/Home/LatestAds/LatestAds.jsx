import { useEffect } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Navigation, Autoplay, Keyboard } from "swiper/modules";
import "./LatestAds.scss";
import SectionHeader from "@components/common/SectionHeader/SectionHeader";
import { Link } from "react-router-dom";
import { useGetProductsQuery } from "@store/Products/productsApiSlice";
import { setProducts } from "@store/Products/productSlice";
import { API_URL } from "@src/constants";
import NoDataMsg from "@components/common/NoDataMsg/NoDataMsg";
import { Typography } from "@mui/material";

function LatestAds() {
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
    modules: [Keyboard, Autoplay, Navigation],
    autoplay: {
      delay: 20000,
      disableOnInteraction: false,
    },
    breakpoints: {
      // when window width is >= 640px
      400: {
        slidesPerView: 1,
        spaceBetween: 5,
      },
      600: {
        slidesPerView: 2,
        spaceBetween: 20,
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
  };
  return isLoading
    ? ""
    : latestProducts && (
        <div className="latestAds">
          <div className="container">
            <SectionHeader title="LatestAds" />
            {latestProducts.length > 0 ? (
              <Swiper {...params} navigation={true}>
                {latestProducts?.map((item, i) => {
                  init += 200;
                  return (
                    <SwiperSlide key={item._id} className="mt-0 mb-4">
                      <Link
                        to={`/products/${item._id}`}
                        className="latestAds-item"
                        data-aos="fade-left"
                        data-aos-delay={init}>
                        <div className="latestAds-item-img">
                          <img
                            src={`${API_URL}/${item.image}`}
                            alt="category"
                            className="contain"
                          />
                        </div>
                        <Typography
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          className="latestAds-item-text">
                          {item.name}
                        </Typography>

                        <div className="latestAds-item-box">
                          <div className="latestAds-item-box-price text-left">
                            ${item.price}
                          </div>
                          <div className="latestAds-item-box-city text-right">
                            {item.city}
                          </div>
                          <div className="latestAds-item-box-category text-left">
                            {item.category?.name}
                          </div>
                          <div className="latestAds-item-box-type">
                            {item.status}
                          </div>
                        </div>
                      </Link>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            ) : (
              <NoDataMsg msg={"No Latest Products Yet!"} />
            )}
          </div>
        </div>
      );
}

export default LatestAds;
