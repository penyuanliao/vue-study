import { onBeforeUnmount, ref } from 'vue';

let instance: ReturnType<typeof createManager> | null = null;

type SwipeDirection = 'left' | 'right';

export interface ITouchMoveInfo {
    width: number;
    cell: number;
    scrollWidth: number;
    x: number;
    backWidth: number;
    backCell: number;
    clientWidth: number;
    added: number;
}

const createManager = () => {
    let el: HTMLElement | null = null;
    let moveStartX: number = 0;
    // 目前第幾頁
    const page = ref<number>(0);
    // 最大頁數
    const maxPage = ref<number>(0);
    // 最大寬度
    const maxWidth = ref<number>(0);
    // 處理物件開啟狀態
    const focusElement = ref<HTMLElement | null>(null);

    const info = ref<ITouchMoveInfo>({
        width: 0,
        cell: 0,
        scrollWidth: 0,
        x: 0,
        backWidth: 0,
        backCell: 0,
        clientWidth: 0,
        added: 0
    });
    const onMouseStart = (e: TouchEvent | MouseEvent) => {
        if (e instanceof TouchEvent) {
            const touch = e.changedTouches[0];
            moveStartX = touch.clientX;
        } else {
            moveStartX = e.clientX;
        }
    };

    const onMouseMove = (e: TouchEvent | MouseEvent) => {

    };

    const onMouseEnd = (e: TouchEvent | MouseEvent) => {
        const inset: number = 0;
        let clientX: number;
        if (e instanceof TouchEvent) {
            const touch = e.changedTouches[0];
            clientX = touch.clientX;
        } else {
            clientX = e.clientX;
        }
        const deltaX = clientX - moveStartX;
        let left: number = 0;
        if (deltaX < -100) {
            if (page.value + 1 > maxPage.value) return;
            if (focusElement.value) focusElement.value.blur();
            page.value += 1;
            if (page.value === maxPage.value) {
                left = info.value.scrollWidth; // 最後一頁直接靠右
            } else {
                left = info.value.width * page.value - inset;
            }
            if (el) el.scrollTo({ left, behavior: 'smooth' });
            info.value.x = left;
        } else if (deltaX > 100) {
            if (page.value - 1 < 0) return;
            if (focusElement.value) focusElement.value.blur();
            page.value -= 1;
            left = info.value.width * page.value - inset;
            if (el) el.scrollTo({ left, behavior: 'smooth' });
            info.value.x = left;
        }
    };

    const resize = () => {
        if (!el) return;
        info.value.clientWidth = el.clientWidth;
        info.value.added = el.clientWidth % 46; // ㄧ頁多餘寬度
        info.value.scrollWidth = el.scrollWidth - 8;
        info.value.cell = Math.floor(el.clientWidth / 46);
        info.value.width = info.value.cell * 46;
        maxPage.value = Math.ceil(32 / info.value.cell) - 1;
        info.value.backCell = (info.value.cell - (32 % info.value.cell)) % info.value.cell; // 最後一頁多幾個cell
        info.value.backWidth = (el.clientWidth % info.value.cell) + info.value.backCell * 46;// (info.value.width * (maxPage.value + 1)) - info.value.scrollWidth;
        maxWidth.value = info.value.scrollWidth;
        page.value = 0;
        el.scrollTo(0, 0);
        console.log(`maxWidth.value : ${(info.value.cell - (32 % info.value.cell)) * 46}
            added: ${info.value.added}
            x: ${info.value.x} max: ${maxPage.value} cell: ${info.value.cell}
            ${el.clientWidth % info.value.cell} + ${info.value.cell - (32 % info.value.cell)} * 46
            backWidth: ${info.value.backWidth} ${info.value.width * (maxPage.value + 1)} ${maxWidth.value}
        `);
    };

    const add = (element: HTMLElement | null = el) => {
        if (element) {
            element.addEventListener('touchstart', onMouseStart);
            element.addEventListener('touchmove', onMouseMove);
            element.addEventListener('touchend', onMouseEnd);
            element.addEventListener('mousedown', onMouseStart);
            element.addEventListener('mouseup', onMouseEnd);
        }
        window.addEventListener('resize', resize);
    };

    const remove = (element: HTMLElement | null = el) => {
        if (element) {
            element.removeEventListener('touchstart', onMouseStart);
            element.removeEventListener('touchmove', onMouseMove);
            element.removeEventListener('touchend', onMouseEnd);
            element.removeEventListener('mousedown', onMouseStart);
            element.removeEventListener('mouseup', onMouseEnd);
        }
        window.removeEventListener('resize', resize);
    };

    const setup = (current: HTMLElement) => {
        el = current;
        // el.style.overflow = 'hidden';
        resize();
        if (window.innerWidth < 960) add(el);
    };

    const getPositionX = () => el?.scrollLeft || 0;

    // eslint-disable-next-line no-return-assign,@typescript-eslint/no-shadow
    const setFocusElement = (el: HTMLElement | null) => focusElement.value = el;

    const clear = () => {
        page.value = 0;
        info.value.x = 0;
        if (el) el.scrollTo(0, 0);
    };

    const destroy = () => {
        if (el) {
            remove(el);
            el = null;
        }
    };

    return {
        setup,
        add,
        remove,
        clear,
        destroy,
        maxWidth,
        page,
        maxPage,
        info,
        getPositionX,
        setFocusElement
    };
};

const useNTouchMove = () => {
    if (!instance) {
        instance = createManager();
    }

    // onBeforeUnmount(() => {
    //     instance?.destroy(); // 安全銷毀
    // });

    return instance;
};

export default useNTouchMove;
