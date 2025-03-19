<script setup lang="ts">
import { RouterView } from "vue-router";
import { SidebarCollapse } from "@mono/ui";
</script>

<template>
  <div class="view-container">
    <SidebarCollapse class="sidebar-collapse"></SidebarCollapse>
    <section class="section">
      <RouterView />
    </section>
  </div>
</template>

<style scoped>
.view-container {
  display: flex;
  width: 100%;
  height: auto;
}
.section {
  flex: 1;
  width: 100%;
}
</style>
