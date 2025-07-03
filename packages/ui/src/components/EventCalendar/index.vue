<script lang="ts">
// @ts-nocheck
import { defineComponent, onMounted, ref } from "vue";
import NCalendarContent from './NCalendarContent/index.vue';
import GridType from '@/components/EventCalendar/NCalendarContent/GridType.vue';
import NSearchButton from '@/components/EventCalendar/Button/NSearchButton.vue';
import NToggleButton from '@/components/EventCalendar/Button/NToggleButton.vue';
import NEventCalendarToolbar from '@/components/EventCalendar/NCalendarToolbar/index.vue';
import NSidebar from '@/components/EventCalendar/NSidebar/index.vue';
import NDialog from "@/components/EventCalendar/Tips/NDialog.vue";
import useEventCalendar, { ICalendars, IEvents, popupTipsManager } from '@/components/EventCalendar/useEventCalendar.ts';
import json from './data.json';
import month6 from './data2.json';
import month5 from './dataMonth5.json';
import month7 from './dataMonth7.json';
import useNTouchMove from "@/components/EventCalendar/NTouchMove/useNTouchMove";
import NSymbols from "@/components/EventCalendar/Button/NSymbols.vue";

export default defineComponent({
    name: 'EventCalendar',
    components: {
        NSymbols,
        NDialog,
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
        const current = ref<any>(null);
        const now = new Date('2024/6/1');
        const popupTips = ref<boolean>(false);
        const isCurrentMonth = ref<boolean>(false);
        const activeDate = ref<Date>(new Date('2024/08/02')); // safari 要到日不能只有月份
        const calendars = ref<ICalendars[]>([]);
        const events = ref<IEvents[]>([]);
        const gridType = ref<'medium' | 'small'>('small');
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
        const searchString = ref<string>('');
        const showSidebar = ref<boolean>(false);
        const showToolbar = ref<boolean>(true);
        const isDeflate = ref<boolean>(true);
        const contentRef = ref<HTMLElement|null>(null);
        const touchManager = useNTouchMove();

        const setData = (month: string) => {
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
        }

        const handle = (value: { isChecked: boolean, id: string }) => {
            console.log('#tag1-change', value);
        };

        const gridTypeChange = (value: string) => {
            console.log('#Grid Type:', gridType.value, value);
            gridType.value = value;
        };
        const searchSubmitHandle = (value: string) => {
            console.log(`searchSubmitHandle: ${value}`);
            searchString.value = value;
            if (value === '') {
                events.value = current.value?.events;

            } else {
                events.value = current.value?.events.filter(({ title, eventDesc }: IEvents) => {
                    return title.includes(value) || eventDesc.includes(value);
                });
            }
        };
        const onSearchOpenHandle = (value: boolean) => {
            const isMobile: boolean = (window.innerWidth < 960);
            if (isMobile) {
                showToolbar.value = !value;
            } else {
                showToolbar.value = true;
            }
            console.log("onSearchOpenHandle", isMobile, value);
        };
        const onClickSidebarMenuHandle = () => {
            showSidebar.value = !showSidebar.value;
            console.log("showSidebar", showSidebar.value);
        }
        const onClickCalendarThHandle = (th: string) => {
            const [ year, month ] = th.split("/");
            const selectMonth: string = (th.split('/') <= 2) ? `${th}/1` : th;
            console.log(`onClickCalendarThHandle: ${selectMonth}`, selectMonth.indexOf('2024/06'), activeDate.value.getMonth() === now.getMonth());
            activeDate.value = new Date(selectMonth);
            isCurrentMonth.value = activeDate.value.getMonth() === now.getMonth();
            setData(month);
            const eventCalendar = useEventCalendar(apiData.value, activeDate.value, isDeflate.value);
            calendars.value = eventCalendar.calendars;
            events.value = eventCalendar.events;
            current.value = eventCalendar;
            touchManager.clear();
            if (searchString.value) searchSubmitHandle(searchString.value);
        };

        const onClickThisMonthHandle = (bool: boolean) => {
            console.log(`onClickThisMonthHandle: ${bool}`);
            // popupTips.value = !popupTips.value; // 測試提示彈窗
            // isDeflate.value = !isDeflate.value; // 測試合併活動時間

            fourMonthlyPeriod.value.forEach((item, index) => {
                const act: Date = new Date(item.key);
                if (act.getMonth() === now.getMonth()) {
                    activeDate.value = act;
                    setData(`${act.getMonth() + 1}`);
                    const eventCalendar = useEventCalendar(apiData.value, activeDate.value, isDeflate.value);
                    calendars.value = eventCalendar.calendars;
                    events.value = eventCalendar.events;
                    current.value = eventCalendar;
                    touchManager.clear();
                }
            });
        };


        onMounted(() => {

            touchManager.setup(contentRef.value);

            fourMonthlyPeriod.value.forEach((item, index) => {
                const [ year, month ] = item.key.split("/");
                const act: Date = new Date(item.key);
                setData(month);
                const eventCalendar = useEventCalendar(apiData.value, act, isDeflate.value);
                fourMonthlyPeriod.value[index].isUpdate = eventCalendar.monthIsUpdate;
                if (act.getMonth() === now.getMonth()) {
                    calendars.value = eventCalendar.calendars;
                    events.value = eventCalendar.events;
                    activeDate.value = act;
                    current.value = eventCalendar;
                    console.log('events:', events.value);
                    console.log('monthIsUpdate:', eventCalendar.monthIsUpdate);
                    touchManager.clear();

                }
            });
            popupTips.value = !popupTipsManager.getStatus('event-calendar-popup-tips');
            console.log("contentRef", contentRef.value);


        });
        return {
            contentRef,
            popupTips,
            events,
            calendars,
            isCurrentMonth,
            activeDate,
            fourMonthlyPeriod,
            showSidebar,
            showToolbar,
            popupTipsManager,
            handle,
            gridTypeChange,
            searchSubmitHandle,
            onSearchOpenHandle,
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
            <div class="n-title">
                <NToggleButton
                    class="today-btn"
                    :once="true"
                    v-model:selected="isCurrentMonth"
                    @selected="(value:boolean) => onClickThisMonthHandle(value)"
                >
                    {{ '今天' }}
                </NToggleButton>
                <NEventCalendarToolbar
                    :style="{
                        visibility: showToolbar ? 'visible' : 'hidden'
                    }"
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
                <NSearchButton
                    class="search-btn"
                    @submit="searchSubmitHandle"
                    @open="onSearchOpenHandle"
                />
            </div>
            <!-- Mobile -->
            <div
                class="sidebar-menu"
                @pointerup="onClickSidebarMenuHandle"
            >
                <NSymbols name="menu" />
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
                    v-model:calendars="calendars"
                />
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
            <div
                class="content scroll-bar-horizontal"
                ref="contentRef"
            >
                <NCalendarContent
                    :gridType="gridType"
                    :activeDate="activeDate"
                    :events="events"
                    :selected="isCurrentMonth"
                />
            </div>
            <div
                :class="{
                    mask: true,
                    active: showSidebar,
                }"
                @pointerup="onClickSidebarMenuHandle"
            />
        </div>
        <NDialog
            v-model:open="popupTips"
            label="一周内更新资讯"
            @close="popupTipsManager.setStatus('event-calendar-popup-tips', true)"
        />
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
    //border-radius: 30px;
    border: rgba(255, 255, 255, 0.3) 1px solid;
    padding: 30px 20px;
    z-index: 0;
    &:before {
        content: '';
        position: absolute;
        inset: 15px;
        background: white;
        border-radius: 24px;
        z-index: -1;
    }
    .n-title {
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
        overflow: visible;
        max-width: calc(46px * 32);
        margin: 0 auto;
        padding-left: 5px;
        flex-shrink: 0;
        @media (max-width: 1772px) {
            padding-left: 10px;
        }
        @media (max-width: 1161px) {
            grid-column-start: 1;
        }

    }
    .sidebar-menu {
        display: none;
    }
    .sidebar-collapse {
        grid-column: 1 / span 1;
        margin-right: 4px;
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
        border-bottom-left-radius: 24px;
        border-bottom-right-radius: 24px;
        scroll-snap-type: x mandatory;
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
            z-index: 12;
            &.active {
                position: absolute;
                display: block;
                width: calc(100% + 4px);
                height: calc(100% + 4px);
                top: -2px;
                left: -2px;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(5px);
                transition: all 0.1s;
                pointer-events: auto;
            }
        }
    }
    .n-calendar-wrap {
        width: 100%;
        padding: 8px 8px;
        overflow: hidden;

        &:before {
            inset: 8px;
        }
        .n-title {
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
            top: 30px;
            left: 25px;
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
                pointer-events: auto;
                opacity: 1;
            }
            .sidebar {
                padding-bottom: 0;
            }
            .sidebar-driver {
                display: inline;
                width: 158px;
                height: 1px;
                background: #DFDFDF;
                margin-top: 14px;
            }
        }
        .content {
            grid-area: 2 / 1 / auto / span 4;
            padding: 0 0 0 8px;
            transition: all 0.3s ease;
            overflow: hidden;
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
        right: 10px;
        width: calc(100% - 53px);
        pointer-events: none;
    }

}

</style>
