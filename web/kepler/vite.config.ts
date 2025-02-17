import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
// UI模組
import tailwindcss from "@tailwindcss/vite";
// JSX檔案
import vueJSX from "@vitejs/plugin-vue-jsx";
// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJSX(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
