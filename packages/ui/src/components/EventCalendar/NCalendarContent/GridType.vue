<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import NSymbols from "../Button/NSymbols.vue";

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
    setup(props) {
        const layout = ref<'small' | 'medium' | string>(props.selected);
        watch(() => props.selected, (value) => {
            layout.value = value;
        });
        return { layout };
    },
    methods: {
        onChangeHandle() {
            this.$emit('update:selected', this.layout);
            this.$emit('change', this.layout);
        }
    }
});
</script>

<template>
    <div class="button-group">
        <label
            class="layout-option"
            :class="{ selected: layout === 'small' }"
        >
            <input
                type="radio"
                name="calendar-layout"
                value="small"
                v-model="layout"
                @change="onChangeHandle"
            />
            <span>
                <NSymbols name="girdTypeSmall" />
            </span>
        </label>
        <label
            class="layout-option"
            :class="{ selected: layout === 'medium' }"
        >
            <input
                type="radio"
                name="calendar-layout"
                value="medium"
                v-model="layout"
                @change="onChangeHandle"
            />
            <span>
                <NSymbols name="girdTypeMedium" />
            </span>
        </label>
    </div>
</template>

<style scoped lang="scss">
@use '../theme';

.button-group {
    height: 100px;
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
            color: #444746;
        }
    }
}
input {
    display: none;
}

@media (max-width: 959px) {
    .button-group {
        height: 64px;
    }
}
</style>
