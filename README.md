# Portfolio Command Center

**Current Version: v0.7.11**

---

## Changelog

### v0.7.11 — 2026-04-29
- **Cost basis + unrealized P/L tracking.** Lots got a new optional `p` field (entry price per share). The +Add modal grew an "Entry $/sh (optional)" input alongside the shares + account fields. Each Holdings-by-Lot row in the deep-dive panel now shows a click-to-edit Entry $ column and an Unrealized column with `+/−$ amount` and `+/−%` (green for gain, red for loss). Hover the unrealized cell for the cost-basis breakdown.
- **Per-ticker totals at the bottom of the lot table** show shares · current value · cost basis · unrealized P/L when at least one lot has an entry price set.
- **Two new stats in the All-tab Portfolio Snapshot** when any lot has an entry price set: "Cost Basis (tracked)" and "Unrealized P/L" with $ amount and %. Only counts lots where you've explicitly entered the entry price — graceful degradation for users who haven't added cost basis yet.

### v0.7.10 — 2026-04-29
- **Dividend reminders.** New "Dividend Reminders" card in Settings — toggle on/off plus configurable lead time for both ex-date and pay-date (default 1 day, max 14). When enabled, each sign-in scans dividend tickers with shares set, fires a toast + chime + activity-log entry for any upcoming ex-date or pay-date within the lead window. Each unique reminder fires once per occurrence — refreshing the page won't re-trigger.
- **Per-ticker opt-out.** Each Dividends deep-dive panel got a "🔔 Reminders for X: On/Off" toggle so you can silence individual stocks without disabling globally.
- **Auto-pruned reminder history** in `prefs.notifiedReminders`: entries older than 60 days are dropped, total capped at 200.

### v0.7.9 — 2026-04-29
- **Tax Outlook panel on the All tab** — estimates your annual dividend income broken down by tax treatment: Qualified Dividends, Non-Qualified Ordinary, REIT Distributions, Foreign Dividends, ETF Mix (split 50/50), Collectibles (28%), and K-1 Partnerships. Each bucket gets a color-coded horizontal bar with $ amount and % of total dividend income. Hover a row for the tax-treatment note. Classification logic uses the existing `TAX_INFO` table when available (REIT/Foreign Tax/K-1/etc.) and falls back to sector-based heuristics (REIT sector, bond/treasury → ordinary).
- Disclaimer baked in: "Estimates based on common classifications — your actual 1099-DIV may vary. Hold >60 days for qualified treatment on most US stocks. Not tax advice."

### v0.7.8 — 2026-04-29
- **Portfolio history snapshots + line chart on All tab.** Once per day after sign-in, the app records `{date, totalValue, annualIncome}` to `prefs.history` (Firestore-synced, capped at 730 days). The Portfolio Snapshot panel grew a "Portfolio Value Over Time" SVG line chart — area + line plot with min/mid/max Y labels, first-and-last date X labels, change-since-start summary in the title bar (green for up, red for down). Hover anywhere on the chart for a tooltip showing the exact date and value at that point.
- Empty state when only one snapshot exists ("History starts accumulating from today...") so day-1 users see a clear message rather than a broken chart.

### v0.7.7 — 2026-04-29 — UX polish bundle
- **News status now shows which provider(s) answered.** After a fetch completes, the status line aggregates per-ticker provider attribution as e.g. "● Live — 9:14:21 PM — Finnhub 21 · Tiingo 2." Makes it easy to see when fallbacks are kicking in.
- **Activity Log got a search box.** Type to filter the audit trail by type or detail text. Combines with the existing category dropdown.
- **+Add modal pre-selects your most recently used account.** Saves a tap when adding multiple positions to the same broker. Tracked in `prefs.lastUsedBroker`, updated on every successful add.

### v0.7.6 — 2026-04-29
- **Portfolio Snapshot panel at the top of the All tab** — finally an actual at-a-glance view that earns the "Command Center" name. Four stat boxes (Portfolio Value, Annual Dividend, YTD Received this calendar year, sector count) plus two horizontal-bar charts: Sector Allocation (top 5 + Other rollup) and Top Holdings (top 5 by position value). Sectors and holdings each show the % of total portfolio with a hover tooltip showing the dollar amount. Empty state when no shares are set yet. Two-column layout on desktop, stacked on mobile.

### v0.7.5 — 2026-04-29
- **Two more backup price providers** — Settings → Backup API Keys now has fields for **Polygon.io** (5 calls/min free, returns previous-day close) and **Twelve Data** (800 calls/day free, real-time price). Same drop-in pattern as AlphaVantage and Tiingo. Each with its own save/clear button and status line; "N configured" count pill on the card title now goes up to 4.
- **Quote chain extended:** Finnhub → AlphaVantage → Tiingo → Polygon → Twelve Data. First provider to return a price wins. News chain stays Finnhub → AlphaVantage → Tiingo (Polygon and Twelve Data don't expose news on their free tiers — neither does Barchart at usable price points, and Dividend.com has no public API at all).

### v0.7.4 — 2026-04-29
- **SnapTrade Phase 4 — Auto-sync toggle + DRIP visibility.** Final piece of the SnapTrade roadmap.
- **Auto-sync daily** (Settings → SnapTrade card → checkbox). When enabled, on next page load (if more than 24 hours since last auto-sync), the app refreshes accounts and opens the diff modal for review. **Never silent-applies** — same approval flow as a manual Sync click. Last auto-sync timestamp shown under the toggle. Toggle state persists in `prefs.snaptradeAutoSync` (Firestore-synced).
- **DRIP History panel on the Brokers tab.** Click "💰 Fetch Transactions" to pull the last 90 days of activities through a new Worker endpoint (`POST /transactions`), then any reinvestment-type entries are summarized: ticker, date, shares added, price, dollar amount, plus totals at top. SnapTrade activity types are inconsistent across brokers — we match `DRIP` / `REI` / `REINVEST` / `DIVIDEND_REINVESTMENT`, fall back on description text, and treat `DIVIDEND` with positive units as a reinvestment.
- **Activity log captures both** — `snaptrade.transactions`, `snaptrade.autosync.on`, `snaptrade.autosync.off`.
- This completes the SnapTrade integration roadmap: Phase 1 (Worker scaffold) → Phase 2 (read-only positions) → Phase 3 (sync diff/approval) → Phase 4 (auto-sync + DRIP).

### v0.7.3 — 2026-04-29
- **SnapTrade Phase 3 — Sync to Portfolio with diff/approval UI.** Click "Sync" on the Brokers tab (or Settings → SnapTrade card) to open a per-row review modal. Each SnapTrade-reported position becomes an ADD / UPDATE / NOOP entry against your existing portfolio. Per-row checkboxes default ADD/UPDATE checked, NOOP excluded. Click "Apply Selected" to commit only the rows you approved.
- **Account name mapping (first-run, persisted).** The first time SnapTrade reports a brokerage account, you map it: skip, create new portfolio account with auto-suggested name (e.g. "M1 Finance - Roth IRA"), or pick from your existing accounts. The mapping persists in `prefs.snaptradeAccountMap` so future syncs default to the same target without re-prompting.
- **Multi-lot consolidation handling.** If you've manually added multiple lots at the same broker for the same ticker (e.g. DRIP-added entries), Sync proposes to merge them into a single lot at the SnapTrade-reported total. Logged transparently as "Merged N lots."
- **Activity log integration.** Every Sync action writes its own entry — `snaptrade.add`, `snaptrade.update`, `snaptrade.sync` summary — so you can audit what changed and when.
- **Past months in payout chart now visibly muted.** Past months get a desaturated gray bar at 55% opacity, muted text on the month label and amount; future months keep the bright accent gradient, current month keeps the highlight + ▶ arrow. Easier eye-scan for "what's done vs coming."

### v0.7.2 — 2026-04-29
- **Activity Log** — every state-changing action while signed in is now logged to a new "Activity Log" card in Settings. Captures portfolio mutations (add/remove/lots), account add/rename/delete, API key set/clear (never the value), SnapTrade events (register/connect/refresh/disconnect), auth (sign-in/out/forget-my-data), import/export, and local-data reset. Filter dropdown by category; "Export CSV" downloads the full log; "Clear Log" wipes both local and Firestore copies. Capped at 500 entries with auto-trim.
- **Activity persists locally too** — first 100 entries mirror to localStorage so local-only sessions can still see recent activity, and the log survives between page loads even before sign-in.

### v0.7.1 — 2026-04-29
- **Payout chart shows the full calendar year** — Jan→Dec of the current year, not "last 12 months with data." The current month gets a subtle background highlight and a small ▶ arrow to its left so the eye finds "today" instantly. Months with no scheduled payouts show a dash and a transparent bar.
- **Payout Log card order rewritten** — current month appears first, then forward chronologically. Past months are tucked into a "📄 Show past months (N payments)" collapsible details element below; click to expand. No more scrolling past last year to find this month.
- **Settings panels packed into a masonry-style 2-column layout** — switching from CSS grid to CSS columns so short cards (Appearance, Data, Import/Export) don't leave dead space below tall ones (Your Account, Backup API Keys). Single column on mobile (≤760px).

### v0.7.0 — 2026-04-29
- **SnapTrade brokerage integration (read-only)** — connect real brokerage accounts (M1, Schwab, Fidelity, Robinhood, Coinbase, etc.) via SnapTrade's hosted OAuth. Free tier supports up to 5 connected accounts per user. All API calls go through a Cloudflare Worker proxy ([itsavibecode/stocks-worker](https://github.com/itsavibecode/stocks-worker)) so the SnapTrade `consumerKey` (private secret) never reaches the browser. Phase 2 of 4 — read-only view of reported positions; Phase 3 will add diff/approval-flow UI to merge into the manual portfolio.
- **New Brokers tab** — lists each connected account with reported positions (ticker, shares, price, value) and total balance. Refresh button + tab counter showing connection count.
- **Settings → Connect Brokerages (SnapTrade)** card — Connect, +Connect Another, Refresh, View Brokers Tab, Disconnect actions. SnapTrade `userSecret` syncs through Firestore alongside the rest of your prefs.
- **Settings panels are a responsive grid now** — two-column on desktop (≥760px), single-column on mobile. Less scrolling on bigger screens.
- **API Key card renamed** to "Finnhub API Key" with "In use" / "Not set" status pill in the title. Backup keys card got a "N configured" pill matching the same pattern.
- **Payout chart tooltips** — hovering a monthly bar shows the per-ticker breakdown for that month (e.g. "IBM: $167.00, KO: $100.00, AAPL: $50.00").
- **Header reorganized** — RSS button pushed to far right of the header; the "+ Add" button moved into the tabs row to free up header space (now sits next to Settings on the right end of the tab bar).
- **Small company logos in News rows + Payout Log entries** — extending the v0.6.2 logos beyond the deep-dive panels. Same logo.dev source with letter fallback; 22×22 inline-friendly variant.
- **News price cell colored by today's change** — green for up days, red for down, lighter shade for moves under 2% in either direction. Hover shows the exact percent. Only applies when Finnhub provides the change data (AlphaVantage/Tiingo fallbacks don't surface it).

### v0.6.4 — 2026-04-28
- **"Your Account" card in Settings** — surfaces every piece of data we have on file from Google sign-in: display name, email, email-verified status, provider, user ID (with copy-full button), account creation timestamp, and last sign-in timestamp. Sits at the top of the Settings tab so it's not buried.
- **Forget my data** button — deletes your Firestore portfolio doc (tickers, lots, prefs, cache) and signs you out. Your local browser data stays. Includes a link to Google Account permissions for users who want to revoke the app entirely.

### v0.6.3 — 2026-04-27
- **Monthly payout bar chart** on the Payout Log tab — aggregates per-stock pay dates by month (last 12 months with data) and shows them as horizontal bars. Current month is highlighted; future months use a different gradient. Sits above the existing month-by-month grid.
- **AlphaVantage and Tiingo as backup data providers** — quotes and news now follow Finnhub → AlphaVantage → Tiingo. The first provider to return data wins. Settings has a new "Backup API Keys" card with separate fields for each (both free with sign-up; AlphaVantage 25/day, Tiingo 1000/hour). Keys sync to Firestore alongside the primary key. Profile + dividend metadata stay Finnhub-only since the secondary providers don't expose equivalents.
- **Firestore warm cache** for news + prices — the most recent fetched data persists in your portfolio doc as a `cache` field. Sign in on a new device or browser and the cache loads with the rest of your portfolio, so you see content immediately instead of waiting for the first fetch. The existing 10-minute TTL still triggers a re-fetch when stale; this layer just removes the cold start.

### v0.6.2 — 2026-04-27
- **Share price column in the News tab** — each news row now shows the current share price next to the ticker, sortable.
- **Company logos in expanded panels** — clicking a row in Dividends or Growth opens the deep-dive with the company's logo via [logo.dev](https://logo.dev). Falls back to a ticker-letter placeholder if the image doesn't load.
- **Market indices + Bitcoin in the header** — live tickers for S&P 500 (SPY), NASDAQ (QQQ), Dow (DIA), and BTC. Indices use Finnhub; BTC pulls from CoinGecko (no key required). Refreshes every 10 minutes alongside the rest of the data.
- **Removed `index.jsx`** — vestigial 4/9 React prototype that was superseded the next day. It was never wired into the deployment.

### v0.6.1 — 2026-04-27
- **Removed the shared default Finnhub API key.** Every user now needs their own free key from [finnhub.io/register](https://finnhub.io/register), entered once under Settings → API Key. The previous shared key was being burned by anyone visiting the public site; now your quota is yours.
- **News timestamp fix** — articles published late in the evening (US time) were showing tomorrow's date with tonight's time, so they looked like future events. The date is now derived in the user's local timezone, matching the displayed time.
- **Live local clock in the header** — small clock with seconds, ticking once per second, so news timestamps have a visible reference for "what time is it for me right now."
- **Deduped news** — the same article appearing under multiple tickers now collapses to one row (matched by headline + source).
- **News tab counter is now "recent" only** — the bubble next to the News tab shows how many articles published within the last 60 minutes, not the total. The total is still visible in the table.
- **Delisted/unknown tickers stop re-fetching forever** — when Finnhub returns an empty profile for a ticker (delisted, typo, foreign exchange), the sector is set to "Unknown" so the recheck filter doesn't keep retrying it on every page load.

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
index.html    ← The app (single-file HTML+CSS+JS, no build step)
feed.xml      ← Static RSS feed (optional, regenerated by generate-feed.js)
```

Push to a GitHub Pages branch and the site is live. No bundler, no build, no deploy script.

**First-run setup for users:** open Settings → API Key and paste a free Finnhub API key from [finnhub.io/register](https://finnhub.io/register). Without it, news and prices will not fetch.

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
