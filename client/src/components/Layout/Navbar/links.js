import HomeIcon from "@mui/icons-material/Home";
import CategoriesIcon from "@mui/icons-material/Category";
import SearchIcon from "@mui/icons-material/Search";

const adminLinks = [
  {
    name: "Products",
    icon: "",
    link: "/seller",
  },
  {
    name: "Match Requests",
    icon: "",
    link: "/seller/match-requests",
  },
  {
    name: "Messages",
    icon: "",
    link: "/messages",
  },
];
const userLinks = [
  {
    name: "home",
    icon: HomeIcon,
    link: "/",
  },
  {
    name: "categories",
    icon: CategoriesIcon,
    link: "/categories",
  },
  {
    name: "search",
    icon: SearchIcon,
    link: "/products",
  },
];

export { adminLinks, userLinks };
