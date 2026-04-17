# Portfolio Command Center

**Current Version: v0.5.2**

---

## Changelog

### v0.5.2 — 2026-04-17
- **Fractional shares display fixed** — added `fmSh()` helper that rounds fractional shares to 2-4 decimal places instead of showing raw floating point like `169.95544999999998`. Applied everywhere: table cells, lot grids, payout log, accounts view, lot summaries.
- **Auto-fix missing stock data** — `recheckMissingData()` runs on every page load. Scans all tickers for missing sector or dividend data, re-fetches from Finnhub automatically. Stocks incorrectly placed under Growth (like ABT, COST, MCD, O, HSY, CVX, HD) will get their correct sector and dividend classification.
- **fetchProfile chained** — sector (profile2) and dividend (metric) API calls now run sequentially instead of parallel. Eliminates race condition where render fires before sector data arrives, causing stocks to show "—" for sector.
- **Payout Log compact redesign** — replaced fat padded cards with tight border-indicator rows. Colored left border (blue=upcoming, green=paid), inline ticker/date/amount/shares/total. 3x more entries visible on screen. Share counts properly rounded.
- **Shares formatted everywhere** — lot grid, payout log, accounts view, table summary all use `fmSh()` for clean display of fractional shares.

### v0.5.1 — 2026-04-17
- New stock classification via Finnhub, favicon, title with version
- Payout Log card layout, text size setting, theme switching
- Tax labels with hover tooltips, notifications enabled by default
- Recent news highlighting (past hour)

### v0.5.0 — 2026-04-17
- "Broker" → "Account", Accounts tab, Settings tab
- Smart add ticker, lot timestamps, notification sounds
- Account management, All tab expandable

### v0.4.x — 2026-04-15 to 2026-04-17
- Firebase + Finnhub, multi-lot holdings, panels stay open
- Search on all tabs, add ticker fix, news wrapping, live prices

### v0.1.0–v0.3.0 — 2026-04-14
- Initial build through payout log + mobile cards

---

## Deploy

```
v0.5.2.html    ← Main app
index.html     ← Redirects to v0.5.2.html
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

## Auto-Fix for Misclassified Stocks

On every page load, `recheckMissingData()` checks all tickers for missing sector data. If found, it re-fetches from Finnhub's `/stock/profile2` (sector) and `/stock/metric` (dividend yield, annual dividend, payout ratio) APIs. Results are cached in `pf_dv_custom` in localStorage.

**If stocks are still misclassified after a page load:**
1. Open browser console
2. Run: `localStorage.removeItem('pf_dv_custom')`
3. Refresh — the app will re-fetch all non-builtin stock data from Finnhub

**Manual trigger:** You can also force a recheck by running `recheckMissingData()` in the console.

---

## Fractional Shares

The app now properly handles fractional shares (common with M1 Finance, Robinhood, etc.):
- Shares ≥ 100: shown to 2 decimals (e.g., `169.96`)
- Shares ≥ 10: shown to 3 decimals (e.g., `43.271`)
- Shares < 10: shown to 4 decimals (e.g., `2.3912`)
- Whole shares: shown as integers (e.g., `100`)

---

## Troubleshooting

**Stocks showing under wrong tab (Growth vs Dividend):** Wait 10-15 seconds after page load for the auto-fix to run. If still wrong, clear custom data: `localStorage.removeItem('pf_dv_custom')` then refresh.

**Payout log shows old floating-point numbers:** Hard refresh (Ctrl+Shift+R) to clear cached version.

**Sector showing "—":** Finnhub may not have data for very small or new tickers. The sector will show "—" until data is available.
