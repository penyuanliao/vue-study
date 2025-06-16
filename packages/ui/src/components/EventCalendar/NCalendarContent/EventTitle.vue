<script lang="ts">
import { defineComponent, computed, ref, onMounted, watch } from 'vue';

export default defineComponent({
    name: 'EventTitle',
    props: {
        columnStart: {
            type: Number,
            default: 1
        },
        span: {
            type: Number,
            default: 0
        },
        title: {
            type: String,
            required: false,
            default: 'PG电子'
        },
        link: {
            type: String,
            required: false,
            default: ''
        },
        startTime: {
            type: String,
            required: false,
            default: ''
        },
        endedTime: {
            type: String,
            required: false,
            default: ''
        },
        eventDesc: {
            type: String,
            required: false,
            default: ''
        },
        small: {
            type: Boolean,
            default: false
        },
        hover: {
            type: Boolean,
            default: true
        },
        tag: {
            type: Boolean,
            default: false
        },
        color: {
            type: String,
            default: 'grey'
        },
        continued: {
            type: Boolean,
            default: false
        },
        continuing: {
            type: Boolean,
            default: false
        }
    },
    setup(props, { slots }) {
        const eventDate = computed(() => `${props.startTime.substring(0, 10)} ~ ${props.endedTime.substring(0, 10)}`);
        const container = ref<HTMLElement | null>(null);
        const titleRef = ref<HTMLElement | null>(null);
        const isHover = ref<boolean>(false);

        const textWidth = ref<number>(0);

        // 每個位置寬度
        const layouts = {
            marginLeft: 10,
            marginRight: 40,
            gap: 12,
            icon: 30,
            tag: 30
        };
        const fontPC: string = '500 19px "Montserrat"';
        const fontMobile: string = '500 12px "Montserrat"';

        const measureTextWidth = (timeText: string, descText: string, font: string = fontPC) => {
            const el = document.createElement('div');
            el.style.position = 'absolute';
            el.style.visibility = 'hidden';
            el.style.whiteSpace = 'nowrap';
            el.style.font = font;
            el.style.top = '-9999px';
            el.style.left = '-9999px';

            if (!container.value) return 0;

            let descWidth: number = 0;
            if (descText) {
                el.innerHTML = descText;
                container.value.appendChild(el);
                descWidth = el.offsetWidth;
                container.value.removeChild(el);
            }

            let timeWidth: number = 0;
            if (timeText) {
                el.innerHTML = timeText;
                container.value.appendChild(el);
                timeWidth = el.offsetWidth;
                container.value.removeChild(el);
            }
            return Math.max(timeWidth, descWidth);
        };

        const onMouseEnterHandle = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            const defSize:number = layouts.marginLeft
                + layouts.marginRight
                + layouts.gap
                + (slots.icon ? (layouts.icon + layouts.gap) : 0)
                + (props.tag ? (layouts.tag + layouts.gap) : 0);
            if (target) {
                const titleWidth: number = (titleRef.value?.offsetWidth || 0);
                if (!isHover.value) {
                    target.classList.add('hover');
                    target.style.minWidth = `${defSize + textWidth.value + titleWidth}px`;
                    isHover.value = true;
                }
            }
        };
        const onMouseLeaveHandle = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (target) {
                target.style.minWidth = '100%';
                target.classList.remove('hover');
                // 等動畫完成再打開避免連鎖反應
                // eslint-disable-next-line no-return-assign
                setTimeout(() => isHover.value = false, 100);
            }
        };
        const checkScreenBorderline = () => {
            const { columnStart, span } = props;
            if (props.title === 'GG') console.log('GG', columnStart, span);
            if (columnStart + span >= 31) return 'right';

            const titleWidth: number = (titleRef.value?.offsetWidth || 0);

            const defSize:number = layouts.marginLeft
                + layouts.marginRight
                + layouts.gap
                + (slots.icon ? layouts.icon : 0)
                + (props.tag ? layouts.tag : 0);
            const needSpan: number = Math.ceil((defSize + textWidth.value + titleWidth) / 2 / 46);
            if (props.title === 'GG') console.log('GG', needSpan, span);

            if (columnStart - needSpan <= 0) return 'left';
            if (columnStart + needSpan >= 31) return 'right';
            return 'center';
        };
        const containerClass = () => {
            const borderline: string = checkScreenBorderline();
            return {
                'event-title-container': true,
                small: props.small,
                icon: !!slots.icon,
                'point-right': borderline === 'right',
                'point-left': borderline === 'left'
            };
        };
        const openLinkHandle = () => {
            window.open(props.link, '_blank');
        }
        watch(() => eventDate.value, (value) => {
            const font: string = (window.innerWidth < 959) ? fontMobile : fontPC;
            textWidth.value = measureTextWidth(value, props.eventDesc, font);
        });

        onMounted(() => {
            if (container.value) {
                container.value.addEventListener('mouseenter', onMouseEnterHandle);
                container.value.addEventListener('mouseleave', onMouseLeaveHandle);
            }
            const font: string = (window.innerWidth < 959) ? fontMobile : fontPC;

            textWidth.value = measureTextWidth(eventDate.value, props.eventDesc, font);
        });

        return {
            eventDate,
            container,
            titleRef,
            containerClass,
            openLinkHandle
        };
    }
});
</script>

<template>
    <div
        ref="container"
        :class="containerClass()"
        @pointerup="openLinkHandle"
    >
        <div
            class="event-title-bg"
            :style="{
                background: color
            }"
        />
        <div
            v-if="!!$slots.icon"
            class="event-icon"
        >
            <slot name="icon" />
        </div>
        <div
            v-if="tag !== false"
            class="event-title-tag"
        >
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M14.0254 5.75812C13.3929 3.74729 10.6071 3.74729 9.97458 5.75812C9.8844 6.0448 9.63594 6.21631 9.38004 6.21631C7.27098 6.21631 6.5079 8.93003 8.12023 10.1401C8.3424 10.3068 8.44667 10.6157 8.35535 10.906C8.04546 11.8912 8.44292 12.8128 9.12096 13.3217C9.80252 13.8332 10.8037 13.9498 11.6406 13.3217C11.8566 13.1595 12.1434 13.1595 12.3594 13.3217C13.1963 13.9498 14.1975 13.8332 14.879 13.3217C15.5571 12.8128 15.9545 11.8912 15.6447 10.906C15.5533 10.6157 15.6576 10.3068 15.8798 10.1401C17.4921 8.93003 16.729 6.21631 14.62 6.21631C14.3641 6.21631 14.1156 6.0448 14.0254 5.75812ZM9.38004 7.71631C10.3176 7.71631 11.1268 7.09399 11.4055 6.20819C11.5976 5.59727 12.4024 5.59727 12.5945 6.20819C12.8732 7.09399 13.6824 7.71631 14.62 7.71631C14.91 7.71631 15.1265 7.89471 15.2145 8.17451C15.303 8.45601 15.2307 8.75176 14.9794 8.9404C14.236 9.49829 13.9363 10.4739 14.2138 11.3561C14.3162 11.6818 14.1936 11.9606 13.9786 12.122C13.7672 12.2807 13.5024 12.304 13.2598 12.122C12.5103 11.5594 11.4897 11.5594 10.7402 12.122C10.4976 12.304 10.2328 12.2807 10.0214 12.122C9.80639 11.9606 9.68379 11.6818 9.78623 11.3561C10.0637 10.4739 9.76396 9.49829 9.02062 8.9404C8.76928 8.75176 8.69695 8.45601 8.7855 8.17451C8.87351 7.89471 9.08997 7.71631 9.38004 7.71631Z"
                    fill="white"
                />
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12 0.25C7.16751 0.25 3.25 4.16751 3.25 9C3.25 11.1147 4.00107 13.0556 5.25004 14.5682L5.25 20.4389C5.24994 21.1694 5.2499 21.8022 5.32055 22.2768C5.39181 22.7554 5.57441 23.3562 6.19277 23.6328C6.8017 23.9052 7.3734 23.6551 7.78705 23.4002C8.20088 23.1452 8.69302 22.7349 9.26519 22.258L10.2489 21.438C10.796 20.982 11.154 20.6853 11.4511 20.4945C11.7302 20.3153 11.88 20.2807 12 20.2807C12.12 20.2807 12.2698 20.3153 12.5489 20.4945C12.846 20.6853 13.204 20.982 13.7511 21.438L14.7348 22.2579C15.307 22.7349 15.7991 23.1452 16.2129 23.4002C16.6266 23.6551 17.1983 23.9052 17.8072 23.6328C18.4256 23.3562 18.6082 22.7554 18.6795 22.2768C18.7501 21.8022 18.7501 21.1694 18.75 20.4389L18.75 14.5682C19.9989 13.0556 20.75 11.1147 20.75 9C20.75 4.16751 16.8325 0.25 12 0.25ZM4.75 9C4.75 4.99594 7.99594 1.75 12 1.75C16.0041 1.75 19.25 4.99594 19.25 9C19.25 10.8392 18.5661 12.5168 17.4377 13.7953C16.1081 15.3017 14.1653 16.25 12 16.25C9.83492 16.25 7.89222 15.3019 6.56267 13.7958C5.43402 12.5172 4.75 10.8394 4.75 9ZM6.8042 22.0559C6.75204 21.7055 6.75 21.1869 6.75 20.3787V16.0005C8.21211 17.0986 10.0302 17.75 12 17.75C13.9698 17.75 15.7879 17.0986 17.25 16.0005V20.3787C17.25 21.1869 17.248 21.7055 17.1958 22.0559C17.1857 22.1241 17.175 22.1758 17.1653 22.2144C17.1247 22.1955 17.0704 22.1667 16.9999 22.1232C16.6891 21.9317 16.2802 21.5933 15.6503 21.0683L14.6767 20.2568C14.174 19.8378 13.7445 19.4797 13.3595 19.2324C12.9476 18.9679 12.5142 18.7807 12 18.7807C11.4858 18.7807 11.0524 18.9679 10.6405 19.2324C10.2555 19.4797 9.82595 19.8378 9.32328 20.2568L8.34973 21.0683C7.7198 21.5933 7.31089 21.9317 7.0001 22.1232C6.92957 22.1667 6.87531 22.1955 6.83474 22.2144C6.82498 22.1758 6.81435 22.1241 6.8042 22.0559ZM17.1282 22.3173C17.128 22.3168 17.1298 22.3131 17.1343 22.3075C17.1306 22.3149 17.1283 22.3177 17.1282 22.3173ZM17.2565 22.2487C17.2627 22.2488 17.2662 22.2495 17.2664 22.2499C17.2666 22.2502 17.2635 22.2502 17.2565 22.2487ZM6.73359 22.2499C6.73378 22.2495 6.73725 22.2488 6.74345 22.2487C6.7365 22.2502 6.7334 22.2502 6.73359 22.2499ZM6.87184 22.3173C6.87203 22.3168 6.87017 22.3131 6.86573 22.3075C6.86619 22.3084 6.86663 22.3093 6.86704 22.3101C6.86995 22.3156 6.87168 22.3177 6.87184 22.3173Z"
                    fill="white"
                />
            </svg>
        </div>

        <div
            class="event-title"
            ref="titleRef"
        >
            <h1
                :style="{
                    'text-indent': tag ? '0' : '10px'
                }"
            >
                {{ title }}
            </h1>
        </div>
        <div
            v-if="startTime !== '' && endedTime !== ''"
            class="event-content"
        >
            <div
                class="event-date font-style"
            >
                {{ eventDate }}
            </div>
            <div
                class="event-desc font-style"
                v-html="eventDesc"
            />
        </div>
    </div>
</template>

<style scoped lang="scss">
@use '../theme';

.event-title-container {
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    position: absolute;
    display: flex;
    flex-direction: row;
    gap: 12px;
    padding-left: 16px;
    background: transparent;
    left: calc(1 / 2 * 100%);
    transform: translateX(calc(calc(1 / 2 * 100%) * -1));
    transition: min-width 0.3s ease, height 0.3s ease;

    &.icon {
        padding-left: 0;
        .event-title {
            visibility: hidden;
        }
        .event-title-tag {
            display: none;
        }
    }
    &.small {
        .event-title {
            h1 {
                font-size: 19px;
                white-space: nowrap;
            }
        }
        .event-content {
            .event-desc {
                display: none;
            }
        }
    }
    .event-title-tag {
        padding-top: 0;
        margin-left: 10px;
    }

    &.continued {
        left: 0;
        transform: translateX(0);
        .event-title-bg {
            left: 0;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }
        .event-icon {
            padding-right: 20px;
        }
    }

    &.continuing {
        left: calc(100%);
        transform: translateX(calc(100% * -1));
        .event-title-bg {
            right: 1px;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }
    }

    &.hover {
        min-width: 100%;
        height: 80px;
        &.small {
            height: 70px;
        }
        .event-title-bg {
            left: 0;
            right: 0;
            border: 2px solid  #FFFFFF;
            box-shadow: 0 2px 10px 0 #9F9F9F;
        }
        .event-title {
            visibility: visible;
            h1 {
                text-indent: 0;
            }
        }
        .event-title-tag {
            display: flex;
            margin-left: 0;
        }
        .event-icon {
            width: 30px;
            justify-content: flex-end;
            padding-right: 0;
        }
        .event-content {
            p {
                overflow: inherit;
            }
            .event-date {
            }
            .event-desc {
                display: block;
            }
        }
    }

}
.event-title-bg {
    height: 100%;
    min-width: 0;
    position: absolute;
    top: 0;
    left: 10px;
    right: 10px;
    border-radius: 20px;
    transition: box-shadow 0.6s ease;
    box-shadow: 0 2px 10px 0 rgba(159, 159, 159, 0);
}
.event-title-tag {
    width: 30px;
    height: 100%;
    flex-shrink: 0;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}
.event-icon {
    width: 100%; // 16 24 11
    height: 100%;
    min-width: 0;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.event-title {
    //width: 83px;
    height: 100%;
    min-width: 43px;
    max-width: 100%;
    position: relative;
    display: flex;
    text-align: left;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    h1 {
        user-select: none;
        width: 100%;
        color: #202020;
        font-size: 23px;
        font-weight: 700;
        box-sizing: border-box;
        text-overflow: ellipsis;
        overflow:hidden;
        white-space: normal;
        text-indent: 10px;
        &.small {
            font-size: 19px;
            white-space: nowrap;
        }
    }
}
.font-style {
    width: 100%;
    max-width: 100%;
    cursor: default;
    font-weight: 500;
    font-size: 19px;
    white-space: nowrap;
}
.event-content {
    width: 100%;
    height: 100%;
    min-width: 0;
    display: flex;
    position: relative;
    flex-direction: column;
    justify-content: center;
    text-align: left;
    line-height: 29px;
    // font-size: 19px;
    padding-right: 10px;

    .event-date,
    .event-desc {
        text-overflow: ellipsis;
        overflow:hidden;
    }
}
.point-left {
    left: 0;
    transform: translateX(0);
}
.point-right {
    left: calc(100%);
    transform: translateX(calc(100% * -1));
}
.updated:after {
    content: '';
    width: 20px;
    height: 20px;
    position: absolute;
    background: #FF0000;
    border: white 2px solid;
    border-radius: 50%;
    box-shadow: 0 4px 4px 0 #00000040;
    z-index: 30;
    top: -6px;
    left: 0;
}

@media (max-width: 959px) {
    .event-title-container {
        &.small {
            .event-title {
                h1 {
                    font-size: 16px;
                }
            }
            .event-content {
                .event-date {
                    font-size: 12px;
                    //margin-bottom: -6px;
                }
                .event-desc {
                    font-size: 12px;
                    //margin-top: -6px;
                }
            }
        }
        &.hover {
            &.small {
                .event-content {
                    .event-date {
                        margin-bottom: -6px;
                    }
                    .event-desc {
                        margin-top: -6px;
                    }
                }
            }
        }
    }
    .event-title {
        h1 {
            font-size: 16px;
        }
    }
}
</style>
