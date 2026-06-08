import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import Matter from "matter-js";
import { JCPlayer } from "./JCPlayer";
import JCBlock from "./JCBlock";
import { LoaderManager } from "./LoaderManager";
import JCGround from "./JCGround";
import CountDownTimer from "./HUD/CountDownTimer";
import Camera from "./Camera/Camera";

export interface BlockGraphics extends PIXI.Graphics {
    vy: number;
    isFalling: boolean;
    canFall: boolean;
}

export interface IGameState {
    score: number;
    isGameOver: boolean;
    gameStarted: boolean;
    countdown: number;
}

export class JumpClimbingGameV2 {
    // Constants
    private readonly GAME_WIDTH = 360;
    private readonly GAME_HEIGHT = 640;
    private readonly BLOCK_WIDTH = 32 * 3;
    private readonly BLOCK_HEIGHT = 32;
    private readonly PLAYER_SIZE = 35;
    private readonly GROUND_HEIGHT = 32;

    private readonly GRAVITY = 1;
    private readonly SPAWN_INTERVAL: number = 2; // 方塊生成間隔（秒）

    // Matter.js Engine
    private engine: Matter.Engine;
    private world: Matter.World;
    private runner!: Matter.Runner;

    public level: number = 1;
    // 總秒數
    public totalSeconds: number = 10;

    // PIXI Elements
    public app!: PIXI.Application;
    private gameContainer!: PIXI.Container;
    private debugGraphics!: PIXI.Graphics; // 用於除錯顯示

    private camera!: Camera;

    // private player!: { body: Matter.Body, graphics: any };
    private player!: JCPlayer;

    private ground!: JCGround;
    private timerHUD!: CountDownTimer;

    private spawnTimer: gsap.core.Tween | null = null;

    private blockPairs: JCBlock[] = [];

    public state: IGameState = {
        score: 0,
        isGameOver: false,
        gameStarted: false,
        countdown: this.totalSeconds,
    };

    private onStateChange: (state: IGameState) => void;


    constructor(onStateChange: (state: IGameState) => void) {
        this.onStateChange = onStateChange;
        this.engine = Matter.Engine.create();

        // 增加物理運算的精準度，讓物體「變硬」
        this.engine.positionIterations = 10; // 預設為 6
        this.engine.velocityIterations = 10; // 預設為 4

        this.world = this.engine.world;
        this.world.gravity.y = this.GRAVITY;
    }

    public async init(container: HTMLDivElement) {
        this.app = new PIXI.Application();
        await this.app.init({
            width: this.GAME_WIDTH,
            height: this.GAME_HEIGHT,
            background: "#6cc9e8",
            antialias: true,
            resolution: window.devicePixelRatio || 1,
        });
        const canvas = (this.app.canvas || this.app.view) as HTMLCanvasElement;
        container.appendChild(canvas);
        canvas.style.width = "100%";
        canvas.style.height = "100%";

        this.gameContainer = new PIXI.Container();
        this.app.stage.addChild(this.gameContainer);

        this.camera = new Camera(this.GAME_WIDTH, this.GAME_HEIGHT);
        this.camera.setViewPort(this.gameContainer);

        // 初始化倒數計時器 HUD (直接加在 stage 上，不隨 gameContainer 移動)
        this.timerHUD = new CountDownTimer();
        this.timerHUD.x = this.GAME_WIDTH / 2;
        this.timerHUD.y = 60;
        this.timerHUD.update(this.totalSeconds);
        this.app.stage.addChild(this.timerHUD);

        this.debugGraphics = new PIXI.Graphics();
        this.app.stage.addChild(this.debugGraphics);

        await this.setupScene();

        canvas.addEventListener("pointerdown", () => this.handleJump());

        // 1. 初始化 Runner 並啟動
        this.runner = Matter.Runner.create();
        Matter.Runner.run(this.runner, this.engine);

        // 2. 監聽物理更新後的事件來同步位置
        Matter.Events.on(this.engine, "collisionStart", this.handleListenCollision.bind(this));
        Matter.Events.on(this.engine, "afterUpdate", () => this.syncPhysicsToGraphics());
    }

    public async setupScene() {
        // 載入素材
        const loaderManager = LoaderManager.getInstance();
        await loaderManager.preload();

        // 建立地面
        this.createGround();
        // 建立玩家
        const player = await this.createPlayer();
        this.gameContainer.addChild(player);
        // 建立方塊
        // this.blockPairs.push(this.createBlock());
    }

    private createGround() {

        // 這裡的 x, y 應該是地面的中心點
        const x = this.GAME_WIDTH / 2;
        const y = this.GAME_HEIGHT - this.GROUND_HEIGHT / 2;

        // 1. 建立地面的視覺容器
        const groundView = new JCGround();
        // 2. 建立視覺內容 (傳入寬高)
        groundView.createGround(this.GAME_WIDTH, this.GROUND_HEIGHT);
        // 3. 設定物理屬性 (傳入世界實例與位置參數)
        groundView.setupPhysics(this.world, {
            width: this.GAME_WIDTH,
            height: this.GROUND_HEIGHT,
            x,
            y,
        });
        // 直接將物理引擎的中心點座標，設定給 PixiJS 視覺外觀
        groundView.setup({ x, y });
        // 5. 加入場景
        this.gameContainer.addChild(groundView);

        this.ground = groundView;

    }

    private createBlock(targetX: number = this.GAME_WIDTH / 2) {
        const side = this.level % 2 ? 'left' : 'right';
        // const startX = this.GAME_WIDTH / 2;
        const startX = side === 'left' ? -this.GAME_WIDTH : this.GAME_WIDTH;
        const padding: number = 4;
        // 將起始位置改到地面上方
        const startY = this.ground.y + this.PLAYER_SIZE / 2 - this.BLOCK_HEIGHT / 2 - this.level * this.BLOCK_HEIGHT - padding;

        const block = new JCBlock();
        block.setupPhysics(this.world, { x: startX, y: startY });
        this.gameContainer.addChild(block);

        // 初始同步位置，這樣即使 update 還沒跑也能看到方塊
        block.x = startX;
        block.y = startY;

        block.slideIn(startX, targetX);

        return block;
    }

    private async createPlayer() {
        const player = new JCPlayer();
        await player.setup(this.world, {
            width: this.PLAYER_SIZE,
            height: this.PLAYER_SIZE,
            x: this.GAME_WIDTH / 2,
            y: this.GAME_HEIGHT - this.GROUND_HEIGHT - 2,
        });
        this.player = player;
        return player;
    }

    private updateState(newState: Partial<IGameState>) {
        this.state = { ...this.state, ...newState };

        // 當 countdown 更新時，同步更新 HUD
        if (newState.countdown !== undefined && this.timerHUD) {
            this.timerHUD.update(this.state.countdown);
        }

        this.onStateChange(this.state);
    }

    private syncPhysicsToGraphics() {
        // 將物理座標拷貝到 PixiJS 視覺物件上
        // 在 afterUpdate 事件中
        let i = 0;
        for (const pair of this.blockPairs) {
            pair.update();
        }
        if (this.player) {
            // 同步player位置
            this.player.update();
        }
        // 相機跟隨
        this.camera.focus(this.player);
    }
    /**
     * 開始定時生成方塊
     */
    private startSpawnTimer() {
        const st = Date.now();
        const spawn = () => {
            console.log("spawn", this.state.countdown, Date.now() - st);
            if (this.state.isGameOver) return;
            this.updateState({ countdown: --this.state.countdown });
            if (this.state.countdown <= 0) {
                this.gameOver();
                return;
            }
            this.next();
            // 遞迴呼叫實現循環
            this.spawnTimer = gsap.delayedCall(this.SPAWN_INTERVAL, spawn);
        };

        this.spawnTimer = gsap.delayedCall(this.SPAWN_INTERVAL, spawn);
    }
    /**
     * 停止定時生成方塊
     * @private
     */
    private stopSpawnTimer() {
        if (this.spawnTimer) {
            this.spawnTimer.kill();
            this.spawnTimer = null;
        }
    }

    private gameOver(collisionNormal?: Matter.Vector) {
        if (this.state.isGameOver) return;
        this.updateState({ isGameOver: true });
        this.stopSpawnTimer();

        if (this.player) {
            const bounceX = collisionNormal ? (collisionNormal.x < 0 ? -10 : 10) : (Math.random() < 0.5 ? 10 : -10);
            this.player.fallout(bounceX);
        }
    }

    private handleJump() {
        if (!this.player || this.state.isGameOver) return;

        this.player.jump();
    }

    private handleListenCollision(event) {
        const pairs = event.pairs;

        // 每一幀清理舊的除錯線條
        this.debugGraphics.clear();

        for (const pair of pairs) {
            const { bodyA, bodyB, collision } = pair;

            // --- 顯示法線邏輯 ---
            // collision.supports[0] 是碰撞的接觸點座標
            const contactPoint = collision.supports[0];
            if (contactPoint) {
                const normal = collision.normal;
                const lineLength = 50; // 線條長度

                this.debugGraphics
                    .setStrokeStyle({ width: 2, color: 0xffff00 }) // 黃色線代表法線
                    .moveTo(contactPoint.x, contactPoint.y)
                    .lineTo(
                        contactPoint.x + normal.x * lineLength,
                        contactPoint.y + normal.y * lineLength,
                    )
                    .stroke()
                    // 畫一個小圓點代表接觸點
                    .circle(contactPoint.x, contactPoint.y, 4)
                    .fill(0xff0000);
            }

            // 檢查玩家是否與方塊碰撞
            const isPlayerHitBlock =
                (bodyA.label === "player" && bodyB.label === "block") ||
                (bodyA.label === "block" && bodyB.label === "player");

            if (isPlayerHitBlock) {
                // 判斷是否為踩在上面
                let isSteppingOn = false;
                const dot = pair.collision.normal.y; // 你的觀測值：player 是 A 且在上面時，dot 為 -1

                if (bodyA.label === "player") {
                    // 根據你的回饋：bodyA 是 player 且在上面時 dot 為 -1
                    if (dot < -0.5) isSteppingOn = true;
                }
                if (bodyB.label === "block") {
                    bodyB.needFalling = true;
                }

                if (isSteppingOn) {
                    this.handleCollision(pair);
                } else {
                    this.gameOver(pair.collision.normal);
                }
            }
            this.player.isJumping = false;
        }
    }

    private handleCollision(pair: Matter.IPair) {
        const { bodyA, bodyB } = pair;
        const blockBody = (bodyA.label === "block" ? bodyA : bodyB);
        if (blockBody) {
            // 1.停止方塊 GSAP 位移
            if (blockBody.slideTween) {
                blockBody.slideTween.kill();
            }
            this.updateScore();
            // this.next();
        }
    }
    private updateScore() {
        this.updateState({ score: this.level -1 });
    }
    // 下一個
    private next() {
        if (this.state.isGameOver) return;

        this.level++;

        this.blockPairs.push(this.createBlock());
        this.updateScore();
    }
    // 開始遊戲
    public start() {
        this.updateState({ gameStarted: true, countdown: 10 });
        this.startSpawnTimer();
        this.blockPairs.push(this.createBlock());
    }
    // 結束遊戲
    public reset() {
        // 必須清除物理世界中的所有 Composite（身體、約束等）
        Matter.World.clear(this.world, false);
        Matter.Engine.clear(this.engine);

        // 重置 Runner
        if (this.runner) {
            Matter.Runner.stop(this.runner);
        }

        this.stopSpawnTimer();

        this.gameContainer.removeChildren();

        this.level = 1;
        this.gameContainer.y = 0;
        this.blockPairs = [];
        gsap.globalTimeline.clear();

        // 重新初始化場景
        this.setupScene();

        // 重新啟動 Runner
        if (this.runner) {
            Matter.Runner.run(this.runner, this.engine);
        }

        // 重置狀態
        this.updateState({ score: 0, isGameOver: false, gameStarted: false, countdown: this.totalSeconds });
        if (this.timerHUD) this.timerHUD.update(this.totalSeconds);
    }

    public destroy() {
        if (this.app) {
            this.app.destroy(true, { children: true, texture: true });
        }
        if (this.runner) {
            Matter.Runner.stop(this.runner);
        }
        this.stopSpawnTimer();
        gsap.globalTimeline.clear();
    }
}