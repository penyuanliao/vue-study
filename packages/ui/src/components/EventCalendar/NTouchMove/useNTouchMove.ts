import { onBeforeUnmount, ref } from "vue";

let instance: ReturnType<typeof createManager> | null = null;

type SwipeDirection = 'left' | 'right';

export interface ITouchMoveInfo {
    width: number;
    cell: number;
    scrollWidth: number;
    x: 0
}

const createManager = () => {
    let el: HTMLElement = null;
    let moveStartX: Number = 0;
    // 目前第幾頁
    const page = ref<number>(0);
    // 最大頁數
    const maxPage = ref<number>(0);
    // 最大寬度
    const maxWidth = ref<number>(0);

    const info = ref<ITouchMoveInfo>({
        width: 0,
        cell: 0,
        scrollWidth: 0,
        x: 0
    });

    let listeners: Partial<Record<SwipeDirection, () => void>> = {};

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
        let clientX: number;
        if (e instanceof TouchEvent) {
            const touch = e.changedTouches[0];
            clientX = touch.clientX;
        } else {
            clientX = e.clientX;
        }
        const deltaX = clientX - moveStartX;
        // console.log(`deltaX: ${deltaX}, screenX: ${e.changedTouches[0].screenX}`);
        if (deltaX < -100) {
            console.log(`onMouseEnd maxPage ${page.value + 1} ${maxPage.value}`);
            if (page.value + 1 > maxPage.value) return;
            page.value += 1;
            el.scrollTo({ left: el.clientWidth * page.value, behavior: 'smooth' });
            info.value.x = el.scrollLeft + el.clientWidth;
        } else if (deltaX > 100) {
            console.log(`2onMouseEnd maxPage ${page.value + 1} ${maxPage.value}`);
            if (page.value - 1 < 0) return;
            page.value -= 1;
            el.scrollTo({ left: el.clientWidth * page.value, behavior: 'smooth' });
            info.value.x = el.scrollLeft - el.clientWidth;
        }

    };

    const resize = () => {
        info.value.width = el.clientWidth;
        info.value.scrollWidth = el.scrollWidth;
        info.value.cell = Math.floor(el.clientWidth / 46);
        maxWidth.value = el.scrollWidth;
        maxPage.value = Math.ceil(maxWidth.value / el.clientWidth) -1;
        page.value = 0;
        el.scrollTo(0, 0);
    }

    const add = (el: HTMLElement) => {
        el.addEventListener('touchstart', onMouseStart);
        el.addEventListener('touchmove', onMouseMove);
        el.addEventListener('touchend', onMouseEnd);
        el.addEventListener('mousedown', onMouseStart);
        el.addEventListener('mouseup', onMouseEnd);
        window.addEventListener('resize', resize);
    };

    const remove = (el: HTMLElement) => {
        el.removeEventListener('touchstart', onMouseStart);
        el.removeEventListener('touchmove', onMouseMove);
        el.removeEventListener('touchend', onMouseEnd);
        el.removeEventListener('mousedown', onMouseStart);
        el.removeEventListener('mouseup', onMouseEnd);
        window.removeEventListener('resize', resize);
    };

    const setup = (current: HTMLElement) => {
        el = current;
        // el.style.overflow = 'hidden';
        resize();
        add(el);
    };
    const clear = () => {
        page.value = 0;
        el.scrollTo(0, 0);
    }

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
        info
    }
}

const useNTouchMove = () => {

    if (!instance) {
        instance = createManager();
    }

    // onBeforeUnmount(() => {
    //     instance?.destroy(); // 安全銷毀
    // });

    return instance;
}


export default useNTouchMove;
