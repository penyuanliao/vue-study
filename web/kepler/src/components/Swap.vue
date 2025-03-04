<script setup lang="ts">
const props = defineProps({
  size: {
    type: Number,
    default: 24,
  },
  stroke: {
    type: Number,
    default: 1,
  },
  checked: {
    type: Boolean,
    default: false,
  },
});
import { useSlots } from "vue";

const slots = useSlots();
</script>

<template>
  <label class="swap" :style="`width: ${props.size}px; height: ${props.size}px;`">
    <!-- this hidden checkbox controls the state -->
    <input type="checkbox" :checked="props.checked" />
    <div class="swap-off">
      <slot v-if="slots.up" name="up" class="swap-off"></slot>
      <svg
        v-else
        class="text-gray-800 dark:text-white"
        style="width: 100%; height: 100%"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          :stroke-width="props.stroke"
          d="M12 19V5m0 14-4-4m4 4 4-4"
        />
      </svg>
    </div>
    <div class="swap-on" :style="`width: ${props.size}px; height: ${props.size}px;`">
      <slot v-if="slots.down" name="down" class="swap-on"></slot>
      <svg
        v-else
        style="width: 100%; height: 100%"
        class="text-gray-800 dark:text-white"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          :stroke-width="props.stroke"
          d="M12 6v13m0-13 4 4m-4-4-4 4"
        />
      </svg>
    </div>
  </label>
</template>

<style scoped></style>
