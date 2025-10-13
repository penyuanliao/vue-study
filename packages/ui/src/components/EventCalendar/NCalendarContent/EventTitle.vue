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
        },
        updated: {
            type: Boolean,
            default: false
        }
    },
    setup(props) {
        const container = ref<HTMLElement | null>(null);
        const titleRef = ref<HTMLElement | null>(null);
        const eventTitleContentRef = ref<HTMLElement | null>(null);
        const sectionRef = ref<HTMLElement | null>(null);
        const eventDateRef = ref<HTMLElement | null>(null);
        const eventContentRef = ref<HTMLElement | null>(null);
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
        // 每個位置寬度
        const layouts = {
            marginLeft: 20,
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
        };
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
        };
        const createElement = (tagName: string, options: FontStyleOptions):HTMLElement => {
            const el = document.createElement(tagName);
            el.style.position = 'absolute';
            el.style.visibility = 'hidden';
            el.style.whiteSpace = 'nowrap';
            el.style.textOverflow = '';
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
                descWidth = el.offsetWidth + layouts.marginLeft;
                container.value.removeChild(el);
            }

            let timeWidth: number = 0;
            if (timeText) {
                el.innerHTML = timeText;
                container.value.appendChild(el);
                timeWidth = el.offsetWidth + layouts.marginLeft;
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
                        const endLeftStart: number = 32 - cell;
                        const isEnd: boolean = touchManager.maxPage.value === page;
                        const isStart: boolean = page === 0;
                        const backCell: number = isEnd ? touchManager.info.value.backCell : 0;
                        const backWidth: number = touchManager.info.value.backWidth % 46;
                        let offset: number = (offsetStart % cell) - backCell;
                        if (!(page * cell >= offsetStart) && offset === 0) {
                            offset = cell;
                        }
                        setupRange();
                        console.log(`[${isEnd}]onMouseEnterHandle ${props.title} x: ${touchManager.info.value.x} ${touchManager.info.value.added}
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
                        if ((currSpan === cell && endedPage !== page) || (currSpan === cell && props.continuing) || (offsetEnded >= 32 && endLeftStart > props.columnStart)) {
                            // 一整條的不動作
                            if (currSpan === cell && props.continuing && isEnd && props.columnStart > endLeftStart) {
                                console.log('一整條的不動作1');
                                const { added } = touchManager.info.value;
                                target.style.minWidth = `${viewWidth + added}px`;
                                target.style.maxWidth = `${viewWidth + added}px`;
                            } else {
                                console.log('一整條的不動作2');
                            }
                        } else if (offset === 0 && (!isEnd || props.columnStart <= (32 - cell))) {
                            // 左邊物件 1. 不是最後一頁 2. 最後一頁檢查左邊有span
                            console.log('左邊物件');
                            const added: number = (!isEnd) ? touchManager.info.value.added - backWidth - 8 : -8; // 最後一頁是靠右
                            // 原本寬度 + 螢幕寬度 - currSpan寬度
                            target.style.minWidth = `${target.offsetWidth + viewWidth + added - (currSpan * 46)}px`;
                            target.style.maxWidth = `${target.offsetWidth + viewWidth + added - (currSpan * 46)}px`;
                        } else if ((!isEnd && offsetEnded % cell === 0 && startPage !== endedPage)
                            || (offsetEnded === 32)
                            || (offsetEnded % cell === 0 && !isEnd)) {
                            const added: number = (isEnd) ? touchManager.info.value.added : 0; // 最後一頁是靠右
                            if (page !== startPage && offsetEnded !== 32) {
                                // 第一頁超出頁面可以點到
                                console.log('右邊物件-1', !isEnd && offsetEnded % cell === 0 && startPage !== endedPage);
                                target.style.minWidth = `${target.offsetWidth + viewWidth + added - ((currSpan - 1) * 46)}px`;
                                target.style.maxWidth = `${target.offsetWidth + viewWidth + added - ((currSpan - 1) * 46)}px`;
                            } else if (isEnd) {
                                console.log('右邊物件-2.1', added - 30);
                                target.style.minWidth = `${target.offsetWidth + viewWidth + added - (currSpan * 46)}px`;
                                target.style.maxWidth = `${target.offsetWidth + viewWidth + added - (currSpan * 46)}px`;
                            } else {
                                const rightOutside: boolean = (start + props.span) <= offsetEnded; // 多餘超出扣除
                                const offset2: number = rightOutside ? ((window.innerWidth - 30) / 46 - cell) * 46 : offset;
                                console.log('右邊物件-2.2');
                                target.style.transform = `translateX(calc(-100% + ${offset2}px))`;
                                target.style.minWidth = `${target.offsetWidth + viewWidth - (currSpan * 46) + offset2}px`;
                                target.style.maxWidth = `${target.offsetWidth + viewWidth - (currSpan * 46) + offset2}px`;
                            }
                        } else if (isEnd) {
                            const { added } = touchManager.info.value; // 最後一頁是靠右
                            if (endLeftStart === offsetStart) {
                                console.log('最後:左至右', added);
                                const move: number = (props.columnStart < endLeftStart ? 0 : added);
                                target.style.transform = `translateX(-${move}px)`;
                                target.style.minWidth = `${target.offsetWidth + ((cell - currSpan) * 46) + move}px`;
                                target.style.maxWidth = `${target.offsetWidth + ((cell - currSpan) * 46) + move}px`;
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
                            console.log('中間位置', backWidth, isStart);
                            target.style.transform = `translateX(-${offset * 46 + (isStart ? -4 : 8)}px)`;
                            target.style.minWidth = `${viewWidth + added - (isStart ? 16 : 0)}px`;
                            target.style.maxWidth = `${viewWidth + added - (isStart ? 16 : 0)}px`;
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
                    // eslint-disable-next-line no-lonely-if
                    if (container.value?.classList.contains('point-right')) {
                        // 文字太長超出
                        target.style.minWidth = `${Math.min((props.columnStart - 1 + props.span) * 46, defSize + textWidth.value + titleWidth - 8)}px`;
                    } else if (container.value?.classList.contains('point-left')) {
                        // 文字太長超出
                        target.style.minWidth = `${Math.min((32 - (props.columnStart - 1)) * 46, defSize + textWidth.value + titleWidth - 8)}px`;
                    } else {
                        target.style.minWidth = `${defSize + textWidth.value + titleWidth - 8}px`;
                    }
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
            const start: number = props.columnStart - 1;
            const len: number = start + props.span;
            const page: number = touchManager.page.value;
            const maxPage: number = touchManager.maxPage.value;
            const pageStart: number = cell * page;
            const pageEnd: number = cell * (page + 1);
            if (isHover.value) {
                if (pageStart > start && len <= pageEnd) {
                    return 'left';
                }
            }

            if (cell * page === props.columnStart - 1 && page !== maxPage) return 'left'; // 開頭左至右
            if (len >= 32) return 'right';
            if (len < pageEnd) return 'left';
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
                hover: isHover.value,
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
        const openLinkMobileHandle = () => {
            window.open(props.link, '_blank');
        };
        const resize = () => {
            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            isMobile.value = window.innerWidth < 960 || isTouchDevice;
            setupRange();
        };
        const contentStyle = () => {
            if (!isMobile.value) {
                return {
                    width: `calc(100% - ${props.icon ? 8 : 14}px)`
                };
            }
            return {
                width: '100%'
            };
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
                offsetStart,
                offsetEnded,
            } = range;
            let paddingLeft: number = 0;
            if (!isHover.value) {
                // 沒有hover狀態
                if (!props.continued) {
                    paddingLeft = 25;
                } else {
                    paddingLeft = 5;
                }
            }
            let visibility: string = 'visible';
            let left: number = 10; // 起始位置
            let indentWidth: number = Math.max((sizeWidth * (offsetStart - start) - paddingLeft), 0);

            if (props.icon && !isHover.value) {
                return { visibility };
            }
            const { cell } = touchManager.info.value;
            const finalPage: boolean = page === touchManager.maxPage.value;
            // 最後一頁
            if (finalPage) {
                if (props.columnStart <= offsetStart) {
                    if ((32 - cell) === props.columnStart) { /* empty */ } else {
                        // 上一頁就開始的
                        indentWidth -= (touchManager.info.value.added - 5);
                    }
                }
            }

            // 檢查是否從這頁開始
            const between: boolean = start >= offsetStart && start <= offsetEnded;
            if (isHover.value) {
                if (props.icon) {
                    left = 0;
                } else if (props.continued || !between) {
                    left = 10;
                }
            } else {
                // 開頭只有1span隱藏
                // eslint-disable-next-line no-lonely-if
                if (!isHover.value && endedSpan === 1 && endedPage === page) {
                    visibility = 'hidden';
                }
            }

            // 移動頁面到最後只剩下1格
            if (totalLength - offsetStart <= 1) {
                // 隱藏內文
                visibility = isHover.value ? 'visible' : 'hidden';
            }
            setTimeout(() => {
                if (!isHover.value && (eventContentRef.value?.offsetWidth || 0) <= 20) {
                    eventContentRef.value?.classList.add('visible-hidden');
                } else if (!isHover.value) {
                    eventContentRef.value?.classList.remove('visible-hidden');
                }
            }, 300);
            if ((eventContentRef.value?.offsetWidth || 0) <= 20) eventContentRef.value?.classList.add('visible-hidden');

            const offsetX: number = Math.max(left + indentWidth, 0);
            const width: string = isHover.value ? `${window.innerWidth - 40}px` : `calc(100% - ${offsetX + 10}px)`;
            return {
                visibility,
                left: `${visibility === 'hidden' ? 10 : offsetX}px`,
                width
            };
        };
        const eventTitleStyle = () => ({
            '--updated-left': '-6px',
            background: props.color
        });
        const measureWordWidth = async (value: string) => {
            if (!value || !container.value) return;
            sectionRef.value?.classList.remove('section-animate'); // 切換月份時不需要動畫
            const font: FontStyleOptions = (isMobile.value) ? fontMobile : fontPC;
            const titleFont: FontStyleOptions = (isMobile.value) ? titleFontMobile : titleFontPC;
            textWidth.value = measureTextWidth(value, props.eventDesc, font);
            eTitleWidth.value = measureTitleWidth(props.title, titleFont);
            await nextTick();
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
        watch(() => touchPage.value, () => {
            if (!isMobile.value) return;
            setupRange();
            const {
                currSpan
            } = range;
            const cellsWidth: number = (currSpan < 0 ? props.span : currSpan) * 46;
            const target: HTMLElement | null = container.value;
            if (target) {
                target.style.minWidth = '100%';
                target.style.marginLeft = '';
                target.style.zIndex = '';
            }

            // 這邊檢查寬度夠不夠, 如果不夠隱藏
            if (cellsWidth - (eTitleWidth.value + 55 + (props.tag ? layouts.tag + 10 : 0)) < 16) {
                eventContentRef.value?.classList.add('visible-hidden');
            } else {
                eventContentRef.value?.classList.remove('visible-hidden');
            }
        });
        onMounted(() => {
            console.log("onMounted");
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
                    if (eventTitleContentRef.value) {
                        eventTitleContentRef.value.addEventListener('mouseenter', onMouseEnterHandle);
                        eventTitleContentRef.value.addEventListener('mouseleave', () => {
                            if (document.activeElement === container.value) onMouseLeaveHandle();
                        });
                    }
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
            if (eventTitleContentRef.value) {
                eventTitleContentRef.value.removeEventListener('mouseenter', onMouseEnterHandle);
                eventTitleContentRef.value.removeEventListener('mouseleave', onMouseLeaveHandle);
            }
        });

        return {
            eventDate,
            isMobile,
            isHover,
            container,
            titleRef,
            eventDateRef,
            eventContentRef,
            eventTitleContentRef,
            sectionRef,
            containerClass,
            contentStyle,
            sectionStyle,
            eventTitleStyle,
            openLinkHandle,
            openLinkMobileHandle
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
            :class="{
                'event-title-bg': true,
                updated
            }"
            :style="eventTitleStyle()"
        />
        <div
            ref="eventTitleContentRef"
            class="event-title-content"
        >
            <div
                ref="sectionRef"
                class="event-title-section"
                :style="sectionStyle()"
            >
                <div
                    v-if="(icon || tag)"
                    :class="{
                        'event-icon': (icon && tag || icon && !tag),
                        'event-title-tag': (!icon && tag)
                    }"
                >
                    <div v-show="icon && !tag">
                        <NSymbols name="eventIcon" />
                    </div>
                    <div v-show="tag">
                        <NSymbols
                            name="award"
                            width="24"
                            height="24"
                        />
                    </div>
                </div>
                <div
                    class="event-title"
                    :style="{
                        maxWidth: `${ tag ? 'calc(100% - 55px)' : '100%' }`
                    }"
                    ref="titleRef"
                >
                    <h1
                        :class="{
                            tag
                        }"
                        :style="{
                            whiteSpace: `${!small ? (tag || icon) ? 'nowrap' : 'normal' : ''}`
                        }"
                    >
                        {{ title }}
                    </h1>
                </div>
                <div
                    class="event-content"
                    ref="eventContentRef"
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
                    :style="{
                        visibility: (isMobile && isHover ? 'visible' : 'hidden')
                    }"
                    :color="color"
                    @pointerup="openLinkMobileHandle"
                />
            </div>
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
    position: relative;
    display: flex;
    flex-direction: column;
    //padding-left: 16px;
    background: transparent;
    left: calc(1 / 2 * 100%);
    transform: translateX(calc(calc(1 / 2 * 100%) * -1));
    transition: min-width 0.3s ease, height 0.3s ease;
    pointer-events: visible;
    &:focus {
        outline: none;
    }
    .event-title-content {
        height: 100%;
        min-width: 46px;
        min-height: 30px;
        overflow: hidden;
        position: absolute;
        top: 0;
        left: 20px;
        right: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        //margin-left: 4px;
        cursor: pointer;
        z-index: 1;
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
        .event-title-content {
            left: 0;
        }
        .event-icon {
            padding-right: 20px;
        }
        .event-title-tag {
            margin-left: 5px;
        }
    }

    &.continuing {
        left: calc(100%);
        transform: translateX(calc(100% * -1));
        .event-title-content {
            right: 1px;
        }
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
            flex-shrink: 0;
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
            box-shadow: 0 2px 10px 0 rgba(159, 159, 159, 1);
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
    &.continued.hover {
        .event-title-section {
            left: 10px;
        }
    }
}
.event-title-bg {
    height: 100%;
    min-width: 0;
    position: absolute;
    top: 0;
    left: 20px;
    right: 20px;
    border-radius: 20px;
    box-shadow: 0 2px 10px 0 rgba(159, 159, 159, 0);
    transition: box-shadow 0.6s ease;
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
    color: #202020;
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
    .event-desc,
    .event-date {
        text-overflow: ellipsis;
        overflow: hidden;
    }
}
.detail-btn {
    position: relative;
    display: flex;
    flex-shrink: 0;
    visibility: hidden;
    margin-right: 10px;
    pointer-events: auto;
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
.updated:after {
    content: '';
    width: 20px;
    height: 20px;
    position: absolute;
    background: #FF0000;
    border: white 2px solid;
    border-radius: 50%;
    z-index: 30;
    box-sizing: border-box;
    top: -6px;
    left: var(--updated-left, -6px);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 1);
    animation: pulse-white 2s infinite;
}
.updated:before {
    content: '';
    background: transparent;
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    transform: scale(1);
    z-index: 30;
    top: -6px;
    left: var(--updated-left, -6px);
    box-shadow: 0 4px 4px 0 #00000040;
}
@keyframes pulse-white {
    0% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(var(--calendar-primary-color), 0.7);
    }

    70% {
        transform: scale(1);
        box-shadow: 0 0 0 4px rgba(var(--calendar-primary-color), 0);
    }

    100% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(var(--calendar-primary-color), 0);
    }
}
@media (max-width: 959px) {
    .event-title-container {
        .event-title-section {
            pointer-events: none;
            &.section-animate {
                transition: left 0.15s ease;
                transition-delay: .3s;
            }
        }
        .event-content {
            //min-width: calc(46px * 2);
            .event-date {
                font-size: 12px;
                margin-bottom: 0;
                line-height: 16px;
                text-overflow: ellipsis;
                overflow:hidden;
            }
            .event-desc {
                font-size: 12px;
                margin-top: 0;
                line-height: 16px;
                text-overflow: ellipsis;
                overflow:hidden;
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
            height: 60px;
            .event-title {
                h1 {
                    max-width: calc(46px * 2);
                    white-space: wrap;
                    padding-left: 0;
                }
            }
            .event-title-content {
                left: 0;
                right: 0;
            }
            .event-content {
                .event-date {

                    white-space: wrap;
                    line-height: 16px;
                }
                .event-desc {

                    white-space: wrap;
                    line-height: 16px;
                    max-height: calc(60px - 16px);
                }
            }
            .detail-btn {
                visibility: visible;
                animation: opacity 0.4s ease;
            }
            .event-title-section {
                &.section-animate {
                    transition: none;
                }
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
        flex-shrink: 0;
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
