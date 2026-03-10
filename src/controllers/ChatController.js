const BaseController = require('./BaseController');

/**
 * @class ChatController
 * @extends BaseController
 * @brief チャット管理用コントローラー
 */
class ChatController extends BaseController {
    /**
     * @brief フレンドリストを取得する
     * @return {Promise<Object>} フレンド一覧情報のJSONオブジェクト
     * @requires ローカルクライアントが起動していること
     */
    async getFriends() {
        return await this.api.handleLocalRequest("chat/v4/friends").getJson();
    }

    /**
     * @brief メッセージを送信する
     * @params {string} message - 送信するテキストメッセージ
     * @params {string} cid - 送信先チャットの部屋ID（Conversation ID）
     * @return {Promise<Object>} メッセージ送信リクエストのレスポンス
     * @requires ローカルクライアントが起動していること
     */
    async sendMessage(message, cid) {
        return await this.api.handleLocalRequest("chat/v1/messages").post({ message, cid });
    }
}

module.exports = ChatController;
