# Portfolio Command Center

A self-contained stock portfolio dashboard with live news, live prices, dividend tracking, cloud sync, and RSS feeds. Runs on GitHub Pages — zero build steps.

**Current Version: v0.4.2**

---

## Changelog

### v0.4.2 — 2026-04-16
- **Live stock prices from Finnhub** — the hardcoded stale prices were making Portfolio Value look off. Prices now fetch from Finnhub's `/quote` endpoint on page load, cache for 10 minutes, auto-refresh every 10 minutes, and update when a new ticker is added. Falls back to built-in prices if the API is unreachable.
- **Live price status indicator** under the Portfolio Value label — shows "● Prices live — [timestamp]" after a successful fetch.
- **Portfolio Value verified** — formula is strictly `Σ(price × shares)`; Annual Income is displayed separately. The apparent mismatch in v0.4.1 was caused by stale hardcoded prices, not the formula.
- **Broker dropdown** — clicking a broker cell now opens a dropdown listing every broker already used elsewhere in your portfolio, plus a "+ New broker..." option that swaps to a text input. Makes it trivial to apply the same broker to multiple stocks without retyping.

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
v0.4.2.html         ← Main app
index.html          ← Redirects root URL to v0.4.2.html
feed.xml            ← RSS feed
rss.xml             ← RSS feed alias
generate-feed.js    ← Regenerate RSS on news updates
README.md           ← This file
```

Keep older versions (`v0.4.1.html`, `v0.4.0.html`, etc.) around for history if you like.

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
API key already embedded. Free tier = 60 calls/min. The app staggers requests (4/sec) and caches for 10 min.

- **News**: `/company-news` endpoint per ticker
- **Prices**: `/quote` endpoint per ticker (returns current price, change, % change, day high/low, open, prev close)

---

## Features

| Feature | Details |
|---------|---------|
| Live Prices | Finnhub `/quote` on page load + every 10 min. Portfolio Value updates automatically. |
| News Feed | Live via Finnhub API, cached 10 min, auto-refresh. Searchable, sortable. |
| Dividends | Yield, annual div, next pay/share, Next Total Payout, pay date, rating, shares, broker, income/yr. |
| Growth Stocks | Separate view with share tracking, broker dropdown, and news. |
| Payout Log | Timeline of upcoming/past dividend payments with 90-day and annual projections. |
| All Holdings | Master table with dividend/growth badges. |
| Broker Dropdown | Click a broker cell — dropdown lists all brokers already used, with option to type a new one. |
| Sortable Tables | Click any column header to sort asc/desc. |
| Share Tracking | Click "edit" on any stock to set share count. Calculates value, next total payout, and income. |
| Auto-Save | Every change saves to localStorage + cloud if signed in. |
| Cloud Sync | Firebase Google Auth + Firestore. Sign in once, access everywhere. |
| RSS Feed | Auto-discovery `<link>` tag + static feed.xml/rss.xml files. |
| Mobile | Card-based layout below 640px. Tap to expand. |
| Desktop | Full sortable tables with expand/collapse detail rows. |
| Version Tracking | Version shown in header + footer. Changelog in this README. |

---

## Portfolio Value Math

Portfolio Value = Σ (live_price[ticker] × shares_owned[ticker]) for every ticker in the list.

Annual Income = Σ (annual_dividend[ticker] × shares_owned[ticker]) only for dividend-paying tickers.

The two numbers are calculated independently and never mixed. Any apparent discrepancy is due to price staleness, which v0.4.2 fixes with live Finnhub prices.
