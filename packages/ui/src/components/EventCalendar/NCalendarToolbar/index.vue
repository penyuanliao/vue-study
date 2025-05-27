<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
    name: 'EventCalendarToolbar',
    props: {
        someday: {
            type: Date,
            required: true
        }
    },
    setup(props) {
        const twoMonthAgo = computed(() => {
            const day = new Date(props.someday);
            day.setMonth(day.getMonth() - 2);
            return day;
        });
        const lastMonth = computed(() => {
            const day = new Date(props.someday);
            day.setMonth(day.getMonth() - 1);
            return day;
        });
        const thisMonth = computed(() => {
            return new Date(props.someday);
        });
        const nextMonth = computed(() => {
            const day = new Date(props.someday);
            day.setMonth(day.getMonth() + 1);
            return day;
        });
        const padStart = (value: number) => value.toString().padStart(2, '0');
        return {
            lastMonth,
            twoMonthAgo,
            thisMonth,
            nextMonth,
            padStart
        };
    }
});
</script>

<template>
    <div class="tool-bar-container">
        <div class="line-1" />
        <div class="calendar-th">
            <div class="month-name">{{ padStart(twoMonthAgo.getMonth() + 1) }}</div>
            <div class="year-digits">{{ twoMonthAgo.getFullYear() }}</div>
        </div>
        <div class="divider"/>
        <div class="calendar-th">
            <div class="month-name">{{ padStart(lastMonth.getMonth() + 1) }}</div>
            <div class="year-digits">{{ lastMonth.getFullYear() }}</div>
        </div>
        <div class="divider"/>
        <div class="calendar-th active">
            <div class="month-name">{{ padStart(thisMonth.getMonth() + 1) }}</div>
            <div class="year-digits">{{ thisMonth.getFullYear() }}</div>
        </div>
        <div class="divider"/>
        <div class="calendar-th">
            <div class="month-name">{{ padStart(nextMonth.getMonth() + 1) }}</div>
            <div class="year-digits">{{ nextMonth.getFullYear() }}</div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.tool-bar-container {
    width: 770px;
    height: 85px;
    position: relative;
    display: flex;
    flex-direction: row;
    text-align: center;
    justify-content: center;
    align-items: center;
    user-select: none;

    .line-1 {
        width: 40px;
        height: 1px;
        background: linear-gradient(to right, white, #DFDFDF); /* 顏色漸層 */
        mask-image: repeating-linear-gradient(
                to right,
                black 0 2px,
                transparent 2px 5px
        );
        mask-repeat: repeat;
    }
    .calendar-th {
        width: 80px;
        height: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        text-align: center;
        color: #DFDFDF;
        &.active {
            color: #F15624;
        }
        .month-name {
            width: 100%;
            font-size: 47px;
            font-style: normal;
            font-weight: 700;
            line-height: 65px;
        }
        .year-digits {
            width: 100%;
            font-size: 18px;
            font-style: normal;
            font-weight: 500;
            line-height: 29px;
            margin-top: -10px;
        }
    }
    .divider {
        width: 117px;
        height: 1px;
        background: #DFDFDF
    }

}
</style>
