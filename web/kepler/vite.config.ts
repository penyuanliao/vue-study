import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// UI模組
import tailwindcss from "@tailwindcss/vite";
// JSX檔案
import vueJSX from "@vitejs/plugin-vue-jsx";
// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJSX(), tailwindcss()],
});
