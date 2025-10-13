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
import ScrollViewVertical from "@/components/scrollView/ScrollViewVertical.vue";
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
  const hashtag = document.getElementsByClassName('hashtag')[0];
  const elements = document.getElementsByClassName('square');
  for (let el of elements) {
      el.setAttribute('draggable', 'true');
      el.addEventListener('dragover', (e: DragEvent) => {
          console.log("dragover");
          e.preventDefault();
      });
      el.addEventListener('dragenter', () => {
          console.log("dragenter");
      });
      el.addEventListener('dragleave', () => {
          console.log("dragleave");
      });
      el.addEventListener('drop', (e) => {
          console.log("drop");
          const id = e.dataTransfer.getData('text/plain');
          const move = document.getElementById(id);
          hashtag.append(move);
      });
      el.addEventListener('dragstart', (e) => {
          console.log("dragstart", el.id);
          e.dataTransfer.setData('text/plain', el.id)
      });
  }

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
<!--      <ScrollViewVertical/>-->

<!--<div class="content-x">-->
<!--    <div class="auto-title">-->
<!--        <div class="icon">-->
<!--            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">-->
<!--                <path fill-rule="evenodd" clip-rule="evenodd" d="M14.0254 5.75812C13.3929 3.74729 10.6071 3.74729 9.97458 5.75812C9.8844 6.0448 9.63594 6.21631 9.38004 6.21631C7.27098 6.21631 6.5079 8.93003 8.12023 10.1401C8.3424 10.3068 8.44667 10.6157 8.35535 10.906C8.04546 11.8912 8.44292 12.8128 9.12096 13.3217C9.80252 13.8332 10.8037 13.9498 11.6406 13.3217C11.8566 13.1595 12.1434 13.1595 12.3594 13.3217C13.1963 13.9498 14.1975 13.8332 14.879 13.3217C15.5571 12.8128 15.9545 11.8912 15.6447 10.906C15.5533 10.6157 15.6576 10.3068 15.8798 10.1401C17.4921 8.93003 16.729 6.21631 14.62 6.21631C14.3641 6.21631 14.1156 6.0448 14.0254 5.75812ZM9.38004 7.71631C10.3176 7.71631 11.1268 7.09399 11.4055 6.20819C11.5976 5.59727 12.4024 5.59727 12.5945 6.20819C12.8732 7.09399 13.6824 7.71631 14.62 7.71631C14.91 7.71631 15.1265 7.89471 15.2145 8.17451C15.303 8.45601 15.2307 8.75176 14.9794 8.9404C14.236 9.49829 13.9363 10.4739 14.2138 11.3561C14.3162 11.6818 14.1936 11.9606 13.9786 12.122C13.7672 12.2807 13.5024 12.304 13.2598 12.122C12.5103 11.5594 11.4897 11.5594 10.7402 12.122C10.4976 12.304 10.2328 12.2807 10.0214 12.122C9.80639 11.9606 9.68379 11.6818 9.78623 11.3561C10.0637 10.4739 9.76396 9.49829 9.02062 8.9404C8.76928 8.75176 8.69695 8.45601 8.7855 8.17451C8.87351 7.89471 9.08997 7.71631 9.38004 7.71631Z" fill="grey"/>-->
<!--                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 0.25C7.16751 0.25 3.25 4.16751 3.25 9C3.25 11.1147 4.00107 13.0556 5.25004 14.5682L5.25 20.4389C5.24994 21.1694 5.2499 21.8022 5.32055 22.2768C5.39181 22.7554 5.57441 23.3562 6.19277 23.6328C6.8017 23.9052 7.3734 23.6551 7.78705 23.4002C8.20088 23.1452 8.69302 22.7349 9.26519 22.258L10.2489 21.438C10.796 20.982 11.154 20.6853 11.4511 20.4945C11.7302 20.3153 11.88 20.2807 12 20.2807C12.12 20.2807 12.2698 20.3153 12.5489 20.4945C12.846 20.6853 13.204 20.982 13.7511 21.438L14.7348 22.2579C15.307 22.7349 15.7991 23.1452 16.2129 23.4002C16.6266 23.6551 17.1983 23.9052 17.8072 23.6328C18.4256 23.3562 18.6082 22.7554 18.6795 22.2768C18.7501 21.8022 18.7501 21.1694 18.75 20.4389L18.75 14.5682C19.9989 13.0556 20.75 11.1147 20.75 9C20.75 4.16751 16.8325 0.25 12 0.25ZM4.75 9C4.75 4.99594 7.99594 1.75 12 1.75C16.0041 1.75 19.25 4.99594 19.25 9C19.25 10.8392 18.5661 12.5168 17.4377 13.7953C16.1081 15.3017 14.1653 16.25 12 16.25C9.83492 16.25 7.89222 15.3019 6.56267 13.7958C5.43402 12.5172 4.75 10.8394 4.75 9ZM6.8042 22.0559C6.75204 21.7055 6.75 21.1869 6.75 20.3787V16.0005C8.21211 17.0986 10.0302 17.75 12 17.75C13.9698 17.75 15.7879 17.0986 17.25 16.0005V20.3787C17.25 21.1869 17.248 21.7055 17.1958 22.0559C17.1857 22.1241 17.175 22.1758 17.1653 22.2144C17.1247 22.1955 17.0704 22.1667 16.9999 22.1232C16.6891 21.9317 16.2802 21.5933 15.6503 21.0683L14.6767 20.2568C14.174 19.8378 13.7445 19.4797 13.3595 19.2324C12.9476 18.9679 12.5142 18.7807 12 18.7807C11.4858 18.7807 11.0524 18.9679 10.6405 19.2324C10.2555 19.4797 9.82595 19.8378 9.32328 20.2568L8.34973 21.0683C7.7198 21.5933 7.31089 21.9317 7.0001 22.1232C6.92957 22.1667 6.87531 22.1955 6.83474 22.2144C6.82498 22.1758 6.81435 22.1241 6.8042 22.0559ZM17.1282 22.3173C17.128 22.3168 17.1298 22.3131 17.1343 22.3075C17.1306 22.3149 17.1283 22.3177 17.1282 22.3173ZM17.2565 22.2487C17.2627 22.2488 17.2662 22.2495 17.2664 22.2499C17.2666 22.2502 17.2635 22.2502 17.2565 22.2487ZM6.73359 22.2499C6.73378 22.2495 6.73725 22.2488 6.74345 22.2487C6.7365 22.2502 6.7334 22.2502 6.73359 22.2499ZM6.87184 22.3173C6.87203 22.3168 6.87017 22.3131 6.86573 22.3075C6.86619 22.3084 6.86663 22.3093 6.86704 22.3101C6.86995 22.3156 6.87168 22.3177 6.87184 22.3173Z" fill="grey"/>-->
<!--            </svg>-->
<!--        </div>-->
<!--        <div class="company"-->
<!--        >GP-X-489</div>-->
<!--        <div class="desc">-->
<!--            <div class="a">2024/05/05 ~ 2034/05/05</div>-->
<!--            <div class="b">电子4</div>-->
<!--        </div>-->
<!--    </div>-->
<!--</div>-->
<!--<div class="hashtag">-->
<!--    <div id="sq-1" class="square"><span>1</span></div>-->
<!--    <div id="sq-2" class="square">2</div>-->
<!--    <div id="sq-3" class="square">3-->
<!--    </div>-->
<!--    <div id="sq-4" class="square">4-->
<!--    </div>-->
<!--    <div id="sq-5" class="square">5-->
<!--    </div>-->
<!--</div>-->


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
.content-x {
    position: relative;
    width: 400px;
    height: 60px;
    margin: 10px 10px;
    border: black solid 1px;
}
.auto-title {
    position: absolute;
    display: flex;
    flex-direction: row;
    height: 60px;
    width: 110px;
    background-color: #ddccaa;
    transition: width 1s ease;
    left: calc(1 / 2 * 100%);
    transform: translateX(calc(calc(1 / 2 * 100%) * -1));
    &:hover {
        width: 100%;
    }
    .icon {
        width: 30px;
        min-width: 30px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .company {
        height: 100%;
        min-width: 30px;
        max-width: 100px;
        background-color: grey;
        display: flex;
        align-items: center;
    }
    .desc {
        height: 100%;
        width: 100%;
        background-color: #F15624;
        min-width: 30px;
        min-height: 30px;
        display: flex;
        flex-wrap: wrap;
    }
    .a, .b {
        height: 50%;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
}
.hashtag {
    position: relative;
    display: flex;
    flex-direction: row;
    gap: 10px;
}
.square {
    width: 50px;
    height: 20px;

    border: black solid 1px;
    border-radius: 10px;
    span {
        pointer-events: none;
    }
}
.fill {
    width: 48px;
    height: 18px;
    background-color: beige;
}
</style>
