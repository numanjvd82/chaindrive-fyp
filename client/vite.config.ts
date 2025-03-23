/// <reference types="vite/client" />
/// <reference types="vite/types/importMeta.d.ts" />

import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src", // Add "@" for better convention
    },
  },
});
