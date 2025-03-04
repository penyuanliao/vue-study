<script setup lang="ts">
import { EditTable } from "@mono/ui";
import Swap from "@/components/Swap.vue";
const onChecked = (checked: boolean) => {
  console.log(`checked: ${checked}`);
};
</script>

<template>
  <div class="flex flex-col items-center justify-center text-center">
    <label>
      Swap Component:
      <Swap @change="onChecked" :size="21"> </Swap>
    </label>
    <label>
      EditTable Component:
      <EditTable
        :data="['1', '2']"
        :header="[
          { title: '中文1', icon: true },
          { title: '中文2', icon: false },
        ]"
      ></EditTable>
    </label>
  </div>
</template>

<style scoped></style>
