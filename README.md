# Portfolio Command Center

**Current Version: v0.5.8**

---

## Changelog

### v0.5.8 — 2026-04-18
- **Header shadow removed** — replaced hardcoded dark gradient (`#0a1020`) and backdrop-filter blur with plain `var(--bg)` background. Header now renders cleanly in both dark and light themes with no shadow or washed-out overlay.
- **70+ ETFs hardcoded** — added `KNOWN_ETFS` lookup table with sector labels for Vanguard (VOO, VTI, VTV, VUG, VEA, VWO, VB, VBR, VO, VOT, VOE, VGT, VHT, VNQ, VXUS, VIG, VYM, etc.), Schwab (SCHG, SCHX, SCHB, SCHF, SCHE, SCHA, SCHV), iShares (IVV, IWM, IWF, IWD, IEFA, IEMG, AGG, TLT, HYG, LQD, QQQ, SPY, DIA), ARK, and SPDR sector ETFs (XLF, XLE, XLK, etc.). These ETFs get their sector set immediately without waiting for Finnhub, which often returns nothing for ETFs.
- **ETF + Finnhub combined** — known ETFs get their sector from the hardcoded table immediately, then Finnhub still runs to try to fetch dividend data (yield, annual div). This means the sector column is never blank for known ETFs, and dividend data fills in if available.
- **Commodity ETFs unchanged** — SLV, GLD, IAU, PPLT, USO still bypass Finnhub entirely (returns early with hardcoded data).

### v0.5.7 — 2026-04-18
- Dividend Portfolio Value card in Dividends tab summary
- Payout Log card grid redesign

### v0.5.6 — 2026-04-18
- Import/Export, per-stock refresh, custom API key, recheck priority

### v0.5.5 — 2026-04-18
- Recheck button, news datetime sort, default lot dates, account summaries

---

## Deploy

```
v0.5.8.html    ← Main app
index.html     ← Redirects to v0.5.8.html
```

**Ctrl+Shift+R after deploying.**

---

## Known ETFs

These ETFs have hardcoded sector labels and don't depend on Finnhub for classification:

**Vanguard:** VOO, VTI, VTV, VUG, VEA, VWO, VB, VBR, VO, VOT, VOE, VGT, VHT, VNQ, VXUS, VIG, VYM, VCSH, VCIT, BND, BNDX

**Schwab:** SCHG, SCHD, SCHX, SCHB, SCHF, SCHE, SCHA, SCHV

**iShares:** IVV, IWM, IWF, IWD, IEFA, IEMG, AGG, TLT, HYG, LQD, QQQ, QQQM, SPY, DIA

**SPDR Sectors:** XLF, XLE, XLK, XLV, XLI, XLP, XLY, XLU, XLRE, XLC, XLB

**ARK:** ARKK, ARKW, ARKF, ARKG

**Commodities (bypass Finnhub entirely):** SLV, GLD, IAU, PPLT, USO, UNG, DBA, DBC, PDBC

If you have an ETF not on this list, it will still try Finnhub. If Finnhub returns nothing, sector shows "—". You can request additions.

---

## Troubleshooting

**Light mode still has shadow:** Hard refresh (Ctrl+Shift+R). The old CSS with `linear-gradient(180deg,#0a1020,...)` is cached.

**ETF still shows blank sector:** Clear custom DV data: `localStorage.removeItem('pf_dv_custom')` then refresh. Or click ↻ Recheck Stocks.
