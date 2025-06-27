import { computed, Ref } from 'vue';

export interface ICalendars {
    name: string;
    color: string;
    checked: boolean;
    isUpdate: boolean;
    sort?: number;
}
export interface IEvents {
    title: string;
    startTime: string;
    endedTime: string;
    eventDesc: string;
    color?: string;
    isUpdate: boolean;
    calendar: ICalendars;
    area?: IGridArea;
    coTag?: boolean;
    link: string;
}
export interface IGridArea {
    rowStart?:number;
    columnStart: number;
    span: number,
    fragments: { columnStart: number, span: number }[]
}

export const popupTipsManager = (() => {
    const get = (key: string) => localStorage.getItem(key) || '';
    const set = (key:string, value: string | object) => {
        if (typeof value === 'string') {
            localStorage.setItem(key, value);
        } else {
            localStorage.setItem(key, JSON.stringify(value));
        }
    };
    const getStatus = (key: string) => {
        const status = get(key);
        return status === '1';
    };
    const setStatus = (key: string, value: boolean) => {
        set(key, value ? '1' : '0');
    };
    return {
        get,
        set,
        getStatus,
        setStatus
    };
})();

const useEventCalendar = (data: any, activeDate: Date, isDeflate: boolean = false) => {
    const recentlyUpdatedEndTime: number = 7 * 60 * 60 * 24 * 1000;
    const rowsMap = new Map();

    // 檢查活動是否開始
    const isContinued = (time: Date) => (time.getMonth() !== activeDate.getMonth());
    // 檢查活動是否該月結束
    const isContinuing = (time: Date, daysInMonth: number) => {
        const lastDay = time.getDate() > (31 - daysInMonth); // 超過該月份最後N天
        if (time.getFullYear() > activeDate.getFullYear() && lastDay) return true;
        return (time.getMonth() !== activeDate.getMonth() && lastDay);
    };
    const setFragment = (rows: Map<number, IGridArea>, key: number, fragment: number, span: number) => {
        const fragments: { columnStart: number, span: number }[] = rows.has(key) ? (rows?.get(key)?.fragments || []) : [];
        if (fragment >= 1) {
            fragments.push({
                columnStart: fragment,
                span
            });
        }
        return fragments;
    };
    // merge合併列
    const deflateRow = (event: IEvents, rows: Map<number, IGridArea> = rowsMap) => {
        const eventColumnStart: number = event?.area?.columnStart || 0;
        const eventSpan: number = event?.area?.span || 0;
        let currentRow: number = 0;
        let fragments: { columnStart: number, span: number }[] = [];
        let fragment: number;
        const keys: number[] = [...rows.keys()];
        for (let j = 0; j < keys.length; j += 1) {
            const key = keys[j];
            const { columnStart, span } = rows.get(key) || { columnStart: 0, span: 0 };
            if (eventColumnStart > (columnStart - 1) + span) {
                // console.log(`rows`, key, eventColumnStart, span);
                fragments = rows.get(key)?.fragments || [];
                fragment = eventColumnStart - (columnStart + span);
                // if (key === 8) {
                //     console.log(`current columnStart: ${columnStart} span: ${span} key: ${key}
                //     fragment: ${fragment} ?: ${(columnStart - 1) + span}
                //     columnStart: ${eventColumnStart} span: ${eventSpan}`);
                // }
                if (fragment > 1) {
                    fragments = setFragment(rows, key, columnStart + span, eventColumnStart - (columnStart + span));
                }
                rows.set(key, {
                    columnStart,
                    span: eventSpan + eventColumnStart - columnStart,
                    fragments
                });
                // eslint-disable-next-line no-param-reassign
                if (event && event.area) event.area.rowStart = key;
                return;
            }
            if (rows?.get(key)?.fragments && (rows?.get(key)?.fragments || []).length > 0) {
                // console.log('fragments', event.title, `key:${key}`, rows?.get(key)?.fragments);
                // 13, 13
                // 19, 5
                const seeds = rows.get(key)?.fragments || [];
                for (let i = 0; i < seeds.length; i += 1) {
                    const seed: { columnStart: number, span: number } = seeds[i];
                    // const leftSpace: any = {
                    //     columnStart: seed.columnStart,
                    //     span: eventColumnStart - seed.columnStart
                    // };

                    const space: number = (eventColumnStart - seed.columnStart) + eventSpan;

                    // const rightSpace: any = {
                    //     columnStart: eventColumnStart + eventSpan,
                    //     span: seed.span - space
                    // };
                    // console.log(event.title, eventColumnStart, '>', seed.columnStart, space, '<', seed.span);

                    if (eventColumnStart >= seed.columnStart
                        && space <= seed.span) {
                        // eslint-disable-next-line no-param-reassign
                        if (event && event.area) event.area.rowStart = key;
                        setFragment(rows, key, seed.columnStart, eventColumnStart - seed.columnStart);
                        seeds[i].columnStart = eventColumnStart + eventSpan;
                        seeds[i].span = seed.span - space;
                        return;
                    }
                }
            }
            currentRow = key;
        }
        // console.log("currentRow", currentRow, event.area.rowStart);
        // eslint-disable-next-line no-param-reassign
        if (event && event.area) event.area.rowStart = currentRow + 1;
        fragment = eventColumnStart - 1;
        if (fragment > 1) {
            fragments = setFragment(
                rows,
                currentRow + 1,
                1,
                eventColumnStart - 1
            );
            // if (event.title === 'GG电子') console.log(`GG电子 key: ${currentRow + 1}
            //         # fragment: ${fragment}
            //         # columnStart: ${eventColumnStart} span: ${event.area.span}`);
            // if (event.title === 'GG电子') console.log("GG电子 fragments:", fragments);
        }
        rows.set(currentRow + 1, {
            columnStart: eventColumnStart,
            span: eventSpan,
            fragments
        });
    };
    // 產生grid-area參數
    const gridSpan = (startTime: string, endedTime: string, index: number): IGridArea => {
        const start:Date = new Date(startTime);
        const ended:Date = new Date(endedTime);
        const daysInMonth = new Date(activeDate.getFullYear(), activeDate.getMonth() + 1, 0).getDate();
        let space: number;
        let offset: number;
        if ((start.getFullYear() < activeDate.getFullYear())
            || (start.getMonth() < activeDate.getMonth())) {
            offset = 1; // 活動該月前已經開始
        } else {
            offset = start.getDate();
        }
        if ((ended.getFullYear() > activeDate.getFullYear())) {
            space = 32; // 活動該月還沒結束
        } else if ((ended.getMonth() > activeDate.getMonth())) {
            if (offset === 1) {
                space = Math.max(32, daysInMonth + 1 + ended.getMonth());
            } else {
                space = daysInMonth - (start.getDate() - 1) + 1 + (31 - daysInMonth);
            }
        } else {
            const startDay: number = start.getMonth() !== activeDate.getMonth() ? 0 : start.getDate() - 1;
            space = (ended.getDate() - startDay) + 1;
        }
        return { rowStart: index, columnStart: offset, span: space, fragments: [] };
    };
    const setupEvents = (event_list: any, color: string, calendar: ICalendars, startIndex: number = 0) => {
        const events: IEvents[] = [];
        let monthIsUpdate: boolean = false;
        event_list.forEach(({ company_name, start_at, end_at, title, tooltip_title, updated_at, link_text, link }: any) => {
            const isUpdate = (Date.now() - new Date(updated_at).getTime()) < recentlyUpdatedEndTime;
            const startTime: string = start_at.substring(0, 10).replace(/-/g, '/');
            const endedTime: string = end_at.substring(0, 10).replace(/-/g, '/');
            const row: number = startIndex + events.length + 1;

            const event: IEvents = {
                title: company_name,
                startTime,
                endedTime,
                eventDesc: tooltip_title,
                color,
                calendar,
                isUpdate,
                area: gridSpan(startTime, endedTime, row),
                coTag: link_text === 'tags',
                link
            };
            if (isUpdate) monthIsUpdate = true;
            if (isDeflate) deflateRow(event);
            if (new Date(start_at).getFullYear() === activeDate.getFullYear()) events.push(event);
        });
        return { events, monthIsUpdate };
    };
    const setup = (source: any) => {
        const calendars: ICalendars[] = [];
        const events: IEvents[] = [];
        let monthIsUpdate: boolean = false;
        source.sort((a: any, b: any) => a.sort - b.sort);
        source.forEach((item: any) => {
            const { title, color_code, sort } = item;
            const calendar: ICalendars = {
                name: title,
                color: color_code,
                checked: true,
                isUpdate: false,
                sort
            };
            const cEvents = setupEvents(item.event_list, color_code, calendar, events.length);
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            events.push(...cEvents.events);
            if (cEvents.monthIsUpdate) monthIsUpdate = true;
            calendars.push(calendar);
        });
        calendars.sort((a: any, b: any) => a.sort - b.sort);
        // events.sort((a: any, b: any) => a.calendar.sort - b.calendar.sort);
        console.log([...rowsMap.entries()]);
        return { calendars, events, monthIsUpdate };
    };
    const { calendars, events, monthIsUpdate } = setup(data);
    return {
        calendars,
        events,
        monthIsUpdate,
        deflateRow
    };
};

export default useEventCalendar;
