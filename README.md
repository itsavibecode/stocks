# Portfolio Command Center

A self-contained stock portfolio dashboard with live news, live prices, dividend tracking, multi-lot holdings, account management, cloud sync, and RSS feeds. Runs on GitHub Pages — zero build steps.

**Current Version: v0.5.1**

---

## Changelog

### v0.5.1 — 2026-04-17
- **New stock classification fixed** — adding a new ticker now fetches sector and dividend data from Finnhub `/stock/profile2` and `/stock/metric`. Dividend-paying stocks are classified correctly instead of defaulting to Growth. Custom data persists in localStorage.
- **Favicon** — inline SVG 📊 emoji favicon, no external file needed.
- **Title includes version** — browser tab shows "Portfolio Command Center v0.5.1".
- **Payout Log redesigned** — card-based layout with colored dot indicator, ticker, date, per-share amount, × shares, total payout, and status badge. Much cleaner and more readable.
- **News notifications show tickers** — toast now says "3 new articles: AAPL, MSFT, GOOG" instead of just a count.
- **Text size setting** — Normal / Large / Extra Large in Settings → Appearance. Scales all fonts.
- **Theme switching** — Dark / Light mode in Settings → Appearance. Full CSS variable swap.
- **Tax labels** — ⚠ tags next to tickers with special tax forms. REITs show return-of-capital warning, foreign stocks show Form 1116, growth-only stocks show 1099-B. Hover for tooltip with form name and note.
- **Sound notifications enabled by default** — new users start with notifications on.
- **Recent news highlighting** — articles from the past hour get accent-colored background in the News tab.
- **Expand/collapse confirmed** — clicking an already-open panel closes it (was already working, now documented).

### v0.5.0 — 2026-04-17
- "Broker" renamed to "Account" everywhere
- Accounts tab, Settings tab, smart add ticker, lot timestamps
- Notification sounds (4 embedded Web Audio), account management
- All Holdings tab expandable with lots

### v0.4.6 — 2026-04-17
- Add Ticker fixed, search on Dividends + Growth tabs

### v0.4.5 — 2026-04-17
- Panels stay open during edits

### v0.4.4 — 2026-04-17
- Multi-lot holdings

### v0.4.3 — 2026-04-16
- News text wrapping

### v0.4.2 — 2026-04-16
- Live prices, account dropdown

### v0.4.1 — 2026-04-16
- Next Total Payout, Firebase + Finnhub keys

### v0.4.0 — 2026-04-15
- Firebase, Finnhub news, versioned files

### v0.3.0 — 2026-04-14
- Payout log, mobile cards

### v0.2.0 — 2026-04-14
- Pure HTML, sortable tables, RSS

### v0.1.0 — 2026-04-14
- Initial build

---

## Deploy

```
v0.5.1.html    ← Main app
index.html     ← Redirects to v0.5.1.html
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

## New in v0.5.1

### Theme + Text Size
Settings → Appearance panel. Dark/Light mode and Normal/Large/Extra Large text. Preferences save to localStorage and sync to Firestore.

### Tax Labels
Stocks with special tax considerations show a ⚠ tag:
- **VICI** — REIT, may include return of capital (Box 3)
- **BP** — Foreign tax paid, claim credit on Form 1116
- **TSLA, NET, AMZN** — No dividends, 1099-B capital gains only
- **RTX** — Check for spin-off cost basis adjustments
- **RGR** — Variable dividends, special div may be non-qualified

Hover/tap the tag to see the form name and note. Tags only appear on stocks with non-standard tax situations.

### Stock Classification
New tickers auto-fetch from Finnhub:
- `/stock/profile2` → sector/industry
- `/stock/metric` → dividend yield, annual dividend, payout ratio

If the stock pays dividends, it's classified as Dividend with yield and payout info. Otherwise Growth. Data cached in localStorage as `pf_dv_custom`.

### Recent News
Articles published in the past hour get a highlighted accent-colored background in the News tab so they stand out from older articles.

---

## Features

| Feature | Details |
|---------|---------|
| Theme Switching | Dark / Light mode in Settings |
| Text Size | Normal / Large / Extra Large |
| Tax Labels | ⚠ tags with hover tooltips for special tax forms |
| Stock Auto-Classification | Finnhub fetches sector + dividend data for new tickers |
| Recent News Highlight | Past-hour articles get accent background |
| Accounts Tab | Stocks grouped by account |
| Account Management | Rename, add, delete in Settings |
| Smart Add | Existing ticker at new account → new lot |
| Lot Timestamps | "Added" date per lot |
| Notification Sounds | 4 embedded sounds, enabled by default |
| Multi-Lot Holdings | Multiple lots per stock |
| Search | News, Dividends, Growth, Accounts tabs |
| All Tab Expandable | Lots + news in detail panel |
| Live Prices | Finnhub, 10 min cache |
| Payout Log | Card-based layout, monthly grouping |
| Sortable Tables | All column headers |
| Auto-Save | localStorage + Firestore |
| Panels Stay Open | Edits don't collapse panels |
| RSS Feed | Auto-discovery + static files |
| Mobile | Card layout below 640px |
| Favicon | Inline SVG 📊 |

---

## Troubleshooting

**New stock shows as Growth when it pays dividends:** Finnhub may not return data for very new or obscure tickers. The profile fetch runs on add — if it fails, the stock defaults to Growth. Try removing and re-adding the ticker.

**Theme not applying:** Check Settings → Appearance. The theme preference saves in `pf_prefs` in localStorage. Clear prefs with the Data → Reset button if stuck.

**Tax tag not showing:** Tax tags only appear for stocks with non-standard situations (REITs, foreign, capital-gains-only). Standard qualified dividend stocks don't show a tag.
