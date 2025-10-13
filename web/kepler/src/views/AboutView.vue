<script setup lang="ts">
import AlertBanner from "@/components/AlertBanner.vue";
import { ref } from "vue";
import { Button, ButtonGroupIcon, TextFadeIn } from "@mono/ui";
const isAlertVisible = ref(false);

const showAlert = () => {
  // document.getElementById("my_modal_3")?.showModal();
  isAlertVisible.value = !isAlertVisible.value;
};
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <ButtonGroupIcon></ButtonGroupIcon>
    <Button class="btn" @click="showAlert">警告Alert Banner</Button>
    <AlertBanner
      v-model="isAlertVisible"
      message="✨ Your account was registered!"
      title="Success"
      :timer="3000"
      variant="info"
    ></AlertBanner>
    <div>
      <a class="underline">TextFadeIn:</a>
      <TextFadeIn text="全聯電子發票服務消費通知" separator="" classStyle="p-1" />
    </div>
    <div class="m-5 inline-block h-[200px] w-[320px] rounded-md"></div>
  </div>
  <!--  <div class="relative z-10 h-full w-full overflow-y-auto bg-gray-50 dark:bg-gray-800">-->
  <!--    <div-->
  <!--      class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0"-->
  <!--    >-->
  <!--      &lt;!&ndash; RWD &ndash;&gt;-->
  <!--      <span class="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true"-->
  <!--        >&#8203;</span-->
  <!--      >-->
  <!--    </div>-->
  <!--  </div>-->
</template>

<style scoped></style>
