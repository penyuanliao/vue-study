<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, watch } from 'vue';

export default defineComponent({
    name: 'NClearInput',
    props: {
        inputValue: {
            type: String,
            default: ''
        }
    },
    emits: ['change', 'update:inputValue'],
    setup(props, { emit }) {
        // 文字輸入框物件
        const searchInput = ref<HTMLInputElement | null>(null);
        // 文字輸入框值
        const searchValue = ref<string>('');

        // 清除文字
        const onClearClickHandle = () => {
            console.log('onClearClickHandle');
            searchValue.value = '';
            searchInput.value.focus();
        };
        const onKeyupHandle = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                emit('change', searchValue.value);
                // onClearClickHandle();
            }
        };
        onMounted(() => {
            if (searchInput.value) {
                searchInput.value.addEventListener('keyup', onKeyupHandle);
                searchInput.value.focus();
            }
        });
        onUnmounted(() => {
            if (searchInput.value) {
                searchInput.value.removeEventListener('keyup', onKeyupHandle);
            }
        });
        watch(() => searchValue.value, (value) => {
            emit('update:inputValue', value);
        });

        return {
            searchValue,
            searchInput,
            onClearClickHandle
        };
    }
});
</script>

<template>
    <div class="input-container">
        <span
            class="hidden-mirror font"
        >{{ searchValue }}&nbsp;</span>
        <span
            class="clear-button "
            v-if="searchValue.length > 0"
            @pointerup="onClearClickHandle"
        >
            <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M13.6516 9.65165C13.9445 9.35876 13.9445 8.88388 13.6516 8.59099C13.3588 8.2981 12.8839 8.2981 12.591 8.59099L11 10.182L9.40901 8.59099C9.11612 8.2981 8.64124 8.2981 8.34835 8.59099C8.05546 8.88388 8.05546 9.35876 8.34835 9.65165L9.93934 11.2426L8.34835 12.8336C8.05546 13.1265 8.05546 13.6014 8.34835 13.8943C8.64124 14.1872 9.11612 14.1872 9.40901 13.8943L11 12.3033L12.591 13.8943C12.8839 14.1872 13.3588 14.1872 13.6517 13.8943C13.9445 13.6014 13.9445 13.1265 13.6517 12.8336L12.0607 11.2426L13.6516 9.65165Z"
                    fill="currentColor"
                />
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M11 0.25C5.06294 0.25 0.25 5.06294 0.25 11C0.25 16.9371 5.06294 21.75 11 21.75C16.9371 21.75 21.75 16.9371 21.75 11C21.75 5.06294 16.9371 0.25 11 0.25ZM1.75 11C1.75 5.89137 5.89137 1.75 11 1.75C16.1086 1.75 20.25 5.89137 20.25 11C20.25 16.1086 16.1086 20.25 11 20.25C5.89137 20.25 1.75 16.1086 1.75 11Z"
                    fill="currentColor"
                />
            </svg>
        </span>
        <input
            class="calendar-search-input font"
            type="text"
            placeholder=""
            v-model="searchValue"
            @focusout="onInputFocusoutHandle"
            ref="searchInput"
        />
    </div>
</template>

<style scoped lang="scss">
@use '../theme';
.input-container {
    width: 220px;
    height: 65px;
    min-width: 50px;
    display: flex;
    position: relative;
    align-items: center;
    justify-content: left;
    text-align: center;
    margin-left: 20px;
    .font {
        font-size: 19px;
        font-weight: 700;
        text-align: left;
    }

    .calendar-search-input {
        position: absolute;
        left: 0;
        width: calc(100% - 26px);
        height: 100%;
        background: transparent;
        border: none;
        &:focus {
            outline: none;
        }
        &.hidden {
            width: 0;
        }
    }
    .hidden-mirror {
        //position: absolute;
        visibility: hidden;
        position: relative;
        display: block;
        overflow: hidden;
        white-space: pre;
        pointer-events: none;
        color: red;
    }
    .clear-button {
        width: 22px;
        height: 22px;
        position: relative;
        z-index: 10;
        cursor: pointer;
        color: #9F9F9F;
        padding-left: 4px;
        &:active {
            color: #F15624;
        }
    }
}
</style>
