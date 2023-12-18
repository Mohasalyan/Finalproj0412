import img1 from "@assets/home/product1.png";
import img2 from "@assets/home/product2.png";
import img3 from "@assets/home/product3.png";
import "./Banner.scss";
import { Typography, useMediaQuery } from "@mui/material";
import { MED_SCREEN, SMALL_SCREEN } from "@src/constants";

function Banner() {
  const isMdScreen = useMediaQuery(`(${SMALL_SCREEN})`);
  return (
    <div className="banner">
      <div className="container">
          <div className="banner-imgsSide">
            <div
              className="banner-imgsSide-img"
              data-aos="fade-up"
              data-aos-delay="800">
              <img src={img2} alt="product" />
            </div>
            <div
              className="banner-imgsSide-img arrow"
              data-aos="fade-up"
              data-aos-delay="400">
              <img src={img3} alt="arrow" />
            </div>
            <div
              className="banner-imgsSide-img"
              data-aos="fade-up"
              data-aos-delay="200">
              <img src={img1} alt="product" />
            </div>
          </div>
        {/* {!isMdScreen && (
        )} */}

        <div className="banner-textSide">
          Trade the ordinary for the extraordinary!
          <span data-aos="fade-down">Welcome to the Swap Zone</span>
          <Typography sx={{
            fontSize: {
            md:20
          } }}>
            where your stuff finds a new home in the most unexpected ways. Swap
            a toaster for a magic wand, a skateboard for a disco ball. Get ready
            to trade wild and live crazy! 🚀
          </Typography>
        </div>
      </div>
    </div>
  );
}

export default Banner;
