import json from './data.json';
import { Ref } from 'vue';

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
  hot: boolean;
  calendar: ICalendars;
}
const useEventCalendar = (data: Ref<any>) => {
  const setup = (source: any) => {
    const calendars: ICalendars[] = [];
    const events: IEvents[] = [];
    source.forEach((item: any) => {
      const { title, color_code, sort, id } = item;
      const calendar: ICalendars = {
        name: title,
        color: color_code,
        checked: true,
        sort
      };
      calendars.push(calendar);
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      events.push(...setupEvents(item.event_list, color_code, calendar));
    });
    calendars.sort((a: any, b: any) => a.sort - b.sort);
    events.sort((a: any, b: any) => a.calendar.sort - b.calendar.sort);
    return { calendars, events };
  };
  const setupEvents = (event_list: any, color: string, calendar: ICalendars) => {
    const events: IEvents[] = [];
    console.log(event_list);
    event_list.forEach(({ company_name, start_at, end_at, title, tooltip_title, created_at }: any) => {
      const hot = (Date.now() - new Date(created_at).getTime()) < 7 * 60 * 60 * 24 * 1000;
      events.push({
        title: company_name,
        startTime: start_at.substring(0, 10).replace(/-/g, '/'),
        endedTime: end_at.substring(0, 10).replace(/-/g, '/'),
        eventDesc: tooltip_title,
        color,
        calendar,
        hot
      });
    });
    return events;
  };

  const { calendarData } = data?.value || {};

  const groupList = calendarData?.groupList || json;

  const { calendars, events } = setup(groupList);

  return {
    calendars,
    events
  };
};

export default useEventCalendar;
