const Logger = require('./logger');

let activeWin;
try {
    activeWin = require('active-win');
} catch (e) {
    Logger.warn('[FocusManager] active-win が見つかりません。npm install active-win@8.2.1 を実行してください。');
}

/**
 * Valorantクライアントのウィンドウフォーカス状態を監視・検知するマネージャー
 */
class FocusManager {
    /**
     * @description FocusManagerのコンストラクタ
     * @params {Object|null} [api=null] - アプリケーション全体で使い回すAPIインスタンス (オプション)
     */
    constructor(api = null) {
        this.api = api;
        this.isFocused = false;
        this.intervalId = null;
        this.callback = null;
        this.pollingRate = 1000;
        Logger.info('FocusManager initialized.');
    }

    /**
     * @description フォーカス監視を開始する
     * @params {Function} onFocus - フォーカス状態が変化した際に呼ばれるコールバック (isFocused: boolean) => void
     * @returns {FocusManager} メソッドチェーン用のインスタンス
     */
    start(onFocus) {
        if (typeof onFocus !== 'function') {
            Logger.error('[FocusManager] start() にはコールバック関数を指定してください。');
            return this;
        }

        this.callback = onFocus;
        this._startPolling();
        Logger.success(`FocusManager started. ポーリング間隔: ${this.pollingRate}ms`);
        return this;
    }

    /**
     * @description ポーリング間隔を設定する。既に動いている場合は再起動する
     * @params {number} ms - ポーリング間隔 (ミリ秒)
     * @returns {FocusManager} メソッドチェーン用のインスタンス
     */
    setInterval(ms) {
        if (this.pollingRate === ms && this.intervalId) return this; // 同じレートの場合は何もしない
        this.pollingRate = ms;
        if (this.intervalId) {
            clearInterval(this.intervalId); // stop()を呼ばず直接クリア（ログを出さない）
            this.intervalId = null;
            if (this.callback) this._startPolling();
        }
        return this;
    }

    /**
     * @description フォーカス監視を停止する
     * @returns {FocusManager} メソッドチェーン用のインスタンス
     */
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            Logger.info('FocusManager stopped.');
        }
        return this;
    }

    /**
     * @description 内部ポーリングループを開始する
     */
    _startPolling() {
        this.intervalId = setInterval(async () => {
            const focused = await this._checkFocus();
            if (this.callback) this.callback(focused);
        }, this.pollingRate);
    }

    /**
     * @description active-win を使用してフォアグラウンドウィンドウを確認する
     * @returns {Promise<boolean>} Valorantがフォアグラウンドにあるかどうか
     */
    async _checkFocus() {
        if (!activeWin) return false;
        try {
            const win = await activeWin();
            if (!win) return false;
            const name = (win.owner && win.owner.name) ? win.owner.name : '';
            return name.toLowerCase().includes('valorant');
        } catch (e) {
            Logger.warn('[FocusManager] フォーカスチェック失敗:', e.message);
            return false;
        }
    }
}

module.exports = FocusManager;
