const BaseController = require('./BaseController');
const Request = require('../network/Request');

/**
 * @brief プレイヤーアカウント情報を管理するコントローラー
 */
class AccountController extends BaseController {
    /**
     * @brief プレイヤーのアカウント制限情報を取得する
     */
    async getPlayerRestrictions() {
        return await this.api.handlePvpRequest("restrictions/v3/penalties").getJson();
    }

    /**
     * @brief 現在のプレイヤーの詳細情報（Riotアカウント情報）を取得する
     */
    async getCurrentPlayer() {
        const req = new Request("https://auth.riotgames.com/userinfo", this.api.basePvpHeader);
        return await req.getJson();
    }

    /**
     * @brief 現在のプレイヤーのPUUIDを取得する
     */
    async getCurrentPlayerPuuid() {
        const player = await this.getCurrentPlayer();
        return player.sub;
    }

    /**
     * @brief 指定したプレイヤーのアカウントXP情報を取得する
     */
    async getAccountXP(puuid) {
        return await this.api.handlePvpRequest(`account-xp/v1/players/${puuid}`).getJson();
    }

    /**
     * @brief 指定したプレイヤーのロードアウト情報を取得する
     */
    async getPlayerLoadout(puuid) {
        return await this.api.handlePvpRequest(`personalization/v2/players/${puuid}/playerloadout`).getJson();
    }

    /**
     * @brief 指定したプレイヤーのMMR情報を取得する
     */
    async getPlayerMmr(puuid) {
        const header = { ...this.api.basePvpHeader };
        header["X-Riot-ClientPlatform"] = this.api.clientPlatform;
        return await this.api.handlePvpRequest(`mmr/v1/players/${puuid}`, null, null, header).getJson();
    }
}

module.exports = AccountController;
