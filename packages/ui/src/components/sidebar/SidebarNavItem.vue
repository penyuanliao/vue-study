<script setup lang="ts">
import Dropdown from "../dropdown/Dropdown.vue";

const { icon, label, path, children } = defineProps(['icon', 'label', 'path', 'children']);

</script>

<template>
  <Dropdown v-if="children"
            :label="label"
            :icon="icon"
            :items="children">
  </Dropdown>
  <a v-else :href="path ? path : '#'" class="p-1.5 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700 lg:flex lg:items-center lg:px-4 lg:py-2 lg:mt-5">
    <div v-html="icon"></div>
    <span class="mx-4 font-medium hidden lg:inline">{{ label }}</span>
  </a>

</template>

<style scoped>

</style>
