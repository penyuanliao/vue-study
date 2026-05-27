<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { JumpClimbingGame, type GameState } from './JumpClimbingGame';

const gameCanvasContainer = ref<HTMLDivElement | null>(null);
const score = ref(0);
const isGameOver = ref(false);
const gameStarted = ref(false);

let game: JumpClimbingGame;

function resetGame() {
    game?.reset();
}

const handleStateChange = (state: GameState) => {
    score.value = state.score;
    isGameOver.value = state.isGameOver;
    gameStarted.value = state.gameStarted;
};

onMounted(() => {
    game = new JumpClimbingGame(handleStateChange);
    if (gameCanvasContainer.value) {
        game.init(gameCanvasContainer.value);
    }
});

onUnmounted(() => {
    game?.destroy();
});
</script>

<template>
    <div class="jump-climbing-game">
        <h1>Jump Climbing</h1>
        <div class="score-display">Score: {{ score }}</div>
        <div ref="gameCanvasContainer" class="game-canvas-container"></div>
        <div v-if="!gameStarted && !isGameOver" class="start-overlay" @click="gameStarted = true; game.state.gameStarted = true">
            <h2>Ready?</h2>
            <p>Tap to Start Jumping!</p>
        </div>
        <div v-if="isGameOver" class="game-over-overlay">
            <h2>Game Over!</h2>
            <p>Your Score: {{ score }}</p>
            <button @click="resetGame">Play Again</button>
        </div>
    </div>
</template>

<style scoped>
.jump-climbing-game {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: #333;
    color: white;
    font-family: Arial, sans-serif;
    position: relative;
}

h1 {
    margin-bottom: 10px;
}

.score-display {
    font-size: 1.5em;
    margin-bottom: 20px;
}

.game-canvas-container {
    width: 360px;
    height: 640px;
    border: 2px solid #555;
    background-color: #222; /* Fallback if PixiJS not loaded */
    position: relative;
    overflow: hidden; /* Ensure nothing draws outside the canvas area */
}
.start-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.6);
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    cursor: pointer;
    z-index: 5;
}
/* Style for the PixiJS canvas itself */
.game-canvas-container canvas {
    display: block;
    width: 100%;
    height: 100%;
}

.game-over-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10;
}

.game-over-overlay h2 {
    color: #ffcc00;
    font-size: 2.5em;
    margin-bottom: 15px;
}

.game-over-overlay p {
    font-size: 1.2em;
    margin-bottom: 20px;
}

.game-over-overlay button {
    padding: 10px 20px;
    font-size: 1.2em;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.game-over-overlay button:hover {
    background-color: #45a049;
}
</style>