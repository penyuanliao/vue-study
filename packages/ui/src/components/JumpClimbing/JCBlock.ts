import { Container, Sprite, Assets, Texture, Graphics } from "pixi.js";
import { config } from "@/components/JumpClimbing/Config";
import Matter from "matter-js";
import { gsap } from "gsap";
import { LoaderManager } from "./LoaderManager";

export interface IMatterBody extends Matter.Body {
    slideTween?: gsap.core.Tween;
}
export default class JCBlock extends Container {

    // public view: Sprite;
    public body: IMatterBody;

    constructor() {
        super();
        this.createBlock();

    }
    async createBlock() {

        const TILE_SIZE = 32; // 定義目標尺寸為 32
        const assets = LoaderManager.getInstance();
        // 現在可以使用 Assets.get(alias) 或是 Texture.from(alias) 來讀取
        if (assets.has('grassLeft')) {
            const left = new Sprite({
                texture: Assets.get('grassLeft'),
                width: TILE_SIZE,
                height: TILE_SIZE,
                anchor: 0.5,
                x: -TILE_SIZE // 放在左邊 (-32)
            });
            this.addChild(left);
        }

        if (assets.has('grassMid')) {
            const mid = new Sprite({
                texture: Assets.get('grassMid'),
                width: TILE_SIZE,
                height: TILE_SIZE,
                anchor: 0.5,
                x: 0 // 放在中間 (0)
            });
            this.addChild(mid);
        }

        if (assets.has('grassRight')) {
            const right = new Sprite({
                texture: Assets.get('grassRight'),
                width: TILE_SIZE,
                height: TILE_SIZE,
                anchor: 0.5,
                x: TILE_SIZE // 放在右邊 (32)
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
                frictionAir: 0.01,  // 大幅降低空氣阻力，消除果凍漂浮感
                isStatic: true, // 無重力無碰撞
                label: 'block',
            }
        );
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

}