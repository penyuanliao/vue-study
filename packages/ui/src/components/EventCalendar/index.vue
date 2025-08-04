<script lang="ts">
// @ts-nocheck
import { defineComponent, onMounted, ref } from 'vue';
import NCalendarContent from './NCalendarContent/index.vue';
import GridType from './NCalendarContent/GridType.vue';
import NSearchButton from './Button/NSearchButton.vue';
import NToggleButton from './Button/NToggleButton.vue';
import NEventCalendarToolbar from '@/components/EventCalendar/NCalendarToolbar/index.vue';
import NSidebar from '@/components/EventCalendar/NSidebar/index.vue';
import NDialog from '@/components/EventCalendar/Tips/NDialog.vue';
import useEventCalendar, { ICalendars, IEvents, popupTipsManager } from '@/components/EventCalendar/useEventCalendar.ts';
import json from './data.json';
import month6 from './data2.json';
import month5 from './dataMonth5.json';
import month7 from './dataMonth7.json';
import useNTouchMove from '@/components/EventCalendar/NTouchMove/useNTouchMove';
import NSymbols from './Button/NSymbols.vue';

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
        const now = new Date('2024/6/1'); // 今天時間
        const popupTips = ref<boolean>(false); // 是否開啟最新資訊提示
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
        const weeks: string[] = ['日', '一', '二', '三', '四', '五', '六'];

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
        // 按下月份
        const onClickCalendarThHandle = (th: string) => {
            const [ _, month ] = th.split("/");
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
                    isCurrentMonth.value = true;
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
        });
        return {
            contentRef,
            popupTips,
            events,
            calendars,
            now,
            weeks,
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
                    :title="`${now.getMonth() + 1}月 ${now.getDate()}日 (星期${weeks[now.getDay()]})`"
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
            <!-- 標籤 -->
            <div
                class="sidebar-collapse"
            >
                <NSidebar
                    class="sidebar"
                    v-model:calendars="calendars"
                />
                <!-- Mobile -->
                <div class="grid-type-group-mobile">
<!--                    <GridType-->
<!--                        v-model:selected="gridType"-->
<!--                        @change="gridTypeChange"-->
<!--                    />-->
                    <div
                        class="gt-btn"
                        @pointerup="gridTypeChange(gridType === 'small' ? 'medium' : 'small')"
                    >
                        <span
                            v-show="gridType === 'small'"
                            :style="{
                                color: gridType === 'small' ? '#DFDFDF' : '#606060'
                            }"
                        >
                            <NSymbols name="girdTypeSmall" />
                        </span>
                        <span
                            v-show="gridType === 'medium'"
                        >
                            <NSymbols name="girdTypeMedium" />
                        </span>
                    </div>
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
    min-height: 100vh;
    min-width: 0;
    max-width: 1920px;
    height: 100%;
    width: 100%;
    background: white;
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
    background-color: rgba(159, 159, 159, 0.1);
    position: relative;
    display: grid;
    grid-template-columns: auto 1fr;
    grid-column-gap: 0;
    align-items: start;
    border-radius: 30px;
    border: rgba(159, 159, 159, 0.3) 1px solid;
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
        grid-column: 1 / span 5;
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
        @media (max-width: 1260px) {
            grid-column-start: 1;
            grid-column: 1 / span 6;
        }

    }
    .sidebar-collapse {
        grid-column: 1 / span 1;
        margin-right: 4px;
        width: 100%;
        max-width: 220px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 3;
        @media (min-width: 1793px) {
            max-width: none;
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
        grid-template-columns: auto 1fr;
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
        .sidebar-collapse {
            width: auto;
            height: 40px;
            overflow: hidden;
            max-width: none;
            grid-area: 2 / 1 / auto / span 6;
            z-index: 30;
            transition: opacity .3s ease-in-out;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            pointer-events: auto;
        }
        .content {
            grid-area: 3 / 1 / auto / span 5;
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
        //padding-right: 10px;
        .gt-btn {
            width: 28px;
            height: 28px;
            border-radius: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            margin-left: 4px;
            span {
                color: #F15624;
                scale: 0.80;
            }
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
