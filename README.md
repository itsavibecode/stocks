# Portfolio Command Center

**Current Version: v0.5.9**

---

## Changelog

### v0.5.9 — 2026-04-18
- **Recheck filter expanded** — `recheckMissingData()` now catches ALL stocks with incomplete data, not just those missing a sector. Secondary filter now includes: non-builtin stocks with yield>0 but no pay date or ex-date, and any non-builtin with yield=0 and rating ETF/None/Unknown. This means the "Checking X stocks" count on load should now cover every stock that's missing information.
- **Dividend calendar fetch** — `fetchProfile` now chains a third API call to Finnhub `/stock/dividend` endpoint, which returns upcoming ex-dates, pay dates, and per-share amounts for the next 6 months. This fills in the missing pay date, ex-date, next payout amount, frequency detection, and dividend history that were previously only available for the 23 builtin tickers.
- **Frequency auto-detection** — if Finnhub returns 2+ upcoming dividends, the app calculates the spacing and classifies as Monthly (<2 months apart), Quarterly (<5), Semi-Annual (<9), or Annual.
- **History populated** — up to 4 dividend entries from Finnhub are stored as the stock's payout history, enabling Payout Log entries for non-builtin stocks.

### v0.5.8 — 2026-04-18
- Header shadow removed (no more gradient/blur)
- 70+ ETFs hardcoded with sector labels

### v0.5.7 — 2026-04-18
- Dividend Portfolio Value card, Payout Log card grid

### v0.5.6 — 2026-04-18
- Import/Export, per-stock refresh, custom API key

---

## Deploy

```
v0.5.9.html    ← Main app
index.html     ← Redirects to v0.5.9.html
```

**Ctrl+Shift+R after deploying.** Then run in console to force full re-fetch:
```javascript
localStorage.removeItem('pf_dv_custom');
```
Refresh again. This clears stale cached data so every non-builtin stock gets the full 3-endpoint fetch (profile + metric + dividend calendar).

---

## API Calls Per Stock

Each stock now uses up to 3 Finnhub API calls:
1. `/stock/profile2` — sector, company name
2. `/stock/metric` — dividend yield, annual dividend, payout ratio
3. `/stock/dividend` — upcoming ex-dates, pay dates, per-share amounts, history

With 73 tickers and 400ms spacing, a full recheck takes ~30 seconds. The free Finnhub tier allows 60 calls/min — the app uses ~3 calls per stock but staggers them to stay under the limit.

## Troubleshooting

**Toast says "Checking 22 stocks" but you have 73:** The other 51 already have complete data (builtins + previously cached). After clearing `pf_dv_custom` and refreshing, the count should jump to cover all non-builtin stocks.

**Stocks still missing pay date after recheck:** Finnhub's `/stock/dividend` endpoint may not have future dividend data for all stocks. ETFs in particular may not appear. The pay date will show "N/A" for these — this is a Finnhub data limitation, not a bug.
