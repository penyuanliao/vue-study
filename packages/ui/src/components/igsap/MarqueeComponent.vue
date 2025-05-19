<script setup lang="ts">
import gsap from "gsap";
import { computed, onMounted } from "vue";

const props = defineProps<{
  name: string,
  size: {
    w: number,
    h: number
  },
  direction: 'top' | 'bottom' | 'left' | 'right',
  images: string[],
  visibleNumber?: number,
  speed?: number,
  delay?: number
}>();

const getVisibleNumber = computed(() => {
  const isVertical = (props.direction === 'top' || props.direction === 'bottom');
  const isHorizontal = (props.direction === 'left' || props.direction === 'right');
  const num: number = props.visibleNumber || 1;
  return {
    w: isHorizontal ? num : 1,
    h: isVertical ? num : 1
  }
})

const getWrapperStyle = () => {
  if (props.direction === 'bottom' || props.direction === 'top') {
    return {
      top: `${-1 * props.size.h}px`
    }
  } else if (props.direction === 'left' || props.direction === 'right') {
    return {
      left: `${-1 * props.size.w}px`
    }
  }
}

onMounted(() => {
  const boxes = gsap.utils.toArray(`.${props.name} > .image`);
  const isVertical = (props.direction === 'top' || props.direction === 'bottom');
  const isHorizontal = (props.direction === 'left' || props.direction === 'right');
  const offset: number = isVertical ? props.size.h : props.size.w;

  const setup = () => {
    if (isHorizontal) {
      return { x: (i) => (i + 1) * offset }
    } else {
      return { y: (i) => (i + 1) * offset }
    }
  }

  const move = () => {
    if (isHorizontal) {
      return {
        x: props.direction === 'left' ? `-=${offset}` : `+=${offset}`,
        modifiers: {
          x: gsap.utils.unitize(x => wrap(parseFloat(x))) //force x value to be between 0 and 500 using modulus
        }
      }
    } else {
      return {
        y: props.direction === 'top' ? `-=${offset}` : `+=${offset}`,
        modifiers: {
          y: gsap.utils.unitize(y => wrap(parseFloat(y))) //force x value to be between 0 and 500 using modulus
        }
      }
    }
  }

  let wrap = gsap.utils.wrap(0, offset * boxes.length); // 所有物件高度
  gsap.set(boxes, setup());
  gsap.to(boxes, {
    // 動畫時間
    duration: props.speed || 1,
    // 動畫效果
    ease: "none",
    // 移動
    ...move(),
    // 重複執行
    repeat: -1,
    // 重複執行紀錄當前狀態
    repeatRefresh: true,
    // 重複執行延遲時間
    repeatDelay: props.delay || 0
  });
})

</script>

<template>
  <div
    class="marquee-container"
    :style="{
      width: `${size.w * getVisibleNumber.w}px`,
      height: `${size.h * getVisibleNumber.h}px`
    }"
  >
    <div
      class="wrapper"
      :class="name"
      :style="getWrapperStyle()"
    >
      <slot v-if="$slots.default" />
      <div
        v-else
        v-for="(src, i) in images" :key="i"
        class="image"
        :style="{
          width: `${size.w}px`,
          height: `${size.h}px`,
          backgroundImage: src ? `url(${src})` : 'none'
        }"
      >
      {{ i }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.marquee-container {
  position: absolute;
  border: #1a1a1a 1px solid;
  overflow: hidden;
}
.wrapper {
  position: relative;
  height: 100%;
  width: 100%;
}
.image {
  font-size: 2rem;
  /*border: #ff2770 1px dashed;*/
  position:absolute;
  text-align: center;
}
</style>
