import { useEffect, Suspense, lazy } from "react";
import RequireAuth from "@components/common/RequireAuth/RequireAuth";
import Layout from "@components/Layout/Layout";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Loading from "@components/common/Loading/Loading";
import AOS from "aos";
import "aos/dist/aos.css";
import { useSelector } from "react-redux";
import GuestLayout from "@components/Layout/GuestLayout";

const shared = {
  Login: lazy(() => import("@views/Auth/Login/Login")),
  Register: lazy(() => import("@views/Auth/Register/Register")),
};
const user = {
  Home: lazy(() => import("@views/Home/Home")),
  Categories: lazy(() => import("@views/Categories/Categories")),
  Search: lazy(() => import("@views/Search/Search")),
  Profile: lazy(() => import("@views/Profile/Profile")),
  Chat: lazy(() => import("@views/Chat/Chat")),
  Messages: lazy(() => import("@views/Messages/Messages")),
  Product: lazy(() => import("@views/Product/Product")),
  User: lazy(() => import("@views/User/User")),
};
const seller = {
  Home: lazy(() => import("@seller/views/Home/Home")),
  CreateProduct: lazy(() =>
    import("@seller/views/CreateProduct/CreateProduct")
  ),
  ProductDetails: lazy(() =>
    import("@seller/views/ProductDetails/ProductDetails")
  ),
  MatchRequests: lazy(() =>
    import("@seller/views/MatchRequests/MatchRequests")
  ),
};

function App() {
  const { token } = useSelector((state) => state.auth);
  const router = createBrowserRouter([
    {
      path: "/",
      element: token ? <Layout /> : <GuestLayout />,
      children: [
        {
          path: "/",
          element: (
            <Suspense fallback={<Loading />}>
              <user.Home />
            </Suspense>
          ),
        },
        {
          path: "/categories",
          element: (
            <Suspense fallback={<Loading />}>
              <user.Categories />
            </Suspense>
          ),
        },
        {
          path: "/products",
          element: (
            <Suspense fallback={<Loading />}>
              <user.Search />
            </Suspense>
          ),
        },
        {
          path: "/products/:id",
          element: (
            <Suspense fallback={<Loading />}>
              <user.Product />
            </Suspense>
          ),
        },
        {
          path: "/users/:id",
          element: (
            <Suspense fallback={<Loading />}>
              <user.User />
            </Suspense>
          ),
        },
        {
          element: <RequireAuth allowedRole={["buyer", "seller"]} />,
          children: [
            {
              path: "/profile",
              element: (
                <Suspense fallback={<Loading />}>
                  <user.Profile />
                </Suspense>
              ),
            },
            {
              path: "/chat/:id",
              element: (
                <Suspense fallback={<Loading />}>
                  <user.Chat />
                </Suspense>
              ),
            },
            {
              path: "/messages",
              element: (
                <Suspense fallback={<Loading />}>
                  <user.Messages />
                </Suspense>
              ),
            },
          ],
        },
      ],
    },
    {
      path: "/seller",
      element: <Layout />,
      children: [
        {
          element: <RequireAuth allowedRole={["seller"]} />,
          children: [
            {
              path: "",
              element: (
                <Suspense fallback={<Loading />}>
                  <seller.Home />
                </Suspense>
              ),
            },
            {
              path: "products/:id",
              element: (
                <Suspense fallback={<Loading />}>
                  <seller.ProductDetails />
                </Suspense>
              ),
            },
            {
              path: "products/create-product",
              element: (
                <Suspense fallback={<Loading />}>
                  <seller.CreateProduct />
                </Suspense>
              ),
            },
            {
              path: "match-requests",
              element: (
                <Suspense fallback={<Loading />}>
                  <seller.MatchRequests />
                </Suspense>
              ),
            },
          ],
        },
      ],
    },
    {
      path: "/login",
      element: (
        <Suspense fallback={<Loading />}>
          <shared.Login />
        </Suspense>
      ),
    },
    {
      path: "/register",
      element: (
        <Suspense fallback={<Loading />}>
          <shared.Register />
        </Suspense>
      ),
    },
  ]);
  useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration
      once: false, // animation only once
      easing: "ease-in-out", // animation easing function
      offset: 50, // animation start offset
    });
  }, []);
  return <RouterProvider router={router} />;
}

export default App;
