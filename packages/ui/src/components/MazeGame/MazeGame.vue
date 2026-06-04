<template>
    <div class="game-container">
        <div class="ui-panel">
            <h2>PixiJS 迷宮探險</h2>
            <div class="stats">
                <span>剩餘寶箱: {{ chestsFound }} / {{ totalChests }}</span>
                <span style="margin-left: 20px;">剩餘步數: {{ remainingSteps }}</span>
                <span v-if="isGameOver" class="win-msg">🎉 成功過關！</span>
                <span v-if="isGameLost" class="lose-msg">
                    {{ isStuck ? '💀 走投無路！' : '💀 步數耗盡！' }}
                </span>
            </div>
            <p>提示：紫色路徑不可重複踏入！</p>
            <div class="controls">
                <button @click="resetGame">重新開始</button>
                <button @click="startAutoMove" :disabled="isGameLost" class="auto-btn">自動探索 (貪婪)</button>
            </div>
        </div>
        <div ref="pixiRoot" class="canvas-wrapper"></div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, reactive, computed } from 'vue';
import * as PIXI from 'pixi.js';

// --- 1. 配置與型別 ---
const TILE_SIZE = 80;
const MAX_STEPS = 10;
const mazeLayout = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 2 是終點
];
const START_POINT = { x: 0, y: 0 };

const pixiRoot = ref<HTMLDivElement>();
let app: PIXI.Application;

// 遊戲狀態
const gameState = reactive({
    player: { x: 0, y: 0, xp: 0, },
    visited: new Set<string>(),
    chests: new Set<string>(),
    totalChests: 0,
    chestsCollected: 0,
    stepsTaken: 0,
    isFinished: false,
    isLost: false,
    isStuck: false
});

const chestsFound = computed(() => gameState.chestsCollected);
const totalChests = computed(() => gameState.totalChests);
const isGameOver = computed(() => gameState.isFinished);
const isStuck = computed(() => gameState.isStuck);
const isGameLost = computed(() => gameState.isFinished ? false : (gameState.isLost || gameState.isStuck));
const remainingSteps = computed(() => MAX_STEPS - gameState.stepsTaken);

// Pixi 物件引用
const playerSprite = new PIXI.Graphics();
const trailLayer = new PIXI.Graphics();
const chestLayer = new PIXI.Container();

// --- 2. 遊戲初始化 ---
const initGame = async () => {
    app = new PIXI.Application();
    await app.init({
        width: mazeLayout[0].length * TILE_SIZE,
        height: mazeLayout.length * TILE_SIZE,
        backgroundColor: 0x2c3e50
    });

    pixiRoot.value?.appendChild(app.canvas);

    setupMap();
    spawnChests();
    setupPlayer();

    // 初始位置標記為已走過
    markVisited(gameState.player.x, gameState.player.y);
};

// 繪製靜態地圖
const setupMap = () => {
    const mapGraphics = new PIXI.Graphics();
    mazeLayout.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell === 1) { // 牆
                mapGraphics.rect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE).fill(0x34495e);
            } else if (cell === 2) { // 終點
                mapGraphics.rect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE).fill(0x27ae60);
            }
        });
    });
    app.stage.addChild(mapGraphics);
    app.stage.addChild(trailLayer);
    app.stage.addChild(chestLayer);
};

// 隨機生成 1-5 個寶箱
const spawnChests = () => {
    chestLayer.removeChildren();
    gameState.chests.clear();

    const pathCells: {x: number, y: number}[] = [];
    mazeLayout.forEach((row, y) => {
        row.forEach((cell, x) => {
            // 只有在路徑格 (0) 且非起點放置寶箱
            if (cell === 0 && !(x === START_POINT.x && y === START_POINT.y)) {
                pathCells.push({ x, y });
            }
        });
    });

    const count = Math.floor(Math.random() * 5) + 1;
    gameState.totalChests = count;
    gameState.chestsCollected = 0;

    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * pathCells.length);
        const pos = pathCells.splice(randomIndex, 1)[0];
        const key = `${pos.x},${pos.y}`;
        gameState.chests.add(key);

        // 繪製寶箱
        const chest = new PIXI.Graphics();
        chest.label = key;
        chest.star(pos.x * TILE_SIZE + TILE_SIZE / 2, pos.y * TILE_SIZE + TILE_SIZE / 2, 5, TILE_SIZE / 4).fill(0xf1c40f);
        chestLayer.addChild(chest);
    }
};

const setupPlayer = () => {
    playerSprite.circle(TILE_SIZE / 2, TILE_SIZE / 2, TILE_SIZE / 3).fill(0xffffff);
    updatePlayerView();
    app.stage.addChild(playerSprite);
};

// --- 3. 核心邏輯 ---
const checkIfStuck = (x: number, y: number): boolean => {
    const moves = [{ dx: 0, dy: -1 }, { dx: 0, dy: 1 }, { dx: -1, dy: 0 }, { dx: 1, dy: 0 }];
    for (const move of moves) {
        const nx = x + move.dx;
        const ny = y + move.dy;
        const key = `${nx},${ny}`;

        if (ny >= 0 && ny < mazeLayout.length && nx >= 0 && nx < mazeLayout[0].length &&
            mazeLayout[ny][nx] !== 1 && !gameState.visited.has(key)) {
            return false; // 找到一條出路，沒有卡住
        }
    }
    return true; // 找不到任何出路
};
// 移動函式
const movePlayer = (dx: number, dy: number) => {
    if (isGameLost.value || gameState.isFinished) return;

    const nextX = gameState.player.x + dx;
    const nextY = gameState.player.y + dy;
    const key = `${nextX},${nextY}`;

    // 邊界檢查
    if (nextY < 0 || nextY >= mazeLayout.length || nextX < 0 || nextX >= mazeLayout[0].length) return;
    // 牆壁檢查
    if (mazeLayout[nextY][nextX] === 1) return;
    // 禁止回頭檢查
    if (gameState.visited.has(key)) {
        console.warn("不能走回頭路！");
        return;
    }

    // 步數檢查
    if (gameState.stepsTaken >= MAX_STEPS) {
        gameState.isLost = true;
        return;
    }

    // 執行移動
    gameState.player.x = nextX;
    gameState.player.y = nextY;
    gameState.stepsTaken++;

    markVisited(nextX, nextY);
    checkPickups(key);
    updatePlayerView();
    checkWin();

    // 檢查是否耗盡步數
    if (gameState.stepsTaken >= MAX_STEPS && !gameState.isFinished) {
        gameState.isLost = true;
    }

    // 檢查是否陷入死胡同 (在遊戲未結束時)
    if (!gameState.isFinished && !gameState.isLost) {
        if (checkIfStuck(gameState.player.x, gameState.player.y)) {
            gameState.isStuck = true;
            console.log("手動移動陷入死胡同！");
        }
    }
};

const markVisited = (x: number, y: number) => {
    gameState.visited.add(`${x},${y}`);
    // 繪製足跡
    trailLayer.rect(x * TILE_SIZE + 10, y * TILE_SIZE + 10, TILE_SIZE - 20, TILE_SIZE - 20).fill({ color: 0x9b59b6, alpha: 0.6 });
};

const checkPickups = (key: string) => {
    if (gameState.chests.has(key)) {
        gameState.chests.delete(key);
        gameState.chestsCollected++;
        // 移除視覺上的寶箱
        const chest = chestLayer.getChildByLabel(key);
        if (chest) chestLayer.removeChild(chest);
    }
};

const updatePlayerView = () => {
    playerSprite.x = gameState.player.x * TILE_SIZE;
    playerSprite.y = gameState.player.y * TILE_SIZE;
};

const checkWin = () => {
    // 過關條件：拿完所有寶箱即可
    if (gameState.chestsCollected === gameState.totalChests) {
        gameState.isFinished = true;
    }
};

const resetGame = () => {
    gameState.player = { x: 1, y: 1 };
    gameState.visited.clear();
    gameState.isFinished = false;
    gameState.isLost = false;
    gameState.isStuck = false;
    gameState.stepsTaken = 0;
    trailLayer.clear();
    spawnChests();
    markVisited(1, 1);
    updatePlayerView();
};

// --- 4. 自動移動 (貪婪演算法) ---
const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
};

const startAutoMove = async () => {
    if (isGameLost.value || gameState.isFinished) return;

    while (!isGameLost.value && !gameState.isFinished) {
        let minChestDist = Infinity;
        let targetChest: { x: number, y: number } | null = null;

        for (const key of gameState.chests) {
            const [cx, cy] = key.split(',').map(Number);
            const d = getDistance(gameState.player.x, gameState.player.y, cx, cy);
            if (d < minChestDist) {
                minChestDist = d;
                targetChest = { x: cx, y: cy };
            }
        }

        if (!targetChest) break;

        const moves = [
            { dx: 0, dy: -1 },
            { dx: 0, dy: 1 },
            { dx: -1, dy: 0 },
            { dx: 1, dy: 0 }
        ];
        let bestMove = null;
        let bestMoveDist = Infinity;

        for (const move of moves) {
            const nx = gameState.player.x + move.dx;
            const ny = gameState.player.y + move.dy;
            const key = `${nx},${ny}`;

            if (ny < 0 || ny >= mazeLayout.length || nx < 0 || nx >= mazeLayout[0].length ||
                mazeLayout[ny][nx] === 1 ||  // 檢查是否撞牆
                gameState.visited.has(key) // 檢查是否走過
            ) {
                continue;
            }
            // 曼哈頓距離
            const d = getDistance(nx, ny, targetChest.x, targetChest.y);
            if (d < bestMoveDist) {
                bestMoveDist = d; // 紀錄目前最短距離
                bestMove = move; // 紀錄這個方向是目前最好的
            }
        }

        if (bestMove) {
            movePlayer(bestMove.dx, bestMove.dy);
            await new Promise(resolve => setTimeout(resolve, 300));
        } else {
            // 自動移動的死胡同判斷已由 movePlayer 內部處理
            // 此處 break 避免無限循環
            break;
        }
    }
};

// --- 5. 生命週期 ---
const handleKey = (e: KeyboardEvent) => {
    switch (e.key) {
        case 'ArrowUp': movePlayer(0, -1); break;
        case 'ArrowDown': movePlayer(0, 1); break;
        case 'ArrowLeft': movePlayer(-1, 0); break;
        case 'ArrowRight': movePlayer(1, 0); break;
    }
};

onMounted(() => {
    initGame();
    window.addEventListener('keydown', handleKey);
});

onUnmounted(() => {
    app?.destroy(true);
    window.removeEventListener('keydown', handleKey);
});
</script>

<style scoped>
.game-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: '微軟正黑體', sans-serif;
    color: #ecf0f1;
}
.ui-panel {
    background: #34495e;
    padding: 1rem;
    width: 100%;
    text-align: center;
}
.stats {
    font-size: 1.2rem;
    margin: 10px 0;
    font-weight: bold;
}
.win-msg {
    color: #2ecc71;
    margin-left: 20px;
}
.lose-msg {
    color: #e74c3c;
    margin-left: 20px;
}
.controls {
    margin-top: 10px;
    display: flex;
    gap: 10px;
    justify-content: center;
}
.canvas-wrapper {
    margin-top: 20px;
    border: 5px solid #bdc3c7;
    border-radius: 8px;
    overflow: hidden;
}
button {
    background: #e67e22;
    color: white;
    border: none;
    padding: 8px 20px;
    border-radius: 4px;
    cursor: pointer;
}
button:hover { background: #d35400; }
button:disabled {
    background: #95a5a6;
    cursor: not-allowed;
}
.auto-btn {
    background: #3498db;
}
.auto-btn:hover {
    background: #2980b9;
}
</style>