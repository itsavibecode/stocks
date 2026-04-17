# Portfolio Command Center

**Current Version: v0.5.3**

---

## Changelog

### v0.5.3 — 2026-04-17
- **News highlighting fixed** — rewrote time comparison logic. Was comparing "2:34 PM" strings to ISO format (broken). Now properly parses AM/PM times to epoch milliseconds. Articles from the past hour get accent-colored background with left border on the first cell.
- **Tax labels moved to Dividends only** — removed from News tab. Now shows ⚠ tag next to ticker in Dividends table rows and in the deep-dive panel. Tax Form and Tax Note fields added to the deep-dive data grid.
- **SLV, GLD, and commodity ETFs** — added hardcoded detection for commodity/precious metal ETFs (SLV, GLD, IAU, PPLT, USO, UNG, DBA, DBC, PDBC). These bypass Finnhub (which returns no data for trusts) and get classified immediately with proper sector ("Precious Metals", "Energy Commodities", etc.) and tax warnings (K-1 / collectible 28% rate).
- **Tax info expanded** — SLV and GLD now show "1099-B / K-1" with collectible tax rate warning. USO shows K-1 partnership warning.
- **Shares formatted in deep-dive** — the Shares field in the dividend deep-dive grid now uses `fmSh()` for clean display.

### v0.5.2 — 2026-04-17
- Fractional shares display fixed (fmSh helper)
- Auto-fix missing stock data on page load
- fetchProfile chained (sector then dividends)
- Payout Log compact redesign

### v0.5.1 — 2026-04-17
- Stock auto-classification via Finnhub, favicon, title with version
- Payout Log card layout, text size, theme switching
- Tax labels, notifications enabled by default, recent news highlight

### v0.5.0 — 2026-04-17
- "Broker" → "Account", Accounts tab, Settings tab
- Smart add ticker, lot timestamps, notification sounds

### v0.4.x — 2026-04-15 to 2026-04-17
- Firebase + Finnhub, multi-lot holdings, panels stay open
- Search, add ticker fix, news wrapping, live prices

### v0.1.0–v0.3.0 — 2026-04-14
- Initial build through payout log + mobile cards

---

## Deploy

```
v0.5.3.html    ← Main app
index.html     ← Redirects to v0.5.3.html
feed.xml       ← RSS feed
rss.xml        ← RSS alias
README.md      ← This file
```

**IMPORTANT:** After deploying, do a hard refresh (Ctrl+Shift+R or Cmd+Shift+R) to clear the browser cache. The payout log redesign and other visual changes won't appear if the old version is cached.

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

## Commodity ETFs

These tickers are handled specially since Finnhub doesn't return profile/metric data for trust-structured ETFs:

| Ticker | Sector | Tax Form | Note |
|--------|--------|----------|------|
| SLV | Precious Metals | 1099-B / K-1 | Collectible 28% max rate |
| GLD | Precious Metals | 1099-B / K-1 | Collectible 28% max rate |
| IAU | Precious Metals | 1099-B | Collectible 28% max rate |
| PPLT | Precious Metals | 1099-B / K-1 | Collectible rate, may issue K-1 |
| USO | Energy Commodities | K-1 | Partnership, issues K-1 not 1099 |

---

## Tax Labels

Tax tags appear **only on the Dividends tab** — both in the table row (next to ticker) and inside the expanded deep-dive panel as "Tax Form" and "Tax Note" fields.

Stocks with non-standard tax situations show a ⚠ warning tag:
- **REITs** (VICI) — return of capital in Box 3
- **Foreign** (BP) — claim foreign tax credit Form 1116
- **Commodity ETFs** (SLV, GLD) — collectible rate, K-1
- **Spin-offs** (RTX) — check cost basis adjustments
- **Growth-only** (TSLA, NET, AMZN) — 1099-B capital gains only

Hover the tag for details.

---

## Troubleshooting

**Payout log still looks old:** Hard refresh (Ctrl+Shift+R). The browser may be caching the previous version's HTML.

**Stocks still under wrong tab:** Run in console:
```javascript
localStorage.removeItem('pf_dv_custom');
```
Then hard refresh. Auto-fix will re-fetch from Finnhub.

**SLV/GLD showing "—" for sector:** These are now hardcoded. If still showing "—", hard refresh to load v0.5.3.

**News not highlighting:** The highlight only applies to articles published within the last 60 minutes of the current time. If no articles are that recent, no highlighting will appear — this is expected.
