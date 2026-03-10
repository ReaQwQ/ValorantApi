/**
 * overlay.js — Electron 透明オーバーレイ（メインプロセス）
 *
 * 使い方:
 *   npm run overlay
 *   npx electron overlay.js
 */

const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const { FocusManager, Logger } = require('./index');

// Valorant ランクティア番号 → 名称
const RANKS = [
    'Unranked', '', '',
    'Iron 1', 'Iron 2', 'Iron 3',
    'Bronze 1', 'Bronze 2', 'Bronze 3',
    'Silver 1', 'Silver 2', 'Silver 3',
    'Gold 1', 'Gold 2', 'Gold 3',
    'Platinum 1', 'Platinum 2', 'Platinum 3',
    'Diamond 1', 'Diamond 2', 'Diamond 3',
    'Ascendant 1', 'Ascendant 2', 'Ascendant 3',
    'Immortal 1', 'Immortal 2', 'Immortal 3',
    'Radiant'
];

let win = null;
let fm = null;

// ── renderer へ安全に送信 ──────────────────────────────────────
function send(channel, data) {
    if (win && !win.isDestroyed() && win.webContents) {
        win.webContents.send(channel, data);
    }
}

// ── オーバーレイウィンドウ作成 ─────────────────────────────────
function createWindow() {
    const { width } = screen.getPrimaryDisplay().bounds;

    win = new BrowserWindow({
        width: 320,
        height: 260,
        transparent: true,
        frame: false,
        alwaysOnTop: true,
        resizable: false,
        focusable: false,
        skipTaskbar: true,
        x: width - 340,
        y: 20,
        webPreferences: {
            // nodeIntegration:true により preload ファイル不要
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile(path.join(__dirname, 'overlay.html'));
    win.setIgnoreMouseEvents(true, { forward: true });
    win.on('closed', () => { win = null; });
    Logger.success('[Overlay] ウィンドウ起動');
}

// ── ValorantApi データ取得 ────────────────────────────────────
async function loadPlayerData(api) {
    try {
        const puuid = await api.account.getCurrentPlayerPuuid();
        if (!puuid) return;

        // プレイヤー名
        const player = await api.account.getCurrentPlayer();
        const acct = player?.acct || player;
        const name = (acct?.game_name && acct?.tag_line)
            ? `${acct.game_name}#${acct.tag_line}`
            : (player?.GameName && player?.TagLine)
                ? `${player.GameName}#${player.TagLine}`
                : 'Player';

        // ランク・勝利数 (MMR)
        const mmr = await api.account.getPlayerMmr(puuid);
        const tierNum = mmr?.LatestCompetitiveUpdate?.TierAfterUpdate ?? 0;
        const rank = RANKS[tierNum] || 'Unranked';

        const seasons = mmr?.QueueSkills?.competitive?.SeasonalInfoBySeasonID || {};
        const lastSeason = Object.values(seasons).sort((a, b) => b.SeasonID > a.SeasonID ? 1 : -1)[0];
        const wins = lastSeason?.NumberOfWins ?? '--';

        // K/D と HS% (マッチ履歴から計算、失敗時は '--')
        let kd = '--', hs = '--';
        try {
            const history = await api.match.getMatchHistory(puuid, 0, 10);
            const matches = history?.History || [];
            if (matches.length > 0) {
                let kills = 0, deaths = 0, head = 0, total = 0;
                await Promise.all(matches.slice(0, 5).map(async (m) => {
                    const d = await api.match.getMatchDetails(m.MatchID);
                    const me = d?.players?.find(p => p.subject === puuid);
                    if (!me?.stats) return;
                    kills += me.stats.kills || 0;
                    deaths += me.stats.deaths || 0;
                    head += me.stats.headshots || 0;
                    total += (me.stats.headshots || 0) + (me.stats.bodyshots || 0) + (me.stats.legshots || 0);
                }));
                if (deaths > 0) kd = (kills / deaths).toFixed(2);
                if (total > 0) hs = Math.round(head / total * 100);
            }
        } catch (_) { /* match-history が 400 の場合はスキップ */ }

        send('player-data', { name, rank, kd: String(kd), hs: String(hs), wins: String(wins) });
        Logger.success(`[Data] ${name} | ${rank} | ${wins}W | KD:${kd} HS:${hs}`);
    } catch (e) {
        Logger.warn('[Data] Failed: ' + e.message);
    }
}

// ── Electron 起動 ──────────────────────────────────────────────
app.whenReady().then(async () => {
    createWindow();

    // ValorantApi 初期化
    let api = null;
    try {
        // 先に did-finish-load リスナーを登録しておく（初期化完了前に発火する場合もある）
        let windowReady = false;
        let apiReady = false;
        const tryLoad = () => { if (windowReady && apiReady) loadPlayerData(api); };

        win.webContents.on('did-finish-load', () => { windowReady = true; tryLoad(); });

        api = await require('./index').init();
        Logger.success('[API] 初期化完了');
        apiReady = true;
        tryLoad(); // ウィンドウが既にロード済みなら即座に実行
    } catch (e) {
        Logger.warn('[API] Valorant が起動していないか初期化失敗: ' + e.message);
    }

    // FocusManager
    let lastFocus = null;
    fm = new FocusManager();
    fm.start((isFocused) => {
        if (isFocused === lastFocus || !win || win.isDestroyed()) return;
        lastFocus = isFocused;

        if (isFocused) {
            win.showInactive();
            win.setIgnoreMouseEvents(true, { forward: true });
        } else {
            win.hide();
        }
        send('focus-changed', { isFocused });
    }).setInterval(1000);
});

ipcMain.on('update-data', (_, data) => send('player-data', data));

app.on('window-all-closed', () => {
    if (fm) fm.stop();
    if (process.platform !== 'darwin') app.quit();
});
