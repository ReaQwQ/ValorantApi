const BaseController = require('./BaseController');
const Agent = require('../models/Agent');
const { RoleMapping } = require('../utils/constants');

/**
 * @class ContentController
 * @extends BaseController
 * @brief ゲームコンテンツを管理するコントローラー
 */
class ContentController extends BaseController {
    /**
     * @brief 利用可能なすべてのローカルAPIエンドポイントのヘルプ・一覧を取得する
     * @return {Promise<Object>} エンドポイントの一覧情報
     * @requires ローカルクライアントが起動していること
     */
    async getEndpoints() {
        return await this.api.handleLocalRequest("help").getJson();
    }

    /**
     * @brief ゲーム内のローカルコンテンツ情報（公式API）を取得する
     * @return {Promise<Object>} コンテンツ情報のJSONオブジェクト
     * @requires ValorantApiの初期化が完了していること
     */
    async getContent() {
        const header = {
            "Authorization": this.api.basePvpHeader["Authorization"],
            "X-Riot-Entitlements-JWT": this.api.basePvpHeader["X-Riot-Entitlements-JWT"],
            "X-Riot-ClientPlatform": this.api.clientPlatform,
            "X-Riot-ClientVersion": this.api.clientVersion
        };
        // sharedシャードでコンテンツを取得
        return await this.api.handlePvpRequest("content-service/v3/content", null, "shared", header).getJson();
    }

    /**
     * @brief 名前またはUUIDからエージェント情報を取得する
     * @params {string} nameOrUuid - 名前（例: 'Jett'）またはUUID
     * @return {Promise<Agent|null>} Agentモデルのインスタンス。見つからない場合はnull
     * @requires インターネット接続（非公式APIへのアクセス）
     */
    async getAgentFromName(nameOrUuid) {
        const content = await this.getContent();
        if (!content) return null;

        const isArr = Array.isArray(content);
        const agents = isArr ? content : (content.Characters || content.characters || []);

        const data = agents.find(a => {
            if (!a) return false;
            const name = a.Name || a.name || "";
            const id = a.ID || a.id || "";
            return name.toLowerCase() === nameOrUuid.toLowerCase() ||
                id.toLowerCase() === nameOrUuid.toLowerCase();
        });

        return data ? new Agent(data) : null;
    }

    /**
     * @brief 指定したカテゴリー（ロール）に属するエージェント一覧を取得する
     * @params {string} roleName - ロール名（例: Role.Duelist）
     * @return {Promise<Agent[]>} Agentモデルの配列
     * @requires インターネット接続（非公式APIへのアクセス）
     */
    async getAgentFromCategory(roleName) {
        const content = await this.getContent();
        if (!content) return [];

        const isArr = Array.isArray(content);
        const agentsData = isArr ? content : (content.Characters || content.characters || []);

        const characterIds = RoleMapping[roleName] || [];
        if (characterIds.length === 0) return [];

        const normalizedIds = characterIds.map(id => id.toLowerCase());
        return agentsData
            .filter(a => a && a.ID && normalizedIds.includes(a.ID.toLowerCase()))
            .map(data => new Agent(data));
    }
}

module.exports = ContentController;
