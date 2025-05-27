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
    <div class="event-title-container">
        <div v-show="!!$slots.icon" class="event-icon">
          <slot name="icon" />
        </div>
        <div class="event-title">
            <h1>{{ title }}</h1>
        </div>
        <div
          v-if="startTime !== '' && endedTime !== ''"
          class="event-content"
        >
            <p class="event-date">{{ eventDate }}</p>
            <p class="event-desc" :style="{
              display: small ? 'none' : 'block'
            }">{{ eventDesc }}</p>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import url('https://fonts.cdnfonts.com/css/montserrat');

.event-title-container {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    font-family: 'Montserrat', sans-serif;
    flex-direction: row;
    gap: 16px;
    padding-left: 16px;
}
.event-icon {
    width: 51px; // 16 24 11
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 2px;
}
.event-title {
    width: 83px;
    height: 100%;
    min-width: 83px;
    position: relative;
    display: flex;
    text-align: left;
    align-items: center;
    justify-content: center;
    h1 {
        color: #202020;
        font-size: 23px;
        font-weight: 700;
        box-sizing: border-box;
        text-overflow: ellipsis;
        overflow:hidden;
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
    font-weight: 300;
    padding-right: 10px;
    p {
      width: 100%;
      max-width: 100%;
      cursor: default;
      // font-size: clamp(12px, 1.2vw, 19px);
      font-size: 19px;
      box-sizing: border-box;
      text-overflow: ellipsis;
      overflow:hidden;
      white-space: nowrap;
    }
}
</style>
