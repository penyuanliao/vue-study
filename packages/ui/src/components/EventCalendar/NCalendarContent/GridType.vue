<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import NSymbols from '../Button/NSymbols.vue';

export default defineComponent({
    name: 'GridType',
    components: { NSymbols },
    emits: ['change', 'update:selected'],
    props: {
        selected: {
            type: String,
            default: 'small'
        }
    },
    computed: {
        layout: {
            get() {
                return this.selected;
            },
            set(value: string) {
                this.$emit('update:selected', value);
                this.$emit('change', value);
            }
        }
    }
});
</script>

<template>
    <div class="button-group">
        <label
            v-for="type in ['small', 'medium']"
            :key="type"
            class="layout-option"
            :class="{ selected: layout === type }"
        >
            <input
                type="radio"
                name="calendar-layout"
                :value="type"
                v-model="layout"
            />
            <span>
                <NSymbols
                    :name="type === 'small' ? 'girdTypeSmall' : 'girdTypeMedium'"
                />
            </span>
        </label>
    </div>
</template>

<style scoped lang="scss">
@use '../theme';

.button-group {
    height: 100%;
    min-width: 36px;
    position: relative;
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: row;
    .layout-option {
        width: 36px;
        height: 36px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #DFDFDF;
        transition: 0.3s;
        cursor: pointer;
        &.selected {
            color: #F15624;
        }
        &:active {
            scale: .9;
        }
        &:hover {
            //color: #444746;
        }
    }
}
input {
    display: none;
}

@media (max-width: 959px) {
    .button-group {
        .layout-option {
            width: 28px;
        }
        .layout-option > span {
            scale: 0.834;
        }
    }
}
</style>
