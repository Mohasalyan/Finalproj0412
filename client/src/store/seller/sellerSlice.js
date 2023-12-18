import { createSlice } from "@reduxjs/toolkit";
const sellerSlice = createSlice({
  name: "reservations",
  initialState: {
    products: {
      allProducts: null,
      productDetails: null,
    },
    category: {
      categories: null,
    },
    matchRequests: {
      allMatchRequests: null,
    },
  },
  reducers: {
    setMyProducts: (state, { payload }) => {
      state.products.allProducts = payload;
    },
    setProduct: (state, { payload }) => {
      state.products.productDetails = payload;
    },
    // CATEGORY
    setSellerCategory: (state, { payload }) => {
      state.category.categories = payload;
    },
    // Match Requests
    setMatchRequests: (state, { payload }) => {
      state.matchRequests.allMatchRequests = payload;
    },
    setUpdateMatchRequests: (state, { payload }) => {
      const { updatedMatchRequest, message } = payload;
      const mrIndex = state.matchRequests.allMatchRequests.findIndex(item => item._id === updatedMatchRequest._id)
      state.matchRequests.allMatchRequests[mrIndex] = updatedMatchRequest;
    },
  },
});

export const {
  setMyProducts,
  setProduct,
  setSellerCategory,
  setMatchRequests,
  setUpdateMatchRequests,
} = sellerSlice.actions;
export default sellerSlice.reducer;
