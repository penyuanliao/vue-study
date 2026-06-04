import * as PIXI from "pixi.js";

export default class CountDownTimer extends PIXI.Container {
    private digits: PIXI.Sprite[] = [];
    private _seconds: number = 0;

    constructor() {
        super();
    }

    public set seconds(value: number) {
        if (this._seconds === value) return;
        this._seconds = Math.max(0, value);
        this.updateDisplay();
    }

    public get seconds(): number {
        return this._seconds;
    }

    private updateDisplay() {
        // 清除舊的數字
        this.removeChildren();
        this.digits = [];

        const str = this._seconds.toString();
        const loader = LoaderManager.getInstance();
        let currentX = 0;

        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            const texture = loader.get(`hud${char}`);
            if (texture) {
                const sprite = new PIXI.Sprite(texture);
                sprite.x = currentX;
                this.addChild(sprite);
                this.digits.push(sprite);
                currentX += sprite.width + 2; // 數字間距
            }
        }

        // 置中 Container
        this.pivot.x = this.width / 2;
    }

}