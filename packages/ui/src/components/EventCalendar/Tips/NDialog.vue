<script lang="ts">
import { defineComponent, ref } from 'vue';
import NSymbols from '../Button/NSymbols.vue';

export default defineComponent({
    name: 'NDialog',
    components: { NSymbols },
    props: {
        label: {
            type: Array,
            default: [
                '红点为一周内上架活动',
                '显示日期小于四日活动',
                '独家活动'
            ],
            required: true
        },
        open: {
            type: Boolean,
            default: true
        },
        theme: {
            type: String,
            default: 'dark'
        }
    },
    emits: ['update:open', 'close'],
    setup(_, { emit }) {
        const visible = ref<boolean>(false);
        const onCloseHandle = () => {
            visible.value = false;
            emit('update:open', false);
            emit('close');
        };
        const onShowHandle = () => {
            visible.value = true;
            console.log("onShowHandle");
        }
        return {
            visible,
            onCloseHandle,
            onShowHandle
        };
    }
});
</script>

<template>
    <Transition name="dialog">
        <div
            v-if="open || visible"
            :class="`n-dialog-wrapper theme-${theme}`"
        >
            <div class="dialog-header">
                <div>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM12 6.25C12.4142 6.25 12.75 6.58579 12.75 7V13C12.75 13.4142 12.4142 13.75 12 13.75C11.5858 13.75 11.25 13.4142 11.25 13V7C11.25 6.58579 11.5858 6.25 12 6.25ZM12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z" fill="currentColor"/>
                    </svg>
                </div>
                <span>Tips</span>
            </div>
            <section class="dialog-content">
                <div class="column">
                    <div class="row">
                        <div class="icon">
                            <svg width="53" height="35" viewBox="0 0 53 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect opacity="0.3" x="10" y="35" width="30" height="43" rx="15" transform="rotate(-90 10 35)" fill="currentColor"/>
                                <g opacity="0.3">
                                    <path d="M24 18C24 16.1387 24 15.2081 24.2447 14.4549C24.7393 12.9327 25.9327 11.7393 27.4549 11.2447C28.2081 11 29.1387 11 31 11C32.8613 11 33.7919 11 34.5451 11.2447C36.0673 11.7393 37.2607 12.9327 37.7553 14.4549C38 15.2081 38 16.1387 38 18V25.3874C38 27.3045 38 28.2631 37.658 28.77C37.2403 29.3893 36.5122 29.7242 35.7701 29.6383C35.1627 29.568 34.4349 28.9442 32.9793 27.6965C32.3386 27.1474 32.0182 26.8728 31.6663 26.7484C31.2352 26.5961 30.7648 26.5961 30.3337 26.7484C29.9818 26.8728 29.6614 27.1474 29.0207 27.6965C27.5651 28.9442 26.8373 29.568 26.2299 29.6383C25.4878 29.7242 24.7597 29.3893 24.342 28.77C24 28.2631 24 27.3045 24 25.3874V18Z" fill="white"/>
                                </g>
                                <g filter="url(#filter0_d_2084_1745)">
                                    <circle cx="14" cy="10" r="10" fill="#FF0000"/>
                                    <circle cx="14" cy="10" r="9" stroke="white" stroke-width="2"/>
                                </g>
                            </svg>
                        </div>
                        <span>{{ label[0] }}</span>
                    </div>
                    <div class="row">
                        <div class="icon">
                            <svg width="43" height="30" viewBox="0 0 43 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect y="30" width="30" height="43" rx="15" transform="rotate(-90 0 30)" fill="currentColor"/>
                                <path d="M14 13C14 11.1387 14 10.2081 14.2447 9.45492C14.7393 7.93273 15.9327 6.73931 17.4549 6.24472C18.2081 6 19.1387 6 21 6C22.8613 6 23.7919 6 24.5451 6.24472C26.0673 6.73931 27.2607 7.93273 27.7553 9.45492C28 10.2081 28 11.1387 28 13V20.3874C28 22.3045 28 23.2631 27.6581 23.77C27.2403 24.3893 26.5122 24.7242 25.7701 24.6383C25.1627 24.568 24.4349 23.9442 22.9793 22.6965C22.3386 22.1474 22.0182 21.8728 21.6663 21.7484C21.2352 21.5961 20.7648 21.5961 20.3337 21.7484C19.9818 21.8728 19.6614 22.1474 19.0207 22.6965C17.5651 23.9442 16.8373 24.568 16.2299 24.6383C15.4878 24.7242 14.7597 24.3893 14.342 23.77C14 23.2631 14 22.3045 14 20.3874V13Z" fill="white"/>
                            </svg>
                        </div>
                        <span>{{ label[1] }}</span>
                    </div>
                    <div class="row">
                        <div class="icon">
                            <svg width="43" height="30" viewBox="0 0 43 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect y="30" width="30" height="43" rx="15" transform="rotate(-90 0 30)" fill="currentColor"/>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M23.0254 8.75812C22.3929 6.74729 19.6071 6.74729 18.9746 8.75812C18.8844 9.0448 18.6359 9.21631 18.38 9.21631C16.271 9.21631 15.5079 11.93 17.1202 13.1401C17.3424 13.3068 17.4467 13.6157 17.3553 13.906C17.0455 14.8912 17.4429 15.8128 18.121 16.3217C18.8025 16.8332 19.8037 16.9498 20.6406 16.3217C20.8566 16.1595 21.1434 16.1595 21.3594 16.3217C22.1963 16.9498 23.1975 16.8332 23.879 16.3217C24.5571 15.8128 24.9545 14.8912 24.6447 13.906C24.5533 13.6157 24.6576 13.3068 24.8798 13.1401C26.4921 11.93 25.729 9.21631 23.62 9.21631C23.3641 9.21631 23.1156 9.0448 23.0254 8.75812ZM18.38 10.7163C19.3176 10.7163 20.1268 10.094 20.4055 9.20819C20.5976 8.59727 21.4024 8.59727 21.5945 9.20819C21.8732 10.094 22.6824 10.7163 23.62 10.7163C23.91 10.7163 24.1265 10.8947 24.2145 11.1745C24.303 11.456 24.2307 11.7518 23.9794 11.9404C23.236 12.4983 22.9363 13.4739 23.2138 14.3561C23.3162 14.6818 23.1936 14.9606 22.9786 15.122C22.7672 15.2807 22.5024 15.304 22.2598 15.122C21.5103 14.5594 20.4897 14.5594 19.7402 15.122C19.4976 15.304 19.2328 15.2807 19.0214 15.122C18.8064 14.9606 18.6838 14.6818 18.7862 14.3561C19.0637 13.4739 18.764 12.4983 18.0206 11.9404C17.7693 11.7518 17.697 11.456 17.7855 11.1745C17.8735 10.8947 18.09 10.7163 18.38 10.7163Z" fill="white"/>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M21 3.25C16.1675 3.25 12.25 7.16751 12.25 12C12.25 14.1147 13.0011 16.0556 14.25 17.5682L14.25 23.4389C14.2499 24.1694 14.2499 24.8022 14.3205 25.2768C14.3918 25.7554 14.5744 26.3562 15.1928 26.6328C15.8017 26.9052 16.3734 26.6551 16.7871 26.4002C17.2009 26.1452 17.693 25.7349 18.2652 25.258L19.2489 24.438C19.796 23.982 20.154 23.6853 20.4511 23.4945C20.7302 23.3153 20.88 23.2807 21 23.2807C21.12 23.2807 21.2698 23.3153 21.5489 23.4945C21.846 23.6853 22.204 23.982 22.7511 24.438L23.7348 25.2579C24.307 25.7349 24.7991 26.1452 25.2129 26.4002C25.6266 26.6551 26.1983 26.9052 26.8072 26.6328C27.4256 26.3562 27.6082 25.7554 27.6795 25.2768C27.7501 24.8022 27.7501 24.1694 27.75 23.4389L27.75 17.5682C28.9989 16.0556 29.75 14.1147 29.75 12C29.75 7.16751 25.8325 3.25 21 3.25ZM13.75 12C13.75 7.99594 16.9959 4.75 21 4.75C25.0041 4.75 28.25 7.99594 28.25 12C28.25 13.8392 27.5661 15.5168 26.4377 16.7953C25.1081 18.3017 23.1653 19.25 21 19.25C18.8349 19.25 16.8922 18.3019 15.5627 16.7958C14.434 15.5172 13.75 13.8394 13.75 12ZM15.8042 25.0559C15.752 24.7055 15.75 24.1869 15.75 23.3787V19.0005C17.2121 20.0986 19.0302 20.75 21 20.75C22.9698 20.75 24.7879 20.0986 26.25 19.0005V23.3787C26.25 24.1869 26.248 24.7055 26.1958 25.0559C26.1857 25.1241 26.175 25.1758 26.1653 25.2144C26.1247 25.1955 26.0704 25.1667 25.9999 25.1232C25.6891 24.9317 25.2802 24.5933 24.6503 24.0683L23.6767 23.2568C23.174 22.8378 22.7445 22.4797 22.3595 22.2324C21.9476 21.9679 21.5142 21.7807 21 21.7807C20.4858 21.7807 20.0524 21.9679 19.6405 22.2324C19.2555 22.4797 18.826 22.8378 18.3233 23.2568L17.3497 24.0683C16.7198 24.5933 16.3109 24.9317 16.0001 25.1232C15.9296 25.1667 15.8753 25.1955 15.8347 25.2144C15.825 25.1758 15.8143 25.1241 15.8042 25.0559ZM26.1282 25.3173C26.128 25.3168 26.1298 25.3131 26.1343 25.3075C26.1306 25.3149 26.1283 25.3177 26.1282 25.3173ZM26.2565 25.2487C26.2627 25.2488 26.2662 25.2495 26.2664 25.2499C26.2666 25.2502 26.2635 25.2502 26.2565 25.2487ZM15.7336 25.2499C15.7338 25.2495 15.7373 25.2488 15.7434 25.2487C15.7365 25.2502 15.7334 25.2502 15.7336 25.2499ZM15.8718 25.3173C15.872 25.3168 15.8702 25.3131 15.8657 25.3075C15.8662 25.3084 15.8666 25.3093 15.867 25.3101C15.87 25.3156 15.8717 25.3177 15.8718 25.3173Z" fill="white"/>
                            </svg>
                        </div>
                        <span>{{ label[2] }}</span>
                    </div>
                </div>
                <div
                    class="close-btn"
                    @pointerup="onCloseHandle"
                >
                    <NSymbols name="close" />
                </div>
            </section>
        </div>
        <div v-else
             class="n-dialog-close-wrapper"
             @pointerup="onShowHandle"
        >
            <div class="dialog-header">
                <div>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M14.5833 7.49996C14.5833 11.412 11.412 14.5833 7.49996 14.5833C3.58794 14.5833 0.416626 11.412 0.416626 7.49996C0.416626 3.58794 3.58794 0.416626 7.49996 0.416626C11.412 0.416626 14.5833 3.58794 14.5833 7.49996ZM7.49996 3.42704C7.79336 3.42704 8.03121 3.66489 8.03121 3.95829V8.20829C8.03121 8.50169 7.79336 8.73954 7.49996 8.73954C7.20656 8.73954 6.96871 8.50169 6.96871 8.20829V3.95829C6.96871 3.66489 7.20656 3.42704 7.49996 3.42704ZM7.49996 11.0416C7.89116 11.0416 8.20829 10.7245 8.20829 10.3333C8.20829 9.94209 7.89116 9.62496 7.49996 9.62496C7.10876 9.62496 6.79163 9.94209 6.79163 10.3333C6.79163 10.7245 7.10876 11.0416 7.49996 11.0416Z" fill="white"/>
                    </svg>
                </div>
                <span>Tips</span>
            </div>
        </div>
    </Transition>
</template>

<style scoped lang="scss">
@use '../theme';

.n-dialog-wrapper {
    width: 232px;
    height: 217px;
    min-height: 10px;
    min-width: 10px;
    position: absolute;
    top: 242px;
    left: calc(1 / 2 * 100%);
    transform: translateX(calc(calc(1 / 2 * 100%) * -1));
    border: rgba(159, 159, 159, 0.3) 2px solid;
    background: white;
    transition: opacity 0.3s ease;
    border-radius: 30px;
    pointer-events: auto;
    span,
    div {
        color: #9F9F9F;
    }
}
.theme-dark {
    box-shadow: 0 15px 50px 0 #00000099;
    background: radial-gradient(
            57% 131% at 76% 114%,
            #2F00B0 0%,
            #00023E 100%);
    span,
    div {
        color: white;
    }
    .icon {
        color: #74DFFF;
    }
}
.theme-light {
    background: white;
}
.dialog-header {
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    span {
        padding-left: 2px;
        font-family: Montserrat,serif;
        font-weight: 700;
        font-size: 18px;
        line-height: 43px;
        letter-spacing: 0;
    }
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
    }
    .row {
        width: 100%;
        height: 35px;
        min-height: 35px;
        position: relative;
        display: flex;
        flex-direction: row;
        margin-bottom: 10px;
        margin-left: 12px;
        span {
            line-height: 35px;
            padding-left: 10px;
            font-size: 13px;
            font-weight: 400;
        }
        .icon {
            width: 50px;
            height: 35px;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            flex-shrink: 0;
        }
    }
}
.close-btn {
    position: absolute;
    top: 15px;
    right: 15px;
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

.n-dialog-close-wrapper {
    width: 53px;
    height: 30px;
    min-height: 10px;
    min-width: 10px;
    position: absolute;
    top: 157px;
    left: 32px;
    transform: translateX(calc(calc(1 / 2 * 100%) * -1));
    border: rgba(159, 159, 159, 0.3) 2px solid;
    transition: opacity 0.3s ease;
    border-radius: 30px;
    pointer-events: auto;
    background: #2F00B0;
    box-shadow: 0 4px 4px 0 #004CFF80;
    .dialog-header {
        pointer-events: none;
        height: 100%;
        color: white;
        span {
            line-height: 12px;
            font-size: 12px;
        }
    }
}

/* Transition 動畫 */
.dialog-enter-from,
.dialog-leave-to {
    opacity: 0;
}
.dialog-enter-to,
.dialog-leave-from {
    opacity: 1;
}
</style>
