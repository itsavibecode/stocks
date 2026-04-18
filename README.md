# Portfolio Command Center

**Current Version: v0.5.7**

---

## Changelog

### v0.5.7 — 2026-04-18
- **Dividend Portfolio Value card** — new summary card at the top of the Dividends tab showing the total value of dividend-paying stocks only (Σ price × shares for dividend tickers). Sits alongside Annual Income, Monthly Avg, Stock Count, and Avg Yield.
- **Payout Log card grid redesign** — replaced flat row layout with a proper card grid (`grid-template-columns: repeat(auto-fill, minmax(260px, 1fr))`). Each payout entry is now a styled card with:
  - Ticker name (16px bold) + date block (right-aligned, month/day + year)
  - Large payout total (20px bold, green for paid / blue for upcoming)
  - Per-share amount + shares detail line
  - Footer with UPCOMING/PAID badge and account badges
  - Cards grouped by month with `.pl-grid` containers
  - Responsive: single column below 640px

### v0.5.6 — 2026-04-18
- Import/Export portfolio as JSON in Settings
- Per-stock ↻ refresh button in expanded panels
- Custom Finnhub API key in Settings (syncs to cloud)
- Recheck priority: critical missing data first
- API key loaded at init before any fetches

### v0.5.5 — 2026-04-18
- "↻ Recheck Stocks" button on Dividends/Growth tabs
- News sorting by full datetime
- Default lot dates (4/16/2026)
- Account dividend summary boxes

### v0.5.4 — 2026-04-17
- Payout log spacing, tax labels cleanup, orange tax panel, API error log

### v0.5.3 — 2026-04-17
- News highlighting, tax in Dividends only, SLV/GLD handling

### v0.5.2 — 2026-04-17
- Fractional shares, auto-fix, fetchProfile chained

### v0.5.1 — 2026-04-17
- Stock classification, favicon, theme, text size

### v0.5.0 — 2026-04-17
- Accounts, Settings, notifications, smart add

### v0.4.x — 2026-04-15–17
- Firebase, Finnhub, multi-lot, search, live prices

---

## Deploy

```
v0.5.7.html    ← Main app
index.html     ← Redirects to v0.5.7.html
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
