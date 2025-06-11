import { computed, Ref } from 'vue';

export interface ICalendars {
    name: string;
    color: string;
    checked: boolean;
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
}
export interface IGridArea {
    rowStart:number;
    columnStart: number;
    span: number
}

const useEventCalendar = (data: any, activeDate: Date, isDeflate: boolean = false) => {
    const recentlyUpdatedEndTime: number = 7 * 60 * 60 * 24 * 1000;
    const rowsMap = new Map();

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
    // 檢查活動是否開始
    const isContinued = (time: Date) => {
        return (time.getMonth() !== activeDate.getMonth());
    }
    // 檢查活動是否該月結束
    const isContinuing = (time: Date, daysInMonth: number) => {
        const lastDay = time.getDate() > (31 - daysInMonth); // 超過該月份最後N天
        if (time.getFullYear() > activeDate.getFullYear() && lastDay) return true;
        return (time.getMonth() !== activeDate.getMonth() && lastDay);
    }
    const setFragment = (rows: Map<number, IGridArea> = rowsMap, key: number, fragment: number, span: number) => {
        const fragments: { columnStart: number, span: number }[] = rows.has(key) ? rows.get(key).fragments : [];
        if (fragment >= 1) {
            fragments.push({
                columnStart: fragment,
                span
            });
        }
        return fragments;
    }
    // merge合併列
    const deflateRow = (event: IEvents, rows: Map<number, IGridArea> = rowsMap) => {
        let currentRow: number = 0;
        let fragments: { columnStart: number, span: number }[] = [];
        let fragment: number;
        for (const [key, { columnStart, span }] of rows.entries()) {
            if (event.area.columnStart > (columnStart - 1) + span) {
                // console.log(`rows`, key, event.area.columnStart, span);
                fragments = rows.get(key).fragments || [];
                fragment = event.area.columnStart - (columnStart + span);
                if (key === 8) {
                    console.log(`current columnStart: ${columnStart} span: ${span} key: ${key}
                    fragment: ${fragment} ?: ${(columnStart - 1) + span}
                    columnStart: ${event.area.columnStart} span: ${event.area.span}`);
                }
                if (fragment > 1) {
                    fragments = setFragment(rows, key, columnStart + span, event.area.columnStart - (columnStart + span));
                }
                rows.set(key, {
                    columnStart,
                    span: event.area.span + event.area.columnStart - columnStart,
                    fragments
                });
                event.area.rowStart = key;
                return;
            } else if (rows.get(key).fragments && rows.get(key).fragments.length > 0) {
                console.log("fragments", event.title, `key:${key}`, rows.get(key).fragments);
                // 13, 13
                // 19, 5
                for (const fragment of rows.get(key).fragments) {
                    const leftSpace: any = {
                        columnStart: fragment.columnStart,
                        span: event.area.columnStart - fragment.columnStart
                    };

                    const space: number = (event.area.columnStart - fragment.columnStart) + event.area.span;

                    const rightSpace: any = {
                        columnStart: event.area.columnStart + event.area.span,
                        span: fragment.span - space
                    }
                    console.log(event.title, event.area.columnStart, '>', fragment.columnStart, space, '<', fragment.span);

                    if (event.area.columnStart >= fragment.columnStart
                        && space < fragment.span) {
                        event.area.rowStart = key;
                        //TODO: 這邊還需要紀錄剩下來的空間
                        setFragment(rows, key, fragment.columnStart, event.area.columnStart - fragment.columnStart);
                        fragment.columnStart = event.area.columnStart + event.area.span;
                        fragment.span = fragment.span - space;
                        return;
                    }
                }
            }
            currentRow = key;
        }
        // console.log("currentRow", currentRow, event.area.rowStart);
        event.area.rowStart = currentRow + 1;
        fragment = event.area.columnStart - 1;
        if (fragment > 1) {
            fragments = setFragment(rows,
                currentRow + 1,
                1,
                event.area.columnStart - 1);
            if (event.title === 'GG电子') console.log(`GG电子 key: ${currentRow + 1}
                    # fragment: ${fragment}
                    # columnStart: ${event.area.columnStart} span: ${event.area.span}`);
            if (event.title === 'GG电子') console.log("GG电子 fragments:", fragments);
        }
        rows.set(currentRow + 1, {
            columnStart: event.area.columnStart,
            span: event.area.span,
            fragments
        });
    }
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
            if (offset === 1)
                space = Math.max(32, daysInMonth + 1 + ended.getMonth());
            else
                space = daysInMonth - (start.getDate() - 1) + 1 + (31 - daysInMonth);
        } else {
            const startDay: number = start.getMonth() !== activeDate.getMonth() ? 0 : start.getDate() - 1;
            space = (ended.getDate() - startDay) + 1;
        }
        return { rowStart: index, columnStart: offset, span: space };
    }
    const setupEvents = (event_list: any, color: string, calendar: ICalendars, startIndex: number = 0) => {
        const events: IEvents[] = [];
        let monthIsUpdate: boolean = false;
        event_list.forEach(({ company_name, start_at, end_at, title, tooltip_title, updated_at }: any) => {
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
                area: gridSpan(startTime, endedTime, row)
            };
            if (isUpdate) monthIsUpdate = true;
            if (isDeflate) deflateRow(event);
            events.push(event);
        });
        return { events, monthIsUpdate };
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
