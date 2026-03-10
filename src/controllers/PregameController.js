const BaseController = require('./BaseController');

/**
 * @class PregameController
 * @extends BaseController
 * @brief プリゲーム（エージェント選択画面）管理用コントローラー
 */
class PregameController extends BaseController {
    /**
     * @brief 指定したプレイヤーのプリゲーム情報を取得する
     * @params {string} puuid - プレイヤーのPUUID
     * @return {Promise<Object>} プリゲーム（エージェント選択状態）の詳細情報
     * @requires ValorantApiの初期化が完了していること
     */
    async getPregamePlayer(puuid) {
        return await this.api.handlePvpRequest(`pregame/v1/players/${puuid}`).getJson();
    }

    /**
     * @brief 指定したエージェントを選択状態にする（ロックはしない）
     * @params {string} matchId - プリゲームのマッチID
     * @params {string} agentId - 選択したいエージェントのUUID
     * @return {Promise<Object>} レスポンス情報
     * @requires プリゲーム中であること、ValorantApiの初期化が完了していること
     */
    async pregameSelectCharacter(matchId, agentId) {
        return await this.api.handlePvpRequest(`pregame/v1/matches/${matchId}/select/${agentId}`).post({});
    }

    /**
     * @brief 指定したエージェントを確定（ロック）する
     * @params {string} matchId - プリゲームのマッチID
     * @params {string} agentId - ロックしたいエージェントのUUID
     * @return {Promise<Object>} レスポンス情報
     * @requires プリゲーム中であること、ValorantApiの初期化が完了していること
     */
    async pregameLockCharacter(matchId, agentId) {
        return await this.api.handlePvpRequest(`pregame/v1/matches/${matchId}/lock/${agentId}`).post({});
    }
}

module.exports = PregameController;
