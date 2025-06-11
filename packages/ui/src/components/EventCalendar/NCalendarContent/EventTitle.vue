<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
    name: 'EventTitle',
    props: {
        title: {
            type: String,
            required: false,
            default: 'PG电子'
        },
        startTime: {
            type: String,
            required: false,
            default: ''
        },
        endedTime: {
            type: String,
            required: false,
            default: ''
        },
        eventDesc: {
            type: String,
            required: false,
            default: ''
        },
        small: {
            type: Boolean,
            default: false
        }
    },
    setup(props) {
        const eventDate = computed(() => `${props.startTime.substring(0, 10)} ~ ${props.endedTime.substring(0, 10)}`);
        return {
            eventDate
        };
    }
});
</script>

<template>
    <div
        class="event-title-container"
        :class="{
            icon: !!$slots.icon
        }"
    >
        <div class="event-title-tag" v-if="!!$slots.coTag">
            <slot name="coTag" />
        </div>
        <div
            v-if="!!$slots.icon"
            class="event-icon"
        >
            <slot name="icon" />
        </div>
        <div
            class="event-title"
            v-show="!$slots.icon"
        >
            <h1
                :class="{
                    'small': small
                }"
            >
                {{ title }}
            </h1>
        </div>
        <div
            v-if="startTime !== '' && endedTime !== ''"
            class="event-content"
        >
            <p
                class="event-date"
                :title="eventDate"
            >
                {{ eventDate }}
            </p>
            <p
                class="event-desc"
                v-html="eventDesc"
                :style="{
                    display: small ? 'none' : 'block'
                }"
            />
        </div>
    </div>
</template>

<style scoped lang="scss">
@use '../theme';

.event-title-container {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    font-family: 'Montserrat', sans-serif;
    flex-direction: row;
    gap: 12px;
    padding-left: 16px;
    &.icon {
        padding-left: 0;
    }
    .event-title-tag {
        padding-top: 2px;
    }
}
.event-icon {
    width: 100%; // 16 24 11
    height: 100%;
    min-width: 0;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.event-title {
    //width: 83px;
    height: 100%;
    min-width: 83px;
    position: relative;
    display: flex;
    text-align: left;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    h1 {
        width: 100%;
        color: #202020;
        font-size: 23px;
        font-weight: 700;
        box-sizing: border-box;
        text-overflow: ellipsis;
        overflow:hidden;
        white-space: normal;
        &.small {
            font-size: 19px;
            white-space: nowrap;
        }
    }
}
.event-content {
    width: 100%;
    height: 100%;
    min-width: 0;
    display: flex;
    position: relative;
    flex-direction: column;
    justify-content: center;
    text-align: left;
    line-height: 29px;
    // font-size: 19px;
    padding-right: 10px;
    p {
        width: 100%;
        max-width: 100%;
        cursor: default;
        // font-size: clamp(12px, 1.2vw, 19px);
        font-weight: 500;
        font-size: 19px;
        box-sizing: border-box;
        text-overflow: ellipsis;
        overflow:hidden;
        white-space: nowrap;
    }
}
</style>
