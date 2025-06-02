<script lang="ts">
import { defineComponent, PropType } from 'vue';
import SwitchButton from "../Button/SwitchButton.vue";
import { ICalendars } from "@/components/EventCalendar/useEventCalendar";

export default defineComponent({
    name: 'NSidebar',
    props: {
        calendars: {
            type: Array as PropType<Array<ICalendars>>,
            default: () => [],
        }
    },
    components: { SwitchButton },
    emits: ['update:calendars'],
    setup(props, { emit }) {
        const handle = (value: { checked: boolean, id: string }, index: number) => {
            const updated = [...props.calendars];
            updated[index].checked = value.checked;
            emit('update:calendars', updated);
        };
        return {
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
                        background: item.color,
                        opacity: item.checked ? 1 : 0
                    }"/>
                <SwitchButton
                    :id="`tag-${ i }`"
                    :data="item"
                    class="switch-btn"
                    width="47"
                    height="30"
                    border="2"
                    @change="(value) => handle(value, i)"
                />
            </div>
        </div>
    </aside>
</template>

<style scoped lang="scss">
.sidebar {
    width: auto;
    height: 100%;
    padding-top: 60px;
    padding-bottom: 60px;
    user-select: none;
    padding-right: 2px;
    transition: all 0.3s;
    &.side-collapse {
        position: absolute;
        top: 176px;
        border-radius: 16px;
        z-index: 20;
        background-color: white;
        transform: translateX(-106%);
    }
    &.side-collapse-show {
        transform: translateX(0);
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
        padding: 11px 0;
    }
    .text {
        width: 100%;// 176px;
        height: 100%;// 29px;
        min-height: 54px;
        position: relative;
        vertical-align: top;
        display: inline-block;
        justify-content: left;
        color: #606060;
        flex-shrink: 1;
        transition: width 0s;
        span {
            font-family: 'Montserrat', sans-serif;
            font-size: 1.28rem;
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
        transition: opacity 0.3s;
    }
}
@media (max-width: 1023px) {
    .scheduled {
        .text {
            width: 100px;
            flex-shrink: 1;
        }
    }
}
</style>
