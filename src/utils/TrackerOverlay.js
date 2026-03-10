const Logger = require('./logger');

/**
 * @class TrackerOverlay
 * @brief Neutralino.jsを利用したトラッキング用オーバーレイウィンドウAPIクラス
 */
class TrackerOverlay {
    constructor() {
        this.initialized = false;
        this.windowId = null;
    }

    /**
     * @brief モジュールを初期化し、Neutralino環境のセットアップ等を行う
     * @return {TrackerOverlay} - メソッドチェーン用の自身のインスタンス
     */
    static init() {
        const instance = new TrackerOverlay();

        // Neutralinoがロードされているかどうかのガードチェック
        if (typeof Neutralino === 'undefined') {
            Logger.warn("[TrackerOverlay] Neutralino API is not accessible in this context. Ignore this if running outside Neutralino app.");
        } else {
            Logger.success("[TrackerOverlay] Initialized successfully.");
        }

        instance.initialized = true;
        return instance;
    }

    /**
     * @description オーバーレイウィンドウを作成・表示する。`overlay()`のエイリアスメソッド
     * @params {Object} [options={}] - ウィンドウ設定オプション
     * @params {boolean} [options.draggable=true] - ドラッグ可能にするか
     * @params {boolean} [options.focusable=false] - フォーカスを受け取るか
     * @params {number}  [options.opacity=1.0] - 透明度 (0.0～1.0)
     * @params {number}  [options.x=0] - X座標
     * @params {number}  [options.y=0] - Y座標
     * @params {number}  [options.width=320] - 幅
     * @params {number}  [options.height=220] - 高さ
     * @params {boolean} [options.alwaysOnTop=true] - 常に最前面
     * @params {boolean} [options.mouseTransparent=true] - クリックスルー
     * @params {boolean} [options.frame=false] - ウィンドウ枚を表示するか
     * @params {boolean} [options.resizable=false] - リサイズ可能か
     * @params {string}  [options.url='/overlay.html'] - 表示するHTMLパス
     * @return {Promise<TrackerOverlay>}
     * @requires TrackerOverlay.init() が事前に呼び出されていること
     */
    async createWindow(options = {}) {
        if (!this.initialized) {
            throw new Error('[TrackerOverlay] init() を先に呼び出してください。');
        }

        const o = {
            draggable: true,
            focusable: false,
            opacity: 1.0,
            x: 0,
            y: 0,
            width: 320,
            height: 220,
            alwaysOnTop: true,
            mouseTransparent: true,
            frame: false,
            resizable: false,
            url: '/overlay.html',
            ...options
        };

        try {
            if (typeof Neutralino !== 'undefined') {
                // Neutralino.js 環境下: 実際に新しいウィンドウを生成する
                await Neutralino.window.create(o.url, {
                    title: 'Valo Tracker Overlay',
                    width: o.width,
                    height: o.height,
                    x: o.x,
                    y: o.y,
                    alwaysOnTop: o.alwaysOnTop,
                    borderless: !o.frame,
                    resizable: o.resizable,
                    transparent: true,
                    hidden: false
                });
                Logger.success('[TrackerOverlay] createWindow() 成功');
            } else {
                Logger.info('[TrackerOverlay Mock] createWindow(): ' + JSON.stringify(o));
            }
        } catch (e) {
            Logger.error('[TrackerOverlay] createWindow() 失敗:', e);
        }

        return this;
    }

    /**
     * @description createWindow() のエイリアス
     * @params {Object} [options={}] - createWindow と同じ設定
     * @return {Promise<TrackerOverlay>}
     */
    async overlay(options = {}) {
        return this.createWindow(options);
    }

    /**
     * @brief オーバーレイの設定を後から更新する
     * @params {Object} options - 更新する設定
     * @params {number} [options.opacity] - 新しい透明度
     * @params {number} [options.x] - 新しいX座標
     * @params {number} [options.y] - 新しいY座標
     * @return {Promise<TrackerOverlay>}
     */
    async updateOverlay(options = {}) {
        if (!this.initialized) {
            throw new Error("[TrackerOverlay] Not initialized.");
        }

        try {
            if (typeof Neutralino !== 'undefined') {
                if (options.opacity !== undefined) {
                    // 透明度の設定（APIが存在する場合）
                    // C++ Extension等で実装する、または既存APIがあればそれを使う
                    Logger.info("[TrackerOverlay] update opacity to", options.opacity);
                }
                if (options.x !== undefined || options.y !== undefined) {
                    // ウィンドウ移動
                    // await Neutralino.window.move(options.x, options.y);
                    Logger.info("[TrackerOverlay] update position to", options.x, options.y);
                }
            } else {
                Logger.info("[TrackerOverlay Mock] updateOverlay called with: " + JSON.stringify(options));
            }
        } catch (e) {
            Logger.error("[TrackerOverlay] Failed to update overlay:", e);
        }

        return this;
    }
}

module.exports = TrackerOverlay;
