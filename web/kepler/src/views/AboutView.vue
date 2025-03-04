<script setup lang="ts">
import AlertBanner from "@/components/AlertBanner.vue";
import { ref } from "vue";
const isAlertVisible = ref(false);

const showAlert = () => {
  // document.getElementById("my_modal_3")?.showModal();
  isAlertVisible.value = !isAlertVisible.value;
};
</script>

<template>
  <div>
    <button class="btn" @click="showAlert">警告Alert Banner</button>
    <AlertBanner
      v-model="isAlertVisible"
      message="✨ Your account was registered!"
      title="Success"
      :timer="3000"
      variant="info"
    ></AlertBanner>
  </div>
</template>

<style scoped></style>
