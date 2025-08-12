<script lang="ts">
import { defineComponent, PropType } from 'vue';

// 預設顏色定義
const defColor = {
    thumb: '#fff',
    trackOn: '#F15624',
    trackOff: '#DFDFDF'
};

export default defineComponent({
    name: 'SwitchButton',
    props: {
        id: {
            type: String,
            required: true
        },
        trackOnColor: {
            type: String,
            default: defColor.trackOn,
            required: false
        },
        trackOffColor: {
            type: String,
            default: defColor.trackOff,
            required: false
        },
        thumbOnColor: {
            type: String,
            default: defColor.thumb,
            required: false
        },
        thumbOffColor: {
            type: String,
            default: defColor.thumb,
            required: false
        },
        border: {
            type: String,
            required: true
        },
        data: {
            type: Object as PropType<{ checked: boolean }>,
            default: () => ({ checked: false })
        }
    },
    emits: [
        'change',
        'update:data'
    ],
    mounted() {
        const switchContainerEl = this.$refs.switchContainer as HTMLElement | null;
        if (switchContainerEl) {
            switchContainerEl.style.setProperty('--track-on-color', this.trackOnColor || defColor.trackOn);
            switchContainerEl.style.setProperty('--track-off-color', this.trackOffColor || defColor.trackOff);
            switchContainerEl.style.setProperty('--thumb-on-color', this.thumbOnColor || this.thumbOffColor || defColor.thumb);
            switchContainerEl.style.setProperty('--thumb-off-color', this.thumbOffColor || defColor.thumb);

            switchContainerEl.style.setProperty('--thumb-border', `${this.border}px`);
            // switchContainerEl.style.setProperty('--switch-width', `${this.width}px`);
            // switchContainerEl.style.setProperty('--switch-height', `${this.height}px`);
        }
    },
    methods: {
        onChangeHandle(isChecked: boolean) {
            const newDataState = { ...this.data, checked: isChecked };
            this.$emit('update:data', newDataState);

            this.$emit('change', { checked: isChecked, id: this.id, name: this.data.name });
            console.log(`Emitted data.checked: ${isChecked}`);
        }
    }
});
</script>

<template>
    <div
        class="switch-container"
        ref="switchContainer"
    >
        <label
            class="track"
            :class="{
                on: data.checked
            }"
        >
            <input
                class="switch-input"
                ref="switchInput"
                type="checkbox"
                :checked="data.checked"
                @change="(e: any) => onChangeHandle((e.target as HTMLInputElement).checked)"
            />
            <span class="switch-txt" />
        </label>
    </div>
</template>

<style lang="scss" scoped>
@use '../theme';

/* 樣式保持不變 */
.switch-container {
    --switch-width: 47px;
    --switch-height: 30px;
    position: relative;
    display: flex;
    width: var(--switch-width, 100px);
    height: var(--switch-height, 48px);
    min-width: var(--switch-width, 100px);
}

.switch-input[type=checkbox]{
    height: 0;
    width: 0;
    visibility: hidden;
}

.track {
    cursor: pointer;
    width: 100%;
    height: 100%;
    display: block;
    border-radius: 999px;
    position: relative;
    background: var(--track-off-color);
}
.track:after {
    // thumb
    content: '';
    position: absolute;
    top: var(--thumb-border, 2px);
    left: var(--thumb-border, 2px);
    width: calc(var(--switch-height) - (var(--thumb-border) * 2));
    height: calc(var(--switch-height) - (var(--thumb-border) * 2));
    background: var(--thumb-off-color);
    border-radius: 999px;
    transition: 0.3s;
}
.switch-txt::before,
.switch-txt::after {
    display: block;
    color: #fff;
    font-weight: bold;
    box-sizing: border-box;
}
.switch-txt::before {
    content: attr(turnOn);
    color: #fff;
}
.switch-txt::after {
    content: attr(turnOff);
    color: #ccc;
}
.on {
    background: var(--track-on-color);
}
.track:active:after {
    width: calc(var(--switch-height));
}
.on:after {
    left: calc(100% - var(--thumb-border, 2px));
    transform: translateX(-100%);
    background: var(--thumb-on-color);
}
</style>
