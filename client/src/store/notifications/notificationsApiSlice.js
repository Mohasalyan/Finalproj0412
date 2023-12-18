import { apiSlice } from "../apiSlice";
const NOTIFICATIONS_URL = "/api/notifications";
export const notificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyNotifications: builder.query({
      query: ({ token }) => ({
        url: `${NOTIFICATIONS_URL}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["Notifications"],
    }),
    markAsSeen: builder.mutation({
      query: ({ id, token }) => ({
        url: `${NOTIFICATIONS_URL}/${id}/seen`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["Notifications"],
    }),
  }),
});

export const { useGetMyNotificationsQuery, useMarkAsSeenMutation } =
  notificationApiSlice;
