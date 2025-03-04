<script setup lang="ts">
import { Login } from "@mono/ui";
import { useAccountStore } from "@/stores/account.ts";
import { useRouter } from "vue-router";
const router = useRouter();
const loginHandle = ({ username, password }: { username: string; password: string }) => {
  const account = useAccountStore();
  const bool = account.authentication({ username, password });
  console.log(`login: ${bool}`);
  if (bool) {
    router.push({ path: "/" }); // 成功登入後導向 Dashboard
  } else {
    alert("登入失敗");
  }
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
