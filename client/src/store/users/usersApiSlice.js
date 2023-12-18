import { apiSlice } from "../apiSlice";
const USERS_URL = "/api/users";
export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => `${USERS_URL}`,
      transformResponse: (res) => res.sort((a, b) => b.id - a.id),
      providesTags: ["Users"],
    }),
    getUser: builder.query({
      query: (id) => `${USERS_URL}/${id}`,
    }),

    profile: builder.query({
      query: (token) => ({
        url: `${USERS_URL}/profile`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    topRated: builder.query({
      query: (token) => ({
        url: `${USERS_URL}/top-rated`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    updateProfile: builder.mutation({
      query: ({ data, token }) => ({
        url: `${USERS_URL}/profile`,
        method: "PATCH",
        body: data,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),
    // profile: builder.mutation({
    //   query: (data, token) => ({
    //     url: `${USERS_URL}/profile`,
    //     method: "GET",
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   }),
    // }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/register`,
        method: "POST",
        body: data,
      }),
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
    }),
    reviewSeller: builder.mutation({
      query: ({ data, token }) => ({
        url: `${USERS_URL}/seller-rating`,
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useUpdateUserMutation,
  useProfileQuery,
  useUpdateProfileMutation,
  useGetUsersQuery,
  useReviewSellerMutation,
  useTopRatedQuery,
  useGetUserQuery
} = userApiSlice;
