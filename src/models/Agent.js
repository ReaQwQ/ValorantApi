/**
 * @brief エージェント情報を表すモデルクラス
 */
class Agent {
    /**
     * @params {Object} data - ContentService から取得した生データ
     */
    constructor(data) {
        this.id = data.ID;
        this.name = data.Name;
        this.assetName = data.AssetName;
    }

    /**
     * @brief 指定したロールに属しているか判定する
     * @params {string} roleName - Role.Duelist 等
     * @return {boolean}
     */
    isRole(roleName) {
        const { RoleMapping } = require('../utils/constants');
        const roleIds = RoleMapping[roleName] || [];
        return roleIds.some(id => id.toLowerCase() === this.id.toLowerCase());
    }

    /**
     * @brief 簡略化されたオブジェクトとして取得
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            assetName: this.assetName
        };
    }
}

module.exports = Agent;
