const fs = require('fs');
const path = require('path');

/**
 * @brief ローカルで実行中のRiotクライアントのlockfile（認証情報ファイル）をパースする
 * @dependencies process.env, path.join, fs.readFileSync
 * @return {Object} パースされたロックファイルの情報（プロセス名、PID、ポート番号、パスワード等のオブジェクト）
 * @throws {Error} ロックファイルが見つからないか読み取れない場合
 */
function parseLockfile() {
    const localAppData = process.env.LOCALAPPDATA || (process.platform == 'win32' ? path.join(process.env.USERPROFILE, 'AppData', 'Local') : '');
    const lockfilePath = path.join(localAppData, 'Riot Games', 'Riot Client', 'Config', 'lockfile');

    let lockFileContent = null;
    try {
        lockFileContent = fs.readFileSync(lockfilePath, 'utf8');
    } catch (e) {
        throw new Error(`ロックファイルが読み込めませんでした: ${lockfilePath}。ローカルでValorantが起動しているか確認してください。`);
    }

    const riotClientParams = lockFileContent.split(":");
    return {
        raw: lockFileContent,
        name: riotClientParams[0],
        pid: riotClientParams[1],
        port: riotClientParams[2],
        password: riotClientParams[3],
        protocol: riotClientParams[4]
    };
}

module.exports = { parseLockfile };
