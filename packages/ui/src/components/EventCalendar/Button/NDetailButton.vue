<script lang="ts">
import { defineComponent } from 'vue';
import NSymbols from './NSymbols.vue';

export default defineComponent({
    name: 'NDetailButton',
    props: {
        color: {
            type: String,
            default: '#FF9FA0'
        }
    },
    components: { NSymbols },
});
</script>

<template>
    <div
        class="detail-btn-container"
        :style="{
            '--detail-bg-color': color
        }"

    >
        <div class="label">
            <slot>详情</slot>
        </div>
        <div class="icon">
            <slot name="icon">
                <NSymbols name="rightArrow"/>
            </slot>
        </div>
    </div>
</template>

<style scoped lang="scss">
.detail-btn-container {
    position: absolute;
    width: 70px;
    height: 27px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-radius: 999px;
    border: 1px solid white;
    background-color: white;
    padding-right: 7px;
    padding-left: 14px;

    .label {
        font-size: 12px;
        font-weight: 700;
        color: var(--detail-bg-color, white);
        user-select: none;
    }
    .icon {
        width: 19px;
        height: 19px;
        color: var(--detail-bg-color, white);
    }

    &:hover {
        border-color: white;
        background-color: var(--detail-bg-color, white);
        .label {
            color: white;
        }
        .icon {
            color: white;
        }
    }
}
</style>
