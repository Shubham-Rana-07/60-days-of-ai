<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AI Supply Chain Control Tower</title>
<style>
  /* ================= ROOT / THEME ================= */
  :root{
    --bg-0:#05070d;
    --bg-1:#0a0e1a;
    --bg-2:#101728;
    --bg-card:#0f1524;
    --border:#1e2b45;
    --blue:#3b82f6;
    --cyan:#22d3ee;
    --green:#22c55e;
    --orange:#f59e0b;
    --red:#ef4444;
    --text-0:#e8ecf5;
    --text-1:#93a1c2;
    --text-2:#5c6a8a;
    --glow-blue: 0 0 20px rgba(59,130,246,.35);
    --glow-cyan: 0 0 20px rgba(34,211,238,.35);
    --glow-red: 0 0 22px rgba(239,68,68,.45);
    --glow-green: 0 0 20px rgba(34,197,94,.35);
    --glow-orange: 0 0 20px rgba(245,158,11,.35);
    --radius: 14px;
  }
  *{box-sizing:border-box; margin:0; padding:0;}
  html,body{height:100%;}
  body{
    font-family: 'Segoe UI', Inter, Roboto, -apple-system, BlinkMacSystemFont, sans-serif;
    background:
      radial-gradient(1200px 600px at 10% -10%, rgba(59,130,246,.10), transparent 60%),
      radial-gradient(1000px 700px at 110% 10%, rgba(34,211,238,.08), transparent 60%),
      linear-gradient(180deg, var(--bg-0), var(--bg-1) 40%, var(--bg-0));
    color: var(--text-0);
    min-height:100vh;
    overflow-x:hidden;
  }
  ::-webkit-scrollbar{width:8px; height:8px;}
  ::-webkit-scrollbar-thumb{background:#1e2b45; border-radius:4px;}
  ::-webkit-scrollbar-track{background:transparent;}

  button{
    font-family:inherit;
    cursor:pointer;
    border:none;
    outline:none;
  }

  /* ================= LAYOUT ================= */
  #app{max-width:1500px; margin:0 auto; padding:16px 20px 60px;}

  header.topbar{
    display:flex; align-items:center; justify-content:space-between;
    padding:14px 20px; margin-bottom:16px;
    background:linear-gradient(135deg, rgba(15,21,36,.9), rgba(10,14,26,.9));
    border:1px solid var(--border); border-radius:var(--radius);
    box-shadow: 0 0 0 1px rgba(255,255,255,.02), var(--glow-blue);
    flex-wrap:wrap; gap:10px;
  }
  .brand{display:flex; align-items:center; gap:12px;}
  .brand .logo{
    width:40px; height:40px; border-radius:10px;
    background:linear-gradient(135deg, var(--blue), var(--cyan));
    display:flex; align-items:center; justify-content:center;
    font-size:20px; box-shadow: var(--glow-cyan);
    flex-shrink:0;
  }
  .brand h1{font-size:18px; letter-spacing:.5px;}
  .brand p{font-size:11px; color:var(--text-1); letter-spacing:1.5px; text-transform:uppercase;}

  .top-controls{display:flex; gap:8px; align-items:center; flex-wrap:wrap;}
  .icon-btn{
    background:var(--bg-2); border:1px solid var(--border); color:var(--text-0);
    width:38px; height:38px; border-radius:10px; font-size:16px;
    display:flex; align-items:center; justify-content:center;
    transition: all .2s ease;
  }
  .icon-btn:hover{border-color:var(--cyan); box-shadow:var(--glow-cyan); transform:translateY(-1px);}
  .icon-btn.active{background:linear-gradient(135deg, var(--blue), var(--cyan)); color:#04101f;}

  .timer-pill{
    display:flex; align-items:center; gap:8px;
    background:var(--bg-2); border:1px solid var(--border);
    padding:8px 16px; border-radius:999px;
    font-variant-numeric:tabular-nums;
    font-weight:700; font-size:16px;
  }
  .timer-pill.warn{color:var(--orange); border-color:var(--orange); box-shadow:var(--glow-orange);}
  .timer-pill.critical{color:var(--red); border-color:var(--red); box-shadow:var(--glow-red); animation:pulseSoft 1s infinite;}

  /* ================= KPI GRID ================= */
  .kpi-grid{
    display:grid;
    grid-template-columns:repeat(7, 1fr);
    gap:12px; margin-bottom:18px;
  }
  .kpi-card{
    background:linear-gradient(160deg, var(--bg-card), var(--bg-2));
    border:1px solid var(--border); border-radius:var(--radius);
    padding:14px 14px 12px; position:relative; overflow:hidden;
    transition: box-shadow .3s ease, transform .3s ease;
  }
  .kpi-card::before{
    content:""; position:absolute; inset:0;
    background:radial-gradient(120px 60px at 20% 0%, rgba(255,255,255,.06), transparent 70%);
    pointer-events:none;
  }
  .kpi-card .label{font-size:10.5px; color:var(--text-1); text-transform:uppercase; letter-spacing:1px; margin-bottom:6px;}
  .kpi-card .value{font-size:22px; font-weight:700; font-variant-numeric:tabular-nums;}
  .kpi-card .bar-track{margin-top:8px; height:5px; border-radius:3px; background:#131b2e; overflow:hidden;}
  .kpi-card .bar-fill{height:100%; border-radius:3px; transition: width .6s ease, background .3s ease;}
  .kpi-card.flash{animation:flashCard .6s ease;}
  .kpi-card.good .value{color:var(--green);}
  .kpi-card.bad .value{color:var(--red);}
  .kpi-card.mid .value{color:var(--orange);}
  @keyframes flashCard{
    0%{box-shadow:0 0 0 rgba(255,255,255,0);}
    30%{box-shadow:0 0 26px rgba(255,255,255,.25);}
    100%{box-shadow:0 0 0 rgba(255,255,255,0);}
  }

  /* ================= MAIN GRID ================= */
  .main-grid{
    display:grid;
    grid-template-columns: 1.7fr 1fr;
    gap:16px;
    align-items:start;
  }

  .panel{
    background:linear-gradient(160deg, var(--bg-card), var(--bg-2));
    border:1px solid var(--border); border-radius:var(--radius);
    padding:16px;
  }
  .panel h2{
    font-size:13px; text-transform:uppercase; letter-spacing:1.5px; color:var(--text-1);
    margin-bottom:12px; display:flex; align-items:center; gap:8px;
  }
  .panel h2 .dot{width:8px; height:8px; border-radius:50%; background:var(--cyan); box-shadow:0 0 8px var(--cyan);}

  /* ================= ALERTS ================= */
  #alerts-container{
    display:flex; flex-direction:column; gap:12px;
    min-height:200px;
  }
  .empty-state{
    text-align:center; padding:40px 10px; color:var(--text-2); font-size:13px;
  }
  .alert-card{
    background:var(--bg-2); border:1px solid var(--border); border-left:4px solid var(--blue);
    border-radius:12px; padding:14px 16px;
    animation: slideIn .35s ease;
    position:relative;
    transition: transform .2s ease, box-shadow .2s ease;
  }
  .alert-card:hover{transform:translateY(-2px);}
  .alert-card.priority-critical{border-left-color:var(--red); box-shadow: var(--glow-red);}
  .alert-card.priority-high{border-left-color:var(--orange); box-shadow: var(--glow-orange);}
  .alert-card.priority-medium{border-left-color:var(--cyan);}
  .alert-card.priority-critical .pulse-dot{animation:pulseSoft 1s infinite;}

  @keyframes slideIn{
    from{opacity:0; transform:translateX(-16px);}
    to{opacity:1; transform:translateX(0);}
  }
  @keyframes pulseSoft{
    0%{box-shadow:0 0 0 0 rgba(239,68,68,.5);}
    70%{box-shadow:0 0 0 10px rgba(239,68,68,0);}
    100%{box-shadow:0 0 0 0 rgba(239,68,68,0);}
  }

  .alert-top{display:flex; justify-content:space-between; align-items:flex-start; gap:10px; margin-bottom:6px;}
  .alert-title-wrap{display:flex; align-items:center; gap:8px;}
  .pulse-dot{width:9px; height:9px; border-radius:50%; background:var(--red); flex-shrink:0;}
  .alert-card.priority-high .pulse-dot{background:var(--orange);}
  .alert-card.priority-medium .pulse-dot{background:var(--cyan);}
  .alert-title{font-size:14.5px; font-weight:700;}
  .alert-badge{
    font-size:10px; text-transform:uppercase; letter-spacing:.8px; font-weight:700;
    padding:3px 9px; border-radius:999px; white-space:nowrap;
  }
  .badge-critical{background:rgba(239,68,68,.15); color:var(--red); border:1px solid rgba(239,68,68,.4);}
  .badge-high{background:rgba(245,158,11,.15); color:var(--orange); border:1px solid rgba(245,158,11,.4);}
  .badge-medium{background:rgba(34,211,238,.15); color:var(--cyan); border:1px solid rgba(34,211,238,.4);}

  .alert-desc{font-size:12.5px; color:var(--text-1); margin-bottom:8px; line-height:1.5;}
  .alert-meta{display:flex; flex-wrap:wrap; gap:14px; font-size:11px; color:var(--text-2); margin-bottom:10px;}
  .alert-meta span b{color:var(--text-0);}
  .alert-timer{font-weight:700; font-variant-numeric:tabular-nums;}
  .alert-timer.low{color:var(--red);}

  .alert-actions{display:flex; flex-wrap:wrap; gap:8px;}
  .action-btn{
    background:var(--bg-1); border:1px solid var(--border); color:var(--text-0);
    padding:8px 12px; border-radius:8px; font-size:12px; font-weight:600;
    transition: all .18s ease;
  }
  .action-btn:hover{border-color:var(--cyan); color:var(--cyan); box-shadow:var(--glow-cyan); transform:translateY(-1px);}
  .action-btn.primary{background:linear-gradient(135deg, var(--blue), var(--cyan)); color:#04101f; border:none;}
  .action-btn.primary:hover{filter:brightness(1.1);}
  .action-btn.danger{border-color:rgba(239,68,68,.4); color:#fca5a5;}
  .action-btn.danger:hover{border-color:var(--red); color:var(--red); box-shadow:var(--glow-red);}
  .action-btn.ghost{opacity:.75;}

  .alert-progress{height:3px; background:#131b2e; border-radius:2px; margin-top:10px; overflow:hidden;}
  .alert-progress-fill{height:100%; background:var(--cyan); transition:width 1s linear;}
  .priority-critical .alert-progress-fill{background:var(--red);}
  .priority-high .alert-progress-fill{background:var(--orange);}

  /* ================= LOG ================= */
  #log-container{
    display:flex; flex-direction:column-reverse; gap:6px;
    max-height:560px; overflow-y:auto; font-size:12px;
  }
  .log-entry{
    display:flex; gap:8px; padding:8px 10px; border-radius:8px;
    background:var(--bg-1); border-left:3px solid var(--text-2);
    animation: fadeIn .3s ease;
    line-height:1.4;
  }
  @keyframes fadeIn{from{opacity:0;} to{opacity:1;}}
  .log-entry.good{border-left-color:var(--green);}
  .log-entry.bad{border-left-color:var(--red);}
  .log-entry.info{border-left-color:var(--cyan);}
  .log-entry.warn{border-left-color:var(--orange);}
  .log-time{color:var(--text-2); flex-shrink:0; font-variant-numeric:tabular-nums;}

  .side-stack{display:flex; flex-direction:column; gap:16px;}

  .mini-stats{display:grid; grid-template-columns:1fr 1fr; gap:10px;}
  .mini-stat{
    background:var(--bg-1); border:1px solid var(--border); border-radius:10px;
    padding:10px; text-align:center;
  }
  .mini-stat .n{font-size:20px; font-weight:700;}
  .mini-stat .l{font-size:10px; color:var(--text-2); text-transform:uppercase; letter-spacing:1px; margin-top:2px;}
  .mini-stat.correct .n{color:var(--green);}
  .mini-stat.wrong .n{color:var(--red);}

  /* ================= MODALS ================= */
  .modal-overlay{
    position:fixed; inset:0; background:rgba(3,5,10,.75); backdrop-filter:blur(4px);
    display:flex; align-items:center; justify-content:center; z-index:100;
    animation:fadeIn .25s ease; padding:20px;
  }
  .modal-overlay.hidden{display:none;}
  .modal-box{
    background:linear-gradient(160deg, var(--bg-card), var(--bg-2));
    border:1px solid var(--border); border-radius:16px;
    padding:28px; max-width:520px; width:100%;
    box-shadow: 0 0 60px rgba(34,211,238,.15);
    max-height:85vh; overflow-y:auto;
  }
  .modal-box h2{font-size:20px; margin-bottom:14px; display:flex; align-items:center; gap:10px;}
  .modal-box p, .modal-box li{font-size:13.5px; color:var(--text-1); line-height:1.6;}
  .modal-box ul{margin:10px 0 10px 20px;}
  .modal-box h3{font-size:13px; color:var(--cyan); margin:14px 0 6px; text-transform:uppercase; letter-spacing:1px;}
  .modal-close-btn{
    margin-top:18px; width:100%; padding:12px; border-radius:10px;
    background:linear-gradient(135deg, var(--blue), var(--cyan)); color:#04101f;
    font-weight:700; font-size:14px;
  }

  /* Start screen */
  #start-screen .modal-box{max-width:600px; text-align:center;}
  #start-screen .logo-big{
    width:70px; height:70px; margin:0 auto 16px; border-radius:18px;
    background:linear-gradient(135deg, var(--blue), var(--cyan));
    display:flex; align-items:center; justify-content:center; font-size:34px;
    box-shadow:var(--glow-cyan);
  }
  #start-screen h1{font-size:24px; margin-bottom:6px;}
  #start-screen p.subtitle{color:var(--text-1); font-size:13.5px; margin-bottom:18px;}
  .brief-grid{
    display:grid; grid-template-columns:1fr 1fr; gap:10px; text-align:left;
    margin-bottom:20px;
  }
  .brief-item{background:var(--bg-1); border:1px solid var(--border); border-radius:10px; padding:10px 12px;}
  .brief-item b{display:block; font-size:12px; color:var(--cyan); margin-bottom:2px;}
  .brief-item span{font-size:11.5px; color:var(--text-1);}
  #start-btn{
    width:100%; padding:14px; border-radius:12px; font-size:15px; font-weight:700;
    background:linear-gradient(135deg, var(--blue), var(--cyan)); color:#04101f;
    box-shadow:var(--glow-cyan);
    transition: transform .2s ease;
  }
  #start-btn:hover{transform:translateY(-2px);}

  /* Game Over */
  #gameover-screen .modal-box{max-width:640px;}
  .grade-circle{
    width:110px; height:110px; border-radius:50%; margin:0 auto 14px;
    display:flex; align-items:center; justify-content:center;
    font-size:44px; font-weight:800;
    background: conic-gradient(var(--cyan), var(--blue));
    box-shadow: var(--glow-cyan);
    position:relative;
  }
  .grade-circle .inner{
    width:92px; height:92px; border-radius:50%; background:var(--bg-1);
    display:flex; align-items:center; justify-content:center;
  }
  .final-score{text-align:center; font-size:15px; color:var(--text-1); margin-bottom:16px;}
  .final-score b{color:var(--text-0); font-size:26px; display:block;}
  .summary-box{
    background:var(--bg-1); border:1px solid var(--border); border-radius:10px;
    padding:14px; font-size:13px; color:var(--text-1); line-height:1.6; margin:14px 0;
  }
  .final-kpi-grid{display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin:14px 0;}
  .final-kpi{background:var(--bg-1); border:1px solid var(--border); border-radius:8px; padding:8px; text-align:center;}
  .final-kpi .v{font-weight:700; font-size:15px;}
  .final-kpi .l{font-size:9.5px; color:var(--text-2); text-transform:uppercase; margin-top:2px;}

  #restart-btn{
    width:100%; padding:14px; border-radius:12px; font-size:15px; font-weight:700;
    background:linear-gradient(135deg, var(--blue), var(--cyan)); color:#04101f;
    margin-top:6px;
  }

  .pause-overlay{
    position:fixed; inset:0; background:rgba(3,5,10,.8); backdrop-filter:blur(3px);
    display:flex; align-items:center; justify-content:center; z-index:90;
    flex-direction:column; gap:16px;
  }
  .pause-overlay.hidden{display:none;}
  .pause-overlay h2{font-size:26px; letter-spacing:2px;}
  #resume-btn{
    padding:12px 30px; border-radius:10px; font-weight:700;
    background:linear-gradient(135deg, var(--blue), var(--cyan)); color:#04101f; font-size:14px;
  }

  .toast-wrap{
    position:fixed; top:16px; right:16px; display:flex; flex-direction:column; gap:8px; z-index:200;
  }
  .toast{
    background:var(--bg-2); border:1px solid var(--border); border-left:4px solid var(--cyan);
    padding:10px 14px; border-radius:8px; font-size:12.5px; min-width:220px;
    animation: slideIn .3s ease; box-shadow:0 4px 20px rgba(0,0,0,.4);
  }
  .toast.good{border-left-color:var(--green);}
  .toast.bad{border-left-color:var(--red);}

  footer{text-align:center; color:var(--text-2); font-size:11px; margin-top:24px;}

  /* ================= RESPONSIVE ================= */
  @media (max-width:1100px){
    .kpi-grid{grid-template-columns:repeat(4,1fr);}
    .main-grid{grid-template-columns:1fr;}
  }
  @media (max-width:600px){
    .kpi-grid{grid-template-columns:repeat(2,1fr);}
    .brief-grid{grid-template-columns:1fr;}
    header.topbar{flex-direction:column; align-items:stretch;}
    .top-controls{justify-content:space-between;}
  }
</style>
</head>
<body>

<div id="app">
  <!-- ================= TOP BAR ================= -->
  <header class="topbar">
    <div class="brand">
      <div class="logo">🛰️</div>
      <div>
        <h1>AI Supply Chain Control Tower</h1>
        <p>Global Operations Command</p>
      </div>
    </div>
    <div class="top-controls">
      <div class="timer-pill" id="timer-pill">⏱ <span id="timer-display">03:00</span></div>
      <button class="icon-btn active" id="sound-toggle" title="Toggle sound (visual only)">🔊</button>
      <button class="icon-btn" id="pause-btn" title="Pause game">⏸</button>
      <button class="icon-btn" id="help-btn" title="Help / Instructions">❓</button>
    </div>
  </header>

  <!-- ================= KPI GRID ================= -->
  <section class="kpi-grid" id="kpi-grid">
    <div class="kpi-card" id="kpi-service">
      <div class="label">Service Level</div>
      <div class="value" id="val-service">92%</div>
      <div class="bar-track"><div class="bar-fill" id="bar-service" style="width:92%; background:var(--green);"></div></div>
    </div>
    <div class="kpi-card" id="kpi-csat">
      <div class="label">Customer Satisfaction</div>
      <div class="value" id="val-csat">88%</div>
      <div class="bar-track"><div class="bar-fill" id="bar-csat" style="width:88%; background:var(--green);"></div></div>
    </div>
    <div class="kpi-card" id="kpi-inventory">
      <div class="label">Inventory Health</div>
      <div class="value" id="val-inventory">85%</div>
      <div class="bar-track"><div class="bar-fill" id="bar-inventory" style="width:85%; background:var(--green);"></div></div>
    </div>
    <div class="kpi-card" id="kpi-transport">
      <div class="label">Transport Efficiency</div>
      <div class="value" id="val-transport">90%</div>
      <div class="bar-track"><div class="bar-fill" id="bar-transport" style="width:90%; background:var(--green);"></div></div>
    </div>
    <div class="kpi-card" id="kpi-cost">
      <div class="label">Operating Cost</div>
      <div class="value" id="val-cost">$1.2M</div>
      <div class="bar-track"><div class="bar-fill" id="bar-cost" style="width:40%; background:var(--cyan);"></div></div>
    </div>
    <div class="kpi-card" id="kpi-revenue">
      <div class="label">Revenue Protected</div>
      <div class="value" id="val-revenue">$0</div>
      <div class="bar-track"><div class="bar-fill" id="bar-revenue" style="width:0%; background:var(--blue);"></div></div>
    </div>
    <div class="kpi-card" id="kpi-score">
      <div class="label">Score</div>
      <div class="value" id="val-score">0</div>
      <div class="bar-track"><div class="bar-fill" id="bar-score" style="width:0%; background:var(--cyan);"></div></div>
    </div>
  </section>

  <!-- ================= MAIN GRID ================= -->
  <section class="main-grid">
    <!-- ALERTS PANEL -->
    <div class="panel">
      <h2><span class="dot"></span> Live Operational Alerts</h2>
      <div id="alerts-container">
        <div class="empty-state" id="empty-state">Monitoring global network… alerts will appear here.</div>
      </div>
    </div>

    <!-- SIDE STACK: LOG + STATS -->
    <div class="side-stack">
      <div class="panel">
        <h2><span class="dot" style="background:var(--green); box-shadow:0 0 8px var(--green);"></span> Session Stats</h2>
        <div class="mini-stats">
          <div class="mini-stat"><div class="n" id="stat-total">0</div><div class="l">Alerts Resolved</div></div>
          <div class="mini-stat"><div class="n" id="stat-active">0</div><div class="l">Active Alerts</div></div>
          <div class="mini-stat correct"><div class="n" id="stat-correct">0</div><div class="l">Correct Decisions</div></div>
          <div class="mini-stat wrong"><div class="n" id="stat-wrong">0</div><div class="l">Wrong Decisions</div></div>
        </div>
      </div>
      <div class="panel">
        <h2><span class="dot" style="background:var(--orange); box-shadow:0 0 8px var(--orange);"></span> Event Log</h2>
        <div id="log-container"></div>
      </div>
    </div>
  </section>

  <footer>AI Supply Chain Control Tower — offline simulation. No real data is used.</footer>
</div>

<!-- ================= TOAST ================= -->
<div class="toast-wrap" id="toast-wrap"></div>

<!-- ================= START SCREEN ================= -->
<div class="modal-overlay" id="start-screen">
  <div class="modal-box">
    <div class="logo-big">🛰️</div>
    <h1>Welcome, Head of Operations</h1>
    <p class="subtitle">Global disruptions are incoming. You have 3 minutes to keep the supply chain alive. Every decision moves your KPIs — choose wisely.</p>
    <div class="brief-grid">
      <div class="brief-item"><b>🎯 Objective</b><span>Maximize your final Score before time runs out.</span></div>
      <div class="brief-item"><b>⏱ Duration</b><span>3 minutes, escalating alert frequency.</span></div>
      <div class="brief-item"><b>📊 Track</b><span>7 live KPIs react instantly to your calls.</span></div>
      <div class="brief-item"><b>⚡ Difficulty</b><span>Multiple alerts can be active at once.</span></div>
    </div>
    <button id="start-btn">🚀 Start Shift</button>
  </div>
</div>

<!-- ================= HELP MODAL ================= -->
<div class="modal-overlay hidden" id="help-modal">
  <div class="modal-box">
    <h2>❓ How to Play</h2>
    <p>You are the Head of Operations for a global supply chain. Alerts will stream in — each represents a real operational disruption.</p>
    <h3>Your Job</h3>
    <ul>
      <li>Read each alert's priority and business impact.</li>
      <li>Pick an action before its countdown reaches zero.</li>
      <li>Good decisions raise KPIs and your Score; poor or ignored decisions hurt them.</li>
      <li>Some actions have delayed consequences that appear seconds later.</li>
    </ul>
    <h3>KPIs</h3>
    <ul>
      <li><b>Service Level</b> — on-time, in-full delivery performance.</li>
      <li><b>Customer Satisfaction</b> — client happiness with your operations.</li>
      <li><b>Inventory Health</b> — stock accuracy and availability.</li>
      <li><b>Transportation Efficiency</b> — fleet & logistics performance.</li>
      <li><b>Operating Cost</b> — lower is better; expensive fixes raise it.</li>
      <li><b>Revenue Protected</b> — value you've safeguarded through good calls.</li>
    </ul>
    <button class="modal-close-btn" id="help-close-btn">Got it — Back to Control Tower</button>
  </div>
</div>

<!-- ================= PAUSE OVERLAY ================= -->
<div class="pause-overlay hidden" id="pause-overlay">
  <h2>⏸ SHIFT PAUSED</h2>
  <button id="resume-btn">▶ Resume Shift</button>
</div>

<!-- ================= GAME OVER SCREEN ================= -->
<div class="modal-overlay hidden" id="gameover-screen">
  <div class="modal-box">
    <div class="grade-circle"><div class="inner"><span id="final-grade">A</span></div></div>
    <div class="final-score">Final Score<b id="final-score-value">0</b></div>
    <div class="mini-stats" style="margin-bottom:10px;">
      <div class="mini-stat"><div class="n" id="final-total">0</div><div class="l">Alerts Resolved</div></div>
      <div class="mini-stat correct"><div class="n" id="final-correct">0</div><div class="l">Correct Decisions</div></div>
      <div class="mini-stat wrong"><div class="n" id="final-wrong">0</div><div class="l">Wrong Decisions</div></div>
      <div class="mini-stat"><div class="n" id="final-ignored">0</div><div class="l">Ignored</div></div>
    </div>
    <div class="final-kpi-grid">
      <div class="final-kpi"><div class="v" id="fk-service">--</div><div class="l">Service Level</div></div>
      <div class="final-kpi"><div class="v" id="fk-csat">--</div><div class="l">CSAT</div></div>
      <div class="final-kpi"><div class="v" id="fk-inventory">--</div><div class="l">Inventory</div></div>
      <div class="final-kpi"><div class="v" id="fk-transport">--</div><div class="l">Transport</div></div>
      <div class="final-kpi"><div class="v" id="fk-cost">--</div><div class="l">Op. Cost</div></div>
      <div class="final-kpi"><div class="v" id="fk-revenue">--</div><div class="l">Revenue Protected</div></div>
    </div>
    <div class="summary-box" id="operational-summary">Summary loading…</div>
    <button id="restart-btn">🔄 Play Again</button>
  </div>
</div>

<script>
/* =====================================================================
   AI SUPPLY CHAIN CONTROL TOWER — GAME ENGINE
   All logic is contained in this single script, organized into
   clearly separated modules via functions.
===================================================================== */

/* ------------------------- GAME STATE ------------------------- */
const GAME_DURATION = 180; // 3 minutes in seconds

const state = {
  running: false,
  paused: false,
  soundOn: true,
  timeLeft: GAME_DURATION,
  score: 0,
  kpis: {
    service: 92,
    csat: 88,
    inventory: 85,
    transport: 90,
    cost: 1200000,      // dollars, lower is better
    revenue: 0           // dollars protected
  },
  stats: {
    total: 0,
    correct: 0,
    wrong: 0,
    ignored: 0
  },
  activeAlerts: [],      // currently displayed alerts
  alertIdCounter: 0,
  spawnTimerId: null,
  mainTimerId: null,
  spawnIntervalMs: 6000  // starts slow, ramps up
};

/* ------------------------- DOM REFERENCES ------------------------- */
const dom = {
  timerDisplay: document.getElementById('timer-display'),
  timerPill: document.getElementById('timer-pill'),
  alertsContainer: document.getElementById('alerts-container'),
  emptyState: document.getElementById('empty-state'),
  logContainer: document.getElementById('log-container'),
  toastWrap: document.getElementById('toast-wrap'),

  valService: document.getElementById('val-service'),
  valCsat: document.getElementById('val-csat'),
  valInventory: document.getElementById('val-inventory'),
  valTransport: document.getElementById('val-transport'),
  valCost: document.getElementById('val-cost'),
  valRevenue: document.getElementById('val-revenue'),
  valScore: document.getElementById('val-score'),

  barService: document.getElementById('bar-service'),
  barCsat: document.getElementById('bar-csat'),
  barInventory: document.getElementById('bar-inventory'),
  barTransport: document.getElementById('bar-transport'),
  barCost: document.getElementById('bar-cost'),
  barRevenue: document.getElementById('bar-revenue'),
  barScore: document.getElementById('bar-score'),

  kpiService: document.getElementById('kpi-service'),
  kpiCsat: document.getElementById('kpi-csat'),
  kpiInventory: document.getElementById('kpi-inventory'),
  kpiTransport: document.getElementById('kpi-transport'),
  kpiCost: document.getElementById('kpi-cost'),
  kpiRevenue: document.getElementById('kpi-revenue'),
  kpiScore: document.getElementById('kpi-score'),

  statTotal: document.getElementById('stat-total'),
  statActive: document.getElementById('stat-active'),
  statCorrect: document.getElementById('stat-correct'),
  statWrong: document.getElementById('stat-wrong'),

  startScreen: document.getElementById('start-screen'),
  startBtn: document.getElementById('start-btn'),
  helpModal: document.getElementById('help-modal'),
  helpBtn: document.getElementById('help-btn'),
  helpCloseBtn: document.getElementById('help-close-btn'),
  pauseBtn: document.getElementById('pause-btn'),
  pauseOverlay: document.getElementById('pause-overlay'),
  resumeBtn: document.getElementById('resume-btn'),
  soundToggle: document.getElementById('sound-toggle'),
  gameoverScreen: document.getElementById('gameover-screen'),
  restartBtn: document.getElementById('restart-btn'),

  finalGrade: document.getElementById('final-grade'),
  finalScoreValue: document.getElementById('final-score-value'),
  finalTotal: document.getElementById('final-total'),
  finalCorrect: document.getElementById('final-correct'),
  finalWrong: document.getElementById('final-wrong'),
  finalIgnored: document.getElementById('final-ignored'),
  fkService: document.getElementById('fk-service'),
  fkCsat: document.getElementById('fk-csat'),
  fkInventory: document.getElementById('fk-inventory'),
  fkTransport: document.getElementById('fk-transport'),
  fkCost: document.getElementById('fk-cost'),
  fkRevenue: document.getElementById('fk-revenue'),
  operationalSummary: document.getElementById('operational-summary')
};

/* =====================================================================
   ALERT DEFINITIONS
   Each alert type defines: icon, title, description generator,
   available actions, and how each action affects KPIs.
   Action KPI deltas are expressed as objects added directly to state.kpis.
   "correct" flags mark the best-practice action(s) for scoring stats.
===================================================================== */
const ALERT_TYPES = [
  {
    key: 'port_congestion',
    icon: '🚢',
    title: 'Port Congestion',
    desc: 'Container backlog at a major port is delaying inbound shipments.',
    impact: 'Risk to on-time delivery for multiple downstream orders.',
    actions: [
      { label: 'Approve Air Freight', correct: true, score: 25,
        effect: {service:+3, csat:+2, transport:+1, cost:+90000, revenue:+40000},
        log: 'Air freight approved — congestion bypassed at a premium cost.' },
      { label: 'Reroute to Alternate Port', correct: true, score: 20,
        effect: {service:+2, csat:+1, transport:+2, cost:+35000, revenue:+25000},
        log: 'Shipments rerouted to an alternate port.' },
      { label: 'Wait It Out', correct: false, score: -10,
        effect: {service:-6, csat:-5, revenue:-20000},
        log: 'Chose to wait — congestion worsened, deliveries slipped.' },
      { label: 'Ignore', correct: false, score: -15,
        effect: {service:-8, csat:-6, revenue:-30000},
        log: 'Port congestion ignored — significant delivery delays followed.' }
    ]
  },
  {
    key: 'supplier_delay',
    icon: '🏭',
    title: 'Supplier Delay',
    desc: 'A key raw-material supplier reports a 5-day delay on a critical order.',
    impact: 'Production line may run out of components.',
    actions: [
      { label: 'Use Backup Supplier', correct: true, score: 25,
        effect: {inventory:+4, service:+2, cost:+45000, revenue:+30000},
        log: 'Backup supplier activated — supply gap covered.' },
      { label: 'Expedite Shipment', correct: true, score: 15,
        effect: {inventory:+2, cost:+25000, revenue:+15000},
        log: 'Expedited shipping requested from the delayed supplier.' },
      { label: 'Delay Decision', correct: false, score: -8,
        effect: {inventory:-3, service:-2},
        log: 'Decision delayed — risk left unmanaged for now.', delayed: true,
        delayedEffect: {inventory:-4, service:-3, revenue:-15000},
        delayedLog: 'Delayed decision backfired — production nearly stalled.' },
      { label: 'Ignore', correct: false, score: -15,
        effect: {inventory:-6, service:-5, revenue:-25000},
        log: 'Supplier delay ignored — inventory shortfall hit production.' }
    ]
  },
  {
    key: 'truck_breakdown',
    icon: '🚛',
    title: 'Truck Breakdown',
    desc: 'A delivery truck broke down mid-route with time-sensitive cargo.',
    impact: 'Last-mile delivery delays for regional customers.',
    actions: [
      { label: 'Reroute Trucks', correct: true, score: 20,
        effect: {transport:+4, service:+2, cost:+15000, revenue:+18000},
        log: 'Nearby trucks rerouted to cover the delivery.' },
      { label: 'Approve Air Freight', correct: false, score: 5,
        effect: {transport:+1, cost:+60000, revenue:+10000},
        log: 'Air freight used for a local breakdown — costly overkill.' },
      { label: 'Delay Decision', correct: false, score: -8,
        effect: {transport:-2},
        log: 'Decision delayed on the truck breakdown.', delayed:true,
        delayedEffect: {transport:-4, csat:-3, revenue:-10000},
        delayedLog: 'Delay caused missed delivery windows for customers.' },
      { label: 'Ignore', correct: false, score: -12,
        effect: {transport:-6, csat:-4, revenue:-15000},
        log: 'Truck breakdown ignored — deliveries missed entirely.' }
    ]
  },
  {
    key: 'warehouse_stockout',
    icon: '📦',
    title: 'Warehouse Running Out of Stock',
    desc: 'Regional warehouse inventory has dropped below safety stock levels.',
    impact: 'Risk of stockouts on high-demand SKUs.',
    actions: [
      { label: 'Transfer Inventory', correct: true, score: 22,
        effect: {inventory:+4, service:+2, cost:+12000, revenue:+20000},
        log: 'Inventory transferred from a nearby warehouse.' },
      { label: 'Increase Production', correct: true, score: 18,
        effect: {inventory:+3, cost:+30000, revenue:+15000},
        log: 'Production increased to replenish stock.' },
      { label: 'Delay Decision', correct: false, score: -8,
        effect: {inventory:-3},
        log: 'Stock decision delayed.', delayed:true,
        delayedEffect: {inventory:-5, service:-4, revenue:-15000},
        delayedLog: 'Delay led to an actual stockout on key SKUs.' },
      { label: 'Ignore', correct: false, score: -15,
        effect: {inventory:-7, service:-5, csat:-4, revenue:-25000},
        log: 'Stock warning ignored — customers faced stockouts.' }
    ]
  },
  {
    key: 'customs_inspection',
    icon: '🛃',
    title: 'Customs Inspection',
    desc: 'A shipment has been flagged for random customs inspection.',
    impact: 'Border clearance delay affecting delivery timelines.',
    actions: [
      { label: 'Expedite Shipment', correct: true, score: 18,
        effect: {service:+2, transport:+1, cost:+20000, revenue:+15000},
        log: 'Expedited customs clearance requested via broker.' },
      { label: 'Reroute Trucks', correct: false, score: 3,
        effect: {transport:+1, cost:+8000},
        log: 'Rerouted onward trucks while awaiting clearance.' },
      { label: 'Delay Decision', correct: false, score: -6,
        effect: {service:-2},
        log: 'Decision delayed on the customs hold.', delayed:true,
        delayedEffect: {service:-3, revenue:-10000},
        delayedLog: 'Delay extended clearance time further.' },
      { label: 'Ignore', correct: false, score: -12,
        effect: {service:-5, csat:-3, revenue:-18000},
        log: 'Customs inspection ignored — shipment held indefinitely.' }
    ]
  },
  {
    key: 'demand_spike',
    icon: '📈',
    title: 'Demand Spike',
    desc: 'Unexpected surge in customer orders for a top-selling product.',
    impact: 'Opportunity to protect revenue, but risk of stockouts.',
    actions: [
      { label: 'Increase Production', correct: true, score: 25,
        effect: {inventory:+3, service:+2, cost:+35000, revenue:+50000},
        log: 'Production ramped up to meet surging demand.' },
      { label: 'Transfer Inventory', correct: true, score: 18,
        effect: {inventory:+2, service:+1, cost:+10000, revenue:+30000},
        log: 'Inventory transferred to meet the demand spike.' },
      { label: 'Delay Decision', correct: false, score: -8,
        effect: {revenue:-10000},
        log: 'Decision on demand spike delayed.', delayed:true,
        delayedEffect: {inventory:-3, csat:-3, revenue:-20000},
        delayedLog: 'Missed the demand window — lost sales followed.' },
      { label: 'Ignore', correct: false, score: -15,
        effect: {csat:-5, revenue:-35000},
        log: 'Demand spike ignored — significant revenue opportunity lost.' }
    ]
  },
  {
    key: 'machine_failure',
    icon: '⚙️',
    title: 'Factory Machine Failure',
    desc: 'A critical production line machine has gone offline unexpectedly.',
    impact: 'Manufacturing output at risk, could halt production.',
    actions: [
      { label: 'Increase Production', correct: false, score: 4,
        effect: {inventory:+1, cost:+20000},
        log: 'Attempted to increase output on other lines.' },
      { label: 'Use Backup Supplier', correct: true, score: 22,
        effect: {inventory:+3, service:+2, cost:+40000, revenue:+25000},
        log: 'Backup supplier sourced finished goods during downtime.' },
      { label: 'Delay Decision', correct: false, score: -8,
        effect: {inventory:-3},
        log: 'Repair decision delayed.', delayed:true,
        delayedEffect: {inventory:-5, service:-4, revenue:-20000},
        delayedLog: 'Delay extended the production halt significantly.' },
      { label: 'Ignore', correct: false, score: -16,
        effect: {inventory:-7, service:-6, revenue:-30000},
        log: 'Machine failure ignored — production line stayed down.' }
    ]
  },
  {
    key: 'weather_disruption',
    icon: '🌪️',
    title: 'Weather Disruption',
    desc: 'A severe storm is disrupting regional transportation routes.',
    impact: 'Multiple shipments at risk of delay or damage.',
    actions: [
      { label: 'Reroute Trucks', correct: true, score: 20,
        effect: {transport:+3, service:+2, cost:+15000, revenue:+20000},
        log: 'Trucks rerouted away from the storm zone.' },
      { label: 'Approve Air Freight', correct: true, score: 15,
        effect: {transport:+1, service:+2, cost:+55000, revenue:+22000},
        log: 'Priority shipments moved to air freight to avoid the storm.' },
      { label: 'Delay Decision', correct: false, score: -6,
        effect: {transport:-2},
        log: 'Decision on weather routing delayed.', delayed:true,
        delayedEffect: {transport:-4, csat:-2, revenue:-12000},
        delayedLog: 'Delay meant shipments got caught in the storm.' },
      { label: 'Ignore', correct: false, score: -14,
        effect: {transport:-6, service:-4, revenue:-22000},
        log: 'Weather disruption ignored — shipments delayed and damaged.' }
    ]
  },
  {
    key: 'wrong_inventory_count',
    icon: '🧮',
    title: 'Wrong Inventory Count',
    desc: 'A cycle count audit revealed inventory record discrepancies.',
    impact: 'Inaccurate stock data risks fulfillment errors.',
    actions: [
      { label: 'Transfer Inventory', correct: false, score: 3,
        effect: {inventory:+1, cost:+5000},
        log: 'Inventory shuffled between locations as a stopgap.' },
      { label: 'Use Backup Supplier', correct: false, score: 0,
        effect: {cost:+8000},
        log: 'Backup supplier engaged unnecessarily for a count issue.' },
      { label: 'Expedite Shipment', correct: true, score: 16,
        effect: {inventory:+3, service:+1, cost:+10000, revenue:+12000},
        log: 'Recount and reconciliation expedited by the ops team.' },
      { label: 'Ignore', correct: false, score: -12,
        effect: {inventory:-6, service:-3, revenue:-15000},
        log: 'Inventory discrepancy ignored — fulfillment errors followed.' }
    ]
  },
  {
    key: 'damaged_shipment',
    icon: '📉',
    title: 'Damaged Shipment',
    desc: 'A shipment arrived at the distribution center with visible damage.',
    impact: 'Customer order may need replacement, risking satisfaction.',
    actions: [
      { label: 'Expedite Shipment', correct: true, score: 20,
        effect: {csat:+3, service:+2, cost:+18000, revenue:+18000},
        log: 'Replacement shipment expedited to the customer.' },
      { label: 'Approve Air Freight', correct: true, score: 16,
        effect: {csat:+2, service:+1, cost:+45000, revenue:+15000},
        log: 'Air freight used to rush a replacement order.' },
      { label: 'Delay Decision', correct: false, score: -8,
        effect: {csat:-2},
        log: 'Response to damaged shipment delayed.', delayed:true,
        delayedEffect: {csat:-4, revenue:-12000},
        delayedLog: 'Delay frustrated the customer further.' },
      { label: 'Ignore', correct: false, score: -16,
        effect: {csat:-7, service:-3, revenue:-20000},
        log: 'Damaged shipment ignored — customer relationship damaged.' }
    ]
  }
];

const PRIORITIES = [
  { key:'critical', label:'Critical', weight:1, timeRange:[14,20] },
  { key:'high', label:'High', weight:2, timeRange:[18,26] },
  { key:'medium', label:'Medium', weight:2, timeRange:[24,34] }
];

/* =====================================================================
   UTILITIES
===================================================================== */
function rand(min, max){ return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr){ return arr[Math.floor(Math.random() * arr.length)]; }
function clamp(val, min, max){ return Math.max(min, Math.min(max, val)); }
function fmtMoney(n){
  const sign = n < 0 ? '-' : '';
  const abs = Math.abs(n);
  if(abs >= 1000000) return sign + '$' + (abs/1000000).toFixed(2) + 'M';
  if(abs >= 1000) return sign + '$' + (abs/1000).toFixed(0) + 'K';
  return sign + '$' + abs;
}
function fmtTime(totalSeconds){
  const m = Math.floor(totalSeconds/60).toString().padStart(2,'0');
  const s = Math.floor(totalSeconds%60).toString().padStart(2,'0');
  return m + ':' + s;
}
function weightedPriority(){
  // As the game progresses, bias toward higher priority alerts
  const elapsed = GAME_DURATION - state.timeLeft;
  const progress = elapsed / GAME_DURATION; // 0 -> 1
  const roll = Math.random();
  if(progress > 0.66){
    if(roll < 0.5) return PRIORITIES[0];
    if(roll < 0.85) return PRIORITIES[1];
    return PRIORITIES[2];
  } else if(progress > 0.33){
    if(roll < 0.3) return PRIORITIES[0];
    if(roll < 0.7) return PRIORITIES[1];
    return PRIORITIES[2];
  } else {
    if(roll < 0.15) return PRIORITIES[0];
    if(roll < 0.5) return PRIORITIES[1];
    return PRIORITIES[2];
  }
}

/* =====================================================================
   LOGGING
===================================================================== */
function addLog(message, type){
  type = type || 'info';
  const entry = document.createElement('div');
  entry.className = 'log-entry ' + type;
  const now = new Date();
  const timeStr = now.toTimeString().slice(0,8);
  entry.innerHTML = `<span class="log-time">${timeStr}</span><span>${message}</span>`;
  dom.logContainer.appendChild(entry);
  // keep log from growing unbounded
  while(dom.logContainer.children.length > 60){
    dom.logContainer.removeChild(dom.logContainer.firstChild);
  }
}

function showToast(message, type){
  const toast = document.createElement('div');
  toast.className = 'toast ' + (type || '');
  toast.textContent = message;
  dom.toastWrap.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity .4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 2600);
}

/* =====================================================================
   KPI RENDERING
===================================================================== */
function flashCard(el){
  el.classList.remove('flash');
  void el.offsetWidth; // reflow to restart animation
  el.classList.add('flash');
}

function renderKPIs(prevKpis, prevScore){
  const k = state.kpis;

  // Service Level
  dom.valService.textContent = Math.round(k.service) + '%';
  dom.barService.style.width = clamp(k.service,0,100) + '%';
  colorizeBar(dom.barService, k.service);
  colorizeCard(dom.kpiService, k.service);

  // CSAT
  dom.valCsat.textContent = Math.round(k.csat) + '%';
  dom.barCsat.style.width = clamp(k.csat,0,100) + '%';
  colorizeBar(dom.barCsat, k.csat);
  colorizeCard(dom.kpiCsat, k.csat);

  // Inventory
  dom.valInventory.textContent = Math.round(k.inventory) + '%';
  dom.barInventory.style.width = clamp(k.inventory,0,100) + '%';
  colorizeBar(dom.barInventory, k.inventory);
  colorizeCard(dom.kpiInventory, k.inventory);

  // Transport
  dom.valTransport.textContent = Math.round(k.transport) + '%';
  dom.barTransport.style.width = clamp(k.transport,0,100) + '%';
  colorizeBar(dom.barTransport, k.transport);
  colorizeCard(dom.kpiTransport, k.transport);

  // Cost (lower is better) — bar shows relative scale up to $3M
  dom.valCost.textContent = fmtMoney(k.cost);
  const costPct = clamp((k.cost / 3000000) * 100, 0, 100);
  dom.barCost.style.width = costPct + '%';
  dom.barCost.style.background = costPct > 70 ? 'var(--red)' : costPct > 45 ? 'var(--orange)' : 'var(--cyan)';

  // Revenue protected
  dom.valRevenue.textContent = fmtMoney(k.revenue);
  const revPct = clamp((k.revenue / 500000) * 100, 0, 100);
  dom.barRevenue.style.width = revPct + '%';

  // Score
  dom.valScore.textContent = Math.round(state.score);
  const scorePct = clamp((state.score / 500) * 100, 0, 100);
  dom.barScore.style.width = scorePct + '%';

  // Flash cards that changed meaningfully
  if(prevKpis){
    if(Math.abs(prevKpis.service - k.service) > 0.01) flashCard(dom.kpiService);
    if(Math.abs(prevKpis.csat - k.csat) > 0.01) flashCard(dom.kpiCsat);
    if(Math.abs(prevKpis.inventory - k.inventory) > 0.01) flashCard(dom.kpiInventory);
    if(Math.abs(prevKpis.transport - k.transport) > 0.01) flashCard(dom.kpiTransport);
    if(Math.abs(prevKpis.cost - k.cost) > 0.01) flashCard(dom.kpiCost);
    if(Math.abs(prevKpis.revenue - k.revenue) > 0.01) flashCard(dom.kpiRevenue);
  }
  if(prevScore !== undefined && prevScore !== state.score) flashCard(dom.kpiScore);
}

function colorizeBar(el, val){
  if(val >= 75) el.style.background = 'var(--green)';
  else if(val >= 50) el.style.background = 'var(--orange)';
  else el.style.background = 'var(--red)';
}
function colorizeCard(el, val){
  el.classList.remove('good','mid','bad');
  if(val >= 75) el.classList.add('good');
  else if(val >= 50) el.classList.add('mid');
  else el.classList.add('bad');
}

function renderStats(){
  dom.statTotal.textContent = state.stats.total;
  dom.statActive.textContent = state.activeAlerts.length;
  dom.statCorrect.textContent = state.stats.correct;
  dom.statWrong.textContent = state.stats.wrong;
}

/* =====================================================================
   ALERT SPAWNING
===================================================================== */
function spawnAlert(){
  if(!state.running || state.paused) return;
  if(state.activeAlerts.length >= 6) return; // cap concurrent alerts

  const type = pick(ALERT_TYPES);
  const priority = weightedPriority();
  const timeRange = priority.timeRange;
  const timeLimit = rand(timeRange[0], timeRange[1]);

  const alert = {
    id: ++state.alertIdCounter,
    typeKey: type.key,
    icon: type.icon,
    title: type.title,
    desc: type.desc,
    impact: type.impact,
    priority: priority.key,
    priorityLabel: priority.label,
    actions: type.actions,
    timeLimit: timeLimit,
    timeLeft: timeLimit,
    resolved: false,
    tickId: null
  };

  state.activeAlerts.push(alert);
  renderAlert(alert);
  renderStats();
  addLog(`New alert: <b>${alert.title}</b> (${alert.priorityLabel} priority).`, priority.key === 'critical' ? 'bad' : priority.key === 'high' ? 'warn' : 'info');

  // per-alert countdown
  alert.tickId = setInterval(() => {
    if(state.paused) return;
    alert.timeLeft--;
    updateAlertTimerUI(alert);
    if(alert.timeLeft <= 0){
      expireAlert(alert);
    }
  }, 1000);
}

function scheduleNextSpawn(){
  if(!state.running) return;
  state.spawnTimerId = setTimeout(() => {
    if(state.running && !state.paused){
      spawnAlert();
    }
    // ramp difficulty: interval shrinks as time passes, floor at 2.2s
    const elapsed = GAME_DURATION - state.timeLeft;
    const progress = elapsed / GAME_DURATION;
    state.spawnIntervalMs = clamp(6000 - progress * 4200, 2200, 6000);
    scheduleNextSpawn();
  }, state.spawnIntervalMs);
}

/* =====================================================================
   ALERT RENDERING
===================================================================== */
function renderAlert(alert){
  dom.emptyState.style.display = 'none';

  const card = document.createElement('div');
  card.className = `alert-card priority-${alert.priority}`;
  card.id = 'alert-' + alert.id;

  const badgeClass = alert.priority === 'critical' ? 'badge-critical' : alert.priority === 'high' ? 'badge-high' : 'badge-medium';

  let actionsHTML = '';
  alert.actions.forEach((action, idx) => {
    let cls = 'action-btn';
    if(action.label === 'Ignore' || action.label === 'Delay Decision') cls += ' danger';
    else if(idx === 0) cls += ' primary';
    actionsHTML += `<button class="${cls}" data-alert-id="${alert.id}" data-action-idx="${idx}">${action.label}</button>`;
  });

  card.innerHTML = `
    <div class="alert-top">
      <div class="alert-title-wrap">
        <span class="pulse-dot"></span>
        <span style="font-size:18px;">${alert.icon}</span>
        <span class="alert-title">${alert.title}</span>
      </div>
      <span class="alert-badge ${badgeClass}">${alert.priorityLabel}</span>
    </div>
    <div class="alert-desc">${alert.desc}</div>
    <div class="alert-meta">
      <span>⏳ Time left: <b class="alert-timer" id="timer-${alert.id}">${alert.timeLeft}s</b></span>
      <span>💥 Impact: <b>${alert.impact}</b></span>
    </div>
    <div class="alert-actions">${actionsHTML}</div>
    <div class="alert-progress"><div class="alert-progress-fill" id="progress-${alert.id}" style="width:100%;"></div></div>
  `;

  dom.alertsContainer.prepend(card);

  // wire up action buttons
  card.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', onActionClick);
  });
}

function updateAlertTimerUI(alert){
  const timerEl = document.getElementById('timer-' + alert.id);
  const progressEl = document.getElementById('progress-' + alert.id);
  if(timerEl){
    timerEl.textContent = alert.timeLeft + 's';
    timerEl.classList.toggle('low', alert.timeLeft <= 5);
  }
  if(progressEl){
    const pct = clamp((alert.timeLeft / alert.timeLimit) * 100, 0, 100);
    progressEl.style.width = pct + '%';
  }
}

function removeAlertFromDOM(alertId){
  const card = document.getElementById('alert-' + alertId);
  if(card){
    card.style.transition = 'opacity .3s ease, transform .3s ease';
    card.style.opacity = '0';
    card.style.transform = 'translateX(20px)';
    setTimeout(() => card.remove(), 300);
  }
  if(state.activeAlerts.length === 0){
    setTimeout(() => {
      if(state.activeAlerts.length === 0){
        dom.emptyState.style.display = 'block';
      }
    }, 320);
  }
}

/* =====================================================================
   ACTION HANDLING
===================================================================== */
function onActionClick(e){
  if(!state.running || state.paused) return;
  const btn = e.currentTarget;
  const alertId = parseInt(btn.dataset.alertId, 10);
  const actionIdx = parseInt(btn.dataset.actionIdx, 10);
  const alert = state.activeAlerts.find(a => a.id === alertId);
  if(!alert || alert.resolved) return;

  const action = alert.actions[actionIdx];
  resolveAlert(alert, action);
}

function expireAlert(alert){
  if(alert.resolved) return;
  // Treat expiry as equivalent to "Ignore" outcome using the ignore action if present
  const ignoreAction = alert.actions.find(a => a.label === 'Ignore') || {
    correct:false, score:-15, effect:{service:-6, csat:-4, revenue:-15000},
    log: `${alert.title} expired with no decision — significant negative impact.`
  };
  addLog(`⏰ Alert expired: <b>${alert.title}</b> — no action taken in time.`, 'bad');
  applyOutcome(alert, {
    ...ignoreAction,
    log: ignoreAction.log || `${alert.title} expired with no decision.`
  }, true);
}

function resolveAlert(alert, action){
  applyOutcome(alert, action, false);
}

function applyOutcome(alert, action, expired){
  alert.resolved = true;
  clearInterval(alert.tickId);

  const prevKpis = { ...state.kpis };
  const prevScore = state.score;

  // apply effect deltas
  const eff = action.effect || {};
  state.kpis.service = clamp(state.kpis.service + (eff.service || 0), 0, 100);
  state.kpis.csat = clamp(state.kpis.csat + (eff.csat || 0), 0, 100);
  state.kpis.inventory = clamp(state.kpis.inventory + (eff.inventory || 0), 0, 100);
  state.kpis.transport = clamp(state.kpis.transport + (eff.transport || 0), 0, 100);
  state.kpis.cost = Math.max(0, state.kpis.cost + (eff.cost || 0));
  state.kpis.revenue = Math.max(0, state.kpis.revenue + (eff.revenue || 0));
  state.score = Math.max(0, state.score + (action.score || 0));

  // stats bookkeeping
  state.stats.total++;
  if(expired){
    state.stats.ignored++;
    state.stats.wrong++;
  } else if(action.label === 'Ignore'){
    state.stats.ignored++;
    state.stats.wrong++;
  } else if(action.correct){
    state.stats.correct++;
  } else {
    state.stats.wrong++;
  }

  // remove from active list
  state.activeAlerts = state.activeAlerts.filter(a => a.id !== alert.id);
  removeAlertFromDOM(alert.id);

  // log + toast
  const logType = action.correct ? 'good' : (action.label === 'Ignore' ? 'bad' : 'warn');
  addLog(`${action.correct ? '✅' : '⚠️'} ${action.log}`, logType);
  showToast(action.log, action.correct ? 'good' : 'bad');

  renderKPIs(prevKpis, prevScore);
  renderStats();

  // handle delayed consequences
  if(action.delayed && action.delayedEffect){
    setTimeout(() => {
      if(!state.running) return;
      const prevK2 = { ...state.kpis };
      const prevS2 = state.score;
      const de = action.delayedEffect;
      state.kpis.service = clamp(state.kpis.service + (de.service || 0), 0, 100);
      state.kpis.csat = clamp(state.kpis.csat + (de.csat || 0), 0, 100);
      state.kpis.inventory = clamp(state.kpis.inventory + (de.inventory || 0), 0, 100);
      state.kpis.transport = clamp(state.kpis.transport + (de.transport || 0), 0, 100);
      state.kpis.cost = Math.max(0, state.kpis.cost + (de.cost || 0));
      state.kpis.revenue = Math.max(0, state.kpis.revenue + (de.revenue || 0));
      addLog(`⏱ Delayed consequence: ${action.delayedLog}`, 'bad');
      showToast(action.delayedLog, 'bad');
      renderKPIs(prevK2, prevS2);
    }, 4000 + Math.random() * 2000);
  }

  // check for game-ending KPI collapse (optional soft warning only, game still runs on timer)
}

/* =====================================================================
   MAIN TIMER
===================================================================== */
function startMainTimer(){
  state.mainTimerId = setInterval(() => {
    if(!state.running || state.paused) return;
    state.timeLeft--;
    dom.timerDisplay.textContent = fmtTime(state.timeLeft);

    dom.timerPill.classList.remove('warn','critical');
    if(state.timeLeft <= 15) dom.timerPill.classList.add('critical');
    else if(state.timeLeft <= 45) dom.timerPill.classList.add('warn');

    if(state.timeLeft <= 0){
      endGame();
    }
  }, 1000);
}

/* =====================================================================
   GAME LIFECYCLE
===================================================================== */
function resetState(){
  state.running = false;
  state.paused = false;
  state.timeLeft = GAME_DURATION;
  state.score = 0;
  state.kpis = { service:92, csat:88, inventory:85, transport:90, cost:1200000, revenue:0 };
  state.stats = { total:0, correct:0, wrong:0, ignored:0 };
  state.alertIdCounter = 0;
  state.spawnIntervalMs = 6000;

  // clear active alerts
  state.activeAlerts.forEach(a => clearInterval(a.tickId));
  state.activeAlerts = [];
  clearInterval(state.mainTimerId);
  clearTimeout(state.spawnTimerId);

  dom.alertsContainer.innerHTML = '';
  dom.alertsContainer.appendChild(dom.emptyState);
  dom.emptyState.style.display = 'block';
  dom.logContainer.innerHTML = '';
  dom.timerPill.classList.remove('warn','critical');
  dom.timerDisplay.textContent = fmtTime(GAME_DURATION);

  renderKPIs();
  renderStats();
}

function startGame(){
  resetState();
  state.running = true;
  dom.startScreen.classList.add('hidden');
  dom.gameoverScreen.classList.add('hidden');
  addLog('🟢 Shift started. Good luck, Head of Operations.', 'info');
  startMainTimer();
  scheduleNextSpawn();
  // first alert appears quickly to kick things off
  setTimeout(() => { if(state.running && !state.paused) spawnAlert(); }, 1500);
}

function endGame(){
  state.running = false;
  clearInterval(state.mainTimerId);
  clearTimeout(state.spawnTimerId);
  state.activeAlerts.forEach(a => clearInterval(a.tickId));

  showGameOverScreen();
}

function computeGrade(){
  const s = state.score;
  if(s >= 400) return 'A+';
  if(s >= 300) return 'A';
  if(s >= 200) return 'B';
  if(s >= 100) return 'C';
  return 'D';
}

function buildOperationalSummary(grade){
  const k = state.kpis;
  const avgHealth = (k.service + k.csat + k.inventory + k.transport) / 4;
  let summary = '';

  if(grade === 'A+' || grade === 'A'){
    summary = `Outstanding shift. You kept the network resilient under pressure, resolving ${state.stats.correct} disruptions with sound judgment and protecting ${fmtMoney(k.revenue)} in revenue. Your operating cost discipline and fast decision-making minimized cascading failures across the network.`;
  } else if(grade === 'B'){
    summary = `Solid performance under a demanding shift. Most disruptions were handled well, though a few decisions — particularly delayed or ignored alerts — allowed avoidable KPI erosion. Average operational health landed around ${Math.round(avgHealth)}%.`;
  } else if(grade === 'C'){
    summary = `A challenging shift with mixed results. Reactive decision-making and several ignored alerts pushed operating costs up while service metrics slipped. Faster triage on critical alerts would meaningfully improve outcomes.`;
  } else {
    summary = `A difficult shift overall. Frequent ignored or delayed decisions let disruptions compound, dragging down service level, satisfaction, and revenue protection. Prioritizing critical alerts first is the key lever for improvement next time.`;
  }
  return summary;
}

function showGameOverScreen(){
  const grade = computeGrade();
  dom.finalGrade.textContent = grade;
  dom.finalScoreValue.textContent = Math.round(state.score);
  dom.finalTotal.textContent = state.stats.total;
  dom.finalCorrect.textContent = state.stats.correct;
  dom.finalWrong.textContent = state.stats.wrong;
  dom.finalIgnored.textContent = state.stats.ignored;

  dom.fkService.textContent = Math.round(state.kpis.service) + '%';
  dom.fkCsat.textContent = Math.round(state.kpis.csat) + '%';
  dom.fkInventory.textContent = Math.round(state.kpis.inventory) + '%';
  dom.fkTransport.textContent = Math.round(state.kpis.transport) + '%';
  dom.fkCost.textContent = fmtMoney(state.kpis.cost);
  dom.fkRevenue.textContent = fmtMoney(state.kpis.revenue);

  dom.operationalSummary.textContent = buildOperationalSummary(grade);

  dom.gameoverScreen.classList.remove('hidden');
}

/* =====================================================================
   PAUSE / HELP / SOUND CONTROLS
===================================================================== */
function togglePause(){
  if(!state.running) return;
  state.paused = !state.paused;
  dom.pauseOverlay.classList.toggle('hidden', !state.paused);
  dom.pauseBtn.textContent = state.paused ? '▶' : '⏸';
  addLog(state.paused ? '⏸ Shift paused.' : '▶ Shift resumed.', 'info');
}

function toggleSound(){
  state.soundOn = !state.soundOn;
  dom.soundToggle.textContent = state.soundOn ? '🔊' : '🔇';
  dom.soundToggle.classList.toggle('active', state.soundOn);
}

/* =====================================================================
   EVENT LISTENERS
===================================================================== */
dom.startBtn.addEventListener('click', startGame);
dom.restartBtn.addEventListener('click', startGame);

dom.helpBtn.addEventListener('click', () => dom.helpModal.classList.remove('hidden'));
dom.helpCloseBtn.addEventListener('click', () => dom.helpModal.classList.add('hidden'));
dom.helpModal.addEventListener('click', (e) => { if(e.target === dom.helpModal) dom.helpModal.classList.add('hidden'); });

dom.pauseBtn.addEventListener('click', togglePause);
dom.resumeBtn.addEventListener('click', togglePause);

dom.soundToggle.addEventListener('click', toggleSound);

/* =====================================================================
   INITIAL RENDER (before game starts)
===================================================================== */
renderKPIs();
renderStats();
dom.timerDisplay.textContent = fmtTime(GAME_DURATION);
</script>
</body>
</html>
