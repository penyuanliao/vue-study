<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'GridType',
    emits: ['change'],
    setup() {
        const layout = ref('medium');

        return { layout };
    },
    methods: {
        onChangeHandle() {
            this.$emit('change', this.layout);
        }
    }
});
</script>

<template>
    <div class="button-group">
        <label
            class="layout-option"
            :class="{ selected: layout === 'small' }"
        >
            <input
                type="radio"
                name="calendar-layout"
                value="small"
                v-model="layout"
                @change="onChangeHandle"
            />
            <span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="22"
                    viewBox="0 0 24 22"
                    fill="none"
                >
                    <rect
                        width="24"
                        height="4"
                        rx="2"
                        fill="currentColor"
                    />
                    <rect
                        y="6"
                        width="24"
                        height="4"
                        rx="2"
                        fill="currentColor"
                    />
                    <rect
                        y="12"
                        width="24"
                        height="4"
                        rx="2"
                        fill="currentColor"
                    />
                    <rect
                        y="18"
                        width="24"
                        height="4"
                        rx="2"
                        fill="currentColor"
                    />
                </svg>
            </span>
        </label>
        <label
            class="layout-option"
            :class="{ selected: layout === 'medium' }"
        >
            <input
                type="radio"
                name="calendar-layout"
                value="medium"
                v-model="layout"
                @change="onChangeHandle"
            />
            <span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="22"
                    viewBox="0 0 24 22"
                    fill="none"
                >
                    <rect
                        width="24"
                        height="10"
                        rx="3"
                        fill="currentColor"
                    />
                    <rect
                        y="12"
                        width="24"
                        height="10"
                        rx="3"
                        fill="currentColor"
                    />
                </svg>
            </span>
        </label>
    </div>
</template>

<style scoped lang="scss">
@use '../theme';

.button-group {
    height: 100px;
    min-width: 36px;
    position: relative;
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: row;
    .layout-option {
        width: 36px;
        height: 36px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #DFDFDF;
        transition: 0.3s;
        cursor: pointer;
        &.selected {
            color: #F15624;
        }
        &:active {
            scale: .9;
        }
    }
}
input {
    display: none;
}

</style>
