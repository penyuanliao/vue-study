import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';

export interface PlayerGraphics extends PIXI.Graphics {
    vy: number;
    isJumping: boolean;
}

export interface GameState {
    score: number;
    isGameOver: boolean;
    gameStarted: boolean;
}

export class JumpClimbingGame {
    // Constants
    private readonly GAME_WIDTH = 360;
    private readonly GAME_HEIGHT = 640;
    private readonly BLOCK_WIDTH = 100;
    private readonly BLOCK_HEIGHT = 30;
    private readonly PLAYER_SIZE = 40;
    private readonly GRAVITY = 0.5;
    private readonly JUMP_STRENGTH = -12;
    private readonly BLOCK_SLIDE_DURATION = 2.0; // 稍微加快一點
    private readonly BLOCK_GAP_Y = 30;
    private readonly BLOCK_SPAWN_INTERVAL = 1500;

    // PIXI Elements
    public app!: PIXI.Application;
    private gameContainer!: PIXI.Container;
    private player!: PlayerGraphics;
    private blocks: PIXI.Graphics[] = [];

    // State
    private lastBlockSpawnTime = 0;
    private nextBlockSpawnSide: 'left' | 'right' = 'left';
    private playerOnGround = false;
    public state: GameState = {
        score: 0,
        isGameOver: false,
        gameStarted: false
    };

    // Callbacks for UI sync
    private onStateChange: (state: GameState) => void;

    constructor(onStateChange: (state: GameState) => void) {
        this.onStateChange = onStateChange;
    }

    async init(container: HTMLDivElement) {
        this.app = new PIXI.Application();
        await this.app.init({
            width: this.GAME_WIDTH,
            height: this.GAME_HEIGHT,
            background: '#6cc9e8',
            antialias: true,
            resolution: window.devicePixelRatio || 1,
        });

        const canvas = (this.app.canvas || this.app.view) as HTMLCanvasElement;
        container.appendChild(canvas);
        canvas.style.width = '100%';
        canvas.style.height = '100%';

        this.gameContainer = new PIXI.Container();
        this.app.stage.addChild(this.gameContainer);

        this.setupInitialScene();
        
        canvas.addEventListener('pointerdown', () => this.handleJump());
        this.app.ticker.add((delta) => this.update(delta));
    }

    private setupInitialScene() {
        this.createPlayer();
        this.createBlock(this.GAME_WIDTH / 2 - this.BLOCK_WIDTH / 2, this.GAME_HEIGHT - this.BLOCK_HEIGHT);
    }

    private createPlayer() {
        this.player = new PIXI.Graphics() as PlayerGraphics;
        this.player.rect(-this.PLAYER_SIZE / 2, -this.PLAYER_SIZE, this.PLAYER_SIZE, this.PLAYER_SIZE).fill(0xff7e5f);
        this.player.x = this.GAME_WIDTH / 2;
        this.player.y = this.GAME_HEIGHT - this.BLOCK_HEIGHT;
        this.player.vy = 0;
        this.player.isJumping = false;
        this.gameContainer.addChild(this.player);
    }

    private createBlock(x: number, y: number): PIXI.Graphics {
        const block = new PIXI.Graphics();
        block.rect(0, 0, this.BLOCK_WIDTH, this.BLOCK_HEIGHT).fill(0x00ff00);
        block.x = x;
        block.y = y;
        this.gameContainer.addChild(block);
        this.blocks.push(block);
        return block;
    }

    private handleJump() {
        if (this.state.isGameOver) return;

        if (!this.state.gameStarted) {
            this.updateState({ gameStarted: true });
            this.lastBlockSpawnTime = this.app.ticker.lastTime;
            return;
        }

        if (this.playerOnGround) {
            this.player.vy = this.JUMP_STRENGTH;
            this.playerOnGround = false;
            this.player.isJumping = true;
            
            gsap.to(this.player.scale, {
                y: 0.7, x: 1.3, duration: 0.05, yoyo: true, repeat: 1,
                ease: "power1.inOut",
                onComplete: () => { this.player.scale.set(1); }
            });
        }
    }

    private spawnNewBlock() {
        const lastBlock = this.blocks[this.blocks.length - 1];
        const newBlockY = lastBlock.y - this.BLOCK_GAP_Y;
        const centerX = (this.GAME_WIDTH - this.BLOCK_WIDTH) / 2; // 中間

        let startX = this.nextBlockSpawnSide === 'left' ? -this.BLOCK_WIDTH : this.GAME_WIDTH;
        this.nextBlockSpawnSide = this.nextBlockSpawnSide === 'left' ? 'right' : 'left';

        const newBlock = this.createBlock(startX, newBlockY);

        gsap.to(newBlock, {
            x: centerX,
            duration: this.BLOCK_SLIDE_DURATION,
            ease: "none", // 穩定滑入感
        });

        if (this.blocks.length > 15) {
            const oldBlock = this.blocks.shift();
            if (oldBlock) {
                this.gameContainer.removeChild(oldBlock);
                oldBlock.destroy();
            }
        }
    }

    private update(delta: PIXI.Ticker) {
        if (this.state.isGameOver || !this.state.gameStarted) return;

        this.player.vy += this.GRAVITY;
        this.player.y += this.player.vy;

        this.playerOnGround = false;
        
        for (const block of this.blocks) {
            const playerLeft = this.player.x - this.PLAYER_SIZE / 2;
            const playerRight = this.player.x + this.PLAYER_SIZE / 2;
            const isHorizontalOverlap = playerRight > block.x && playerLeft < block.x + this.BLOCK_WIDTH;
            
            // 1. 垂直碰撞
            if (isHorizontalOverlap) {

                const isStandingOn = Math.abs(this.player.y - block.y) < 2;
                const isFallingOnto = this.player.vy > 0 && this.player.y >= block.y && (this.player.y - this.player.vy) <= block.y + 10;

                if (isStandingOn || isFallingOnto) {
                    this.player.y = block.y; 
                    this.player.vy = 0;
                    this.playerOnGround = true;
                    this.player.isJumping = false;
                    // 當玩家接觸到方塊時，立即停止該方塊的動畫（使其停在當前位置）
                    gsap.killTweensOf(block);
                    continue;
                }
            }

            // 2. 側面碰撞死亡判定
            const isBodyOverlapping = this.player.y > block.y && (this.player.y - this.PLAYER_SIZE) < (block.y + this.BLOCK_HEIGHT);
            if (isBodyOverlapping && isHorizontalOverlap) {
                this.gameOver();
                return;
            }
        }

        const playerScreenY = this.player.y + this.gameContainer.y;

        // 死亡判定：掉出螢幕或撞牆
        if (playerScreenY > this.GAME_HEIGHT || this.player.x - this.PLAYER_SIZE / 2 < 0 || this.player.x + this.PLAYER_SIZE / 2 > this.GAME_WIDTH) {
            this.gameOver();
            return;
        }

        // 相機跟隨
        if (playerScreenY < this.GAME_HEIGHT * 0.4) {
            const scrollAmount = (this.GAME_HEIGHT * 0.4) - playerScreenY;
            this.gameContainer.y += scrollAmount * 0.1;
        }

        // 定時生成
        if (this.app.ticker.lastTime - this.lastBlockSpawnTime > this.BLOCK_SPAWN_INTERVAL) {
            this.spawnNewBlock();
            this.lastBlockSpawnTime = this.app.ticker.lastTime;
        }

        // 更新分數
        const newScore = Math.floor(Math.abs(this.gameContainer.y / this.BLOCK_GAP_Y));
        if (newScore !== this.state.score) {
            this.updateState({ score: newScore });
        }
    }

    private gameOver() {
        this.updateState({ isGameOver: true });
    }

    private updateState(newState: Partial<GameState>) {
        this.state = { ...this.state, ...newState };
        this.onStateChange(this.state);
    }

    public reset() {
        this.gameContainer.removeChildren();
        this.blocks = [];
        gsap.globalTimeline.clear();
        this.playerOnGround = false;
        this.gameContainer.y = 0;
        this.lastBlockSpawnTime = 0;
        this.nextBlockSpawnSide = 'left';
        this.updateState({ score: 0, isGameOver: false, gameStarted: false });
        this.setupInitialScene();
    }

    public destroy() {
        if (this.app) {
            this.app.destroy(true, { children: true, texture: true });
        }
        gsap.globalTimeline.clear();
    }
}