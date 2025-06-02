<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

interface ISwitchProps {
  id: string;
  trackOnColor?: string;
  trackOffColor?: string;
  thumbOnColor?: string;
  thumbOffColor?: string;
  width: string;
  height: string;
  border: string;
  text?: string;
}
const data = defineModel<{ checked: boolean }>('data', { default: { checked: false } })
const props = defineProps<ISwitchProps>();
const emits = defineEmits(['change']);
const switchInput = ref<HTMLElement|null>(null);
const switchContainer = ref<HTMLElement|null>(null);
const onChangeHandle = (value: boolean) => {
  data.value.checked = value;
  emits('change', value);
  console.log(`data.value:${data.value.checked}`);
}
const defColor = {
  thumb: '#fff',
  trackOn: '#F15624',
  trackOff: '#DFDFDF'
};

onMounted(() => {
  if (switchContainer.value) {
    switchContainer.value.style.setProperty("--track-on-color", props.trackOnColor || defColor.trackOn);
    switchContainer.value.style.setProperty("--track-off-color", props.trackOffColor || defColor.trackOff);
    switchContainer.value.style.setProperty("--thumb-on-color", props.thumbOnColor || props.thumbOffColor || defColor.thumb);
    switchContainer.value.style.setProperty("--thumb-off-color", props.thumbOffColor || defColor.thumb);
    switchContainer.value.style.setProperty("--thumb-border", `${props.border}px`);
    switchContainer.value.style.setProperty("--switch-width", `${props.width}px`);
    switchContainer.value.style.setProperty("--switch-height", `${props.height}px`);
  }
})
</script>

<template>
  <div class="switch-container" ref="switchContainer">
    <input class="switch-input" ref="switchInput" type="checkbox" :id="id" @change="(e)=> onChangeHandle(e.target.checked)"/>
    <label class="track" :for="id">
      <span class="switch-txt"></span>
    </label>
  </div>
</template>

<style lang="scss" scoped>

.switch-container {
    position: relative;
    display: flex;
    width: var(--switch-width, 100px);
    height: var(--switch-height, 48px);
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
.switch-input:checked + .track {
  background: var(--track-on-color);
}
.track:active:after {
  width: calc(var(--switch-height));
}
.switch-input:checked + .track:after {
  left: calc(100% - var(--thumb-border, '2px'));
  transform: translateX(-100%);
  background: var(--thumb-on-color);
}
</style>
