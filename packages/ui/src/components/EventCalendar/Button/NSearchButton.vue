<script lang="ts">
import { defineComponent, onMounted, ref, watch, nextTick, computed } from 'vue';
import NSearchFilterTags from "@/components/EventCalendar/Button/NSearchFilterTags.vue";
import NClearInput from "@/components/EventCalendar/Button/NClearInput.vue";

export default defineComponent({
    name: 'NSearchButton',
    components: { NClearInput, NSearchFilterTags },
    props: {
        width: {
            type: Number,
            default: 315
        },
        height: {
            type: Number,
            default: 65
        }
    },
    emits: ['submit'],
    setup(props, { emit }) {

        const searchContainer = ref<HTMLDivElement>();
        const searchTags = ref<string[]>([]);
        const inputValue = ref<string>('');

        // 開啟搜尋
        const isOpened = ref<boolean>(false);
        // 進行收尋
        const isSearching = ref<boolean>(false);

        // 開啟搜尋
        const onOpenHandle = () => {
            console.log('onOpenHandle', isOpened.value);
            if (isOpened.value) {
                isSearching.value = true;
                emit('submit', inputValue.value);
                isOpened.value = true;

                if (inputValue.value.length === 0) {

                    isOpened.value = !isOpened.value;
                    isSearching.value = false;
                }

            } else {
                isOpened.value = !isOpened.value;
                isSearching.value = false;
            }
        }
        const onInputChangeHandle = (inputStr: string) => {
            console.log("onInputChangeHandle", inputStr);
        }
        onMounted(() => {
            const container = searchContainer.value;
            if (container) {
                if (window.innerWidth < 959) {
                    container.style.setProperty('--search-button-width', `${window.innerWidth}px`);
                } else {
                    container.style.setProperty('--search-button-width', `${props.width}px`);
                }

                container.style.setProperty('--search-button-height', `${props.height}px`);
            }
        });


        return {
            searchContainer,
            inputValue,
            searchTags,
            onOpenHandle,
            onInputChangeHandle,
            isOpened,
            isSearching
        };
    }
});
</script>

<template>
    <div
        class="search-button-container"
        ref="searchContainer"
    >
        <div
            class="search-input-box"
            :class="{
                'active': isOpened
            }"
        >
            <NClearInput
                class="clear-input"
                v-if="isOpened"
                v-model:inputValue="inputValue"
                @change="onInputChangeHandle"
            />
        </div>
        <div
            class="calendar-search-button"
            :class="{
                'active': isOpened,
                'searching': isSearching
            }"
            @pointerup="onOpenHandle"
        >
            <span class="search-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M10 0.25C4.61522 0.25 0.25 4.61522 0.25 10C0.25 15.3848 4.61522 19.75 10 19.75C15.3848 19.75 19.75 15.3848 19.75 10C19.75 4.61522 15.3848 0.25 10 0.25ZM1.75 10C1.75 5.44365 5.44365 1.75 10 1.75C14.5563 1.75 18.25 5.44365 18.25 10C18.25 14.5563 14.5563 18.25 10 18.25C5.44365 18.25 1.75 14.5563 1.75 10Z" fill="currentColor"/>
                    <path d="M18.5304 17.4698C18.2375 17.1769 17.7626 17.1769 17.4697 17.4698C17.1768 17.7626 17.1768 18.2375 17.4697 18.5304L21.4696 22.5304C21.7625 22.8233 22.2374 22.8233 22.5303 22.5304C22.8232 22.2375 22.8232 21.7626 22.5303 21.4697L18.5304 17.4698Z" fill="currentColor"/>
                </svg>
            </span>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use '../theme';

.search-button-container {
    width: var(--search-button-width, 265px);
    height: var(--search-button-height, 65px);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: right;
    flex-shrink: 0;
}
.calendar-search-button {
    width: var(--search-button-height, 65px);
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    border-radius: 999px;
    .search-icon {
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #9F9F9F;
        z-index: 10;
    }
    &.active > .search-icon {
        color: white;
    }
    &.active:after {
        content: '';
        width: calc(var(--search-button-height, 65px) - 12px);
        height: calc(var(--search-button-height, 65px) - 12px);
        position: absolute;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        transition: all 0.3s;
        background-color: #D9D9D9;
    }
    &.searching:after {
        background-color: #F15624;
    }
}
.search-input-box {
    width: var(--search-button-height, 65px);
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: left;
    border: 1px solid #9F9F9F;
    border-radius: 999px;
    z-index: 1;
    background: white;
    transition: all 0.3s;
    color: black;
    font-weight: 700;
    &.active {
        width: 100%;
    }
}

</style>
