<script setup lang="ts">
const props = defineProps({
  values: { type: Array },

});
import { useSlots } from 'vue'

const slots = useSlots();

</script>

<template>
  <div class="flex items-center py-4 overflow-x-auto whitespace-nowrap">
    <a href="#" class="text-gray-600 dark:text-gray-200">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      </svg>
    </a>
    <template v-for="value in props.values">
      <span class="mx-5 text-gray-500 dark:text-gray-300">
        <slot v-if="slots.separator" name="separator"/>
        <svg v-else class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m7 16 4-4-4-4m6 8 4-4-4-4"/>
        </svg>
      </span>
      <a href="#" class="text-gray-600 dark:text-gray-200 hover:underline">
        {{ value }}
      </a>
    </template>
  </div>
</template>

<style scoped>

</style>
