import { Sprite, AnimatedSprite, Texture, Assets, Container } from "pixi.js";
import { config } from "@/components/JumpClimbing/Config";
import Matter from "matter-js";
import { gsap } from "gsap";
import { LoaderManager } from "./LoaderManager";

export interface ICGRect {
    width: number;
    height: number;
    x: number;
    y: number;
}

export class JCPlayer extends Container {

    public view: AnimatedSprite;

    public dead: Sprite;

    public body: Matter.Body;

    // 用於紀錄原始縮放比例，防止動畫重置為 1 時導致大小變大
    private baseScale = { x: 1, y: 1 };

    public isJumping: boolean = false;

    public get graphics() {
        return this;
    }

    constructor() {
        super();
    }
    public async setup( world: Matter.World, frame: ICGRect) {
        // 1. 初始化物理身體
        this.body = this.createBody(frame);

        // 2. 初始化動畫精靈 (同步執行)
        this.view = await this.createSprite(frame);

        this.dead = this.createDead();

        // 紀錄設定完 width/height 後的實際 scale
        this.baseScale.x = this.view.scale.x;
        this.baseScale.y = this.view.scale.y;

        // 同步初始位置
        this.x = this.body.position.x;
        this.y = this.body.position.y;

        // 將精靈加入場景
        this.addChild(this.view);

        Matter.Composite.add(world, this.body);
    }

    private async createSprite(frame: ICGRect) {

        const loaderManager = LoaderManager.getInstance();
        let frames = [loaderManager.get('frog'), loaderManager.get('frog_move')];
        const sprite = new AnimatedSprite(frames);
        sprite.width = frame.width;
        sprite.height = frame.height;
        sprite.anchor.set(0.5);
        sprite.animationSpeed = 0.1;
        sprite.loop = false;
        sprite.onComplete = () => {
            sprite.currentFrame = 0;
        };
        return sprite;
    }

    private createDead() {
        const loaderManager = LoaderManager.getInstance();
        const dead = new Sprite(loaderManager.get('frog_dead'));
        dead.anchor.set(0.5);
        return dead;
    }

    private createBody(frame: ICGRect) {
        return Matter.Bodies.rectangle(frame.x, frame.y, frame.width, frame.height, {
            friction: 0.8,
            restitution: 0,
            inertia: Infinity, // 防止玩家滑倒或旋轉
            label: 'player'
        });
    }
    play() {
        this.view.play();
    }
    jump() {
        if (this.isJumping) return;

        this.isJumping = true;

        this.play();

        // 1. 物理衝量：向上跳躍
        Matter.Body.setVelocity(this.body, {
            x: this.body.velocity.x,
            y: -8, // 稍微增加一點力道感
        });
        // 2. 史萊姆彈性動畫
        // 先停止之前的動畫，避免快速連點時衝突
        gsap.killTweensOf(this.view.scale);

        const tl = gsap.timeline();
        // 使用相對於 baseScale 的比例進行動畫
        tl.to(this.view.scale, { x: this.baseScale.x * 1.4, y: this.baseScale.y * 0.6, duration: 0.05, ease: "power1.out" })   // 起跳擠壓
            .to(this.view.scale, { x: this.baseScale.x * 0.7, y: this.baseScale.y * 1.5, duration: 0.15, ease: "power2.out" })  // 騰空拉伸
            .to(this.view.scale, { x: this.baseScale.x, y: this.baseScale.y, duration: 0.6, ease: "elastic.out(1, 0.3)" }); // 恢復基準比例
    }

    fallout(bounceX: number) {
        // 1. 恢復慣性，讓玩家可以旋轉
        Matter.Body.setInertia(this.body, 1000);

        // 2. 切換視覺顯示：從 view (AnimatedSprite) 換成 dead (Sprite)
        if (this.view.parent) {
            this.removeChild(this.view);
        }

        // 確保 dead sprite 的尺寸與原本一致
        this.dead.width = this.view.width;
        this.dead.height = this.view.height;
        this.addChild(this.dead);

        Matter.Body.setVelocity(this.body, {
            x: bounceX,
            y: -12, // 向上噴發
        });
        Matter.Body.setAngularVelocity(this.body, bounceX * 0.05);
    }
    update() {

    }
}
