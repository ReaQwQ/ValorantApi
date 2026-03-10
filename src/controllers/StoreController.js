const BaseController = require('./BaseController');

/**
 * @class StoreController
 * @extends BaseController
 * @brief ストア・所持品管理用コントローラー
 */
class StoreController extends BaseController {
    /**
     * @brief 現在のショップフロント情報を取得する
     * @params {string} puuid - プレイヤーのPUUID
     * @return {Promise<Object>} ショップフロント（日替わりアイテムなど）の情報
     * @requires ValorantApiの初期化が完了していること
     */
    async getStorefront(puuid) {
        return await this.api.handlePvpRequest(`store/v2/storefront/${puuid}`).getJson();
    }

    /**
     * @brief ウォレットの残高を取得する
     * @params {string} puuid - プレイヤーのPUUID
     * @return {Promise<Object>} VPやレディアナイトの残高情報
     * @requires ValorantApiの初期化が完了していること
     */
    async getWallet(puuid) {
        return await this.api.handlePvpRequest(`store/v1/wallet/${puuid}`).getJson();
    }
}

module.exports = StoreController;
