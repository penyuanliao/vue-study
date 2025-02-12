<script setup lang="ts">
import HelloWorld from "./components/HelloWorld.vue";
import { Button } from "@mono/ui";
import { add } from "@mono/utils";
</script>

<template>
  <div class="flex justify-center">
    <a href="https://vite.dev" target="_blank" class="flex justify-center">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
    <a href=""><img class="logo" src="/prettier.svg" alt="" /></a>
  </div>
  <div></div>
  <HelloWorld msg="Vite + Vue + memo + Prettier"> </HelloWorld>
  <Button class="">我是monorepo插件{{ add(10, 10) }}</Button>
  <br />
  <div class="bg-red-300 text-3xl font-bold underline">+ Tailwindcss CSS</div>
</template>

<style>
/* 這邊導入 tailwindcss */
@import "tailwindcss";
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
