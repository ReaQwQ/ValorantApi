const BaseController = require('./BaseController');

/**
 * @class SessionController
 * @extends BaseController
 * @brief プレイヤーのセッション情報を管理するコントローラー
 */
class SessionController extends BaseController {
    /**
     * @brief プレイヤーの現在のセッション情報を取得する
     * @params {string} puuid - 情報を取得したいプレイヤーのPUUID
     * @return {Promise<Object>} セッション情報のJSONオブジェクト
     * @requires ValorantApiの初期化が完了していること
     */
    async getSession(puuid) {
        return await this.api.handlePvpRequest(`session/v1/sessions/${puuid}`, null, `glz-${this.api.region}-1`).getJson();
    }

    /**
     * @brief ローカルクライアントから認証用のアクセストークンとシークレットを取得する
     * @return {Promise<Array<string>>} [accessToken, token] の配列
     * @requires ローカルクライアントが起動していること
     */
    async getAuthInfo() {
        const response = await this.api.handleLocalRequest("entitlements/v1/token").getJson();
        return [response.accessToken, response.token];
    }
}

module.exports = SessionController;
