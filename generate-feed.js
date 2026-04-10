// This script generates feed.xml and rss.xml for GitHub Pages
// Run with: node generate-feed.js

const NEWS = {
  NET:[{title:"Cloudflare Reports Record Q1 Revenue Growth",date:"2026-04-08",source:"TechCrunch",summary:"Cloudflare announced first-quarter revenue of $632 million, a 32% increase year-over-year.",url:"https://techcrunch.com"},{title:"Cloudflare Expands AI Gateway Features",date:"2026-04-06",source:"The Verge",summary:"Cloudflare launched new AI Gateway features for developers.",url:"https://theverge.com"}],
  IBM:[{title:"IBM Quantum Division Hits Major Milestone",date:"2026-04-09",source:"WSJ",summary:"IBM quantum computing division achieved breakthrough with 1,121-qubit Condor processor.",url:"https://wsj.com"},{title:"IBM Cloud Revenue Surges 18% YoY",date:"2026-04-05",source:"Bloomberg",summary:"IBM reported cloud revenue growth of 18% year-over-year for Q1.",url:"https://bloomberg.com"}],
  MSFT:[{title:"Microsoft Copilot Reaches 500M Users",date:"2026-04-09",source:"Bloomberg",summary:"Microsoft Copilot AI assistant surpassed 500 million monthly active users.",url:"https://bloomberg.com"},{title:"Azure Revenue Beats Analyst Estimates",date:"2026-04-07",source:"WSJ",summary:"Microsoft Azure cloud revenue grew 34% in the latest quarter.",url:"https://wsj.com"}],
  AAPL:[{title:"Apple Intelligence Rollout Expands to 30 Countries",date:"2026-04-08",source:"Reuters",summary:"Apple expanded Apple Intelligence features to 30 countries with 12 additional languages.",url:"https://reuters.com"}],
  GOOG:[{title:"Google Gemini 3 Launches With New Capabilities",date:"2026-04-09",source:"TechCrunch",summary:"Google unveiled Gemini 3 with native multimodal reasoning and 2M-token context.",url:"https://techcrunch.com"}],
  TSLA:[{title:"Tesla Robotaxi Service Begins in Austin",date:"2026-04-08",source:"Bloomberg",summary:"Tesla launched robotaxi service in Austin with 500 Model 3 vehicles.",url:"https://bloomberg.com"}],
  AMZN:[{title:"AWS Launches Next-Gen Custom Chips",date:"2026-04-09",source:"TechCrunch",summary:"AWS unveiled Graviton5 and Trainium3 chips with 40% better price-performance.",url:"https://techcrunch.com"}],
};

function escapeXml(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

let items = '';
for (const [ticker, articles] of Object.entries(NEWS)) {
  for (const n of articles) {
    items += `    <item>
      <title>[${ticker}] ${escapeXml(n.title)}</title>
      <link>${n.url}</link>
      <description>${escapeXml(n.summary)}</description>
      <pubDate>${new Date(n.date + 'T12:00:00Z').toUTCString()}</pubDate>
      <category>${ticker}</category>
      <source url="${n.url}">${escapeXml(n.source)}</source>
    </item>\n`;
  }
}

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Portfolio Command Center — News Feed</title>
    <link>https://yourusername.github.io/portfolio-dashboard/</link>
    <description>Consolidated stock portfolio news feed</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://yourusername.github.io/portfolio-dashboard/feed.xml" rel="self" type="application/rss+xml"/>
${items}  </channel>
</rss>`;

require('fs').writeFileSync('feed.xml', feed);
require('fs').writeFileSync('rss.xml', feed);
console.log('Generated feed.xml and rss.xml');
