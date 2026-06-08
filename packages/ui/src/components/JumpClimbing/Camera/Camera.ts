import * as PIXI from "pixi.js";


export default class Camera {

    viewport: PIXI.Container;
    screenWidth: number;
    screenHeight: number;

    constructor(screenWidth: number, screenHeight: number) {
        this.viewport = viewport;
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
    }
    public setViewPort(view: PIXI.Container) {
        this.viewport = view;
    }
    public focus(target: PIXI.Container) {
        // 計算目標在螢幕上的絕對 Y 座標
        const playerScreenY = target.y + this.viewport.y;

        const followRate = {
            top: 0.4,
            bottom: 0.6
        };

        // 1. 向上跟隨：當玩家跳過螢幕上方 40% 處
        if (playerScreenY < this.screenHeight * followRate.top) {
            const diff = (this.screenHeight * followRate.top) - playerScreenY;
            this.viewport.y += diff * 0.1;
        } 
        // 2. 向下跟隨：當玩家掉落低於螢幕 60% 處
        else if (playerScreenY > this.screenHeight * followRate.bottom) {
            const diff = playerScreenY - (this.screenHeight * followRate.bottom);
            this.viewport.y -= diff * 0.1;
        }

        // 3. 限制：不允許捲動到地板以下
        if (this.viewport.y < 0) this.viewport.y = 0;
    }
}
