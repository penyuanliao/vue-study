<script setup lang="ts">

</script>

<template>
    <div class="blob red">

    </div>
</template>

<style scoped>
.blob {
    background: black;
    border-radius: 50%;
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 1);
    margin: 10px;
    height: 20px;
    width: 20px;
    transform: scale(1);
    animation: pulse-black 2s infinite;
    border: 3px white solid;
    &.red {
        background: red;
        box-shadow: 0 0 0 0 rgba(255, 255, 255, 1);
        animation: pulse-white 2s infinite;
    }
}
@keyframes pulse-white {
    0% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
    }

    70% {
        transform: scale(1);
        box-shadow: 0 0 0 4px rgba(255, 255, 255, 0);
    }

    100% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
    }
}
@keyframes pulse-red {
    0% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(255, 82, 82, 0.7);
    }

    70% {
        transform: scale(1);
        box-shadow: 0 0 0 4px rgba(255, 82, 82, 0);
    }

    100% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(255, 82, 82, 0);
    }
}
</style>
