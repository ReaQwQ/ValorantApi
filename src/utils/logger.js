/**
 * @brief 美しいCLI出力用のカスタムカラーロガー
 */
class Logger {
    /**
     * @brief 現在の時間を `[HH:MM:SS]` 形式で取得する
     * @return {string} フォーマットされた時間文字列
     */
    static getTimeStamp() {
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        const ss = String(now.getSeconds()).padStart(2, '0');
        return `[${hh}:${mm}:${ss}]`;
    }

    /**
     * @brief INFOレベルのログを出力する (水色)
     * @params {...any} args - 出力するメッセージやオブジェクト
     */
    static info(...args) {
        console.log(`\x1b[90m${this.getTimeStamp()}\x1b[0m \x1b[36mINFO\x1b[0m`, ...args);
    }

    /**
     * @brief WARNレベルのログを出力する (黄色)
     * @params {...any} args - 出力するメッセージやオブジェクト
     */
    static warn(...args) {
        console.warn(`\x1b[90m${this.getTimeStamp()}\x1b[0m \x1b[33mWARN\x1b[0m`, ...args);
    }

    /**
     * @brief SUCCESSレベルのログを出力する (緑色)
     * @params {...any} args - 出力するメッセージやオブジェクト
     */
    static success(...args) {
        console.log(`\x1b[90m${this.getTimeStamp()}\x1b[0m \x1b[32mSUCCESS\x1b[0m`, ...args);
    }

    /**
     * @brief ERRORレベルのログを出力する (赤色)
     * @params {...any} args - 出力するメッセージやオブジェクト
     */
    static error(...args) {
        console.error(`\x1b[90m${this.getTimeStamp()}\x1b[0m \x1b[31mERROR\x1b[0m`, ...args);
    }
}

module.exports = Logger;
