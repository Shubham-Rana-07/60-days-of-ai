<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>E85 Paradox Dashboard · Maruti A-Star</title>
<style>
  :root{
    --bg:#0a0f1e;
    --panel:rgba(255,255,255,0.05);
    --panel-border:rgba(255,255,255,0.10);
    --text:#e8ecf6;
    --sub:#8b93ab;
    --e85:#f59e0b;
    --petrol:#3b82f6;
    --diesel:#94a3b8;
    --cng:#22c55e;
    --ev:#a855f7;
    --good:#22c55e;
    --bad:#f87171;
    --radius:18px;
  }
  *{box-sizing:border-box;margin:0;padding:0;}
  body{
    background:
      radial-gradient(circle at 15% 10%, rgba(59,130,246,0.12), transparent 40%),
      radial-gradient(circle at 85% 0%, rgba(245,158,11,0.10), transparent 45%),
      radial-gradient(circle at 50% 100%, rgba(168,85,247,0.10), transparent 45%),
      var(--bg);
    color:var(--text);
    font-family:'Segoe UI', system-ui, -apple-system, sans-serif;
    min-height:100vh;
    padding:20px;
  }
  .wrap{max-width:1320px;margin:0 auto;}
  .glass{
    background:var(--panel);
    border:1px solid var(--panel-border);
    border-radius:var(--radius);
    backdrop-filter:blur(14px);
    -webkit-backdrop-filter:blur(14px);
  }
  header.glass{
    padding:22px 28px;
    margin-bottom:20px;
    display:flex;
    flex-wrap:wrap;
    justify-content:space-between;
    align-items:center;
    gap:10px;
  }
  header h1{font-size:1.4rem;font-weight:700;letter-spacing:0.3px;}
  header h1 span.dot{color:var(--sub);margin:0 8px;}
  header .badges{display:flex;gap:10px;flex-wrap:wrap;}
  .badge{
    padding:6px 14px;border-radius:999px;font-size:0.78rem;font-weight:600;
    background:rgba(245,158,11,0.14);color:var(--e85);border:1px solid rgba(245,158,11,0.3);
  }
  .kpis{
    display:grid;
    grid-template-columns:repeat(5,1fr);
    gap:16px;
    margin-bottom:20px;
  }
  .kpi{
    padding:18px 16px;
    text-align:left;
    position:relative;
    overflow:hidden;
  }
  .kpi::before{
    content:'';position:absolute;top:0;left:0;width:4px;height:100%;
    background:var(--accent, var(--petrol));
  }
  .kpi .label{font-size:0.72rem;color:var(--sub);text-transform:uppercase;letter-spacing:0.6px;margin-bottom:8px;}
  .kpi .value{font-size:1.5rem;font-weight:800;}
  .kpi .sub{font-size:0.72rem;color:var(--sub);margin-top:6px;}
  .kpi.up .value{color:var(--bad);}
  .kpi.down .value{color:var(--good);}
  .row{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;}
  .panel{padding:22px;}
  .panel h2{font-size:1rem;font-weight:700;margin-bottom:4px;}
  .panel .desc{font-size:0.78rem;color:var(--sub);margin-bottom:14px;}
  .chart-svg{width:100%;height:auto;display:block;overflow:visible;}
  .tooltip{
    position:absolute;pointer-events:none;
    background:#101830;border:1px solid rgba(255,255,255,0.15);
    padding:8px 12px;border-radius:10px;font-size:0.75rem;
    box-shadow:0 8px 24px rgba(0,0,0,0.5);
    opacity:0;transition:opacity 0.15s;z-index:50;white-space:nowrap;
  }
  .tooltip.show{opacity:1;}
  .chart-wrap{position:relative;}
  .legend{display:flex;flex-wrap:wrap;gap:12px;margin-top:12px;font-size:0.72rem;color:var(--sub);}
  .legend .item{display:flex;align-items:center;gap:6px;}
  .legend .sw{width:10px;height:10px;border-radius:3px;}
  .single{margin-bottom:20px;}
  .agebar-table{width:100%;border-collapse:collapse;font-size:0.82rem;margin-top:10px;}
  .agebar-table th, .agebar-table td{padding:10px 8px;text-align:left;border-bottom:1px solid var(--panel-border);}
  .agebar-table th{color:var(--sub);font-weight:600;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.5px;}
  .agebar-table tr.current td{color:var(--e85);font-weight:700;}
  .agebar-table tr.current{background:rgba(245,158,11,0.08);}
  .gauge-verdict{
    grid-template-columns:340px 1fr;
  }
  .gauge-box{display:flex;flex-direction:column;align-items:center;justify-content:center;}
  .gauge-score{font-size:2.6rem;font-weight:900;margin-top:-40px;}
  .gauge-score span{font-size:1rem;color:var(--sub);font-weight:600;}
  .verdict-text{font-size:1.05rem;line-height:1.6;padding:10px 6px;}
  .verdict-text b{color:var(--e85);}
  .breakdown{display:flex;flex-direction:column;gap:10px;margin-top:16px;}
  .bd-row{display:flex;align-items:center;gap:10px;font-size:0.78rem;}
  .bd-row .bd-label{width:110px;color:var(--sub);}
  .bd-row .bd-bar{flex:1;height:8px;border-radius:6px;background:rgba(255,255,255,0.08);overflow:hidden;}
  .bd-row .bd-fill{height:100%;border-radius:6px;background:var(--e85);width:0;transition:width 1.2s cubic-bezier(.2,.8,.2,1);}
  .bd-row .bd-val{width:56px;text-align:right;font-weight:700;}
  .fuel-cards{
    display:grid;
    grid-template-columns:repeat(5,1fr);
    gap:16px;
  }
  .fuel-card{
    padding:18px 16px;
    position:relative;
    border:1px solid var(--panel-border);
  }
  .fuel-card .fname{font-weight:800;font-size:0.95rem;margin-bottom:2px;}
  .fuel-card .ftag{font-size:0.68rem;color:var(--sub);margin-bottom:12px;}
  .fuel-card ul{list-style:none;font-size:0.76rem;margin-bottom:10px;line-height:1.6;}
  .fuel-card .best{font-size:0.76rem;padding-top:8px;border-top:1px dashed var(--panel-border);color:var(--sub);}
  .fuel-card .best b{color:var(--text);}
  .fuel-card.highlight{
    border-color:var(--e85);
    box-shadow:0 0 0 1px rgba(245,158,11,0.4), 0 0 30px rgba(245,158,11,0.25);
  }
  .fuel-card.highlight::after{
    content:'YOUR FUEL';position:absolute;top:14px;right:14px;
    font-size:0.6rem;font-weight:800;color:var(--e85);letter-spacing:0.5px;
  }
  footer{text-align:center;color:var(--sub);font-size:0.7rem;margin-top:24px;padding-bottom:10px;}
 
  @media(max-width:1080px){
    .kpis{grid-template-columns:repeat(3,1fr);}
    .row{grid-template-columns:1fr;}
    .fuel-cards{grid-template-columns:repeat(2,1fr);}
    .gauge-verdict{grid-template-columns:1fr;}
  }
  @media(max-width:640px){
    .kpis{grid-template-columns:repeat(2,1fr);}
    .fuel-cards{grid-template-columns:1fr;}
    header.glass{flex-direction:column;align-items:flex-start;}
  }
</style>
</head>
<body>
<div class="wrap">
 
  <header class="glass">
    <h1>🚗 Maruti A-Star <span class="dot">·</span> Petrol (E20) <span class="dot">·</span> Age: 15y <span class="dot">·</span> 2000 km/mo</h1>
    <div class="badges"><div class="badge">E85 Paradox Analysis</div></div>
  </header>
 
  <div class="kpis" id="kpiRow"></div>
 
  <div class="row">
    <div class="panel glass">
      <h2>Cost per km by Fuel</h2>
      <div class="desc">Average running cost (₹/km) — hover bars for detail</div>
      <div class="chart-wrap" id="barWrap"></div>
      <div class="legend" id="barLegend"></div>
    </div>
    <div class="panel glass">
      <h2>CO₂ Emitted per km</h2>
      <div class="desc">Share of emission intensity by fuel — hover segments</div>
      <div class="chart-wrap" id="donutWrap"></div>
      <div class="legend" id="donutLegend"></div>
    </div>
  </div>
 
  <div class="panel glass single">
    <h2>Cost/km vs Vehicle Age</h2>
    <div class="desc">Trend fitted from dataset (age 0–16y) — dashed line marks your car's age (15y)</div>
    <div class="chart-wrap" id="lineWrap"></div>
    <div class="legend" id="lineLegend"></div>
  </div>
 
  <div class="panel glass single">
    <h2>Cost &amp; Maintenance by Age Bucket</h2>
    <div class="desc">Aggregated across all fuel types in dataset — highlighted row matches your car's bucket</div>
    <table class="agebar-table" id="bucketTable"></table>
  </div>
 
  <div class="row gauge-verdict">
    <div class="panel glass gauge-box">
      <h2 style="align-self:flex-start;">E85 Score</h2>
      <div class="desc" style="align-self:flex-start;">Weighted: Cost 4pt · CO₂ 3pt · Refuel 2pt · Maint 1pt</div>
      <div id="gaugeSvgWrap"></div>
      <div class="gauge-score" id="gaugeScoreText"></div>
    </div>
    <div class="panel glass">
      <h2>Verdict</h2>
      <p class="verdict-text" id="verdictText"></p>
      <div class="breakdown" id="scoreBreakdown"></div>
    </div>
  </div>
 
  <div class="fuel-cards" id="fuelCards"></div>
 
  <footer>All figures computed live from day17_e85_dataset_optimised.csv · Group-by Fuel_Type averages</footer>
</div>
 
<div class="tooltip" id="tooltip"></div>
 
<script id="rawdata" type="application/json">
{
  "fuels": ["Petrol (E20)","E85 (Flex-Fuel)","Diesel","CNG","Electric (EV)"],
  "colors": {
    "Petrol (E20)":"#3b82f6",
    "E85 (Flex-Fuel)":"#f59e0b",
    "Diesel":"#94a3b8",
    "CNG":"#22c55e",
    "Electric (EV)":"#a855f7"
  },
  "short": {
    "Petrol (E20)":"Petrol",
    "E85 (Flex-Fuel)":"E85",
    "Diesel":"Diesel",
    "CNG":"CNG",
    "Electric (EV)":"EV"
  },
  "metrics": {
    "Petrol (E20)": {"cost_km":6.1543,"co2_km":0.1706,"maint_km":0.4661,"refuel":5.0,"price":100.0,"mileage":16.2727},
    "E85 (Flex-Fuel)": {"cost_km":6.3742,"co2_km":0.0698,"maint_km":0.4597,"refuel":5.0,"price":82.0,"mileage":12.8727},
    "Diesel": {"cost_km":4.6742,"co2_km":0.1787,"maint_km":1.0046,"refuel":5.0,"price":91.0,"mileage":19.5778},
    "CNG": {"cost_km":3.3248,"co2_km":0.1253,"maint_km":0.6616,"refuel":8.0,"price":80.0,"mileage":24.11},
    "Electric (EV)": {"cost_km":1.752,"co2_km":0.0912,"maint_km":0.2331,"refuel":45.0,"price":12.0,"mileage":6.8545}
  },
  "buckets_overall": {
    "New (0-2y)": {"cost_km":4.227,"maint_km":0.3472},
    "Mid-life (3-5y)": {"cost_km":4.0851,"maint_km":0.5583},
    "Aged (6-9y)": {"cost_km":5.1674,"maint_km":0.6482},
    "Old (10+y)": {"cost_km":5.2903,"maint_km":1.41}
  },
  "fits": {
    "Petrol (E20)": {"a":0.1312,"b":5.3549},
    "E85 (Flex-Fuel)": {"a":0.1497,"b":6.1293},
    "Diesel": {"a":0.1101,"b":3.9526},
    "CNG": {"a":0.0698,"b":2.9968},
    "Electric (EV)": {"a":0.0393,"b":1.6698}
  },
  "e85": {
    "pump_saving":18.0,
    "running_penalty":3.57,
    "break_even":79.11,
    "score":{"cost":0.0,"co2":3.0,"refuel":2.0,"maint":0.71,"total":5.71}
  },
  "user": {"monthly_cost":12308.6, "car_age":15, "km_month":2000, "fuel":"Petrol (E20)"}
}
</script>
 
<script>
const DATA = JSON.parse(document.getElementById('rawdata').textContent);
const fmt = (n,d=2) => Number(n).toLocaleString('en-IN',{minimumFractionDigits:d,maximumFractionDigits:d});
const tooltip = document.getElementById('tooltip');
 
function showTip(html, evt){
  tooltip.innerHTML = html;
  tooltip.classList.add('show');
  moveTip(evt);
}
function moveTip(evt){
  tooltip.style.left = (evt.pageX + 14) + 'px';
  tooltip.style.top = (evt.pageY - 10) + 'px';
}
function hideTip(){ tooltip.classList.remove('show'); }
 
/* ---------- KPI CARDS ---------- */
function renderKPIs(){
  const petrolC = DATA.metrics["Petrol (E20)"].cost_km;
  const e85C = DATA.metrics["E85 (Flex-Fuel)"].cost_km;
  const premium = DATA.e85.running_penalty;
  const cards = [
    {label:"Your Fuel Cost/km", value:"₹"+fmt(petrolC), sub:"Petrol (E20) avg", accent:"var(--petrol)"},
    {label:"E85 Cost/km", value:"₹"+fmt(e85C), sub:"E85 (Flex-Fuel) avg", accent:"var(--e85)"},
    {label:"E85 Premium vs Petrol", value:"+"+fmt(premium,2)+"%", sub:"runs costlier per km", accent:"var(--bad)", cls:"up"},
    {label:"E85 Break-even Price", value:"₹"+fmt(DATA.e85.break_even), sub:"pump price needed to match petrol", accent:"var(--e85)"},
    {label:"Your Monthly Cost", value:"₹"+fmt(DATA.user.monthly_cost,0), sub:DATA.user.km_month+" km/mo @ Petrol rate", accent:"var(--petrol)"}
  ];
  const row = document.getElementById('kpiRow');
  row.innerHTML = cards.map(c=>`
    <div class="glass kpi ${c.cls||''}" style="--accent:${c.accent}">
      <div class="label">${c.label}</div>
      <div class="value">${c.value}</div>
      <div class="sub">${c.sub}</div>
    </div>`).join('');
}
 
/* ---------- BAR CHART: cost/km per fuel ---------- */
function renderBar(){
  const W=560,H=300,padL=50,padB=40,padT=20,padR=20;
  const vals = DATA.fuels.map(f=>DATA.metrics[f].cost_km);
  const maxV = Math.max(...vals)*1.15;
  const bw = (W-padL-padR)/DATA.fuels.length;
  let bars='', labels='', grid='';
  for(let i=0;i<=4;i++){
    const y = padT + (H-padT-padB)*(1-i/4);
    grid += `<line x1="${padL}" y1="${y}" x2="${W-padR}" y2="${y}" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    <text x="${padL-8}" y="${y+4}" font-size="10" fill="#8b93ab" text-anchor="end">${fmt(maxV*i/4,1)}</text>`;
  }
  DATA.fuels.forEach((f,i)=>{
    const v = DATA.metrics[f].cost_km;
    const bh = (v/maxV)*(H-padT-padB);
    const x = padL + i*bw + bw*0.18;
    const y = H-padB-bh;
    const w = bw*0.64;
    const color = DATA.colors[f];
    bars += `<rect class="bar" data-fuel="${f}" x="${x}" y="${H-padB}" width="${w}" height="0" rx="6" fill="${color}" opacity="0.88">
      <animate attributeName="height" from="0" to="${bh}" dur="0.9s" fill="freeze" begin="${i*0.08}s" calcMode="spline" keySplines="0.2 0.8 0.2 1"/>
      <animate attributeName="y" from="${H-padB}" to="${y}" dur="0.9s" fill="freeze" begin="${i*0.08}s" calcMode="spline" keySplines="0.2 0.8 0.2 1"/>
    </rect>
    <text x="${x+w/2}" y="${y-8}" font-size="11" fill="#e8ecf6" text-anchor="middle" font-weight="700">${fmt(v)}</text>`;
    labels += `<text x="${x+w/2}" y="${H-padB+18}" font-size="10.5" fill="#8b93ab" text-anchor="middle">${DATA.short[f]}</text>`;
  });
  const svg = `<svg class="chart-svg" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    ${grid}
    <line x1="${padL}" y1="${H-padB}" x2="${W-padR}" y2="${H-padB}" stroke="rgba(255,255,255,0.2)"/>
    ${bars}${labels}
  </svg>`;
  document.getElementById('barWrap').innerHTML = svg;
  document.querySelectorAll('#barWrap .bar').forEach(el=>{
    el.addEventListener('mousemove',(e)=>{
      const f = el.dataset.fuel; const m = DATA.metrics[f];
      showTip(`<b style="color:${DATA.colors[f]}">${f}</b><br>Cost/km: ₹${fmt(m.cost_km)}<br>CO₂/km: ${fmt(m.co2_km,3)} kg<br>Maint/km: ₹${fmt(m.maint_km)}`, e);
    });
    el.addEventListener('mouseleave', hideTip);
  });
  document.getElementById('barLegend').innerHTML = DATA.fuels.map(f=>
    `<div class="item"><div class="sw" style="background:${DATA.colors[f]}"></div>${DATA.short[f]}</div>`).join('');
}
 
/* ---------- DOUGHNUT: CO2/km share ---------- */
function renderDonut(){
  const W=320,H=300,cx=W/2,cy=H/2-8,r=90,rInner=54;
  const total = DATA.fuels.reduce((s,f)=>s+DATA.metrics[f].co2_km,0);
  let angleStart=-90, paths='';
  DATA.fuels.forEach((f,i)=>{
    const v = DATA.metrics[f].co2_km;
    const frac = v/total;
    const angleEnd = angleStart + frac*360;
    const large = (angleEnd-angleStart)>180?1:0;
    const toXY = (ang,rad)=>{
      const rd = ang*Math.PI/180;
      return [cx+rad*Math.cos(rd), cy+rad*Math.sin(rd)];
    };
    const [x1,y1]=toXY(angleStart,r), [x2,y2]=toXY(angleEnd,r);
    const [x3,y3]=toXY(angleEnd,rInner), [x4,y4]=toXY(angleStart,rInner);
    const d = `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${rInner} ${rInner} 0 ${large} 0 ${x4} ${y4} Z`;
    paths += `<path class="seg" data-fuel="${f}" d="${d}" fill="${DATA.colors[f]}" opacity="0.9" stroke="#0a0f1e" stroke-width="2">
      <animate attributeName="opacity" from="0" to="0.9" dur="0.6s" begin="${i*0.08}s" fill="freeze"/>
    </path>`;
    angleStart = angleEnd;
  });
  const svg = `<svg class="chart-svg" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    ${paths}
    <text x="${cx}" y="${cy-2}" text-anchor="middle" font-size="13" fill="#8b93ab">Total</text>
    <text x="${cx}" y="${cy+18}" text-anchor="middle" font-size="17" font-weight="800" fill="#e8ecf6">${fmt(total,3)}</text>
    <text x="${cx}" y="${cy+34}" text-anchor="middle" font-size="10" fill="#8b93ab">kg/km</text>
  </svg>`;
  document.getElementById('donutWrap').innerHTML = svg;
  document.querySelectorAll('#donutWrap .seg').forEach(el=>{
    el.addEventListener('mousemove',(e)=>{
      const f = el.dataset.fuel; const m = DATA.metrics[f];
      const pct = (m.co2_km/total*100).toFixed(1);
      showTip(`<b style="color:${DATA.colors[f]}">${f}</b><br>CO₂/km: ${fmt(m.co2_km,3)} kg (${pct}%)`, e);
    });
    el.addEventListener('mouseleave', hideTip);
  });
  document.getElementById('donutLegend').innerHTML = DATA.fuels.map(f=>
    `<div class="item"><div class="sw" style="background:${DATA.colors[f]}"></div>${DATA.short[f]}: ${fmt(DATA.metrics[f].co2_km,3)}kg</div>`).join('');
}
 
/* ---------- LINE CHART: cost/km vs age ---------- */
function renderLine(){
  const W=1200,H=340,padL=50,padR=30,padT=20,padB=40;
  const maxAge=16;
  const allVals=[];
  DATA.fuels.forEach(f=>{
    const fit=DATA.fits[f];
    allVals.push(fit.b, fit.a*maxAge+fit.b);
  });
  const maxV = Math.max(...allVals)*1.1;
  const xScale = age => padL + (age/maxAge)*(W-padL-padR);
  const yScale = v => (H-padB) - (v/maxV)*(H-padT-padB);
 
  let grid='';
  for(let i=0;i<=4;i++){
    const y = padT + (H-padT-padB)*(1-i/4);
    grid += `<line x1="${padL}" y1="${y}" x2="${W-padR}" y2="${y}" stroke="rgba(255,255,255,0.06)"/>
    <text x="${padL-8}" y="${y+4}" font-size="10" fill="#8b93ab" text-anchor="end">₹${fmt(maxV*i/4,1)}</text>`;
  }
  let xlabels='';
  for(let a=0;a<=maxAge;a+=2){
    xlabels += `<text x="${xScale(a)}" y="${H-padB+18}" font-size="10" fill="#8b93ab" text-anchor="middle">${a}y</text>`;
  }
  let lines='';
  DATA.fuels.forEach((f,fi)=>{
    const fit = DATA.fits[f];
    const pts=[];
    for(let a=0;a<=maxAge;a+=0.5){ pts.push([xScale(a), yScale(fit.a*a+fit.b)]); }
    const d = 'M ' + pts.map(p=>p[0]+' '+p[1]).join(' L ');
    lines += `<path d="${d}" fill="none" stroke="${DATA.colors[f]}" stroke-width="2.5" stroke-linecap="round" opacity="0.95">
      <animate attributeName="stroke-dasharray" from="0,3000" to="3000,0" dur="1.1s" begin="${fi*0.1}s" fill="freeze"/>
    </path>`;
    const endY = yScale(fit.a*maxAge+fit.b);
    lines += `<circle cx="${xScale(maxAge)}" cy="${endY}" r="4" fill="${DATA.colors[f]}"/>`;
    lines += `<circle class="hoverdot" data-fuel="${f}" cx="${xScale(15)}" cy="${yScale(fit.a*15+fit.b)}" r="9" fill="${DATA.colors[f]}" opacity="0.001"/>`;
  });
  const carX = xScale(15);
  const vline = `<line x1="${carX}" y1="${padT}" x2="${carX}" y2="${H-padB}" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="5,4"/>
    <text x="${carX}" y="${padT-6}" font-size="10.5" fill="#f59e0b" text-anchor="middle" font-weight="700">Your car · 15y</text>`;
 
  const svg = `<svg class="chart-svg" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    ${grid}
    <line x1="${padL}" y1="${H-padB}" x2="${W-padR}" y2="${H-padB}" stroke="rgba(255,255,255,0.2)"/>
    ${lines}
    ${vline}
    ${xlabels}
  </svg>`;
  document.getElementById('lineWrap').innerHTML = svg;
  document.querySelectorAll('#lineWrap .hoverdot').forEach(el=>{
    el.addEventListener('mousemove',(e)=>{
      const f = el.dataset.fuel; const fit=DATA.fits[f];
      const val = fit.a*15+fit.b;
      showTip(`<b style="color:${DATA.colors[f]}">${f}</b><br>Est. cost/km @15y: ₹${fmt(val)}`, e);
    });
    el.addEventListener('mouseleave', hideTip);
  });
  document.getElementById('lineLegend').innerHTML = DATA.fuels.map(f=>
    `<div class="item"><div class="sw" style="background:${DATA.colors[f]}"></div>${DATA.short[f]}</div>`).join('');
}
 
/* ---------- AGE BUCKET TABLE ---------- */
function renderBucketTable(){
  const order = ["New (0-2y)","Mid-life (3-5y)","Aged (6-9y)","Old (10+y)"];
  const carBucket = "Old (10+y)"; // 15y
  let rows = order.map(b=>{
    const d = DATA.buckets_overall[b];
    const cur = b===carBucket ? 'class="current"' : '';
    const tag = b===carBucket ? ' ← your A-Star (15y)' : '';
    return `<tr ${cur}><td>${b}${tag}</td><td>₹${fmt(d.cost_km)}</td><td>₹${fmt(d.maint_km)}</td></tr>`;
  }).join('');
  document.getElementById('bucketTable').innerHTML = `
    <tr><th>Age Bucket</th><th>Avg Cost/km</th><th>Avg Maintenance/km</th></tr>
    ${rows}`;
}
 
/* ---------- GAUGE ---------- */
function renderGauge(){
  const W=300,H=180,cx=150,cy=160,r=120;
  const score = DATA.e85.score.total; // out of 10
  const pct = score/10;
  const startAngle=180, endAngle=0;
  const angle = startAngle - pct*180;
  const toXY=(ang,rad)=>{const rd=ang*Math.PI/180; return [cx+rad*Math.cos(rd), cy-rad*Math.sin(rd)];};
  const [sx,sy]=toXY(180,r), [ex,ey]=toXY(0,r);
  const [nx,ny]=toXY(angle,r);
  const arcLen = Math.PI*r;
  const fillLen = arcLen*pct;
 
  const bgArc = `M ${sx} ${sy} A ${r} ${r} 0 1 1 ${ex} ${ey}`;
  const segColors = ['#f87171','#fbbf24','#facc15','#a3e635','#22c55e'];
  let segs='';
  for(let i=0;i<5;i++){
    const a1 = 180 - i*36, a2=180-(i+1)*36;
    const [x1,y1]=toXY(a1,r),[x2,y2]=toXY(a2,r);
    segs += `<path d="M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}" stroke="${segColors[i]}" stroke-width="16" fill="none" opacity="0.28" stroke-linecap="butt"/>`;
  }
  const needleLen = r-14;
  const [ntx,nty] = toXY(180,needleLen);
 
  const svg = `<svg class="chart-svg" viewBox="0 0 ${W} ${H+10}" xmlns="http://www.w3.org/2000/svg">
    ${segs}
    <path d="${bgArc}" stroke="rgba(255,255,255,0.08)" stroke-width="16" fill="none"/>
    <path d="${bgArc}" stroke="#f59e0b" stroke-width="16" fill="none" stroke-linecap="round"
      stroke-dasharray="${arcLen}" stroke-dashoffset="${arcLen}">
      <animate attributeName="stroke-dashoffset" from="${arcLen}" to="${arcLen-fillLen}" dur="1.4s" fill="freeze" calcMode="spline" keySplines="0.2 0.8 0.2 1"/>
    </path>
    <g>
      <line x1="${cx}" y1="${cy}" x2="${ntx}" y2="${nty}" stroke="#e8ecf6" stroke-width="3" stroke-linecap="round">
        <animateTransform attributeName="transform" type="rotate" from="0 ${cx} ${cy}" to="${180-angle} ${cx} ${cy}" dur="1.4s" fill="freeze" calcMode="spline" keySplines="0.2 0.8 0.2 1"/>
      </line>
      <circle cx="${cx}" cy="${cy}" r="7" fill="#e8ecf6"/>
    </g>
    <text x="${cx}" y="${H+2}" text-anchor="middle" font-size="10" fill="#8b93ab">0</text>
  </svg>`;
  document.getElementById('gaugeSvgWrap').innerHTML = svg;
  document.getElementById('gaugeScoreText').innerHTML = `${fmt(score,2)}<span>/10</span>`;
}
 
/* ---------- VERDICT + BREAKDOWN ---------- */
function renderVerdict(){
  const s = DATA.e85.score;
  const co2Red = ((DATA.metrics["Petrol (E20)"].co2_km - DATA.metrics["E85 (Flex-Fuel)"].co2_km)/DATA.metrics["Petrol (E20)"].co2_km*100).toFixed(0);
  document.getElementById('verdictText').innerHTML =
    `E85 cuts CO₂ emissions by <b>${co2Red}%</b> per km versus Petrol (E20), but running cost is <b>+${fmt(DATA.e85.running_penalty,2)}%</b> higher despite an ${fmt(DATA.e85.pump_saving,0)}% cheaper pump price — the mileage drop (12.9 vs 16.3 km/l) eats the discount. Pump price would need to fall to <b>₹${fmt(DATA.e85.break_even)}/L</b> to match Petrol's running cost. Score: <b>${fmt(s.total,2)}/10</b> — strong on emissions, weak on wallet.`;
 
  const rows = [
    {label:'Cost (4pt)', val:s.cost, max:4},
    {label:'CO₂ (3pt)', val:s.co2, max:3},
    {label:'Refuel (2pt)', val:s.refuel, max:2},
    {label:'Maint (1pt)', val:s.maint, max:1}
  ];
  document.getElementById('scoreBreakdown').innerHTML = rows.map(r=>`
    <div class="bd-row">
      <div class="bd-label">${r.label}</div>
      <div class="bd-bar"><div class="bd-fill" data-w="${(r.val/r.max*100)}"></div></div>
      <div class="bd-val">${fmt(r.val,2)}</div>
    </div>`).join('');
  requestAnimationFrame(()=>{
    setTimeout(()=>{
      document.querySelectorAll('.bd-fill').forEach(el=>{ el.style.width = el.dataset.w+'%'; });
    }, 100);
  });
}
 
/* ---------- FUEL CARDS ---------- */
function renderFuelCards(){
  const info = {
    "Petrol (E20)": {
      pros:["Widest refuel network, only ~5 min stop","Balanced maintenance at ₹0.47/km"],
      cons:["Highest pump price tested (₹100/unit)","2nd-highest CO₂/km at 0.171 kg"],
      best:"Everyday mixed city + highway driving where refuel speed matters"
    },
    "E85 (Flex-Fuel)": {
      pros:["Lowest CO₂/km of all fuels: 0.070 kg","Lowest maintenance/km: ₹0.46"],
      cons:["Highest running cost: ₹6.37/km (+3.6% vs Petrol)","Lowest mileage: 12.9 km/L drags cost up"],
      best:"Emission-conscious flex-fuel owners who accept a running-cost premium"
    },
    "Diesel": {
      pros:["Strong mileage: 19.6 km/L","Moderate cost/km: ₹4.67"],
      cons:["Highest maintenance/km: ₹1.00","Highest CO₂/km of all fuels: 0.179 kg"],
      best:"High-distance highway users prioritizing mileage over upkeep"
    },
    "CNG": {
      pros:["Cheapest combustion fuel: ₹3.32/km","Best combustion mileage: 24.1 km/kg"],
      cons:["Slower refuel: 8 min vs 5 for liquid fuels","Bulkier tank, limited fill stations"],
      best:"High-mileage city commuters watching the fuel bill"
    },
    "Electric (EV)": {
      pros:["Lowest cost/km overall: ₹1.75","Low maintenance: ₹0.23/km"],
      cons:["Longest recharge time: 45 min","Lowest range efficiency: 6.9 km/kWh"],
      best:"Short daily commutes with home/office charging access"
    }
  };
  const html = DATA.fuels.map(f=>{
    const d = info[f];
    const isYours = f==="Petrol (E20)";
    return `<div class="glass fuel-card ${isYours?'highlight':''}" style="--fc:${DATA.colors[f]}">
      <div class="fname" style="color:${DATA.colors[f]}">${f}</div>
      <div class="ftag">₹${fmt(DATA.metrics[f].cost_km)}/km · ${fmt(DATA.metrics[f].co2_km,3)}kg CO₂/km</div>
      <ul>
        ${d.pros.map(p=>`<li>✅ ${p}</li>`).join('')}
        ${d.cons.map(c=>`<li>❌ ${c}</li>`).join('')}
      </ul>
      <div class="best">🚗 <b>Best for:</b> ${d.best}</div>
    </div>`;
  }).join('');
  document.getElementById('fuelCards').innerHTML = html;
}
 
/* ---------- MOUSE MOVE FOR TOOLTIP POSITIONING ---------- */
document.addEventListener('mousemove', (e)=>{
  if(tooltip.classList.contains('show')) moveTip(e);
});
 
renderKPIs();
renderBar();
renderDonut();
renderLine();
renderBucketTable();
renderGauge();
renderVerdict();
renderFuelCards();
</script>
</body>
</html>
 
