import { apiSlice } from "../apiSlice";
const CHATS_URL = "/api/chat";
export const chatApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getChats: builder.query({
      query: () => `${CHATS_URL}`,
      transformResponse: (res) => res.sort((a, b) => b.id - a.id),
      providesTags: ["Chats"],
    }),
    sendMessage: builder.mutation({
      query: ({ text, chatId, token }) => ({
        url: `${CHATS_URL}/${chatId}`,
        method: "POST",
        body: { text },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    sendNewMessage: builder.mutation({
      query: ({ text, chatId, token }) => ({
        url: `${CHATS_URL}/${chatId}`,
        method: "POST",
        body: { text },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    getMyChats: builder.query({
      query: (token) => ({
        url: `${CHATS_URL}/my-chats`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    getChat: builder.query({
      query: ({ token, productId }) => ({
        url: `${CHATS_URL}/${productId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
  }),
});

export const {
  useGetChatsQuery,
  useGetMyChatsQuery,
  useGetChatQuery,
  useSendMessageMutation,
  useSendNewMessageMutation,
} = chatApiSlice;
