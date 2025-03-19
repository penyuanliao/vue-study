<script setup lang="ts">
import ButtonBasic from "@/components/button/ButtonBasic.vue";
import ButtonGroupIcon from "@/components/button/ButtonGroupIcon.vue";
import SidebarCollapse from "@/components/sidebar/SidebarCollapse.vue";
</script>

<template>
  <div class="container">
    <SidebarCollapse class="sidebar-collapse"></SidebarCollapse>
    <div class="appearances">
      <ButtonBasic>Primary</ButtonBasic>
      <ButtonGroupIcon></ButtonGroupIcon>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
}
.appearances {
  flex: 1;
}
</style>
