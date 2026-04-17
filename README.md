# Portfolio Command Center

**Current Version: v0.5.4**

---

## Changelog

### v0.5.4 — 2026-04-17
- **Payout Log spacing fixed** — removed `margin-left:auto` on badge wrapper that was pushing badges to the far right edge, creating huge empty gaps. Badges now flow inline after the payout total. Tightened padding and gaps for a compact, scannable layout.
- **Tax labels cleaned up** — removed all standard "Qualified dividends" entries (assumed for most stocks). Only special cases now show tags: REIT (VICI), Foreign Tax (BP), Return of Capital (INTC), Multiple Forms (BAC), Spin-off Basis (RTX), Non-Qualified (RGR), ETF Mix (SCHD), K-1/Collectible (SLV, GLD, IAU, PPLT, USO). Tags show short classification name instead of form number.
- **Orange tax panel in deep-dive** — stocks with special tax situations get a dedicated light-orange background section in the expanded detail panel showing Tax Form, Classification, and full explanatory note. Separate from the standard data grid.
- **Tax panel on mobile** — same orange tax section appears in mobile card expanded view for dividend stocks.
- **API error log** — red "⚠ API" badge appears in header next to RSS when any Finnhub API call fails. Click to see last 10 errors with timestamp, ticker, endpoint, and message. Helps diagnose rate limiting or key issues.
- **Error logging wired** — all three Finnhub endpoints (news, quote, profile+metric) now log failures to the error tracker.

### v0.5.3 — 2026-04-17
- News highlighting fixed (proper AM/PM time parsing)
- Tax labels moved to Dividends tab only
- SLV/GLD commodity ETF handling
- Tax info in deep-dive panel

### v0.5.2 — 2026-04-17
- Fractional shares display, auto-fix missing data, payout log compact redesign

### v0.5.1 — 2026-04-17
- Stock classification via Finnhub, favicon, theme switching, text size, recent news highlight

### v0.5.0 — 2026-04-17
- "Broker" → "Account", Accounts tab, Settings, notifications, smart add

### v0.4.x — 2026-04-15 to 2026-04-17
- Firebase, Finnhub, multi-lot, panels stay open, search, live prices

### v0.1.0–v0.3.0 — 2026-04-14
- Initial build through mobile cards

---

## Deploy

```
v0.5.4.html    ← Main app
index.html     ← Redirects to v0.5.4.html
feed.xml       ← RSS feed
rss.xml        ← RSS alias
README.md      ← This file
```

**After deploying: Ctrl+Shift+R (hard refresh) to clear browser cache.**

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

## Tax Labels

Only stocks with non-standard tax situations show ⚠ tags:

| Ticker | Tag | Form | Note |
|--------|-----|------|------|
| VICI | REIT | 1099-DIV | Return of capital (Box 3) |
| BP | Foreign Tax | 1099-DIV + 1116 | Foreign tax credit |
| INTC | Caution | 1099-DIV | Possible return of capital |
| BAC | Multiple Forms | 1099-DIV + 1099-INT | Dividends + interest |
| RTX | Spin-off Basis | 1099-DIV | Cost basis adjustments |
| RGR | Non-Qualified | 1099-DIV | Special dividends |
| SCHD | ETF Mix | 1099-DIV | Qualified + non-qualified mix |
| SLV/GLD | K-1 / 28% | 1099-B / K-1 | Collectible tax rate |
| USO | K-1 | K-1 | Partnership structure |

Standard qualified dividend stocks (AAPL, MSFT, KO, etc.) do not show tags — it's assumed.

---

## API Error Log

A red **⚠ API [count]** badge appears in the header when Finnhub API calls fail. Click it to see details. Common causes:
- **Rate limiting** — Finnhub free tier allows 60 calls/min. The app staggers requests but with 50+ tickers, rapid page loads can hit the limit.
- **Invalid ticker** — some tickers (OTC, foreign) may not exist in Finnhub's database.
- **Network issues** — temporary connectivity problems.

The badge resets on page refresh.
