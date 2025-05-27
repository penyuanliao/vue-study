<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue';
import SwitchButton from './Button/SwitchButton.vue';
import NCalendarContent from './NCalendarContent/index.vue';
import GridType from "@/components/EventCalendar/NCalendarContent/GridType.vue";
import NSearchButton from "@/components/EventCalendar/Button/NSearchButton.vue";
import NToggleButton from "@/components/EventCalendar/Button/NToggleButton.vue";
import EventCalendarToolbar from "@/components/EventCalendar/NCalendarToolbar/index.vue";
import type { IActivities } from "@/components/EventCalendar/eventCalendar.models";

export interface IActivities {
    name: string;
    color: string;
    visibility: boolean;
}
export default defineComponent({
    name: 'CalendarTimeline',
    components: {
        EventCalendarToolbar,
        NToggleButton,
        NSearchButton: NSearchButton,
        GridType,
        NCalendarContent,
        SwitchButton
    },
    setup(props) {
        const isToday = ref<boolean>(false);
        const someday = ref<Date>(new Date('2025/01/05'));
        const activities = ref<IActivities[]>([
            {
                name: '本月上线',
                color: '#FF9FA0',
                visibility: true
            },
            {
                name: '持续进行',
                color: '#74DFFF',
                visibility: true
            },
            {
                name: '独家活动',
                color: '#FFDD48',
                visibility: true
            },
            {
                name: '游戏商',
                color: '#FF9FA0',
                visibility: false
            }
        ]);
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
        }
        // groups.value[0].events_list // 該TAG行事曆清單
        return {
            activities,
            isToday,
            someday,
            handle,
            gridTypeChange,
            searchSubmitHandle,
            gridType
        };
    }
});
</script>

<template>
    <div class="calendar-timeline-container">
        <div class="n-calendar-wrap">
            <div class="title">
                <NToggleButton @selected="(value:boolean) => (isToday = value)">今天</NToggleButton>
                <EventCalendarToolbar :someday="someday"/>
                <div class="button-group">
                    <label class="button-group-title">Grid Type</label>
                    <GridType @change="gridTypeChange" />
                </div>
                <NSearchButton @submit="searchSubmitHandle"></NSearchButton>
            </div>
            <div class="side-bar">
                <div class="scheduled">
                    <div
                        v-for="(item, i) in activities"
                        :key="i"
                        class="activities"
                    >
                        <div class="text"><span>{{ item.name }}</span></div>
                        <span class="tag" :style="{
                            background: item.color
                        }"/>
                        <SwitchButton
                            :id="`tag-${ i }`"
                            class="switch-btn"
                            width="47"
                            height="30"
                            border="2"
                            @change="handle"
                        />
                    </div>
                </div>
            </div>
            <NCalendarContent :grid-type="gridType"/>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import url('https://fonts.cdnfonts.com/css/montserrat');
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
    grid-template-columns: 1fr 4fr;
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
        grid-column: 2 / span 4;
        position: relative;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        text-align: center;
        justify-content: space-between;
        gap: 10px;
    }
    .side-bar {
        width: auto;
        height: 100%;
        padding-top: 60px;
        padding-bottom: 60px;
    }
}


.scheduled {
    width: 223px;
    height: 100%;
    min-height: 200px;
    position: relative;
    display: inline-block;
    .activities {
        position: relative;
        display: flex;
        width: 100%;
        height: 54px;
        align-items: center;
        gap: 14px;
        padding: 51px 0;
    }
    .text {
        width: 100%;// 176px;
        height: 29px;
        display: flex;
        align-items: center;
        justify-content: left;
        color: #606060;
        span {
            font-family: 'Montserrat', sans-serif;
            font-size: 23.49px;
            font-style: normal;
            font-weight: 700;
        }
    }
    .tag {
        width: 29px;
        height: 29px;
        min-width: 29px;
        border-radius: 50%;
        background: grey;
    }
}


.button-group {
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
