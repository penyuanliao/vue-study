<script lang="ts">
import { defineComponent, PropType, ref, onMounted, watch, nextTick } from 'vue';
import SwitchButton from '../Button/SwitchButton.vue';
import { ICalendars } from '../useEventCalendar';
import NSymbols from '../Button/NSymbols.vue';

export default defineComponent({
    name: 'NSidebar',
    components: {
        NSymbols,
        SwitchButton
    },
    props: {
        calendars: {
            type: Array as PropType<Array<ICalendars>>,
            default: () => [],
        }
    },
    emits: ['update:calendars'],
    setup(props, { emit }) {
        const scheduleMobile = ref<HTMLDivElement>();
        const leftRef = ref<HTMLDivElement>();
        const rightRef = ref<HTMLDivElement>();

        const handle = (value: { checked: boolean, id: string }, index: number) => {
            const updated = [...props.calendars];
            updated[index].checked = value.checked;
            emit('update:calendars', updated);
        };
        const scrollPosition = () => {
            const scheduleMobileEl = scheduleMobile.value;
            const leftRefEl = leftRef.value;
            const rightRefEl = rightRef.value;
            if (scheduleMobileEl && scheduleMobileEl.scrollLeft > 0) {
                leftRefEl?.classList.remove('hidden');
            } else {
                leftRefEl?.classList.add('hidden');
            }
            if (scheduleMobileEl && scheduleMobileEl.scrollLeft < scheduleMobileEl.scrollWidth - scheduleMobileEl.clientWidth) {
                rightRefEl?.classList.remove('hidden');
            } else {
                rightRefEl?.classList.add('hidden');
            }
        };
        onMounted(() => {
            const scheduleMobileEl = scheduleMobile.value;

            if (scheduleMobileEl) {
                scheduleMobileEl.addEventListener('scroll', () => {
                    scrollPosition();
                });
            }
        });
        watch(() => props.calendars, (value) => {
            const scheduleMobileEl = scheduleMobile.value;
            if (scheduleMobileEl) {
                nextTick(() => {
                    scrollPosition();
                });
            }
        }, {
            deep: true
        });

        return {
            scheduleMobile,
            leftRef,
            rightRef,
            handle
        };
    }
});
</script>

<template>
    <aside class="sidebar">
        <div class="scheduled">
            <div
                v-for="(item, i) in calendars"
                :key="i"
                class="calendars"
            >
                <div class="text"><span>{{ item.name }}</span></div>
                <span
                    class="tag"
                    :style="{
                        background: `${item.color}${item.checked ? '' : '10'}`,
                        borderColor: item.color
                    }"
                />
                <SwitchButton
                    :id="`tag-${ i }`"
                    :data="item"
                    class="switch-btn"
                    border="2"
                    trackOnColor="#606060"
                    trackOffColor="#DFDFDF"
                    @change="(value: any) => handle(value, i)"
                />
            </div>
        </div>
        <div
            class="scheduled-m"
            ref="scheduleMobile"
        >
            <div
                v-for="(item, i) in calendars"
                :key="i"
                class="calendars"
                :style="{
                    '--calendars-border-color': `${item.color}4D`,
                    '--calendars-color': `${item.checked ? item.color : '#DFDFDF'}`,
                }"
                @pointerup="() => handle({
                    checked: !item.checked,
                    id: `tag-${ i }`
                }, i)"
            >
                <div class="icon">
                    <NSymbols
                        name="see"
                        v-if="item.checked"
                    />
                    <NSymbols
                        name="unsee"
                        v-else
                    />
                </div>
                <div class="text"><span>{{ item.name }}</span></div>
            </div>
        </div>
        <div
            class="sidebar-left-shadow"
            ref="leftRef"
        />
        <div
            class="sidebar-right-shadow"
            ref="rightRef"
        />
    </aside>
</template>

<style scoped lang="scss">
.sidebar {
    width: 100%;
    height: 100%;
    padding-top: 60px;
    padding-bottom: 60px;
    user-select: none;
    padding-right: 2px;
    transition: all 0.3s;
    min-width: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    &.side-collapse {
        position: absolute;
        top: 176px;
        border-radius: 16px;
        z-index: 10;
        background-color: white;
        transform: translateX(-106%);
    }
    &.side-collapse-show {
        transform: translateX(0);
    }
    .sidebar-left-shadow {
        position: absolute;
        top: 0;
        left: 0;
        width: 30px;
        height: 100%;
        background-image: linear-gradient(to right, #FFFFFF 20%, rgba(255, 255, 255, 0) 90%, rgba(255, 255, 255, 0) 100%);
        visibility: hidden;
    }
    .sidebar-right-shadow {
        position: absolute;
        top: 0;
        right: 0;
        width: 30px;
        height: 100%;
        background-image: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 20%, #FFFFFF 90%);
        visibility: hidden;
    }
}
.scheduled {
    //width: 223px;
    height: 100%;
    min-width: 223px;
    position: relative;
    display: inline-block;
    .calendars {
        position: relative;
        display: flex;
        width: 100%;
        height: 94px;
        align-items: flex-start;
        gap: 14px;
        padding: 11px 0 11px 10px;
    }
    .text {
        width: 100%;// 176px;
        height: 100%;// 29px;
        min-height: 54px;
        min-width: 100px;
        position: relative;
        vertical-align: top;
        display: inline-block;
        justify-content: left;
        color: #606060;
        flex-shrink: 2;
        transition: width 0s;
        span {
            font-family: 'Montserrat', sans-serif;
            font-size: 1.28rem;
            font-style: normal;
            font-weight: 700;
            white-space: wrap;
        }

    }
    .tag {
        width: 29px;
        height: 29px;
        min-width: 29px;
        border-radius: 50%;
        background: grey;
        transition: opacity 0.3s;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px transparent solid;
    }
}
.scheduled-m {
    display: none;
}
@media (max-width: 959px) {
    .sidebar {
        position: relative;
        width: 100%;
        height: 100%;
        padding: 0 0;
        max-width: calc(100% - 56px);
        .sidebar-left-shadow,
        .sidebar-right-shadow {
            visibility: visible;
        }
        .hidden {
            display: none;
        }
    }
    .scheduled {
        display: none;
    }
    .scheduled-m {
        width: 100%;
        position: relative;
        display: flex;
        flex-direction: row;
        gap: 2px;
        //padding-left: 5px;
        justify-content: left;
        overflow: hidden;
        overflow-x: auto;
        .calendars {
            --calendars-color: #F15624;
            //width: 100%;
            max-width: 92px;
            min-width: 92px;
            height: 30px;
            position: relative;
            white-space: nowrap;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            flex-direction: row;
            border-radius: 999px;
            z-index: 0;
            padding: 0 10px;
            flex-shrink: 0;
        }
        .calendars:after {
            content: '';
            position: absolute;
            width: 88px;
            height: 26px;
            background: var(--calendars-color);
            left: 2px;
            top: 2px;
            border-radius: 999px;
            padding: 0 0;
            z-index: -1;
        }
        .calendars:before {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            background: var(--calendars-border-color);
            left: 0;
            top: 0;
            z-index: -2;
        }
        .text {
            color: white;
            font-family: 'Montserrat', sans-serif;
            font-size: 12px;
            font-weight: 700;
            overflow: hidden;
            //text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    .scheduled-m::-webkit-scrollbar {
        display: none;
    }
}
</style>
