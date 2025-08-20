<script lang="ts">
import { computed, defineComponent, toRef } from "vue";

export default defineComponent({
    name: 'EventHeader',
    props: {
        activeDate: {
            type: Date,
            default: new Date('2024/07/01')
        }
    },
    setup(props) {
        const activeDate = toRef(props, 'activeDate');
        const daysInMonth = computed(() => new Date(activeDate.value.getFullYear(), activeDate.value.getMonth() + 1, 0).getDate());
        const currentDate = new Date('2024/06/09'); // 今天
        const daily = currentDate.getDate();
        // 這個月的第一天是星期幾
        const firstDayOfMonth = computed(() => new Date(activeDate.value.getFullYear(), activeDate.value.getMonth(), 1).getDay());
        const isWeekend = (day: number): boolean => ((firstDayOfMonth.value + (day - 1)) % 7 % 6) === 0;
        // 該月份是否為當月
        const isThisMonth = computed(() => currentDate.getMonth() === activeDate.value.getMonth()
            && currentDate.getFullYear() === activeDate.value.getFullYear());

        return {
            daysInMonth,
            daily,
            isWeekend,
            isThisMonth
        }
    }
});
</script>

<template>
    <div class="calendar-header">
        <div class="days-in-month-scale">
            <div
                v-for="i in daysInMonth"
                :key="i"
                :class="{
                        weekend: isWeekend(i),
                        active: i === daily && isThisMonth
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
                style="opacity: 10%;"
            >
                {{ i.toString().padStart(2, '0') }}
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.calendar-header {
    height: 63px;
    flex-shrink: 0;
    .days-in-month-scale {
        display: flex;
        flex-direction: row;
        padding-left: calc(var(--days-in-month-scale-size)/2);
        padding-top: 13px;
        div {
            width: var(--days-in-month-scale-size);
            height: 42px;
            font-size: 19px;
            position: relative;
            font-weight: 500;
            color: #9F9F9F;
            text-align: center;
            z-index: 10;
            cursor: default;
            line-height: 25px;
            flex-shrink: 0;
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
            left: 2px;
            top: -19%;
            z-index: -1;
            animation: fade-out-in ease .2s;
        }
        @keyframes fade-out-in {
            0% {
                opacity: 0;
            }
            100% {
                opacity: 1;
            }
        }
    }
}
</style>
