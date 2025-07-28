<script setup lang="ts">
// import ButtonBasic from "@/components/button/ButtonBasic.vue";
// import ButtonGroupIcon from "@/components/button/ButtonGroupIcon.vue";
// import SidebarCollapse from "@/components/sidebar/SidebarCollapse.vue";
// import RadioButton from "@/components/button/RadioButton.vue";
// import Card from "@/components/cards/Card.vue";
import FlipCard from "@/components/cards/FlipCard.vue";
import { nextTick, onMounted, ref } from "vue";
import StGsap from "@/components/igsap/StGSAP.vue";
import ScrollTutorial from "@/components/igsap/ScrollTutorial.vue";
import CalendarTimeline from "@/components/EventCalendar/index.vue";
const items = ref<InstanceType<typeof FlipCard>[]>([]);


onMounted(async () => {
  const sportCards = document.getElementsByClassName('sport-card');

  const padding: number = 4;
  // await nextTick(); // 確保 DOM 渲染完成
  items.value.forEach((_, index) => {
    const el = sportCards[index] as HTMLDivElement;
    const width = el.clientWidth;
    const parentWidth = el?.parentElement?.clientWidth || 0;
    const parentHeight = el?.parentElement?.clientHeight || 0;
    const startPoint: {
      x: number,
      y: number
    } = {
      x: (parentWidth - width) / 2,
      y: parentHeight
    }
    el.style.transform = `translate(${startPoint.x}px, 0px)`;

    setTimeout((_card: HTMLDivElement, _i: number) => {
      _card.style.transitionDuration = '500ms';
      if (_i === 0) _card.style.transform = `translate(${startPoint.x - ((width + padding) * 2)}px, 0)`;
      if (_i === 1) _card.style.transform = `translate(${startPoint.x - width - padding}px, 0)`;
      if (_i === 3) _card.style.transform = `translate(${startPoint.x + width + padding}px, 0)`;
      if (_i === 2) _card.style.transform = `translate(${startPoint.x}px, 0)`;
    }, 500 * index, el, index)
  });

})


</script>

<template>
  <div class="container">
<!--    <div>TextGradientStroke Component</div>
    <div class="appearances">
      <TextGradientStroke class="text-gradient-stroke" :line-width="9" text="2025/10/10"/>
    </div>
    <div style="width: 200px; height: auto;">
      <P>Dropdown Component</P>
      <Dropdown :items="[{label: '按鈕', path: ''}]"/>
      <DropdownIcon>這是下拉式選單</DropdownIcon>
    </div>-->
<!--    <ScrollTutorial></ScrollTutorial>-->
    <CalendarTimeline />

<!--      <ButtonBasic>Primary</ButtonBasic>-->
<!--      <ButtonGroupIcon></ButtonGroupIcon>-->
<!--      <RadioButton></RadioButton>-->

      <!-- 翻牌 -->
<!--      <FlipCard class="sport-card animation" :name="index" v-for="(bool, index) in open" ref="items" :key="index" v-bind:open="bool ?? false">-->
<!--        <template #front>-->
<!--          <img class="rounded-md" src="https://memeprod.sgp1.digitaloceanspaces.com/user-resource/71874e05c6cce6d6effe02a1627829e3.png" alt=""/>-->
<!--        </template>-->
<!--        <template #back>-->
<!--          <Card />-->
<!--        </template>-->
<!--      </FlipCard>-->
<!--      <div class="w-full h-full flex">test</div>-->
<!--      <div class="box-container">
        <div class="box">
          <h2>CSS</h2>
        </div>
        <div class="box-2">
          <h2>HTML</h2>
        </div>
      </div>-->
<!--    </div>-->

  </div>
</template>

<style>
.text-gradient-stroke {
  width: auto;
  height: auto;
  font-size: 3rem;
  &.sub {
    margin-top: 20px;
    font-size: 2rem;
  }
}
.container {
  width: 100%;
  height: 100%;
  display: flex;
  min-height: 100vh;
  min-width: 100vw;
  flex-direction: column;
}
.appearances {
  width: 100%;
  display: flex;
  flex-direction: row;
  vertical-align: text-bottom;
}
.sport-card {
  position: absolute;
}
.box-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 500px;
}
.box {
  position: relative;
  width: 400px;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  overflow: hidden;
}
.box::before {
  content: "";
  position: absolute;
  width: 150px;
  height: 150%;
  background: linear-gradient(attr(line-color-start, #00ccff), attr(line-color-end, #d400d4));
  animation: animate 4s linear infinite;
}

.box::after {
  content: "";
  position: absolute;
  inset: 4px;
  background: #0e1538;
  border-radius: 16px;
}
:root {
  --card-width: 200px;
  --card-height: 300px;
  --rotate: 0;
}
@property --rotate {
  syntax: "<angle>";
  inherits: false;
  initial-value: 0deg;
}
.box-2 {
  background: #191c29;
  width: var(--card-width, 200px);
  height: var(--card-height, 300px);
  padding: 3px;
  position: relative;
  border-radius: 6px;
  justify-content: center;
  align-items: center;
  text-align: center;
  display: flex;
  font-size: 1.5em;
  color: rgb(88 199 250 / 0%);
  cursor: pointer;
}
.box-2::after {
  position: absolute;
  content: "";
  top: calc(var(--card-height) / 6);
  left: 0;
  right: 0;
  z-index: -1;
  height: 100%;
  width: 100%;
  margin: 0 auto;
  transform: scale(0.8);
  filter: blur(calc(var(--card-height) / 6));
  will-change: filter;
  background-image: linear-gradient(
    var(--rotate, 100deg)
    , #091e71, rgba(22, 33, 182, 0.6) 43%, #ff0000);
  opacity: 1;
  animation: spin-box 4.5s linear infinite;
}
@keyframes spin-box {
  0% {
    --rotate: 0deg;
  }
  100% {
    --rotate: 360deg;
  }
}

@keyframes animate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }

}

.box h2 {
  position: relative;
  color: #fff;
  font-size: 10em;
  z-index: 10;
}
.hidden {
  display: none;
}
</style>
