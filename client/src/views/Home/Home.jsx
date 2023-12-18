import Banner from "@components/Home/Banner/Banner";
import Categories from "@components/Home/Categories/Categories";
import LatestAds from "@components/Home/LatestAds/LatestAds";

function Home() {
  return (
    <div className="home">
      <Banner />
      <Categories />
      <LatestAds />
    </div>
  );
}

export default Home;
