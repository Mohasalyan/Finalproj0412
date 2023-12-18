import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@seller": path.resolve(__dirname, "./src/seller"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@views": path.resolve(__dirname, "./src/views"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@store": path.resolve(__dirname, "./src/store"),
      "@src": path.resolve(__dirname, "./src"),
    },
  },
  // base: "/", // the base URL should be set to the root path ("/") because Vercel handles the routing and serves your app from the root.
  server: {
    port: 5001,
    proxy: {
      "/api": {
        target: "https://swap-moq.onrender.com",
        changeOrigin: true,
      },
    },
  },
});
