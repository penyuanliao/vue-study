<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

const cards = ref<NodeListOf<Element> | null>(null);
const active = ref(false);

const onMouseMove = (e: MouseEvent | TouchEvent, card: HTMLDivElement) => {

  let pos: number[] = [0, 0];

  if (e instanceof MouseEvent) {
    pos = [e.offsetX, e.offsetY];
  } else if (e instanceof TouchEvent && e.touches.length > 0) {
    const touch = e.touches[0];
    pos = [touch.clientX - card.getBoundingClientRect().left, touch.clientY - card.getBoundingClientRect().top];
  }
  // console.log("onMouseMove", pos);
  const { offsetWidth: w, offsetHeight: h } = card;
  const [l, t] = pos;

  const px = Math.abs(Math.floor((100 / w) * l) - 100);
  const py = Math.abs(Math.floor((100 / h) * t) - 100);
  const pa = (50 - px) + (50 - py);

  const lp = 50 + (px - 50) / 1.5;
  const tp = 50 + (py - 50) / 1.5;
  const px_spark = 50 + (px - 50) / 7;
  const py_spark = 50 + (py - 50) / 7;
  const p_opc = 20 + Math.abs(pa) * 1.5;
  const ty = ((tp - 50) / 2) * -1;
  const tx = ((lp - 50) / 1.5) * 0.5;
  // console.log(`ty:${ty} tx: ${tx}`);
  card.classList.remove("active");
  card.classList.remove("animated");
  card.style.transform = `rotateX(${ty}deg) rotateY(${tx}deg)`;

  card.style.setProperty("--card-hover-before-x", `${lp}%`);
  card.style.setProperty("--card-hover-before-y", `${tp}%`);
  card.style.setProperty("--card-hover-after-x", `${px_spark}%`);
  card.style.setProperty("--card-hover-after-y", `${py_spark}%`);
  card.style.setProperty("--card-hover-after-opacity", `${p_opc / 100}`);
};

const onMouseOut = (card: HTMLDivElement) => {
  card.style.setProperty("--card-hover-before-x", `50%`);
  card.style.setProperty("--card-hover-before-y", `50%`);
  card.style.setProperty("--card-hover-after-x", `50%`);
  card.style.setProperty("--card-hover-after-y", `50%`);
  card.style.setProperty("--card-hover-after-opacity", `1`);
  card.style.transform = "";
};

const onClickHandle = () => {
  active.value = !active.value;
}

onMounted(() => {
  cards.value = document.querySelectorAll(".card");
  cards.value.forEach((element: Element) => {
    const card = (element as HTMLDivElement);
    const parent = card.parentElement as HTMLDivElement;
    parent.addEventListener("mousemove", (e: MouseEvent) => onMouseMove(e, card));
    parent.addEventListener("touchmove", (e: TouchEvent) => onMouseMove(e, card));
    parent.addEventListener("mouseout", () => onMouseOut(card));
    parent.addEventListener("touchend", () => onMouseOut(card));
    parent.addEventListener("touchcancel", () => onMouseOut(card));
    parent.addEventListener("click", () => onClickHandle());
  });
});

onBeforeUnmount(() => {
  cards.value?.forEach((element: Element) => {
    const card = element as HTMLDivElement;
    const parent = card.parentElement as HTMLDivElement;
    parent.removeEventListener("mousemove", (e: MouseEvent) => onMouseMove(e, card));
    parent.removeEventListener("touchmove", (e: TouchEvent) => onMouseMove(e, card));
    parent.removeEventListener("mouseout", () => onMouseOut(card));
    parent.removeEventListener("touchend", () => onMouseOut(card));
    parent.removeEventListener("touchcancel", () => onMouseOut(card));
  });
});

</script>

<template>
  <!-- https://codepen.io/gayane-gasparyan/pen/wvxewXO -->
  <!-- https://codepen.io/robin-dela/pen/jVddbq -->
  <!-- https://codepen.io/Chokcoco/pen/yLwOexQ -->
  <!-- https://codepen.io/simeydotme/pen/PrQKgo -->
  <section class="card-container">
    <div class="card pika"></div>
  </section>
</template>

<style scoped>
.card-container {
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  perspective: 1000px;

  --start-color: rgb(0, 231, 255);
  --ended-color: rgb(255, 0, 231);
  --back: url(https://cdn2.bulbagarden.net/upload/1/17/Cardback.jpg);
  --charizard1: #fac;
  --charizard2: #ddccaa;
  --charizardfront: url(https://assets.codepen.io/13471/charizard-gx.webp);
  --pika1: #54a29e;
  --pika2: #a79d66;
  --pikafront: url(https://assets.codepen.io/13471/pikachu-gx.webp);
  --eevee1: #efb2fb;
  --eevee2: #acc6f8;
  --eeveefront: url(https://assets.codepen.io/13471/eevee-gx.webp);
  --mewtwo1: #efb2fb;
  --mewtwo2: #acc6f8;
  --mewtwofront: url(https://assets.codepen.io/13471/mewtwo-gx.webp);
  --card-hover-after-x: 0;
  --card-hover-after-y: 0;
  --card-hover-after-opacity: 1;
  --card-hover-before-x: 50%;
  --card-hover-before-y: 50%;
  --card-effect-1: url(https://assets.codepen.io/13471/sparkles.gif);
  --card-effect-2: url(https://assets.codepen.io/13471/holo.png);

}
.charizard {
  --start-color: var(--charizard1);
  --ended-color: var(--charizard2);
  --card-cover-image: var(--charizardfront);
}

.pika {
  --start-color: var(--pika1);
  --ended-color: var(--pika2);
  --card-cover-image: var(--pikafront);
}
.mewtwo {
  --start-color: var(--mewtwo1);
  --ended-color: var(--mewtwo2);
  --card-cover-image: var(--mewtwofront);
}
.back {
  position: absolute;
  width: 100%;
  height: 100%;
}
.card {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  z-index: 10;
  touch-action: none;

  border-radius: 5% / 3.5%;
  box-shadow:
    -5px -5px 5px -5px var(--start-color),
    5px 5px 5px -5px var(--ended-color),
    -7px -7px 10px -5px transparent,
    7px 7px 10px -5px transparent,
    0 0 5px 0 rgba(255,255,255,0),
    0 15px 35px -20px rgba(0, 0, 0, 0.5);

  transition: transform 0.5s ease, box-shadow 0.2s ease;
  will-change: transform, filter;

  background-color: #040712;
  background-image: var(--card-cover-image);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  transform-origin: center;
  transform-style: preserve-3d;

}

.card:hover {
  box-shadow:
    -20px -20px 30px -25px var(--start-color),
    20px 20px 30px -25px var(--ended-color),
    -7px -7px 10px -5px var(--start-color),
    7px 7px 10px -5px var(--ended-color),
    0 0 13px 4px rgba(255,255,255,0.3),
    0 25px 35px -20px rgba(0, 0, 0, 0.5);
}


.card:before,
.card:after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background-repeat: no-repeat;
  opacity: .5;
  mix-blend-mode: color-dodge;
  transition: all .33s ease;
}

.card:before {
  background-position: 50% 50%;
  background-size: 300% 300%;
  background-image: linear-gradient(
    115deg,
    transparent 0%,
    var(--start-color) 25%,
    transparent 45%,
    transparent 55%,
    var(--ended-color) 75%,
    transparent 100%
  );
  opacity: .5;
  filter: brightness(.5) contrast(1);
  z-index: 1;
}

.card:after {
  background-image: var(--card-effect-1),
  var(--card-effect-2),
  linear-gradient(125deg, #ff008450 15%, #fca40040 30%, #ffff0030 40%, #00ff8a20 60%, #00cfff40 70%, #cc4cfa50 85%);
  background-position: 50% 50%;
  background-size: 160%;
  background-blend-mode: overlay;
  z-index: 2;
  filter: brightness(1) contrast(1);
  transition: all .33s ease;
  mix-blend-mode: color-dodge;
  opacity: .75;
}

.card.active:after,
.card:hover:after {
  filter: brightness(1) contrast(1);
  opacity: var(--card-hover-after-opacity);
  background-position: var(--card-hover-after-x, 50%) var(--card-hover-after-y, 50%);
}

.card.active,
.card:hover {
  animation: none;
  transition: box-shadow 0.1s ease-out;
}

.card.active:before,
.card:hover:before {
  animation: none;
  background-image: linear-gradient(
    110deg,
    transparent 25%,
    var(--start-color) 48%,
    var(--ended-color) 52%,
    transparent 75%
  );
  background-position: var(--card-hover-before-x, 50%) var(--card-hover-before-y, 50%);
  background-size: 250% 250%;
  opacity: .88;
  filter: brightness(.66) contrast(1.33);
  transition: none;
}

.card.active:before,
.card:hover:before,
.card.active:after,
.card:hover:after {
  animation: none;
  transition: none;
}

.animated {
  transition: none;
  animation: holoCard 12s ease 0s 1;
  &:before {
    transition: none;
    animation: holoGradient 12s ease 0s 1;
  }
  &:after {
    transition: none;
    animation: holoSparkle 12s ease 0s 1;
  }
}




@keyframes holoSparkle {
  0%, 100% {
    opacity: .75; background-position: 50% 50%; filter: brightness(1.2) contrast(1.25);
  }
  5%, 8% {
    opacity: 1; background-position: 40% 40%; filter: brightness(.8) contrast(1.2);
  }
  13%, 16% {
    opacity: .5; background-position: 50% 50%; filter: brightness(1.2) contrast(.8);
  }
  35%, 38% {
    opacity: 1; background-position: 60% 60%; filter: brightness(1) contrast(1);
  }
  55% {
    opacity: .33; background-position: 45% 45%; filter: brightness(1.2) contrast(1.25);
  }
}

@keyframes holoGradient {
  0%, 100% {
    opacity: 0.5;
    background-position: 50% 50%;
    filter: brightness(.5) contrast(1);
  }
  5%, 9% {
    background-position: 100% 100%;
    opacity: 1;
    filter: brightness(.75) contrast(1.25);
  }
  13%, 17% {
    background-position: 0 0;
    opacity: .88;
  }
  35%, 39% {
    background-position: 100% 100%;
    opacity: 1;
    filter: brightness(.5) contrast(1);
  }
  55% {
    background-position: 0 0;
    opacity: 1;
    filter: brightness(.75) contrast(1.25);
  }
}

@keyframes holoCard {
  0%, 100% {
    transform: rotateZ(0deg) rotateX(0deg) rotateY(0deg);
  }
  5%, 8% {
    transform: rotateZ(0deg) rotateX(6deg) rotateY(-20deg);
  }
  13%, 16% {
    transform: rotateZ(0deg) rotateX(-9deg) rotateY(32deg);
  }
  35%, 38% {
    transform: rotateZ(3deg) rotateX(12deg) rotateY(20deg);
  }
  55% {
    transform: rotateZ(-3deg) rotateX(-12deg) rotateY(-27deg);
  }
}
</style>
