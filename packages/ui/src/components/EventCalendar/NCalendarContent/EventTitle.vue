<script lang="ts">
import { defineComponent, computed, ref, onMounted, watch, nextTick, onUnmounted } from 'vue';
import NSymbols from '../Button/NSymbols.vue';
import useNTouchMove from '../NTouchMove/useNTouchMove';
import NDetailButton from '../Button/NDetailButton.vue';

interface FontStyleOptions {
    fontSize: string;
    fontWeight: string;
    fontFamily?: string;
}

export interface IEventTitleVars {
    sizeWidth: number;
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
    page: number;
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
    setup(props) {
        const container = ref<HTMLElement | null>(null);
        const titleRef = ref<HTMLElement | null>(null);
        const sectionRef = ref<HTMLElement | null>(null);
        const eventDateRef = ref<HTMLElement | null>(null);
        const isHover = ref<boolean>(false);
        const textWidth = ref<number>(0);
        const eTimeWidth = ref<number>(0);
        const eTitleWidth = ref<number>(0);
        const isMobile = ref<boolean>(true);
        const direction = ref<'left' | 'right' | 'center' | string>('center');
        // 滑動事件singleton
        const touchManager = useNTouchMove();
        const touchPage = computed(() => touchManager.page.value);
        // 參數
        const range: IEventTitleVars = {
            sizeWidth: 0,
            start: 0,
            page: 0,
            offsetStart: 0,
            offsetEnded: 0,
            totalLength: 0,
            startPage: 0,
            startSpan: 0,
            endedPage: 0,
            endedSpan: 0,
            endedBack: 0,
            currSpan: 0
        };
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
        const fontFamily: string = '"Montserrat", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif';
        const fontPC: FontStyleOptions = {
            fontSize: '19px',
            fontWeight: '500'
        }
        const fontMobile: FontStyleOptions = {
            fontSize: '12px',
            fontWeight: '500'
        };
        const titleFontPC: FontStyleOptions = {
            fontSize: '23px',
            fontWeight: '700'
        };
        const titleFontMobile: FontStyleOptions = {
            fontSize: '16px',
            fontWeight: '700'
        }
        const createElement = (tagName: string, options: FontStyleOptions):HTMLElement => {
            const el = document.createElement(tagName);
            el.style.position = 'absolute';
            el.style.visibility = 'hidden';
            el.style.whiteSpace = 'nowrap';
            el.style.fontSize = options.fontSize;
            el.style.fontWeight = options.fontWeight;
            el.style.fontFamily = options.fontFamily || fontFamily;
            el.style.top = '-9999px';
            el.style.left = '-9999px';
            return el;
        };
        const measureTitleWidth = (text: string, font: FontStyleOptions = titleFontPC) => {
            const el:HTMLElement = createElement('h1', font);

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
        const measureTextWidth = (timeText: string, descText: string, font: FontStyleOptions = fontPC) => {
            const el:HTMLElement = createElement('div', font);

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
            // 每個寬度
            const sizeWidth: number = 46;
            // 一頁的數量
            const { cell } = touchManager.info.value;
            // 最後一頁遞補數量
            const { backCell } = touchManager.info.value;
            // 目前頁數
            const page: number = touchManager.page.value;
            // 總頁數
            const maxPage: number = touchManager.maxPage.value;
            // 起始位置
            const start = (props.columnStart - 1);
            // 0開始到結束佔據數量
            const totalLength: number = start + props.span;
            // 開始哪一頁
            const startPage: number = Math.floor(start / cell);
            // 最後一頁填補寬度
            const endedBack: number = touchManager.info.value.backWidth;
            // 最後一頁填補數量
            const endedBackCell: number = page !== maxPage ? 0 : backCell;
            // 目前開始位置
            const offsetStart: number = Math.max(cell * page - (page === maxPage ? endedBackCell : 0), start);
            // 目前結束位置
            const offsetEnded: number = Math.min(totalLength, cell * (page + 1));
            // 目前位置偏移數量
            const offset: number = (offsetStart % cell) - (page === maxPage ? backCell : 0);
            // 開始位置佔據數量
            const startSpan: number = (offset === 0 ? Math.min(cell, props.span) : cell - (start % cell));
            // 結束最後哪一頁
            const endedPage: number = Math.ceil((totalLength + endedBackCell) / cell) - 1;
            // 結束位置佔據數量
            let endedSpan: number = page === maxPage ? (offsetEnded - offsetStart) : (start + props.span) % cell;
            // 結束位置如果是0
            if (endedSpan === 0) endedSpan = cell - offset;
            let currSpan: number;
            if (startPage === page && page !== maxPage) {
                // 開始位置寬度
                currSpan = startSpan;
            } else if (page === endedPage) {
                currSpan = endedSpan === 0 ? cell : endedSpan; // 結束位置寬度
            } else if (totalLength <= offsetEnded || (props.columnStart >= offsetStart && props.columnStart <= offsetEnded)) {
                currSpan = offsetEnded - offsetStart;
            } else if (props.columnStart > offsetStart) {
                // 超過cell大小
                currSpan = props.columnStart - offsetStart;
            } else {
                currSpan = cell; // 中間位置寬度
            }
            range.sizeWidth = sizeWidth;
            range.start = start;
            range.page = page;
            range.totalLength = totalLength;
            range.startPage = startPage;
            range.startSpan = startSpan;
            range.endedPage = endedPage;
            range.endedSpan = endedSpan;
            range.endedBack = endedBack;
            range.currSpan = currSpan;
            range.offsetStart = offsetStart;
            range.offsetEnded = offsetEnded;
        };
        // 展開
        const onMouseEnterHandle = () => {
            const target = container.value;
            const defSize:number = layouts.marginLeft
                + layouts.marginRight
                + layouts.gap
                + (props.icon ? (layouts.icon + layouts.gap) : 0)
                + (props.tag ? (layouts.tag + layouts.gap) : 0);
            const titleWidth: number = eTitleWidth.value || titleRef.value?.offsetWidth || 0;
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
                    } = range;
                    touchManager.setFocusElement(target);
                    // 補足寬度
                    const { cell } = touchManager.info.value;
                    const full: number = sizeWidth * (cell - currSpan);
                    // 該頁物件是否在範圍內
                    if (currSpan !== 0) {
                        const isEnd: boolean = touchManager.maxPage.value === page;
                        const isStart: boolean = page === 0;
                        const endLeftStart: number = 32 - cell;
                        const backCell: number = isEnd ? touchManager.info.value.backCell : 0;
                        const backWidth: number = touchManager.info.value.backWidth % 46;
                        let offset: number = (offsetStart % cell) - backCell;
                        if (!(page * cell >= offsetStart) && offset === 0) {
                            offset = cell;
                        }
                        setupRange();
                        console.log(`onMouseEnterHandle ${props.title} x: ${touchManager.info.value.x} ${touchManager.info.value.added}
                        start: ${start} columnStart: ${props.columnStart} totalLength: ${totalLength} endLeftStart: ${endLeftStart}
                        startPage: ${startPage} startSpan: ${startSpan}
                        endedPage: ${endedPage} endedSpan: ${endedSpan} maxPage: ${touchManager.maxPage.value}
                        offsetStart: ${offsetStart} offsetEnded: ${offsetEnded}
                        currSpan: ${currSpan} full:${full}
                        span: ${props.span} backCell: ${backCell}
                        cell: ${cell} next: ${cell * (page + 1)} page: ${page} (${(offsetEnded - offsetStart)})
                        offset: ${offset} width: ${touchManager.info.value.width}
                        `);

                        const viewWidth: number = touchManager.info.value.width;
                        if (currSpan === cell && endedPage !== page) {
                            // 一整條的不動作
                            console.log('一整條的不動作');
                        } else if (offset === 0 && (!isEnd || props.columnStart <= (32 - cell))) {
                            // 左邊物件 1. 不是最後一頁 2. 最後一頁檢查左邊有span
                            console.log('左邊物件');
                            const added: number = (!isEnd) ? touchManager.info.value.added - backWidth - 8 : -8; // 最後一頁是靠右
                            // 原本寬度 + 螢幕寬度 - currSpan寬度
                            target.style.minWidth = `${target.offsetWidth + viewWidth + added - (currSpan * 46)}px`;
                            target.style.maxWidth = `${target.offsetWidth + viewWidth + added - (currSpan * 46)}px`;
                        } else if ((!isEnd && offsetEnded % cell === 0 && startPage !== endedPage)
                            || (offsetEnded === 32)
                            || (offsetEnded % cell === 0)) {
                            const added: number = (isEnd) ? touchManager.info.value.added : 0; // 最後一頁是靠右
                            if (page !== startPage && offsetEnded !== 32) {
                                // 第一頁超出頁面可以點到
                                console.log('右邊物件-1');
                                target.style.minWidth = `${target.offsetWidth + viewWidth + added - ((currSpan - 1) * 46)}px`;
                                target.style.maxWidth = `${target.offsetWidth + viewWidth + added - ((currSpan - 1) * 46)}px`;
                            } else {
                                console.log('右邊物件-2', added, (touchManager.info.value.clientWidth) % 46);
                                target.style.minWidth = `${target.offsetWidth + viewWidth + added - (currSpan * 46 + 17)}px`;
                                target.style.maxWidth = `${target.offsetWidth + viewWidth + added - (currSpan * 46 + 17)}px`;
                            }
                        } else if (isEnd) {
                            const { added } = touchManager.info.value; // 最後一頁是靠右
                            if (endLeftStart === offsetStart) {
                                target.style.transform = `translateX(-${added}px)`;
                                target.style.minWidth = `${target.offsetWidth + viewWidth + added - (currSpan * 46)}px`;
                                target.style.maxWidth = `${target.offsetWidth + viewWidth + added - (currSpan * 46)}px`;
                            } else {
                                const extra: number = offsetStart - endLeftStart;
                                target.style.transform = `translateX(-${extra * 46 + added}px)`;
                                target.style.minWidth = `${viewWidth + added}px`;
                                target.style.maxWidth = `${viewWidth + added}px`;
                                console.log('最後中間位置', added);
                            }
                        } else {
                            // 中間位置
                            const { added } = touchManager.info.value; // 最後一頁是靠右
                            console.log('中間位置', backWidth, added);
                            target.style.transform = `translateX(-${offset * 46 + (isStart ? 0 : 8)}px)`;
                            target.style.minWidth = `${viewWidth + added - (isStart ? 8 : 0)}px`;
                            target.style.maxWidth = `${viewWidth + added - (isStart ? 8 : 0)}px`;
                        }
                    } else if (totalLength <= offsetEnded) {
                        // 左至右開
                        console.log('#3 onMouseEnterHandle 左至右開');
                        // const extra: number = cell - totalLength % cell;
                        // target.style.minWidth = `${target.offsetWidth + extra * 46 - 8}px`;
                        target.style.minWidth = `${target.offsetWidth + touchManager.info.value.width}px`;
                        target.style.maxWidth = `${target.offsetWidth + touchManager.info.value.width}px`;
                    }
                } else {
                    // PC版本
                    target.style.minWidth = `${defSize + textWidth.value + titleWidth - 8}px`;
                }
                if (target && target.parentElement) (target.parentElement as HTMLElement).style.zIndex = '30';
                isHover.value = true;
                setTimeout(() => {
                    if (isHover.value) container.value?.focus();
                }, isMobile.value ? 150 : 0); // 手機版會失焦
            }
        };
        // 收起來
        const onMouseLeaveHandle = () => {
            const target: HTMLElement | null = container.value;
            if (target && isHover.value) {
                target.style.minWidth = '100%';
                target.style.maxWidth = '';
                target.style.marginLeft = '';
                target.style.zIndex = '';
                target.style.transform = '';
                target.classList.remove('hover');
                if (target && target.parentElement) (target.parentElement as HTMLElement).style.zIndex = '10';
                // 等動畫完成再打開避免連鎖反應
                // eslint-disable-next-line no-return-assign
                setTimeout(() => isHover.value = false, 100);
            }
        };
        // 小畫面: 檢查展開方向
        const checkScreenBorderlineMobile = () => {
            const { cell } = touchManager.info.value;
            const len: number = (props.columnStart - 1) + props.span;
            const page: number = touchManager.page.value;

            if (len >= 32) return 'right';
            if (len < cell * (page + 1)) return 'left';
            return 'right';
        };
        // 檢查展開方向
        const checkScreenBorderline = () => {
            const { columnStart, span } = props;

            if (columnStart + span >= 31) return 'right';

            const titleWidth: number = eTitleWidth.value || titleRef.value?.offsetWidth || 0;

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
                icon: props.icon,
                'point-right': borderline === 'right',
                'point-left': borderline === 'left'
            };
        };
        // 開啟連結
        const openLinkHandle = () => {
            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            const selectedText = window.getSelection()?.toString();
            if (selectedText && selectedText.length > 0) {
                navigator.clipboard.writeText(selectedText);
                return;
            }
            if (window.innerWidth < 960 || isTouchDevice) return;
            window.open(props.link, '_blank');
        };
        const resize = () => {
            isMobile.value = window.innerWidth < 960;
            setupRange();
        };
        const sectionStyle = () => {
            if (!isMobile.value) return {};
            setupRange();
            const {
                sizeWidth,
                start,
                page,
                totalLength,
                endedPage,
                endedSpan,
                endedBack,
                offsetStart,
                offsetEnded,
                currSpan
            } = range;

            let visibility: string = 'visible';
            let left: number = 20; // 起始位置
            let indentWidth: number = Math.max((sizeWidth * (offsetStart - start)), 0);

            if (props.icon && !isHover.value) {
                return { visibility };
            }
            const { cell } = touchManager.info.value;
            const finalPage: boolean = page === touchManager.maxPage.value;
            // 最後一頁
            if (finalPage) {
                if (props.columnStart <= offsetStart) {
                    // 上一頁就開始的
                    indentWidth -= touchManager.info.value.added;
                } else {
                    // indentWidth -= endedBack % 46;
                }
            }

            // 調整tag間距
            if (props.tag && !props.icon) indentWidth -= 5;

            // 檢查是否從這頁開始
            const between: boolean = start >= offsetStart && start <= offsetEnded;
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

            // 移動頁面到最後只剩下1格
            if (totalLength - offsetStart <= 1) {
                // 隱藏內文
                visibility = isHover.value ? 'visible' : 'hidden';
            }
            // console.log(`sectionStyle ${props.title} left: ${left} indentWidth: ${indentWidth}
            //     columnStart: ${props.columnStart} x: ${touchManager.info.value.x} getPositionX: ${touchManager.getPositionX()}
            //     start: ${start} totalLength: ${totalLength} cell: ${touchManager.info.value.cell}
            //     startPage: ${startPage} startSpan: ${startSpan}
            //     endedPage: ${endedPage} endedSpan: ${endedSpan} endedBack: ${endedBack}
            //     backWidth: ${touchManager.info.value.cell - Math.floor(endedBack / 46)} ${endedBack % 46}
            //     offsetStart: ${offsetStart} offsetEnded: ${offsetEnded} between:${between}
            //     `);

            let width: string = 'calc(100% - 25px)';
            const endLeftStart: number = (32 - cell);
            if (currSpan <= 3) {
                width = `${currSpan * 46 - 10}px`;
            }

            return {
                visibility,
                maxWidth: `${touchManager.info.value.width + touchManager.info.value.added - 25}px`,
                left: `${Math.max(left + indentWidth, 0)}px`,
                width
            };
        };
        const measureWordWidth = async (value: string) => {
            if (!value || !container.value) return;
            sectionRef.value?.classList.remove('section-animate'); // 切換月份時不需要動畫
            const font: FontStyleOptions = (isMobile.value) ? fontMobile : fontPC;
            const titleFont: FontStyleOptions = (isMobile.value) ? titleFontMobile : titleFontPC;
            textWidth.value = measureTextWidth(value, props.eventDesc, font);
            eTitleWidth.value = measureTitleWidth(props.title, titleFont);
            await nextTick();
            hasCramped.value = (eventDateRef.value?.offsetWidth || 0) < 15 && !isHover.value; // 確認寬度夠不夠
            sectionRef.value?.classList.add('section-animate'); // 開啟轉場
        };

        const eventDate = computed(() => {
            const now = props.activeDate ? props.activeDate : new Date();
            const st = props.startTime.split('/');
            const et = props.endedTime.split('/');
            let startStart: number = 0;
            let endStart: number = 0;
            if (now.getFullYear() === +st[0]) startStart = 5;
            if (st[0] === et[0]) endStart = 5;
            const value: string = `${props.startTime.substring(startStart, 10)} ~ ${props.endedTime.substring(endStart, 10)}`;
            return value;
        });
        // 監聽時間跟大小
        watch([eventDate, () => props.small], ([value]) => {
            measureWordWidth(value);
        });
        // 監聽頁面換頁
        watch(() => touchPage.value, (value) => {
            if (!isMobile.value) return;
            setupRange();
            const {
                start,
                startPage,
                startSpan,
                endedPage,
                endedSpan,
                currSpan
            } = range;
            const cellsWidth: number = currSpan * 46;
/*
            console.log(`event-title ${props.title} isMobile: ${isMobile.value}
            startPage: ${startPage} startSpan: ${startSpan}
            endedPage: ${endedPage} endedSpan: ${endedSpan} |currSpan: ${currSpan}|
            page: ${value}(${touchManager.info.value.cell}) cell: ${touchManager.info.value.cell} max: ${touchManager.maxPage.value}
            width: ${touchManager.maxWidth.value} (${start + props.span})
            cellsWidth: ${cellsWidth} : ${textWidth.value} : ${eTimeWidth.value}
            Return: ${cellsWidth < eTimeWidth.value}
            titleRef: ${titleRef.value?.offsetWidth}
            `);*/
            const target: HTMLElement | null = container.value;
            if (target) {
                target.style.minWidth = '100%';
                target.style.marginLeft = '';
                target.style.zIndex = '';
            }

            // 這邊檢查寬度夠不夠, 如果不夠隱藏
            if (cellsWidth < eTimeWidth.value + eTitleWidth.value) {
                eventDateRef.value?.classList.add('visible-hidden');
            } else {
                eventDateRef.value?.classList.remove('visible-hidden');
            }
        });
        onMounted(() => {
            window.addEventListener('resize', resize);
            resize();
            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            if (container.value) {
                if (isTouchDevice || isMobile.value) {
                    // container.value.addEventListener('pointerup', onClick);
                    container.value.addEventListener('pointerup', onMouseEnterHandle);
                    // container.value.addEventListener('mouseleave', onMouseLeaveHandle);
                    container.value.addEventListener('focusout', () => {
                        onMouseLeaveHandle();
                        touchManager.setFocusElement(null);
                    });
                } else {
                    container.value.addEventListener('mouseenter', onMouseEnterHandle);
                    container.value.addEventListener('mouseleave', () => {
                        if (document.activeElement === container.value) onMouseLeaveHandle();
                    });
                    container.value.addEventListener('focusout', () => {
                        onMouseLeaveHandle();
                    });
                    container.value.addEventListener('focusin', () => {
                        onMouseEnterHandle();
                    });
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
        });

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
            openLinkHandle
        };
    }
});
</script>

<template>
    <div
        ref="container"
        tabindex="0"
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
                <NSymbols
                    name="award"
                    width="24"
                    height="24"
                />
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
    min-width: 46px;
    min-height: 30px;
    position: absolute;
    display: flex;
    flex-direction: column;
    padding-left: 16px;
    background: transparent;
    left: calc(1 / 2 * 100%);
    transform: translateX(calc(calc(1 / 2 * 100%) * -1));
    transition: min-width 0.3s ease, height 0.3s ease;
    //cursor: pointer;
    pointer-events: visible;
    &:focus {
        outline: none;
    }

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
                max-width: none;
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
    color: black;
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
    margin-right: 10px;
}
.point-left {
    left: 0;
    transform: translateX(0);
}
.point-right {
    left: calc(100%);
    transform: translateX(calc(100% * -1));
}
.visible-hidden {
    visibility: hidden;
}

@media (max-width: 959px) {
    .event-title-container {
        overflow: hidden;
        .event-title-section {
            pointer-events: none;
        }
        .event-content {
            //min-width: calc(46px * 2);
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
            overflow: visible;
            padding-left: 0;
            .event-title {
                h1 {
                    max-width: calc(46px * 2);
                    white-space: wrap;
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
    .event-icon {
        flex-shrink: 1;
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
