# Portfolio Command Center

A self-contained stock portfolio dashboard with live news, live prices, dividend tracking, multi-lot holdings, account management, cloud sync, and RSS feeds. Runs on GitHub Pages — zero build steps.

**Current Version: v0.5.0**

---

## Changelog

### v0.5.0 — 2026-04-17
- **"Broker" renamed to "Account"** throughout the entire UI — table headers, search bars, lot grids, add modal, deep-dive panels, mobile cards. Internal variable names unchanged for backward compat.
- **Accounts tab** — new tab showing all stocks grouped by account (e.g. Schwab, Ally, Fidelity). Each account card shows stock count, total value, annual income, and a grid of holdings with ticker, shares, value, and date added. Searchable by account name or ticker.
- **All Holdings tab now expandable** — click any row to expand and see lots + news, same as Dividends and Growth tabs. Edit lots directly from the All tab.
- **Smart Add Ticker** — adding a ticker that already exists at a *different* account automatically creates a new lot at that account. If the same ticker + same account already exists, shows a warning toast. If the ticker exists but no account/shares are specified, prompts you to add them to create a lot.
- **Lot timestamps** — every lot now records when it was added (`added` field). Visible in the Holdings by Lot grid as an "Added" column, and in the Accounts view per stock.
- **Settings tab** with three panels:
  - **Manage Accounts** — view all accounts, rename any account (updates all lots globally), add a new account, delete an account (clears label from lots but keeps shares).
  - **News Notifications** — enable/disable toast notifications when new articles arrive, mute/unmute sound, choose from 4 embedded sounds (Chime, Ding, Pop, Bell) with a Test button to preview.
  - **Data** — reset all local data.
- **Notification sounds** — 4 synthesized sounds using Web Audio API (no external files). Plays automatically when new news articles are fetched. Sound choice, mute state, and notification toggle saved to preferences (persists in localStorage and syncs to Firestore).
- **Enhanced toast notifications** — now supports success (green), warning (yellow), and error (red) types with descriptive messages for add/rename/delete actions.
- **Cloud sync updated** — preferences (notification settings, account list) sync to Firestore alongside portfolio data.

### v0.4.6 — 2026-04-17
- Add Ticker fixed (broker select crash), search on Dividends + Growth tabs

### v0.4.5 — 2026-04-17
- Panels stay open during edits

### v0.4.4 — 2026-04-17
- Multi-lot holdings, broker dropdown on Add modal

### v0.4.3 — 2026-04-16
- News wraps inside expanded rows

### v0.4.2 — 2026-04-16
- Live prices from Finnhub, broker dropdown

### v0.4.1 — 2026-04-16
- Next Total Payout column, Firebase + Finnhub keys

### v0.4.0 — 2026-04-15
- Firebase Google Auth + Firestore, live Finnhub news

### v0.3.0 — 2026-04-14
- Payout log, portfolio value fix, auto-save, mobile cards

### v0.2.0 — 2026-04-14
- Pure HTML, sortable tables, deep-dive panels, RSS

### v0.1.0 — 2026-04-14
- Initial build

---

## Deploy

```
v0.5.0.html    ← Main app
index.html     ← Redirects to v0.5.0.html
feed.xml       ← RSS feed
rss.xml        ← RSS alias
README.md      ← This file
```

Settings → Pages → Deploy from branch → main / root

---

## Firebase (stockfolio-96c95)

Config embedded. Console setup:

1. **Firestore Rules** → publish:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /portfolios/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```
2. **Auth → Google** → Enabled
3. **Auth → Authorized domains** → `itsavibecode.github.io`

---

## Data Model

### Lots
```
lots["AAPL"] = [
  { s: 100, b: "Schwab", added: "2026-04-17T14:30:00.000Z" },
  { s: 200, b: "Ally",   added: "2026-04-17T15:00:00.000Z" }
]
```

### Preferences
```
prefs = {
  notifEnabled: true,
  soundMuted: false,
  soundChoice: "chime",   // chime | ding | pop | bell
  accounts: ["Schwab", "Ally", "Fidelity"]
}
```

---

## Features

| Feature | Details |
|---------|---------|
| Accounts Tab | Stocks grouped by account with totals, searchable |
| Account Management | Rename, add, delete accounts in Settings |
| Smart Add | Existing ticker at new account → auto-creates lot; same account → warns |
| Lot Timestamps | "Added" date on every lot |
| Notification Sounds | 4 embedded Web Audio sounds, configurable in Settings |
| Multi-Lot Holdings | Multiple lots per stock with independent shares + account |
| Search (all tabs) | News, Dividends, Growth, Accounts |
| All Tab Expandable | Click rows to expand lots + news |
| Live Prices | Finnhub, cached 10 min |
| News Feed | Live Finnhub, searchable, sortable |
| Dividends | Deep-dive with lots, next total payout, news |
| Payout Log | Upcoming/past timeline |
| Sortable Tables | Click any column header |
| Auto-Save | localStorage + Firestore |
| Panels Stay Open | Editing doesn't collapse panels |
| RSS Feed | Auto-discovery + static feed files |
| Mobile | Card layout below 640px |
| Settings | Accounts, notifications, data management |

---

## Troubleshooting

**Lots not appearing:** Run `localStorage.removeItem('pf_lots')` in console, refresh.

**Notification sound not playing:** Click anywhere on the page first (browsers require user interaction before playing audio). Check Settings → News Notifications → not muted.

**Account rename not updating everywhere:** The rename function updates all lots globally. If cloud sync is enabled, sign out and back in to force a fresh sync.
