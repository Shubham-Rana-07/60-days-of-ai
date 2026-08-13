

Shark tank simulator · HTML
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>The Tank — AI Pitch Simulator</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/canvas-confetti/1.9.2/confetti.browser.min.js"></script>
<style>
:root{
  --abyss-900:#050d14;
  --abyss-800:#0a1620;
  --abyss-700:#0f202e;
  --abyss-600:#16303f;
  --glass-line:rgba(140,200,220,0.14);
  --bio-teal:#3fe0c5;
  --bio-teal-dim:#1f7a6c;
  --danger-red:#ff5a5f;
  --gold:#f0b93d;
  --ink:#eaf4f4;
  --ink-dim:#9db3bb;
  --ink-faint:#5d7680;
  --font-display:'Bebas Neue', sans-serif;
  --font-serif:'Fraunces', serif;
  --font-body:'Space Grotesk', sans-serif;
  --font-mono:'JetBrains Mono', monospace;
}
*{box-sizing:border-box; margin:0; padding:0;}
html{scroll-behavior:smooth;}
body{
  background:
    radial-gradient(ellipse 900px 500px at 15% -10%, rgba(63,224,197,0.08), transparent 60%),
    radial-gradient(ellipse 700px 500px at 90% 10%, rgba(240,185,61,0.05), transparent 55%),
    var(--abyss-900);
  color:var(--ink);
  font-family:var(--font-body);
  min-height:100vh;
  overflow-x:hidden;
  position:relative;
}
/* ambient caustics */
.caustics{
  position:fixed; inset:0; pointer-events:none; z-index:0; opacity:0.35;
  background-image:
    repeating-linear-gradient(115deg, transparent 0 40px, rgba(63,224,197,0.025) 40px 42px, transparent 42px 90px),
    repeating-linear-gradient(65deg, transparent 0 60px, rgba(63,224,197,0.02) 60px 62px, transparent 62px 130px);
  animation: drift 22s linear infinite;
}
@keyframes drift{
  0%{ background-position: 0 0, 0 0; }
  100%{ background-position: 400px 200px, -300px 260px; }
}
.wrap{ position:relative; z-index:1; max-width:1120px; margin:0 auto; padding:0 24px 120px; }
@media (prefers-reduced-motion: reduce){
  *{ animation-duration:0.001ms !important; animation-iteration-count:1 !important; transition-duration:0.001ms !important; }
}
 
/* ===== HEADER / DEPTH GAUGE ===== */
header.hero{
  padding:56px 24px 40px; text-align:center; position:relative; z-index:1;
}
.depth-tag{
  font-family:var(--font-mono); font-size:11px; letter-spacing:0.25em; color:var(--bio-teal);
  text-transform:uppercase; display:inline-flex; align-items:center; gap:10px; margin-bottom:18px;
}
.depth-tag::before, .depth-tag::after{ content:""; width:28px; height:1px; background:var(--bio-teal-dim); }
h1.title{
  font-family:var(--font-display); font-size:clamp(56px, 11vw, 108px); line-height:0.85; letter-spacing:0.01em;
  color:var(--ink);
  text-shadow: 0 0 40px rgba(63,224,197,0.25);
}
h1.title span{ color:var(--bio-teal); }
p.tagline{
  font-family:var(--font-serif); font-style:italic; font-weight:400; font-size:19px; color:var(--ink-dim);
  max-width:520px; margin:16px auto 0;
}
.progress-rail{
  display:flex; justify-content:center; gap:0; margin-top:38px; flex-wrap:wrap;
}
.progress-step{
  font-family:var(--font-mono); font-size:11px; letter-spacing:0.08em; color:var(--ink-faint);
  padding:8px 18px; border-bottom:2px solid var(--glass-line); text-transform:uppercase;
  transition:all .35s ease;
}
.progress-step.active{ color:var(--bio-teal); border-color:var(--bio-teal); text-shadow:0 0 12px rgba(63,224,197,.5); }
.progress-step.done{ color:var(--gold); border-color:var(--gold); }
 
section{ display:none; animation: surface 0.6s cubic-bezier(.2,.8,.3,1); }
section.active{ display:block; }
@keyframes surface{
  from{ opacity:0; transform:translateY(18px) scale(0.99); filter:blur(4px); }
  to{ opacity:1; transform:translateY(0) scale(1); filter:blur(0); }
}
 
/* ===== GLASS PANEL ===== */
.panel{
  background:linear-gradient(180deg, rgba(20,42,54,0.55), rgba(10,22,32,0.7));
  border:1px solid var(--glass-line);
  border-radius:6px;
  backdrop-filter: blur(6px);
  position:relative;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.03), 0 30px 60px -30px rgba(0,0,0,0.6);
}
.panel::before{
  content:""; position:absolute; top:0; left:0; right:0; height:1px;
  background:linear-gradient(90deg, transparent, var(--bio-teal), transparent); opacity:0.5;
}
 
/* ===== FORM ===== */
.form-panel{ padding:44px; margin-top:10px; }
.form-grid{ display:grid; grid-template-columns:1fr 1fr; gap:26px 28px; }
.field{ display:flex; flex-direction:column; gap:8px; }
.field.full{ grid-column:1 / -1; }
.field label{
  font-family:var(--font-mono); font-size:11px; letter-spacing:0.12em; text-transform:uppercase; color:var(--bio-teal);
  display:flex; align-items:center; gap:8px;
}
.field .hint{ color:var(--ink-faint); font-weight:400; text-transform:none; letter-spacing:0; font-size:11px; }
input, textarea{
  background:rgba(5,13,20,0.6); border:1px solid var(--glass-line); border-radius:3px; color:var(--ink);
  font-family:var(--font-body); font-size:15px; padding:13px 14px; outline:none; resize:vertical;
  transition:border-color .25s ease, box-shadow .25s ease;
}
input::placeholder, textarea::placeholder{ color:var(--ink-faint); }
input:focus, textarea:focus{ border-color:var(--bio-teal); box-shadow:0 0 0 3px rgba(63,224,197,0.12); }
textarea{ min-height:88px; line-height:1.5; }
 
.btn{
  font-family:var(--font-mono); font-size:13px; letter-spacing:0.1em; text-transform:uppercase;
  border:1px solid var(--bio-teal); background:transparent; color:var(--bio-teal);
  padding:15px 30px; border-radius:3px; cursor:pointer; transition:all .25s ease; position:relative; overflow:hidden;
}
.btn:hover{ background:rgba(63,224,197,0.1); box-shadow:0 0 24px rgba(63,224,197,0.25); }
.btn:active{ transform:scale(0.98); }
.btn.primary{ background:var(--bio-teal); color:var(--abyss-900); font-weight:700; }
.btn.primary:hover{ background:#5df0d8; }
.btn.ghost{ border-color:var(--glass-line); color:var(--ink-dim); }
.btn.ghost:hover{ border-color:var(--ink-dim); background:rgba(255,255,255,0.03); box-shadow:none; }
.btn.gold{ border-color:var(--gold); color:var(--gold); }
.btn.gold:hover{ background:rgba(240,185,61,0.12); box-shadow:0 0 24px rgba(240,185,61,0.25); }
.btn:disabled{ opacity:0.35; cursor:not-allowed; }
.btn:focus-visible, input:focus-visible, textarea:focus-visible{ outline:2px solid var(--bio-teal); outline-offset:2px; }
 
.form-footer{ display:flex; justify-content:space-between; align-items:center; margin-top:36px; }
.err{ color:var(--danger-red); font-family:var(--font-mono); font-size:12px; min-height:16px; }
 
/* ===== PITCH DISPLAY ===== */
.pitch-stage{ text-align:center; padding:40px 20px 10px; }
.eyebrow{ font-family:var(--font-mono); font-size:11px; letter-spacing:0.2em; color:var(--ink-faint); text-transform:uppercase; }
.pitch-name{ font-family:var(--font-display); font-size:clamp(40px,7vw,64px); color:var(--bio-teal); margin:6px 0 18px; letter-spacing:0.02em;}
.pitch-summary{ max-width:760px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr; gap:16px; text-align:left; }
.summary-card{ padding:18px 20px; }
.summary-card .k{ font-family:var(--font-mono); font-size:10px; letter-spacing:0.14em; color:var(--gold); text-transform:uppercase; margin-bottom:6px; }
.summary-card .v{ font-family:var(--font-serif); font-size:16px; line-height:1.5; color:var(--ink); }
 
/* ===== JUDGES GRID ===== */
.judges-grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:18px; margin-top:44px; }
@media (max-width:880px){ .judges-grid{ grid-template-columns:1fr 1fr; } .form-grid{ grid-template-columns:1fr; } }
@media (max-width:520px){ .judges-grid{ grid-template-columns:1fr; } }
 
.judge-card{
  padding:24px 20px; text-align:center; position:relative; overflow:hidden;
  transition:transform .3s ease, box-shadow .3s ease;
  animation: rise 0.6s cubic-bezier(.2,.8,.3,1) backwards;
}
.judge-card:nth-child(1){ animation-delay:.05s; } .judge-card:nth-child(2){ animation-delay:.15s; }
.judge-card:nth-child(3){ animation-delay:.25s; } .judge-card:nth-child(4){ animation-delay:.35s; }
@keyframes rise{ from{ opacity:0; transform:translateY(24px);} to{opacity:1; transform:translateY(0);} }
.judge-card .fin{ font-size:38px; filter:drop-shadow(0 0 12px rgba(63,224,197,.4)); }
.judge-card h3{ font-family:var(--font-display); font-size:24px; letter-spacing:0.02em; margin-top:8px; color:var(--ink); }
.judge-card .role{ font-family:var(--font-mono); font-size:10px; letter-spacing:0.12em; color:var(--bio-teal); text-transform:uppercase; margin-top:4px; }
.judge-card .focus{ font-family:var(--font-serif); font-style:italic; font-size:13px; color:var(--ink-dim); margin-top:10px; line-height:1.4; }
.judge-card.speaking{ box-shadow:0 0 0 1px var(--bio-teal), 0 0 30px rgba(63,224,197,0.3); transform:translateY(-3px); }
 
/* Q&A thread */
.qa-thread{ margin-top:46px; display:flex; flex-direction:column; gap:22px; }
.qa-block{ padding:26px 28px; position:relative; animation: rise 0.5s ease backwards; }
.qa-judge-tag{ display:flex; align-items:center; gap:10px; margin-bottom:14px; }
.qa-judge-tag .fin{ font-size:20px; }
.qa-judge-tag .name{ font-family:var(--font-display); font-size:19px; letter-spacing:0.02em; color:var(--bio-teal); }
.qa-judge-tag .num{ font-family:var(--font-mono); font-size:10px; color:var(--ink-faint); letter-spacing:0.1em; margin-left:auto; }
.qa-question{ font-family:var(--font-serif); font-size:17px; line-height:1.6; color:var(--ink); margin-bottom:16px; }
.qa-question::before{ content:"“"; color:var(--bio-teal); font-size:24px; margin-right:2px; }
textarea.answer{ width:100%; margin-bottom:12px; }
.qa-reaction{
  margin-top:14px; padding:14px 16px; border-left:2px solid var(--gold); background:rgba(240,185,61,0.06);
  font-family:var(--font-body); font-size:14px; line-height:1.55; color:var(--ink-dim); border-radius:0 3px 3px 0;
  display:none;
}
.qa-reaction.show{ display:block; animation:fadein .4s ease; }
@keyframes fadein{ from{opacity:0; transform:translateY(6px);} to{opacity:1; transform:translateY(0);} }
.qa-reaction .tag{ font-family:var(--font-mono); font-size:10px; letter-spacing:0.1em; color:var(--gold); text-transform:uppercase; display:block; margin-bottom:6px; }
.qa-submit{ display:flex; justify-content:flex-end; }
 
.round-actions{ margin-top:40px; display:flex; justify-content:center; gap:16px; }
 
/* ===== SCORING ===== */
.score-header{ text-align:center; padding:30px 0 10px; }
.score-grid{ display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-top:38px; }
@media (max-width:700px){ .score-grid{ grid-template-columns:1fr; } }
.score-row{ padding:22px 24px; }
.score-row .top{ display:flex; justify-content:space-between; align-items:baseline; margin-bottom:10px; }
.score-row .label{ font-family:var(--font-mono); font-size:12px; letter-spacing:0.1em; text-transform:uppercase; color:var(--ink-dim); }
.score-row .num{ font-family:var(--font-display); font-size:30px; color:var(--bio-teal); }
.meter{ height:8px; border-radius:4px; background:rgba(255,255,255,0.06); overflow:hidden; }
.meter-fill{ height:100%; border-radius:4px; background:linear-gradient(90deg, var(--bio-teal-dim), var(--bio-teal)); width:0%; transition:width 1.1s cubic-bezier(.2,.8,.2,1); box-shadow:0 0 12px rgba(63,224,197,0.5); }
 
.overall-block{ grid-column:1/-1; text-align:center; padding:40px 24px; }
.overall-block .label{ font-family:var(--font-mono); font-size:12px; letter-spacing:0.16em; color:var(--ink-dim); text-transform:uppercase; }
.overall-num{ font-family:var(--font-display); font-size:96px; line-height:1; color:var(--gold); text-shadow:0 0 40px rgba(240,185,61,0.35); }
.overall-num span{ font-size:36px; color:var(--ink-faint); }
 
/* ===== DECISION ===== */
.decision-stage{ text-align:center; padding:36px 20px 10px; }
.verdict-card{ margin-top:28px; padding:50px 40px; text-align:center; position:relative; overflow:hidden; }
.verdict-card.invest{ border-color:var(--bio-teal); box-shadow:0 0 60px rgba(63,224,197,0.15); }
.verdict-card.acquire{ border-color:var(--gold); box-shadow:0 0 60px rgba(240,185,61,0.15); }
.verdict-card.comeback{ border-color:#8a8fd6; box-shadow:0 0 60px rgba(138,143,214,0.15); }
.verdict-card.reject{ border-color:var(--danger-red); box-shadow:0 0 60px rgba(255,90,95,0.15); }
.verdict-label{ font-family:var(--font-display); font-size:clamp(44px,8vw,76px); letter-spacing:0.02em; }
.verdict-card.invest .verdict-label{ color:var(--bio-teal); }
.verdict-card.acquire .verdict-label{ color:var(--gold); }
.verdict-card.comeback .verdict-label{ color:#8a8fd6; }
.verdict-card.reject .verdict-label{ color:var(--danger-red); }
.verdict-sub{ font-family:var(--font-serif); font-style:italic; color:var(--ink-dim); font-size:16px; margin-top:10px; }
 
.deal-terms{ display:flex; justify-content:center; gap:60px; margin-top:34px; flex-wrap:wrap; }
.deal-term .k{ font-family:var(--font-mono); font-size:11px; letter-spacing:0.12em; color:var(--ink-faint); text-transform:uppercase; }
.deal-term .v{ font-family:var(--font-display); font-size:34px; color:var(--ink); margin-top:4px; }
 
.reasoning-panel{ margin-top:30px; padding:28px 32px; text-align:left; }
.reasoning-panel h4{ font-family:var(--font-mono); font-size:11px; letter-spacing:0.14em; color:var(--bio-teal); text-transform:uppercase; margin-bottom:12px; }
.reasoning-panel p{ font-family:var(--font-serif); font-size:16px; line-height:1.7; color:var(--ink-dim); }
.judge-verdicts{ margin-top:26px; display:grid; grid-template-columns:repeat(4,1fr); gap:14px; text-align:left; }
@media (max-width:880px){ .judge-verdicts{ grid-template-columns:1fr 1fr; } }
@media (max-width:520px){ .judge-verdicts{ grid-template-columns:1fr; } }
.jv-card{ padding:16px 18px; }
.jv-card .h{ display:flex; align-items:center; gap:8px; margin-bottom:8px; }
.jv-card .h .name{ font-family:var(--font-display); font-size:16px; color:var(--bio-teal); }
.jv-card p{ font-family:var(--font-body); font-size:12.5px; line-height:1.5; color:var(--ink-dim); }
 
.action-row{ margin-top:40px; display:flex; justify-content:center; gap:14px; flex-wrap:wrap; }
 
/* ===== LEADERBOARD ===== */
.leaderboard-panel{ margin-top:20px; padding:10px 0; }
table{ width:100%; border-collapse:collapse; }
th{ font-family:var(--font-mono); font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:var(--ink-faint); text-align:left; padding:14px 20px; border-bottom:1px solid var(--glass-line); }
td{ padding:16px 20px; font-family:var(--font-body); font-size:14px; border-bottom:1px solid rgba(255,255,255,0.04); }
tr:hover td{ background:rgba(63,224,197,0.03); }
td.rank{ font-family:var(--font-display); font-size:20px; color:var(--gold); width:60px; }
td.deal{ font-family:var(--font-mono); font-size:11px; text-transform:uppercase; letter-spacing:0.06em; }
.deal-badge{ padding:3px 9px; border-radius:20px; border:1px solid; }
.deal-badge.invest{ color:var(--bio-teal); border-color:var(--bio-teal-dim); }
.deal-badge.acquire{ color:var(--gold); border-color:#7d6321; }
.deal-badge.comeback{ color:#8a8fd6; border-color:#3d3f77; }
.deal-badge.reject{ color:var(--danger-red); border-color:#7a2c2e; }
.empty-state{ text-align:center; padding:60px 20px; color:var(--ink-faint); font-family:var(--font-serif); font-style:italic; }
 
/* ===== NAV FOOTER LINK ===== */
.top-nav{ display:flex; justify-content:center; gap:26px; margin:36px 0 4px; }
.top-nav a{ font-family:var(--font-mono); font-size:11px; letter-spacing:0.1em; text-transform:uppercase; color:var(--ink-faint); text-decoration:none; cursor:pointer; transition:color .2s; }
.top-nav a:hover, .top-nav a.on{ color:var(--bio-teal); }
 
.toast{
  position:fixed; bottom:26px; left:50%; transform:translateX(-50%) translateY(20px); opacity:0;
  background:var(--abyss-700); border:1px solid var(--bio-teal); color:var(--ink); padding:13px 22px; border-radius:4px;
  font-family:var(--font-mono); font-size:12px; letter-spacing:0.05em; z-index:100; transition:all .35s ease; pointer-events:none;
}
.toast.show{ opacity:1; transform:translateX(-50%) translateY(0); }
 
.bubbles{ position:absolute; inset:0; overflow:hidden; pointer-events:none; z-index:0; }
.bubble{ position:absolute; bottom:-20px; border-radius:50%; background:rgba(63,224,197,0.08); border:1px solid rgba(63,224,197,0.15); animation:rise-bubble linear infinite; }
@keyframes rise-bubble{ from{ transform:translateY(0) translateX(0); opacity:0; } 10%{opacity:1;} to{ transform:translateY(-620px) translateX(20px); opacity:0; } }
 
footer.credit{ text-align:center; margin-top:60px; font-family:var(--font-mono); font-size:11px; color:var(--ink-faint); letter-spacing:0.08em; }
</style>
</head>
<body>
<div class="caustics"></div>
<div class="wrap">
 
  <header class="hero">
    <div class="depth-tag">EPISODE 01 · LIVE PITCH</div>
    <h1 class="title">THE <span>TANK</span></h1>
    <p class="tagline">Four AI sharks. One idea. Answer sharp, or get eaten.</p>
    <nav class="progress-rail" id="progressRail">
      <span class="progress-step" data-step="form">01 · Pitch Intake</span>
      <span class="progress-step" data-step="pitch">02 · The Pitch</span>
      <span class="progress-step" data-step="qa">03 · Cross-Exam</span>
      <span class="progress-step" data-step="score">04 · Scorecard</span>
      <span class="progress-step" data-step="decision">05 · Verdict</span>
      <span class="progress-step" data-step="leaderboard">Leaderboard</span>
    </nav>
  </header>
 
  <!-- ================= STEP 1: FORM ================= -->
  <section id="step-form" class="active">
    <div class="panel form-panel">
      <div class="field full" style="margin-bottom:8px;">
        <label>Step 01 <span class="hint">— tell us what you're building</span></label>
      </div>
      <div class="form-grid">
        <div class="field full">
          <label for="f-name">Startup Name</label>
          <input id="f-name" type="text" placeholder="e.g. FinFlow" maxlength="60">
        </div>
        <div class="field full">
          <label for="f-problem">Problem Statement <span class="hint">— what pain are you solving?</span></label>
          <textarea id="f-problem" placeholder="Small businesses lose 6+ hours a week reconciling invoices by hand..."></textarea>
        </div>
        <div class="field full">
          <label for="f-solution">Solution <span class="hint">— how do you solve it?</span></label>
          <textarea id="f-solution" placeholder="An AI agent that reads invoices, matches them to bank statements, and flags mismatches automatically..."></textarea>
        </div>
        <div class="field">
          <label for="f-revenue">Revenue Model</label>
          <textarea id="f-revenue" placeholder="$49/mo SaaS subscription, tiered by transaction volume"></textarea>
        </div>
        <div class="field">
          <label for="f-audience">Target Audience</label>
          <textarea id="f-audience" placeholder="Solo accountants and small bookkeeping firms in the US"></textarea>
        </div>
        <div class="field full">
          <label for="f-ask">Funding Ask <span class="hint">— amount and equity offered</span></label>
          <input id="f-ask" type="text" placeholder="e.g. $150,000 for 10% equity" maxlength="80">
        </div>
      </div>
      <div class="form-footer">
        <span class="err" id="formErr"></span>
        <button class="btn primary" id="btnStartPitch">Walk Into The Tank →</button>
      </div>
    </div>
  </section>
 
  <!-- ================= STEP 2: PITCH DISPLAY ================= -->
  <section id="step-pitch">
    <div class="pitch-stage">
      <div class="eyebrow">Now Pitching</div>
      <div class="pitch-name" id="p-name">—</div>
      <div class="pitch-summary">
        <div class="panel summary-card"><div class="k">Problem</div><div class="v" id="p-problem"></div></div>
        <div class="panel summary-card"><div class="k">Solution</div><div class="v" id="p-solution"></div></div>
        <div class="panel summary-card"><div class="k">Revenue Model</div><div class="v" id="p-revenue"></div></div>
        <div class="panel summary-card"><div class="k">Target Audience</div><div class="v" id="p-audience"></div></div>
        <div class="panel summary-card" style="grid-column:1/-1;"><div class="k">The Ask</div><div class="v" id="p-ask"></div></div>
      </div>
 
      <div class="judges-grid" id="judgesGrid"></div>
 
      <div class="round-actions">
        <button class="btn primary" id="btnBeginQA">Begin Cross-Examination →</button>
      </div>
    </div>
  </section>
 
  <!-- ================= STEP 3: Q&A ================= -->
  <section id="step-qa">
    <div class="eyebrow" style="text-align:center;">Cross-Examination · 8 Questions</div>
    <h2 style="font-family:var(--font-display); text-align:center; font-size:40px; letter-spacing:0.02em; color:var(--ink); margin-top:6px;">DEFEND YOUR PITCH</h2>
    <div class="qa-thread" id="qaThread"></div>
    <div class="round-actions">
      <button class="btn primary" id="btnFinishQA" disabled>Submit For Judgment →</button>
    </div>
  </section>
 
  <!-- ================= STEP 4: SCORING ================= -->
  <section id="step-score">
    <div class="score-header">
      <div class="eyebrow">Scorecard</div>
      <h2 style="font-family:var(--font-display); font-size:44px; letter-spacing:0.02em;">THE TANK RATES YOU</h2>
    </div>
    <div class="score-grid" id="scoreGrid"></div>
    <div class="round-actions">
      <button class="btn gold" id="btnSeeVerdict">Reveal The Verdict →</button>
    </div>
  </section>
 
  <!-- ================= STEP 5: DECISION ================= -->
  <section id="step-decision">
    <div class="decision-stage">
      <div class="eyebrow">Final Verdict</div>
      <div class="panel verdict-card" id="verdictCard">
        <div class="verdict-label" id="verdictLabel">—</div>
        <div class="verdict-sub" id="verdictSub"></div>
        <div class="deal-terms" id="dealTerms"></div>
      </div>
 
      <div class="panel reasoning-panel">
        <h4>Why The Tank Decided This</h4>
        <p id="reasoningText"></p>
      </div>
 
      <div class="judge-verdicts" id="judgeVerdicts"></div>
 
      <div class="action-row">
        <button class="btn primary" id="btnDownloadPdf">⬇ Download Pitch Report</button>
        <button class="btn gold" id="btnShare">⤴ Share Result</button>
        <button class="btn" id="btnSaveLeaderboard">🏆 Save To Leaderboard</button>
        <button class="btn ghost" id="btnRestart">↺ Pitch Again</button>
      </div>
    </div>
  </section>
 
  <!-- ================= LEADERBOARD ================= -->
  <section id="step-leaderboard">
    <div class="eyebrow" style="text-align:center;">Hall Of The Tank</div>
    <h2 style="font-family:var(--font-display); text-align:center; font-size:44px; letter-spacing:0.02em; margin-bottom:20px;">LEADERBOARD</h2>
    <div class="panel leaderboard-panel">
      <table id="leaderboardTable">
        <thead>
          <tr><th>Rank</th><th>Startup</th><th>Overall</th><th>Deal</th><th>Valuation</th><th>Date</th></tr>
        </thead>
        <tbody id="leaderboardBody"></tbody>
      </table>
      <div class="empty-state" id="leaderboardEmpty">No pitches saved yet. Walk into the tank and earn your spot.</div>
    </div>
    <div class="round-actions">
      <button class="btn ghost" id="btnClearBoard">Clear Leaderboard</button>
    </div>
  </section>
 
  <nav class="top-nav" id="quickNav" style="display:none;">
    <a data-goto="form">New Pitch</a>
    <a data-goto="leaderboard">Leaderboard</a>
  </nav>
 
  <footer class="credit">THE TANK — a fully client-side AI pitch simulator · no data leaves your browser</footer>
</div>
 
<div class="toast" id="toast"></div>
 
<script>
(function(){
"use strict";
 
/* ---------------------------------------------------------------
   DATA MODEL
--------------------------------------------------------------- */
const JUDGES = [
  { id:'vc', fin:'🦈', name:'The V.C.', role:'Venture Capitalist', focus:'Obsessed with market size and scalability. Wants to know if this becomes a category leader.',
    questions:[
      "What's your total addressable market, and how fast is that market actually growing?",
      "If a well-funded competitor copies this in six months, what stops them from eating your lunch?"
    ]},
  { id:'founder', fin:'🦈', name:'The Founder', role:'Serial Founder', focus:'Focused purely on execution. Has shipped things and knows how hard it is.',
    questions:[
      "Walk me through what you've actually built and shipped so far — not the vision, the reality.",
      "What's the single biggest operational risk that could kill this in year one?"
    ]},
  { id:'customer', fin:'🦈', name:'The Customer', role:'Voice of the User', focus:'Only cares if real people will actually use and love this.',
    questions:[
      "Why would someone switch from what they use today to this, on day one?",
      "What happens the first time your product fails a customer — how do they feel about you the next day?"
    ]},
  { id:'angel', fin:'🦈', name:'The Angel', role:'Angel Investor', focus:'Laser-focused on unit economics and a real path to profitability.',
    questions:[
      "What does it cost you to acquire a customer, and what's that customer worth over their lifetime?",
      "When exactly does this business turn cash-flow positive, and what has to go right to get there?"
    ]}
];
 
let pitch = {};
let qaLog = []; // {judgeId, questionIndex, question, answer, reaction}
let scores = {}; // marketPotential, innovation, businessModel, execution, investmentWorthiness
let decision = {};
 
/* ---------------------------------------------------------------
   NAVIGATION
--------------------------------------------------------------- */
const STEPS = ['form','pitch','qa','score','decision','leaderboard'];
function goTo(step){
  STEPS.forEach(s=>{
    document.getElementById('step-'+s).classList.toggle('active', s===step);
  });
  document.querySelectorAll('.progress-step').forEach(el=>{
    const s = el.dataset.step;
    el.classList.remove('active','done');
    if(s===step) el.classList.add('active');
    else if(STEPS.indexOf(s) < STEPS.indexOf(step) && step!=='leaderboard') el.classList.add('done');
  });
  document.getElementById('quickNav').style.display = (step==='form') ? 'none' : 'flex';
  document.querySelectorAll('#quickNav a').forEach(a=> a.classList.toggle('on', a.dataset.goto===step));
  window.scrollTo({top:0, behavior:'smooth'});
}
document.querySelectorAll('#quickNav a').forEach(a=>{
  a.addEventListener('click', ()=>{
    if(a.dataset.goto==='form') resetAll();
    goTo(a.dataset.goto);
  });
});
document.querySelectorAll('.progress-step').forEach(el=>{
  el.style.cursor='default';
});
 
function toast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg; t.classList.add('show');
  clearTimeout(toast._h);
  toast._h=setTimeout(()=>t.classList.remove('show'), 2600);
}
 
/* ---------------------------------------------------------------
   STEP 1 -> 2 : FORM SUBMIT
--------------------------------------------------------------- */
document.getElementById('btnStartPitch').addEventListener('click', ()=>{
  const name = document.getElementById('f-name').value.trim();
  const problem = document.getElementById('f-problem').value.trim();
  const solution = document.getElementById('f-solution').value.trim();
  const revenue = document.getElementById('f-revenue').value.trim();
  const audience = document.getElementById('f-audience').value.trim();
  const ask = document.getElementById('f-ask').value.trim();
  const err = document.getElementById('formErr');
 
  if(!name || !problem || !solution || !revenue || !audience || !ask){
    err.textContent = 'Every field matters in The Tank — fill them all in.';
    return;
  }
  err.textContent = '';
  pitch = { name, problem, solution, revenue, audience, ask };
  qaLog = [];
 
  document.getElementById('p-name').textContent = pitch.name;
  document.getElementById('p-problem').textContent = pitch.problem;
  document.getElementById('p-solution').textContent = pitch.solution;
  document.getElementById('p-revenue').textContent = pitch.revenue;
  document.getElementById('p-audience').textContent = pitch.audience;
  document.getElementById('p-ask').textContent = pitch.ask;
 
  renderJudgesGrid();
  goTo('pitch');
});
 
function renderJudgesGrid(){
  const grid = document.getElementById('judgesGrid');
  grid.innerHTML = JUDGES.map(j=>`
    <div class="panel judge-card" id="jcard-${j.id}">
      <div class="fin">${j.fin}</div>
      <h3>${j.name}</h3>
      <div class="role">${j.role}</div>
      <div class="focus">${j.focus}</div>
    </div>
  `).join('');
}
 
/* ---------------------------------------------------------------
   STEP 2 -> 3 : BEGIN Q&A
--------------------------------------------------------------- */
document.getElementById('btnBeginQA').addEventListener('click', ()=>{
  renderQAThread();
  goTo('qa');
});
 
function renderQAThread(){
  const thread = document.getElementById('qaThread');
  let html = '';
  let counter = 1;
  JUDGES.forEach(j=>{
    j.questions.forEach((q, qi)=>{
      const blockId = `${j.id}-${qi}`;
      html += `
      <div class="panel qa-block" id="qa-${blockId}" data-judge="${j.id}" data-qi="${qi}">
        <div class="qa-judge-tag">
          <span class="fin">${j.fin}</span>
          <span class="name">${j.name}</span>
          <span class="num">Question ${counter} / ${JUDGES.length*2}</span>
        </div>
        <div class="qa-question">${q}</div>
        <textarea class="answer" id="ans-${blockId}" placeholder="Answer ${j.name} directly. Specific answers score better than vague ones..."></textarea>
        <div class="qa-submit">
          <button class="btn" data-answer="${blockId}">Answer →</button>
        </div>
        <div class="qa-reaction" id="reaction-${blockId}"></div>
      </div>`;
      counter++;
    });
  });
  thread.innerHTML = html;
 
  thread.querySelectorAll('[data-answer]').forEach(btn=>{
    btn.addEventListener('click', ()=> submitAnswer(btn.dataset.answer, btn));
  });
  updateFinishButton();
}
 
function submitAnswer(blockId, btn){
  if(btn.disabled) return;
  const [judgeId, qi] = blockId.split('-');
  const ta = document.getElementById('ans-'+blockId);
  const answer = ta.value.trim();
  if(!answer){
    ta.style.borderColor = 'var(--danger-red)';
    setTimeout(()=> ta.style.borderColor='', 900);
    return;
  }
  const judge = JUDGES.find(j=>j.id===judgeId);
  const question = judge.questions[parseInt(qi)];
  const reaction = generateReaction(judge, answer);
 
  qaLog.push({ judgeId, qi:parseInt(qi), question, answer, reaction: reaction.text, quality: reaction.quality });
 
  const reactBox = document.getElementById('reaction-'+blockId);
  reactBox.innerHTML = `<span class="tag">${judge.name} reacts</span>${reaction.text}`;
  reactBox.classList.add('show');
  ta.disabled = true;
  btn.disabled = true;
  btn.textContent = 'Answered ✓';
 
  // speaking pulse on judge card if visible (not on this screen, but harmless)
  updateFinishButton();
}
 
function updateFinishButton(){
  const total = JUDGES.reduce((n,j)=>n+j.questions.length,0);
  document.getElementById('btnFinishQA').disabled = qaLog.length < total;
}
 
/* Rule-based reaction / quality engine (no backend) */
function generateReaction(judge, answer){
  const words = answer.split(/\s+/).filter(Boolean);
  const len = words.length;
  const lower = answer.toLowerCase();
 
  const numberSignal = /\d/.test(answer);
  const vagueWords = ['maybe','hopefully','probably','not sure','i think','kind of','sort of','we\'ll see','tbd'];
  const isVague = vagueWords.some(v=>lower.includes(v));
  const confident = /(we|our|already|proven|validated|tested|signed|customers|users)/.test(lower);
 
  let score = 5; // out of 10
  if(len < 8) score -= 2.5;
  else if(len > 60) score += 0.5;
  else score += 1;
  if(numberSignal) score += 1.5;
  if(isVague) score -= 2;
  if(confident) score += 1;
  score = Math.max(1, Math.min(10, score));
 
  const byJudge = {
    vc: {
      high: ["Now that's the kind of scale thinking I want to hear. Keep going.",
             "Good — you're thinking about the market, not just the product."],
      mid:  ["Reasonable, but I need bigger numbers before I get excited.",
             "That's a start. Show me the growth curve, not just the idea."],
      low:  ["That answer didn't move the needle for me on scale at all.",
             "Vague. If you can't size the market, I can't size the check."]
    },
    founder: {
      high: ["Respect. That's someone who's actually shipped something.",
             "Good instinct — you're thinking about risk like an operator."],
      mid:  ["Okay, but talk is cheap. What have you actually built?",
             "That's fine in theory. Reality bites harder."],
      low:  ["I've built things. That answer tells me you haven't, yet.",
             "That's a founder who hasn't hit the wall yet. It's coming."]
    },
    customer: {
      high: ["Honestly? I'd try that. That's a real reason to switch.",
             "That's the kind of answer that makes me trust a product."],
      mid:  ["I might use it, I might not. You didn't fully sell me.",
             "That's okay, but I've heard that pitch before."],
      low:  ["As a customer, that didn't convince me to change anything I do.",
             "I don't feel the pain you're describing enough to switch."]
    },
    angel: {
      high: ["Now we're talking numbers. That's how you get a check written.",
             "That's a founder who understands their own economics."],
      mid:  ["Numbers are fuzzy. I need real unit economics before I invest.",
             "That's a soft answer on profitability. Tighten it up."],
      low:  ["No numbers, no deal. I can't invest in a feeling.",
             "That answer worries me about your grip on the business."]
    }
  };
 
  const bucket = score >= 7 ? 'high' : score >= 4.5 ? 'mid' : 'low';
  const pool = byJudge[judge.id][bucket];
  const text = pool[Math.floor(Math.random()*pool.length)];
  return { text, quality: score };
}
 
/* ---------------------------------------------------------------
   STEP 3 -> 4 : SCORING
--------------------------------------------------------------- */
document.getElementById('btnFinishQA').addEventListener('click', ()=>{
  computeScores();
  renderScores();
  goTo('score');
});
 
function computeScores(){
  const avgQuality = qaLog.reduce((s,q)=>s+q.quality,0) / qaLog.length; // 1-10
 
  // text signal helpers
  const allText = (pitch.problem+' '+pitch.solution+' '+pitch.revenue+' '+pitch.audience).toLowerCase();
  const askNumMatch = pitch.ask.match(/[\d,]+/);
  const askNum = askNumMatch ? parseInt(askNumMatch[0].replace(/,/g,'')) : 100000;
 
  const hasRevenueNumbers = /\$|\d+%|\/mo|\/month|\/yr|subscription|per user|per seat/.test(pitch.revenue.toLowerCase());
  const marketWords = ['million','billion','global','market','industry','everyone','businesses','enterprise'];
  const marketSignal = marketWords.filter(w=>allText.includes(w)).length;
  const innovationWords = ['ai','automat','first','unique','proprietary','algorithm','patent','novel','platform'];
  const innovationSignal = innovationWords.filter(w=>allText.includes(w)).length;
 
  function clamp(n){ return Math.max(8, Math.min(98, Math.round(n))); }
 
  scores.marketPotential = clamp(40 + marketSignal*8 + (avgQuality-5)*3);
  scores.innovation      = clamp(38 + innovationSignal*7 + (avgQuality-5)*2.5 + (pitch.solution.length>80?6:0));
  scores.businessModel   = clamp(35 + (hasRevenueNumbers?18:0) + (avgQuality-5)*3);
  scores.execution       = clamp(30 + avgQuality*6);
  scores.investmentWorthiness = clamp(
    (scores.marketPotential + scores.innovation + scores.businessModel + scores.execution)/4
    + (avgQuality-5)*2 - (askNum>2000000?6:0)
  );
 
  scores._avgQuality = avgQuality;
  scores._askNum = askNum;
}
 
function renderScores(){
  const labels = {
    marketPotential:'Market Potential',
    innovation:'Innovation',
    businessModel:'Business Model',
    execution:'Execution',
    investmentWorthiness:'Investment Worthiness'
  };
  const grid = document.getElementById('scoreGrid');
  grid.innerHTML = Object.keys(labels).map(k=>`
    <div class="panel score-row">
      <div class="top"><span class="label">${labels[k]}</span><span class="num">${scores[k]}</span></div>
      <div class="meter"><div class="meter-fill" data-fill="${scores[k]}" style="width:0%"></div></div>
    </div>
  `).join('');
 
  const overall = Math.round(Object.keys(labels).reduce((s,k)=>s+scores[k],0)/5);
  scores.overall = overall;
  grid.insertAdjacentHTML('beforeend', `
    <div class="panel overall-block">
      <div class="label">Overall Tank Score</div>
      <div class="overall-num">${overall}<span>/100</span></div>
    </div>
  `);
 
  requestAnimationFrame(()=>{
    setTimeout(()=>{
      grid.querySelectorAll('.meter-fill').forEach(el=>{
        el.style.width = el.dataset.fill + '%';
      });
    }, 80);
  });
}
 
/* ---------------------------------------------------------------
   STEP 4 -> 5 : DECISION
--------------------------------------------------------------- */
document.getElementById('btnSeeVerdict').addEventListener('click', ()=>{
  computeDecision();
  renderDecision();
  goTo('decision');
  if(decision.type === 'invest' || decision.type === 'acquire'){
    fireConfetti();
  }
});
 
function computeDecision(){
  const o = scores.overall;
  const askNum = scores._askNum;
 
  let type, valuationMultiple;
  if(o >= 75){ type='invest'; }
  else if(o >= 60){ type='acquire'; }
  else if(o >= 42){ type='comeback'; }
  else { type='reject'; }
 
  // suggested valuation: derive from ask + business model/market strength
  const strength = (scores.marketPotential + scores.businessModel)/2;
  valuationMultiple = 0.6 + (strength/100)*1.8; // 0.6x - 2.4x of implied valuation from ask
  let impliedValuationFromAsk = askNum * 10; // assume ask was for ~10% by default guess
  let suggestedValuation = Math.round((impliedValuationFromAsk * valuationMultiple) / 1000) * 1000;
  if(suggestedValuation < 20000) suggestedValuation = 20000;
 
  let fundingAmount = type==='reject' ? 0 :
    Math.round(Math.min(askNum, suggestedValuation*0.15)/1000)*1000;
  if(type==='acquire') fundingAmount = Math.round(suggestedValuation*0.6/1000)*1000;
  if(type==='comeback') fundingAmount = 0;
 
  const equity = (type==='reject'||type==='comeback') ? 0 :
    Math.max(5, Math.min(35, Math.round((fundingAmount/suggestedValuation)*100)));
 
  const reasonParts = [];
  if(scores.marketPotential>=70) reasonParts.push(`${JUDGES[0].name} sees real scale in ${pitch.audience.toLowerCase().includes('business')?'this B2B market':'this market'}`);
  else if(scores.marketPotential<45) reasonParts.push(`${JUDGES[0].name} isn't convinced the market is big enough yet`);
 
  if(scores.execution>=70) reasonParts.push(`${JUDGES[1].name} respects the operational grip shown under questioning`);
  else if(scores.execution<45) reasonParts.push(`${JUDGES[1].name} flagged real execution risk`);
 
  if(scores.innovation>=70) reasonParts.push(`the product itself felt genuinely differentiated to the panel`);
  if(scores.businessModel>=70) reasonParts.push(`${JUDGES[3].name} liked the unit economics story`);
  else if(scores.businessModel<45) reasonParts.push(`${JUDGES[3].name} wants a tighter path to profitability before committing real capital`);
 
  const closingByType = {
    invest: "On balance, the tank believes this is fundable today — the fundamentals outweigh the open risks.",
    acquire: "The tank sees more value in owning this outright than betting on you to scale it solo.",
    comeback: "There's a real idea here, but too many open questions to write a check today. Come back with traction.",
    reject: "The gaps outweigh the upside right now. This isn't a fit for the tank as pitched."
  };
 
  const reasoning = (reasonParts.length ? reasonParts.join('; ') + '. ' : '') + closingByType[type];
 
  decision = {
    type,
    suggestedValuation,
    fundingAmount,
    equity,
    reasoning
  };
}
 
function fmtMoney(n){
  return '$' + Math.round(n).toLocaleString('en-US');
}
 
function renderDecision(){
  const card = document.getElementById('verdictCard');
  card.className = 'panel verdict-card ' + decision.type;
  const labelMap = { invest:'I\'M IN', acquire:'I WANT TO ACQUIRE YOU', comeback:'COME BACK LATER', reject:'I\'M OUT' };
  const subMap = {
    invest:'The panel is ready to write a check.',
    acquire:'The panel wants to own this, not just fund it.',
    comeback:'Promising, but not ready for a check yet.',
    reject:'This pitch didn\'t survive the tank.'
  };
  document.getElementById('verdictLabel').textContent = labelMap[decision.type];
  document.getElementById('verdictSub').textContent = subMap[decision.type];
 
  const terms = document.getElementById('dealTerms');
  if(decision.type==='invest' || decision.type==='acquire'){
    terms.innerHTML = `
      <div class="deal-term"><div class="k">Suggested Valuation</div><div class="v">${fmtMoney(decision.suggestedValuation)}</div></div>
      <div class="deal-term"><div class="k">Funding Offered</div><div class="v">${fmtMoney(decision.fundingAmount)}</div></div>
      <div class="deal-term"><div class="k">For Equity</div><div class="v">${decision.equity}%</div></div>
    `;
  } else if(decision.type==='comeback'){
    terms.innerHTML = `
      <div class="deal-term"><div class="k">Suggested Valuation</div><div class="v">${fmtMoney(decision.suggestedValuation)}</div></div>
      <div class="deal-term"><div class="k">Funding Today</div><div class="v">$0</div></div>
    `;
  } else {
    terms.innerHTML = `
      <div class="deal-term"><div class="k">Funding Offered</div><div class="v">$0</div></div>
    `;
  }
 
  document.getElementById('reasoningText').textContent = decision.reasoning;
 
  // per-judge verdict blurbs derived from their focused score
  const focusScoreMap = {
    vc:'marketPotential', founder:'execution', customer:'innovation', angel:'businessModel'
  };
  const jv = document.getElementById('judgeVerdicts');
  jv.innerHTML = JUDGES.map(j=>{
    const s = scores[focusScoreMap[j.id]];
    const verdictWord = s>=70?'Convinced':s>=45?'On the fence':'Not convinced';
    return `<div class="panel jv-card">
      <div class="h"><span class="fin">${j.fin}</span><span class="name">${j.name}</span></div>
      <p><strong>${verdictWord}.</strong> ${labels_for(j.id, s)}</p>
    </div>`;
  }).join('');
 
  function labels_for(id, s){
    const texts = {
      vc: s>=70?'Sees enough market to scale.':s>=45?'Market case is unproven.':'Market too small or unclear.',
      founder: s>=70?'Trusts the execution instincts shown.':s>=45?'Execution risk noted.':'Doubts this gets built as promised.',
      customer: s>=70?'Would genuinely use this.':s>=45?'Might use it, not sold yet.':'Not compelling enough to switch.',
      angel: s>=70?'Numbers support profitability.':s>=45?'Economics need work.':'No credible path to profit shown.'
    };
    return texts[id];
  }
}
 
function fireConfetti(){
  if(typeof confetti !== 'function') return;
  const duration = 2200;
  const end = Date.now() + duration;
  (function frame(){
    confetti({ particleCount:4, angle:60, spread:60, origin:{x:0}, colors:['#3fe0c5','#f0b93d','#eaf4f4'] });
    confetti({ particleCount:4, angle:120, spread:60, origin:{x:1}, colors:['#3fe0c5','#f0b93d','#eaf4f4'] });
    if(Date.now() < end) requestAnimationFrame(frame);
  })();
  confetti({ particleCount:120, spread:100, origin:{y:0.4}, colors:['#3fe0c5','#f0b93d','#eaf4f4'] });
}
 
/* ---------------------------------------------------------------
   PDF REPORT
--------------------------------------------------------------- */
document.getElementById('btnDownloadPdf').addEventListener('click', ()=>{
  try{
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit:'pt', format:'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    let y = 56;
 
    doc.setFillColor(5,13,20);
    doc.rect(0,0,pageW,842,'F');
 
    doc.setTextColor(63,224,197);
    doc.setFont('helvetica','bold'); doc.setFontSize(11);
    doc.text('THE TANK — PITCH REPORT', 48, y); y+=30;
 
    doc.setTextColor(234,244,244);
    doc.setFontSize(26);
    doc.text(pitch.name, 48, y); y+=26;
 
    doc.setDrawColor(63,224,197); doc.setLineWidth(0.5);
    doc.line(48, y, pageW-48, y); y+=26;
 
    function section(title, body){
      doc.setTextColor(240,185,61); doc.setFontSize(10); doc.setFont('helvetica','bold');
      doc.text(title.toUpperCase(), 48, y); y+=16;
      doc.setTextColor(200,215,218); doc.setFontSize(11); doc.setFont('helvetica','normal');
      const lines = doc.splitTextToSize(body, pageW-96);
      doc.text(lines, 48, y); y += lines.length*14 + 14;
    }
 
    section('Problem', pitch.problem);
    section('Solution', pitch.solution);
    section('Revenue Model', pitch.revenue);
    section('Target Audience', pitch.audience);
    section('Funding Ask', pitch.ask);
 
    doc.setTextColor(63,224,197); doc.setFontSize(10); doc.setFont('helvetica','bold');
    doc.text('SCORECARD', 48, y); y+=18;
    const labels = { marketPotential:'Market Potential', innovation:'Innovation', businessModel:'Business Model', execution:'Execution', investmentWorthiness:'Investment Worthiness' };
    doc.setFont('helvetica','normal'); doc.setFontSize(11); doc.setTextColor(220,230,232);
    Object.keys(labels).forEach(k=>{
      doc.text(`${labels[k]}: ${scores[k]}/100`, 48, y); y+=16;
    });
    doc.setFont('helvetica','bold');
    doc.setTextColor(240,185,61);
    doc.text(`Overall Tank Score: ${scores.overall}/100`, 48, y); y+=26;
 
    doc.setTextColor(63,224,197); doc.setFontSize(10); doc.setFont('helvetica','bold');
    doc.text('VERDICT', 48, y); y+=18;
    const labelMap = { invest:"I'M IN", acquire:'ACQUIRE', comeback:'COME BACK LATER', reject:"I'M OUT" };
    doc.setFontSize(16); doc.setTextColor(234,244,244);
    doc.text(labelMap[decision.type], 48, y); y+=20;
    doc.setFontSize(11); doc.setFont('helvetica','normal'); doc.setTextColor(200,215,218);
    if(decision.type==='invest' || decision.type==='acquire'){
      doc.text(`Suggested Valuation: ${fmtMoney(decision.suggestedValuation)}  |  Funding: ${fmtMoney(decision.fundingAmount)}  |  Equity: ${decision.equity}%`,48,y); y+=20;
    }
    const reasonLines = doc.splitTextToSize(decision.reasoning, pageW-96);
    doc.text(reasonLines, 48, y); y += reasonLines.length*14 + 20;
 
    if(y > 680){ doc.addPage(); doc.setFillColor(5,13,20); doc.rect(0,0,pageW,842,'F'); y=56; }
    doc.setTextColor(63,224,197); doc.setFontSize(10); doc.setFont('helvetica','bold');
    doc.text('CROSS-EXAMINATION LOG', 48, y); y+=18;
    qaLog.forEach(entry=>{
      const judge = JUDGES.find(j=>j.id===entry.judgeId);
      if(y > 760){ doc.addPage(); doc.setFillColor(5,13,20); doc.rect(0,0,pageW,842,'F'); y=56; }
      doc.setFontSize(10.5); doc.setFont('helvetica','bold'); doc.setTextColor(240,185,61);
      doc.text(judge.name+':', 48, y); y+=14;
      doc.setFont('helvetica','italic'); doc.setTextColor(220,230,232);
      let qLines = doc.splitTextToSize('Q: '+entry.question, pageW-96);
      doc.text(qLines, 48, y); y += qLines.length*13+4;
      doc.setFont('helvetica','normal'); doc.setTextColor(190,205,208);
      let aLines = doc.splitTextToSize('A: '+entry.answer, pageW-96);
      doc.text(aLines, 48, y); y += aLines.length*13+16;
    });
 
    doc.save(`${pitch.name.replace(/\s+/g,'_')}_Tank_Report.pdf`);
    toast('Pitch report downloaded.');
  }catch(e){
    console.error(e);
    toast('Could not generate PDF — jsPDF failed to load.');
  }
});
 
/* ---------------------------------------------------------------
   SHARE
--------------------------------------------------------------- */
document.getElementById('btnShare').addEventListener('click', async ()=>{
  const labelMap = { invest:"I'M IN 🦈", acquire:'ACQUIRED 🦈', comeback:'COME BACK LATER 🦈', reject:"I'M OUT 🦈" };
  const text = `${pitch.name} just pitched The Tank and got: ${labelMap[decision.type]}\nOverall Score: ${scores.overall}/100${decision.type==='invest'||decision.type==='acquire' ? `\nDeal: ${fmtMoney(decision.fundingAmount)} for ${decision.equity}%` : ''}`;
  try{
    if(navigator.share){
      await navigator.share({ title:'The Tank — Pitch Result', text });
      toast('Shared.');
    } else {
      await navigator.clipboard.writeText(text);
      toast('Result copied to clipboard.');
    }
  }catch(e){
    try{ await navigator.clipboard.writeText(text); toast('Result copied to clipboard.'); }
    catch(e2){ toast('Could not share result.'); }
  }
});
 
/* ---------------------------------------------------------------
   LEADERBOARD (localStorage)
--------------------------------------------------------------- */
const LB_KEY = 'tank_leaderboard_v1';
 
function getLeaderboard(){
  try{ return JSON.parse(localStorage.getItem(LB_KEY)) || []; }
  catch(e){ return []; }
}
function saveLeaderboard(list){
  localStorage.setItem(LB_KEY, JSON.stringify(list));
}
 
document.getElementById('btnSaveLeaderboard').addEventListener('click', ()=>{
  const list = getLeaderboard();
  list.push({
    name: pitch.name,
    overall: scores.overall,
    deal: decision.type,
    valuation: (decision.type==='invest'||decision.type==='acquire') ? decision.suggestedValuation : 0,
    date: new Date().toLocaleDateString()
  });
  saveLeaderboard(list);
  toast('Saved to leaderboard.');
  renderLeaderboard();
});
 
document.getElementById('btnClearBoard').addEventListener('click', ()=>{
  if(confirm('Clear the entire leaderboard? This cannot be undone.')){
    localStorage.removeItem(LB_KEY);
    renderLeaderboard();
    toast('Leaderboard cleared.');
  }
});
 
function renderLeaderboard(){
  const list = getLeaderboard().sort((a,b)=> b.overall - a.overall);
  const body = document.getElementById('leaderboardBody');
  const empty = document.getElementById('leaderboardEmpty');
  if(list.length===0){
    body.innerHTML=''; empty.style.display='block';
    return;
  }
  empty.style.display='none';
  const dealLabel = { invest:"I'M IN", acquire:'ACQUIRE', comeback:'LATER', reject:"I'M OUT" };
  body.innerHTML = list.map((row,i)=>`
    <tr>
      <td class="rank">${String(i+1).padStart(2,'0')}</td>
      <td>${escapeHtml(row.name)}</td>
      <td>${row.overall}/100</td>
      <td class="deal"><span class="deal-badge ${row.deal}">${dealLabel[row.deal]||row.deal}</span></td>
      <td>${row.valuation ? fmtMoney(row.valuation) : '—'}</td>
      <td>${row.date}</td>
    </tr>
  `).join('');
}
function escapeHtml(s){
  const d=document.createElement('div'); d.textContent=s; return d.innerHTML;
}
 
/* ---------------------------------------------------------------
   RESTART
--------------------------------------------------------------- */
document.getElementById('btnRestart').addEventListener('click', resetAll);
function resetAll(){
  ['f-name','f-problem','f-solution','f-revenue','f-audience','f-ask'].forEach(id=>{
    document.getElementById(id).value = '';
  });
  document.getElementById('formErr').textContent='';
  pitch = {}; qaLog=[]; scores={}; decision={};
  goTo('form');
}
 
/* init */
renderLeaderboard();
goTo('form');
 
})();
</script>
</body>
</html>
 
