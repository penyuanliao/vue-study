<script lang="ts">
import { defineComponent } from 'vue';
import NSymbols from '../Button/NSymbols.vue';

export default defineComponent({
    name: 'NDialog',
    components: { NSymbols },
    props: {
        label: {
            type: String,
            default: '一周内更新资讯',
            required: true
        },
        open: {
            type: Boolean,
            default: true
        }
    },
    emits: ['update:open', 'close'],
    setup(_, { emit }) {
        const onCloseHandle = () => {
            emit('update:open', false);
            emit('close');
        }
        return {
            onCloseHandle
        };
    }
});
</script>

<template>
    <Transition name="dialog">
        <div
            v-if="open"
            class="n-dialog-wrapper"
        >
            <section class="dialog-content">
                <div class="desc-picture">
                    <div class="desc-rect">
                        <NSymbols class="bookmark" name="bookmark" />
                        <div class="mask" />
                        <div class="updated" />
                    </div>
                </div>
                <div class="column">
                    <div class="tips-icon">
                        <NSymbols class="svg" width="15" height="15" name="tips" />
                        <span>Tips</span>
                    </div>
                    <div class="tips-label">{{ label }}</div>
                </div>
                <div
                    class="close-btn"
                    @pointerup="onCloseHandle"
                >
                    <NSymbols name="close" />
                </div>
            </section>
        </div>
    </Transition>

</template>

<style scoped lang="scss">
@use '../theme';

.n-dialog-wrapper {
    width: 360px;
    height: 130px;
    min-height: 10px;
    min-width: 10px;
    position: absolute;
    top: 157px;
    left: calc(1 / 2 * 100%);
    transform: translateX(calc(calc(1 / 2 * 100%) * -1));
    box-shadow: 0 15px 50px 0 #00000099;
    background: radial-gradient(
            57% 131% at 76% 114%,
            #2F00B0 0%,
            #00023E 100%);
    transition: opacity 0.3s ease;
    border-radius: 10px;
}
.dialog-content {
    width: 100%;
    height: 100%;
    display: flex;
    .column {
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        padding-top: 27px;
    }
}
.close-btn {
    position: absolute;
    top: 9px;
    right: 9px;
    color: #9F9F9F;
    cursor: pointer;
    &:hover {
        color: #F15624;
    }
    &:active {
        color: #F15624;
        scale: 0.95;
    }
}
.tips-icon {
    width: 53px;
    height: 21px;
    border: 1px #F15624 solid;
    box-sizing: border-box;
    border-radius: 999px;
    display: flex;
    align-items: center;
    padding: 0 3px;
    flex-direction: row;
    flex-shrink: 0;
    color: #F15624;
    .svg {
        flex-shrink: 0;
    }
    span {
        color: #F15624;
        font-weight: 700;
        font-size: 12px;
        text-indent: 3px;
        cursor: default;
        user-select: none;
    }
}

.desc-picture {
    min-width: 118px;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    .desc-rect {
        height: 47px;
        width: 76px;
        position: relative;
        background: #DFDFDF;
        border-radius: 999px;
        display: flex;
        align-items: center;
        justify-content: center;
        .mask {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            background: linear-gradient(-90deg, #00023E 29%, #00023E00 80%);
        }

        .updated {
            width: 31px;
            height: 31px;
            position: absolute;
            background: #FF0000;
            border: white 2px solid;
            border-radius: 50%;
            box-shadow: 0 4px 4px 0 #00000040;
            left: -10px;
            top: -10px;
        }
    }
}
.dialog-enter-from,
.dialog-leave-to {
    opacity: 0;
}
.dialog-enter-to,
.dialog-leave-from {
    opacity: 1;
}

.tips-label {
    width: 100%;
    color: white;
    font-weight: 700;
    font-size: 24px;
    text-align: left;
    text-overflow: ellipsis;
    overflow:hidden;
    white-space: nowrap;
    line-height: 29px;
    padding: 14px 0;
    cursor: default;
    user-select: none;
}
</style>
