<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';

export default defineComponent({
    name: 'NEventCalendarToolbar',
    props: {
        fourMonthlyPeriod: {
            type: Array as PropType<string[]>,
            required: true,
            default: () => [],
        },
        currentDate: {
            type: Date,
            required: true
        }
    },
    emits: ['click'],
    setup(props) {
        const fourMonthly = computed(() => {
            const dates = props.fourMonthlyPeriod.map((value: string) => new Date(value));
            return dates.sort((a: any, b: any) => a - b);
        });
        const padStart = (value: number) => value.toString().padStart(2, '0');
        return {
            padStart,
            fourMonthly
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
        <template
            v-for="(date, index) in fourMonthly"
            :key="index"
        >
            <div
                :class="{
                    'calendar-th': true,
                    active: date.getMonth() === currentDate.getMonth(),
                }"
                @click="onClickHandle(`${date.getFullYear()}/${date.getMonth() + 1}`)"
            >
                <div class="month-name">{{ padStart(date.getMonth() + 1) }}</div>
                <div class="year-digits">{{ date.getFullYear() }}</div>
            </div>
            <div v-if="index !== fourMonthly.length - 1" class="divider"/>
        </template>
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
