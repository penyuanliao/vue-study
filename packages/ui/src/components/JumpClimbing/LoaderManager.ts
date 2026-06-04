import { Assets } from "pixi.js";
import { config } from "./Config";

export class LoaderManager {
    private static instance: LoaderManager;
    private _isReady: boolean = false;

    // 1. 私有化建構函式，防止外部使用 new Loader()
    private constructor() {}

    // 2. 提供靜態方法獲取實例
    public static getInstance(): LoaderManager {
        if (!LoaderManager.instance) {
            LoaderManager.instance = new LoaderManager();
        }
        return LoaderManager.instance;
    }

    public get isReady() {
        return this._isReady;
    }

    async preload(src: Record<string, string>[] = []) {
        if (this._isReady) return;

        try {
            // 這裡可以集中處理資源載入的邏輯
            const assets = [
                ...src,
                config.loader,
                config.grass
            ];
            for (let i = 0; i < assets.length; i++) {
                // 執行預載入
                await this.load(assets[i]);
            }
            this._isReady = true;
            console.log("Game assets preloaded successfully.");
        } catch (e) {
            console.error("Failed to preload assets:", e);
            throw e;
        }
    }
    // 解析檔案名稱並載入資源
    async load(urls: Record<string, string>) {
        // 使用 Promise.all 確保所有資源都載入完畢
        await Promise.all(Object.keys(urls).map(async key => {
            const path = urls[key];
            const fileName = path.match(/\/([^/]+)\.[^.]+$/)?.[1];
            if (fileName && !Assets.cache.has(fileName)) {
                await Assets.load({ alias: fileName, src: path });
            }
        }));
    }
    get(alias: string) {
        return Assets.get(alias);
    }
    has(alias: string) {
        return Assets.cache.has(alias);
    }
}