<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'NToggleButton',
    props: {
        selected: {
            type: Boolean,
            default: false
        },
        once: {
            type: Boolean,
            default: false
        }
    },
    emits: ['selected', 'update:selected'],
    setup(props, { emit }) {
        const onSelectedHandle = () => {
            const selected = !props.selected;
            if (!selected && props.once) return;
            emit('update:selected', selected);
            emit('selected', selected);
        };

        return {
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
        <slot />
    </div>
</template>

<style scoped lang="scss">
@use '../theme';

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
    transition: background-color 0.2s ease-in-out;
}
.selected {
    border: white 1px solid;
    background: #F15624;
    color: white;
}
</style>
