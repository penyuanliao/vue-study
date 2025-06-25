<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import BorderTemplate from "@/components/borderAnimation/BorderTemplate.vue";
// 插件
gsap.registerPlugin(ScrollTrigger)

const spacer = ref(null);
const ball   = ref(null);
const ball2  = ref(null);
const ball3  = ref(null);
const textH1 = ref(null);
const box    = ref(null);

onMounted(() => {

  gsap.set("li > span", { transform: "0 50%" });
  gsap.set("li:not(:first-of-type) span", {opacity:0.2, scale:0.8})
  const tl = gsap.timeline()
    .to("li:not(:first-of-type) span",
      {opacity:1, scale:1, stagger:0.5}
    )
    .to("li:not(:last-of-type) span",
      {opacity:0.2, scale:0.8, stagger:0.5}, 0);
  gsap.to(box.value, {
    x: 800,
    y: 200,
    scrollTrigger: {
      start:'top 80%', // (物件開始位置, 捲軸開始位置)
      end:'bottom 20%', // (物件結束位置, 捲軸結束位置)
      /**
       * 觸發動作
       * 進入(滾動條起始標記由上往下對應到 trigger 起始標記)
       * 離開(滾動條結束標記由上往下對應到 trigger 結束標記)
       * 反向進入(滾動條結束標記由下往上對應到 trigger 結束標記)
       * 反向離開(滾動條起始標記由下往上對應到 trigger 起始標記)
       */
      toggleActions: 'play none none node',
      pin: false, // 吸附效果 fixed, sticky
      scrub: true, // 動畫延遲？
      markers:true, // debug
    }
  });
  gsap.to(textH1.value,{
    backgroundSize: '100%',
    ease: 'none',
    scrollTrigger: {
      trigger: textH1.value,
      start: 'center 80%',
      end: 'center 20%',
      markers:true,
      scrub: true,
    }
  })

  ScrollTrigger.create({
    trigger:"h1",
    start:"top top",
    end:"top top",
    endTrigger:"li:last-of-type",
    pin:true,
    markers:true,
    animation:tl,
    scrub:true
  })

  spacer.value.addEventListener('mouseenter', () => {
    const g = [ball.value, ball2.value, ball3.value];
    g.forEach((ball, index) => {
      gsap.killTweensOf(ball)
      gsap.to(ball, {
        x: 150,
        duration: (index * 0.3) + 1,
        ease: `elastic.out(1, 0.3)`
      })
    })

  })

  spacer.value.addEventListener('mouseleave', () => {
    const g = [ball.value, ball2.value, ball3.value];
    g.forEach(ball => {
      gsap.killTweensOf(ball)
      gsap.to(ball, {
        x: 0,
        duration: 1,
        ease: "elastic.out(1, 0.3)"
      })
    });

  })



})
</script>

<template>
  <div ref="spacer" class="spacer" style="height:80vh;">
    <div ref="ball" class="ball">🎾</div>
    <div ref="ball2" class="ball">⚽</div>
    <div ref="ball3" class="ball">⚾</div>
    Scroll Down
  </div>
  <div class="cols2">
    <div class="box" ref="box"><span>1</span></div>
    <h1 ref="textH1" class="text-h1">hello</h1>
    <ul class="rotator">
      <li><span>Akapowl</span></li>
      <li><span>Jack</span></li>
      <li><span>Cassie</span></li>
      <li><span>Rodrigo</span></li>
      <li><span>Shaun</span></li>
      <li><span>Mitchel</span></li>
      <li><span>Craig</span></li>
      <li><span>SHRUG</span></li>
      <li><span>Carl</span></li>
      <li><span>Jonathan</span></li>
      <li><span>Sahil</span></li>
      <li><span>Zach</span></li>
      <li><span>Blake</span></li>
      <li><span>Diaco</span></li>
      <li><span>DIPSCOM</span></li>
    </ul>
  </div>

  <div class="spacer" style="height:80vh; margin-top:80px; margin-bottom:0">The Bottom</div>
  <div class="brand" style="background:black; text-align:center;"><a href="https://www.creativecodingclub.com/bundles/creative-coding-club?src=scrollsnapcdpn" target="_blank"><img src="https://assets.codepen.io/32887/logo-ill.svg" width="300" alt="" /></a></div>
</template>

<style scoped>

.box {
  width: 50px;
  height: 50px;
  color: white;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  overflow: hidden;
  & > span {
    z-index: 10;
  }
}


html {
  scroll-snap-type: y proximity;
}

li{
  scroll-snap-align: center;
  padding-left:0.2em;
}

body {
  margin:0;
}

.spacer {
  color:#2d2d3f;
  display:flex;
  align-items:center;
  justify-content:center;
  background:#eaf3fa;
  margin-bottom:80px;
  font-size:40px;
}

li{
  /* IMPORTANT FOR THE SNAPPING */
  scroll-snap-align: center;
  padding-left:0.2em;
}

li > span {
  display:inline-block;
}


.cols2 {
  padding-left:20px;
  display: flex;
  /* outline:1px solid green; */
}

h1, ul, li {
  margin:0;
  font-weight:800;
  text-transform:uppercase;
  letter-spacing:0.06em;
  line-height:1;
  font-size: clamp(30px, 8vw, 60px);

}

ul {
  list-style-type:none;
  padding-left:0;
  /* outline: 1px solid blue; */
}

ul, h1, li {
  margin:0;
  line-height:1;
}
.text-h1 {
  width: 200px;
  flex-grow: 0;
  align-self: flex-start;
  background: linear-gradient(to right, #EC6B07 50%, rgb(255, 255, 255) 100%) no-repeat;
  -webkit-background-clip: text;
  background-clip: text;
  background-size: 0;
  transition: background-size cubic-bezier(.1,.5,.5,1) 0.5s;
  border-bottom: 1px solid #2F2B28;
  letter-spacing: -.01em;
  line-height: 100%;
  margin: 0;
  color: rgb(236, 107, 7, 0.5);
}


</style>
