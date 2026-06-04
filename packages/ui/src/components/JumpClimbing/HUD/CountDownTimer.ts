import * as PIXI from "pixi.js";

export default class CountDownTimer extends PIXI.Container {
    private text: PIXI.Text;

    constructor() {
        super();
        this.setupText();
    }

    private setupText() {
        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 48,
            fontWeight: 'bold',
            fill: '#ffffff',
            stroke: '#333333',
            // strokeThickness: 6,
            // dropShadow: true,
            dropShadowColor: '#000000',
            // dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 4,
        });

        this.text = new PIXI.Text({ text: "0", style });
        this.text.anchor.set(0.5);
        this.addChild(this.text);
    }

    /**
     * 更新顯示秒數
     * @param seconds 剩餘秒數
     */
    public update(seconds: number) {
        const displayValue = Math.max(0, Math.ceil(seconds));
        this.text.text = displayValue.toString();

        // 剩餘時間不多時的視覺提示 (例如低於 3 秒變紅)
        if (displayValue <= 3) {
            this.text.style.fill = '#ff4d4d'; 
            this.text.scale.set(1.2); // 稍微放大產生緊張感
        } else {
            this.text.style.fill = '#ffffff';
            this.text.scale.set(1);
        }
    }
}