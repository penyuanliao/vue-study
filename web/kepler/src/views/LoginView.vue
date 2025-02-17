<script setup lang="ts">
import { Login } from "@mono/ui";

const loginHandle = () => {
  console.log("login");
};
</script>

<template>
  <Login
    msg="這是中文"
    class="h-full w-full items-center justify-center text-center"
    @submit="loginHandle"
  ></Login>
</template>

<style scoped></style>
