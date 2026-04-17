# Portfolio Command Center

A self-contained stock portfolio dashboard with live news, live prices, dividend tracking, multi-lot holdings, cloud sync, and RSS feeds. Runs on GitHub Pages — zero build steps.

**Current Version: v0.4.6**

---

## Changelog

### v0.4.6 — 2026-04-17
- **Add Ticker fixed** — the "+ Add" modal was breaking after selecting "+ New broker..." because the `<select>` element was permanently replaced with a text input, so reopening the modal crashed silently. Fixed with a wrapper div that fully rebuilds the broker dropdown each time the modal opens. Fields reset after each add so you can immediately add another stock.
- **Duplicate ticker feedback** — trying to add a ticker that already exists now flashes the input border red.
- **Search on Dividends tab** — new search bar filters by ticker, broker, rating, or sector. Type "King" to find Dividend Kings, "Schwab" to find stocks at that broker.
- **Search on Growth tab** — filters by ticker, sector, or broker.
- **Payout Log unaffected** — the payout log and annual total use the full unfiltered dividend list, so searching on the Dividends tab doesn't break the payout timeline or income calculations.

### v0.4.5 — 2026-04-17
- Panels stay open during edits (desktop + mobile)

### v0.4.4 — 2026-04-17
- Multi-lot holdings with "+ Add Lot" in detail panels (desktop + mobile)
- Broker + shares fields on "+ Add" modal
- Lots data model with backward-compatible migration

### v0.4.3 — 2026-04-16
- News wraps inside expanded rows

### v0.4.2 — 2026-04-16
- Live prices from Finnhub, broker dropdown

### v0.4.1 — 2026-04-16
- Next Total Payout column, Firebase + Finnhub keys populated

### v0.4.0 — 2026-04-15
- Firebase Google Auth + Firestore, live Finnhub news, versioned filenames

### v0.3.0 — 2026-04-14
- Payout log, portfolio value fix, broker column, auto-save, mobile cards

### v0.2.0 — 2026-04-14
- Pure HTML, sortable tables, deep-dive panels, RSS files

### v0.1.0 — 2026-04-14
- Initial build

---

## Deploy

```
v0.4.6.html    ← Main app
index.html     ← Redirects to v0.4.6.html
feed.xml       ← RSS feed
rss.xml        ← RSS alias
README.md      ← This file
```

Settings → Pages → Deploy from branch → main / root

---

## Firebase (stockfolio-96c95)

Config embedded. Console setup needed:

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

## Features

| Feature | Details |
|---------|---------|
| Multi-Lot Holdings | Multiple lots per stock with independent shares + broker |
| Search (all tabs) | News, Dividends, Growth tabs each have a search bar |
| Add Ticker | Modal with optional shares + broker dropdown, resets between adds |
| Live Prices | Finnhub `/quote`, cached 10 min, auto-refresh |
| News Feed | Live Finnhub, searchable, sortable, wraps cleanly |
| Dividends | Deep-dive with lots, next total payout, news |
| Growth Stocks | Lots, broker dropdown, news |
| Payout Log | Upcoming/past timeline, 90-day projection |
| Broker Dropdown | Reuse existing brokers or type new |
| Sortable Tables | Click any column header |
| Auto-Save | localStorage + Firestore cloud sync |
| Panels Stay Open | Editing lots doesn't collapse the panel |
| RSS Feed | Auto-discovery + static feed files |
| Mobile | Card layout below 640px |

---

## Troubleshooting

If lots don't appear after upgrading, run in browser console:
```javascript
localStorage.removeItem('pf_lots');
```
Then refresh.
