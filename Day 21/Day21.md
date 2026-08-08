

Digital footprint report · HTML
<style>
  :root{
    --bg:#090c11;
    --bg-panel:#10151d;
    --bg-panel-2:#151c26;
    --bg-panel-3:#1a2230;
    --border:#232c3a;
    --border-soft:#1a2230;
    --text:#e9eef6;
    --text-dim:#8d99ad;
    --text-faint:#5c6879;
    --cyan:#2fd6c4;
    --cyan-dim:#1a4a46;
    --green:#3ddc97;
    --yellow:#f2c94c;
    --orange:#ff9f5a;
    --red:#ff5c5c;
    --purple:#9b8cf2;
    --mono: ui-monospace, "SF Mono", "Cascadia Code", "JetBrains Mono", Menlo, Consolas, monospace;
    --sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, Helvetica, Arial, sans-serif;
  }
  *{box-sizing:border-box;}
  body, .dfp-root{
    margin:0; padding:0; background:var(--bg); color:var(--text);
    font-family:var(--sans);
    -webkit-font-smoothing:antialiased;
  }
  .dfp-root{
    max-width:1180px; margin:0 auto; padding:28px 20px 80px;
  }
  .dfp-eyebrow{
    font-family:var(--mono); font-size:11px; letter-spacing:.14em; text-transform:uppercase;
    color:var(--cyan); display:flex; align-items:center; gap:8px; margin-bottom:10px;
  }
  .dfp-dot{width:6px;height:6px;border-radius:50%;background:var(--cyan);box-shadow:0 0 8px var(--cyan);animation:dfp-pulse 2s infinite;}
  @keyframes dfp-pulse{0%,100%{opacity:1}50%{opacity:.35}}
  .dfp-title{font-size:28px;font-weight:700;letter-spacing:-.01em;margin:0 0 6px;}
  .dfp-sub{color:var(--text-dim);font-size:13.5px;line-height:1.6;max-width:760px;margin:0 0 22px;}
 
  .dfp-banner{
    background:var(--bg-panel); border:1px solid var(--border); border-left:3px solid var(--cyan);
    border-radius:10px; padding:13px 16px; font-size:12.5px; color:var(--text-dim); line-height:1.6;
    margin-bottom:26px; font-family:var(--mono);
  }
  .dfp-banner b{color:var(--text); font-weight:600;}
  .dfp-tag{
    display:inline-block; font-family:var(--mono); font-size:9.5px; letter-spacing:.08em; text-transform:uppercase;
    padding:2px 7px; border-radius:4px; margin-left:6px; vertical-align:1px;
  }
  .dfp-tag-fact{background:rgba(61,220,151,.12); color:var(--green); border:1px solid rgba(61,220,151,.3);}
  .dfp-tag-est{background:rgba(155,140,242,.12); color:var(--purple); border:1px solid rgba(155,140,242,.3);}
 
  .dfp-grid{display:grid; gap:16px;}
  .dfp-g2{grid-template-columns:1fr 1fr;}
  .dfp-g3{grid-template-columns:repeat(3,1fr);}
  .dfp-g4{grid-template-columns:repeat(4,1fr);}
  @media(max-width:860px){.dfp-g2,.dfp-g3,.dfp-g4{grid-template-columns:1fr;}}
 
  .dfp-panel{
    background:var(--bg-panel); border:1px solid var(--border); border-radius:14px; padding:20px;
  }
  .dfp-panel-head{display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;}
  .dfp-panel-title{font-size:14px; font-weight:700; letter-spacing:.01em;}
  .dfp-panel-num{font-family:var(--mono); font-size:10px; color:var(--text-faint);}
  .dfp-section{margin-top:28px;}
  .dfp-section-head{display:flex; align-items:baseline; gap:10px; margin-bottom:14px;}
  .dfp-section-index{font-family:var(--mono); font-size:11px; color:var(--cyan); font-weight:700;}
  .dfp-section-title{font-size:17px; font-weight:700;}
  .dfp-section-note{color:var(--text-faint); font-size:12px; margin:-6px 0 14px;}
 
  /* Score gauges */
  .dfp-gauge-wrap{display:flex; align-items:center; gap:18px;}
  .dfp-gauge-labels{flex:1;}
  .dfp-gauge-band{font-family:var(--mono); font-size:11px; letter-spacing:.05em; text-transform:uppercase; margin-bottom:4px;}
  .dfp-gauge-score{font-size:34px; font-weight:800; font-family:var(--mono); line-height:1;}
  .dfp-gauge-desc{font-size:11.5px; color:var(--text-dim); margin-top:6px; line-height:1.5;}
  .dfp-scale{display:flex; gap:4px; margin-top:12px;}
  .dfp-scale span{flex:1; height:4px; border-radius:2px; background:var(--border);}
  .dfp-scale span.on{opacity:1;}
  .dfp-scale span.off{opacity:.25;}
 
  /* stat row */
  .dfp-stat{background:var(--bg-panel); border:1px solid var(--border); border-radius:12px; padding:16px;}
  .dfp-stat-label{font-family:var(--mono); font-size:10px; letter-spacing:.07em; text-transform:uppercase; color:var(--text-faint); margin-bottom:8px;}
  .dfp-stat-val{font-size:24px; font-weight:800; font-family:var(--mono);}
  .dfp-stat-sub{font-size:11px; color:var(--text-dim); margin-top:5px;}
 
  /* heatmap */
  .dfp-heatmap{display:grid; grid-template-columns:repeat(5,1fr); gap:8px;}
  @media(max-width:700px){.dfp-heatmap{grid-template-columns:repeat(2,1fr);}}
  .dfp-heat-tile{
    border-radius:10px; padding:11px 12px; border:1px solid var(--border); position:relative; overflow:hidden;
    background:var(--bg-panel-2);
  }
  .dfp-heat-bar{position:absolute; left:0; top:0; bottom:0; width:4px;}
  .dfp-heat-app{font-size:12.5px; font-weight:700;}
  .dfp-heat-co{font-size:10px; color:var(--text-faint); font-family:var(--mono); margin-top:2px;}
  .dfp-heat-lvl{font-family:var(--mono); font-size:9.5px; letter-spacing:.06em; text-transform:uppercase; margin-top:8px;}
 
  /* company ranking */
  .dfp-rank-row{display:grid; grid-template-columns:22px 1fr 90px 46px; align-items:center; gap:12px; padding:9px 0; border-bottom:1px solid var(--border-soft);}
  .dfp-rank-row:last-child{border-bottom:none;}
  .dfp-rank-n{font-family:var(--mono); color:var(--text-faint); font-size:11px;}
  .dfp-rank-name{font-size:13px; font-weight:600;}
  .dfp-rank-services{font-size:10.5px; color:var(--text-dim); font-family:var(--mono);}
  .dfp-rank-bar-track{height:6px; border-radius:3px; background:var(--bg-panel-3); overflow:hidden;}
  .dfp-rank-bar-fill{height:100%; border-radius:3px;}
  .dfp-rank-pct{font-family:var(--mono); font-size:11px; text-align:right; color:var(--text-dim);}
 
  /* matrix table */
  .dfp-matrix-scroll{overflow-x:auto; border:1px solid var(--border); border-radius:12px;}
  table.dfp-matrix{border-collapse:collapse; width:100%; font-size:11.5px; min-width:760px;}
  table.dfp-matrix th, table.dfp-matrix td{padding:9px 10px; text-align:center; border-bottom:1px solid var(--border-soft);}
  table.dfp-matrix th{font-family:var(--mono); font-size:9.5px; text-transform:uppercase; letter-spacing:.05em; color:var(--text-faint); background:var(--bg-panel-2); position:sticky; top:0;}
  table.dfp-matrix td:first-child, table.dfp-matrix th:first-child{text-align:left; font-weight:600; color:var(--text); position:sticky; left:0; background:var(--bg-panel); font-size:12px;}
  .dfp-dot-cell{display:inline-block; width:9px; height:9px; border-radius:50%; }
  .lvl-H{background:var(--red); box-shadow:0 0 6px rgba(255,92,92,.5);}
  .lvl-M{background:var(--orange);}
  .lvl-L{background:var(--yellow); opacity:.8;}
  .lvl-N{background:var(--border); opacity:.5;}
 
  /* radar */
  .dfp-radar-wrap{display:flex; gap:22px; align-items:center;}
  @media(max-width:700px){.dfp-radar-wrap{flex-direction:column;}}
  .dfp-radar-legend{flex:1; min-width:200px;}
  .dfp-radar-item{display:flex; justify-content:space-between; align-items:center; padding:7px 0; border-bottom:1px solid var(--border-soft); font-size:12px;}
  .dfp-radar-item:last-child{border:none;}
  .dfp-radar-item span.v{font-family:var(--mono); font-weight:700;}
 
  /* twin profile */
  .dfp-twin{display:flex; gap:18px;}
  @media(max-width:700px){.dfp-twin{flex-direction:column;}}
  .dfp-twin-avatar{
    width:64px; height:64px; border-radius:16px; flex-shrink:0;
    background:linear-gradient(135deg, var(--purple), var(--cyan));
    display:flex; align-items:center; justify-content:center; font-size:24px; font-weight:800; color:#0a0e14;
  }
  .dfp-twin-text p{font-size:13px; line-height:1.75; color:var(--text-dim); margin:0 0 10px;}
  .dfp-twin-text b{color:var(--text); font-weight:600;}
 
  /* asset cards */
  .dfp-asset{background:var(--bg-panel-2); border:1px solid var(--border); border-radius:12px; padding:14px;}
  .dfp-asset-rank{font-family:var(--mono); font-size:10px; color:var(--cyan);}
  .dfp-asset-title{font-size:13px; font-weight:700; margin:5px 0 6px;}
  .dfp-asset-desc{font-size:11.5px; color:var(--text-dim); line-height:1.55;}
  .dfp-asset-src{font-family:var(--mono); font-size:9.5px; color:var(--text-faint); margin-top:8px;}
 
  /* simulator */
  .dfp-sim{display:flex; gap:22px; align-items:flex-start;}
  @media(max-width:800px){.dfp-sim{flex-direction:column;}}
  .dfp-sim-list{flex:1.3;}
  .dfp-sim-item{display:flex; align-items:flex-start; gap:10px; padding:9px 0; border-bottom:1px solid var(--border-soft); cursor:pointer;}
  .dfp-sim-item:last-child{border:none;}
  .dfp-checkbox{
    width:17px; height:17px; border-radius:5px; border:1.5px solid var(--text-faint); flex-shrink:0; margin-top:2px;
    display:flex; align-items:center; justify-content:center; transition:.15s;
  }
  .dfp-checkbox.checked{background:var(--cyan); border-color:var(--cyan);}
  .dfp-checkbox svg{width:10px; height:10px; opacity:0; transition:.15s;}
  .dfp-checkbox.checked svg{opacity:1;}
  .dfp-sim-label{font-size:12.5px; line-height:1.5;}
  .dfp-sim-label b{color:var(--text); font-weight:600; display:block; margin-bottom:1px;}
  .dfp-sim-label span{color:var(--text-faint); font-size:11px;}
  .dfp-sim-result{flex:1; background:var(--bg-panel-2); border:1px solid var(--border); border-radius:12px; padding:18px; text-align:center; position:sticky; top:10px;}
  .dfp-sim-big{font-family:var(--mono); font-size:40px; font-weight:800; margin:6px 0;}
  .dfp-sim-delta{font-family:var(--mono); font-size:12px; color:var(--green);}
 
  /* verdict */
  .dfp-verdict{
    background:linear-gradient(160deg, var(--bg-panel-2), var(--bg-panel));
    border:1px solid var(--border); border-radius:16px; padding:26px; position:relative; overflow:hidden;
  }
  .dfp-verdict::before{
    content:""; position:absolute; top:-40%; right:-10%; width:280px; height:280px; border-radius:50%;
    background:radial-gradient(circle, rgba(47,214,196,.14), transparent 70%);
  }
  .dfp-verdict-grade{font-family:var(--mono); font-size:52px; font-weight:800; color:var(--orange); line-height:1;}
  .dfp-verdict-title{font-size:16px; font-weight:700; margin:8px 0 10px;}
  .dfp-verdict-body{font-size:13px; color:var(--text-dim); line-height:1.75; max-width:640px;}
 
  .dfp-footer{margin-top:34px; padding-top:18px; border-top:1px solid var(--border); font-size:11px; color:var(--text-faint); line-height:1.7; font-family:var(--mono);}
 
  #dfp-radar-sweep{transform-origin:150px 150px; animation:dfp-sweep 4s linear infinite;}
  @keyframes dfp-sweep{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
</style>
 
<div class="dfp-root">
 
  <div class="dfp-eyebrow"><span class="dfp-dot"></span>PRIVACY CHECKUP · SIMULATED REPORT</div>
  <h1 class="dfp-title">Digital Footprint &amp; Exposure Report</h1>
  <p class="dfp-sub">Built from a self-reported list of 15 apps. Everything below is derived from public knowledge of what these companies typically collect — nothing here comes from any private database, network traffic, or account access.</p>
 
  <div class="dfp-banner">
    <b>How to read this report —</b> Lines marked <span class="dfp-tag dfp-tag-fact">FACT</span> come directly from the app list you provided. Everything marked <span class="dfp-tag dfp-tag-est">ESTIMATE</span> is an inference based on how these companies generally operate — never a certainty, and never sourced from your actual account data.
  </div>
 
  <!-- SCORES -->
  <div class="dfp-grid dfp-g2">
    <div class="dfp-panel">
      <div class="dfp-panel-head"><div class="dfp-panel-title">Digital Footprint Score</div><div class="dfp-panel-num">01 / ESTIMATE</div></div>
      <div class="dfp-gauge-wrap">
        <svg width="86" height="86" viewBox="0 0 86 86">
          <circle cx="43" cy="43" r="36" fill="none" stroke="#1a2230" stroke-width="8"/>
          <circle cx="43" cy="43" r="36" fill="none" stroke="#ff9f5a" stroke-width="8" stroke-linecap="round"
            stroke-dasharray="226.2" stroke-dashoffset="63.3" transform="rotate(-90 43 43)"/>
        </svg>
        <div class="dfp-gauge-labels">
          <div class="dfp-gauge-band" style="color:#ff9f5a">🟠 Significant</div>
          <div class="dfp-gauge-score">72<span style="font-size:15px;color:var(--text-faint)">/100</span></div>
        </div>
      </div>
      <div class="dfp-scale">
        <span class="on" style="background:#3ddc97"></span>
        <span class="on" style="background:#f2c94c"></span>
        <span class="on" style="background:#ff9f5a"></span>
        <span class="off" style="background:#ff5c5c"></span>
      </div>
      <div class="dfp-gauge-desc">Estimated from category breadth: your 15 services span social, messaging, entertainment, gaming, shopping, payments, search and cloud photo storage — 8 distinct data-generating categories, which is a wide surface area.</div>
    </div>
 
    <div class="dfp-panel">
      <div class="dfp-panel-head"><div class="dfp-panel-title">Privacy Score</div><div class="dfp-panel-num">02 / ESTIMATE</div></div>
      <div class="dfp-gauge-wrap">
        <svg width="86" height="86" viewBox="0 0 86 86">
          <circle cx="43" cy="43" r="36" fill="none" stroke="#1a2230" stroke-width="8"/>
          <circle cx="43" cy="43" r="36" fill="none" stroke="#ff9f5a" stroke-width="8" stroke-linecap="round"
            stroke-dasharray="226.2" stroke-dashoffset="151.6" transform="rotate(-90 43 43)"/>
        </svg>
        <div class="dfp-gauge-labels">
          <div class="dfp-gauge-band" style="color:#ff9f5a">🟠 Fair</div>
          <div class="dfp-gauge-score" id="dfp-priv-score">33<span style="font-size:15px;color:var(--text-faint)">/100</span></div>
        </div>
      </div>
      <div class="dfp-scale" id="dfp-priv-scale">
        <span class="off" style="background:#ff5c5c"></span>
        <span class="on" style="background:#ff9f5a"></span>
        <span class="off" style="background:#f2c94c"></span>
        <span class="off" style="background:#3ddc97"></span>
      </div>
      <div class="dfp-gauge-desc">Weighed down by heavy reliance on ad-funded platforms (social, video, search). Partly offset by two end-to-end-encrypted messengers (WhatsApp, iMessage) in the mix. Try the simulator near the bottom to see what moves this number.</div>
    </div>
  </div>
 
  <!-- QUICK STATS -->
  <div class="dfp-grid dfp-g4" style="margin-top:16px;">
    <div class="dfp-stat">
      <div class="dfp-stat-label">Total Services Used</div>
      <div class="dfp-stat-val">15</div>
      <div class="dfp-stat-sub">Fact — from your list</div>
    </div>
    <div class="dfp-stat">
      <div class="dfp-stat-label">Parent Companies</div>
      <div class="dfp-stat-val">11</div>
      <div class="dfp-stat-sub">Estimate — inferred ownership</div>
    </div>
    <div class="dfp-stat">
      <div class="dfp-stat-label">Ecosystem Concentration</div>
      <div class="dfp-stat-val">27%</div>
      <div class="dfp-stat-sub">Estimate — Alphabet holds 4/15 services</div>
    </div>
    <div class="dfp-stat">
      <div class="dfp-stat-label">Est. Tracking Surface</div>
      <div class="dfp-stat-val">12/15</div>
      <div class="dfp-stat-sub">Estimate — services rated medium/high tracking</div>
    </div>
  </div>
 
  <!-- HEATMAP -->
  <div class="dfp-section">
    <div class="dfp-section-head"><span class="dfp-section-index">03</span><span class="dfp-section-title">Exposure Heatmap</span><span class="dfp-tag dfp-tag-est">Estimate</span></div>
    <div class="dfp-section-note">Relative exposure per app — a rough read on how much a service likely knows about you, based on its category and typical data practices.</div>
    <div class="dfp-heatmap" id="dfp-heatmap"></div>
  </div>
 
  <!-- COMPANY RANKING -->
  <div class="dfp-section">
    <div class="dfp-section-head"><span class="dfp-section-index">04</span><span class="dfp-section-title">Company Exposure Ranking</span><span class="dfp-tag dfp-tag-est">Estimate</span></div>
    <div class="dfp-section-note">Ranked by number of your services owned, as a rough proxy for how much of your activity that company can potentially see across contexts.</div>
    <div class="dfp-panel" id="dfp-ranking"></div>
  </div>
 
  <!-- DATA COLLECTION MATRIX -->
  <div class="dfp-section">
    <div class="dfp-section-head"><span class="dfp-section-index">05</span><span class="dfp-section-title">Data Collection Matrix</span><span class="dfp-tag dfp-tag-est">Estimate</span></div>
    <div class="dfp-section-note">Illustrative — likely data categories each service collects, based on its publicly known product design. Not pulled from any account or database.</div>
    <div class="dfp-matrix-scroll"><table class="dfp-matrix" id="dfp-matrix"></table></div>
    <div style="display:flex;gap:16px;margin-top:10px;font-size:10.5px;color:var(--text-dim);font-family:var(--mono);">
      <div><span class="dfp-dot-cell lvl-H"></span> High</div>
      <div><span class="dfp-dot-cell lvl-M"></span> Medium</div>
      <div><span class="dfp-dot-cell lvl-L"></span> Low</div>
      <div><span class="dfp-dot-cell lvl-N"></span> Minimal/None</div>
    </div>
  </div>
 
  <!-- RISK RADAR -->
  <div class="dfp-section">
    <div class="dfp-section-head"><span class="dfp-section-index">06</span><span class="dfp-section-title">Risk Radar</span><span class="dfp-tag dfp-tag-est">Estimate</span></div>
    <div class="dfp-panel">
      <div class="dfp-radar-wrap">
        <svg width="300" height="300" viewBox="0 0 300 300" id="dfp-radar-svg"></svg>
        <div class="dfp-radar-legend" id="dfp-radar-legend"></div>
      </div>
    </div>
  </div>
 
  <!-- DIGITAL TWIN -->
  <div class="dfp-section">
    <div class="dfp-section-head"><span class="dfp-section-index">07</span><span class="dfp-section-title">Digital Twin Profile</span><span class="dfp-tag dfp-tag-est">Estimate</span></div>
    <div class="dfp-panel dfp-twin">
      <div class="dfp-twin-avatar">DT</div>
      <div class="dfp-twin-text">
        <p><b>Likely a mobile-first, entertainment- and social-heavy user.</b> The mix of short-video (TikTok), video (YouTube), and image/story apps (Instagram, Snapchat) suggests attention-driven, algorithmic feed usage is probably a daily habit — though session length and intensity can't be estimated from an app list alone.</p>
        <p><b>Probable presence in India or a similar UPI-driven market.</b> The combination of Google Pay and Meesho — both strongly associated with the Indian market — makes it likely this profile transacts using UPI-based mobile payments and shops on value-focused e-commerce platforms.</p>
        <p><b>Plausibly a younger user or gamer.</b> Roblox and PUBG Mobile together are commonly associated with younger or gaming-oriented audiences, though this is a weak signal on its own.</p>
        <p><b>Cross-platform communicator.</b> Running Discord, WhatsApp, and iMessage side by side points to a habit of segmenting conversations by context (gaming/community vs. personal vs. close contacts) rather than a single primary channel.</p>
        <p style="color:var(--text-faint);font-size:11px;">Not enough information provided to estimate age, income, occupation, relationship status, or exact location.</p>
      </div>
    </div>
  </div>
 
  <!-- MOST VALUABLE DATA ASSETS -->
  <div class="dfp-section">
    <div class="dfp-section-head"><span class="dfp-section-index">08</span><span class="dfp-section-title">Most Valuable Data Assets</span><span class="dfp-tag dfp-tag-est">Estimate</span></div>
    <div class="dfp-section-note">Ranked by how commercially valuable this category of data typically is to advertisers and data brokers.</div>
    <div class="dfp-grid dfp-g3" id="dfp-assets"></div>
  </div>
 
  <!-- SIMULATOR -->
  <div class="dfp-section">
    <div class="dfp-section-head"><span class="dfp-section-index">09</span><span class="dfp-section-title">Privacy Improvement Simulator</span></div>
    <div class="dfp-section-note">Toggle actions on to see a rough, illustrative estimate of how much each one could raise your privacy score.</div>
    <div class="dfp-panel dfp-sim">
      <div class="dfp-sim-list" id="dfp-sim-list"></div>
      <div class="dfp-sim-result">
        <div class="dfp-panel-num">SIMULATED PRIVACY SCORE</div>
        <div class="dfp-sim-big" id="dfp-sim-score" style="color:#ff9f5a">33</div>
        <div class="dfp-sim-delta" id="dfp-sim-delta">baseline</div>
        <div style="font-size:11px;color:var(--text-faint);margin-top:10px;line-height:1.6;">Illustrative only — actual privacy gains depend on each platform's real settings and how they're used.</div>
      </div>
    </div>
  </div>
 
  <!-- WOW INSIGHTS -->
  <div class="dfp-section">
    <div class="dfp-section-head"><span class="dfp-section-index">10</span><span class="dfp-section-title">WOW Insights</span><span class="dfp-tag dfp-tag-est">Estimate</span></div>
    <div class="dfp-grid dfp-g3">
      <div class="dfp-asset"><div class="dfp-asset-title">🔎 One company sees ~27% of your activity</div><div class="dfp-asset-desc">Alphabet/Google touches Search, YouTube, Pay, and Photos — four separate windows into intent, entertainment, spending, and personal media, all under one roof.</div></div>
      <div class="dfp-asset"><div class="dfp-asset-title">🔐 Only 2 of 15 apps are end-to-end encrypted by default</div><div class="dfp-asset-desc">WhatsApp and iMessage protect message content; most of the rest — including Discord and social DMs — generally don't offer that by default.</div></div>
      <div class="dfp-asset"><div class="dfp-asset-title">💳 Two payment surfaces, one country signal</div><div class="dfp-asset-desc">Google Pay + Meesho together make an Indian, UPI-based shopping and payments habit a reasonably strong estimate.</div></div>
    </div>
  </div>
 
  <!-- FINAL VERDICT -->
  <div class="dfp-section">
    <div class="dfp-section-head"><span class="dfp-section-index">11</span><span class="dfp-section-title">Final Verdict</span></div>
    <div class="dfp-verdict">
      <div class="dfp-verdict-grade">B–</div>
      <div class="dfp-verdict-title">Broad footprint, moderate control</div>
      <div class="dfp-verdict-body">
        This profile covers a wide range of everyday categories — social, messaging, entertainment, gaming, shopping, payments, and cloud photos — which is normal for an active smartphone user, not alarming on its own. The main pattern worth noting is <b>concentration</b>: a large share of activity likely flows through one company (Alphabet) and a handful of ad-funded platforms. Tightening ad-personalization settings on Google and Meta, and reviewing what Amazon, Meesho, and TikTok/Snapchat are allowed to track, would likely move the privacy score up the most for the least effort.
      </div>
    </div>
  </div>
 
  <div class="dfp-footer">
    This report is generated entirely from the service list you provided, combined with general public knowledge of how these companies typically operate. No private, third-party, or account-level data was accessed to produce it. All numeric scores, rankings, and profile statements are estimates for illustrative purposes and should not be treated as fact.
  </div>
</div>
 
<script>
(function(){
  const APPS = [
    {name:"Instagram", co:"Meta", level:"High", loc:"M",contacts:"M",content:"M",search:"L",media:"H",payment:"L",behavior:"H"},
    {name:"Snapchat", co:"Snap Inc.", level:"High", loc:"H",contacts:"M",content:"L",search:"L",media:"H",payment:"L",behavior:"H"},
    {name:"TikTok", co:"ByteDance", level:"High", loc:"M",contacts:"L",content:"L",search:"M",media:"H",payment:"L",behavior:"H"},
    {name:"YouTube", co:"Alphabet", level:"High", loc:"M",contacts:"L",content:"L",search:"H",media:"M",payment:"L",behavior:"H"},
    {name:"Discord", co:"Discord Inc.", level:"Medium", loc:"L",contacts:"L",content:"M",search:"L",media:"L",payment:"L",behavior:"M"},
    {name:"WhatsApp", co:"Meta", level:"Low", loc:"L",contacts:"H",content:"L",search:"N",media:"L",payment:"L",behavior:"M"},
    {name:"iMessage", co:"Apple", level:"Low", loc:"L",contacts:"M",content:"L",search:"N",media:"L",payment:"N",behavior:"L"},
    {name:"Spotify", co:"Spotify", level:"Medium", loc:"L",contacts:"N",content:"N",search:"M",media:"N",payment:"M",behavior:"H"},
    {name:"Roblox", co:"Roblox Corp.", level:"Medium", loc:"L",contacts:"L",content:"M",search:"L",media:"L",payment:"M",behavior:"H"},
    {name:"PUBG Mobile", co:"Krafton", level:"Medium", loc:"M",contacts:"L",content:"M",search:"N",media:"L",payment:"M",behavior:"H"},
    {name:"Amazon", co:"Amazon", level:"High", loc:"H",contacts:"N",content:"N",search:"H",media:"N",payment:"H",behavior:"H"},
    {name:"Meesho", co:"Meesho", level:"High", loc:"H",contacts:"N",content:"N",search:"M",media:"N",payment:"H",behavior:"M"},
    {name:"Google Search", co:"Alphabet", level:"High", loc:"M",contacts:"N",content:"N",search:"H",media:"N",payment:"N",behavior:"H"},
    {name:"Google Pay", co:"Alphabet", level:"High", loc:"M",contacts:"M",content:"N",search:"N",media:"N",payment:"H",behavior:"M"},
    {name:"Google Photos", co:"Alphabet", level:"Medium", loc:"H",contacts:"N",content:"N",search:"N",media:"H",payment:"N",behavior:"L"},
  ];
 
  const LEVEL_COLOR = {High:"#ff5c5c", Medium:"#ff9f5a", Low:"#f2c94c"};
 
  // Heatmap
  const hm = document.getElementById("dfp-heatmap");
  APPS.forEach(a=>{
    const c = LEVEL_COLOR[a.level];
    hm.insertAdjacentHTML("beforeend", `
      <div class="dfp-heat-tile">
        <div class="dfp-heat-bar" style="background:${c}"></div>
        <div class="dfp-heat-app">${a.name}</div>
        <div class="dfp-heat-co">${a.co}</div>
        <div class="dfp-heat-lvl" style="color:${c}">${a.level} exposure</div>
      </div>`);
  });
 
  // Company ranking
  const companies = {};
  APPS.forEach(a=>{ companies[a.co] = (companies[a.co]||0) + 1; });
  const ranked = Object.entries(companies).sort((a,b)=>b[1]-a[1]);
  const maxCount = ranked[0][1];
  const rankColors = ["#ff5c5c","#ff9f5a","#f2c94c","#2fd6c4","#9b8cf2"];
  const rankEl = document.getElementById("dfp-ranking");
  ranked.forEach(([name,count], i)=>{
    const pct = Math.round((count/APPS.length)*100);
    const barPct = Math.round((count/maxCount)*100);
    const color = rankColors[Math.min(i, rankColors.length-1)];
    rankEl.insertAdjacentHTML("beforeend", `
      <div class="dfp-rank-row">
        <div class="dfp-rank-n">${i+1}</div>
        <div>
          <div class="dfp-rank-name">${name}</div>
          <div class="dfp-rank-services">${count} of your service${count>1?'s':''}</div>
        </div>
        <div class="dfp-rank-bar-track"><div class="dfp-rank-bar-fill" style="width:${barPct}%;background:${color}"></div></div>
        <div class="dfp-rank-pct">${pct}%</div>
      </div>`);
  });
 
  // Matrix
  const cols = [["loc","Location"],["contacts","Contacts"],["content","Content"],["search","Search"],["media","Media/Bio"],["payment","Payment"],["behavior","Behavior"]];
  const mx = document.getElementById("dfp-matrix");
  let thead = "<tr><th>Service</th>" + cols.map(c=>`<th>${c[1]}</th>`).join("") + "</tr>";
  let rows = APPS.map(a=>{
    return "<tr><td>"+a.name+"</td>" + cols.map(c=>{
      const v = a[c[0]];
      return `<td><span class="dfp-dot-cell lvl-${v}"></span></td>`;
    }).join("") + "</tr>";
  }).join("");
  mx.innerHTML = thead + rows;
 
  // Radar
  const radarData = [
    {label:"Ad & Behavioral Tracking", val:82},
    {label:"Third-Party Data Sharing", val:75},
    {label:"Social/Broker Exposure", val:70},
    {label:"Location Exposure", val:65},
    {label:"Financial Exposure", val:60},
    {label:"Biometric/Media Exposure", val:55},
  ];
  const svg = document.getElementById("dfp-radar-svg");
  const cx=150, cy=150, R=110, n=radarData.length;
  const angle = i => (Math.PI*2/n)*i - Math.PI/2;
  const pt = (i, r) => [cx + r*Math.cos(angle(i)), cy + r*Math.sin(angle(i))];
  let svgHtml = "";
  // rings
  [0.25,0.5,0.75,1].forEach(f=>{
    let ring = "";
    for(let i=0;i<n;i++){ const [x,y]=pt(i,R*f); ring += (i===0?"M":"L")+x+","+y+" "; }
    svgHtml += `<path d="${ring}Z" fill="none" stroke="#1e2733" stroke-width="1"/>`;
  });
  // spokes + labels
  for(let i=0;i<n;i++){
    const [x,y] = pt(i,R);
    svgHtml += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#1e2733" stroke-width="1"/>`;
  }
  // sweep (signature element)
  svgHtml += `<g id="dfp-radar-sweep"><path d="M ${cx} ${cy} L ${cx} ${cy-R} A ${R} ${R} 0 0 1 ${cx+R*Math.sin(0.5)} ${cy-R*Math.cos(0.5)} Z" fill="url(#sweepGrad)"/></g>
  <defs><linearGradient id="sweepGrad" x1="0" y1="1" x2="0" y2="0">
    <stop offset="0%" stop-color="#2fd6c4" stop-opacity="0"/>
    <stop offset="100%" stop-color="#2fd6c4" stop-opacity="0.35"/>
  </linearGradient></defs>`;
  // data polygon
  let poly = "";
  radarData.forEach((d,i)=>{ const [x,y]=pt(i, R*(d.val/100)); poly += (i===0?"M":"L")+x+","+y+" "; });
  svgHtml += `<path d="${poly}Z" fill="rgba(255,92,92,0.16)" stroke="#ff5c5c" stroke-width="2"/>`;
  radarData.forEach((d,i)=>{ const [x,y]=pt(i, R*(d.val/100)); svgHtml += `<circle cx="${x}" cy="${y}" r="3.5" fill="#ff5c5c"/>`; });
  svg.innerHTML = svgHtml;
 
  const legend = document.getElementById("dfp-radar-legend");
  radarData.forEach(d=>{
    legend.insertAdjacentHTML("beforeend", `<div class="dfp-radar-item"><span>${d.label}</span><span class="v" style="color:#ff5c5c">${d.val}</span></div>`);
  });
 
  // Assets
  const assets = [
    {rank:"01", title:"Payment & Financial Data", desc:"Google Pay (and Meesho/Amazon checkout) reveal spending patterns, transaction frequency, and merchant relationships — high commercial value.", src:"Source: Google Pay, Amazon, Meesho"},
    {rank:"02", title:"Search & Intent Data", desc:"Google Search captures what you're actively looking for — arguably the single most predictive signal advertisers pay for.", src:"Source: Google Search"},
    {rank:"03", title:"Social Graph", desc:"Instagram, WhatsApp, Snapchat, and Discord together map who you talk to and how often, across different relationship contexts.", src:"Source: Instagram, WhatsApp, Snapchat, Discord"},
    {rank:"04", title:"Location History", desc:"Delivery addresses (Amazon, Meesho), geotagged photos (Google Photos), and map-linked features (Snapchat) can approximate routine locations.", src:"Source: Amazon, Meesho, Google Photos, Snapchat"},
    {rank:"05", title:"Media & Biometric Signals", desc:"Google Photos and Instagram may process face groupings or image content for organization and recommendation features.", src:"Source: Google Photos, Instagram"},
    {rank:"06", title:"Attention & Behavior Data", desc:"TikTok, YouTube, and Spotify learn from every scroll, skip, and replay — building a detailed engagement profile over time.", src:"Source: TikTok, YouTube, Spotify"},
  ];
  const assetsEl = document.getElementById("dfp-assets");
  assets.forEach(a=>{
    assetsEl.insertAdjacentHTML("beforeend", `
      <div class="dfp-asset">
        <div class="dfp-asset-rank">${a.rank}</div>
        <div class="dfp-asset-title">${a.title}</div>
        <div class="dfp-asset-desc">${a.desc}</div>
        <div class="dfp-asset-src">${a.src}</div>
      </div>`);
  });
 
  // Simulator
  const actions = [
    {label:"Turn off ad personalization on Google", sub:"Affects Search, YouTube, Photos, Pay", pts:6},
    {label:"Review Meta ad preferences", sub:"Affects Instagram, WhatsApp", pts:5},
    {label:"Limit ad tracking on TikTok & Snapchat", sub:"Reduce behavioral profiling", pts:5},
    {label:"Audit Google Photos face grouping & backup", sub:"Limit biometric-style processing", pts:4},
    {label:"Review Amazon & Meesho data sharing settings", sub:"Limit purchase-history sharing with partners", pts:4},
    {label:"Run a permissions audit across all 15 apps", sub:"Location, mic, camera, contacts access", pts:6},
    {label:"Reduce linked/cross-app logins", sub:"Fewer accounts tied to one identity graph", pts:3},
  ];
  const simList = document.getElementById("dfp-sim-list");
  const BASE = 33;
  const state = actions.map(()=>false);
  function render(){
    simList.innerHTML = "";
    actions.forEach((a,i)=>{
      simList.insertAdjacentHTML("beforeend", `
        <div class="dfp-sim-item" data-i="${i}">
          <div class="dfp-checkbox ${state[i]?'checked':''}"><svg viewBox="0 0 24 24" fill="none"><path d="M4 12l6 6L20 6" stroke="#0a0e14" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
          <div class="dfp-sim-label"><b>${a.label}</b><span>${a.sub} · +${a.pts} est. pts</span></div>
        </div>`);
    });
    document.querySelectorAll(".dfp-sim-item").forEach(el=>{
      el.addEventListener("click", ()=>{
        const i = +el.dataset.i;
        state[i] = !state[i];
        render();
        update();
      });
    });
  }
  function bandColor(score){
    if(score<=30) return "#ff5c5c";
    if(score<=60) return "#ff9f5a";
    if(score<=80) return "#f2c94c";
    return "#3ddc97";
  }
  function bandName(score){
    if(score<=30) return "Weak";
    if(score<=60) return "Fair";
    if(score<=80) return "Good";
    return "Strong";
  }
  function update(){
    let added = 0;
    actions.forEach((a,i)=>{ if(state[i]) added += a.pts; });
    const score = Math.min(100, BASE + added);
    const el = document.getElementById("dfp-sim-score");
    el.textContent = score;
    el.style.color = bandColor(score);
    document.getElementById("dfp-sim-delta").textContent = added===0 ? "baseline" : `+${added} pts → ${bandName(score)}`;
  }
  render();
  update();
})();
</script>
 
