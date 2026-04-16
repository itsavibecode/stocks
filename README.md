# Portfolio Command Center

A self-contained stock portfolio dashboard with live news, live prices, dividend tracking, cloud sync, and RSS feeds. Runs on GitHub Pages — zero build steps.

**Current Version: v0.4.3**

---

## Changelog

### v0.4.3 — 2026-04-16
- **News wraps inside expanded rows** — previously, long headlines, summaries, and URLs inside expanded news rows (on the News tab) and inside the Dividend deep-dive panels could push the row's content horizontally, causing side-scroll within the table. Fixed with proper CSS: expanded rows now use `white-space:normal`, `word-break:break-word`, and `overflow-wrap:anywhere` on all child text nodes so the content flows downward and wraps cleanly to the full row width.
- **Long URLs break gracefully** — article links with long URLs now break at any character boundary instead of extending the table width.
- **Expanded panel constrained to row width** — the detail panel (`.xp`) is now `box-sizing:border-box` with `width:100%` and `max-width:100%` so nested content cannot overflow.

### v0.4.2 — 2026-04-16
- Live stock prices from Finnhub `/quote` endpoint — portfolio value now uses live prices instead of stale hardcoded ones
- Portfolio value formula verified: `Σ(price × shares)` — no income mixed in
- Broker dropdown — clicking broker cell shows list of previously-used brokers + "New broker..." option
- Live price status indicator under Portfolio Value label

### v0.4.1 — 2026-04-16
- Next Total Payout column on Dividends table (`next_pay_per_share × shares`)
- Next Total Payout in deep-dive panel and mobile card
- Firebase config populated (stockfolio-96c95)
- Finnhub API key populated for live news

### v0.4.0 — 2026-04-15
- Firebase Google Auth + Firestore cloud sync
- Live news via Finnhub API with 10-minute auto-refresh
- News refresh button and live/fallback status indicator
- Version number displayed in header bar and footer
- Versioned filenames (v0.4.0.html instead of index.html)
- Broker column verified across all views
- Mobile + desktop verified with card layout below 640px

### v0.3.0 — 2026-04-14
- Dividend payout log with upcoming/past timeline
- Portfolio value separated from annual income
- News in deep-dive slide-down panels
- Broker column on all tables
- Auto-save on every modification with toast notification
- Mobile card layout at 640px breakpoint

### v0.2.0 — 2026-04-14
- Converted from React/JSX to pure HTML for GitHub Pages
- Sortable table headers
- Time published under dates
- Deep-dive as slide-down panels (replaced card grid)
- Share tracking for growth stocks
- News slide-down with article summaries and source links
- RSS feed files (feed.xml, rss.xml)

### v0.1.0 — 2026-04-14
- Initial React JSX build (not compatible with GitHub Pages)
- Core portfolio with 23 tickers
- Dividend vs growth separation
- Basic news feed and RSS

---

## Deploy to GitHub Pages

### Files to upload to repo root:

```
v0.4.3.html         ← Main app
index.html          ← Redirects root URL to v0.4.3.html
feed.xml            ← RSS feed
rss.xml             ← RSS feed alias
generate-feed.js    ← Regenerate RSS on news updates
README.md           ← This file
```

Keep older versions around for history if you like.

### Enable GitHub Pages:
1. Settings → Pages
2. Source: Deploy from branch
3. Branch: main, folder: / (root)
4. Save — live at `https://itsavibecode.github.io/<repo-name>/`

---

## Active Configuration

### Firebase (stockfolio-96c95)
Config already embedded. Required Firebase Console setup:

1. **Firestore Database → Rules tab** → paste and publish:
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
2. **Authentication → Sign-in method → Google** → Enabled
3. **Authentication → Settings → Authorized domains** → add `itsavibecode.github.io`

### Finnhub (Live News + Live Prices)
API key already embedded. Free tier = 60 calls/min. The app staggers requests and caches for 10 min.

- **News**: `/company-news` endpoint per ticker
- **Prices**: `/quote` endpoint per ticker

---

## Features

| Feature | Details |
|---------|---------|
| Live Prices | Finnhub `/quote` on page load + every 10 min. Portfolio Value updates automatically. |
| News Feed | Live via Finnhub API, cached 10 min, auto-refresh. Searchable, sortable. Expands downward with wrapped text. |
| Dividends | Yield, annual div, next pay/share, Next Total Payout, pay date, rating, shares, broker, income/yr. Deep-dive with news that wraps cleanly. |
| Growth Stocks | Separate view with share tracking, broker dropdown, and news. |
| Payout Log | Timeline of upcoming/past dividend payments with 90-day and annual projections. |
| All Holdings | Master table with dividend/growth badges. |
| Broker Dropdown | Click broker cell — dropdown lists all brokers already used + "New broker..." option. |
| Sortable Tables | Click any column header to sort asc/desc. |
| Share Tracking | Click "edit" on any stock to set share count. Calculates value, next total payout, and income. |
| Auto-Save | Every change saves to localStorage + cloud if signed in. |
| Cloud Sync | Firebase Google Auth + Firestore. Sign in once, access everywhere. |
| RSS Feed | Auto-discovery `<link>` tag + static feed.xml/rss.xml files. |
| Mobile | Card-based layout below 640px. Tap to expand. |
| Desktop | Full sortable tables with expand/collapse detail rows that wrap text. |
| Version Tracking | Version shown in header + footer. Changelog in this README. |

---

## Text Wrapping Behavior (v0.4.3)

When you expand a row (News tab or Dividend row), the detail panel now:
- Wraps all text to the row's full width (no horizontal overflow)
- Breaks long URLs at any character so article links never push the layout
- Constrains itself with `max-width:100%` and `box-sizing:border-box`
- Uses `overflow-wrap:anywhere` so even pathological long words wrap cleanly

The main row data (ticker, price, yield, etc.) remains `nowrap` so columns stay aligned, but anything inside the expanded detail panel flows naturally downward.
