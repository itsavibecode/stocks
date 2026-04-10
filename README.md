# Portfolio Command Center

A self-contained stock portfolio dashboard with consolidated news, dividend tracking, and RSS feed support. Runs on GitHub Pages with zero build steps.

## 🚀 Deploy to GitHub Pages

### Quick Setup (5 minutes)

1. **Create a new GitHub repo** — name it something like `portfolio-dashboard`

2. **Upload these files** to the repo root:
   ```
   index.html      ← The main dashboard (this is the entire app)
   feed.xml        ← RSS feed (also accessible at /feed.xml)
   rss.xml         ← RSS feed alias (also accessible at /rss.xml)
   generate-feed.js ← Script to regenerate RSS when news updates
   ```

3. **Enable GitHub Pages:**
   - Go to **Settings → Pages**
   - Under "Source", select **Deploy from a branch**
   - Choose **main** branch, **/ (root)** folder
   - Click **Save**

4. **Your site will be live at:**
   ```
   https://yourusername.github.io/portfolio-dashboard/
   ```

5. **Update the URLs** in `feed.xml`, `rss.xml`, and `generate-feed.js` — replace `yourusername` and `portfolio-dashboard` with your actual GitHub username and repo name.

### That's it! No build tools, no Node.js, no React compilation needed.

---

## 📡 RSS Feed

The site supports RSS in multiple ways:

| Method | URL |
|--------|-----|
| Auto-discovery | RSS readers detect it from the `<link>` tag in the HTML |
| Direct feed URL | `https://yourusername.github.io/portfolio-dashboard/feed.xml` |
| Alternate URL | `https://yourusername.github.io/portfolio-dashboard/rss.xml` |

### Subscribing
Paste your site URL into any RSS reader (Feedly, Inoreader, NetNewsWire, etc.) and it will auto-detect the feed.

### Updating the Feed
When you want to add news:
1. Edit the `NEWS` object in `index.html` (and optionally in `generate-feed.js`)
2. Run `node generate-feed.js` to regenerate `feed.xml` and `rss.xml`
3. Commit and push — GitHub Pages will deploy, and RSS subscribers get updates

---

## 📋 Features

- **News Feed** — Consolidated news across all tickers with searchable, sortable table. Click any row to expand the full article summary and link to the source.
- **Dividends** — Full dividend tracking with yield, payout dates, rating, years of dividend growth, payout ratio, and more. Click rows to expand the deep-dive panel with 18 data points per stock.
- **Growth Stocks** — Separated view for non-dividend payers with share tracking and news.
- **All Holdings** — Master table of the full portfolio.
- **Sortable Tables** — Click any column header to sort ascending/descending.
- **Share Tracking** — Click any "edit" button to set share counts. Calculates position value, income, and totals.
- **Portfolio Persistence** — Tickers and share counts save to localStorage.
- **Add/Remove Tickers** — Modal to manage your portfolio.
- **RSS Feed** — Full RSS 2.0 feed with auto-discovery, copyable XML, and static feed files.

---

## ❓ Why HTML instead of React/JSX?

**GitHub Pages serves static files only** — it doesn't run Node.js or compile JSX. This dashboard is a single `index.html` file with everything inline:
- No `npm install`, no `webpack`, no `vite`, no build step
- Just push to GitHub and enable Pages
- Works on any static hosting (Netlify, Vercel, S3, etc.)
- Loads fast — single file, no dependencies except Google Fonts

---

## 🛠 Customization

### Adding tickers
Click **+ Add Ticker** in the UI, or edit the `DEFAULT_TICKERS` array in `index.html`.

### Adding stock data
For new tickers, add entries to these objects in the `<script>` tag:
- `PRICES` — current stock price
- `DIV` — dividend data (yield, dates, rating, etc.)
- `NEWS` — news articles with title, date, time, source, summary, and URL

### Changing the look
All colors are CSS variables at the top of the `<style>` block. Swap them out for a different theme.
