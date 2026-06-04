import { Assets, Container, TilingSprite, Texture } from "pixi.js";
import Matter from "matter-js";

/**
 * 地板類別
 */
export default class JCGround extends Container {

    public body!: Matter.Body;
    private view?: TilingSprite;

    constructor() {
        super();
    }

    public setup({ x, y }: { x: number, y: number }) {
        // 設定 Container 的中心點座標，與物理身體同步
        this.x = x;
        this.y = y;
    }

    public createGround(width: number, height: number) {
        let texture = Assets.get('grassMid');
        
        // 定義一個基準磁磚大小（例如 32），確保地面圖片比例與 JCBlock 一致
        const TILE_SIZE = 32;

        if (!texture) {
            console.warn("JCGround: 'grassMid' texture not found! Using white texture as fallback.");
            texture = Texture.WHITE; // 至少讓你看得到一個白色的區塊，方便除錯
        }

        // 使用 TilingSprite 來重複鋪滿草地纹理
        this.view = new TilingSprite({
            texture,
            width: width,
            height: height,
        });

        // 關鍵：設定 tileScale。
        // 如果圖片原始寬度是 64，TILE_SIZE 是 32，則縮放為 0.5
        if (texture && this.view) {
            this.view.tileScale.set(TILE_SIZE / texture.width, TILE_SIZE / texture.height);
        }

        // 將錨點設在中心，這樣視覺中心 (0,0) 就會是 Container 的中心
        this.view.anchor.set(0.5);
        this.addChild(this.view);
    }
    public setupPhysics(world: Matter.World,
                        { width, height, x, y }: { width: number, height: number, x: number, y: number }) {
        this.body = Matter.Bodies.rectangle(
            x,
            y,
            width,
            height,
            {
                isStatic: true,
                label: 'ground'
            }
        );
        console.log(world);
        Matter.Composite.add(world, this.body);
    }

    /**
     * 更新地板位置與紋理偏移，實現無限 X 軸效果
     * @param targetX 追隨的目標 X 座標（通常是玩家或鏡頭的 X）
     */
    public update(targetX: number) {
        // 1. 讓 Container 跟隨目標，確保它始終處於視野中心
        this.x = targetX;

        // 2. 同步更新物理身體的 X 座標，使其始終處於目標下方
        if (this.body) {
            Matter.Body.setPosition(this.body, { x: targetX, y: this.body.position.y });
        }

        // 3. 調整 TilingSprite 的 tilePosition，抵消 Container 的移動感
        // 這樣紋理看起來就像是固定在世界座標中
        if (this.view) {
            // 因為 tilePosition 是基於原始紋理像素的，所以需要除以 tileScale
            this.view.tilePosition.x = -targetX / this.view.tileScale.x;
        }
    }
}