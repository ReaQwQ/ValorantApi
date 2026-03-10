const ValorantApi = require('../index');

/**
 * @brief 基本的なAPI機能の使用方法を検証するテストプログラム
 */
async function main() {
    try {
        // Init関数を呼ぶだけで、自動的にLockfileのパースからAPIインスタンスの生成まで完了します
        const api = await ValorantApi.init();

        ValorantApi.Logger.info(`現在のリージョン: ${api.region}`);
        ValorantApi.Logger.info(`クライアントバージョン: ${api.clientVersion}`);

        // 現在のプレイヤーIDを取得 (AccountController経由)
        const puuid = await api.account.getCurrentPlayerPuuid();
        ValorantApi.Logger.success(`自分のプレイヤー PUUID: ${puuid}`);

    } catch (e) {
        ValorantApi.Logger.error("テストに失敗しました。（備考: このテストを通過させるには、ローカル環境でValorantを起動している必要があります）");
        ValorantApi.Logger.error(e.message);
    }
}

main();
