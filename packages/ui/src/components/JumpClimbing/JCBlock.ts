import { Container, Sprite, Assets, Texture, Graphics } from "pixi.js";
import { config } from "@/components/JumpClimbing/Config";
import Matter from "matter-js";
import { gsap } from "gsap";
import { LoaderManager } from "./LoaderManager";

export interface IMatterBody extends Matter.Body {
    slideTween?: gsap.core.Tween;
    needFalling?: boolean;
}
export default class JCBlock extends Container {

    // public view: Sprite;
    public body: IMatterBody;

    public isFrozen: boolean = false;

    constructor(num: number = 1) {
        super();
        this.createBlock(num);
    }

    async createBlock(num: number = 1) {
        // 先清空舊的子物件
        this.removeChildren();

        const TILE_SIZE = 32;
        const assets = LoaderManager.getInstance();

        // 計算總寬度與起始偏移量，確保 (0,0) 是方塊的中心
        const totalTiles = num + 2;
        const totalWidth = totalTiles * TILE_SIZE;
        const startX = -(totalWidth / 2) + (TILE_SIZE / 2);

        // 1. 左側邊緣
        const leftTex = assets.get('grassLeft');
        if (leftTex) {
            const left = new Sprite({
                texture: leftTex,
                width: TILE_SIZE,
                height: TILE_SIZE,
                anchor: 0.5,
                x: startX
            });
            this.addChild(left);
        }

        // 2. 中間區塊 (根據 num 數量重複)
        const midTex = assets.get('grassMid');
        if (midTex) {
            for (let i = 0; i < num; i++) {
                const mid = new Sprite({
                    texture: midTex,
                    width: TILE_SIZE,
                    height: TILE_SIZE,
                    anchor: 0.5,
                    x: startX + (i + 1) * TILE_SIZE
                });
                this.addChild(mid);
            }
        }

        // 3. 右側邊緣
        const rightTex = assets.get('grassRight');
        if (rightTex) {
            const right = new Sprite({
                texture: rightTex,
                width: TILE_SIZE,
                height: TILE_SIZE,
                anchor: 0.5,
                x: startX + (num + 1) * TILE_SIZE
            });
            this.addChild(right);
        }
        
        // 因為內容已經相對於 (0,0) 對稱，所以不需要設定 Pivot
        // 或者如果你希望這個 Container 的 (0,0) 就是物理中心的 position，保持 pivot 為 0 即可
        this.pivot.set(0, 0);
    }
    setupPhysics(world: Matter.World, { x, y }: { x: number, y: number }) {
        this.body = Matter.Bodies.rectangle(
            x,
            y,
            this.width,
            this.height,
            {
                friction: 0.8,      // 增加摩擦力
                restitution: 0,    // 保持 0，確保完全不反彈（像硬木頭）
                density: 0.001,
                frictionStatic: 1, // 增加靜態摩擦力，讓堆疊更穩
                frictionAir: 0.0,  // 大幅降低空氣阻力，消除果凍漂浮感
                isStatic: false, // 無重力無碰撞
                gravityScale: { x: 0, y: 0 },
                label: 'block',
            }
        );
        this.isFrozen = true;
        Matter.Composite.add(world, this.body);
    }
    slideIn(startX: number, targetX: number, duration: number = 2) {
        // 建議：使用一個 Proxy 物件來做動畫，避免直接操作 Matter 內部的 position 向量
        const animPos = { x: startX };
        this.body.slideTween = gsap.to(animPos, {
            x: targetX,
            duration,
            ease: "power2.out",
            onUpdate: () => {
                // 透過 setPosition 更新，這會強制 Matter.js 更新廣度搜尋的 Bounds
                // 這樣玩家才能在方塊移動過程中準確撞到它
                Matter.Body.setPosition(this.body, { x: animPos.x, y: this.body.position.y });
            },
        });
    }
    public update() {
        const { body } = this;

        // 要讓他懸空
        if (this.isFrozen) {
            body.force.x = 0;
            body.force.y = 0;
            body.torque = 0;
            Matter.Body.setVelocity(body, { x: 0, y: -0.2 });
            Matter.Body.setAngularVelocity(body, 0);
        }

        this.x = this.body.position.x;
        this.y = this.body.position.y;
        this.rotation = this.body.angle;
    }

}