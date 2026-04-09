import { useState, useEffect, useCallback, useMemo } from "react";

const DEFAULT_TICKERS = ["NET","IBM","T","PFE","LUV","RGR","MSFT","RTX","BP","SCHD","ABBV","AXP","F","GOOG","AAPL","TSLA","TGT","KO","VICI","CMCSA","BAC","INTC","AMZN"];

const DIVIDEND_DATA = {
  T: { yield: 5.05, annualDiv: 1.11, frequency: "Quarterly", exDate: "2026-04-09", payDate: "2026-05-01", nextPayout: 0.2775, yearsPayingDiv: 41, yearsRaisingDiv: 0, payoutRatio: 64.8, rating: "Stable", sector: "Telecom", fiveYrGrowth: -3.2 },
  IBM: { yield: 2.82, annualDiv: 6.68, frequency: "Quarterly", exDate: "2026-05-08", payDate: "2026-06-10", nextPayout: 1.67, yearsPayingDiv: 108, yearsRaisingDiv: 29, payoutRatio: 72.5, rating: "Strong", sector: "Technology", fiveYrGrowth: 1.2 },
  PFE: { yield: 6.51, annualDiv: 1.68, frequency: "Quarterly", exDate: "2026-04-25", payDate: "2026-05-15", nextPayout: 0.42, yearsPayingDiv: 84, yearsRaisingDiv: 14, payoutRatio: 95.2, rating: "Caution", sector: "Healthcare", fiveYrGrowth: 2.5 },
  MSFT: { yield: 0.74, annualDiv: 3.32, frequency: "Quarterly", exDate: "2026-05-14", payDate: "2026-06-11", nextPayout: 0.83, yearsPayingDiv: 21, yearsRaisingDiv: 21, payoutRatio: 24.8, rating: "Excellent", sector: "Technology", fiveYrGrowth: 10.1 },
  RTX: { yield: 2.18, annualDiv: 2.68, frequency: "Quarterly", exDate: "2026-05-16", payDate: "2026-06-04", nextPayout: 0.67, yearsPayingDiv: 29, yearsRaisingDiv: 5, payoutRatio: 38.2, rating: "Good", sector: "Defense", fiveYrGrowth: 6.8 },
  BP: { yield: 5.88, annualDiv: 1.74, frequency: "Quarterly", exDate: "2026-05-08", payDate: "2026-06-20", nextPayout: 0.435, yearsPayingDiv: 33, yearsRaisingDiv: 3, payoutRatio: 60.1, rating: "Moderate", sector: "Energy", fiveYrGrowth: 4.0 },
  SCHD: { yield: 3.42, annualDiv: 2.82, frequency: "Quarterly", exDate: "2026-06-23", payDate: "2026-06-30", nextPayout: 0.705, yearsPayingDiv: 14, yearsRaisingDiv: 12, payoutRatio: 0, rating: "ETF - Strong", sector: "ETF", fiveYrGrowth: 12.3 },
  ABBV: { yield: 3.21, annualDiv: 6.56, frequency: "Quarterly", exDate: "2026-04-14", payDate: "2026-05-15", nextPayout: 1.64, yearsPayingDiv: 11, yearsRaisingDiv: 52, payoutRatio: 48.2, rating: "Aristocrat", sector: "Healthcare", fiveYrGrowth: 8.4 },
  AXP: { yield: 0.98, annualDiv: 2.80, frequency: "Quarterly", exDate: "2026-04-03", payDate: "2026-05-09", nextPayout: 0.70, yearsPayingDiv: 34, yearsRaisingDiv: 5, payoutRatio: 18.5, rating: "Good", sector: "Financial", fiveYrGrowth: 9.7 },
  F: { yield: 5.72, annualDiv: 0.60, frequency: "Quarterly", exDate: "2026-05-06", payDate: "2026-06-02", nextPayout: 0.15, yearsPayingDiv: 8, yearsRaisingDiv: 3, payoutRatio: 48.9, rating: "Moderate", sector: "Automotive", fiveYrGrowth: 0 },
  GOOG: { yield: 0.45, annualDiv: 0.80, frequency: "Quarterly", exDate: "2026-06-10", payDate: "2026-06-24", nextPayout: 0.20, yearsPayingDiv: 2, yearsRaisingDiv: 1, payoutRatio: 5.2, rating: "New", sector: "Technology", fiveYrGrowth: 0 },
  AAPL: { yield: 0.43, annualDiv: 1.00, frequency: "Quarterly", exDate: "2026-05-09", payDate: "2026-05-15", nextPayout: 0.25, yearsPayingDiv: 13, yearsRaisingDiv: 13, payoutRatio: 15.4, rating: "Strong", sector: "Technology", fiveYrGrowth: 5.8 },
  TGT: { yield: 3.38, annualDiv: 4.48, frequency: "Quarterly", exDate: "2026-05-20", payDate: "2026-06-10", nextPayout: 1.12, yearsPayingDiv: 56, yearsRaisingDiv: 56, payoutRatio: 52.1, rating: "King", sector: "Retail", fiveYrGrowth: 10.3 },
  KO: { yield: 2.83, annualDiv: 2.00, frequency: "Quarterly", exDate: "2026-06-13", payDate: "2026-07-01", nextPayout: 0.50, yearsPayingDiv: 62, yearsRaisingDiv: 62, payoutRatio: 71.3, rating: "King", sector: "Consumer", fiveYrGrowth: 3.1 },
  VICI: { yield: 5.15, annualDiv: 1.72, frequency: "Quarterly", exDate: "2026-06-05", payDate: "2026-07-02", nextPayout: 0.43, yearsPayingDiv: 5, yearsRaisingDiv: 5, payoutRatio: 75.4, rating: "REIT - Good", sector: "REIT", fiveYrGrowth: 8.0 },
  CMCSA: { yield: 3.12, annualDiv: 1.24, frequency: "Quarterly", exDate: "2026-04-02", payDate: "2026-04-23", nextPayout: 0.31, yearsPayingDiv: 18, yearsRaisingDiv: 17, payoutRatio: 32.4, rating: "Strong", sector: "Media", fiveYrGrowth: 7.9 },
  BAC: { yield: 2.34, annualDiv: 1.04, frequency: "Quarterly", exDate: "2026-06-04", payDate: "2026-06-26", nextPayout: 0.26, yearsPayingDiv: 14, yearsRaisingDiv: 10, payoutRatio: 30.2, rating: "Good", sector: "Financial", fiveYrGrowth: 12.6 },
  INTC: { yield: 1.58, annualDiv: 0.50, frequency: "Quarterly", exDate: "2026-05-06", payDate: "2026-06-01", nextPayout: 0.125, yearsPayingDiv: 32, yearsRaisingDiv: 0, payoutRatio: 115.0, rating: "Caution", sector: "Technology", fiveYrGrowth: -62.3 },
  AMZN: { yield: 0, annualDiv: 0, frequency: "N/A", exDate: "N/A", payDate: "N/A", nextPayout: 0, yearsPayingDiv: 0, yearsRaisingDiv: 0, payoutRatio: 0, rating: "None", sector: "Technology", fiveYrGrowth: 0 },
  NET: { yield: 0, annualDiv: 0, frequency: "N/A", exDate: "N/A", payDate: "N/A", nextPayout: 0, yearsPayingDiv: 0, yearsRaisingDiv: 0, payoutRatio: 0, rating: "None", sector: "Technology", fiveYrGrowth: 0 },
  LUV: { yield: 1.46, annualDiv: 0.72, frequency: "Quarterly", exDate: "2026-05-27", payDate: "2026-06-17", nextPayout: 0.18, yearsPayingDiv: 47, yearsRaisingDiv: 0, payoutRatio: 55.3, rating: "Moderate", sector: "Airlines", fiveYrGrowth: 0 },
  RGR: { yield: 1.65, annualDiv: 0.94, frequency: "Quarterly", exDate: "2026-05-13", payDate: "2026-05-28", nextPayout: 0.235, yearsPayingDiv: 12, yearsRaisingDiv: 0, payoutRatio: 41.2, rating: "Variable", sector: "Firearms", fiveYrGrowth: -8.1 },
  TSLA: { yield: 0, annualDiv: 0, frequency: "N/A", exDate: "N/A", payDate: "N/A", nextPayout: 0, yearsPayingDiv: 0, yearsRaisingDiv: 0, payoutRatio: 0, rating: "None", sector: "Automotive", fiveYrGrowth: 0 },
};

const STOCK_PRICES = {
  NET: 118.42, IBM: 237.15, T: 21.98, PFE: 25.81, LUV: 33.10, RGR: 57.00,
  MSFT: 448.72, RTX: 123.05, BP: 29.60, SCHD: 82.44, ABBV: 204.30, AXP: 285.60,
  F: 10.49, GOOG: 177.80, AAPL: 232.56, TSLA: 271.34, TGT: 132.55, KO: 70.68,
  VICI: 33.40, CMCSA: 39.74, BAC: 44.44, INTC: 31.65, AMZN: 197.12
};

const NEWS_ITEMS = {
  NET: [
    { title: "Cloudflare Reports Record Q1 Revenue Growth", date: "2026-04-08", source: "TechCrunch" },
    { title: "Cloudflare Expands AI Gateway Features", date: "2026-04-06", source: "The Verge" },
    { title: "NET Enters New Enterprise Security Partnerships", date: "2026-04-03", source: "Reuters" },
  ],
  IBM: [
    { title: "IBM Quantum Division Hits Major Milestone", date: "2026-04-09", source: "WSJ" },
    { title: "IBM Cloud Revenue Surges 18% YoY", date: "2026-04-05", source: "Bloomberg" },
    { title: "IBM Acquires AI Startup for $2.3B", date: "2026-04-01", source: "CNBC" },
  ],
  MSFT: [
    { title: "Microsoft Copilot Reaches 500M Users", date: "2026-04-09", source: "Bloomberg" },
    { title: "Azure Revenue Beats Analyst Estimates", date: "2026-04-07", source: "WSJ" },
    { title: "Microsoft Announces New Surface Lineup", date: "2026-04-04", source: "The Verge" },
  ],
  AAPL: [
    { title: "Apple Intelligence Rollout Expands to 30 Countries", date: "2026-04-08", source: "Reuters" },
    { title: "iPhone Sales Rebound in China Market", date: "2026-04-05", source: "Bloomberg" },
    { title: "Apple Vision Pro 2 Rumors Intensify", date: "2026-04-02", source: "MacRumors" },
  ],
  GOOG: [
    { title: "Google Gemini 3 Launches With New Capabilities", date: "2026-04-09", source: "TechCrunch" },
    { title: "Alphabet Ad Revenue Hits All-Time High", date: "2026-04-06", source: "WSJ" },
    { title: "Waymo Expands to 15 New Cities", date: "2026-04-03", source: "Reuters" },
  ],
  TSLA: [
    { title: "Tesla Robotaxi Service Begins in Austin", date: "2026-04-08", source: "Bloomberg" },
    { title: "Model 2 Production Ramp Ahead of Schedule", date: "2026-04-06", source: "Electrek" },
    { title: "Tesla Energy Division Revenue Doubles", date: "2026-04-02", source: "CNBC" },
  ],
  AMZN: [
    { title: "AWS Launches Next-Gen Custom Chips", date: "2026-04-09", source: "TechCrunch" },
    { title: "Amazon Prime Surpasses 300M Subscribers", date: "2026-04-07", source: "Reuters" },
    { title: "Amazon Pharmacy Expands Same-Day Delivery", date: "2026-04-04", source: "WSJ" },
  ],
  T: [
    { title: "AT&T Fiber Subscriber Count Reaches 25M", date: "2026-04-07", source: "CNBC" },
    { title: "AT&T 5G Network Covers 95% of US Population", date: "2026-04-04", source: "Reuters" },
  ],
  PFE: [
    { title: "Pfizer Oncology Drug Shows Positive Phase 3 Results", date: "2026-04-08", source: "Reuters" },
    { title: "Pfizer Raises Full-Year Revenue Guidance", date: "2026-04-03", source: "Bloomberg" },
  ],
  ABBV: [
    { title: "AbbVie's New Immunology Drug Gets FDA Approval", date: "2026-04-09", source: "Reuters" },
    { title: "AbbVie Reports Strong Skyrizi/Rinvoq Growth", date: "2026-04-05", source: "Bloomberg" },
  ],
  KO: [
    { title: "Coca-Cola Launches New Zero Sugar Lineup", date: "2026-04-07", source: "Forbes" },
    { title: "KO International Sales Growth Accelerates", date: "2026-04-03", source: "WSJ" },
  ],
  BAC: [
    { title: "Bank of America Digital Banking Hits 50M Users", date: "2026-04-08", source: "CNBC" },
    { title: "BAC Investment Banking Revenue Surges", date: "2026-04-04", source: "Bloomberg" },
  ],
  F: [
    { title: "Ford EV Sales Surge 45% in Q1 2026", date: "2026-04-07", source: "Reuters" },
    { title: "Ford Pro Commercial Division Beats Estimates", date: "2026-04-03", source: "CNBC" },
  ],
  TGT: [
    { title: "Target Same-Store Sales Return to Growth", date: "2026-04-06", source: "WSJ" },
    { title: "Target Expands Drive-Up Service Nationwide", date: "2026-04-02", source: "Reuters" },
  ],
  INTC: [
    { title: "Intel 18A Process Node On Track for H2 2026", date: "2026-04-08", source: "TechCrunch" },
    { title: "Intel Foundry Wins Major Auto Chip Contract", date: "2026-04-04", source: "Bloomberg" },
  ],
  RTX: [
    { title: "RTX Wins $4.2B Defense Contract", date: "2026-04-07", source: "Reuters" },
    { title: "Raytheon Missile Systems Backlog Grows 22%", date: "2026-04-03", source: "Defense News" },
  ],
  LUV: [
    { title: "Southwest Airlines Launches Premium Economy", date: "2026-04-06", source: "CNBC" },
    { title: "LUV Load Factor Hits Record for Q1", date: "2026-04-02", source: "Reuters" },
  ],
  BP: [
    { title: "BP Accelerates Renewable Energy Investments", date: "2026-04-08", source: "Bloomberg" },
    { title: "BP Refining Margins Improve in Q1", date: "2026-04-04", source: "Reuters" },
  ],
  AXP: [
    { title: "American Express Card Spending Hits Record", date: "2026-04-07", source: "WSJ" },
    { title: "AXP Premium Card Applications Surge", date: "2026-04-03", source: "Bloomberg" },
  ],
  SCHD: [
    { title: "SCHD Rebalances with New Top Holdings", date: "2026-04-05", source: "ETF.com" },
    { title: "Schwab Dividend ETF Sees $3B Monthly Inflows", date: "2026-04-01", source: "Morningstar" },
  ],
  VICI: [
    { title: "VICI Properties Acquires Two Las Vegas Resorts", date: "2026-04-06", source: "Reuters" },
    { title: "VICI Raises Quarterly Dividend 6.4%", date: "2026-04-02", source: "Seeking Alpha" },
  ],
  CMCSA: [
    { title: "Comcast Peacock Streaming Subscribers Top 45M", date: "2026-04-07", source: "Bloomberg" },
    { title: "Comcast Broadband Losses Slow Significantly", date: "2026-04-03", source: "CNBC" },
  ],
  RGR: [
    { title: "Ruger Reports Strong Firearms Demand in Q1", date: "2026-04-05", source: "Reuters" },
    { title: "Sturm Ruger Launches New Product Line", date: "2026-04-01", source: "NSSF" },
  ],
};

function getRatingColor(rating) {
  const m = {
    "King": "#FFD700", "Aristocrat": "#FFD700", "Excellent": "#22c55e", "Strong": "#22c55e",
    "ETF - Strong": "#22c55e", "Good": "#3b82f6", "REIT - Good": "#3b82f6", "Moderate": "#f59e0b",
    "Variable": "#f59e0b", "Stable": "#3b82f6", "Caution": "#ef4444", "New": "#8b5cf6", "None": "#64748b"
  };
  return m[rating] || "#64748b";
}

function getRatingBadge(rating) {
  if (rating === "King") return "👑 Dividend King";
  if (rating === "Aristocrat") return "🏆 Dividend Aristocrat";
  return rating;
}

function generateRSS(tickers, newsItems) {
  let items = "";
  tickers.forEach(t => {
    (newsItems[t] || []).forEach(n => {
      items += `    <item>\n      <title>[${t}] ${n.title}</title>\n      <description>${n.title} - Source: ${n.source}</description>\n      <pubDate>${new Date(n.date).toUTCString()}</pubDate>\n      <category>${t}</category>\n    </item>\n`;
    });
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>My Portfolio News Feed</title>
    <description>Consolidated stock news for my portfolio</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}  </channel>
</rss>`;
}

const TabBtn = ({ active, onClick, children, count }) => (
  <button onClick={onClick} style={{
    padding: "10px 22px", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif", borderRadius: "8px 8px 0 0", transition: "all .2s",
    background: active ? "var(--card)" : "transparent",
    color: active ? "var(--text)" : "var(--muted)",
    borderBottom: active ? "2px solid var(--accent)" : "2px solid transparent",
    display: "flex", alignItems: "center", gap: 8
  }}>
    {children}
    {count !== undefined && <span style={{
      background: active ? "var(--accent)" : "var(--border)", color: active ? "#fff" : "var(--muted)",
      borderRadius: 12, padding: "1px 8px", fontSize: 11
    }}>{count}</span>}
  </button>
);

export default function PortfolioDashboard() {
  const [tickers, setTickers] = useState(() => {
    try { const s = window.localStorage?.getItem?.("pf_tickers"); return s ? JSON.parse(s) : DEFAULT_TICKERS; } catch { return DEFAULT_TICKERS; }
  });
  const [shares, setShares] = useState(() => {
    try { const s = window.localStorage?.getItem?.("pf_shares"); return s ? JSON.parse(s) : {}; } catch { return {}; }
  });
  const [tab, setTab] = useState("news");
  const [newTicker, setNewTicker] = useState("");
  const [showRSS, setShowRSS] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [editingShares, setEditingShares] = useState(null);
  const [tempShares, setTempShares] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    try { window.localStorage?.setItem?.("pf_tickers", JSON.stringify(tickers)); } catch {}
  }, [tickers]);
  useEffect(() => {
    try { window.localStorage?.setItem?.("pf_shares", JSON.stringify(shares)); } catch {}
  }, [shares]);

  const addTicker = () => {
    const t = newTicker.trim().toUpperCase();
    if (t && !tickers.includes(t)) { setTickers([...tickers, t]); setNewTicker(""); setShowAddModal(false); }
  };

  const removeTicker = (t) => setTickers(tickers.filter(x => x !== t));

  const dividendStocks = useMemo(() => tickers.filter(t => DIVIDEND_DATA[t]?.yield > 0), [tickers]);
  const nonDividendStocks = useMemo(() => tickers.filter(t => !DIVIDEND_DATA[t]?.yield), [tickers]);

  const totalAnnualDividends = useMemo(() => {
    return dividendStocks.reduce((sum, t) => {
      const d = DIVIDEND_DATA[t];
      const s = shares[t] || 0;
      return sum + (d ? d.annualDiv * s : 0);
    }, 0);
  }, [dividendStocks, shares]);

  const totalMonthlyDividends = totalAnnualDividends / 12;

  const filteredNews = useMemo(() => {
    let all = [];
    tickers.forEach(t => {
      (NEWS_ITEMS[t] || []).forEach(n => all.push({ ...n, ticker: t }));
    });
    all.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      all = all.filter(n => n.title.toLowerCase().includes(q) || n.ticker.toLowerCase().includes(q) || n.source.toLowerCase().includes(q));
    }
    return all;
  }, [tickers, searchFilter]);

  const rssContent = useMemo(() => generateRSS(tickers, NEWS_ITEMS), [tickers]);

  const totalPortfolioValue = useMemo(() => {
    return tickers.reduce((s, t) => s + (STOCK_PRICES[t] || 0) * (shares[t] || 0), 0);
  }, [tickers, shares]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,500;0,9..40,700;1,9..40,400&family=JetBrains+Mono:wght@400;600&display=swap');
        :root {
          --bg: #0a0e17; --card: #111827; --card2: #1a2235; --border: #1e293b;
          --text: #e2e8f0; --muted: #64748b; --accent: #3b82f6; --accent2: #22d3ee;
          --green: #22c55e; --red: #ef4444; --yellow: #f59e0b; --purple: #8b5cf6;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: var(--bg); }
        ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
        input { font-family: inherit; }
        @keyframes fadeIn { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.5; } }
        .card-anim { animation: fadeIn .3s ease both; }
        .news-row:hover { background: var(--card2) !important; }
        .remove-btn:hover { background: var(--red) !important; color: #fff !important; }
        .ticker-chip:hover { border-color: var(--accent) !important; }
      `}</style>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0a0e17 0%, #111827 50%, #0f172a 100%)", borderBottom: "1px solid var(--border)", padding: "24px 32px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, var(--accent), var(--accent2))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📊</div>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.5px" }}>Portfolio Command Center</h1>
                <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{tickers.length} tickers tracked · {dividendStocks.length} dividend payers · Updated {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            {totalPortfolioValue > 0 && (
              <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, padding: "8px 16px", textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1 }}>Portfolio Value</div>
                <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: "var(--accent2)" }}>${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
            )}
            <button onClick={() => setShowAddModal(true)} style={{ background: "linear-gradient(135deg, var(--accent), #2563eb)", color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
              + Add Ticker
            </button>
            <button onClick={() => setShowRSS(!showRSS)} style={{ background: showRSS ? "#ea580c" : "var(--card)", color: showRSS ? "#fff" : "var(--text)", border: "1px solid " + (showRSS ? "#ea580c" : "var(--border)"), borderRadius: 10, padding: "10px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
              📡 RSS Feed
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "20px 32px" }}>
        {/* Add Modal */}
        {showAddModal && (
          <div style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,.6)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setShowAddModal(false)}>
            <div className="card-anim" onClick={e => e.stopPropagation()} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: 32, width: 400, maxWidth: "90vw" }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Add Ticker Symbol</h3>
              <div style={{ display: "flex", gap: 10 }}>
                <input value={newTicker} onChange={e => setNewTicker(e.target.value)} onKeyDown={e => e.key === "Enter" && addTicker()}
                  placeholder="e.g. NVDA" style={{ flex: 1, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px", color: "var(--text)", fontSize: 16, outline: "none" }} autoFocus />
                <button onClick={addTicker} style={{ background: "var(--accent)", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Add</button>
              </div>
              <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 6 }}>
                {tickers.map(t => (
                  <span key={t} className="ticker-chip" style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "var(--card2)", border: "1px solid var(--border)", borderRadius: 6, padding: "4px 10px", fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>
                    {t}
                    <span onClick={() => removeTicker(t)} className="remove-btn" style={{ cursor: "pointer", marginLeft: 4, width: 18, height: 18, borderRadius: 4, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, background: "var(--border)", transition: "all .15s" }}>×</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* RSS Modal */}
        {showRSS && (
          <div className="card-anim" style={{ background: "var(--card)", border: "1px solid #ea580c40", borderRadius: 14, padding: 24, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 22 }}>📡</span>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>RSS Feed</h3>
              </div>
              <button onClick={() => { navigator.clipboard?.writeText(rssContent); }} style={{ background: "#ea580c", color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Copy RSS XML</button>
            </div>
            <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>Copy the RSS XML below and use it with your favorite feed reader. You can also serve this from a URL endpoint for automatic updates.</p>
            <pre style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, padding: 16, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "var(--accent2)", overflow: "auto", maxHeight: 300, lineHeight: 1.6 }}>{rssContent}</pre>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, borderBottom: "1px solid var(--border)", marginBottom: 20 }}>
          <TabBtn active={tab === "news"} onClick={() => setTab("news")} count={filteredNews.length}>📰 News Feed</TabBtn>
          <TabBtn active={tab === "dividends"} onClick={() => setTab("dividends")} count={dividendStocks.length}>💰 Dividends</TabBtn>
          <TabBtn active={tab === "nondiv"} onClick={() => setTab("nondiv")} count={nonDividendStocks.length}>📈 Growth Stocks</TabBtn>
          <TabBtn active={tab === "overview"} onClick={() => setTab("overview")}>🗂️ All Holdings</TabBtn>
        </div>

        {/* NEWS TAB */}
        {tab === "news" && (
          <div className="card-anim">
            <div style={{ marginBottom: 16 }}>
              <input value={searchFilter} onChange={e => setSearchFilter(e.target.value)} placeholder="Search news by ticker, title, or source..."
                style={{ width: "100%", maxWidth: 500, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 16px", color: "var(--text)", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {filteredNews.map((n, i) => (
                <div key={i} className="news-row" style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderRadius: 10, transition: "background .15s", cursor: "default", animationDelay: `${i * 30}ms` }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, background: "var(--accent)20", color: "var(--accent)", borderRadius: 6, padding: "4px 10px", minWidth: 52, textAlign: "center" }}>{n.ticker}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n.title}</div>
                  </div>
                  <span style={{ fontSize: 12, color: "var(--muted)", whiteSpace: "nowrap" }}>{n.source}</span>
                  <span style={{ fontSize: 12, color: "var(--muted)", fontFamily: "'JetBrains Mono', monospace", whiteSpace: "nowrap" }}>{n.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DIVIDENDS TAB */}
        {tab === "dividends" && (
          <div className="card-anim">
            {/* Summary Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 24 }}>
              {[
                { label: "Monthly Income", val: `$${totalMonthlyDividends.toFixed(2)}`, color: "var(--green)", icon: "📅" },
                { label: "Annual Income", val: `$${totalAnnualDividends.toFixed(2)}`, color: "var(--accent2)", icon: "📊" },
                { label: "Dividend Stocks", val: dividendStocks.length, color: "var(--accent)", icon: "💰" },
                { label: "Avg Yield", val: `${(dividendStocks.reduce((s, t) => s + (DIVIDEND_DATA[t]?.yield || 0), 0) / (dividendStocks.length || 1)).toFixed(2)}%`, color: "var(--yellow)", icon: "📈" },
              ].map((c, i) => (
                <div key={i} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 20px" }}>
                  <div style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{c.icon} {c.label}</div>
                  <div style={{ fontSize: 26, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: c.color }}>{c.val}</div>
                </div>
              ))}
            </div>

            {/* Dividend Table */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 4px", fontSize: 13 }}>
                <thead>
                  <tr style={{ color: "var(--muted)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>
                    {["Ticker","Price","Yield","Annual Div","Next Payout","Ex-Date","Pay Date","Freq","Shares","Income/Yr","Rating","Years Paying","Years Raising","Payout Ratio","5yr Growth","Sector"].map(h => (
                      <th key={h} style={{ padding: "8px 10px", textAlign: "left", fontWeight: 600, whiteSpace: "nowrap", borderBottom: "1px solid var(--border)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dividendStocks.map(t => {
                    const d = DIVIDEND_DATA[t];
                    const s = shares[t] || 0;
                    const income = d.annualDiv * s;
                    return (
                      <tr key={t} style={{ background: "var(--card)" }}>
                        <td style={{ padding: "10px", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, borderRadius: "8px 0 0 8px" }}>{t}</td>
                        <td style={{ padding: "10px", fontFamily: "'JetBrains Mono', monospace" }}>${STOCK_PRICES[t]?.toFixed(2)}</td>
                        <td style={{ padding: "10px", fontFamily: "'JetBrains Mono', monospace", color: d.yield >= 4 ? "var(--green)" : d.yield >= 2 ? "var(--accent2)" : "var(--text)" }}>{d.yield}%</td>
                        <td style={{ padding: "10px", fontFamily: "'JetBrains Mono', monospace" }}>${d.annualDiv}</td>
                        <td style={{ padding: "10px", fontFamily: "'JetBrains Mono', monospace", color: "var(--green)" }}>${d.nextPayout}</td>
                        <td style={{ padding: "10px", fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{d.exDate}</td>
                        <td style={{ padding: "10px", fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{d.payDate}</td>
                        <td style={{ padding: "10px" }}>{d.frequency}</td>
                        <td style={{ padding: "10px" }}>
                          {editingShares === t ? (
                            <input value={tempShares} onChange={e => setTempShares(e.target.value)}
                              onBlur={() => { setShares({ ...shares, [t]: parseFloat(tempShares) || 0 }); setEditingShares(null); }}
                              onKeyDown={e => { if (e.key === "Enter") { setShares({ ...shares, [t]: parseFloat(tempShares) || 0 }); setEditingShares(null); } }}
                              style={{ width: 60, background: "var(--bg)", border: "1px solid var(--accent)", borderRadius: 4, padding: "4px 6px", color: "var(--text)", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, textAlign: "center", outline: "none" }}
                              autoFocus />
                          ) : (
                            <span onClick={() => { setEditingShares(t); setTempShares(String(s)); }} style={{ cursor: "pointer", background: s > 0 ? "var(--accent)20" : "var(--border)", color: s > 0 ? "var(--accent)" : "var(--muted)", borderRadius: 4, padding: "3px 10px", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, display: "inline-block", minWidth: 40, textAlign: "center" }}>
                              {s > 0 ? s : "edit"}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: "10px", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: income > 0 ? "var(--green)" : "var(--muted)" }}>{income > 0 ? `$${income.toFixed(2)}` : "—"}</td>
                        <td style={{ padding: "10px" }}>
                          <span style={{ background: getRatingColor(d.rating) + "20", color: getRatingColor(d.rating), borderRadius: 6, padding: "3px 8px", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>
                            {getRatingBadge(d.rating)}
                          </span>
                        </td>
                        <td style={{ padding: "10px", fontFamily: "'JetBrains Mono', monospace", textAlign: "center" }}>{d.yearsPayingDiv}</td>
                        <td style={{ padding: "10px", fontFamily: "'JetBrains Mono', monospace", textAlign: "center", color: d.yearsRaisingDiv >= 25 ? "var(--green)" : d.yearsRaisingDiv >= 10 ? "var(--accent2)" : "var(--text)" }}>{d.yearsRaisingDiv}</td>
                        <td style={{ padding: "10px", fontFamily: "'JetBrains Mono', monospace", color: d.payoutRatio > 80 ? "var(--red)" : d.payoutRatio > 60 ? "var(--yellow)" : "var(--green)" }}>{d.payoutRatio}%</td>
                        <td style={{ padding: "10px", fontFamily: "'JetBrains Mono', monospace", color: d.fiveYrGrowth > 0 ? "var(--green)" : d.fiveYrGrowth < 0 ? "var(--red)" : "var(--muted)", borderRadius: "0 8px 8px 0" }}>{d.fiveYrGrowth > 0 ? "+" : ""}{d.fiveYrGrowth}%</td>
                        <td style={{ padding: "10px", fontSize: 12, color: "var(--muted)" }}>{d.sector}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Dividend Deep Dive */}
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: "32px 0 16px", display: "flex", alignItems: "center", gap: 8 }}>🔍 Dividend Deep Dive</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 14 }}>
              {dividendStocks.map(t => {
                const d = DIVIDEND_DATA[t];
                const s = shares[t] || 0;
                return (
                  <div key={t} className="card-anim" style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: 20, position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, background: getRatingColor(d.rating) + "08", borderRadius: "0 0 0 80px" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 18, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{t}</span>
                          <span style={{ background: getRatingColor(d.rating) + "20", color: getRatingColor(d.rating), borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>{getRatingBadge(d.rating)}</span>
                        </div>
                        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{d.sector} · ${STOCK_PRICES[t]?.toFixed(2)}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: "var(--green)" }}>{d.yield}%</div>
                        <div style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase" }}>Yield</div>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 16px", fontSize: 12 }}>
                      {[
                        ["Annual Dividend", `$${d.annualDiv}`],
                        ["Next Payout", `$${d.nextPayout}`],
                        ["Frequency", d.frequency],
                        ["Payout Ratio", `${d.payoutRatio}%`],
                        ["Ex-Dividend Date", d.exDate],
                        ["Payment Date", d.payDate],
                        ["Years Paying", `${d.yearsPayingDiv} yrs`],
                        ["Years Raising", `${d.yearsRaisingDiv} yrs`],
                        ["5-Year Div Growth", `${d.fiveYrGrowth > 0 ? "+" : ""}${d.fiveYrGrowth}%`],
                        ["Shares Owned", s > 0 ? s : "—"],
                        ["Annual Income", s > 0 ? `$${(d.annualDiv * s).toFixed(2)}` : "—"],
                        ["Quarterly Income", s > 0 ? `$${(d.nextPayout * s).toFixed(2)}` : "—"],
                      ].map(([label, val], i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: "var(--muted)" }}>{label}</span>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: typeof val === "string" && val.startsWith("+") ? "var(--green)" : typeof val === "string" && val.startsWith("-") && !val.startsWith("—") ? "var(--red)" : "var(--text)" }}>{val}</span>
                        </div>
                      ))}
                    </div>
                    {d.yearsRaisingDiv >= 25 && (
                      <div style={{ marginTop: 12, background: "#FFD70015", border: "1px solid #FFD70030", borderRadius: 8, padding: "8px 12px", fontSize: 11, color: "#FFD700" }}>
                        👑 {d.yearsRaisingDiv >= 50 ? "Dividend King" : "Dividend Aristocrat"} — {d.yearsRaisingDiv} consecutive years of dividend increases
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* NON-DIVIDEND TAB */}
        {tab === "nondiv" && (
          <div className="card-anim">
            <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>These stocks do not currently pay dividends. They are typically focused on growth and reinvesting profits.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
              {nonDividendStocks.map(t => (
                <div key={t} className="card-anim" style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span style={{ fontSize: 20, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{t}</span>
                    <span style={{ fontSize: 18, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: "var(--accent2)" }}>${STOCK_PRICES[t]?.toFixed(2)}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10 }}>{DIVIDEND_DATA[t]?.sector || "Technology"} · Growth Stock</div>
                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: 10 }}>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>Latest News</div>
                    {(NEWS_ITEMS[t] || []).slice(0, 2).map((n, i) => (
                      <div key={i} style={{ fontSize: 12, marginBottom: 4, lineHeight: 1.4 }}>
                        <span style={{ color: "var(--text)" }}>{n.title}</span>
                        <span style={{ color: "var(--muted)", marginLeft: 6 }}>{n.source}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => removeTicker(t)} className="remove-btn" style={{ marginTop: 10, background: "var(--border)", color: "var(--muted)", border: "none", borderRadius: 6, padding: "4px 12px", fontSize: 11, cursor: "pointer", fontFamily: "inherit", transition: "all .15s" }}>Remove</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ALL HOLDINGS TAB */}
        {tab === "overview" && (
          <div className="card-anim">
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 3px", fontSize: 13 }}>
                <thead>
                  <tr style={{ color: "var(--muted)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>
                    {["Ticker","Price","Sector","Dividend","Yield","Shares","Value","Annual Income","Type"].map(h => (
                      <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, borderBottom: "1px solid var(--border)" }}>{h}</th>
                    ))}
                    <th style={{ padding: "8px 12px", textAlign: "center", fontWeight: 600, borderBottom: "1px solid var(--border)" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tickers.map(t => {
                    const d = DIVIDEND_DATA[t];
                    const isDividend = d?.yield > 0;
                    const s = shares[t] || 0;
                    const val = (STOCK_PRICES[t] || 0) * s;
                    return (
                      <tr key={t} style={{ background: "var(--card)" }}>
                        <td style={{ padding: "10px 12px", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, borderRadius: "8px 0 0 8px" }}>{t}</td>
                        <td style={{ padding: "10px 12px", fontFamily: "'JetBrains Mono', monospace" }}>${STOCK_PRICES[t]?.toFixed(2)}</td>
                        <td style={{ padding: "10px 12px", fontSize: 12 }}>{d?.sector || "—"}</td>
                        <td style={{ padding: "10px 12px", fontFamily: "'JetBrains Mono', monospace", color: isDividend ? "var(--green)" : "var(--muted)" }}>{isDividend ? `$${d.annualDiv}` : "—"}</td>
                        <td style={{ padding: "10px 12px", fontFamily: "'JetBrains Mono', monospace", color: isDividend ? "var(--accent2)" : "var(--muted)" }}>{isDividend ? `${d.yield}%` : "—"}</td>
                        <td style={{ padding: "10px 12px" }}>
                          <span onClick={() => { setEditingShares(t); setTempShares(String(s)); setTab(isDividend ? "dividends" : "overview"); }} style={{ cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", color: "var(--accent)", fontSize: 12 }}>{s > 0 ? s : "set"}</span>
                        </td>
                        <td style={{ padding: "10px 12px", fontFamily: "'JetBrains Mono', monospace" }}>{val > 0 ? `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—"}</td>
                        <td style={{ padding: "10px 12px", fontFamily: "'JetBrains Mono', monospace", color: isDividend && s > 0 ? "var(--green)" : "var(--muted)" }}>{isDividend && s > 0 ? `$${(d.annualDiv * s).toFixed(2)}` : "—"}</td>
                        <td style={{ padding: "10px 12px" }}>
                          <span style={{ background: isDividend ? "var(--green)20" : "var(--purple)20", color: isDividend ? "var(--green)" : "var(--purple)", borderRadius: 6, padding: "3px 8px", fontSize: 11, fontWeight: 600 }}>{isDividend ? "Dividend" : "Growth"}</span>
                        </td>
                        <td style={{ padding: "10px 12px", textAlign: "center", borderRadius: "0 8px 8px 0" }}>
                          <span onClick={() => removeTicker(t)} className="remove-btn" style={{ cursor: "pointer", background: "var(--border)", borderRadius: 4, padding: "3px 8px", fontSize: 11, display: "inline-block", transition: "all .15s" }}>✕</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div style={{ textAlign: "center", padding: "32px 0 16px", fontSize: 11, color: "var(--muted)" }}>
          Portfolio Command Center · Data is illustrative · Click share counts to edit · RSS available for feed readers
        </div>
      </div>
    </div>
  );
}
