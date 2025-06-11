<script lang="ts">
// @ts-nocheck
import { defineComponent, onMounted, ref } from "vue";
import NCalendarContent from './NCalendarContent/index.vue';
import GridType from '@/components/EventCalendar/NCalendarContent/GridType.vue';
import NSearchButton from '@/components/EventCalendar/Button/NSearchButton.vue';
import NToggleButton from '@/components/EventCalendar/Button/NToggleButton.vue';
import NEventCalendarToolbar from '@/components/EventCalendar/NCalendarToolbar/index.vue';
import NSidebar from '@/components/EventCalendar/NSidebar/index.vue';
import useEventCalendar, { ICalendars, IEvents } from '@/components/EventCalendar/useEventCalendar.ts';
import json from './data.json';
import month6 from './data2.json';
import month5 from './dataMonth5.json';
import month7 from './dataMonth7.json';

export default defineComponent({
    name: 'EventCalendar',
    components: {
        NSidebar,
        NEventCalendarToolbar,
        NToggleButton,
        NSearchButton,
        GridType,
        NCalendarContent
    },
    setup(props) {
        // DEMO
        const apiData = ref(json);

        const isToday = ref<boolean>(false);
        const activeDate = ref<Date>(new Date('2024/08/02')); // safari 要到日不能只有月份
        const calendars = ref<ICalendars[]>([]);
        const events = ref<IEvents[]>([]);
        const gridType = ref<'medium'| 'small'>('small');
        const fourMonthlyPeriod = ref<{ key: string, isUpdate: boolean }[]>([
            {
                key: '2024/5/1',
                isUpdate: false
            },
            {
                key: '2024/6/1',
                isUpdate: false
            },
            {
                key: '2024/7/1',
                isUpdate: false
            },
            {
                key: '2024/8/1',
                isUpdate: true
            }
        ]);
        const showSidebar = ref<boolean>(false);

        const isDeflate = ref<boolean>(false);

        const handle = (value: { isChecked: boolean, id: string }) => {
            console.log('#tag1-change', value);
        };

        const gridTypeChange = (value: string) => {
            console.log('#Grid Type:', gridType.value, value);
            gridType.value = value;
        };
        const searchSubmitHandle = (value: string) => {
            console.log(`searchSubmitHandle: ${value}`);
            console.log(events.value);
            if (value === '') {
                events.value = eventCalendar.events;

            } else {
                events.value = events.value.filter(({ title, eventDesc }: IEvents) => {
                    console.log(title, eventDesc);
                    return title.includes(value) || eventDesc.includes(value);
                });
            }
        };
        const onClickSidebarMenuHandle = () => {
            showSidebar.value = !showSidebar.value;
            console.log("showSidebar", showSidebar.value);
        }
        const onClickCalendarThHandle = (th: string) => {
            const [ year, month ] = th.split("/");
            const selectMonth: string = (th.split('/') <= 2) ? `${th}/1` : th;
            console.log(`onClickCalendarThHandle: ${selectMonth}`, selectMonth.indexOf('2024/06'));
            activeDate.value = new Date(selectMonth);

            if (+month === 5) {
                apiData.value = month5;
            }
            if (+month === 6) {
                apiData.value = month6;
            }
            if (+month === 7) {
                apiData.value = month7;
            }
            if (+month === 8) {
                apiData.value = json;
            }
            const eventCalendar = useEventCalendar(apiData.value, activeDate.value, isDeflate.value);
            calendars.value = eventCalendar.calendars;
            events.value = eventCalendar.events;
            fourMonthlyPeriod.value.forEach((item, index) => {
                if (item.key === th) {
                    fourMonthlyPeriod.value[index].isUpdate = eventCalendar.monthIsUpdate;
                }
            });
        };

        const onClickThisMonthHandle = (bool: boolean) => {
            console.log(`onClickThisMonthHandle: ${bool}`);
            // const now = new Date();
            // onClickCalendarThHandle(`${now.getFullYear()}/${now.getMonth() + 1}`);
            isDeflate.value = !isDeflate.value;
            const eventCalendar = useEventCalendar(apiData.value, activeDate.value, isDeflate.value);
            calendars.value = eventCalendar.calendars;
            events.value = eventCalendar.events;
        };
        // groups.value[0].events_list // 該TAG行事曆清單
        const eventCalendar = useEventCalendar(apiData.value, activeDate.value, isDeflate.value);
        calendars.value = eventCalendar.calendars;
        events.value = eventCalendar.events;
        console.log('events:', events.value);
        console.log('monthIsUpdate:', eventCalendar.monthIsUpdate);
        fourMonthlyPeriod.value[3].isUpdate = eventCalendar.monthIsUpdate;

        onMounted(() => {
            fourMonthlyPeriod.value.forEach((item, index) => {
                const [ year, month ] = item.key.split("/");
                let source;
                if (+month === 5) {
                    source = month5;
                }
                if (+month === 6) {
                    source = month6;
                }
                if (+month === 7) {
                    source = month7;
                }
                if (+month === 8) {
                    source = json;
                }
                const eventCalendar = useEventCalendar(source, activeDate.value, isDeflate.value);
                fourMonthlyPeriod.value[index].isUpdate = eventCalendar.monthIsUpdate;

            });
        });
        return {
            events,
            calendars,
            isToday,
            activeDate,
            fourMonthlyPeriod,
            showSidebar,
            handle,
            gridTypeChange,
            searchSubmitHandle,
            onClickThisMonthHandle,
            onClickCalendarThHandle,
            onClickSidebarMenuHandle,
            gridType
        };
    }
});
</script>

<template>
    <div class="event-calendar-container">
        <div class="n-calendar-wrap">
            <!-- 標題日期 -->
            <div class="title">
                <NToggleButton
                    class="today-btn"
                    v-model:selected="isToday"
                    @selected="(value:boolean) => onClickThisMonthHandle(value)">今天</NToggleButton>
                <NEventCalendarToolbar
                    :fourMonthlyPeriod="fourMonthlyPeriod"
                    :currentDate="activeDate"
                    @click="onClickCalendarThHandle"
                />
                <div class="grid-type-group">
                    <div class="button-group-title">Grid Type</div>
                    <GridType
                        v-model:selected="gridType"
                        @change="gridTypeChange"
                    />
                </div>
                <NSearchButton class="search-btn" @submit="searchSubmitHandle"/>
            </div>
            <!-- Mobile -->
            <div
                class="sidebar-menu"
                @click="onClickSidebarMenuHandle"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z" fill="#9F9F9F"/>
                    <path d="M14 4C14 5.10457 13.1046 6 12 6C10.8954 6 10 5.10457 10 4C10 2.89543 10.8954 2 12 2C13.1046 2 14 2.89543 14 4Z" fill="#9F9F9F"/>
                    <path d="M14 20C14 21.1046 13.1046 22 12 22C10.8954 22 10 21.1046 10 20C10 18.8954 10.8954 18 12 18C13.1046 18 14 18.8954 14 20Z" fill="#9F9F9F"/>
                </svg>
            </div>
            <!-- 標籤 -->
            <div
                class="sidebar-collapse"
                :class="{
                    active: showSidebar
                }"
            >
                <NSidebar
                    class="sidebar"
                    :class="{
                        active: showSidebar
                    }"
                    v-model:calendars="calendars" />
                <div class="sidebar-driver" />
                <!-- Mobile -->
                <div class="grid-type-group-mobile">
                    <div class="button-group-title">Grid Type</div>
                    <GridType
                        v-model:selected="gridType"
                        @change="gridTypeChange"
                    />
                </div>
            </div>
            <div class="content scroll-bar-horizontal">
                <NCalendarContent
                    :gridType="gridType"
                    :activeDate="activeDate"
                    :events="events"
                    :selected="isToday"
                />
            </div>
            <div
                :class="{
                mask: true,
                active: showSidebar,
            }"
            />
        </div>
    </div>
</template>

<style scoped lang="scss">
@use 'theme';

.event-calendar-container {
    min-height: 1080px;
    min-width: 0;
    max-width: 1920px;
    height: 100%;
    width: 100%;
    background: #F15624;
    position: relative;
    //padding: 29px 52px;
    padding: 19px 12px;
    display: flex;
    justify-content: center;
    .mask {
        display: none;
    }
}
.n-calendar-wrap {
    width: 100%;
    height: 100%;
    min-width: 0;
    background-color: rgba(255, 255, 255, 0.1);
    position: relative;
    display: grid;
    grid-template-columns: auto 1fr;
    grid-column-gap: 0;
    align-items: start;
    border-radius: 30px;
    border: rgba(255, 255, 255, 0.3) 1px solid;
    padding: 30px 30px;
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
        transition: all 0.3s;
    }
    .sidebar-menu {
        display: none;
    }
    .sidebar-collapse {
        grid-column: 1 / span 1;
        margin-right: 20px;
        max-width: 220px;

        .sidebar-driver {
            display: none;
        }
    }
    .content {
        width: 100%;
        height: 100%;
        position: relative;
        grid-column: 2 / span 5;
        display: flex;
        justify-content: center;
        overflow: hidden;
        overflow-x: scroll;
        padding: 0 0 0 10px;
    }
}

.grid-type-group {
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-right: 10px;
    .button-group-title {
        font-size: 19px;
        font-weight: 500;
        color: #606060;
        padding-right: 6px;
        user-select: none;
        line-height: 28px;
    }
}
.grid-type-group-mobile {
    display: none;
}

@media (max-width: 959px) {
    .event-calendar-container {
        padding: 1px 1px;
        .mask {
            display: inline;
            pointer-events: none;
            z-index: 12;
            &.active {
                position: absolute;
                display: block;
                width: calc(100% + 4px);
                height: calc(100% + 4px);
                top: -2px;
                left: -2px;
                background: rgba(255, 255, 255, 0.3);
                backdrop-filter: blur(20px);
                transition: all 0.1s;
                pointer-events: auto;
            }
        }
    }
    .n-calendar-wrap {
        width: 100%;
        padding: 10px 10px;

        &:before {
            inset: 8px;
        }
        .title {
            min-height: 0;
            grid-area: 1 / 2 / auto / span 4;
            .today-btn {
                display: none;
            }
        }
        .sidebar-menu {
            display: inline;
            width: 24px;
            height: 24px;
            position: absolute;
            top: 32px;
            left: 27px;
            pointer-events: auto;
            z-index: 31;
        }
        .sidebar-collapse {
            width: auto;
            height: auto;
            max-width: none;
            position: absolute;
            top: 0;
            left: 0;
            grid-area: 1 / 1 / auto / span 1;
            z-index: 30;
            padding: 10px 10px 10px;
            opacity: 0;
            pointer-events: none;
            transition: opacity .3s ease-in-out;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            &:before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                width: 203px;
                height: 100%;
                background: white;
                margin: 10px 10px 10px 10px;
                border-radius: 10px;
                box-shadow: 0 10px 20px 0 #00000080;
                z-index: -1;
            }
            &.active {
                opacity: 1;
            }
            .sidebar {
                padding-bottom: 0;
            }
            .sidebar-driver {
                display: inline;
                width: 158px;
                border: 1px solid #DFDFDF;
            }
        }
        .content {
            grid-area: 2 / 1 / auto / span 4;
        }
    }
    .grid-type-group {
        display: none;
    }
    .grid-type-group-mobile {
        height: 100%;
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding-right: 10px;
        .button-group-title {
            font-size: 19px;
            font-weight: 500;
            color: #606060;
            padding-right: 6px;
            user-select: none;
            line-height: 28px;
        }
    }
    .search-btn {
        position: absolute;
        //scale: 0.7;
        right: 0;
        width: calc(100% - 47px);
    }

}

</style>
