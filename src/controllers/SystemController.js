const BaseController = require('./BaseController');

/**
 * @class SystemController
 * @extends BaseController
 * @brief システム・環境情報を管理するコントローラー
 */
class SystemController extends BaseController {
    /**
     * @brief ローカルAPIを利用して現在ログイン中のリージョン名を取得する
     * @return {Promise<string>} リージョン名（例: "ap", "eu"）
     * @requires ローカルクライアントが起動していること
     */
    async getRegion() {
        try {
            // 第一優先: プロダクトセッションから "-ares-deployment" を抽出
            const sessionRes = await this.api.handleLocalRequest("product-session/v1/external-sessions").getJson();
            const keys = Object.keys(sessionRes);

            for (const key of keys) {
                if (key === 'host_app') continue;
                const launchArgs = sessionRes[key].launchConfiguration.arguments;
                if (launchArgs && Array.isArray(launchArgs)) {
                    const deploymentArg = launchArgs.find(arg => arg.startsWith('-ares-deployment='));
                    if (deploymentArg) {
                        return deploymentArg.split('=')[1].toLowerCase();
                    }
                }
            }
        } catch (e) { }

        try {
            // 第二優先: Riotクライアントの地域設定
            const response = await this.api.handleLocalRequest("riotclient/region-locale").getJson();
            if (response && response.region) {
                return response.region.toLowerCase();
            }
        } catch (e) { }

        return "eu"; // デフォルト
    }

    /**
     * @brief クライアントバージョンを取得する
     * @return {Promise<string>} Valorantクライアントのバージョン文字列
     * @requires ローカルクライアントが起動していること（失敗時は非公式APIにフォールバック）
     */
    async getClientVersion() {
        try {
            const versionRes = await this.api.handleLocalRequest("riotclient/v1/version").getJson();
            if (versionRes && versionRes.errorCode) {
                throw new Error(versionRes.message || "Local version fetch failed");
            }
            return versionRes.version;
        } catch (e) {
            try {
                const axios = require('axios');
                const vApiRes = await axios.get("https://valorant-api.com/v1/version");
                return vApiRes.data.data.riotClientVersion || "";
            } catch (vErr) {
                return "";
            }
        }
    }
}

module.exports = SystemController;
