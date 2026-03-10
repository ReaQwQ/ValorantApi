const BaseController = require('./BaseController');

/**
 * @class PartyController
 * @extends BaseController
 * @brief パーティー管理用コントローラー
 */
class PartyController extends BaseController {
    /**
     * @brief 現在のパーティー情報を取得する
     * @return {Promise<Object>} 現在参加しているパーティーの詳細情報
     * @requires ValorantApiの初期化が完了していること
     */
    async getCurrentParty() {
        const puuid = await this.api.account.getCurrentPlayerPuuid();
        return await this.api.handlePvpRequest(`parties/v1/players/${puuid}`).getJson();
    }

    /**
     * @brief プレイヤーをパーティーに招待する
     * @params {string} displayName - 招待するプレイヤーのRiot ID（例: "Player#NA1"）
     * @return {Promise<Object>} 招待リクエストのレスポンス
     * @requires ValorantApiの初期化が完了し、パーティーに属していること
     */
    async partyInvite(displayName) {
        const partyId = await this.getPartyId();
        const [name, tag] = displayName.split('#');
        return await this.api.handlePvpRequest(`parties/v1/parties/${partyId}/invites/name/${name}/tag/${tag}`, null, 'glz').post({});
    }

    /**
     * @brief 準備状態を変更する
     * @params {boolean} state - Ready状態にするかどうか（true/false）
     * @return {Promise<Object>} 状態変更リクエストのレスポンス
     * @requires ValorantApiの初期化が完了し、パーティーに属していること
     */
    async setPlayerReady(state) {
        const puuid = await this.api.account.getCurrentPlayerPuuid();
        const partyId = await this.getPartyId();
        return await this.api.handlePvpRequest(`parties/v1/parties/${partyId}/members/${puuid}/setReady`, null, 'glz').post({ ready: state });
    }

    /**
     * @brief 内部ヘルパー: パーティーIDを取得する
     * @return {Promise<string>} 現在のパーティーID
     * @requires ValorantApiの初期化が完了していること
     */
    async getPartyId() {
        const info = await this.getCurrentParty();
        return info.CurrentPartyID;
    }

    /**
     * @brief マッチメイキングのキューに入る
     * @return {Promise<Object>} キュー参加リクエストのレスポンス
     * @requires ValorantApiの初期化が完了し、パーティーに属していること
     */
    async joinQueue() {
        const partyId = await this.getPartyId();
        return await this.api.handlePvpRequest(`parties/v1/parties/${partyId}/matchmaking/join`, null, 'glz').post({});
    }
}

module.exports = PartyController;
