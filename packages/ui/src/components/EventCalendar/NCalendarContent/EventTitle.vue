<script lang="ts">
import { defineComponent, computed, ref, onMounted, watch, nextTick, onUnmounted } from "vue";
import NSymbols from "@/components/EventCalendar/Button/NSymbols.vue";
import useNTouchMove from "@/components/EventCalendar/NTouchMove/useNTouchMove";
import NDetailButton from "@/components/EventCalendar/Button/NDetailButton.vue";
export interface IEventTitleVars {
    sizeWidth?: number;
    // 開始位置
    start: number;
    // 頁面開始位置
    offsetStart: number;
    // 頁面結束位置
    offsetEnded: number;
    // 總長度
    totalLength: number;
    // 開始頁面位置
    startPage: number;
    // 開始位置佔空間
    startSpan: number;
    // 結束頁面位置
    endedPage: number;
    // 結束位置佔空間
    endedSpan: number;
    endedBack: number;
    // 該頁佔據
    currSpan: number;

}
export default defineComponent({
    name: 'EventTitle',
    components: { NDetailButton, NSymbols },
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
        activeDate: {
            type: Date,
            required: false,
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
        icon: {
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
        const eventDate = computed(() => {
            const now = props.activeDate ? props.activeDate : new Date();
            const st = props.startTime.split('/');
            const et = props.endedTime.split('/');
            let startStart: number = 0;
            let endStart: number = 0;
            if (now.getFullYear() === +st[0]) startStart = 5;
            if (st[0] === et[0]) endStart = 5;
            return `${props.startTime.substring(startStart, 10)} ~ ${props.endedTime.substring(endStart, 10)}`;
        });
        const container = ref<HTMLElement | null>(null);
        const titleRef = ref<HTMLElement | null>(null);
        const sectionRef = ref<HTMLElement | null>(null);
        const eventDateRef = ref<HTMLElement | null>(null);
        const isHover = ref<boolean>(false);

        const textWidth = ref<number>(0);
        const eTimeWidth = ref<number>(0);
        const eTitleWidth = ref<number>(0);
        const isMobile = ref<boolean>(false);
        const direction = ref<'left' | 'right' | 'center'>('center');
        // 滑動事件singleton
        const touchManager = useNTouchMove();
        const touchPage = computed(() => touchManager.page.value);
        // 參數
        const range = ref<IEventTitleVars>({});
        const hasCramped = ref<boolean>(false);
        // 每個位置寬度
        const layouts = {
            marginLeft: 10,
            marginRight: 40,
            gap: 8,
            icon: 30,
            tag: 30,
            btn: 80
        };
        const fontPC: string = '500 19px "Montserrat"';
        const fontMobile: string = '500 12px "Montserrat"';
        const titleFontPC: string = '700 23px "Montserrat"';
        const titleFontMobile: string = '700 16px "Montserrat"';
        const measureTitleWidth = (text: string, font: string = titleFontPC) => {
            const el = document.createElement('h1');
            el.style.position = 'absolute';
            el.style.visibility = 'hidden';
            el.style.whiteSpace = 'nowrap';
            el.style.font = font;
            el.style.top = '-9999px';
            el.style.left = '-9999px';
            if (!container.value) return 0;

            let tWidth: number = 0;
            if (text) {
                el.innerHTML = text;
                container.value.appendChild(el);
                tWidth = el.offsetWidth;
                container.value.removeChild(el);
            }
            return tWidth;
        };
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
            eTimeWidth.value = timeWidth;
            return Math.max(timeWidth, descWidth);
        };
        // 初始化參數
        const setupRange = () => {
            const cell: number = touchManager.info.value.cell;
            const page: number = touchManager.page.value;
            const offsetStart: number = cell * page;
            const offsetEnded: number = cell * (page + 1);
            const start = (props.columnStart - 1);
            const totalLength: number = start + props.span;
            const startPage: number = Math.floor(start / cell);
            const startSpan: number = cell - (start % cell);
            const endedPage: number = Math.ceil(totalLength / cell) - 1;
            const endedBack: number = cell - 32 % cell;
            let endedSpan: number = (start + props.span) % cell;
            if (endedSpan === 0) endedSpan = cell;
            let currSpan: number = 0;
            if (startPage === page) {
                // 開始位置寬度
                currSpan = startSpan;
            } else if (touchManager.page.value === endedPage) {
                currSpan = endedSpan == 0 ? cell : endedSpan; // 結束位置寬度
            } else {
                currSpan = cell; // 中間位置寬度
            }
            range.value = {
                sizeWidth: 46,
                start,
                page,
                offsetStart,
                offsetEnded,
                totalLength,
                startPage,
                startSpan,
                endedPage,
                endedSpan,
                endedBack,
                currSpan
            }
        }
        // 展開
        const onMouseEnterHandle = (event: MouseEvent) => {
            const target = container.value;//event.target as HTMLElement;
            const defSize:number = layouts.marginLeft
                + layouts.marginRight
                + layouts.gap
                + (props.icon ? (layouts.icon + layouts.gap) : 0)
                + (props.tag ? (layouts.tag + layouts.gap) : 0);
            const titleWidth: number = eTitleWidth.value || titleRef.value?.offsetWidth;
            if (target && !isHover.value) {
                target.classList.add('hover');
                if (isMobile.value) {
                    const {
                        sizeWidth,
                        start,
                        page,
                        totalLength,
                        startPage,
                        startSpan,
                        endedPage,
                        endedSpan,
                        offsetStart,
                        offsetEnded,
                        currSpan
                    } = range.value;
                    // 檢查頭尾padding
                    // 補足寬度
                    const cell = touchManager.info.value.cell;
                    let extra: number = (start % cell);
                    const full: number = sizeWidth * (cell - currSpan);
                    let padding: number = 8;
                    console.log(`onMouseEnterHandle ${props.title}
                        start: ${start} totalLength: ${totalLength}
                        startPage: ${startPage} startSpan: ${startSpan}
                        endedPage: ${endedPage} endedSpan: ${endedSpan}
                        offsetStart: ${offsetStart} offsetEnded: ${offsetEnded}
                        currSpan: ${currSpan} full:${full}
                        span: ${ endedSpan == 0 ? cell : endedSpan }
                        cell: ${ cell * (page + 1) } page: ${page}

                        `);
                    // 該頁物件是否在範圍內
                    if (currSpan != 0) {
                        let offset: number = start - offsetStart;
                        const pageLimitWidth: boolean = cell - offset;

                        if (offset >= 0 && pageLimitWidth > 1 && (start + pageLimitWidth) > totalLength ) {

                            if (props.continuing && page === startPage) {
                                padding += 10;
                            } else {
                                padding = 10;
                            }
                            // 這邊檢查中間
                            target.style.marginLeft = `-${ offset * 46 }px`;
                            target.style.minWidth = `${touchManager.info.value.width - padding}px`; // padding-right 8px
                        } else {
                            if (!props.continued && page === startPage) {
                                padding = 0;
                            } else if (!props.continuing && page === endedPage) {
                                console.log(`target.offsetWidth: ${target.offsetWidth} (${target.offsetWidth + full - padding})`);

                                if (page === startPage) {
                                    padding = 10;
                                } else {
                                    padding = 5;
                                }
                            }
                            // 右至左開
                            // 原本大小增加
                            target.style.minWidth = `${ target.offsetWidth + full - padding}px`;
                            target.style.maxWidth = `${ target.offsetWidth + full - padding}px`;
                        }
                    } else if (totalLength <= offsetEnded) {
                        // 左至右開
                        console.log("左至右開");
                        extra = cell - totalLength % cell;
                        target.style.minWidth = `${target.offsetWidth + extra * 46 - 8}px`;
                    }
                } else {
                    // PC版本
                    target.style.minWidth = `${defSize + textWidth.value + titleWidth - 8}px`;
                }
                target.style.zIndex = 25;
                isHover.value = true;
            }
        };
        // 收起來
        const onMouseLeaveHandle = (event: MouseEvent) => {
            const target = container.value;//event.target as HTMLElement;
            if (target && isHover.value) {
                target.style.minWidth = '100%';
                target.style.maxWidth = null;
                target.style.marginLeft = null;
                target.style.zIndex = null;
                target.classList.remove('hover');
                // 等動畫完成再打開避免連鎖反應
                // eslint-disable-next-line no-return-assign
                setTimeout(() => isHover.value = false, 100);
            }
        };
        // 小畫面: 檢查展開方向
        const checkScreenBorderlineMobile = () => {
            const cell: number = touchManager.info.value.cell;
            const len: number = (props.columnStart - 1) + props.span;
            const page: number = touchManager.page.value;
            if (len < cell * (page + 1)) return 'left';
            return 'right'
        }
        // 檢查展開方向
        const checkScreenBorderline = () => {
            const { columnStart, span } = props;

            if (columnStart + span >= 31) return 'right';

            const titleWidth: number = eTitleWidth.value || titleRef.value?.offsetWidth;

            const defSize:number = layouts.marginLeft
                + layouts.marginRight
                + layouts.gap
                + (props.icon ? layouts.icon : 0)
                + (props.tag ? layouts.tag : 0);

            const needSpan: number = Math.ceil((defSize + textWidth.value + titleWidth) / 2 / 46);

            if (columnStart - needSpan <= 0) return 'left';
            if (columnStart + needSpan >= 31) return 'right';
            return 'center';
        };
        // 套用Class效果
        const containerClass = () => {
            const borderline: string = (!isMobile.value) ? checkScreenBorderline() : checkScreenBorderlineMobile();
            direction.value = borderline;
            return {
                'event-title-container': true,
                small: props.small,
                icon: !!props.icon,
                'point-right': borderline === 'right',
                'point-left': borderline === 'left'
            };
        };
        const openLinkHandle = () => {
            const selectedText = window.getSelection()?.toString();
            if (selectedText && selectedText.length > 0) return;
            if (window.innerWidth < 960) return;
            window.open(props.link, '_blank');
        };
        const resize = () => {
            isMobile.value = window.innerWidth < 960;
        };
        const sectionStyle = () => {

            if (!isMobile.value) return {};
            setupRange();
            const {
                sizeWidth,
                start,
                page,
                totalLength,
                startPage,
                startSpan,
                endedPage,
                endedSpan,
                endedBack,
                offsetStart,
                offsetEnded
            } = range.value;

            let visibility: string = 'visible';
            let left: number = 20; // 起始位置

            let indentWidth: number = Math.max((sizeWidth * (offsetStart - start)), 0);
            // 調整tag間距
            if (props.tag && !props.icon) indentWidth -= 5;

            // 檢查是否從這頁開始
            const between: boolean = start >= offsetStart && start <= offsetEnded;

            console.log(`sectionStyle ${props.title}
                start: ${start} totalLength: ${totalLength} cell: ${touchManager.info.value.cell}
                startPage: ${startPage} startSpan: ${startSpan}
                endedPage: ${endedPage} endedSpan: ${endedSpan} endedBack: ${endedBack}
                offsetStart: ${offsetStart} offsetEnded: ${offsetEnded} between:${between}
                `);
            if (isHover.value) {
                // left = 0;
                if (props.icon) {
                    left = 0;
                } else if (props.continued || !between) {
                    left = 10;
                }
            } else {
                if (props.icon) {
                    left = 0;
                } else if (props.continued || !between) {
                    left = 10;
                }
                // 開頭只有1span隱藏
                if (!isHover.value && endedSpan === 1 && endedPage === page) {
                    visibility = 'hidden';
                }
            }



            if (endedPage < page) {
                indentWidth = 0;
            }
            // 移動頁面到最後只剩下1格
            if (totalLength - offsetStart === 1 ) {
                // 隱藏內文
                visibility = isHover.value ? 'visible' : 'hidden';
            }

            return {
                visibility,
                maxWidth: `${touchManager.info.value.width - 10}px`,
                left: `${left + indentWidth }px`
            }
        }
        // 處理手機介面文字溢出
        const eventContentStyle = () => {
            if (!isMobile.value) return {};
            const titleWidth: number = eTitleWidth.value || titleRef.value?.offsetWidth;
            const cellsNum: number = (props.columnStart + props.span -1) - touchManager.info.value.cell * touchManager.page.value;
            const {
                sizeWidth,
                start,
                page,
                totalLength,
                startPage,
                startSpan,
                endedPage,
                endedSpan,
                offsetStart,
                offsetEnded
            } = range.value;
            let maxWidth: number = touchManager.info.value.width
            - layouts.btn - titleWidth - (layouts.gap * 2);
            const smWidth: number = (cellsNum * 46) - titleWidth - layouts.gap * 2;

            if (props.tag) {
                maxWidth -= (layouts.tag + 20);
            }
            if (props.icon) {
                maxWidth -= layouts.icon;
            }
            console.log(`  - eventContentStyle:
            titleWidth: ${titleWidth}
            maxWidth: ${maxWidth}
            smWidth: ${smWidth}
                        `);
            if (isHover.value) {

                if (startPage === page && endedPage === page) {
                    maxWidth -= 20;
                } else {
                    maxWidth -= 20;
                }

                return { maxWidth: `${ maxWidth }px`, minWidth: `${ maxWidth }px` };
            } else {
                return { maxWidth: `${Math.min(smWidth, maxWidth)}px` };
            }
        }
        const measureWordWidth = async (value: string) => {
            sectionRef?.value.classList.remove('section-animate'); // 切換月份時不需要動畫
            const font: string = (isMobile.value) ? fontMobile : fontPC;
            const titleFont: string = (isMobile.value) ? titleFontMobile : titleFontPC;
            textWidth.value = measureTextWidth(value, props.eventDesc, font);
            eTitleWidth.value = measureTitleWidth(props.title, titleFont);
            await nextTick();
            hasCramped.value = eventDateRef.value.offsetWidth < 15 && !isHover.value; // 確認寬度夠不夠
            sectionRef?.value.classList.add('section-animate'); // 開啟轉場
        }

        watch(() => props.small, (value) => {
            measureWordWidth(eventDate.value);
        });

        watch(() => eventDate.value, (value) => measureWordWidth(value));

        watch(() => touchPage.value, (value) => {
            setupRange();
            const cell: number = touchManager.info.value.cell;
            const {
                start,
                totalLength,
                startPage,
                startSpan,
                endedPage,
                endedSpan,
                currSpan
            } = range.value;
            const cellsWidth: number = currSpan * 46;

            console.log(`event-title ${props.title} isMobile: ${isMobile.value}
            startPage: ${ startPage } startSpan: ${ startSpan }
            endedPage: ${endedPage} endedSpan: ${endedSpan} |currSpan: ${ currSpan }|
            page: ${value}(${touchManager.info.value.cell}) cell: ${touchManager.info.value.cell} max: ${touchManager.maxPage.value}
            width: ${touchManager.maxWidth.value} (${start + props.span})
            cellsWidth: ${ cellsWidth } : ${ textWidth.value } : ${eTimeWidth.value}
            Return: ${cellsWidth < eTimeWidth.value}
            titleRef: ${titleRef?.value.offsetWidth}
            `);
            if (isMobile.value) {
                const target = container.value;
                target.style.minWidth = '100%';
                target.style.marginLeft = null;
                target.style.zIndex = null;

                // 這邊檢查寬度夠不夠, 如果不夠隱藏
                if (cellsWidth < eTimeWidth.value + eTitleWidth.value) {
                    eventDateRef.value.classList.add('visible-hidden');
                } else {
                    eventDateRef.value.classList.remove('visible-hidden');
                }
                const title = titleRef?.value as HTMLElement;
                if (titleRef?.value.offsetWidth > cellsWidth - 20) {
                    // title.style.maxWidth = `${Math.min(cellsWidth - 20, title.offsetWidth)}px`;

                } else {
                    // title.style.maxWidth = '100%';
                }
            }
        });
        const onClick = (event: MouseEvent) => {
            if (!isHover.value) {
                onMouseEnterHandle(event);
            } else {
                onMouseLeaveHandle(event);
            }
        }
        onMounted(() => {
            window.addEventListener('resize', resize);
            resize();
            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

            if (container.value) {
                if (isTouchDevice) {
                    // container.value.addEventListener('pointerup', onClick);
                    container.value.addEventListener('pointerup', onMouseEnterHandle);
                    container.value.addEventListener('mouseleave', onMouseLeaveHandle);
                } else {
                    container.value.addEventListener('mouseenter', onMouseEnterHandle);
                    container.value.addEventListener('mouseleave', onMouseLeaveHandle);
                }
            }
            measureWordWidth(eventDate.value);

        });
        onUnmounted(() => {
            window.removeEventListener('resize', resize);
            if (container.value) {
                container.value.removeEventListener('mouseenter', onMouseEnterHandle);
                container.value.removeEventListener('mouseleave', onMouseLeaveHandle);
            }
        })

        return {
            eventDate,
            isMobile,
            isHover,
            container,
            titleRef,
            eventDateRef,
            sectionRef,
            hasCramped,
            containerClass,
            sectionStyle,
            eventContentStyle,
            openLinkHandle
        };
    }
});
</script>

<template>
    <div
        ref="container"
        :class="containerClass()"
        @click="openLinkHandle"
    >
        <div
            class="event-title-bg"
            :style="{
                background: color
            }"
        />
        <div
            ref="sectionRef"
            class="event-title-section"
            :style="sectionStyle()"
        >
            <div
                v-if="icon"
                class="event-icon"
            >
                <svg
                    style="pointer-events: none;"
                    width="14"
                    height="19"
                    viewBox="0 0 14 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M0 7C0 5.13872 0 4.20808 0.244717 3.45492C0.739307 1.93273 1.93273 0.739307 3.45491 0.244717C4.20808 0 5.13872 0 7 0C8.86128 0 9.79192 0 10.5451 0.244717C12.0673 0.739307 13.2607 1.93273 13.7553 3.45492C14 4.20808 14 5.13872 14 7V14.3874C14 16.3045 14 17.2631 13.658 17.77C13.2403 18.3893 12.5122 18.7242 11.7701 18.6383C11.1627 18.568 10.4349 17.9442 8.97931 16.6965C8.33858 16.1474 8.01821 15.8728 7.66631 15.7484C7.23517 15.5961 6.76483 15.5961 6.33369 15.7484C5.98179 15.8728 5.66142 16.1474 5.02069 16.6965C3.5651 17.9442 2.8373 18.568 2.22986 18.6383C1.48778 18.7242 0.759708 18.3893 0.341955 17.77C0 17.2631 0 16.3045 0 14.3874V7Z"
                        fill="white"
                    />
                </svg>
            </div>
            <div
                v-if="tag"
                class="event-title-tag"
            >
                <NSymbols name="award" width="24" height="24"/>
            </div>
            <div
                class="event-title"
                ref="titleRef"
            >
                <h1
                    :class="{
                        tag
                    }"
                >
                    {{ title }}
                </h1>
            </div>
            <div
                class="event-content"
                    :class="{
                    hidden: hasCramped
                }"
                :style="eventContentStyle()"
            >
                <div
                    class="event-date font-style"
                    ref="eventDateRef"
                >
                    {{ eventDate }}
                </div>
                <div
                    class="event-desc font-style"
                    v-html="eventDesc"
                />
            </div>
            <NDetailButton
                v-if="isMobile && isHover"
                class="detail-btn"
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
    flex-direction: column;
    padding-left: 16px;
    background: transparent;
    left: calc(1 / 2 * 100%);
    transform: translateX(calc(calc(1 / 2 * 100%) * -1));
    transition: min-width 0.3s ease, height 0.3s ease;
    cursor: pointer;
    pointer-events: visible;

    .event-title-section {
        width: 100%;
        height: 100%;
        min-width: 0;
        min-height: 0;
        display: flex;
        flex-direction: row;
        gap: 8px;
        position: absolute;
        left: 0;
        align-items: center;
        &.section-animate {
            transition: left 0.15s ease;
            transition-delay: .3s;
        }
    }


    &.icon {
        padding-left: 0;
        .event-title {
            visibility: hidden;
            display: none;
        }
        .event-title-tag {
            display: none;
        }
        .event-content {
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
        margin-left: 20px;
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
        .event-title-tag {
            margin-left: 15px;
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
        .event-icon {
            padding-left: 10px;
        }
    }

    &.hover {
        min-width: 100%;
        height: 80px;
        &.icon {
            .event-title {
                visibility: visible;
                display: flex;
            }
            .event-title-tag {
                display: flex;
            }
            .event-content {
                display: flex;
            }
        }
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
                padding-left: 10px;
            }
            .tag {
                padding-left: 0;
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
            padding-left: 0;
        }
        .event-title-section {
            .event-content {
                visibility: visible;
                p {
                    overflow: inherit;
                }
                .event-date {
                    visibility: visible;
                }
                .event-desc {
                    display: block;
                }
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
    margin-right: -5px;
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
    pointer-events: none;
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
        padding-left: 20px;
        max-width: 160px;
        &.small {
            font-size: 19px;
            white-space: nowrap;
        }
    }
    .tag {
        padding-left: 0;
    }
}
.font-style {
    width: 100%;
    max-width: 100%;
    cursor: default;
    font-weight: 500;
    font-size: 19px;
    white-space: nowrap;
    pointer-events: none;
}
.event-content {
    width: auto;
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
    &.hidden {
        visibility: hidden;
    }
    .event-date,
    .event-desc {
        text-overflow: ellipsis;
        overflow:hidden;
    }
}
.detail-btn {
    position: relative;
    display: flex;
    flex-shrink: 0;
    visibility: hidden;
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
    box-sizing: border-box;
    top: -6px;
    left: 0;
}
.visible-hidden {
    visibility: hidden;
}

@media (max-width: 959px) {
    .event-title-container {
        .event-title-section {
            pointer-events: none;
        }
        .event-content {
            .event-date {
                font-size: 12px;
                margin-bottom: 0;
            }
            .event-desc {
                font-size: 12px;
                margin-top: 0;
            }
        }
        .event-title-tag {
            margin-left: 0;
        }
        &.small {
            .event-title {
                h1 {
                    font-size: 16px;
                }
            }
        }
        &.hover {
            padding-left: 0;
            .event-title {
                h1 {
                    padding-left: 0;
                }
            }
            .event-content {
                .event-date {

                    white-space: wrap;
                    line-height: 16px;
                }
                .event-desc {

                    white-space: wrap;
                    line-height: 16px;
                }
            }
            .detail-btn {
                visibility: visible;
                animation: opacity 0.4s ease;
            }
        }
        &.continued {
            .event-title-tag {
                margin-left: -5px;

            }
        }
    }
    .event-title {
        h1 {
            padding-left: 0;
            font-size: 16px;
        }
    }


}
@keyframes opacity {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 100;
    }
}
</style>
