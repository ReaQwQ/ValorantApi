const ValorantApi = require('./src/ValorantApi');
const Request = require('./src/network/Request');
const Logger = require('./src/utils/logger');
const { Character, Role } = require('./src/utils/constants');
const TrackerOverlay = require('./src/utils/TrackerOverlay');
const FocusManager = require('./src/utils/FocusManager');

/**
 * @brief エクスポートモジュール一覧
 */
module.exports = {
    /** 
     * @brief 初期化関数
     */
    init: async () => {
        return await ValorantApi.initFromLockfile();
    },
    ValorantApi,
    Request,
    Logger,
    Character,
    Role,
    TrackerOverlay,
    FocusManager
};
