# @reaqwq/valorantapi

[Read this in English](README.md)

ローカルで実行中のValorantクライアントおよびRiot PvP APIと直接通信するための、JavaScript（Node.js）による非公式・ネイティブAPIライブラリです。

Valorantの `lockfile` から自動的に認証を行うため、資格情報の手動設定は不要です。`init()` を呼ぶだけで即座に利用できます。

## 機能

- **自動認証** — Riot lockfileを検知し、セッションをパースして必要なヘッダーを自動設定します。
- **完全非同期設計** — すべてのエンドポイントが `async/await` の Promise です。
- **カラーロガー** — `INFO / SUCCESS / WARN / ERROR` の色付きコンソール出力を標準搭載。
- **MVCコントローラー** — `account`, `match`, `party`, `pregame`, `store`, `content`, `system`, `chat` に論理分割。
- **FocusManager** — `active-win` でアクティブウィンドウをポーリングし、Valorantのフォーカス状態変化を検知します。
- **Electronオーバーレイ** — 透明・枠なし・常時最前面のElectronオーバーレイが同梱（`overlay.js` + `overlay.html`）。

## インストール

```bash
npm install @reaqwq/valorantapi
```

## クイックスタート

> `init()` を呼ぶ前にValorantが起動している必要があります。

```javascript
const ValorantApi = require('@reaqwq/valorantapi');

const api = await ValorantApi.init();
const puuid = await api.account.getCurrentPlayerPuuid();
ValorantApi.Logger.success(`自分のPUUID: ${puuid}`);
```

## APIリファレンス

### アカウント (`api.account`)
| メソッド | 説明 |
|---|---|
| `getCurrentPlayer()` | 自分のRiotアカウント情報を取得する |
| `getCurrentPlayerPuuid()` | 自分のPUUIDを取得する |
| `getAccountXP(puuid)` | プレイヤーのXP情報を取得する |
| `getPlayerLoadout(puuid)` | 武器・バナー等のロードアウトを取得する |
| `getPlayerMmr(puuid)` | ランク・MMR情報を取得する |
| `getPlayerRestrictions()` | アカウントのペナルティ情報を取得する |

### パーティー・マッチメイキング (`api.party`)
| メソッド | 説明 |
|---|---|
| `getCurrentParty()` | 現在のパーティー状態を取得する |
| `partyInvite(displayName)` | プレイヤーを招待する（例: `"Jett#001"`） |
| `setPlayerReady(state)` | Readyの状態を変更する（`true`/`false`） |
| `joinQueue()` | マッチメイキングキューに入る |

### プリゲーム・エージェント選択 (`api.pregame`)
| メソッド | 説明 |
|---|---|
| `getPregamePlayer(puuid)` | プリゲームの情報を取得する |
| `pregameSelectCharacter(matchId, agentId)` | エージェントをホバーする |
| `pregameLockCharacter(matchId, agentId)` | エージェントをロックする |

### 試合データ・履歴 (`api.match`)
| メソッド | 説明 |
|---|---|
| `getCurrentMatchInfo(matchId)` | 進行中の試合情報を取得する |
| `getMatchHistory(puuid)` | 試合履歴リストを取得する |
| `getMatchDetails(matchId)` | 試合のリザルト詳細を取得する |

### コンテンツ (`api.content`)
| メソッド | 説明 |
|---|---|
| `getAgentFromName(name)` | 名前からエージェント情報を検索する |
| `getAgentFromCategory(role)` | ロールからエージェント一覧を取得する（`Role.Duelist` 等） |

### ストア (`api.store`)
| メソッド | 説明 |
|---|---|
| `getStorefront(puuid)` | 日替わりショップを取得する |
| `getWallet(puuid)` | VP・レディアナイト残高を取得する |

### システム・チャット (`api.system` / `api.chat`)
| メソッド | 説明 |
|---|---|
| `getRegion()` | クライアントのリージョンを取得する |
| `getClientVersion()` | 現在のゲームパッチバージョンを取得する |
| `getFriends()` | フレンドリストを取得する |
| `sendMessage(message, cid)` | チャットメッセージを送信する |

## FocusManager

Valorantがウィンドウフォーカスを持っているかをネイティブに検知します（`active-win` 使用、シェル起動なし）。

```javascript
const { FocusManager } = require('@reaqwq/valorantapi');

const fm = new FocusManager();
fm.start((isFocused) => {
    console.log(isFocused ? 'Valorant フォーカス中' : 'バックグラウンド');
}).setInterval(1000); // 1秒ごとにポーリング
```

## Electron オーバーレイ

Valorantがフォーカスされている間、プレイヤー統計情報を表示する透明・枠なし・常時最前面のオーバーレイです。

**ファイル構成:**
- `overlay.js` — Electronメインプロセス。APIを初期化し、プレイヤー情報（名前・ランク・勝利数）を取得してFocusManagerを管理します。
- `overlay.html` — オーバーレイUI。Electron IPCでデータを受信します。

**起動:**
```bash
npm run overlay
```

オーバーレイは自動的に：
1. MMR APIからプレイヤー名とランクを取得して表示します。
2. Valorantフォーカス時に表示、バックグラウンド時に非表示になります。
3. クリックスルー対応（ゲームの入力を妨げません）。

## サンプルコード

| ファイル | 説明 |
|---|---|
| `examples/basic_usage.js` | PUUIDとゲームバージョンを取得するシンプルな例 |
| `examples/test_agent_helpers.js` | MVCコントローラーを使ったエージェント検索の例 |
| `examples/instalock_bot.js` | プリゲームでエージェントを自動ロックする実験的なスクリプト |

## 免責事項

このプロジェクトはあくまで個人開発の非公式APIであり、Riot Gamesに公式に承認されたものではありません。
**常識の範囲内で責任を持って使用してください。**
APIポリシー違反となる悪用（ドッジツール・迷惑なインスタロック自動化等）を行った場合、アカウントが永続バンされる可能性があります。利用に関するトラブルの一切の責任は負いかねます。
