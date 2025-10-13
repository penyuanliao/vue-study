<script setup lang="ts">

import { gsap } from 'gsap';



</script>

<template>
    <!--
        定義一個可重用的 SVG 裁切路徑。
        它被設為 display: none，所以不會影響頁面佈局。
        clipPathUnits="objectBoundingBox" 讓路徑可以自動縮放以適應元素大小。
    -->
    <svg width="0" height="0" style="position: absolute;">
        <defs>
            <clipPath id="rounded-diamond" clipPathUnits="objectBoundingBox">
                <path d="M 0.45 0.05 Q 0.5 0 0.55 0.05 L 0.95 0.45 Q 1 0.5 0.95 0.55 L 0.55 0.95 Q 0.5 1 0.45 0.95 L 0.05 0.55 Q 0 0.5 0.05 0.45 Z" />
            </clipPath>
        </defs>
    </svg>
    <article class="gallery">
        <div class="image">
            <img src="https://assets.codepen.io/1506195/unsplash-music-3.avif" style="height: 100%; object-fit: cover;"/>
        </div>
        <div class="image" v-for="index in 17" />
    </article>
</template>

<style scoped>
.gallery {
    --size: 100px;
    display: grid;
    grid-template-columns: repeat(8, var(--size));
    grid-auto-rows: var(--size);
    gap: 5px;
    place-items: start center;
    margin-bottom: var(--size);
    .image {
        width: calc(var(--size) * 2);
        height: calc(var(--size) * 2);
        object-fit: cover;
        grid-column: auto / span 2;
        border-radius: 5px;
        /* 透過 url() 引用在上面 SVG 中定義的裁切路徑，這比 path() 函式更穩定 */
        clip-path: url(#rounded-diamond);
        background-color: #F15624;
        border: black solid 1px;
        transition: all 0.2s ease;
        &:hover {
            scale: 1.2;
            z-index: 10;
        }
    }

}
.gallery .image:nth-child(18n + 5),
.gallery .image:nth-child(18n + 12)
{
    grid-column-start: 2;
}
</style>
