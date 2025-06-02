<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
    name: 'NEventCalendarToolbar',
    props: {
        dateBeforeLast: {
            type: Date,
            required: false
        },
        prevDate: {
            type: Date,
            required: false
        },
        currentDate: {
            type: Date,
            required: true
        },
        nextDate: {
            type: Date,
            required: false
        }
    },
    emits: ['click'],
    setup(props) {
        const twoMonthAgo = computed(() => {
            const day = props.dateBeforeLast || new Date(props.currentDate);
            day.setMonth(day.getMonth() - 2);
            return day;
        });
        const lastMonth = computed(() => {
            const day = props.nextDate || new Date(props.currentDate);
            day.setMonth(day.getMonth() - 1);
            return day;
        });
        const thisMonth = computed(() => new Date(props.currentDate));

        const nextMonth = computed(() => {
            const day = props.nextDate || new Date(props.currentDate);
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
    },
    methods: {
        onClickHandle(th: string) {
            this.$emit('click', th);
        }
    }
});
</script>

<template>
    <div class="tool-bar-container">
        <div class="line-1" />
        <div
            class="calendar-th"
            @click="onClickHandle(`${twoMonthAgo.getFullYear()}/${padStart(twoMonthAgo.getMonth() + 1)}`)"
        >
            <div class="month-name">{{ padStart(twoMonthAgo.getMonth() + 1) }}</div>
            <div class="year-digits">{{ twoMonthAgo.getFullYear() }}</div>
        </div>
        <div class="divider"/>
        <div
            class="calendar-th"
            @click="onClickHandle(`${lastMonth.getFullYear()}/${padStart(lastMonth.getMonth() + 1)}`)"
        >
            <div class="month-name">{{ padStart(lastMonth.getMonth() + 1) }}</div>
            <div class="year-digits">{{ lastMonth.getFullYear() }}</div>
        </div>
        <div class="divider"/>
        <div
            class="calendar-th"
            @click="onClickHandle(`${thisMonth.getFullYear()}/${padStart(thisMonth.getMonth() + 1)}`)"
        >
            <div class="month-name">{{ padStart(thisMonth.getMonth() + 1) }}</div>
            <div class="year-digits">{{ thisMonth.getFullYear() }}</div>
        </div>
        <div class="divider"/>
        <div
            class="calendar-th"
            @click="onClickHandle(`${nextMonth.getFullYear()}/${padStart(nextMonth.getMonth() + 1)}`)"
        >
            <div class="month-name">{{ padStart(nextMonth.getMonth() + 1) }}</div>
            <div class="year-digits">{{ nextMonth.getFullYear() }}</div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use '../theme';

.tool-bar-container {
    height: 85px;
    width: 100%;
    max-width: 770px;
    min-width: 390px;
    margin: 0 auto;
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
        &:active,
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
        flex: 1 1 0;
        height: 1px;
        min-width: 24px;
        max-width: 117px;
        background: #DFDFDF;
    }

}
</style>
