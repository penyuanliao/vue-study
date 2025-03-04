<script setup lang="ts">
import Simple from "@mono/ui/src/components/Breadcrumbs/Simple.vue";
import { RouterLink } from "vue-router";
import { ref } from "vue";
const navLinks = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Shop",
    path: "/shop",
  },
  {
    name: "About",
    path: "/about",
  },
  {
    name: "Contact",
    path: "/contact",
  },
];

const isOpen = ref(false);
</script>

<template>
  <header>
    <nav class="relative bg-white shadow dark:bg-gray-800">
      <div class="container mx-auto px-6 py-4 md:flex md:items-center md:justify-between">
        <div class="flex items-center justify-between">
          <a href="#">
            <img class="h-6 w-auto sm:h-7" src="https://merakiui.com/images/full-logo.svg" alt="" />
          </a>

          <!-- Mobile menu button -->
          <div class="flex md:hidden">
            <button
              @click="isOpen = !isOpen"
              type="button"
              class="text-gray-500 hover:text-gray-600 focus:text-gray-600 focus:outline-none dark:text-gray-200 dark:hover:text-gray-400 dark:focus:text-gray-400"
              aria-label="toggle menu"
            >
              <svg
                v-show="!isOpen"
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 8h16M4 16h16" />
              </svg>

              <svg
                v-show="isOpen"
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Menu open: "block", Menu closed: "hidden" -->
        <div
          :class="[isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0']"
          class="absolute inset-x-0 z-20 w-full bg-white px-6 py-4 transition-all duration-300 ease-in-out md:relative md:top-0 md:mt-0 md:flex md:w-auto md:translate-x-0 md:items-center md:bg-transparent md:p-0 md:opacity-100 dark:bg-gray-800"
        >
          <div :class="isOpen ? 'flex' : 'hidden'" class="flex-col md:mx-6 md:flex md:flex-row">
            <RouterLink class="navbar-item" v-for="link in navLinks" :to="{ path: link.path }">
              {{ link.name }}
            </RouterLink>
          </div>
        </div>
      </div>
    </nav>

    <Simple :values="['Account', 'Profile', 'Settings']">
      <template v-slot:separator>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </template>
    </Simple>
    <slot></slot>
  </header>
</template>

<style scoped lang="postcss">
.navbar-item {
  @apply my-2 transform text-gray-700 transition-colors duration-300 hover:text-blue-500 md:mx-4 md:my-0 dark:text-gray-200 dark:hover:text-blue-400;
}
</style>
