<script lang="ts">
// @ts-nocheck
import { defineComponent, ref } from 'vue';
import NCalendarContent from './NCalendarContent/index.vue';
import GridType from '@/components/EventCalendar/NCalendarContent/GridType.vue';
import NSearchButton from '@/components/EventCalendar/Button/NSearchButton.vue';
import NToggleButton from '@/components/EventCalendar/Button/NToggleButton.vue';
import NEventCalendarToolbar from '@/components/EventCalendar/NCalendarToolbar/index.vue';
import NSidebar from '@/components/EventCalendar/NSidebar/index.vue';
import useEventCalendar, { ICalendars, IEvents } from '@/components/EventCalendar/useEventCalendar.ts';

export default defineComponent({
    name: 'CalendarTimeline',
    components: {
        NSidebar,
        NEventCalendarToolbar,
        NToggleButton,
        NSearchButton,
        GridType,
        NCalendarContent
    },
    setup(props) {
        const isToday = ref<boolean>(false);
        const activeDate = ref<Date>(new Date('2024/08'));
        const calendars = ref<ICalendars[]>([
            {
                name: '本月上线',
                color: '#FF9FA0',
                checked: true,
                sort: 1
            },
            {
                name: '持续进行',
                color: '#74DFFF',
                checked: true,
                sort: 1
            },
            {
                name: '独家活动',
                color: '#FFDD48',
                checked: true,
                sort: 1
            },
            {
                name: '游戏商',
                color: '#FF9FA0',
                checked: false,
                sort: 1
            }
        ]);
        const events = ref<IEvents[]>([]);
        const gridType = ref<String>('medium');
        const handle = (value: { isChecked: boolean, id: string }) => {
            console.log('#tag1-change', value);
        };

        const gridTypeChange = (value: string) => {
            console.log('#Grid Type:', value);
            gridType.value = value;
        };
        const searchSubmitHandle = (value: string) => {
            console.log(`searchSubmitHandle: ${value}`);
        };
        const onClickCalendarThHandle = (th: string) => {
            console.log(`onClickCalendarThHandle: ${th}`);

        };
        // groups.value[0].events_list // 該TAG行事曆清單
        const eventCalendar = useEventCalendar();
        calendars.value = eventCalendar.calendars;
        events.value = eventCalendar.events;

        return {
            events,
            calendars,
            isToday,
            activeDate,
            handle,
            gridTypeChange,
            searchSubmitHandle,
            onClickCalendarThHandle,
            gridType
        };
    }
});
</script>

<template>
    <div class="calendar-timeline-container">
        <div class="n-calendar-wrap">
            <!-- 標題日期 -->
            <div class="title">
                <NToggleButton @selected="(value:boolean) => (isToday = value)">今天</NToggleButton>
                <NEventCalendarToolbar
                    :four-monthly-period="['2024/08/12', '2024/07/12', '2024/06/06', '2024/05/10']"
                    :currentDate="activeDate"
                    @click="onClickCalendarThHandle"
                />
                <div class="grid-type-group">
                    <label class="button-group-title">Grid Type</label>
                    <GridType @change="gridTypeChange" />
                </div>
                <NSearchButton @submit="searchSubmitHandle"/>
            </div>
            <!-- 標籤 -->
            <NSidebar class="sidebar" v-model:calendars="calendars" />
            <div class="content scroll-bar-horizontal">
                <NCalendarContent
                    :gridType="gridType"
                    :activeDate="activeDate"
                    :events="events"
                    :selected="isToday"
                />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use 'theme';

.calendar-timeline-container {
    min-height: 1080px;
    max-width: 1920px;
    height: 100%;
    width: 100%;
    background: #F15624;
    position: relative;
    //padding: 29px 52px;
    padding: 19px 12px;
}
.n-calendar-wrap {
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.1);
    position: relative;
    display: grid;
    grid-template-columns: auto 4fr;
    grid-column-gap: 0;
    align-items: start;
    border-radius: 30px;
    border: rgba(255, 255, 255, 0.3) 1px solid;
    padding: 30px 30px;
    // padding: 15px 15px;
    z-index: 0;
    &:before {
        content: '';
        position: absolute;
        inset: 15px;
        background: white;
        border-radius: 24px;
        z-index: -1;
    }
    .title {
        width: 100%;
        height: 100%;
        min-height: 100px; // 146px
        grid-column: 1 / span 4;
        grid-column-start: 2;
        position: relative;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        text-align: center;
        justify-content: space-between;
        gap: 10px;
        transition: all 0.3s;
        @media (max-width: 959px) {
            grid-column-start: 1;
        }
    }
    .sidebar {
        grid-column: 1 / span 1;
    }
    .content {
        width: 100%;
        height: 100%;
        position: relative;
        grid-column: 2 / span 4;
        display: flex;
        justify-content: center;
        overflow: hidden;
        overflow-x: scroll;
    }
    .search-btn {
        position: absolute;
    }
}

.grid-type-group {
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    .button-group-title {
        font-size: 19px;
        font-weight: 500;
        color: #606060;
        padding-right: 6px;
        user-select: none;
    }
}
</style>
