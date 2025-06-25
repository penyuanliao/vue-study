<script setup lang="ts">
import { onMounted, ref } from "vue";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import MarqueeComponent from "@/components/igsap/MarqueeComponent.vue";
import SwitchComponent from "@/components/button/SwitchComponent.vue";

gsap.registerPlugin(ScrollTrigger);

const title = ref();
const section1 = ref();


onMounted(() => {

  const targets = gsap.utils.toArray(".title");
  const sections = gsap.utils.toArray(".section");
  console.log("targets", targets);

  const tween = gsap.timeline({
    scrollTrigger: {
      trigger: ".container"
    }
  })


  targets.forEach((target, index) => {

    gsap.fromTo(target, {
      filter: 'blur(9px)',
    }, {
      y: '90%',
      filter: 'blur(0px)',
      duration: 1,
      scrollTrigger: {
        trigger: sections[index],
        start: "top 50%",
        end: "80% 50%",
        scrub: true,
        markers: true
      }
    })
  })
  const wrapper = document.querySelector(".wrapper");
  const boxes = gsap.utils.toArray(".b-box");
  const size: number = 50; //單一物件高度
  let wrap = gsap.utils.wrap(0, size * boxes.length); // 所有物件高度
  gsap.set(boxes, {
    y: (i) => (i + 1) * size
  })
  gsap.to(boxes, {
    duration: 5,
    ease: "none",
    y: "+=50", //move each box 500px to right
    modifiers: {
      y: gsap.utils.unitize(y => wrap(parseFloat(y))) //force x value to be between 0 and 500 using modulus
    },
    repeat: -1,
    repeatRefresh: true,
    repeatDelay: 1
  });
})

</script>

<template>
  <div class="container">
    <SwitchComponent
      id="tag1"
      width="47"
      height="30"
      border="2"
      @change="value => console.log('#tag1-change', value)"></SwitchComponent>
    <div class="line-box"></div>
    <div class="floating-bar"></div>
    <section class="font section section-1" ref="section1">
      <h1 class="title" ref="title">SECTION-1
      </h1>
      <MarqueeComponent
        name="marquee"
        :size="{ w: 50, h: 50 }"
        :speed="1"
        :delay="1"
        direction="bottom"
        :visible-number="1"
        :images="['', '', '', '', '', '']"
      />

      <h1 class="score" ref="score">0</h1>
    </section>
    <section class="font section section-2">
      <h1 class="title">SECTION-2 </h1>
    </section>
    <section class="font section section-3">
      <h1 class="title">SECTION-3</h1>
    </section>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500&display=swap');

.container {
  width: 100%;
  height: 100%;
}

.font {
  font-family: "Fredoka", sans-serif;
  font-optical-sizing: auto;
  font-weight: 300;
  font-style: normal;
  font-variation-settings:
    "wdth" 100;
}
.section {
  font-size: 4rem;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: #ff2770 1px dashed;
  flex-direction: column;
}
.title {
  display: flex;
  width: 100%;
  height: 100%;
}
.hamburger-box {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.hamburger {
  height: 100px;
  width: 100px;
  top: 50%;
  left: 50%;
  background-color: #1a1a1a;
}
.floating-bar {
  width: 400px;
  height: 60px;
  position: fixed;
  display: flex;
  border-radius: 12px;
  background-color: rgb(240, 240, 240, 0.55);
  bottom: 10px;
  left: calc(50%);
  transform: translateX(calc(-50%));
  z-index: 100;
}
.section-1 {
  background: url("/images/wallpaper1.png") no-repeat;
  background-size: cover;
}
.section-2 {
  background: url("/images/wallpaper2.png") no-repeat;
  background-size: cover;

}
.section-3 {
  background: url("/images/wallpaper3.png") no-repeat;
  background-size: cover;

}
.wrapper {
  position: absolute;
  width: 50px;
  height: 50px;
  /*overflow: hidden;*/
  border: #1a1a1a 1px solid;

}
.boxes {
  height: 50px;
  width: 100%;
  position:relative;
  top:-50px;
}
.b-box {
  width: 50px;
  height: 50px;
  font-size: 2rem;
  border: #ff2770 1px dashed;
  position:absolute;
  text-align: center;

}
.line-box {
  width: calc(41px * 32);
  height: 200px;
  background: repeating-linear-gradient(
    to right,
    black 0px,
    black 40px,
    white 40px,
    white 41px
  );
}
</style>
