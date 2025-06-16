<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'NTooltip',
    props: {
        label: {
            type: String,
            default: '一周内更新资讯',
            required: true
        }
    }
});
</script>

<template>
    <div class="n-tooltip-wrapper">
        <slot />
        <div class="n-tooltip">
            <div class="tips-icon">
                <svg
                    width="21"
                    height="20"
                    viewBox="0 0 21 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M10.8679 1.22287C15.7687 1.22298 19.7419 5.19609 19.7419 10.0969C19.7418 14.9976 15.7686 18.9708 10.8679 18.9709C5.96711 18.9709 1.99401 14.9977 1.9939 10.0969C1.9939 5.19602 5.96704 1.22287 10.8679 1.22287ZM13.6404 7.32443C13.4823 7.16634 13.2512 7.10605 13.0359 7.16623L9.38745 8.18771C9.1793 8.24601 9.0161 8.40829 8.95776 8.61642L7.93628 12.2649C7.87605 12.4802 7.93734 12.7112 8.09546 12.8694C8.25361 13.0274 8.48461 13.0879 8.69995 13.0276L12.3484 12.0061C12.5563 11.9477 12.7188 11.7853 12.7771 11.5774L13.7986 7.92892C13.8588 7.71362 13.7984 7.48255 13.6404 7.32443Z"
                        fill="white"
                    />
                </svg>
                <span>Tips</span>
            </div>
            <p class="tips-label">{{ label }}</p>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use '../theme';

.n-tooltip-wrapper {
    width: auto;
    height: auto;
    min-height: 10px;
    min-width: 10px;
    position: absolute;
    top: 0;
    left: 0;
    &:hover {
        .n-tooltip {
            opacity: 1;
        }
    }
}
.n-tooltip {
    width: 297px;
    height: 67px;
    position: absolute;
    left: calc(-100%);
    top: calc(1 / 2 * 100%);
    transform: translateX(calc(100% * -1)) translateY(calc(calc(1 / 2 * 100%) * -1));
    display: flex;
    flex-direction: row;
    background: radial-gradient(
            57% 131% at 76% 114%,
            #2F00B0 0%,
            #00023E 100%);
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.6);
    border-radius: 10px;
    align-items: center;
    padding: 0 20px;
    transition: opacity 0.3s ease;
    opacity: 0;
    pointer-events: none;
    &:after {
        content: '';
        position: absolute;
        width: 23px;
        height: 23px;
        right: -18px;
        top: calc(1 / 2 * 100%);
        transform: translateY(calc(calc(1 / 2 * 100%) * -1));
        background: #00023E;
        clip-path: polygon(75% 50%, 0 0, 0 100%);
        border-radius: 2px;
        z-index: -1;

    }
}
.tips-icon {
    width: 70px;
    height: 27px;
    border: 1px white solid;
    box-sizing: border-box;
    border-radius: 999px;
    display: flex;
    align-items: center;
    padding: 0 3px;
    flex-direction: row;
    flex-shrink: 0;
    span {
        color: white;
        font-weight: 700;
        font-size: 15px;
        text-indent: 3px;
    }
}
.tips-label {
    width: 100%;
    color: white;
    font-size: 20px;
    font-weight: 700;
    text-indent: 16px;
    text-align: left;
    text-overflow: ellipsis;
    overflow:hidden;
    white-space: nowrap;
}
</style>
