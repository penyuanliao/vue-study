<script lang="ts">
import { defineComponent, onMounted, ref, watch, nextTick, computed } from 'vue';

export default defineComponent({
    name: 'NSearchButton',
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
        const searchValue = ref<string>('');
        const searchInput = ref<HTMLInputElement>();
        const textMirror = ref<HTMLInputElement>();
        const searchFocused = ref<boolean>(false);
        const mirrorWidth = ref<number>(0);
        const inputLayout = {
            left: 20,
            right: 20,
            iconWidth: 30
        };
        const inputMaxWidth = computed(() => {
            console.log('inputMaxWidth', props.width - props.height - inputLayout.left - inputLayout.right - inputLayout.iconWidth);
            return props.width - props.height - inputLayout.left - inputLayout.right - inputLayout.iconWidth;
        });
        const updateMirrorWidth = () => {
            nextTick(() => {
                if (textMirror.value) {
                    const startOffset = (props.width - inputLayout.right - inputLayout.left - inputLayout.iconWidth) - 2;
                    mirrorWidth.value = startOffset - textMirror.value.offsetWidth;
                }
            });
        };

        const onFocusInHandle = () => {
            console.log('onFocusInHandle');
            searchFocused.value = true;
        };
        const onFocusOutHandle = () => {
            console.log('onFocusOutHandle');
            searchFocused.value = false;
            searchValue.value = '';
        };
        const onClearClickHandle = () => {
            console.log('onClearClickHandle');
            searchValue.value = '';
        };
        const onSubmitDownHandle = () => {
            console.log('onSubmitDownHandle');
        };
        const onSubmitUpHandle = () => {
            console.log('onSubmitUpHandle');
            emit('submit', searchValue.value);
        };
        watch(searchValue, updateMirrorWidth);
        onMounted(() => {
            updateMirrorWidth();
            console.log(`searchContainer ${searchContainer.value?.offsetWidth} ${searchContainer.value?.offsetHeight}`);
            const container = searchContainer.value;
            if (container) {
                container.style.setProperty('--search-button-width', `${props.width}px`);
                container.style.setProperty('--search-button-height', `${props.height}px`);
                container.style.setProperty('--search-input-width', `${props.width - inputLayout.left}px`);
                container.style.setProperty('--search-input-padding-right', `${props.height + inputLayout.right + 5}px`);
                container.style.setProperty('--search-input-padding-left', `${inputLayout.left}px`);
            }
        });
        return {
            searchContainer,
            inputLayout,
            searchValue,
            searchInput,
            textMirror,
            searchFocused,
            mirrorWidth,
            inputMaxWidth,
            onFocusInHandle,
            onFocusOutHandle,
            onClearClickHandle,
            onSubmitDownHandle,
            onSubmitUpHandle
        };
    }
});
</script>

<template>
    <div
        class="search-button-container"
        ref="searchContainer"
    >
        <label
            class="calendar-search-button"
            :class="{
                'active': searchFocused
            }"
        >
            <span
                class="search-icon"
                :class="{ 'active': searchFocused }"
                @mousedown.prevent.stop="onSubmitDownHandle"
                @mouseup.prevent.stop="onSubmitUpHandle"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M10 0.25C4.61522 0.25 0.25 4.61522 0.25 10C0.25 15.3848 4.61522 19.75 10 19.75C15.3848 19.75 19.75 15.3848 19.75 10C19.75 4.61522 15.3848 0.25 10 0.25ZM1.75 10C1.75 5.44365 5.44365 1.75 10 1.75C14.5563 1.75 18.25 5.44365 18.25 10C18.25 14.5563 14.5563 18.25 10 18.25C5.44365 18.25 1.75 14.5563 1.75 10Z" fill="currentColor"/>
                    <path d="M18.5304 17.4698C18.2375 17.1769 17.7626 17.1769 17.4697 17.4698C17.1768 17.7626 17.1768 18.2375 17.4697 18.5304L21.4696 22.5304C21.7625 22.8233 22.2374 22.8233 22.5303 22.5304C22.8232 22.2375 22.8232 21.7626 22.5303 21.4697L18.5304 17.4698Z" fill="currentColor"/>
                </svg>
            </span>
            <input
                class="calendar-search-input"
                type='text'
                placeholder=''
                v-model="searchValue"
                ref="searchInput"
                @focusin="onFocusInHandle"
                @focusout="onFocusOutHandle"
            />
            <span
                class="hidden-mirror"
                ref="textMirror"
                :style="{
                    maxWidth: `${ inputMaxWidth }px`
                }"
            >{{ searchValue }}&nbsp;</span>
            <span
                class="clear-button"
                v-if="searchValue.length > 0"
                :style="{
                    right: `${ mirrorWidth }px`
                }"
                @mousedown.prevent.stop="onClearClickHandle"
            >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.6516 9.65165C13.9445 9.35876 13.9445 8.88388 13.6516 8.59099C13.3588 8.2981 12.8839 8.2981 12.591 8.59099L11 10.182L9.40901 8.59099C9.11612 8.2981 8.64124 8.2981 8.34835 8.59099C8.05546 8.88388 8.05546 9.35876 8.34835 9.65165L9.93934 11.2426L8.34835 12.8336C8.05546 13.1265 8.05546 13.6014 8.34835 13.8943C8.64124 14.1872 9.11612 14.1872 9.40901 13.8943L11 12.3033L12.591 13.8943C12.8839 14.1872 13.3588 14.1872 13.6517 13.8943C13.9445 13.6014 13.9445 13.1265 13.6517 12.8336L12.0607 11.2426L13.6516 9.65165Z" fill="#9F9F9F"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M11 0.25C5.06294 0.25 0.25 5.06294 0.25 11C0.25 16.9371 5.06294 21.75 11 21.75C16.9371 21.75 21.75 16.9371 21.75 11C21.75 5.06294 16.9371 0.25 11 0.25ZM1.75 11C1.75 5.89137 5.89137 1.75 11 1.75C16.1086 1.75 20.25 5.89137 20.25 11C20.25 16.1086 16.1086 20.25 11 20.25C5.89137 20.25 1.75 16.1086 1.75 11Z" fill="#9F9F9F"/>
                </svg>
            </span>
        </label>
    </div>
</template>

<style scoped lang="scss">
.search-button-container {
    width: var(--search-button-width, 265px);
    height: var(--search-button-height, 65px);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: right;
}
.calendar-search-input {
    width: var(--search-button-height, 65px);
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #9F9F9F;
    border-radius: 999px;
    z-index: 2;
    transition: all 0.3s;
    cursor: pointer;
    color: black;
    font-size: 19px;
    font-weight: 700;
}
.hidden-mirror {
    position: absolute;
    visibility: hidden;
    white-space: pre;
    font-size: 19px;
    font-weight: 700;
    pointer-events: none;
    text-align: left;
    opacity: 0;
}
.calendar-search-input:focus {
    width: var(--search-input-width, 240px);
    padding-right: var(--search-input-padding-right, 90px);
    padding-left: var(--search-input-padding-left, 20px);
}
.calendar-search-input:focus {
    outline: none;
}
.calendar-search-button {
    width: var(--search-button-height, 65px);
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    &.active:after {
        content: '';
        width: 53px;
        height: 53px;
        position: absolute;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        transition: all 0.3s;
        background-color: #D9D9D9;
        z-index: -1;
    }
}

.search-icon {
    width: var(--search-button-height, 65px);
    height: var(--search-button-height, 65px);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9F9F9F;
    z-index: 10;
    cursor: pointer;

    &.active {
        color: white;
    }
}
.clear-button {
    width: 22px;
    height: 22px;
    position: absolute;
    z-index: 10;
    cursor: pointer;
}

</style>
