# @reaqwq/valorantapi

[日本語のREADMEはこちら](README.ja.md)

An unofficial, native JavaScript (Node.js) library for communicating directly with a locally running Valorant client and Riot's PvP APIs.

Automatically authenticates via the Valorant `lockfile`, so there is no manual credential setup — just call `init()` and start making API calls.

## Features

- **Automatic Auth** — Detects the Riot lockfile, parses the session, and sets up all required headers automatically.
- **Fully Async** — Every endpoint is an `async/await` Promise.
- **Color Logger** — Built-in `INFO / SUCCESS / WARN / ERROR` logger for clean terminal output.
- **MVC Controllers** — Logically separated modules: `account`, `match`, `party`, `pregame`, `store`, `content`, `system`, `chat`.
- **FocusManager** — Polls the active window (via `active-win`) and fires a callback when Valorant gains or loses focus.
- **Electron Overlay** — Ships with a ready-to-run transparent always-on-top Electron overlay (`overlay.js` + `overlay.html`).

## Installation

```bash
npm install @reaqwq/valorantapi
```

## Quick Start

> Valorant must be running on your local machine before calling `init()`.

```javascript
const ValorantApi = require('@reaqwq/valorantapi');

const api = await ValorantApi.init();
const puuid = await api.account.getCurrentPlayerPuuid();
ValorantApi.Logger.success(`My PUUID: ${puuid}`);
```

## API Reference

### Account (`api.account`)
| Method | Description |
|---|---|
| `getCurrentPlayer()` | Get your Riot account info |
| `getCurrentPlayerPuuid()` | Get your PUUID |
| `getAccountXP(puuid)` | Get player XP |
| `getPlayerLoadout(puuid)` | Get weapon / banner loadout |
| `getPlayerMmr(puuid)` | Get rank and MMR data |
| `getPlayerRestrictions()` | Get account penalties |

### Party & Matchmaking (`api.party`)
| Method | Description |
|---|---|
| `getCurrentParty()` | Get current party state |
| `partyInvite(displayName)` | Invite a player (e.g. `"Jett#001"`) |
| `setPlayerReady(state)` | Set ready state (`true`/`false`) |
| `joinQueue()` | Enter matchmaking queue |

### Pregame & Agent Select (`api.pregame`)
| Method | Description |
|---|---|
| `getPregamePlayer(puuid)` | Get pregame match info |
| `pregameSelectCharacter(matchId, agentId)` | Hover an agent |
| `pregameLockCharacter(matchId, agentId)` | Lock in an agent |

### Match History (`api.match`)
| Method | Description |
|---|---|
| `getCurrentMatchInfo(matchId)` | Get live match data |
| `getMatchHistory(puuid)` | Get match history list |
| `getMatchDetails(matchId)` | Get post-game result details |

### Content (`api.content`)
| Method | Description |
|---|---|
| `getAgentFromName(name)` | Find an agent by name |
| `getAgentFromCategory(role)` | List agents by role (`Role.Duelist`, etc.) |

### Store (`api.store`)
| Method | Description |
|---|---|
| `getStorefront(puuid)` | Get daily shop offers |
| `getWallet(puuid)` | Get VP and Radianite balances |

### System & Chat (`api.system` / `api.chat`)
| Method | Description |
|---|---|
| `getRegion()` | Get client region |
| `getClientVersion()` | Get current game patch version |
| `getFriends()` | Get friends list |
| `sendMessage(message, cid)` | Send a chat message |

## FocusManager

Detects when Valorant has window focus. Uses `active-win` — no shell spawning.

```javascript
const { FocusManager } = require('@reaqwq/valorantapi');

const fm = new FocusManager();
fm.start((isFocused) => {
    console.log(isFocused ? 'Valorant focused' : 'Backgrounded');
}).setInterval(1000); // poll every 1 second
```

## Electron Overlay

A transparent, borderless, always-on-top overlay window that displays player stats while Valorant is in focus.

**Files:**
- `overlay.js` — Electron main process. Initializes the API, loads player stats (name, rank, wins), and manages the FocusManager.
- `overlay.html` — The overlay UI. Receives data via Electron IPC.

**Run:**
```bash
npm run overlay
```

The overlay automatically:
1. Loads your player name and rank from the MMR API.
2. Shows when Valorant is in focus, hides when backgrounded.
3. Is fully click-through (does not intercept game input).

## Examples

| File | Description |
|---|---|
| `examples/basic_usage.js` | Initialize and fetch your PUUID and game version |
| `examples/test_agent_helpers.js` | Query agents using MVC controllers |
| `examples/instalock_bot.js` | Experimental pregame agent auto-lock |

## Disclaimer

This is an unofficial personal project. It is not affiliated with or endorsed by Riot Games.
Use responsibly. Misuse (e.g. dodge tools, disruptive automation) may result in account bans. The developers hold no liability.
