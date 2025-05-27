<script lang="ts">
import { computed, defineComponent } from 'vue';
import EventTitle from './EventTitle.vue';

export default defineComponent({
    name: 'NCalendarContent',
    components: { EventTitle },
    props: {
        // 排版模式
        gridType: {
            type: String,
            default: 'medium'
        },
        activeDate: {
            type: Date,
            default: new Date('2025/01/05')
        }
    },
    setup(props) {
        const activeDate = new Date('2025/04/05');
        const dayOfWeek = activeDate.getDay();
        const daily = activeDate.getDate();
        const daysInMonth = new Date(activeDate.getFullYear(), activeDate.getMonth() + 1, 0).getDate();
        const nextMonth = new Date(activeDate.getFullYear(), activeDate.getMonth() + 2, 0).getDate();
        // 這個月的第一天是星期幾
        const firstDayOfMonth = new Date(activeDate.getFullYear(), activeDate.getMonth(), 1).getDay();
        const isWeekend = (day: number): boolean => ((firstDayOfMonth + (day - 1)) % 7 % 6) === 0;

        const hasSmall = computed(() => props.gridType === 'small');

        return {
            daily,
            daysInMonth,
            nextMonth,
            isWeekend,
            hasSmall
        };
    }
});
</script>

<template>
    <div class="calendar-content">
        <div class="calendar-title">
            <div class="daily-timeline">
                <div
                    v-for="i in daysInMonth"
                    :key="i"
                    :class="{
                        weekend: isWeekend(i),
                        active: i === daily
                    }"
                >
                    {{ i.toString().padStart(2, '0') }}
                </div>
                <!-- 填滿後面的日期 -->
                <div
                    v-for="i in 31 - daysInMonth"
                    :key="i"
                    :class="{
                        weekend: isWeekend(i + daysInMonth),
                    }"
                >
                    {{ i.toString().padStart(2, '0') }}
                </div>
            </div>
        </div>
        <div class="calendar-wrap">
            <div
                class="current-line"
                :style="{
                    left: `calc(var(--daily-timeline-width) * ${daily} - 1px)`
                }"
            />
            <div class="grid-content">
                <div
                    class="item continued"
                    :class="{
                        'item-small': hasSmall
                    }"
                >
                    <EventTitle
                        title="PG电子"
                        startTime="2024/12/15"
                        endedTime="2025/01/08"
                        eventDesc="PG新春金喜盲盒开运奖上奖"
                        :small="hasSmall"
                    />
                </div>
                <div
                    class="item item-starting"
                    :class="{
                        'item-small': hasSmall
                    }"
                    :style="{
                        'grid-column': '1 / span 9',
                        'grid-row': '2',
                    }"
                >
                    <EventTitle
                        title="PG电子"
                        startTime="2024/12/15"
                        endedTime="2025/01/08"
                        eventDesc="PG新春金喜盲盒开运奖上奖"
                        :small="hasSmall"
                    >
                        <template #icon>
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M14.0254 5.75812C13.3929 3.74729 10.6071 3.74729 9.97458 5.75812C9.8844 6.0448 9.63594 6.21631 9.38004 6.21631C7.27098 6.21631 6.5079 8.93003 8.12023 10.1401C8.3424 10.3068 8.44667 10.6157 8.35535 10.906C8.04546 11.8912 8.44292 12.8128 9.12096 13.3217C9.80252 13.8332 10.8037 13.9498 11.6406 13.3217C11.8566 13.1595 12.1434 13.1595 12.3594 13.3217C13.1963 13.9498 14.1975 13.8332 14.879 13.3217C15.5571 12.8128 15.9545 11.8912 15.6447 10.906C15.5533 10.6157 15.6576 10.3068 15.8798 10.1401C17.4921 8.93003 16.729 6.21631 14.62 6.21631C14.3641 6.21631 14.1156 6.0448 14.0254 5.75812ZM9.38004 7.71631C10.3176 7.71631 11.1268 7.09399 11.4055 6.20819C11.5976 5.59727 12.4024 5.59727 12.5945 6.20819C12.8732 7.09399 13.6824 7.71631 14.62 7.71631C14.91 7.71631 15.1265 7.89471 15.2145 8.17451C15.303 8.45601 15.2307 8.75176 14.9794 8.9404C14.236 9.49829 13.9363 10.4739 14.2138 11.3561C14.3162 11.6818 14.1936 11.9606 13.9786 12.122C13.7672 12.2807 13.5024 12.304 13.2598 12.122C12.5103 11.5594 11.4897 11.5594 10.7402 12.122C10.4976 12.304 10.2328 12.2807 10.0214 12.122C9.80639 11.9606 9.68379 11.6818 9.78623 11.3561C10.0637 10.4739 9.76396 9.49829 9.02062 8.9404C8.76928 8.75176 8.69695 8.45601 8.7855 8.17451C8.87351 7.89471 9.08997 7.71631 9.38004 7.71631Z"
                                    fill="white"
                                />
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M12 0.25C7.16751 0.25 3.25 4.16751 3.25 9C3.25 11.1147 4.00107 13.0556 5.25004 14.5682L5.25 20.4389C5.24994 21.1694 5.2499 21.8022 5.32055 22.2768C5.39181 22.7554 5.57441 23.3562 6.19277 23.6328C6.8017 23.9052 7.3734 23.6551 7.78705 23.4002C8.20088 23.1452 8.69302 22.7349 9.26519 22.258L10.2489 21.438C10.796 20.982 11.154 20.6853 11.4511 20.4945C11.7302 20.3153 11.88 20.2807 12 20.2807C12.12 20.2807 12.2698 20.3153 12.5489 20.4945C12.846 20.6853 13.204 20.982 13.7511 21.438L14.7348 22.2579C15.307 22.7349 15.7991 23.1452 16.2129 23.4002C16.6266 23.6551 17.1983 23.9052 17.8072 23.6328C18.4256 23.3562 18.6082 22.7554 18.6795 22.2768C18.7501 21.8022 18.7501 21.1694 18.75 20.4389L18.75 14.5682C19.9989 13.0556 20.75 11.1147 20.75 9C20.75 4.16751 16.8325 0.25 12 0.25ZM4.75 9C4.75 4.99594 7.99594 1.75 12 1.75C16.0041 1.75 19.25 4.99594 19.25 9C19.25 10.8392 18.5661 12.5168 17.4377 13.7953C16.1081 15.3017 14.1653 16.25 12 16.25C9.83492 16.25 7.89222 15.3019 6.56267 13.7958C5.43402 12.5172 4.75 10.8394 4.75 9ZM6.8042 22.0559C6.75204 21.7055 6.75 21.1869 6.75 20.3787V16.0005C8.21211 17.0986 10.0302 17.75 12 17.75C13.9698 17.75 15.7879 17.0986 17.25 16.0005V20.3787C17.25 21.1869 17.248 21.7055 17.1958 22.0559C17.1857 22.1241 17.175 22.1758 17.1653 22.2144C17.1247 22.1955 17.0704 22.1667 16.9999 22.1232C16.6891 21.9317 16.2802 21.5933 15.6503 21.0683L14.6767 20.2568C14.174 19.8378 13.7445 19.4797 13.3595 19.2324C12.9476 18.9679 12.5142 18.7807 12 18.7807C11.4858 18.7807 11.0524 18.9679 10.6405 19.2324C10.2555 19.4797 9.82595 19.8378 9.32328 20.2568L8.34973 21.0683C7.7198 21.5933 7.31089 21.9317 7.0001 22.1232C6.92957 22.1667 6.87531 22.1955 6.83474 22.2144C6.82498 22.1758 6.81435 22.1241 6.8042 22.0559ZM17.1282 22.3173C17.128 22.3168 17.1298 22.3131 17.1343 22.3075C17.1306 22.3149 17.1283 22.3177 17.1282 22.3173ZM17.2565 22.2487C17.2627 22.2488 17.2662 22.2495 17.2664 22.2499C17.2666 22.2502 17.2635 22.2502 17.2565 22.2487ZM6.73359 22.2499C6.73378 22.2495 6.73725 22.2488 6.74345 22.2487C6.7365 22.2502 6.7334 22.2502 6.73359 22.2499ZM6.87184 22.3173C6.87203 22.3168 6.87017 22.3131 6.86573 22.3075C6.86619 22.3084 6.86663 22.3093 6.86704 22.3101C6.86995 22.3156 6.87168 22.3177 6.87184 22.3173Z"
                                    fill="white"
                                />
                            </svg>
                        </template>
                    </EventTitle>
                </div>
                <div
                    class="item"
                    :class="{
                        'item-small': hasSmall
                    }"
                    :style="{
                        'grid-column': '1 / span 30',
                        'grid-row': '3',
                        'background': '#FF9FA1'
                    }"
                >
                    <EventTitle
                        title="BB电子"
                        startTime="2024/01/01"
                        endedTime="2025/01/29"
                        eventDesc="BB新春发财金 玩麻将 红包滚滚来"
                        :small="hasSmall"
                    />
                </div>
                <div
                    class="item dot"
                    :class="{
                        'item-small': hasSmall
                    }"
                    :style="{
                        'grid-column': '12 / span 11',
                        'grid-row': '4',
                        'background': '#FF9FA1'
                    }"
                >
                    <EventTitle
                        title="PP电子"
                        startTime="2025/01/11"
                        endedTime="2025/01/21"
                        eventDesc="BB新春发财金 玩麻将 红包滚滚来"
                        :small="hasSmall"
                    />
                </div>
                <div
                    class="item dot"
                    :class="{
                        'item-small': hasSmall
                    }"
                    :style="{
                        'grid-column': '17 / span 2',
                        'grid-row': '5',
                        'background': '#74DFFF'
                    }"
                >
                    <EventTitle
                        title=""
                        startTime=""
                        endedTime=""
                        eventDesc=""
                        :small="hasSmall"
                    >
                        <template #icon>
                            <svg
                                width="14"
                                height="19"
                                viewBox="0 0 14 19"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M0 7C0 5.13872 0 4.20808 0.244717 3.45492C0.739307 1.93273 1.93273 0.739307 3.45491 0.244717C4.20808 0 5.13872 0 7 0C8.86128 0 9.79192 0 10.5451 0.244717C12.0673 0.739307 13.2607 1.93273 13.7553 3.45492C14 4.20808 14 5.13872 14 7V14.3874C14 16.3045 14 17.2631 13.658 17.77C13.2403 18.3893 12.5122 18.7242 11.7701 18.6383C11.1627 18.568 10.4349 17.9442 8.97931 16.6965C8.33858 16.1474 8.01821 15.8728 7.66631 15.7484C7.23517 15.5961 6.76483 15.5961 6.33369 15.7484C5.98179 15.8728 5.66142 16.1474 5.02069 16.6965C3.5651 17.9442 2.8373 18.568 2.22986 18.6383C1.48778 18.7242 0.759708 18.3893 0.341955 17.77C0 17.2631 0 16.3045 0 14.3874V7Z"
                                    fill="white"
                                />
                            </svg>
                        </template>
                    </EventTitle>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import url('https://fonts.cdnfonts.com/css/montserrat');

div {
    font-family: 'Montserrat', sans-serif;
}

.calendar-content {
    --daily-timeline-width: 46px; //46
    width: 100%;
    height: 100%;
    min-height: 776px;
    display: flex;
    flex-direction: column;
}
.calendar-title {
    height: 47px; // 16px
    .daily-timeline {
        display: flex;
        flex-direction: row;
        padding-left: calc(var(--daily-timeline-width)/2);
        div {
            width: var(--daily-timeline-width);
            height: 42px;
            font-size: 19px;
            position: relative;
            font-weight: 500;
            color: #9F9F9F;
            text-align: center;
            z-index: 10;
            cursor: default;
        }
        .weekend {
            color: #F15624;
        }
        .active {
            color: white;
        }
        .active:after {
            content: '';
            position: absolute;
            width: 42px;
            height: 42px;
            border-radius: 50%;
            background-color: #F15624;
            left: 3px;
            top: -19%;
            z-index: -1;
        }
    }
}

.calendar-wrap {
    height: 100%;
    width: calc(var(--daily-timeline-width) * 32);
    background: repeating-linear-gradient(
            to right,
            #DFDFDF 0px,
            #DFDFDF calc(var(--daily-timeline-width) - 1px),
            white calc(var(--daily-timeline-width) - 1px),
            white var(--daily-timeline-width)
    );
    border-radius: 30px;
    padding-top: 28px;
    padding-bottom: 28px;
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
    }

    .grid-content {
        display: grid;
        grid-template-columns: repeat(32, var(--daily-timeline-width));
    }
    .item {
        position: relative;
        background-color: #FFDD48;
        height: 80px;
        border-radius: 20px;
        text-align: center;
        grid-column: span 9;
        margin: 5px 20px;
        z-index: 10;
        transition: height 0.2s ease;
        &.continued {
            margin-left: 0;
            // margin-right: 10px;
            border-radius: 0 20px 20px 0;
        }
        &.continuing {
            margin-right: 0;
            border-radius: 20px 0 0 20px;
        }

    }
    .item-small {
        height: 30px;
    }
    .dot:after {
        content: '';
        width: 20px;
        height: 20px;
        position: absolute;
        background: #FF0000;
        border: white 2px solid;
        border-radius: 50%;
        box-shadow: 0 4px 4px 0 #00000040;
        z-index: 30;
        top: -6px;
        left: -6px;
    }
    .center {
        top: calc(1 / 2 * 100%);
        left: calc(1 / 2 * 100%);
        transform: translateX(calc(calc(1 / 2 * 100%) * -1)) translateY(calc(calc(1 / 2 * 100%) * -1));
    }
}
</style>
