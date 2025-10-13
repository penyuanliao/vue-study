<script lang="ts">
import { computed, defineComponent, onMounted, PropType, ref, toRef, watch } from 'vue';
import EventHeader from './EventHeader.vue';
import EventTitle from './EventTitle.vue';
import { IEvents } from '../useEventCalendar';

export default defineComponent({
    name: 'NCalendarContent',
    components: { EventHeader, EventTitle },
    props: {
        // 排版模式
        gridType: {
            type: String,
            default: 'medium'
        },
        activeDate: {
            type: Date,
            default: new Date('2024/07/01')
        },
        events: {
            type: Array as PropType<Array<IEvents>>,
            default: () => []
        },
        stickyEnabled: {
            type: Boolean,
            default: false
        }
    },
    setup(props) {
        const activeDate = toRef(props, 'activeDate');
        const container = ref<HTMLElement | null>(null);
        const currentDate = new Date('2025/02/02'); // 今天
        const daily = currentDate.getDate();
        const daysInMonth = computed(() => new Date(activeDate.value.getFullYear(), activeDate.value.getMonth() + 1, 0).getDate());
        const nextMonth = computed(() => new Date(activeDate.value.getFullYear(), activeDate.value.getMonth() + 2, 0).getDate());
        // 這個月的第一天是星期幾
        const firstDayOfMonth = computed(() => new Date(activeDate.value.getFullYear(), activeDate.value.getMonth(), 1).getDay());
        // 該月份是否為當月
        const isThisMonth = computed(() => currentDate.getMonth() === activeDate.value.getMonth()
            && currentDate.getFullYear() === activeDate.value.getFullYear());

        const hasSmall = computed(() => props.gridType === 'small');
        // 檢查活動是否開始
        const isContinued = (startTime: string): boolean => {
            const time = new Date(startTime);
            return (time.getMonth() !== activeDate.value.getMonth());
        };
        // 活動該月結束
        const isContinuing = (endedTime: string) => {
            const time = new Date(endedTime);
            const isNextMonth: boolean = time.getMonth() + 1 === activeDate.value.getMonth() + 2;
            const lastDay: boolean = isNextMonth ? time.getDate() > (31 - daysInMonth.value) : true; // 超過該月份最後N天
            if (time.getFullYear() > activeDate.value.getFullYear()) return true;
            return (time.getMonth() > activeDate.value.getMonth() && lastDay);
        };
        const gridColumn = (startTime: string, endedTime: string, index: number): string => {
            const start = new Date(startTime);
            const ended = new Date(endedTime);
            let space: number;
            let offset: number;
            if ((start.getFullYear() < activeDate.value.getFullYear())
                || (start.getMonth() < activeDate.value.getMonth())) {
                offset = 1;
            } else {
                offset = start.getDate();
            }
            if ((ended.getFullYear() > activeDate.value.getFullYear())
                || (ended.getMonth() > activeDate.value.getMonth())) {
                space = daysInMonth.value + 1;
            } else {
                const startDay: number = start.getMonth() !== activeDate.value.getMonth() ? 0 : start.getDate() - 1;
                space = (ended.getDate() - startDay) + 1;
            }
            // row-start / column-start / row-end / column-end
            return `${index} / ${offset} / auto / span ${space}`;
        };

        onMounted(() => {
            if (container.value) {
                container.value.style.setProperty('--days-in-next-month', `${31 - daysInMonth.value}`);
            }
        });
        watch(() => daysInMonth.value, (value) => {
            if (container.value) {
                container.value.style.setProperty('--days-in-next-month', `${31 - value}`);
            }
        });
        return {
            container,
            currentDate,
            daily,
            daysInMonth,
            nextMonth,
            isThisMonth,
            hasSmall,
            isContinued,
            isContinuing,
            gridColumn
        };
    }
});
</script>

<template>
    <div class="calendar-content" ref="container">
        <!-- 日曆標題 -->
        <EventHeader
            :class="{
                'event-header-sticky': stickyEnabled
            }"
            :activeDate="activeDate"
            :currentDate="currentDate"
        />
        <!-- 日曆內容 -->
        <div class="calendar-wrap grid">
            <div
                class="current-line"
                :style="{
                    left: `calc(var(--days-in-month-scale-size) * ${daily} - 1px)`,
                    opacity: isThisMonth ? 1 : 0
                }"
            />
            <div
                :class="{
                    'grid-content': true,
                    'small': hasSmall
                }">
                <template
                    v-for="(event) in events"
                    :key="`nc-${event.id}`"
                >
                    <div
                        class="item"
                        :class="{
                            'item': true,
                            'item-small': hasSmall,
                            'hidden': !event.calendar.checked,
                            'updated': event.isUpdate && !isContinued(event.startTime)
                        }"
                        :style="{
                            'grid-area': `${event.area.rowStart} / ${event.area.columnStart} / auto / span ${event.area.span}`,
                        }"
                    >
                        <EventTitle
                            :class="{
                                'continued': isContinued(event.startTime),
                                'continuing': isContinuing(event.endedTime),
                            }"
                            :columnStart="event.area.columnStart"
                            :span="event.area.span"
                            :title="event.title"
                            :activeDate="activeDate"
                            :startTime="event.startTime"
                            :endedTime="event.endedTime"
                            :eventDesc="event.eventDesc"
                            :small="hasSmall"
                            :tag="event.coTag"
                            :link="event.link"
                            :color="event.color"
                            :icon="event.area.span <= 3"
                            :continued="isContinued(event.startTime)"
                            :continuing="isContinuing(event.endedTime)"
                            :updated="event.isUpdate"
                        />
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use '../theme';

.calendar-content {
    --days-in-month-scale-size: 46px;
    --days-in-month: 32;
    --days-in-next-month: 0;
    --calendar-primary-color: 255, 255, 255;
    width: 100%;
    height: 100%;
    display: flex;
    min-height: 300px; // 776px
    max-width: calc(var(--days-in-month-scale-size) * var(--days-in-month, 32));
    flex-direction: column;
}
.calendar-wrap {
    &.grid {
        width: calc(var(--days-in-month-scale-size) * var(--days-in-month, 32));
        height: 100%;
        background: repeating-linear-gradient(
                to right,
                #DFDFDF 0px,
                #DFDFDF calc(var(--days-in-month-scale-size) - 1px),
                white calc(var(--days-in-month-scale-size) - 1px),
                white var(--days-in-month-scale-size)
        );
        padding: 28px 0 40px;
    }
    &.grid:after {
        content: '';
        //visibility: hidden;
        position: absolute;
        right: 0;
        top: 0;
        width: calc(var(--days-in-month-scale-size) * var(--days-in-next-month, 0));
        height: 100%;
        background-image: linear-gradient(to right, transparent 10%, rgba(255, 255, 255, 0.6) 100%);
        padding: 28px 0;
        border-top-right-radius: 30px;
        border-bottom-right-radius: 30px;
    }
    border-radius: 30px;
    position: relative;
    .current-line {
        width: 1px;
        height: calc(100% + 20px);
        position: absolute;
        top: -20px;
        left: 0;
        background-color: #F15624;
        border: 2px solid #F15624;
        z-index: 0;
        transition: opacity 0.1s;
    }

    .grid-content {
        display: grid;
        grid-template-columns: repeat(32, var(--days-in-month-scale-size));
        //overflow: hidden;
        /** 白線 */
        margin-right: 1px;
        grid-template-rows: repeat(10, 90px);
        &.small {
            grid-template-rows: repeat(10, 40px);
        }

        .item {
            position: relative;
            min-width: 0;
            height: 80px; // pc: 80, mobile: 60
            text-align: center;
            margin: 5px 0;
            z-index: 10;
            transition: all 0.3s;
            display: block;
            &.hidden {
                opacity: 0;
            }
            &:hover {
                z-index: 30;
            }
        }
        .item-small {
            height: 30px;
        }
    }

    .center {
        top: calc(1 / 2 * 100%);
        left: calc(1 / 2 * 100%);
        transform: translateX(calc(calc(1 / 2 * 100%) * -1)) translateY(calc(calc(1 / 2 * 100%) * -1));
    }

}
@media (max-width: 959px) {
    .calendar-content {
        .event-header-sticky {
            display: none;
        }
    }
    .calendar-wrap {
        .grid-content {

            grid-template-rows: repeat(10, 70px);

            .item {
                height: 60px;
            }
            .item-small {
                height: 30px;
            }
        }
    }
}
</style>
