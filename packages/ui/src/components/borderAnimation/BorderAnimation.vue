<script setup lang="ts">
defineProps<{
  lineColor?: string;
  borderWidth?: string;
  borderRadius?: string;
  backgroundColor?: string;
  lineBackgroundColor?: string;

}>();
</script>

<template>
  <div class="border-box" :style="{
    '--line-color': lineColor,
    '--border-width': borderWidth,
    '--border-radius': borderRadius,
    '--background-color': backgroundColor,
    '--line-background-color': lineBackgroundColor
  }">
    <div class="border-box-content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">

@property --conic-gradient-rotate {
  syntax: "<angle>";
  inherits: false;
  initial-value: 0deg;
}

.border-box {
  position: relative;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: var(--border-radius, 4px);
  background: var(--line-background-color, transparent);

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: repeating-conic-gradient(from var(--conic-gradient-rotate, 0),
      var(--line-color, #ff2770) 0%,
      var(--line-color, #ff2770) 5%,
      transparent 5%,
      transparent 40%,
      var(--line-color, #ff2770) 50%);
    border-radius: var(--border-radius, 4px);
    animation: border-line-animate 4s linear infinite;
  }
  /* 遮罩 */
  &::after {
    content: '';
    position: absolute;
    inset: var(--border-width, 4px);
    background: var(--background-color, #0e1538);
    border-radius: calc(var(--border-radius, 4px));
  }

}
.border-box-content {
  width: 100%;
  height: 100%;
  position: relative;
  align-items: center;
  text-align: center;
  justify-content: center;
  display: flex;
  z-index: 10;
}


@keyframes border-line-animate {
  0% {
    --conic-gradient-rotate: 0deg;
  }

  100% {
    --conic-gradient-rotate: 360deg;
  }

}

</style>
