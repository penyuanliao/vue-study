<script setup lang="ts">
import HelloWorld from "@/components/HelloWorld.vue";
import { Button, DarkMode, DropdownIcon } from "../../../../packages/ui";
import { add } from "@mono/utils";

const openDaisyUI = () => {
  window.open("https://daisyui.com", "_blank");
};
</script>

<template>
  <div class="flex justify-center">
    <a href="https://vite.dev" target="_blank" class="flex justify-center">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="../assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
    <a href=""><img class="logo" src="/prettier.svg" alt="" /></a>
  </div>
  <HelloWorld msg="Monorepo Project: Vite + Vue + Prettier"> </HelloWorld>

  <h1>Vue-Router + Pinia</h1>

  <Button>我是monorepo插件{{ add(10, 10) }}</Button>

  <div class="p-2">
    <button class="btn" @click="openDaisyUI">DaisyUI 5.0</button>
  </div>

  <DropdownIcon>這是下拉式選單</DropdownIcon>
  <div class="p-6 text-center">
    <DarkMode data-theme="dark"></DarkMode>
  </div>

  <div class="mx-10 rounded-full bg-red-300 text-3xl font-bold underline">+ Tailwindcss CSS</div>
</template>

<style scoped>
/* 這邊導入 tailwindcss */
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
