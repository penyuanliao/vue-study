<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import NTooltip from "@/components/EventCalendar/Tips/NTooltip.vue";

export default defineComponent({
    name: 'NEventCalendarToolbar',
    components: { NTooltip },
    props: {
        fourMonthlyPeriod: {
            type: Array as PropType<{ key: string, isUpdate: boolean }[]>,
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
            const monthly = props.fourMonthlyPeriod.map(({ key, isUpdate }: {
                key: string,
                isUpdate: boolean
            }) => ({ date: new Date(key), isUpdate }));
            return monthly.sort((a, b) => a.date.getTime() - b.date.getTime());
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
            v-for="({ date, isUpdate }, index) in fourMonthly"
            :key="index"
        >
            <div
                :class="{
                    'calendar-th': true,
                    active: date.getMonth() === currentDate.getMonth(),
                    current: new Date('2024/08/02').getMonth() === date.getMonth()
                }"
                @click="onClickHandle(`${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`)"
            >
                <div class="month-name">{{ padStart(date.getMonth() + 1) }}</div>
                <div class="year-digits">{{ date.getFullYear() }}</div>
                <NTooltip
                    v-if="isUpdate"
                    class="updated-tooltip"
                    label="一周内更新资讯"
                >
                    <div class="updated" />
                </NTooltip>
            </div>
            <div
                v-if="index !== fourMonthly.length - 1"
                class="divider"
            />
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
        cursor: pointer;
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
        .updated-tooltip {
            width: 20px;
            height: 20px;
            top: -6px;
            left: -6px;
        }
        .updated {
            width: 20px;
            height: 20px;
            position: absolute;
            background: #FF0000;
            border: white 2px solid;
            border-radius: 50%;
            box-shadow: 0 4px 4px 0 #00000040;
        }
    }

    .divider {
        flex: 1 1 0;
        height: 1px;
        min-width: 0;
        max-width: 117px;
        background: #DFDFDF;
    }
}
@media (max-width: 959px) {
    .tool-bar-container {
        min-width: 230px;
        height: 65px;
        gap: 10px;
        padding-right: 30px;

        .calendar-th {
            width: 47px;
            height: 49px;
            border-radius: 10px;
            border: 1px solid transparent;

            .month-name {
                height: 100%;
                font-size: 22px;
                font-weight: 700;
                line-height: 30px;
            }
            .year-digits {
                font-size: 12px;
                font-weight: 500;
                line-height: 12px;
                margin-top: -20px;

            }
            .updated-tooltip {
                display: none;
            }
            &.active {
                border: 1px solid #F15624;
                .month-name {
                    color: #DFDFDF;
                }
                .year-digits {
                    color: #DFDFDF;
                }
            }
            &.current {
                background: rgba(241, 86, 36, 0.8);
                .month-name {
                    color: white;
                }
                .year-digits {
                    color: white;
                }
            }
            .updated {
                display: none;
            }
        }
    }
    .line-1 {
        display: none;
    }
    .divider {
        display: none;
    }
}
</style>
