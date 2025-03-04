<script setup lang="ts">

const props = defineProps({
  name: {
    type: String,
    required: true
  }
});


const img = new Image();
img.src = `/src/assets/${props.name}.svg`;

</script>

<template>
<!--  <component :is="ImgIcon" :class="`svg-${name}`" />-->
  <img :src="`/src/assets/${props.name}.svg`" alt="icon">
</template>

<style scoped>

</style>
