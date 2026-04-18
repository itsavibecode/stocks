# Portfolio Command Center

**Current Version: v0.5.5**

---

## Changelog

### v0.5.5 — 2026-04-18
- **Recheck Stocks button** — added "↻ Recheck Stocks" button on Dividends and Growth tabs. Manually triggers Finnhub profile + metric fetch for any stock with missing sector or dividend data. Shows toast with progress and completion count.
- **Expanded recheckMissingData** — now also rechecks non-builtin stocks that have yield=0 and rating "None"/"Unknown" (catches stocks that were added but Finnhub didn't return data on first try).
- **Payout Log redesigned with date boxes** — each entry now has a styled date box (rounded card showing month/day + year), plus a colored total box (green for paid, blue for upcoming) instead of flat inline text.
- **News sorting by date+time** — was only sorting by date string, so same-day articles were randomly ordered. Now sorts by full datetime (date + parsed AM/PM time) for proper chronological order.
- **Default lot dates** — lots without an `added` timestamp now show 4/16/2026 instead of "—" in the lot grid and accounts view.
- **Account dividend summary boxes** — top of Accounts tab shows a card per account with total annual dividends and average monthly income.
- **Auth bar shadow reduced** — backdrop blur reduced from 20px to 12px, padding tightened.

### v0.5.4 — 2026-04-17
- Payout log spacing fix, tax labels cleaned up (no more qualified dividends tags)
- Orange tax panel in deep-dive, API error log badge in header

### v0.5.3 — 2026-04-17
- News highlighting fixed, tax moved to Dividends only, SLV/GLD handling

### v0.5.2 — 2026-04-17
- Fractional shares display, auto-fix missing data, fetchProfile chained

### v0.5.1 — 2026-04-17
- Stock classification, favicon, theme/text size, recent news highlight

### v0.5.0 — 2026-04-17
- Accounts tab, Settings, notifications, smart add, "Broker" → "Account"

### v0.4.x — 2026-04-15–17
- Firebase, Finnhub, multi-lot, search, panels stay open, live prices

### v0.1–v0.3 — 2026-04-14
- Initial build through mobile cards

---

## Deploy

```
v0.5.5.html    ← Main app
index.html     ← Redirects to v0.5.5.html
feed.xml       ← RSS feed
rss.xml        ← RSS alias
README.md      ← This file
```

**Ctrl+Shift+R after deploying** to clear browser cache.

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

## Rechecking Stocks

If stocks are misclassified (dividend stock showing as Growth, or missing sector):

1. **Automatic:** `recheckMissingData()` runs on every page load for stocks with missing data
2. **Manual:** Click "↻ Recheck Stocks" on the Dividends or Growth tab
3. **Nuclear:** Run `localStorage.removeItem('pf_dv_custom')` in console, then refresh

The recheck fetches Finnhub `/stock/profile2` (sector) and `/stock/metric` (dividend yield, payout ratio) for each stock. Results are cached in `pf_dv_custom`.

---

## Troubleshooting

**Stocks still under wrong tab after recheck:** Finnhub may not have data for some tickers (OTC, very small companies, commodity trusts). These will stay as Growth with sector "—". SLV, GLD, IAU, PPLT, USO are handled specially via hardcoded detection.

**Payout log looks old:** Hard refresh (Ctrl+Shift+R). The new date-box layout won't appear if the browser is caching the old HTML.

**News out of order:** The sort now uses full datetime. If articles still seem out of order, they may have the same timestamp from Finnhub — this is a data quality issue on their end.
