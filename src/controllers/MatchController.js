const BaseController = require('./BaseController');

/**
 * @class MatchController
 * @extends BaseController
 * @brief マッチ・対戦履歴を管理するコントローラー
 */
class MatchController extends BaseController {
    /**
     * @brief 進行中のマッチ情報を取得する
     * @params {string} matchId - 進行中のマッチのID
     * @return {Promise<Object>} コアゲーム（進行中）の詳細情報
     * @requires ValorantApiの初期化が完了していること
     */
    async getCurrentMatchInfo(matchId) {
        return await this.api.handlePvpRequest(`core-game/v1/matches/${matchId}`).getJson();
    }

    /**
     * @brief 指定したプレイヤーの対戦履歴を取得する
     * @params {string} puuid - 対戦履歴を取得したいプレイヤーのPUUID
     * @params {number} [startIndex=0] - 取得を開始するインデックス
     * @params {number} [endIndex=20] - 取得を終了するインデックス
     * @params {string} [queueId=""] - 特定のキュー（フィルタ）を指定
     * @return {Promise<Object>} プレイヤーの過去の対戦履歴リスト
     * @requires ValorantApiの初期化が完了していること
     */
    async getMatchHistory(puuid, startIndex = 0, endIndex = 20, queueId = "") {
        let url = `match-history/v1/players/${puuid}?startIndex=${startIndex}&endIndex=${endIndex}`;
        if (queueId) url += `&queue=${queueId}`;
        const header = { ...this.api.basePvpHeader, "X-Riot-ClientPlatform": this.api.clientPlatform };
        return await this.api.handlePvpRequest(url, null, null, header).getJson();
    }

    /**
     * @brief 特定のマッチ詳細を取得する
     * @params {string} matchId - 詳細を取得したいマッチのID
     * @return {Promise<Object>} マッチのリザルトなどを含む詳細情報
     * @requires ValorantApiの初期化が完了していること
     */
    async getMatchDetails(matchId) {
        const header = { ...this.api.basePvpHeader, "X-Riot-ClientPlatform": this.api.clientPlatform };
        return await this.api.handlePvpRequest(`match-details/v1/matches/${matchId}`, null, null, header).getJson();
    }
}

module.exports = MatchController;
