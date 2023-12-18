import { createSlice } from "@reduxjs/toolkit";
// Attempt to retrieve user and token from localStorage

const productsSlice = createSlice({
  name: "product",
  initialState: {
    allProducts: null,
    latestProducts: null,
    productDetails: null,
    mostRequested: null,
    sellerProducts: null,
    category: {
      categories: null,
    },
  },
  reducers: {
    setProducts: (state, { payload }) => {
      state.latestProducts = payload;
    },
    setProductsNames: (state, { payload }) => {
      state.productsNames = payload;
    },
    setAllProducts: (state, { payload }) => {
      state.allProducts = payload;
    },
    setProduct: (state, { payload }) => {
      state.productDetails = payload;
    },
    setSellerProducts: (state, { payload }) => {
      state.sellerProducts = payload;
    },
    setMostRequested: (state, { payload }) => {
      state.mostRequested = payload;
    },
    setProductMessage: (state, { payload }) => {
      state.productDetails?.messages?.push(payload);
    },
    // CATEGORY
    setCategories: (state, { payload }) => {
      state.category.categories = payload;
    },
  },
});

export const {
  setProducts,
  setProductsNames,
  setProduct,
  setProductMessage,
  setCategories,
  setAllProducts,
  setMostRequested,
  setSellerProducts
} = productsSlice.actions;
export default productsSlice.reducer;
