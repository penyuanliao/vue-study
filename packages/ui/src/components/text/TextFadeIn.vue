<script setup lang="ts">
const { delay } = defineProps<{
  text: string,
  separator?: string,
  random?: boolean,
  delay?: number,
  classStyle?: string
}>()

const getTime = (index: number, random?: boolean) => {

  const delayTime: number = delay || 500;

  if (random) {
    return `${Math.floor(Math.random() * delayTime)}ms`;
  }
  return `${index * delayTime}ms`;
}
</script>

<template>
  <div class="flex flex-row">
    <p
      v-for="(value, index) in text.split(`${typeof separator != 'undefined' ? separator : ' '}`)"
      :class="['play font-jetMono text-4xl', classStyle]"
      :style="{ animationDelay: `${getTime(index, random)}` }"
    >
      {{ value }}
    </p>
  </div>
</template>

<style scoped>
.play {
  opacity: 0;
  animation: opacity-fade-in 1s ease-in-out forwards;
}
@keyframes opacity-fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
