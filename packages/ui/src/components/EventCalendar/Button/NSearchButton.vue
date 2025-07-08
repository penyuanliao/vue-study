<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import NClearInput from './NClearInput.vue';
import NSymbols from './NSymbols.vue';
import NSearchFilterTags from './NSearchFilterTags.vue';

export default defineComponent({
    name: 'NSearchButton',
    components: {
        NSearchFilterTags,
        NSymbols,
        NClearInput
    },
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
    emits: ['submit', 'open'],
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
            emit('open', isOpened.value);
        };
        const onInputChangeHandle = (inputStr: string) => {
            console.log('onInputChangeHandle', inputStr);
            onOpenHandle();
        };
        const resize = () => {
            const container = searchContainer.value;
            if (container) {
                if (window.innerWidth < 960) {
                    container.style.setProperty('--search-button-width', `${window.innerWidth}px`);
                    container.style.setProperty('--search-button-height', `${40}px`);
                } else {
                    container.style.setProperty('--search-button-width', `${props.width}px`);
                    container.style.setProperty('--search-button-height', `${props.height}px`);
                }
                emit('open', isOpened.value);
            }
        };

        onMounted(() => {
            window.addEventListener('resize', resize);
            resize();
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
            <NSearchFilterTags
                :tags="[]"
                :class="{
                    'tags-input-hidden': true
                }"
            />
            <NClearInput
                v-if="isOpened"
                class="clear-input"
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
                <NSymbols name="search" width="100%" height="100%" />
            </span>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use '../theme';
.tags-input-hidden {
    width: 0;
    overflow: hidden;
    display: none;
}

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
    pointer-events: auto;
    .search-icon {
        width: 24px;
        height: 24px;
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

@media (max-width: 959px) {
    .calendar-search-button {
        .search-icon {
            width: 14px;
            height: 14px;
        }
        &.active:after {
            width: calc(var(--search-button-height, 65px) - 8px);
            height: calc(var(--search-button-height, 65px) - 8px);

        }
    }
}

</style>
