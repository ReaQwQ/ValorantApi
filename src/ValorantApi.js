const axios = require('axios');
const Request = require('./network/Request');
const { parseLockfile } = require('./utils/lockfile');
const Logger = require('./utils/logger');
const { Character, Role } = require('./utils/constants');

// コントローラーのインポート
const AccountController = require('./controllers/AccountController');
const ContentController = require('./controllers/ContentController');
const SessionController = require('./controllers/SessionController');
const MatchController = require('./controllers/MatchController');
const PartyController = require('./controllers/PartyController');
const PregameController = require('./controllers/PregameController');
const StoreController = require('./controllers/StoreController');
const ChatController = require('./controllers/ChatController');
const SystemController = require('./controllers/SystemController');

/**
 * @brief Riot PVPネットAPIのベースURLを生成するヘルパー関数
 */
function genPvpBaseUrl(prefix = "pd", region = "eu") {
    return `https://${prefix}.${region}.a.pvp.net`;
}

/**
 * @brief ValorantApi メインクラス (MVCにおいて全体を統括する役割)
 */
class ValorantApi {
    /**
     * @params {string} ip - ローカルサーバーのIPアドレス
     * @params {number|string} port - ローカルサーバーのポート番号
     * @params {string} password - 認証用パスワード
     */
    constructor(ip, port, username, password) {
        this.baseUrl = `https://${ip}:${port}`;
        this.authToken = Buffer.from(`${username}:${password}`).toString('base64');
        this.localHeader = { 'Authorization': `Basic ${this.authToken}` };

        // コントローラーの初期化 (MVCモデル式)
        this.system = new SystemController(this);
        this.account = new AccountController(this);
        this.content = new ContentController(this);
        this.session = new SessionController(this);
        this.match = new MatchController(this);
        this.party = new PartyController(this);
        this.pregame = new PregameController(this);
        this.store = new StoreController(this);
        this.chat = new ChatController(this);

        Logger.info(`APIクライアントをポート [${port}] で生成しました`);
    }

    /**
     * @brief 認証セッションを確立し、クライアント情報を初期化する
     */
    async init() {
        Logger.info("APIの認証セッションを初期化しています...");

        try {
            this.region = await this.system.getRegion();
            this.pvpBaseUrl = genPvpBaseUrl("pd", this.region);
            this.clientVersion = await this.system.getClientVersion();

            const authInfo = await this.session.getAuthInfo();
            this.basePvpHeader = {
                "Authorization": "Bearer " + authInfo[0],
                "X-Riot-Entitlements-JWT": authInfo[1],
                "Content-Type": "application/json",
                "X-Riot-ClientVersion": this.clientVersion
            };

            const puuid = await this.account.getCurrentPlayerPuuid();
            const sessionInfo = await this.session.getSession(puuid);

            if (sessionInfo && sessionInfo.clientPlatformInfo && Object.keys(sessionInfo.clientPlatformInfo).length > 0) {
                this.clientPlatform = Buffer.from(JSON.stringify(sessionInfo.clientPlatformInfo)).toString('base64');
            } else {
                // 標準的なPCプラットフォーム情報をデフォルト値として使用
                const defaultPlat = {
                    platformType: "PC",
                    platformOS: "Windows",
                    platformOSVersion: "10.0.19042.1.256.64bit",
                    platformChipset: "Unknown"
                };
                this.clientPlatform = Buffer.from(JSON.stringify(defaultPlat)).toString('base64');
            }

            Logger.success(`初期化完了！ [リージョン: ${this.region}] [バージョン: ${this.clientVersion || "取得失敗"}]`);
            return this;
        } catch (error) {
            Logger.error("APIの初期化中にエラーが発生しました", error.message);
            throw error;
        }
    }

    handleLocalRequest(suffix) {
        return new Request(this.baseUrl + "/" + suffix, this.localHeader);
    }

    handlePvpRequest(suffix, region = null, prefix = null, header = null) {
        header = header || this.basePvpHeader;
        const targetRegion = region || this.region || "eu";
        const base = genPvpBaseUrl(prefix || "pd", targetRegion);
        return new Request(base + "/" + suffix, header);
    }

    static async initFromLockfile() {
        Logger.info("Lockfileのパースを開始します...");
        const lockFile = parseLockfile();
        Logger.success("Lockfileのパースに成功しました");

        const api = new ValorantApi("127.0.0.1", lockFile.port, "riot", lockFile.password);
        return await api.init();
    }
}

// 互換性のためのロガー紐付け
ValorantApi.Logger = Logger;
ValorantApi.Character = Character;
ValorantApi.Role = Role;

module.exports = ValorantApi;
