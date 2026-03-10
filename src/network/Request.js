const axios = require('axios');
const https = require('https');
const Logger = require('../utils/logger');

/**
 * @brief Riot APIへ送信するためのHTTPリクエストを管理・処理するネットワークラッパークラス
 */
class Request {
    /**
     * @brief Requestインスタンスを初期化する
     * @params {string} url - 接続先の完全なURL
     * @params {Object|null} accessToken - デフォルトヘッダーへ適用する認証情報のオブジェクト
     * @dependencies axios, https
     */
    constructor(url, accessToken = null) {
        this.url = url;

        // Riotローカルサーバーの自己署名証明書によるエラーを無視するための設定
        this.client = axios.create({
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            }),
            validateStatus: () => true // 2xx系以外のステータスコードで例外を投げない
        });

        if (accessToken) {
            this.client.defaults.headers.common = { ...this.client.defaults.headers.common, ...accessToken };
        }
    }

    /**
     * @brief GETリクエストを送信し、JSON形式のレスポンスデータを取得する
     * @dependencies axios.get
     * @return {Promise<Object>} 受信したJSONデータ
     */
    async getJson() {
        try {
            const response = await this.client.get(this.url);
            return response.data;
        } catch (error) {
            Logger.error(`getJsonでの接続エラー (${this.url}):`, error.message);
            throw error;
        }
    }

    /**
     * @brief POSTリクエストを送信し、ステータスコードを返す
     * @params {Object|null} value - POSTボディとして送信するJSONデータ（オプション）
     * @dependencies axios.post
     * @return {Promise<number>} HTTPステータスコード
     */
    async post(value = null) {
        try {
            const response = value
                ? await this.client.post(this.url, value)
                : await this.client.post(this.url);
            return response.status;
        } catch (error) {
            Logger.error(`postでの接続エラー (${this.url}):`, error.message);
            throw error;
        }
    }

    /**
     * @brief PUTリクエストを送信し、ステータスコードを返す
     * @params {Object} value - PUTボディとして送信するJSONデータ
     * @dependencies axios.put
     * @return {Promise<number>} HTTPステータスコード
     */
    async put(value) {
        try {
            const response = await this.client.put(this.url, value);
            return response.status;
        } catch (error) {
            Logger.error(`putでの接続エラー (${this.url}):`, error.message);
            throw error;
        }
    }

    /**
     * @brief DELETEリクエストを送信し、ステータスコードを返す
     * @params {Object|null} value - DELETEボディとして送信するJSONデータ（オプション）
     * @dependencies axios.delete
     * @return {Promise<number>} HTTPステータスコード
     */
    async delete(value = null) {
        try {
            const config = value ? { data: value } : {};
            const response = await this.client.delete(this.url, config);
            return response.status;
        } catch (error) {
            Logger.error(`deleteでの接続エラー (${this.url}):`, error.message);
            throw error;
        }
    }
}

module.exports = Request;
