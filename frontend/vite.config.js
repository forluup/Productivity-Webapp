import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    proxy: {
      "/api": "http://localhost:5001",
    },
  },
  theme: {
    extend: {
      animation: {
        "spin-slow": "spin 18s linear infinite",
      },
      fontFamily: {
        orbitron: ["Orbitron", "monospace"],
      },
    },
  },
});
