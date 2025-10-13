<script setup lang="ts">
import { SidebarCollapse } from "../../../../packages/ui";
import { computed, ref } from "vue";
const navBarItems = [
  {
    label: "Dashboard",
    icon: `
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      `,
  },
  {
    label: "Accounts",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
             </svg>`,
  },
  {
    label: "Tickets",
    icon: `
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 5V7M15 11V13M15 17V19M5 5C3.89543 5 3 5.89543 3 7V10C4.10457 10 5 10.8954 5 12C5 13.1046 4.10457 14 3 14V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V14C19.8954 14 19 13.1046 19 12C19 10.8954 19.8954 10 21 10V7C21 5.89543 20.1046 5 19 5H5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      `,
  },
  {
    label: "Settings",
    icon: `
                      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.3246 4.31731C10.751 2.5609 13.249 2.5609 13.6754 4.31731C13.9508 5.45193 15.2507 5.99038 16.2478 5.38285C17.7913 4.44239 19.5576 6.2087 18.6172 7.75218C18.0096 8.74925 18.5481 10.0492 19.6827 10.3246C21.4391 10.751 21.4391 13.249 19.6827 13.6754C18.5481 13.9508 18.0096 15.2507 18.6172 16.2478C19.5576 17.7913 17.7913 19.5576 16.2478 18.6172C15.2507 18.0096 13.9508 18.5481 13.6754 19.6827C13.249 21.4391 10.751 21.4391 10.3246 19.6827C10.0492 18.5481 8.74926 18.0096 7.75219 18.6172C6.2087 19.5576 4.44239 17.7913 5.38285 16.2478C5.99038 15.2507 5.45193 13.9508 4.31731 13.6754C2.5609 13.249 2.5609 10.751 4.31731 10.3246C5.45193 10.0492 5.99037 8.74926 5.38285 7.75218C4.44239 6.2087 6.2087 4.44239 7.75219 5.38285C8.74926 5.99037 10.0492 5.45193 10.3246 4.31731Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
      `,
  },
  {
    label: "Tickets",
    icon: `
                      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 5V7M15 11V13M15 17V19M5 5C3.89543 5 3 5.89543 3 7V10C4.10457 10 5 10.8954 5 12C5 13.1046 4.10457 14 3 14V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V14C19.8954 14 19 13.1046 19 12C19 10.8954 19.8954 10 21 10V7C21 5.89543 20.1046 5 19 5H5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
      `,
  },
  {
    label: "Pages",
    children: [
      { label: "Settings", path: "#" },
      { label: "Kanban", path: "#" },
      { label: "Calendar", path: "#" },
    ],
  },
];
const props = defineProps<{ show?: boolean; hidden?: boolean }>();
const showSidebar = ref(props.show);
const initialLoad = ref(true);

const status = computed(() => {
  if (initialLoad.value) {
    initialLoad.value = false;
    // 初始化關閉不觸發動畫
    if (!showSidebar.value) return "";
  }
  return showSidebar.value ? "open" : "close";
});
const handle = () => {
  showSidebar.value = !showSidebar.value;
};
const onClose = () => {
  showSidebar.value = false;
};
</script>

<template>
  <div class="view-container">
    <!-- 漢堡按鈕 -->
    <div
      v-if="!showSidebar"
      class="absolute top-0 left-0 z-10 flex h-15 w-15 items-center justify-center text-gray-700"
    >
      <svg
        class="h-8 w-8 cursor-pointer text-gray-800 dark:text-white"
        @click="() => handle()"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-width="2"
          d="M5 7h14M5 12h14M5 17h10"
        />
      </svg>
    </div>
    <!-- 側邊欄 -->
    <SidebarCollapse
      class="sidebar-collapse"
      :class="[hidden ? 'hidden' : '', status]"
      logo="https://www.svgrepo.com/show/303108/google-icon-logo.svg"
      logo-text="Google Developer"
      :nav-bar-items="navBarItems"
    ></SidebarCollapse>
    <!-- 遮罩 -->
    <div
      v-show="showSidebar"
      class="absolute z-10 h-full w-full bg-black opacity-30"
      @click="onClose()"
    ></div>
    <!-- 主要內容區域 -->
    <section class="section">
      <slot></slot>
    </section>
  </div>
</template>

<style scoped>
.view-container {
  display: flex;
  width: 100%;
  height: 100%;
}
.hidden {
  position: absolute;
  z-index: 20;
  transform: translateX(-100%);
}

.close {
  animation: slideOut 0.3s ease-in-out forwards;
}

.open {
  animation: slideIn 0.3s ease-in-out forwards;
}
.section {
  flex: 1;
  width: 100%;
  height: 100%;
}
@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}
@keyframes slideOut {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}
</style>
