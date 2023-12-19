import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Pagination, Autoplay } from "swiper/modules";
import "../../components/Home/LatestAds/LatestAds.scss";
import { Link, useLocation } from "react-router-dom";
import { useGetProductsQuery } from "@store/Products/productsApiSlice";
import { setAllProducts, setProducts } from "@store/Products/productSlice";
import { API_URL } from "@src/constants";
import NoDataMsg from "@components/common/NoDataMsg/NoDataMsg";
import "./Search.scss";
import Loading from "@components/common/Loading/Loading";
import { Grid } from "@mui/material";
import Suggests from "./Suggests";

function LatestAds() {
  const dispatch = useDispatch();
  const { allProducts } = useSelector((state) => state.products);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [query, setQuery] = useState({});
  const { search } = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(search);
    const category = searchParams.get("category");
    const seller = searchParams.get("seller");

    setQuery({ category, seller });
  }, [search]);

  const {
    data: productsData,
    isLoading,
    isError,
    error,
    isSuccess,
    refetch,
  } = useGetProductsQuery(query);

  useEffect(() => {
    if (isSuccess || productsData) {
      dispatch(setAllProducts(productsData));
    }
    if (isError) {
      toast.error(error);
    }
  }, [isSuccess, isError, productsData]);

  useEffect(() => {
    refetch();
  }, [query, searchKeyword]);

  const handleSearch = () => {
    setQuery({ ...query, keyword: searchKeyword });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  let init = 100;
  return isLoading ? (
    <Loading />
  ) : (
    <div className="products page-h">
      {allProducts && (
        <div className="container">
          <Suggests
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
            handleKeyPress={handleKeyPress}
            handleSearch={handleSearch}
          />
          <Grid container spacing={10}>
            {allProducts.length > 0 ? (
              allProducts?.map((item, i) => {
                init += 200;
                return (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    key={item._id}
                    className="mt-0 mb-4"
                    data-aos="fade-left"
                    data-aos-delay={init}>
                    <Link
                      to={`/products/${item._id}`}
                      className="latestAds-item">
                      <div className="latestAds-item-img">
                        <img src={`${API_URL}/${item.image}`} alt="category" />
                      </div>
                      <div className="latestAds-item-text"> {item.name} </div>
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
                  </Grid>
                );
              })
            ) : (
              <div className="container">
                <NoDataMsg msg={"No Products!"} />
              </div>
            )}
          </Grid>
        </div>
      )}
    </div>
  );
}

export default LatestAds;
