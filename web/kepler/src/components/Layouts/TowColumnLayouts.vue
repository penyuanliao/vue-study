<script setup lang="ts">
import Header from "@/components/Header.vue";
import SidebarComponent from "@/components/SidebarComponent.vue";
import Footer from "@/components/Footer.vue";
</script>
import Footer from "@/components/Footer.vue"; import Header from "@/components/Header.vue"; import
SidebarComponent from "@/components/SidebarComponent.vue";
<template>
  <SidebarComponent hidden>
    <Header />
    <div class="block h-screen w-full flex-col overflow-y-scroll">
      <RouterView />
      <Footer class="absolute bottom-0 w-full"></Footer>
    </div>
  </SidebarComponent>
</template>

<style scoped></style>
