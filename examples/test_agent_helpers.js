const ValorantApi = require('../index');
const { Character, Role } = require('../index');

async function main() {
    try {
        const api = await ValorantApi.init();

        console.log("\n--- Testing MVC Controller Access ---");
        const puuid = await api.account.getCurrentPlayerPuuid();
        console.log("PUUID via Controller:", puuid);

        console.log("\n--- Testing Agent Model ---");
        // api.content 経由でエージェントを検索 (戻り値は Agent モデル)
        const jett = await api.content.getAgentFromName(Character.Jett);

        if (jett) {
            console.log(`エージェント名: ${jett.name}`);
            console.log(`エージェントID: ${jett.id}`);

            // モデルのメソッドを使用
            const isDuelist = jett.isRole(Role.Duelist);
            console.log(`デュエリスト判定: ${isDuelist ? "Yes" : "No"}`);
        } else {
            console.log("Jett が見つかりませんでした。");
        }

        console.log("\n--- Testing Search by Category ---");
        const duelists = await api.content.getAgentFromCategory(Role.Duelist);
        console.log(`デュエリストの数: ${duelists.length}`);
        if (duelists.length > 0) {
            console.log(`最初の1人: ${duelists[0].name}`);
        }

    } catch (e) {
        console.error("エラーが発生しました:", e.message);
    }
}

main();
