import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  server: {
    // In development the API runs separately; proxying avoids CORS set-up.
    proxy: { "/api": loadEnv(mode, ".", "").VITE_DEV_API || "http://localhost:5000" },
  },
}));
