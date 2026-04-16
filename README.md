# Portfolio Command Center

A self-contained stock portfolio dashboard with live news, dividend tracking, cloud sync, and RSS feeds. Runs on GitHub Pages — zero build steps.

**Current Version: v0.4.1**

---

## Changelog

### v0.4.1 — 2026-04-16
- **Next Total Payout column** on Dividends table — calculates `next_payout_per_share × shares_owned` so you see the estimated dollar amount of your upcoming dividend check per stock at a glance. Sortable like every other column.
- **Next Total Payout in deep-dive** — added alongside per-share next pay in the expanded detail panel.
- **Next Total Payout in mobile card view** — shows in the summary portion of each card when shares are set.
- **Firebase config populated** — live Firestore cloud sync is active. Sign in with Google to sync across devices.
- **Finnhub API key populated** — live news pulls on page load and every 10 minutes from the Finnhub API.

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
v0.4.1.html         ← Main app
index.html          ← Redirects root URL to v0.4.1.html
feed.xml            ← RSS feed
rss.xml             ← RSS feed alias
generate-feed.js    ← Regenerate RSS on news updates
README.md           ← This file
```

Keep older versions (`v0.4.0.html`, `v0.3.0.html`, etc.) if you want to preserve a history of what shipped.

### Enable GitHub Pages:
1. Settings → Pages
2. Source: Deploy from branch
3. Branch: main, folder: / (root)
4. Save — live at `https://itsavibecode.github.io/<repo-name>/`

---

## Active Configuration

### Firebase (stockfolio-96c95)
The Firebase config is already embedded in `v0.4.1.html`. Cloud sync works out of the box once you publish the Firestore rules below and confirm your GitHub Pages domain is authorized.

**Required Firebase Console setup:**
1. Firestore Database → Rules tab → paste and publish:
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
2. Authentication → Sign-in method → Google → Enabled
3. Authentication → Settings → Authorized domains → add `itsavibecode.github.io`

### Finnhub Live News
API key is already embedded. News auto-fetches on page load if cache is older than 10 minutes. Free tier allows 60 calls/minute — the app staggers requests to stay well under.

---

## Features

| Feature | Details |
|---------|---------|
| News Feed | Live via Finnhub API, cached 10 min, auto-refresh. Searchable, sortable. Click rows to expand article + link. |
| Dividends | Yield, annual div, next pay/share, **Next Total Payout**, pay date, rating, shares, broker, income/yr. Deep-dive with 18 data points + news. |
| Growth Stocks | Separate view with share tracking, broker, and news in expand panel. |
| Payout Log | Timeline of upcoming/past dividend payments with 90-day and annual projections. |
| All Holdings | Master table of everything with dividend/growth badges. |
| Broker Column | Set broker per stock (Fidelity, Schwab, etc.) — shows on all views. |
| Sortable Tables | Click any column header to sort asc/desc. |
| Share Tracking | Click "edit" on any stock to set share count. Calculates value, next total payout, and income. |
| Auto-Save | Every change saves to localStorage instantly + cloud if signed in. |
| Cloud Sync | Firebase Google Auth + Firestore. Sign in once, access everywhere. |
| RSS Feed | Auto-discovery `<link>` tag + static feed.xml/rss.xml files. |
| Mobile | Card-based layout below 640px. Tap to expand. Scrollable tabs. |
| Desktop | Full sortable tables with expand/collapse detail rows. |
| Version Tracking | Version shown in header. Changelog in this README. |

---

## New in v0.4.1: Next Total Payout

The Dividends tab now has a column between "Next Pay" (per share) and "Pay Date". It shows the estimated total dollar amount you'll receive on the next payment date based on your share count.

- If you own **100 shares of KO** at a next payout of **$0.50/share**, the column shows **$50.00** on the pay date of **2026-07-01**.
- Updates instantly when you edit shares.
- Sortable — click the header to sort by upcoming payout size.
- Shown in green when shares are set, dash when not.
- Also visible in the deep-dive panel and mobile card.
