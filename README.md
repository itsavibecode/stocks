# Stockfolio

**Current Version: v0.7.75**

---

## Changelog

### v0.7.75 — 2026-05-15 — 📈 Dividends sub-tabs: Stocks / Increases / Specials
- **Dividends tab now has three sub-tabs.** "💰 Stocks" (the original holdings table), "📈 Increases" (recent dividend hikes detected from `DV[t].np > DV[t].h[0].a`), and "🎁 Specials" (one-time special dividends flagged via `sp:true` in the payment history). Each sub-tab has a live count badge.
- **Increases table** shows: ticker, prev → new per-share amount, % change, annual /sh before & after, your annual income lift (× shares), ex-date, pay date, years-raising streak (🏆 Aristocrat at 25+, 👑 King at 50+). Sorted by % change descending so biggest hikes lead. Top-of-table summary stats: total count, total annual income lift, average hike %, biggest hiker.
- **Specials table** shows: ticker (with 🎁 Special badge), amount per share, your share count, total received (amount × shares), ex-date, pay date, and a free-form note (e.g. "Year-end special dividend"). Sorted by pay date descending.
- **Demo data** populates 5 sample increases (ABBV, MSFT, KO, AAPL, T — ranging from +3% to +9.6% hikes) and 2 specials (MSFT $3.00 year-end, ABBV $1.50 post-merger) so the new views are immediately visible.
- **Last-viewed sub-tab persists** in `prefs.lastSubTab.div` and restores on next page load — synced across devices via the existing cloud-prefs merge.

### v0.7.74 — 2026-05-15 — 💰 Dividends-by-Month: bars stay slim when sparse
- **Sparse Dividends-by-Month charts no longer balloon into fat bars.** v0.7.73 stretched the chart to 100% of the snapshot panel width regardless of entry count, so a 4-month chart had bars 150px+ wide. Now the outer wrap's max-width is computed from entry count (~28px CSS per slot + 64px Y-axis padding, capped at 100%), and the chart height bumps from 280px → 360px when there are 4 or fewer entries so the chart reads as "narrow + tall" instead of "wide + short" when data is sparse — matching the user-requested ratio.
- Chart height steps: ≤4 entries → 360px, ≤8 → 320px, ≤16 → 300px, more → 280px.

### v0.7.73 — 2026-05-15 — 💰 Dividends-by-Month stacked bar chart
- **New "💰 Dividends by Month" chart in the snapshot panel.** One vertical bar per month, segmented by paying company. Hover any segment to see the ticker + exact dollar amount. Built from each ticker's recorded payment history (`DV[t].h`) × current shares held, so it reflects "what this portfolio would have paid" across months.
- **Per-ticker stable colors.** Hash the ticker symbol → HSL hue so the same ticker always gets the same color across reloads, screen sizes, and PNG share exports. Legend at the top of the chart lists every paying ticker sorted by total dollar contribution (largest first).
- **Auto-scaling Y-axis** rounds the max up to a clean dollar number ($25 / $50 / $100 / $250 / $500 / $1000 / next-$500). 4-segment gridline.
- **Mobile-aware X-axis.** Month labels (e.g. "Apr 26") render horizontally on desktop; below 760px they rotate -45° so 12+ months still fit.
- **💾 Share button** exports as PNG via the existing `shareElementById` flow.

### v0.7.72 — 2026-05-15 — 📊 PE Ratio horizontal bar chart
- **New "📊 PE Ratio" chart in the snapshot panel.** Horizontal bar chart with one row per portfolio ticker that has PE data, sorted by PE descending. Two-column grid on desktop, single column on mobile. Title shows ticker count + axis scale; Share button exports the chart as a PNG.
- **PE data sources** (in priority order):
  1. `FUND[ticker].pe` — live AlphaVantage cache (extensible — future OVERVIEW fetch will populate this)
  2. `BUILTIN_PE` — hardcoded rough 2026 TTM PEs for the 23 built-in tickers
  3. Demo mode: PE values added to every `DEMO_FUND` entry (10 tickers)
- **Negative TTM earnings handled gracefully.** Tickers with PE = 0 (loss-making companies, e.g. INTC + NET in current data) get a striped bar with "N/A" label so they stay visible in context without dominating the axis. Tickers with no PE data at all are silently skipped.
- **Axis auto-scales** to a clean round number (25 / 50 / 100 / next-50 step) so the bars use the full width usefully.

### v0.7.71 — 2026-05-15 — 🚫 Demo mode: zero network calls, full audit
- **Audited every network-touching code path and added explicit `IS_DEMO` short-circuits**, even where existing checks (`!FINNHUB_KEY` / `!anyKeySet()` / `!currentUser`) already prevented the call. Defense-in-depth — demo should NEVER hit a network endpoint, full stop. Gated:
  - `fetchBTC()` — was firing CoinGecko `simple/price` unconditionally on init + every periodic refresh (**this was leaking**)
  - `fetchMarketIndices()` — was gated only on `anyKeySet()` (safe but implicit)
  - `recheckMissingData()`, `fetchProfile()` — were gated only on `!FINNHUB_KEY`
  - `fetchPriceForTicker()`, `fetchNewsForTicker()` — top-level gates so every caller is automatically protected
  - SPY auto-warm in the chart wire-up — explicit early return
  - `callWorker()` (SnapTrade Cloudflare Worker calls) — shows toast and exits
  - `pf_dv_custom` localStorage read — wrapped in `!IS_DEMO` so custom DV data doesn't leak in
- Demo mode now runs entirely on the bundled `DEMO_*` constants + `FALLBACK_NEWS`. Zero outbound network requests.

### v0.7.70 — 2026-05-15 — 🛟 Bulletproof demo auto-load + diagnostic logging
- **End-of-init fallback re-seed.** Added a safety net that runs after every init step has completed: if `IS_DEMO` is true but `tks.length === 0`, force-call `enterDemoMode()` to recover. Catches any race condition / init-ordering quirk / silent error that could leave the user on an empty page despite `IS_DEMO=true`.
- **Diagnostic console logs.** When the demo activates, the browser console now shows `[Stockfolio] Demo data seeded in load() — tks=10 lots keys=10`. If the seed fails, `[Stockfolio] Demo seed failed in load(): <error>` instead. Easy to verify from devtools whether the demo is actually populating.
- **`load()` demo branch wrapped in try/catch** so any error during seeding surfaces in the console instead of failing silently halfway through.

### v0.7.69 — 2026-05-15 — 🔁 Demo button now idempotent — recovers stuck-empty state
- **Removed the early-return guard from `enterDemoMode()`.** v0.7.67 added `if (IS_DEMO) return;` which created a dead end: if `IS_DEMO` got set true on script load (via `?demo=1` URL or the sessionStorage flag) but the data didn't end up in memory for any reason — race condition, stale tab, anything — clicking the "Load demo data" button did absolutely nothing because of the guard. The function is now idempotent: always seeds, always re-renders.
- **Recovery-path empty-state CTA.** When the snapshot panel detects no portfolio data AND `IS_DEMO === true`, the CTA card now says "⚠️ Demo data didn't load — Reload demo data" with a button that re-runs `enterDemoMode()` to recover. Previously the CTA was hidden in demo mode, leaving the user stuck with no way to recover.
- Wrapped the seed step in try/catch so any seeding error surfaces as a toast instead of failing silently.

### v0.7.68 — 2026-05-15 — 🧹 Hide footer "Try demo" link when already in demo
- Wrapped the footer "🎬 Try demo" link + its separator in a `<span id="footerDemoSep">` and hide that span whenever `IS_DEMO` is true (both at init for URL-loaded demos and inside `enterDemoMode()` for in-place activation). Was redundant + slightly confusing since the link did nothing in demo (the function early-returns when already active).

### v0.7.67 — 2026-05-15 — 🎬 In-place demo activation (no reload, no URL dependency)
- **`enterDemoMode()` now seeds everything in-place + re-renders** instead of relying on a `?demo=1` URL navigation + script reload to activate. The previous approach was fragile: if GitHub Pages stripped the query during a redirect or the browser dropped it for any reason, the demo would silently fail and the user would land on an empty signed-out dashboard. Now the function:
  1. Sets `IS_DEMO = true` in-memory
  2. Updates the URL via `history.replaceState` (no reload — survives back/forward navigation)
  3. Sets the sessionStorage flag (so a manual reload still keeps demo)
  4. Nulls the Firestore handle (defense against any cloud write)
  5. Seeds `tks`/`lots`/`realized`/`livePrices`/`liveChanges`/`FUND`/`SPY_HIST` from the demo constants
  6. Swaps the header (hides auth bar, shows demo banner)
  7. Calls `render()` + the supporting renderers
- All the script-eval-time URL-based detection still works for direct-link sharing (`https://itsavibecode.github.io/stocks/?demo=1`).

### v0.7.66 — 2026-05-15 — 🎬 Robust demo activation + "Load demo" empty-state CTA
- **Demo mode now detects three ways instead of one.** The previous detection only checked `?demo=1` in the query string — if GitHub Pages stripped the param during a trailing-slash redirect, or the user navigated in a way that lost the query, the demo silently failed and the user saw an empty signed-out dashboard. New detection:
  1. `?demo=1` / `?demo=true` in the query (canonical)
  2. `#demo=1` in the hash (fallback if query stripped)
  3. `sessionStorage.sf_demo_active=1` flag (persists across reloads in the same tab)
- **New `enterDemoMode()` helper** sets all three at once and hard-reloads so the script-eval-time `IS_DEMO` gates re-evaluate. `exitDemoMode()` clears all three.
- **Empty-state "Load demo data" button** in the snapshot panel. When the user has no portfolio AND isn't signed in AND has no realized sales, a callout card appears with a one-click button to enter demo mode. Removes the need to know the URL parameter exists.
- **Footer "🎬 Try demo" link rewired** to call `enterDemoMode()` instead of relying on `<a href="?demo=1">` — works reliably regardless of current URL state.

### v0.7.65 — 2026-05-15 — 🔧 Fix mobile FAB leaking to desktop
- **Mobile "+" add button no longer appears as a stray rectangle on desktop.** v0.7.56 added the mobile FAB (`.mobile-fab`) but the CSS styles that hide it lived entirely inside the `@media(max-width:640px)` block — meaning at viewports wider than 640px the `<button>` element rendered with browser defaults (small inline rectangle with a "+" inside, "Add ticker" tooltip on hover). Added a `display:none` rule outside the media query as the default, then `display:flex!important` inside the mobile query so the FAB shows only where it's supposed to.

### v0.7.64 — 2026-05-15 — 🎬 Demo mode: full baked-in dataset + airtight privacy
- **Demo mode now seeds fundamentals + SPY history + day-change percentages** so the Insights tab's Payout Safety scores have real numbers to blend with ratings, the marquee ticker shows colored up/down arrows, and the Portfolio Value chart's S&P 500 overlay renders without ever calling AlphaVantage. New constants: `DEMO_FUND` (7 dividend tickers with realistic OCF/FCF/divPaid/coverage), `DEMO_SPY_HIST` (180-day synthetic SPY closes weekdays only), `DEMO_CHANGES` (mixed up/down day moves).
- **Tightened demo privacy.** Every per-user localStorage read that fires at script-eval time now skips when `IS_DEMO` is true — `pf_fund`, `pf_spy_hist`, `pf_prices`, `pf_prices_ts`, `pf_changes`, `pf_news`, `pf_news_ts`, `pf_activity`. Previously a returning user's cached fundamentals / SPY / prices / news / activity log would bleed into the demo view; now demo starts with a clean slate seeded entirely from the bundled `DEMO_*` constants. The 10-ticker demo portfolio uses `FALLBACK_NEWS` (already present) for headlines so every tab has data immediately on a fresh visit.

### v0.7.63 — 2026-05-15 — 🎬 Try-demo link recolored to accent cyan
- Re-styled the v0.7.62 footer demo link from hot pink to the app's accent cyan (`var(--accent2)`) so it matches the rest of the in-app link palette and doesn't clash. Same hover behavior — pill fills with cyan, text turns white. Works in both dark and light theme via the CSS variable.

### v0.7.62 — 2026-05-15 — 🎬 "Try demo" link in footer
- **Added a `?demo=1` link to the footer** so visitors who land on the live app can preview a realistic sample portfolio with one click instead of needing to know about the URL parameter.

### v0.7.61 — 2026-05-15 — 🔒 Scrub API keys from error messages + handle AlphaVantage abuse-detection
- **API keys redacted from all error messages.** AlphaVantage's "We have detected your API key as part of an automated request…" response echoes your actual key back in the error string — which means a screenshot of the API errors modal or chart-level error message would leak your key. New `_scrubApiKeys(msg)` helper replaces every known key (Finnhub / AlphaVantage / Tiingo / Polygon / TwelveData) with `[redacted-*-key]` before storing in `apiErrors`, displaying in the alert, or putting on `SPY_FETCH_STATE.lastError`. Applied both at log time (new entries) AND at display time (defense in depth for entries logged before this fix).
- **Abuse-detection treated like rate-limit.** When AlphaVantage flags the request as "automated" / too-frequent, the SPY fetcher now tags it the same as the 25/day quota (`rateLimited:true`) so the auto-warm backs off for 4 hours instead of hammering. The chart shows a yellow "AlphaVantage flagged the request as too-frequent — SPY will auto-retry in a few hours. Slowing down other AlphaVantage fetches (e.g. fundamentals refresh) helps." message rather than the verbatim API response.

### v0.7.60 — 2026-05-15 — ✕ RSS panel close button
- **Added a close (×) button to the top-right corner of the RSS panel** so you can dismiss it without scrolling back up to find the 📡 RSS toggle in the header. Same `toggleRSS()` action under the hood. Hover spins 90° + paints orange so it reads as the orange "close" of the orange "open" button.

### v0.7.59 — 2026-05-15 — 📊 SPY overlay free-tier fix + partial overlay + rate-limit backoff
- **Switched SPY fetch from `outputsize=full` to `outputsize=compact`.** AlphaVantage made `full` a premium-only parameter for `TIME_SERIES_DAILY` sometime in 2026 — every v0.7.53+ SPY fetch was failing with "*The outputsize=full parameter value is a premium feature*." `compact` returns the last 100 trading days (~4.5 months of calendar dates) on the free tier, which covers virtually every portfolio's history since the app started tracking.
- **Partial-overlay support.** If portfolio history extends earlier than the 100-day SPY window, the SPY line now starts at the first portfolio date that has SPY data instead of disappearing entirely. Both lines normalize from that overlap-start date and the legend reports % change over that same window with a "since MM-DD (SPY data starts there)" note so the comparison stays apples-to-apples.
- **Rate-limit detection + 4-hour backoff.** When AlphaVantage returns the "25 requests per day" message, the SPY fetcher now flags `rateLimited:true` on `SPY_FETCH_STATE` and the auto-warm waits 4 hours before retrying (instead of the 60-second backoff used for transient errors). Avoids burning more requests against a quota that's already exhausted.
- **Rate-limit-specific UI message.** When rate-limited, the chart shows "⏳ AlphaVantage daily quota hit (25 requests/day on free tier). SPY comparison will return automatically tomorrow." in yellow — much more useful than the verbose verbatim API response.

### v0.7.58 — 2026-05-15 — 🗂️ Collapsible Settings sections
- **Click any Settings section header to collapse/expand it.** The 7 section headers added in v0.7.51 (Account / Appearance & Audio / Notifications / Money & Taxes / Brokerage & Accounts / API Keys / Data & Activity) now have a chevron and toggle their cards open or closed when clicked. Chevron rotates 90° when collapsed.
- **Expand all / Collapse all** buttons in a small toolbar above the first section header (right-aligned, spans both masonry columns). One click clears or sets every section in one go.
- **State persists per-section in `prefs.settingsCollapsed`** so the cards you don't care about stay collapsed across reloads and sync across devices via the existing cloud-prefs merge. Applied on init AND after cloud-load (so a cross-device change reaches you next sign-in).
- The collapsed-card hide is JS-driven (sibling-walks from each header to the next), which means the masonry columns reflow cleanly — no awkward empty gaps where cards used to be.

### v0.7.57 — 2026-05-15 — 🔎 SPY overlay: actual error visibility + retry button
- **Fixed the misleading "needs an AlphaVantage key" message.** When the SPY benchmark line couldn't render, the chart always blamed a missing API key — even when the real cause was an AlphaVantage rate-limit (free tier is 25 requests/day), a bad key, a network blip, or `outputsize=full` getting throttled. The user would have their key set, still see "needs a key", and rightly wonder what was going on.
- **`SPY_FETCH_STATE` tracker** now records `status` (`idle/fetching/ok/error`), the actual `lastError` text returned by AlphaVantage, and `lastTriedAt`. The chart's status line now distinguishes:
  - **No key** → "Add yours in Settings" link
  - **Fetching** → spinner + "Fetching S&P 500 history from AlphaVantage…"
  - **Error** → shows the actual AlphaVantage response (e.g. *"Thank you for using Alpha Vantage! Our standard API rate limit is 25 requests per day…"*) with a red color + ↻ Retry button
  - **Data didn't cover the range** → offers ↻ Refetch
- **Auto-warm backoff** — after a failed fetch, the chart won't auto-retry until 60s have passed (and re-renders are no-ops in the meantime). User can click ↻ Retry to force a fresh attempt at any time.
- **Re-render on failure** — previously the auto-warm would silently exit on failure and leave the chart showing the stale "needs a key" placeholder. Now it re-renders so the actual error reaches the user.

### v0.7.56 — 2026-05-15 — 📱 Mobile UX top-to-bottom sweep
- **iOS Safari zoom-on-focus eliminated.** Inputs/textareas/selects on phones now use 16px font (was 13–14px), which prevents Safari's mandatory auto-zoom when the user taps into a field. Covers the modal inputs, search bars, reminder day-count fields, and every form input across Settings.
- **Floating "+ Add" button on mobile.** The Add Ticker button used to live in the tabs row, which scrolls horizontally on phones — meaning once you scrolled past "News / Dividends / Growth" it was gone. New circular FAB anchored bottom-right (52×52, accent-blue, drop shadow) is always reachable. Hidden on desktop (the original toolbar Add button is still there).
- **Tabs row sticks to top on mobile** so you can switch tabs without scrolling back up. Sits below the header + scrolling ticker in the existing sticky stack (no overlap math needed — uses the same `var(--sticky-top)` + ticker height that the table headers already use).
- **Header decluttered on phones.** The live clock is hidden on ≤640px (phones already show time in the system status bar); the four icon buttons (inbox / theme / text-size / RSS) now have a min 34px tap zone instead of the previous 30px borderline-pixel size.
- **Touch targets bumped.** `.btn` minimum height bumped to 36px on mobile (was effectively 24–28px depending on padding). Apple's HIG recommends 44px; we're at 36 to keep density acceptable for users who actually do want to see a lot at once.
- **Modal padding tightened to 16px** on phones (from 22px) so the dialog content gets a few more pixels of horizontal breathing room on 320–360px screens.

### v0.7.55 — 2026-05-15 — 💡 Light theme audit
- **Fixed unreadable price-movement colors on light theme.** `.px-up` (small uptick) and `.px-down` (small downtick) used pale mint/pink (`#6ee7b7` / `#fca5a5`) baked into the dark-theme palette — on white they nearly disappeared. Light-theme override bumps them to the same readable green/red used for strong moves (`#059669` / `#dc2626`).
- **Past-month dividend bars** in the dividend timeline used a hardcoded dark-navy gradient (`#5a6e8a → #2a3548`) that looked like a wet ink stain on light theme. Switched to a muted slate gradient (`#cbd5e1 → #94a3b8`) on light theme; their white text labels also swap to dark slate so the past-month chip stays readable on a pale bar.
- **Auth-bar Google button border** bumped from `#ddd` to `#bfc5ce` on light theme so the button doesn't visually fuse into the auth bar's pale background.
- **Demo banner** gradient softened from 16% → 10% opacity on light theme so it doesn't dominate the page.
- **Audited** every hardcoded `color:#`, `background:#`, and `rgba()` value across CSS + inline styles for theme-safety. Most everything else already routes through CSS variables (`--text`, `--card`, `--border`, `--accent` etc.) and switches cleanly between dark/light. The News-share PNG card is intentionally fixed-dark (it's a branded export image, not in-app UI) and was left alone.

### v0.7.54 — 2026-05-15 — 🎬 Demo mode (?demo=1)
- **Realistic sample portfolio at `?demo=1`.** Loads a 10-position mix (AAPL, MSFT, SCHD, ABBV, KO, T, VICI, BAC, AMZN, GOOG) split across two sample accounts (Roth IRA + Taxable), with 6 months of synthetic daily history on a $40k base, two realized sales for the Realized P/L panel, and pinned prices for deterministic snapshot math. Lots match the cost-basis fields so the Unrealized P/L panel shows a believable mix of winners and losers; sectors render across the snapshot doughnut.
- **Persistence layer fully neutralized.** In demo mode, `saveLocal` / `saveToCloud` / `savePrefs` / `logActivity` all short-circuit; the Firestore handle is set to `null` so even a stray write attempt can't reach a real user's doc; `loadPrefs` returns an in-memory cache seeded with demo history. Returning to your real session is a one-click "Exit demo" button in the banner that strips `?demo` from the URL.
- **External integrations stubbed.** `fetchAllNews`, `fetchAllPrices`, `refreshAllFundamentals`, SnapTrade card + Brokers tab all show "Demo mode" placeholders instead of network calls — no API keys consumed and no risk of malformed sample data hitting any provider.
- **Demo banner.** Purple/cyan gradient banner at the top of the page with a pulsing dot, "🎬 Demo Mode — sample portfolio, none of your data is saved." plus an Exit demo button. Auth bar is hidden so demo mode owns the top-of-page messaging.
- **Sign-in disabled.** `signInGoogle()` shows a toast instead of opening the popup; `onAuthStateChanged` doesn't bind in demo mode so cloud-load + reminder check + auto-sync never run.

### v0.7.53 — 2026-05-15 — 📊 SPY benchmark overlay on Portfolio Value Over Time
- **S&P 500 (SPY) comparison line added to the Portfolio Value Over Time chart on the All tab.** The chart now plots a second dashed-yellow line showing what SPY did over the same date range as your portfolio, normalized so both lines start at the same Y — apples-to-apples percent comparison. Legend row under the chart title shows both lines' percent change side-by-side ("Your portfolio +3.2% · S&P 500 +1.8%"). Hover tooltip extends to "2026-05-12 · $123,456 · SPY $124,180".
- **Toggle button "✓ SPY / ○ SPY"** next to the chart's Share button. Persisted to `prefs.showSpyBenchmark` and synced cross-device through the existing prefs merge flow. Default ON.
- **New shared `/benchmarks/SPY` Firestore collection** following the same dedup pattern as `/fundamentals/`: one user's AlphaVantage fetch warms the cache for everyone (24h TTL, daily-close granularity). Field-allowlist write rules prevent stuffing portfolio/PII data into the doc. Auto-warm fetch fires once on chart render if the cache is stale or empty AND the user has an AlphaVantage key configured; otherwise the chart silently falls back to portfolio-only. Non-trading-day dates (weekends/holidays) walk back up to 7 days to find the previous trading day's close so the lines stay aligned.
- **AlphaVantage endpoint:** `TIME_SERIES_DAILY` with `outputsize=full` (~20yr history). One request, shared cache, no per-user cost.

### v0.7.52 — 2026-05-06 — 🔔 Notifications inbox + worker reminder coverage warnings
- **Notifications inbox.** Every toast now persists to `prefs.notifInbox` (capped at 100 entries, deduped within 1s for burst spam). New 🔔 bell button in the header shows an unread badge; click to open the inbox modal with timestamped entries color-coded by type (warn/error/info). "Mark all read" + "Clear" buttons; entries auto-mark read 800ms after opening. Caller can pass `{noinbox:true}` to `showToast()` for trivial UI feedback ("PNG saved") that shouldn't pollute the inbox. Persisted to Firestore via the same `prefs` merge flow that survives reloads.
- **Worker reminder emails now warn on weak dividend coverage.** Daily reminder cron (`stocks-worker` v0.6.0) reads each reminder's ticker from the shared `/fundamentals/{ticker}` Firestore collection (populated by v0.7.42's Insights fundamentals fetcher). When the operating-cash-flow ÷ dividends-paid coverage ratio is below 2×, the email adds an inline warning to that ticker's card:
  - **At risk** (red): coverage < 1× — dividend funded by debt or asset sales
  - **Tight** (yellow): coverage 1–1.5× — watch for policy changes
  - **OK / Strong**: silent (no clutter)
  - **No data**: silent (cache miss = no warning)
  Stale data (>180 days old) is ignored to avoid flagging companies based on numbers that have since improved.
- Email branding updated from "Portfolio Command Center" to "Stockfolio" in the footer.

### v0.7.51 — 2026-05-06 — Settings reorganized + Test email button
- **Settings tab reorganized into 6 labeled sections.** Cards were piling up in arbitrary order (~14 of them by now). New section headers using `column-span:all` so they stretch across both masonry columns: 👤 Account, 🎨 Appearance & Audio, 🔔 Notifications, 💰 Money & Taxes, 🏦 Brokerage & Accounts, 🔑 API Keys, 💾 Data & Activity. Each header has a small italic description on the right so the grouping is obvious at a glance. The cards themselves move to the section they belong in (Export & Import to Data, Manage Accounts and SnapTrade together under Brokerage, etc).
- **Duplicate "Import / Export" card removed.** The old simpler JSON-only Import/Export card was orphaned after v0.7.34's more comprehensive Export & Import card landed; cleaned up.
- **📨 "Send test reminder email" button** in the Dividend Reminders card. Hits the worker's existing `/run-reminders` endpoint — same code path the daily cron runs at 14:00 UTC. Returns a result summary toast ("📨 1 email(s) sent" or "No reminders due today — cron would skip too"). Restricted to `OWNER_UID` server-side per the Path B single-user model.

### v0.7.50 — 2026-05-06 — Mobile news Share button
- **Share PNG button added to mobile news cards.** Desktop news rows had `💾 Share` in the expanded panel since v0.7.36, but the mobile `.mk` cards rendered only the "Read article →" link. The mobile loop now captures the same `i` index the desktop loop uses, and `shareNewsAsPNG(idx)` reads the article data from the desktop table row by ID — which exists in the DOM even when hidden on mobile (via `.dt{display:none}`) — so the off-screen "share card" composition still works correctly. Tapping Share builds the same polished PNG as desktop without expanding/collapsing the card (stopPropagation on the click).

### v0.7.49 — 2026-05-06 — Cloud-prefs merge + manual re-sync
- **Cloud-load now merges instead of overwriting.** `loadFromCloud` was doing `savePrefs(d.prefs)` which wholesale replaced local prefs with cloud's version. If you'd entered an API key (or set the SnapTrade ignore list, etc.) on a device *before* signing in, that pref existed locally only — and the first cloud sync after sign-in clobbered it because cloud lacked the field. Same bug on a fresh device when cloud has stale data: local-only changes died on first sync. Fix: `Object.assign({}, localPrefs, cloudPrefs)` — cloud wins on overlapping keys (cross-device source of truth) but local fills gaps for keys cloud doesn't have. The merged prefs is then saved back to cloud, so any local-only fields propagate up. Self-heals devices where prior versions had clobbered settings.
- **"↻ Re-sync settings from cloud" button** in Settings → Finnhub API Key card. Manually re-runs `loadFromCloud` with the new merge logic. Use it any time a setting from another device hasn't shown up — pulls API keys, ignore list, tax bracket, dividend goal, sound prefs, all of it. The auto-sync on sign-in now works correctly too, but the button is the explicit recovery path.

### v0.7.48 — 2026-05-06 — News rows persist + Current Price column rename
- **News-row expansion now survives re-renders.** News uses index-based row IDs (n0, n1…) which shift whenever a new article arrives or prices update — so an open article would snap shut on every background refresh, same family of bug as v0.7.47's Insights fix. Each news `.xr` row now carries a `data-stable-key="<ticker>|<title>"` attribute. `tog()` captures the key when opening; `restoreOpenPanels()` falls back to a stable-key DOM lookup when the cached row ID no longer matches (and refreshes the cached ID to the new index).
- **"Price" columns renamed to "Current Price"** across News, Dividends, Growth, All tabs (desktop tables), the Brokers-tab positions table, and the dividend mobile-card label. Disambiguates from historical price columns elsewhere (Sells panel, DRIP history) which keep their plain "Price" header since those are *transaction-time* prices, not current.

### v0.7.47 — 2026-05-06 — Insights cards stay open during auto-warm
- **Expanded Insights cards no longer snap shut** when the fundamentals auto-warm fires off Firestore reads in the background (~20–30s on first tab open). Two fixes: (1) tracks expanded card state in a `_expandedInsightCards` set updated by `toggleInsightCard()` and re-applied after every `renderInsights()` HTML rebuild; (2) added `renderInsightsDebounced()` — auto-warm fetch resolves and the periodic refresh-progress paints now coalesce into one repaint per ~250ms instead of ~73 thrashes during a typical portfolio's load. Click a card during a refresh; it stays open. Final post-refresh paint stays direct (not debounced) so the completed state appears immediately.

### v0.7.46 — 2026-05-06 — Insights label cleanup + Goal Progress bar
- **Renamed Insights column "Current Cashflow" → "Annual Income".** That column shows your dividend dollars from each position (`shares × per-share div`) — confusing it with "cashflow" overloaded the term, since real cashflow (operating cash flow, the company-level metric) lives in the expanded detail row beneath each card. Annual Income is unambiguous.
- **Goal Status redesigned as a real progress bar.** Was a single line of text reading "$3,070 gap to $8,100 target" — readable but ugly and underused the slot. Now: current/target amounts on top with the % progress on the right, a horizontal gradient progress bar below it, and a footer line ("$3,070 remaining · ranking below shows how to close it fastest" or 🎉 reached). When no goal is set, an inline CTA button jumps to Settings → Annual Dividend Goal and focuses the input.

### v0.7.45 — 2026-05-06 — Ticker/thead flush stack (next layer down)
- **Same gap fix applied to the ticker→thead boundary.** v0.7.44 closed header→ticker; the ticker→thead seam still showed a 1–2px gap at certain scroll positions because the ticker's `margin-top:-1px` overlap meant its actual visual bottom was 1px above where `--thead-top` was computed to start. Two fixes mirror the header→ticker pattern: (1) `syncStickyTop` now sets `--thead-top` to `headerHeight + tickerHeight - 1` (subtracting the ticker's overlap shift). (2) Table thead's CSS uses `top: calc(var(--thead-top) - 1px)` for an additional defensive 1px overlap with the ticker bottom. The whole sticky stack — header, ticker, thead — now overlaps adjacent rows by 1px each so no sub-pixel rendering drift can show a gap.

### v0.7.44 — 2026-05-06 — Header/ticker flush stack
- **Header/ticker gap (still visible after v0.7.40) closed for real.** Two compounding issues: (1) `Math.ceil(getBoundingClientRect().height)` rounded sub-pixel header heights UP, pushing the ticker ~0.5px below where the header actually rendered. Switched to `offsetHeight` which the browser snaps to the integer device-pixel grid, matching exactly where the next element starts in flow. (2) Even with perfect measurement, browser sub-pixel rendering can vary between paint frames, so the ticker now uses `top: calc(var(--sticky-top) - 1px)` and `margin-top:-1px` to force a 1px overlap with the header bottom. Better to overlap by a hair than leave any gap visible.

### v0.7.43 — 2026-05-06 — SnapTrade ignore list
- **Per-user SnapTrade ticker ignore list** in Settings → Connect Brokerages. Comma- or space-separated, case-insensitive. Tickers in the list are filtered out of `_stBuildDiffForAccount` before the diff modal renders — so cash-account pseudo-tickers (FCASH, SPAXX, CASH, etc.) and any other non-stock entries SnapTrade reports never prompt you to sync them again. Stored in `prefs.snaptradeIgnoreTickers` (Firestore-synced across devices). Same list also suppresses the cross-account duplicate warning since ignored tickers don't generate ADD rows.

### v0.7.42 — 2026-05-06 — Company cash flow + shared fundamentals cache
- **Company-level cash flow integrated into Insights.** Each card's expanded detail now shows operating cash flow, free cash flow, dividends paid, and the **OCF/dividends coverage ratio** for the most recent annual period — color-coded green (≥2× comfortable) / yellow (1–2× tight) / red (<1× at risk). Sourced from AlphaVantage's `CASH_FLOW` endpoint.
- **Payout Safety score now blends rating + coverage ratio** (60% rating + 40% coverage). Catches the "rated Aristocrat but coverage now 0.8×" scenario where a backward-looking rating misses a forward-looking risk. Falls back to pure rating when CF data isn't available yet (e.g. AV key not set).
- **Shared `/fundamentals/{ticker}` Firestore collection.** Public-company fundamentals are deduplicated across all signed-in users — your fetch of AAPL benefits everyone holding AAPL on every device they sign in on. New top-level Firestore collection with strict rules: read by any authenticated user, write only with the exact field allowlist (`ocf, fcf, divPaid, coverage, fetchedAt, period, symbol, source`) and `symbol` matching the doc ID. Per-user portfolio data (`/portfolios/{uid}`) is **completely separate** and remains owner-only — no risk of leakage. Source rules are checked into the repo at `firestore.rules`.
- **Three-tier read flow** — in-memory `FUND[ticker]` (instant) → shared Firestore (free, benefits from any user's prior fetch) → AlphaVantage (last resort). Cache TTL 90 days since CF reports quarterly. Browser also persists to `localStorage.pf_fund` for instant boot before sign-in.
- **"↻ Refresh fundamentals" button** on the Insights tab — explicit user-triggered fetch that throttles to 1 ticker per 13s to stay under AV's free-tier 5/min limit. Writes results to the shared Firestore collection so subsequent calls (you on mobile, you tomorrow, anyone else holding the same tickers) read from cache instead.
- **Auto-warm on tab open** uses Firestore reads only (free) — never auto-hits AlphaVantage so your 25/day quota isn't burned just by browsing tabs.

### v0.7.41 — 2026-05-06 — Insights: current cashflow column
- **New "Current Cashflow" column** on each Insights ranking card. Shows annual dividend income from the position (`shares × per-share annual div`) plus a smaller "$X/mo avg" sub-line so you can compare at-a-glance which positions pull weight in cashflow vs. which are dead weight relative to their size. Hover for the full math (shares × per-share = total). Stocks with zero shares show "—".
- **Column header row** added above the cards labeling each column (rank / ticker / yield / cashflow / why / suggested add / score). Helps when the rows blur together. Header collapses on mobile (≤760px) along with yield/why/suggested-add columns; cashflow + score stay visible on small screens since they're the most important comparison metrics.
- **Mobile layout polish** for the Insights cards — cashflow is left-aligned on mobile (was right-aligned on desktop) so it sits naturally next to the ticker symbol.

### v0.7.40 — 2026-05-06 — Header/ticker gap + Settings sync fix
- **Gap between header and scrolling ticker eliminated.** Was ~2px on desktop, much wider on mobile when the header wraps into multiple rows (logo + clock + portfolio-value + annual-income + 4 market boxes + 3 toggles all wrapping). Two fixes: (1) `syncStickyTop` no longer adds a +2 buffer to the measured header height — the ticker now sticks flush at exactly `top:headerHeight`. (2) `syncStickyTop()` is called from `render()` so the sticky offset re-measures every time stat boxes / market tickers populate or wrap to new rows. Also fires from `sTab()` on tab switch so layout shifts there don't strand the ticker.
- **Settings inputs re-populate from prefs on every open of the Settings tab.** If the auth callback / cloud sync completed *after* the page initially rendered the Settings inputs (common on mobile + slow networks), tax bracket and dividend goal could appear blank even though `prefs.taxBracket` / `prefs.dividendGoal` had synced to localStorage. `sTab('settings')` now calls `loadPrefUI()` on entry to refresh every Settings input from the latest prefs — opening the Settings tab is now the manual recovery path if values ever look out of sync.

### v0.7.39 — 2026-05-05 — 🔊 Sound Settings — three independent channels
- **Settings → Sound Settings** replaces the old "News Notifications" card. Three independent channels — News, UI/Save, Reminder — each with its own enabled toggle, sound picker, and volume slider (0–100%, saved to prefs as `prefs.sound.channels.<channel>.{enabled,sound,volume}`). A master mute toggle at the top silences everything regardless of per-channel state. All values save automatically on change; per-channel slider updates the live label as you drag and plays the test sound on release.
- **Three more sound presets** added — `blip` (short low square tone, default for UI/Save), `swoosh` (descending sine, two-tone), `click` (barely-audible UI feedback). Together with the existing chime/ding/pop/bell that's seven options per channel.
- **Volume slider per channel.** `SOUNDS.<name>(v)` now takes a 0–1 multiplier so each channel's slider position scales the gain independently — turn UI down to 20% but keep News at 80% if save toasts are noisier than article alerts.
- **Toasts now play the UI channel by default;** news fetches play the News channel; ex-date/pay-date reminders play the Reminder channel. Calls that were producing two stacked sounds (e.g. `showToast(); playNotifSound();` on a reminder) now use `showToast(msg, '', {silent:true})` + `playSound('reminder')` so only the reminder tone fires.
- **Migration from old prefs is automatic.** Existing `prefs.notifEnabled` / `prefs.soundMuted` / `prefs.soundChoice` are read once on first load by `_ensureSoundPrefs()` and seed the new `prefs.sound` structure with sensible defaults — News inherits the user's old single sound choice; UI gets `blip` at 35%; Reminder gets `bell` at 55%. Legacy fields stay in prefs for backwards-compat with older clients.
- **Per-channel test button** previews the live slider value (so you can drag the volume to "5%" and click test before committing).

### v0.7.38 — 2026-05-05 — 🎯 Insights tab — dividend expansion ranking
- **New "🎯 Insights" tab** between All and Settings. Ranks every dividend stock you own by how efficiently each one would close the gap to your annual dividend goal. Pure local computation — no extra API calls; reads `tks` / `sh` / `lots` / `DV` / `PR` and `prefs.dividendGoal` / `prefs.taxBracket`.
- **Composite 0–100 score** blends five components with these weights: Yield 30% · Payout safety 25% · Tax efficiency 15% · Sector diversification 15% · Goal impact (annual divs per $1k invested) 15%. Each component gets its own progress bar in the per-row detail view so you can see the breakdown.
  - **Yield points:** linear 0% → 0pts, 5%+ → 100pts.
  - **Payout safety:** rating-keyed table — King 100, Aristocrat 92, Excellent 86, Strong 80, Good 70, Stable 62, Moderate 50, Variable 40, Caution 25.
  - **Tax efficiency:** Qualified gets a bonus that scales with your bracket (32%+ bracket → 100pts, 22%+ → 90, lower → 80). REIT/Foreign/Non-qualified score 40–50; Collectibles/K-1 score 20–25.
  - **Sector diversification:** stocks in sectors that are <8% of your portfolio get 100pts; clamped to 35 above 30%.
  - **Goal impact:** annual dividends per $1000 invested, normalized against the highest-yielding stock you own.
- **Per-row "+ X shares" recommendation** — automatically suggests adding shares worth ~5% of current portfolio value (or $1000 minimum), shows the resulting `+$Y/yr` and what % of the goal gap that single move closes.
- **One-line "why" reason** generated from the strongest signals: yield level, rating, position size, sector exposure, tax bucket. Click any row to expand and see the full component breakdown + the suggested-share math.
- **Two filters at the top** of the tab:
  - "Tax-advantaged only" — narrows to qualified + mixed buckets
  - "Hide already-large positions (>15%)" — defaults on; useful for finding under-loaded names
- **Summary header** — current annual dividends, goal status (gap or "✓ reached"), stocks ranked, average score across the filtered list.

### v0.7.37 — 2026-05-05 — Share UX + ticker + version polish
- **Per-chart Share buttons** on the All-tab Snapshot. The single "Share Snapshot PNG" mega-button at the top is gone — replaced with a small 💾 Share button on each individual chart's title row (Sector Allocation, Account Allocation, Top Holdings). Each saves just that chart as a PNG. Tax Outlook, Realized P/L, and the History Chart already had per-panel buttons; they're now consistent.
- **Share buttons no longer appear in the captured PNG.** Added a `.share-btn` class to every Share button + a `body.capturing-png .share-btn { visibility:hidden }` rule. The PNG helper toggles `body.capturing-png` around the html2canvas pass so all share buttons are invisible during capture, then visible again right after. The download still works because they're hidden, not removed.
- **"PNG" stripped from button labels** — they all say just 💾 Share now (the file is obviously a PNG; redundant in the label).
- **Day-change arrows in the ticker now persist across reloads.** `liveChanges` was being populated only at fetch time and reset to `{}` on every page load, so the ticker showed prices but no ▲/▼ until the next price refresh. Now persisted to `localStorage.pf_changes` alongside `pf_prices` and rehydrated on init — so arrows show up immediately after reload.
- **Version badge moved to the auth bar** — small monospace pill (`v0.7.37`) sits to the right of the CLOUD SYNC / Synced indicator (or right of the LOCAL ONLY badge when signed out). Removed from the logo-block sub-area where it competed for space with the brand name.
- **Header → ticker gap removed.** Explicit `margin-top:0` + `border-top:0` on `.tk-ticker` plus an adjacent-sibling rule on `header.header + .tk-ticker` so the two flush together cleanly.

### v0.7.36 — 2026-05-05 — Logo, 404, ticker, collapsibles, PNG share
- **Logo finalized** — option 2 (stacked candlesticks) is now the live mark in `#logo-default-mark`. The 5-option preview page (`logo-preview.html`) was removed since selection is done.
- **Branded `404.html`** at the repo root for any future deep-link 404s. Stockfolio mark, the path the user requested displayed as `/?…`, "Back to Stockfolio" CTA, "View on GitHub" link, and a tape-strip of sample tickers. `noindex` so it doesn't show up in search results.
- **Header layout fix.** Date+time clock no longer sits orphaned on the right — logo block + clock are now grouped tightly on the left with a thin vertical divider between them. Time font bumped from 13px → 17px. The redundant date that used to appear in the logo-sub line ("73 tickers · 45 dividend · 5/5/2026") is dropped — the live clock to the right of the logo covers it.
- **Ticker repositioned + made sticky** — moved from above the header to below it (sandwiched between header and tabs) and pinned with `position:sticky` at `top:var(--sticky-top)` so it slides under the header but stays visible while scrolling. Table thead's sticky-top bumped to `--thead-top` (= header height + ticker height) so column headers don't get hidden behind the ticker. Items now show a colored arrow + day-change %: ▲ green when up, ▼ red when down, ▬ muted when flat (sourced from `liveChanges[t]`).
- **Ticker scroll speed slider** in Settings → Appearance. Drag from 60s (fast) → 300s (slow), default 150s. Persisted to `prefs.tickerSpeed` and applied via `--ticker-speed` CSS variable; live-updates while you drag.
- **Collapsible cards on Brokers + Accounts tabs.** Click any broker/account header to collapse/expand. State persisted per-card in `prefs.uiCollapsed` (separate scopes for `brokers` and `accounts`). Each tab gets an "⊕ Expand all" / "⊖ Collapse all" toolbar; the Brokers toolbar auto-hides when no accounts are connected.
- **Sync timestamp tooltips.** Hovering "synced just now" / "modified Apr 30" now shows the absolute date+time. New `_acctLastUpdateInfo()` returns both the friendly label and the raw ts; `_absTimeTitle()` formats for the tooltip.
- **PNG sharing** via `html2canvas` (loaded from CDN, ~50KB, deferred). Added `💾 Share` buttons in:
  - News rows (in the expanded panel, next to "Read full article") — builds a clean off-screen "share card" with the Stockfolio logo + ticker + headline + summary + source + date, then captures that. The exported PNG looks like a polished social-share image, not a screenshot of a table row.
  - All-tab Snapshot panel (top-right of the snapshot block, captures everything: stats, charts, tax outlook, realized P/L, history)
  - Tax Outlook subpanel
  - Realized P/L subpanel
  - Portfolio Value Over Time chart
- **Generic share helper** `_sharePanelAsPNG(el, filename, label)` handles the html2canvas call + blob download + activity log entry. Filenames format as `stockfolio-<label>-YYYY-MM-DD.png`.

### v0.7.35 — 2026-05-05 — Stockfolio rebrand + header/UX polish
- **Rebranded to "Stockfolio"** — title, footer, header logo word, page meta. New SVG logo (folio outline + rising bar chart) replaces the 📊 emoji. The logo lives in `#logo-default-mark` and is easy to swap; four alternate SVG concepts are listed in the v0.7.35 PR description for picking a different style.
- **Header restructure.** Date + time slid to the LEFT next to the logo block (no background, simple monospace stack with a faint left border). Clock badge style retired. The right-side action cluster now groups: stat boxes, market tickers, API-error badge, then a tight trio of quick-toggle buttons (🌓 theme cycle, **A** text-size cycle, 📡 RSS) with a clear visual gap before the auth bar's Sign Out.
- **Click your username (or avatar) in the auth bar to open the full account-info modal.** Same content as Settings → Your Account but reachable in one click without leaving the page you're on.
- **Scrolling portfolio ticker** between the auth bar and tabs. Marquees through every ticker in your portfolio with its last cached price (uses `livePrices` — no extra API calls, no rate-limit cost). Pauses on hover. Hidden until you have at least one priced ticker. Dedupes so a ticker only shows once even if it's in multiple lots/accounts.
- **Tax Outlook side card compacted.** Was a tall vertical stack with a lot of empty space next to the big tax number; now a 2-row layout with the headline + tax total side-by-side, breakdown only shown when more than one category contributes, and after-tax income on a single horizontal line. Cuts the panel height roughly in half on most portfolios.
- **News-row "read" tracking.** Hold a news row open ≥1.5 seconds and it's marked as read in `prefs.newsRead` (keyed by ticker + title hash, capped at 500 entries). Read rows get a subtle ✓ marker in the first column and slight opacity dim; freshly-marked rows get a brief green pulse so you can see the transition fire. Closing the row before 1.5s cancels the timer.
- **Last-update label per account.** Brokers tab cards, Accounts tab cards, and Settings → Manage Accounts list rows now show "synced X mins ago" for SnapTrade-mapped accounts (using `stApiState.lastFetched`) and "modified X ago" for manual / M1 CSV / unsynced accounts (using the most-recent `lot.added` at that account). New `_relTimeShort()` helper produces friendly relative labels (just now / 5m ago / 2h ago / Apr 30).

### v0.7.34 — 2026-05-05 — M1 Finance CSV import + Holdings-by-Lot polish
- **M1 Finance Holdings CSV import.** New "Import M1 Holdings CSV" button on Settings → Export & Import card. Parses M1's official Holdings summary export (Symbol, Quantity, Avg. Price columns), shows an ADD/UPDATE/NOOP diff against existing lots at a target account name (defaults to the first existing M1-named account, falls back to "M1 Finance"), and applies on Apply. Imported lots are tagged `src:'m1csv'` and surface in the deep-dive Holdings-by-Lot view as a purple **💾 M1 CSV** pill alongside the existing 🔗 SnapTrade marker — so manual / synced / imported lots are all visually distinguishable. Re-importing the same file later UPDATEs share counts to the new values. The Settings card includes the M1 export instructions inline so future-you doesn't have to remember the path (Invest → account → Holdings → ⋮ → Holdings summary).
- **Imported Portfolio JSON now lives in the same card** for symmetry. Existing Full Portfolio JSON export is unchanged.
- **Holdings-by-Lot Account cell layout fixed.** The SnapTrade pill was wrapping mid-word inside the `.bd` clickable account span when the account name was long ("Schwab - Commons" + "🔗 SnapTrade" couldn't fit on one line and the badge text broke as "SnapTrad / e"). Restructured into an inline-flex wrapper with `flex-wrap:wrap` so the badge cleanly drops to a second row when the cell is narrow. Account name pill is now `white-space:nowrap` so it stays in one piece regardless. Same wrapper handles the new M1 CSV badge.

### v0.7.33 — 2026-05-05 — Brokerage logos on Brokers tab
- **Each broker card on the Brokers tab now shows the brokerage's logo on the left** at the height of the 2 header rows (account name + meta). Sourced from logo.dev's `/{domain}` endpoint. New `_BROKERAGE_DOMAINS` mapping covers ~40 common brokers (Charles Schwab, Fidelity, Vanguard, TD Ameritrade, E*TRADE, Robinhood, Webull, Public, M1, SoFi, Interactive Brokers, Tastytrade, Wealthfront, Betterment, Alpaca, Coinbase, Kraken, Gemini, Cash App, Stash, Acorns, Wealthsimple, Questrade, Merrill, Morgan Stanley, JP Morgan, Chase, Ally, Firstrade, TradeStation, Trading 212, plus the major Canadian banks). Substring match handles things like "Charles Schwab Inc." Falls back to a 2-letter text badge when logo.dev has no match. SnapTrade-provided `brokerage.logo_url` is preferred when present.

### v0.7.32 — 2026-05-05 — Auto-refresh SnapTrade on page load
- **SnapTrade Brokers tab + "N connected accounts" line on the Settings card now populate automatically on every page load** (when a userSecret is stored). Previously `stApiState.accounts` reset to `[]` on each reload and only repopulated when the user clicked Refresh — which made the Brokers tab look broken right after a hard reload even though the SnapTrade-side connection was alive. Fix: fire-and-forget call to `snapTradeRefresh()` immediately after `loadFromCloud()` resolves, when `stApiState.userSecret` is present. Failures surface in the existing red error block on the Brokers tab + Settings card.

### v0.7.31 — 2026-05-05 — Real account delete (with lots) + per-card delete button
- **Rename + Delete buttons on each account card on the Accounts tab.** Previously you had to bounce to Settings → Manage Accounts to do either, but Accounts is where you actually look at the data — so the controls live there now (along with the existing per-card sync badge and totals).
- **Account delete now offers a destructive vs unassign choice.** The original delete just cleared the account label on lots ("Schwab" lots became "Unassigned" but stuck around). For cleanup scenarios — like a manual account that SnapTrade just replaced with a synced one — you usually want the lots gone too. New flow: first confirm shows the scope ("Schwab has 12 lots — 47 shares total, $5,210 value, some are SnapTrade-managed"), then a second confirm asks "Click OK to DELETE the account AND all 12 lots. Click Cancel to keep the lots — they'll just lose their account label and become 'Unassigned'." Either path also clears the entry from `prefs.snaptradeAccountMap` so SnapTrade sync won't re-target it. If destructive delete empties a ticker entirely (no lots remaining anywhere), the ticker is removed from the portfolio too.

### v0.7.30 — 2026-05-05 — Backup modal stacking fix
- **"Apply Selected" in the sync diff modal was opening the pre-flight backup prompt behind the sync modal.** `.sync-overlay` is z-index:1000 but `.modal-overlay` is z-index:200, so when the v0.7.25 backup-before-sync prompt fired from inside Apply Selected, the modal opened invisibly underneath the sync overlay — visible only as a slightly darker background. Bumped `#backupMod` to z-index:1500 so it stacks above the sync overlay.

### v0.7.29 — 2026-05-04 — SnapTrade signature diagnostics
- **"Run diagnostics" button on the SnapTrade error block** (both Brokers tab and Settings card). Calls a new worker endpoint `GET /debug-snaptrade` (worker v0.5.2) and renders the result inline: whether the consumer key is set, its length and 3-char fingerprint, whether it has stray whitespace from a bad paste, and the result of running a signed test call (`/snapTrade/listUsers`) using the same signing code path as `/register`. Verdict line tells you exactly what to do — most commonly "Consumer Key in Cloudflare doesn't match SnapTrade — re-run `wrangler secret put SNAPTRADE_CONSUMER_KEY`." This catches signature errors (code 1076 / "Unable to verify signature sent") without needing dev tools or curl. Endpoint is OWNER_UID-only and never returns the actual key value, just a fingerprint.

### v0.7.28 — 2026-05-04 — SnapTrade error visibility + feed.xml deprecation
- **Generic "Try again or check the Brokers tab" toast removed.** v0.7.26 added a fallback toast in `snapTradeConnect` that overwrote the more detailed toast from `snapTradeRegister` (which already includes SnapTrade's actual error message). The Connect flow no longer double-toasts on register failures — the detailed message stays visible.
- **Brokers tab now actually shows the error** (when there is one). New error block at the top of the Brokers-tab empty state and on the Settings → SnapTrade card: red-bordered card with the error headline, the SnapTrade detail in monospace, a "Copy details" button that puts a structured error report on the clipboard (version + timestamp + error + detail + UA), and a hint that links the user to the duplicate-user retry path. So "check the Brokers tab for details" is now a real instruction.
- **feed.xml deprecation.** The static `feed.xml` at the repo root has been stale for 25+ days because it was hardcoded demo data from before the in-app live news feed existed. Replaced with a single-item RSS deprecation notice (still a valid feed so feed readers don't error, just shows "this feed is no longer updated — use the in-app RSS panel"). Deleted the unused `generate-feed.js`. Removed the misleading `<link rel="alternate" href="rss.xml">` (rss.xml never existed). RSS panel UI now explains that the public URL is deprecation-only and the in-app feed below it is the live source.

### v0.7.27 — 2026-05-03 — Toasts top-center + actual /register recovery
- **Toasts moved to top-center.** Bottom-right meant warn/error notifications were easy to miss when looking at the active part of the page. Now pinned `top:20px; left:50%; translateX(-50%)`. Width auto-fits up to 90vw, slides down on show. Warn and error toasts hold for 5.5s (was 2.5s) so they can actually be read.
- **SnapTrade detail surfaced in the toast.** Previously `callWorker` only showed the worker's generic error envelope ("registerUser failed") and buried SnapTrade's actual message in `console.error`. Now it digs into the response detail (`message+code` or `errorMessage+errorCode`) and appends it to the toast — so you can see what SnapTrade actually said without opening dev tools.
- **/register fallback actually works now.** v0.7.26's `resetUserSecret` path didn't work because that endpoint requires the existing userSecret (which is what we lost in the first place). Replaced with a proper recovery flow: when the worker reports `canRetryFresh:true` (Firebase UID was already registered with SnapTrade), the app shows a confirmation dialog explaining the situation — including SnapTrade's actual error message — and on confirm, hits `/register?fresh=1` which generates a new userId of form `${firebaseUid}_${randomSuffix}`. Worker's downstream auth checks now accept any `userId` that starts with the authenticated Firebase UID, so the recovery flow doesn't break later API calls. **Tradeoff:** any brokerages connected under the original userId become orphaned on SnapTrade's side and need to be reconnected through the portal.

### v0.7.26 — 2026-05-03 — SnapTrade /register recovery
- **Connect-after-backup no longer dead-ends.** The v0.7.25 backup prompt was working correctly — it was downloading the backup and calling `snapTradeRegister()` — but if the user's Firebase UID had ever been registered with SnapTrade before (and the userSecret was lost from prefs, e.g. fresh sign-in or wiped storage), SnapTrade's `registerUser` returns 400 "user already exists" and the connect popup never opened. Two fixes: (1) **Worker v0.5.0** now catches that 400 and falls back to `resetUserSecret` to mint a fresh userSecret for the existing user, returning `recovered:true` in the response. (2) The app shows a "Reconnecting to existing SnapTrade account" toast when recovery happens, and a clearer "Registration failed: <detail>" toast when register actually does fail (so it no longer looks like the modal silently closed). Note: any brokerages connected before the secret reset will need to be reconnected via the portal.

### v0.7.25 — 2026-05-03 — SnapTrade safety: backup prompts, source tags, dup warnings
- **Pre-flight backup prompt** appears before connecting your first SnapTrade brokerage and before applying a sync. New modal with three buttons — "Download backup, then continue" (one-click triggers the JSON export then proceeds), "Skip backup, continue anyway", or "Cancel — don't connect". Shows a quick stats line (N tickers · M lots · K accounts · tracked value · realized count) so you can see what you're putting at risk. Skipped automatically if you have no portfolio data yet (first-time setup, nothing to lose) or if you exported a backup within the last 2 minutes (avoids double-prompting at connect-then-sync time).
- **🔗 SnapTrade tag on synced lots.** When sync applies an ADD or UPDATE, the lot now stores `src:'snaptrade'` plus the source `snapAcctId`. The deep-dive Holdings-by-Lot row shows a small "🔗 SnapTrade" pill next to the account name on those lots, with a hover tooltip warning that manual edits will be overwritten on next sync. Settings → Manage Accounts and the Accounts tab also show a 🔗 next to any account that's mapped via SnapTrade or has any synced lots, so you always know which accounts the sync owns vs. which are purely manual.
- **Cross-account duplicate warning in the diff modal.** When sync proposes to ADD a ticker to a NEW account, but that ticker already exists at one or more OTHER accounts, the row gets a yellow warning underneath: "⚠ AAPL already exists at: 12 @ Robinhood · 5 @ Fidelity. Adding here will not affect those — if you meant to update one of them, change the 'Map to' selector above." This is the most common way to accidentally double-count: SnapTrade auto-creates a new account name (e.g. "Robinhood — Cash Account") instead of mapping to your existing "Robinhood" entry. The warning catches that before you click Apply.

### v0.7.24 — 2026-05-03 — Tax Outlook redesign + chart label fix
- **Tax Outlook panel reorganized into a 3:1 grid.** The bucket bar chart now takes the left 75%; a dedicated "Estimated Annual Tax" sidebar fills the right 25%. The sidebar leads with the tax total in a big yellow number, the effective rate ("X.X% effective") below it, then a mini-breakdown by category (Qualified @ LT rate, Ordinary @ bracket, Collectibles capped at 28%), an after-tax annual income highlight in green, and the bracket footer at the bottom. When no bracket is set, the sidebar shows a "Configure →" CTA that jumps straight to Settings → Tax Estimate and focuses the dropdown. Stacks to a single column at narrow widths (≤760px).
- **Portfolio Value Over Time chart labels fixed.** The Y-axis dollar values were being clipped at the left edge and looked vertically stretched because they were SVG `<text>` inside a `preserveAspectRatio="none"` SVG — that lets the line stretch nicely with the container width but distorts text glyphs and lets long labels render off the viewBox. Fix: moved all labels (Y-axis values + X-axis dates) out of the SVG into HTML overlays absolutely positioned around the chart wrap. The SVG now just renders the line, area fill, gridlines, and hover overlay (all of which look fine when stretched). Wrap padding-left:64px reserves space for full "$XX,XXX.XX" labels without clipping.

### v0.7.23 — 2026-05-03 — Sticky-thead fix
- **Sticky table headers now stay visible.** v0.7.21 shipped sticky theads with `top:60px`, but the page header (`.header` is `position:sticky;top:0;z-index:100`) is actually 85–95px tall — and grows when stat boxes appear after sign-in. The thead was sticking 60px down, behind the page header (z-index:90 vs 100), so it disappeared from view as you scrolled. Two fixes: (1) sticky offset is now a CSS variable `--sticky-top` set dynamically from the live `.header` height by `syncStickyTop()` on load + resize + ResizeObserver (so it adapts when the header grows after sign-in or RSS panel toggles). (2) `.table-wrap` no longer sets `overflow-x:auto` at desktop wide widths — per CSS Overflow Module L3, mixing `overflow-x:auto` with `overflow-y:visible` promotes `overflow-y` to `auto`, making the wrap a scroll container and breaking sticky's binding to the page. Horizontal scroll is now scoped to a `(max-width:1100px) and (min-width:641px)` media query for narrow desktop, and on wider screens sticky binds correctly to the page scroll.

### v0.7.22 — 2026-05-03 — Realized gains, taxes, CSV export
- **Sell workflow.** Every lot row in the deep-dive panel grew a "Sell" button. Clicking opens a modal pre-filled with the lot's shares + the current quote — adjust shares-to-sell, sell price, sell date, and (optionally) entry date, and the live estimate panel shows realized gain/loss with long-term vs short-term classification (>365 days held). Confirming records the sale to a new top-level `realized[]` array, decrements the source lot's shares (or removes it if all sold), and logs `portfolio.sell` with the gain.
- **Realized P/L panel** on the All-tab Snapshot. Shows YTD realized + all-time realized + LT/ST split + per-account breakdown bars (color-coded green/red, sized by absolute gain). Recent-sales table lists the last 8 sales with their term badge. Each row has a delete button to remove a mistakenly recorded sale (does not restore shares).
- **Tax Estimate.** Settings → Tax Estimate card with federal marginal bracket dropdown (10/12/22/24/32/35/37%) + state income tax % input. Federal LT cap-gains rate is derived: 0% if ≤12% bracket, 20% at 37%, otherwise 15%. Both panels surface the projection — Tax Outlook shows estimated annual tax on dividends (qualified at LT rate, REIT/foreign/non-qualified at ordinary, collectibles capped at 28%); Realized P/L shows YTD tax on realized gains. After-tax annual income line on Tax Outlook. Live LT/ST preview next to the inputs in Settings. Disclaimer: wash sales, NIIT, AMT, FTC offsets not modeled — not tax advice.
- **CSV exports.** Dividends tab grew an "Export CSV" button next to Recheck Stocks — dumps every payment from `DV[t].h` × current shares into one row each (date, ticker, account, per-share, shares, total, tax bucket). Realized sales also exportable as CSV (one row per sale with all columns Schedule D wants — date sold, proceeds, cost basis, gain/loss, holding days, LT/ST term). Both buttons mirrored in Settings → Export Data along with the existing JSON portfolio backup. UTF-8 BOM prefix so Excel opens them cleanly without a Unicode prompt.
- **SnapTrade SELL auto-detect.** Brokers tab → Fetch Transactions now also surfaces a "📤 Sales (last 90 days)" panel that lists every detected SELL/SOLD/SALE/negative-units TRADE activity. Each row shows IMPORTED or PENDING status, with one-click "Import" per row plus "Import All to Realized P/L" to bulk-import. Importer matches against existing lots to pull entry price + entry date when possible (falls back to no-cost-basis records), de-dupes by ticker+date+shares, and decrements the matched lot's shares. Logs `snaptrade.sell.import` for each.

### v0.7.21 — 2026-05-02 — Quick wins bundle
- **Stale price indicator.** The "Live" / "Cached" pill on the Stocks tab now color-shifts based on the age of the underlying quote: green when fresh (<10 min), amber when aging (10–30 min), red when stale (>30 min). The freshness tick re-evaluates every minute via the existing local clock loop, so a "Live" badge that stops being live degrades on its own without you having to click anything. Also surfaces the staleness in the badge title attribute (hover for "Cached 47 min ago").
- **Annual dividend goal tracker.** New "🎯 Annual Dividend Goal" field in Settings. Set a yearly target in dollars and the All-tab Portfolio Snapshot panel grows a horizontal progress bar between the stat boxes and the charts — current annual income vs. target, % to goal, plus the dollar gap remaining. Bar fills green at 100%+, accent blue while building, dim while empty. Set to 0 to hide the bar entirely.
- **Sticky table headers.** The header row on the Dividends, News, Brokers, and Activity Log tables now sticks to the top while you scroll long lists. Stays under the page's main header (60px offset) so column labels are always visible. Required switching `.table-wrap` from `overflow-x:auto` (which would clip the sticky thead) to `overflow-x:auto; overflow-y:visible` — sticky still works correctly because the page itself is the scrolling ancestor.
- **Compact density toggle.** New "Compact density" checkbox in Settings. Reduces row padding, font sizes, and gap spacing across all tables and stat boxes for users who want more rows on screen at once. Persists in `prefs.compact` (Firestore-synced) and toggles a `body.compact` class that overrides the spacing CSS variables. Defaults off — the existing comfortable density stays the default for new users.
- **Firestore doc auto-trim.** Estimates the user's cloud doc size before each Firestore write (`savePrefs`, `saveCacheToCloud`, `saveDvToCloud`) and auto-trims the high-churn fields when approaching the 1 MB hard limit (700 KB threshold). Drops oldest entries from `activityLog` (>100), `prefs.notifiedReminders` (>30 days), `prefs.history` (>365 days), and `liveNews` (>50 cached tickers). Throttled to one trim run per 30 seconds with a `_lastTrimRunMs` guard, plus a recursion guard inside `savePrefs` since the trim itself calls `savePrefs`. Surfaces a toast and `data.autotrim` activity-log entry when it fires so you know it ran.

### v0.7.20 — 2026-04-30
- **Per-type reminder toggles.** Settings → Dividend Reminders now has two extra checkboxes — "Include ex-date reminders" and "Include pay-date reminders" — so you can disable one kind without disabling reminders entirely. Both default to on for existing users. Honored by both the in-app `runReminderCheck` and the daily email cron.
- **In-app ex-date toast wording fixed.** Was "buy by today to receive next dividend" — now shows the actual trading-day-before date (skipping weekends) so the cutoff is unambiguous regardless of when you read the message.
- **Inline Settings hint** confirms the panel auto-saves on change, no Save button needed (auto-save was added in v0.7.18 along with the "Reminder settings saved" toast).

### v0.7.19 — 2026-04-29
- **Per-ticker dividend metadata (DV) now syncs to Firestore as `dvCache`.** Pay dates, ex-dates, yields, etc. for every ticker the user holds shares in. Powers the daily email-reminder cron in stocks-worker so it doesn't need to call Finnhub `/stock/dividend` itself (which is paid-tier and would also blow the Cloudflare Workers 50-subrequest free-tier limit). Writes are debounced 1.5s to avoid spam during recheck loops, and fire after each `pf_dv_custom` localStorage write plus once on auth-load completion.

### v0.7.18 — 2026-04-29
- **Reminder day windows raised from 14 to 60.** The "Days before ex-date" / "Days before pay-date" inputs in Settings → Dividend Reminders are now capped at 60 instead of 14, both in the HTML `max` attribute and the JS clamp. Saving now also flashes a "Reminder settings saved" toast so changes are visibly acknowledged.

### v0.7.17 — 2026-04-29
- **Last-refresh timestamp under every refresh-style button** — extended the v0.7.16 label to also appear under the News tab's "Refresh News" button (tracks `newsLastFetched`) and the Brokers tab's "Refresh" button (tracks `stApiState.lastFetched`). Each label updates from the data source most relevant to its button. Same monospace mini-label format as the Recheck buttons.
- **Bar-chart inline ticker labels are now readable.** The faint labels inside payout-chart and Tax Outlook bars were too washed-out at 55% opacity / 9px. Bumped to 92% opacity, 10.5px, weight 600, plus a 0/1/2 text-shadow for contrast against any bar gradient color. Past-month bars stay slightly muted (65%) to preserve the "this is past" cue.

### v0.7.16 — 2026-04-29
- **Last-refresh timestamp under each Recheck button.** Small monospace "Last refresh: HH:MM:SS" line appears under the Recheck Stocks button on the Dividends tab and the Recheck button on the Growth tab. Updates whenever a recheck completes or the price-fetch loop finishes — whichever is more recent. Persists across sessions in `pf_last_recheck` localStorage so you see the prior session's last refresh time on page open.

### v0.7.15 — 2026-04-29
- **News column reorder.** Moved the Date column to sit between Ticker and Price (was previously at the far right). Order is now: Ticker · Date · Price · Headline · Source. Date sort still defaults active.

### v0.7.14 — 2026-04-29
- **Tax tooltips no longer get clipped.** The tax-tag tooltip (e.g. RGR's "⚠ Non-Qualified") was being cut off by the `.table-wrap{overflow-x:auto}` container and rendering under other elements. Switched to `position:fixed` with a JS positioner that anchors the tooltip via `getBoundingClientRect()` clamped to the viewport. Z-index bumped to 1100 so it sits above tabs and modals. Tooltip now also wraps long text (no more `nowrap`) and has a `max-width:280px`.
- **Rating badges have explainer tooltips.** Hover a rating badge (King, Aristocrat, Strong, Caution, etc.) in any Dividends row or deep-dive panel for a plain-English description of what the rating means. New `RATING_INFO` table covers all 16 rating values. Same fixed-position tooltip system as the tax tags.
- **Payout chart bars show contributing tickers inline** — the list of tickers paying out each month now appears as a faint inline label inside the bar itself (previously hover-only via title attribute). Hover still reveals the per-ticker dollar breakdown for full detail.
- **Tax Outlook bars show contributing tickers inline too** — same pattern: each bucket bar lists the tickers that contribute to it as a faint label inside the bar.

### v0.7.13 — 2026-04-29
- **Days-until countdown badges** next to every pay-date and ex-date in the Dividends table and the dividend deep-dive panel. Color-coded: `today` green, `in Nd` (≤7) light green, `in Nd` (≤30) accent blue, `in Nd` (>30) muted gray, `Nd ago` dim gray for past dates.
- **Imminent-payout row highlight** — Dividend rows with a pay-date within the next 7 days *and* shares set get a subtle 3px green left border, so checks-incoming-soon are visually obvious.

### v0.7.12 — 2026-04-29
- **Account Allocation chart** on the Snapshot panel — slots between Sector Allocation and Top Holdings. Shows top 5 accounts by current value with "Other (N)" rollup, same horizontal-bar pattern as the other two. Three-column grid on wide desktops, two-column on tablet, single-column on mobile.
- **Yield on Cost stat** — annual dividend income on tracked lots ÷ cost basis. Surfaces when at least one lot has an entry price set; sits next to Cost Basis and Unrealized P/L. Yield on cost gets more interesting than current yield once your basis is below market.
- **Stat box "Sectors / Accounts" combined** to show both counts in one box (e.g. "5 / 3").

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
