<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'NToggleButton',
    emits: ['selected'],
    setup(_, { emit }) {
        const selected = ref<boolean>(false);
        const onSelectedHandle = () => {
            selected.value = !selected.value;
            emit('selected', selected.value);
        }
        return {
            selected,
            onSelectedHandle
        };
    }
});
</script>

<template>
    <div
        class="toggle-button"
        @pointerup="onSelectedHandle"
        :class="{
            selected
        }"
    >
        <slot/>
    </div>
</template>

<style scoped lang="scss">
.toggle-button {
    width: 117px;
    height: 65px;
    display: flex;
    position: relative;
    border-radius: 12px;
    background: white;
    color: #F15624;
    font-weight: 400;
    border: #F15624 1px solid;
    font-size: 23px;
    text-align: center;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    user-select: none;
}
.selected {
    border: white 1px solid;
    background: #F15624;
    color: white;
}
</style>
