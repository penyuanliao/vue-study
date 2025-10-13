<script lang="ts">
import { computed, defineComponent, ref, toRef, watch } from 'vue';
import { gsap } from 'gsap';
import useNTouchMove from '../NTouchMove/useNTouchMove';

export default defineComponent({
    name: 'EventHeader',
    props: {
        activeDate: {
            type: Date,
            default: new Date()
        },
        currentDate: {
            type: Date,
            default: new Date()
        },
        padding: {
            type: Boolean,
            default: false
        }
    },
    setup(props) {
        // 選擇的月份
        const activeDate = toRef(props, 'activeDate');
        const currentDate = toRef(props, 'currentDate'); // 今天
        const daysInMonth = computed(() => new Date(activeDate.value.getFullYear(), activeDate.value.getMonth() + 1, 0).getDate());
        const daily = currentDate.value.getDate();
        // 這個月的第一天是星期幾
        const firstDayOfMonth = computed(() => new Date(activeDate.value.getFullYear(), activeDate.value.getMonth(), 1).getDay());
        const isWeekend = (day: number): boolean => ((firstDayOfMonth.value + (day - 1)) % 7 % 6) === 0;
        // 該月份是否為當月
        const isThisMonth = computed(() => currentDate.value.getMonth() === activeDate.value.getMonth()
            && currentDate.value.getFullYear() === activeDate.value.getFullYear());
        const touchManager = useNTouchMove();
        const touchPage = computed(() => touchManager.page.value);
        const headerRef = ref<HTMLElement | null>(null);
        watch(() => touchPage.value, () => {
            if (headerRef.value) {
                gsap.to(headerRef.value, {
                    scrollLeft: touchManager.info.value.x,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            }
        });
        return {
            headerRef,
            daysInMonth,
            daily,
            isWeekend,
            isThisMonth
        };
    }
});
</script>

<template>
    <div
        class="calendar-header"
        ref="headerRef"
    >
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
            <div
                v-if="padding"
                class="padding"
            />
        </div>
        <div
            class="current-line"
            :style="{
                left: `calc(var(--days-in-month-scale-size) * ${daily} - 1px)`,
                opacity: isThisMonth ? 1 : 0
            }"
        />
    </div>
</template>

<style scoped lang="scss">
@use '../theme';

.calendar-header {
    height: 63px;
    flex-shrink: 0;
    display: flex;
    position: relative;
    pointer-events: none;
    --days-in-month-scale-size: 46px;
    .days-in-month-scale {
        width: 100%;
        display: flex;
        flex-direction: row;
        padding-left: calc(var(--days-in-month-scale-size, 46px)/2);
        padding-top: 13px;
        margin-left: var(--padding-start, 0);
        div {
            width: var(--days-in-month-scale-size, 46px);
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
        .padding {
            width: var(--days-in-month-scale-size, 46px);
        }
    }
    .current-line {
        width: 1px;
        height: calc(100% + 20px);
        position: absolute;
        top: 5px;
        left: 0;
        background-color: #F15624;
        border: 2px solid #F15624;
        z-index: 0;
        //transition: opacity 0.1s ease-in-out;
        margin-left: var(--padding-start, 0);
    }
}
</style>
