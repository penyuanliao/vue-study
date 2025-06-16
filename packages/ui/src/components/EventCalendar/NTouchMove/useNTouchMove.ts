



const useNTouchMove = () => {
    const manager = () => {
        let el: HTMLElement = null;
        let moveStartX: Number = 0;
        let count: number = 0;
        let maxCount: number = 0;
        let maxWidth: number = 0;
        const onMouseStart = (e: TouchEvent) => {
            const touch = e.changedTouches[0];
            moveStartX = touch.clientX;
        };

        const onMouseMove = (e: TouchEvent) => {
            const clientX = e.changedTouches[0].clientX;
            const deltaX = clientX - moveStartX;
            // console.log("deltaX", deltaX);
        };

        const onMouseEnd = (e: TouchEvent) => {
            const clientX = e.changedTouches[0].clientX;
            const deltaX = clientX - moveStartX;
            // console.log(`deltaX: ${deltaX}, screenX: ${e.changedTouches[0].screenX}`);
            if (deltaX < 100) {
                if (count + 1 > maxCount) return;
                count += 1;
                el.scrollTo({ left: el.clientWidth * count, behavior: 'smooth' });
            } else if (deltaX > -100) {
                if (count - 1 < 0) return;
                count -= 1;
                el.scrollTo({ left: el.clientWidth * count, behavior: 'smooth' });
            }
        };

        const add = (el: HTMLElement) => {
            el.addEventListener('touchstart', onMouseStart);
            el.addEventListener('touchmove', onMouseMove);
            el.addEventListener('touchend', onMouseEnd);
        };

        const remove = (el: HTMLElement) => {
            el.removeEventListener('touchstart', onMouseStart);
            el.removeEventListener('touchmove', onMouseMove);
            el.removeEventListener('touchend', onMouseEnd);
        };

        const setup = (current: HTMLElement) => {
            el = current;
            // el.style.overflow = 'hidden';
            maxWidth = el.scrollWidth - el.clientWidth;
            maxCount = Math.ceil(maxWidth / el.clientWidth);
            console.log(`setup.touchMove`, maxWidth, el.scrollWidth, el.clientWidth, maxWidth/el.clientWidth);
            add(el);
        };

        return {
            setup,
            add,
            remove
        }
    }

    return {
        manager
    };
}

export default useNTouchMove;
