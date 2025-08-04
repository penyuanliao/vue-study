<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, watch } from 'vue';
import NSymbols from './NSymbols.vue';

export default defineComponent({
    name: 'NClearInput',
    components: { NSymbols },
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
            searchInput.value?.focus();
        };
        const onInputFocusoutHandle = () => {
            if (!searchValue.value) {
                // emit('change', searchValue.value);
            }
        }
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
            onClearClickHandle,
            onInputFocusoutHandle
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
            <NSymbols name="close" />
        </span>
        <input
            class="calendar-search-input font"
            type="text"
            placeholder=""
            v-model="searchValue"
            @focusout="onInputFocusoutHandle"
            ref="searchInput"
            tabindex="1"
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
