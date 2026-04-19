# Portfolio Command Center

**Current Version: v0.6.0**

---

## Changelog

### v0.6.0 — 2026-04-18
- **Annual Div calculated from yield × price** — when Finnhub returns `dividendYieldIndicatedAnnual` but `dividendsPerShareAnnual` is 0 (very common), the app now calculates the annual dividend per share from yield × current price. This fixes stocks like COST, SPGI, MA, TXRH, CP, MCO, INTU, CME that previously showed "$0" for Annual Div and Next Pay.
- **Dividend calendar looks backward too** — the `/stock/dividend` fetch now queries 6 months in the past AND 6 months in the future (was only forward). This gives much better data for calculating annual dividends from actual payment history rather than estimates.
- **Annual div from actual history** — if Finnhub returns real dividend payments, the app sums them to calculate the true annual dividend. If only partial year data is available, it extrapolates from the latest payment × 4 (quarterly assumption).
- **Yield recalculated from actuals** — when actual dividend history is available, yield is recalculated as (annual_div / price × 100) for accuracy.
- **Missing ETFs added** — VBK (US Small Growth), VV, VXF, VTIP, VGSH, VGIT, VGLT, EDV, BIV (Intermediate Bond), BSV, BLV, IWB, IWR, IWS, IWP, IWN, IWO, SHY, IEF, SHV, EMB, MUB, TIPS, DVY, HDV, DGRO, ITOT, IXUS added to KNOWN_ETFS table.

### v0.5.9 — 2026-04-18
- Recheck filter expanded, dividend calendar fetch added

### v0.5.8 — 2026-04-18
- Header shadow removed, 70+ ETFs hardcoded

### v0.5.7 — 2026-04-18
- Dividend Portfolio Value card, Payout Log card grid

### v0.5.6 — 2026-04-18
- Import/Export, per-stock refresh, custom API key

---

## Deploy

```
v0.6.0.html    ← Main app
index.html     ← Redirects to v0.6.0.html
```

**After deploying:**
1. Ctrl+Shift+R (hard refresh)
2. Open console: `localStorage.removeItem('pf_dv_custom')`
3. Refresh again — forces complete re-fetch with new dividend calculation logic

---

## How Dividend Data Works

For each non-builtin stock, `fetchProfile` makes 3 chained API calls:

1. **`/stock/profile2`** → sector, company name
2. **`/stock/metric`** → dividend yield %, annual dividend/share, payout ratio
   - If yield is provided but per-share amount is 0: calculates `annual_div = yield × price / 100`
3. **`/stock/dividend`** (past 6 months + future 6 months) → actual payment dates and amounts
   - Sets next pay date and ex-date from nearest future dividend
   - Calculates annual div from sum of recent payments (more accurate than estimates)
   - Detects frequency from payment spacing
   - Builds dividend history for Payout Log

This means a stock like CME with 1.7% yield and $287.65 price will now show:
- Annual Div: ~$4.89 (calculated from 1.7% × $287.65)
- Next Pay: ~$1.22/share (quarterly)
- Pay date and ex-date from Finnhub dividend calendar
