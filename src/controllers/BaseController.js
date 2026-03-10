/**
 * @class BaseController
 * @brief すべてのコントローラーの基底クラス
 */
class BaseController {
    /**
     * @brief 初期設定としてAPIインスタンスを保持する
     * @params {ValorantApi} api - ValorantApi のメインインスタンス
     */
    constructor(api) {
        this.api = api;
    }
}

module.exports = BaseController;
