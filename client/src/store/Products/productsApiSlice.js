import { apiSlice } from "../apiSlice";
const PRODUCTS_URL = "/api/products";
const CATEGORY_URL = "/api/category";
export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ keyword, category, seller, ...rest }) => {
        let queryUrl = PRODUCTS_URL;

        const addQueryParam = (paramName, paramValue) => {
          if (paramValue) {
            queryUrl += queryUrl.includes("?")
              ? `&${paramName}=${encodeURIComponent(paramValue)}`
              : `?${paramName}=${encodeURIComponent(paramValue)}`;
          }
        };

        addQueryParam("name", keyword);
        addQueryParam("category", category);
        addQueryParam("seller", seller);

        return queryUrl;
      },
      providesTags: ["Products"],
    }),

    getMyProducts: builder.query({
      query: (token) => ({
        url: `${PRODUCTS_URL}/my-products`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    getProduct: builder.query({
      query: ({ params }) => ({
        url: `${PRODUCTS_URL}/${params.productId}${
          params.userId ? `/${params.userId}` : ""
        }`,
      }),
    }),
    createProduct: builder.mutation({
      query: ({ data, token }) => ({
        url: `${PRODUCTS_URL}/`,
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    updateProduct: builder.mutation({
      query: ({ data, token, params }) => ({
        url: `${PRODUCTS_URL}/${params.id}`,
        method: "PATCH",
        body: data,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    deleteProduct: builder.mutation({
      query: ({ token, params }) => ({
        url: `${PRODUCTS_URL}/${params.id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    sendMessage: builder.mutation({
      query: ({ text, productId, token }) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: "POST",
        body: { text },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    sendMatchReq: builder.mutation({
      query: ({ productId, token }) => ({
        url: `${PRODUCTS_URL}/${productId}/match-request`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    getProductsNames: builder.query({
      query: () => `${PRODUCTS_URL}/names`,
    }),
    getMostRequestedProducts: builder.query({
      query: (id) => `${PRODUCTS_URL}/most-requested/${id}`,
    }),

    // CATEGORY
    getCategories: builder.query({
      query: () => `${CATEGORY_URL}`,
    }),
    // Match Requests
    getMyMatchRequests: builder.query({
      query: (token) => ({
        url: `${PRODUCTS_URL}/my-products/match-requests`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    handleMatchRequest: builder.mutation({
      query: ({ params, token, action }) => ({
        url: `${PRODUCTS_URL}/${params.productId}/match-requests/${params.requestId}`,
        method: "PATCH",
        body: action,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetMyProductsQuery,
  useGetProductQuery,
  useSendMatchReqMutation,
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetProductsNamesQuery,
  useDeleteProductMutation,
  useGetMostRequestedProductsQuery,
  // CATEGORY
  useGetCategoriesQuery,
  // Match requests
  useGetMyMatchRequestsQuery,
  useHandleMatchRequestMutation,
} = productApiSlice;
