<script setup lang="ts">
import { ref } from "vue";

export interface IDropdownProps {
  label?: string,
  icon?: string,
  items: {
    label: string,
    path: string
  }[]
}

defineProps<IDropdownProps>();

const isVisible = ref(false);

</script>

<template>
  <div @click="isVisible = !isVisible">
    <div class="p-1.5 mt-5 cursor-pointer text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700 lg:flex lg:items-center lg:px-4 lg:py-2 lg:mt-5">
      <div class="w-6 h-6" v-if="icon" v-html="icon"></div>
      <svg class="w-6 h-6 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4" d="M10 3v4a1 1 0 0 1-1 1H5m4 8h6m-6-4h6m4-8v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z"/>
      </svg>
      <span class="flex-1 text-left mx-4 font-medium hidden lg:inline">{{ label }}</span>
      <svg :class="['w-6 h-6', isVisible ? 'is-rotated' : 'not-rotated']"
           aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
      </svg>

    </div>
  </div>

  <transition name="dropdown-fade">
    <ul
      v-show="isVisible"
      class="py-2 space-y-2">
      <li
        v-for="(item, index) in items"
        :key="index"
      >
        <a :href="item.path"
           class="flex items-center
           p-2 pl-11
           w-full text-base font-normal
           rounded-lg
           transition duration-75
         text-gray-900 hover:bg-gray-100
         dark:text-white dark:hover:bg-gray-700">
          {{item.label}}
        </a>
      </li>
    </ul>
  </transition>
</template>

<style scoped>
.dropdown-fade-enter-active {
  transition: all .2s ease-out;
}
.dropdown-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

.not-rotated {
  animation: rotate-anim-0 0.3s forwards 1;
}
.is-rotated {
  animation: rotate-anim-180 0.3s forwards 1;
}

@keyframes rotate-anim-180 {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-180deg);
  }
}
@keyframes rotate-anim-0 {
  0% {
    transform: rotate(-180deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
</style>
