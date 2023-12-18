import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Pagination, Autoplay } from "swiper/modules";
import { categories } from "../../../data/data";
import "./Categories.scss";
import { Typography } from "@mui/material";
import SectionHeader from "@components/common/SectionHeader/SectionHeader";
import { Link } from "react-router-dom";
import { API_URL } from "@src/constants";
import { useGetCategoriesQuery } from "@store/Products/productsApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setCategories } from "@store/Products/productSlice";
import { toast } from "react-toastify";

function Categories() {
  let init = 100;
  const dispatch = useDispatch()
  const { category } = useSelector((state) => state.products);
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
        slidesPerView: 8,
        spaceBetween: 15,
      },
    },
    loop: true,
  };
  const {
    data: categoriesData,
    isLoading,
    isError,
    error,
    isSuccess,
    refetch,
  } = useGetCategoriesQuery();
  useEffect(() => {
    if (isSuccess) {
      dispatch(setCategories(categoriesData));
    }
    if (isError) {
      toast.error(error);
    }
  }, [isSuccess, isError]);
  return (
    <div className="categories">
      <div className="container">
        <SectionHeader title="Categories" />
        <Swiper {...params}>
          {category?.categories?.map((item, i) => {
            init += 200;
            return (
              <SwiperSlide key={item._id} className="mt-0 mb-4">
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
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}

export default Categories;
