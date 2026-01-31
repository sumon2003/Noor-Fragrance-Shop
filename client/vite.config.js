import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwindcss(), // ⬅️ এটা না থাকলে Tailwind apply হবে না
    react()
  ],
  server: {
    proxy: {
      "/api": "http://localhost:5000"
    }
  }
});
