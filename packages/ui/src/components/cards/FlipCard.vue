<script setup lang="ts">
import { ref, watch } from "vue";

interface IFlipCardProps {
  open?: boolean;
  flipDisabled?: boolean;
}
const props = defineProps<IFlipCardProps>();
const emit = defineEmits(["update:open"]);
const isFlipped = ref(props.open ?? false);

const flipCard = () => {
  if (props.flipDisabled) return;
  isFlipped.value = !isFlipped.value;
  emit('update:open', isFlipped.value); // 通知父層更新狀態
};

watch(() => props.open, (value) => {
  isFlipped.value = value ?? false;
})

const flipCardRef = ref(null);

// 監聽 `transitionend` 事件來偵測動畫結束
const onTransitionEnd = (event: TransitionEvent) => {
  if (event.propertyName === "transform") {
    console.log("翻轉完成！");
  }
};

defineExpose({
  el: flipCardRef
})

</script>

<template>
  <div
    class="flip-card"
    @pointerup="flipCard"
    ref="flipCardRef"
  >
    <div
      class="card-inner"
      :class="{ flipped: isFlipped, 'flipped-right': !isFlipped }"
      @transitionend="onTransitionEnd"
    >
      <div class="card-front">
        <slot name="front" />
      </div>
      <div class="card-back">
        <slot name="back" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.flip-card {
  position: relative;
  width: 100%;
  height: 100%;
  perspective: 1000px; /* Enables 3D effect */
}

.card-inner {
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.09, 0.48, 0.16, 1.52);

  &.flip-card {
    transform: rotateY(180deg);
  }
  &.flipped-right {
    transform: rotateY(0deg);
  }
}
.card-front,
.card-back {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 24px;
  font-weight: bold;
  border-radius: 10px;
  backface-visibility: hidden; /* Hide the back when facing front */
}

.card-back {
  transform: rotateY(180deg);
}

</style>
