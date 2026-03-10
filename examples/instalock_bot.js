const ValorantApi = require('../index');
const { Character } = require('../index');

/**
 * @brief インスタロックボットの動作例（プリゲーム情報を定期的に監視し、強制的にエージェントを選択するロジック）
 */
async function main() {
    ValorantApi.Logger.info("インスタロックボットの例を起動中...");
    ValorantApi.Logger.warn("警告: 実戦の対戦マッチでこのインスタロックスクリプトを絶対に使用しないでください。");

    try {
        // Init関数を呼ぶだけで、自動的にLockfileのパースからAPIインスタンスの生成まで完了します
        const api = await ValorantApi.init();

        const puuid = await api.getCurrentPlayerPuuid();
        ValorantApi.Logger.info(`ユーザーの PUUID: ${puuid}`);
        ValorantApi.Logger.info("対戦（プリゲーム）が開始されるのを待機しています...");

        // プリゲームでMatchIDが見つかるまで待機する
        let matchIdFound = false;
        while (!matchIdFound) {
            try {
                const pregame = await api.getPregamePlayer(puuid); // Method name might vary based on your implementation
                if (pregame.MatchID) {
                    matchIdFound = true;
                    ValorantApi.Logger.success(`マッチに遭遇しました！ マッチID: ${pregame.MatchID}`);
                }
            } catch (e) {
                // まだプリゲームに入っていないことによるAPIエラーを無視して続行する
            }
            // 1秒に1回ポーリング
            await new Promise(r => setTimeout(r, 1000));
        }

        // ここで特定のエージェント（例：Jett）を即座に名乗る/ロックする
        const agentId = Character.Jett;
        ValorantApi.Logger.info(`エージェントID [${agentId}] をロックします...`);

        // 注: ここでのメソッド名は実際の実装に合わせてください
        await api.pregameSelectCharacter(matchIdFound, agentId);
        await api.pregameLockCharacter(matchIdFound, agentId);

        ValorantApi.Logger.success("エージェントのロックに成功しました！");

    } catch (e) {
        ValorantApi.Logger.error("エラーが発生しました。Valorantがローカルで起動していることを確認してください。");
        ValorantApi.Logger.error(e.message);
    }
}

main();
