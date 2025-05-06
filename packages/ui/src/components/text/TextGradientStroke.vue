<script setup lang="ts">
import { ref, onMounted } from 'vue';

// 漸層文字框

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  gradientColor: {
    type: String,
    default: 'linear-gradient(90deg, white 10%, green 100%)'
  },
  gradientBorderColor: {
    type: String,
    default: 'linear-gradient(#0084d7 20%, #0014a7 100%)'
  },
  lineWidth: {
    type: Number,
    default: 5
  }

});

const textContainer = ref<HTMLDivElement | null>(null);
onMounted(() => {
  if (textContainer.value) {
    textContainer.value.style.setProperty('--gradient-color', props.gradientColor);
    textContainer.value.style.setProperty('--gradient-border-color', props.gradientBorderColor);
    textContainer.value.style.setProperty('--border-line-width', `${props.lineWidth}px`);
  }
});

</script>

<template>
    <div
      class="text"
      ref="textContainer"
      :data-text="text"
    >{{ text }}</div>
</template>

<style scoped lang="scss">
.text {
  font-style: italic;
  padding: 0 10px;
  white-space: nowrap;
  position: relative;
  color: transparent;
  text-align: left;
  &::before,
  &::after {
    content: attr(data-text);
    display: inline;
    position: absolute;
    background-clip: text;
    color: transparent;
    padding: 0 10px;
    top: 0;
    left: 0;
    text-align: left;
  }
  &::before {
    inset: 0;
    background-image: var(--gradient-border-color);
    -webkit-text-stroke: var(--border-line-width, '5px') transparent;

  }
  &::after {
    z-index: 1;
    background-image: var(--gradient-color);
  }
}

</style>
