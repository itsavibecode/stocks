# Portfolio Command Center

**Current Version: v0.5.6**

---

## Changelog

### v0.5.6 — 2026-04-18
- **Import / Export** — Settings → Import/Export panel. Export saves tickers, lots, preferences, and custom stock data as a JSON file. Import restores everything from a backup file (confirms before replacing).
- **Recheck prioritization** — "↻ Recheck Stocks" now processes critical stocks first (missing sector/DV entry entirely), then secondary (missing dividend data). Uses 400ms spacing to avoid exhausting API. Shows progress toast with critical vs total count.
- **Per-stock refresh button** — every expanded panel now has a ↻ button in the upper-left of the Holdings by Lot section. Fetches fresh profile, price, and news for that specific ticker without touching other stocks.
- **API Key in Settings** — new "API Key" panel with input field, Save Key and Use Default buttons, status indicator. Custom key saves to preferences and syncs to Firestore with your Google account. When you sign in on another device, your key loads automatically.
- **API key loaded at init** — `loadApiKey()` runs before any Finnhub calls so a custom key is active from the first fetch.
- **Cloud sync loads prefs** — signing in now also loads your preferences (including API key, theme, text size, notification settings) from Firestore.

### v0.5.5 — 2026-04-18
- Recheck Stocks button on Dividends/Growth tabs
- Payout Log with date boxes and colored total boxes
- News sorting by full datetime, default lot dates, account dividend summaries

### v0.5.4 — 2026-04-17
- Payout log spacing fix, tax labels cleanup, orange tax panel, API error log

### v0.5.3 — 2026-04-17
- News highlighting, tax in Dividends only, SLV/GLD handling

### v0.5.2 — 2026-04-17
- Fractional shares, auto-fix, fetchProfile chained

### v0.5.1 — 2026-04-17
- Stock classification, favicon, theme, text size, recent news highlight

### v0.5.0 — 2026-04-17
- Accounts, Settings, notifications, smart add, "Broker" → "Account"

### v0.4.x — 2026-04-15–17
- Firebase, Finnhub, multi-lot, search, panels stay open, live prices

---

## Deploy

```
v0.5.6.html    ← Main app
index.html     ← Redirects to v0.5.6.html
feed.xml       ← RSS feed
rss.xml        ← RSS alias
README.md      ← This file
```

**Ctrl+Shift+R after deploying.**

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

## API Key Setup

### Using your own Finnhub key (recommended for heavy use):

1. Register free at [finnhub.io/register](https://finnhub.io/register)
2. Copy your API key from the dashboard
3. Go to Settings → API Key → paste key → Save Key
4. Key saves to your browser and syncs to your Google account via Firestore
5. When you sign in on another device, your key loads automatically

### Using the default shared key:
The app ships with a built-in key. Click "Use Default" in Settings to revert. The shared key has a 60 calls/min limit shared across all users.

---

## Import / Export

### Export
Settings → Import/Export → Export Portfolio. Downloads a `.json` file containing:
- All tickers
- All lots (shares, accounts, timestamps)
- Preferences (theme, text size, notifications, API key)
- Custom stock data (sectors, dividend info fetched from Finnhub)

### Import
Settings → Import/Export → Import Portfolio. Select a previously exported `.json` file. Confirms before replacing your current portfolio. After import, all data is immediately saved and synced.

---

## Per-Stock Refresh

When you expand any stock's detail panel, there's a ↻ button in the upper-left corner of the "Holdings by Lot" section. Click it to:
1. Re-fetch sector and dividend data from Finnhub `/stock/profile2` and `/stock/metric`
2. Re-fetch the current price from `/quote`
3. Re-fetch the latest news from `/company-news`

This uses 3 API calls for one stock instead of hundreds for a full recheck.

---

## Features

| Feature | Details |
|---------|---------|
| Import/Export | Full portfolio backup and restore as JSON |
| Per-Stock Refresh | ↻ button in each expanded panel |
| Custom API Key | Settings → save your own Finnhub key, syncs to cloud |
| Recheck Priority | Critical missing data first, then secondary |
| Accounts Tab | Stocks grouped by account with dividend summaries |
| Multi-Lot Holdings | Multiple lots per stock |
| Live Prices + News | Finnhub, cached 10 min |
| Tax Labels | ⚠ tags for REIT, foreign, K-1, collectible |
| Theme + Text Size | Dark/Light, Normal/Large/XL |
| Notification Sounds | 4 embedded sounds, configurable |
| Sortable Tables | All column headers |
| Auto-Save | localStorage + Firestore |
| Mobile | Card layout below 640px |
