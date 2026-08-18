<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Supply Chain Builder</title>
<script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<style>
  :root{
    --bg:#0b0f17;
    --panel:#121826;
    --panel2:#161f30;
    --border:#232d42;
    --text:#e8edf7;
    --muted:#8a97ad;
    --accent:#5b8cff;
    --accent2:#7ee8c1;
    --warn:#ffb454;
    --bad:#ff6b6b;
    --good:#54e0a4;
    --shadow: 0 10px 30px rgba(0,0,0,0.35);
  }
  *{box-sizing:border-box;}
  html,body{margin:0;padding:0;}
  body{
    background: radial-gradient(1200px 800px at 10% -10%, #14203a 0%, transparent 60%),
                radial-gradient(1000px 700px at 110% 10%, #1a1430 0%, transparent 55%),
                var(--bg);
    color:var(--text);
    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    min-height:100vh;
  }
  #root{min-height:100vh;}
  .app-shell{
    max-width:1100px;
    margin:0 auto;
    padding:28px 20px 60px;
  }
  .top-bar{
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:24px;
    flex-wrap:wrap;
    gap:12px;
  }
  .brand{
    display:flex;
    align-items:center;
    gap:10px;
    font-weight:700;
    font-size:20px;
    letter-spacing:0.3px;
  }
  .brand .dot{
    width:12px;height:12px;border-radius:50%;
    background:linear-gradient(135deg,var(--accent),var(--accent2));
    box-shadow:0 0 12px var(--accent);
  }
  .card{
    background:linear-gradient(180deg, var(--panel), var(--panel2));
    border:1px solid var(--border);
    border-radius:18px;
    padding:26px;
    box-shadow:var(--shadow);
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  }
  .card:hover{
    border-color:#324164;
  }
  h1{font-size:30px;margin:0 0 10px;}
  h2{font-size:22px;margin:0 0 12px;}
  h3{font-size:17px;margin:0 0 8px;}
  p{color:var(--muted);line-height:1.6;margin:0 0 14px;}
  .lead{color:var(--text);font-size:16px;}
  .btn{
    background:linear-gradient(135deg,var(--accent),#3f6fe0);
    color:white;
    border:none;
    padding:13px 22px;
    border-radius:12px;
    font-size:15px;
    font-weight:600;
    cursor:pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
    box-shadow:0 6px 16px rgba(91,140,255,0.25);
  }
  .btn:hover{
    transform: translateY(-2px);
    filter:brightness(1.08);
    box-shadow:0 10px 22px rgba(91,140,255,0.35);
  }
  .btn:active{transform:translateY(0px);}
  .btn.secondary{
    background:transparent;
    border:1px solid var(--border);
    color:var(--text);
    box-shadow:none;
  }
  .btn.secondary:hover{
    border-color:var(--accent);
    box-shadow:0 0 0 3px rgba(91,140,255,0.12);
  }
  .btn.ghost{
    background:transparent;
    border:1px dashed var(--border);
    color:var(--muted);
    box-shadow:none;
  }
  .option-grid{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(230px,1fr));
    gap:16px;
    margin:18px 0 6px;
  }
  .option-card{
    background:var(--panel2);
    border:1px solid var(--border);
    border-radius:14px;
    padding:18px;
    cursor:pointer;
    transition: all 0.2s ease;
    text-align:left;
  }
  .option-card:hover{
    border-color:var(--accent);
    transform:translateY(-3px);
    box-shadow:0 8px 20px rgba(91,140,255,0.18);
  }
  .option-card.selected{
    border-color:var(--accent2);
    box-shadow:0 0 0 2px rgba(126,232,193,0.35);
  }
  .option-card h4{
    margin:0 0 6px;
    font-size:16px;
  }
  .option-card p{
    font-size:13px;
    margin:0;
  }
  .tag{
    display:inline-block;
    font-size:11px;
    padding:3px 8px;
    border-radius:999px;
    background:rgba(91,140,255,0.12);
    color:var(--accent);
    margin-bottom:8px;
    letter-spacing:0.4px;
    text-transform:uppercase;
  }
  .company-grid{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(160px,1fr));
    gap:14px;
    margin-top:16px;
  }
  .stat-box{
    background:var(--panel2);
    border:1px solid var(--border);
    border-radius:12px;
    padding:14px;
  }
  .stat-box .label{
    font-size:12px;
    color:var(--muted);
    text-transform:uppercase;
    letter-spacing:0.5px;
    margin-bottom:6px;
  }
  .stat-box .value{
    font-size:16px;
    font-weight:600;
  }
  .metrics-panel{
    position:sticky;
    top:16px;
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(150px,1fr));
    gap:12px;
    margin-bottom:24px;
  }
  .metric{
    background:var(--panel2);
    border:1px solid var(--border);
    border-radius:14px;
    padding:14px 16px;
  }
  .metric .top{
    display:flex;
    justify-content:space-between;
    align-items:baseline;
    margin-bottom:8px;
  }
  .metric .name{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px;}
  .metric .num{font-size:15px;font-weight:700;}
  .bar-track{
    height:8px;
    border-radius:999px;
    background:#1c2538;
    overflow:hidden;
  }
  .bar-fill{
    height:100%;
    border-radius:999px;
    transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .explain-box{
    background:rgba(91,140,255,0.06);
    border:1px solid rgba(91,140,255,0.25);
    border-radius:14px;
    padding:16px 18px;
    margin:16px 0;
  }
  .explain-box .icon{
    font-size:18px;
    margin-right:8px;
  }
  .tradeoff-box{
    background:rgba(126,232,193,0.06);
    border:1px solid rgba(126,232,193,0.25);
    border-radius:14px;
    padding:16px 18px;
    margin-top:16px;
    animation: fadeIn 0.4s ease;
  }
  @keyframes fadeIn{
    from{opacity:0; transform:translateY(6px);}
    to{opacity:1; transform:translateY(0);}
  }
  .step-indicator{
    display:flex;
    gap:8px;
    margin-bottom:22px;
    flex-wrap:wrap;
  }
  .step-dot{
    flex:1;
    min-width:60px;
    height:6px;
    border-radius:999px;
    background:#1c2538;
    overflow:hidden;
  }
  .step-dot.active{background:linear-gradient(90deg,var(--accent),var(--accent2));}
  .step-dot.done{background:var(--accent);}
  .footer-nav{
    display:flex;
    justify-content:flex-end;
    gap:12px;
    margin-top:22px;
  }
  .score-ring-wrap{
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    padding:20px 0 10px;
  }
  .score-num{
    font-size:52px;
    font-weight:800;
    background:linear-gradient(135deg,var(--accent2),var(--accent));
    -webkit-background-clip:text;
    background-clip:text;
    color:transparent;
  }
  .score-label{color:var(--muted);font-size:14px;margin-top:4px;}
  .dash-grid{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:18px;
    margin-top:20px;
  }
  @media (max-width:720px){
    .dash-grid{grid-template-columns:1fr;}
  }
  .list-block ul{
    margin:0;
    padding-left:18px;
    color:var(--text);
  }
  .list-block li{
    margin-bottom:8px;
    line-height:1.5;
    font-size:14px;
  }
  .risk-callout{
    background:rgba(255,107,107,0.08);
    border:1px solid rgba(255,107,107,0.3);
    border-radius:14px;
    padding:16px 18px;
    margin-top:18px;
  }
  .improve-block{
    background:rgba(255,180,84,0.08);
    border:1px solid rgba(255,180,84,0.3);
    border-radius:14px;
    padding:16px 18px;
    margin-top:18px;
  }
  .summary-line{
    display:flex;
    justify-content:space-between;
    padding:10px 0;
    border-bottom:1px solid var(--border);
    font-size:14px;
  }
  .summary-line:last-child{border-bottom:none;}
  .badge{
    font-size:11px;
    padding:3px 9px;
    border-radius:999px;
    font-weight:700;
    text-transform:uppercase;
    letter-spacing:0.4px;
  }
  .badge.good{background:rgba(84,224,164,0.15);color:var(--good);}
  .badge.warn{background:rgba(255,180,84,0.15);color:var(--warn);}
  .badge.bad{background:rgba(255,107,107,0.15);color:var(--bad);}
  .scroll-fade{animation: fadeIn 0.5s ease;}
  .subhead{
    color:var(--muted);
    font-size:14px;
    margin-bottom:20px;
  }
  .glow-divider{
    height:1px;
    background:linear-gradient(90deg, transparent, var(--border), transparent);
    margin:22px 0;
  }
</style>
</head>
<body>
<div id="root"></div>
<script type="text/babel">
const { useState, useMemo, useEffect } = React;

/* ============================= DATA ============================= */

const INDUSTRIES = [
  {
    name: "Athletic Footwear",
    products: "running shoes and training sneakers",
    icon: "👟"
  },
  {
    name: "Specialty Coffee",
    products: "roasted coffee beans and ready-to-drink cold brew",
    icon: "☕"
  },
  {
    name: "Consumer Electronics",
    products: "wireless earbuds and smart home devices",
    icon: "🎧"
  },
  {
    name: "Organic Skincare",
    products: "plant-based skincare and cosmetics",
    icon: "🧴"
  },
  {
    name: "Furniture",
    products: "flat-pack home and office furniture",
    icon: "🪑"
  },
  {
    name: "Craft Beverages",
    products: "artisanal sodas and sparkling teas",
    icon: "🥤"
  },
  {
    name: "Outdoor Gear",
    products: "hiking backpacks and camping equipment",
    icon: "🎒"
  },
  {
    name: "Toys & Games",
    products: "educational toys and board games",
    icon: "🧩"
  }
];

const COUNTRY_SETS = [
  ["United States", "Canada", "Mexico"],
  ["Germany", "France", "United Kingdom", "Italy"],
  ["India", "Vietnam", "Indonesia"],
  ["Japan", "South Korea", "Australia"],
  ["Brazil", "Argentina", "Chile"],
  ["United States", "Germany", "Japan", "Australia"],
  ["Nigeria", "Kenya", "South Africa"]
];

const DEMAND_LEVELS = [
  { level: "Low", desc: "steady, predictable demand with few spikes" },
  { level: "Medium", desc: "moderate demand with seasonal ups and downs" },
  { level: "High", desc: "fast-growing demand with frequent surges" }
];

function generateCompany() {
  const industry = INDUSTRIES[Math.floor(Math.random() * INDUSTRIES.length)];
  const countries = COUNTRY_SETS[Math.floor(Math.random() * COUNTRY_SETS.length)];
  const demand = DEMAND_LEVELS[Math.floor(Math.random() * DEMAND_LEVELS.length)];
  const names = ["Nova", "Arclight", "Bluepeak", "Meridian", "Northbridge", "Skyline", "Wavecrest", "Ironvale", "Solace", "Brightwell"];
  const suffix = ["Co.", "Industries", "Goods", "Supply Co.", "& Sons", "Collective", "Group"];
  const companyName = `${names[Math.floor(Math.random()*names.length)]} ${suffix[Math.floor(Math.random()*suffix.length)]}`;
  return {
    companyName,
    industry: industry.name,
    icon: industry.icon,
    products: industry.products,
    countries,
    demand
  };
}

/* ============================= METRIC ENGINE ============================= */

// Base metrics, all start at neutral midpoints.
const BASE_METRICS = {
  cost: 50,        // lower is better (we display as "efficiency" inverse in ring, but keep raw as cost pressure)
  speed: 50,
  risk: 50,         // lower is better
  satisfaction: 50,
  sustainability: 50
};

function clamp(n){ return Math.max(0, Math.min(100, n)); }

function applyDelta(metrics, delta){
  const next = { ...metrics };
  Object.keys(delta).forEach(k => {
    next[k] = clamp(next[k] + delta[k]);
  });
  return next;
}

/* ============================= STEP DEFINITIONS ============================= */

const STEPS = [
  {
    key: "suppliers",
    title: "Supplier Strategy",
    concept: "A supplier is the business that provides the raw materials or components your product is made from. Deciding how many suppliers to use is one of the first and most important choices in a supply chain.",
    why: "This decision shapes how vulnerable your business is to disruptions, and how much control you have over cost and quality.",
    options: [
      {
        id: "single",
        title: "Single Supplier",
        blurb: "Rely on one trusted supplier for all your materials.",
        explain: "Using a single supplier often gets you better pricing and a simpler relationship to manage, since you're buying in bulk from one partner. But if that supplier has a problem — a factory fire, a strike, a shipping delay — your entire production line can stop. It's a classic 'don't put all your eggs in one basket' risk.",
        delta: { cost: -12, speed: 4, risk: 18, satisfaction: 2, sustainability: -2 }
      },
      {
        id: "multiple",
        title: "Multiple Suppliers",
        blurb: "Spread purchasing across several suppliers in different regions.",
        explain: "Working with multiple suppliers protects you if one fails — you can shift orders to another. This resilience comes at a price: you lose bulk-discount leverage, and coordinating quality standards across several partners takes more management effort.",
        delta: { cost: 10, speed: -3, risk: -18, satisfaction: 1, sustainability: 3 }
      }
    ]
  },
  {
    key: "factory",
    title: "Factory Location",
    concept: "The factory is where your raw materials are turned into finished products. Where you place it affects labor cost, shipping distance to customers, and how quickly you can react to local demand.",
    why: "Factory location is often the single biggest lever for cost versus speed in a supply chain.",
    options: [
      {
        id: "domestic",
        title: "Domestic Factory",
        blurb: "Manufacture close to your main customer base.",
        explain: "A domestic factory means shorter shipping distances, so products reach customers faster and with fewer customs delays. Labor and facility costs are usually higher than overseas alternatives, which raises your cost per unit.",
        delta: { cost: 14, speed: 16, risk: -6, satisfaction: 8, sustainability: 6 }
      },
      {
        id: "offshore",
        title: "Offshore Factory",
        blurb: "Manufacture in a lower-cost country and ship internationally.",
        explain: "Offshore manufacturing usually means much lower labor costs, which can dramatically improve your margins. The trade-off is longer transit times, more exposure to customs and geopolitical risk, and a bigger carbon footprint from long-distance freight.",
        delta: { cost: -16, speed: -14, risk: 10, satisfaction: -6, sustainability: -10 }
      },
      {
        id: "nearshore",
        title: "Nearshore Factory",
        blurb: "Manufacture in a neighboring country, balancing cost and distance.",
        explain: "Nearshoring — building near your target market but not inside it — is a popular middle ground. You get lower labor costs than staying domestic, while keeping shipping times shorter than fully offshore production.",
        delta: { cost: 2, speed: 4, risk: -2, satisfaction: 2, sustainability: 2 }
      }
    ]
  },
  {
    key: "warehouse",
    title: "Warehouse Strategy",
    concept: "A warehouse stores finished goods until customers order them. Your warehouse strategy determines how close inventory sits to your customers and how many storage locations you maintain.",
    why: "Warehousing directly trades storage cost against delivery speed — more warehouses means faster shipping but more rent, staff, and management overhead.",
    options: [
      {
        id: "centralized",
        title: "Centralized Warehouse",
        blurb: "One large warehouse serving all regions.",
        explain: "A single central warehouse is cheaper to run because you only manage one facility, one inventory system, and one team. However, it means every order travels farther on average, slowing delivery to distant customers.",
        delta: { cost: -10, speed: -10, risk: 6, satisfaction: -6, sustainability: 2 }
      },
      {
        id: "regional",
        title: "Regional Warehouses",
        blurb: "Several mid-sized warehouses spread across your markets.",
        explain: "Regional warehouses shorten the 'last mile' to customers, boosting delivery speed and satisfaction. Running multiple facilities increases fixed costs and adds complexity in keeping inventory balanced across locations.",
        delta: { cost: 8, speed: 10, risk: -4, satisfaction: 8, sustainability: -2 }
      },
      {
        id: "dropship",
        title: "Drop-Shipping (No Warehouse)",
        blurb: "Skip warehousing — ship directly from factory to customer.",
        explain: "Drop-shipping eliminates warehouse costs almost entirely, which is great for cash flow. But you lose control over packaging, delivery speed becomes unpredictable, and you can't buffer against factory delays.",
        delta: { cost: -14, speed: -6, risk: 12, satisfaction: -4, sustainability: -2 }
      }
    ]
  },
  {
    key: "transport",
    title: "Transportation Method",
    concept: "Transportation is how goods physically move — from supplier to factory, and from warehouse to customer. Each mode has a different balance of speed, cost, and environmental impact.",
    why: "Transportation is usually the most visible cost in a supply chain, and it's the decision customers feel most directly through delivery times.",
    options: [
      {
        id: "road",
        title: "Road Freight",
        blurb: "Trucks for short-to-medium distances.",
        explain: "Road transport is flexible and relatively affordable for regional distribution, with door-to-door delivery. It's slower and less efficient than rail for long distances, and gets stuck in traffic and border delays.",
        delta: { cost: 4, speed: 2, risk: 2, satisfaction: 2, sustainability: -4 }
      },
      {
        id: "rail",
        title: "Rail Freight",
        blurb: "Trains for large volumes over land.",
        explain: "Rail is one of the most cost-efficient and environmentally friendly ways to move large volumes over land. Its downside is limited flexibility — goods still need trucks for final delivery, and rail networks aren't everywhere.",
        delta: { cost: 8, speed: -4, risk: 0, satisfaction: -2, sustainability: 10 }
      },
      {
        id: "sea",
        title: "Sea Freight",
        blurb: "Container ships for international bulk shipping.",
        explain: "Sea freight is by far the cheapest way to move large quantities internationally, which is why most global trade happens this way. It's also the slowest option, often taking weeks, and shipments are exposed to port congestion and weather delays.",
        delta: { cost: 16, speed: -18, risk: 6, satisfaction: -8, sustainability: 4 }
      },
      {
        id: "air",
        title: "Air Freight",
        blurb: "Cargo planes for fast international delivery.",
        explain: "Air freight is by far the fastest option and ideal for urgent or high-value goods. It's also the most expensive method per unit and has the largest carbon footprint of any transport mode.",
        delta: { cost: -18, speed: 18, risk: -2, satisfaction: 8, sustainability: -14 }
      }
    ]
  },
  {
    key: "inventory",
    title: "Inventory Strategy",
    concept: "Inventory strategy is how much stock you keep on hand at any given time — from lean 'just enough' stock to large safety buffers.",
    why: "This is the final lever that determines how well you can absorb demand spikes or supply disruptions, versus how much money sits tied up in unsold stock.",
    options: [
      {
        id: "low",
        title: "Low Inventory (Just-in-Time)",
        blurb: "Keep minimal stock, restock frequently.",
        explain: "Just-in-time inventory frees up cash and reduces storage costs since you're not paying to store goods you haven't sold yet. The risk is that any hiccup in your supply chain — a late shipment, a demand spike — can quickly lead to stockouts.",
        delta: { cost: 12, speed: -2, risk: 12, satisfaction: -4, sustainability: 4 }
      },
      {
        id: "balanced",
        title: "Balanced Inventory",
        blurb: "Moderate safety stock aligned to average demand.",
        explain: "A balanced approach keeps a reasonable buffer without overcommitting cash to storage. It's a sensible default for most businesses, though it won't be optimal for edge cases like sudden demand surges or long supplier delays.",
        delta: { cost: 0, speed: 4, risk: -4, satisfaction: 4, sustainability: 0 }
      },
      {
        id: "high",
        title: "High Inventory (Safety Stock)",
        blurb: "Keep large buffer stock to guard against disruption.",
        explain: "High inventory levels make you very resilient to supply shocks and demand spikes — you almost never run out of stock. The cost is significant: more warehouse space, more capital tied up in unsold goods, and higher risk of waste or obsolescence.",
        delta: { cost: -10, speed: 8, risk: -14, satisfaction: 6, sustainability: -6 }
      }
    ]
  }
];

/* ============================= SMALL COMPONENTS ============================= */

function Bar({ label, value, invert }) {
  // invert = true means lower raw value is actually "better" visually (cost pressure, risk)
  const display = invert ? 100 - value : value;
  let color = "#5b8cff";
  if (display >= 70) color = "#54e0a4";
  else if (display >= 40) color = "#ffb454";
  else color = "#ff6b6b";

  return (
    <div className="metric">
      <div className="top">
        <span className="name">{label}</span>
        <span className="num">{Math.round(display)}</span>
      </div>
      <div className="bar-track">
        <div className="bar-fill" style={{ width: display + "%", background: color }}></div>
      </div>
    </div>
  );
}

function MetricsPanel({ metrics }) {
  return (
    <div className="metrics-panel">
      <Bar label="Cost Efficiency" value={metrics.cost} />
      <Bar label="Delivery Speed" value={metrics.speed} />
      <Bar label="Risk Control" value={metrics.risk} invert={true} />
      <Bar label="Satisfaction" value={metrics.satisfaction} />
      <Bar label="Sustainability" value={metrics.sustainability} />
    </div>
  );
}

function StepIndicator({ steps, currentIndex }) {
  return (
    <div className="step-indicator">
      {steps.map((s, i) => (
        <div
          key={s.key}
          className={"step-dot " + (i < currentIndex ? "done" : i === currentIndex ? "active" : "")}
          title={s.title}
        ></div>
      ))}
    </div>
  );
}

/* ============================= SCREENS ============================= */

function WelcomeScreen({ onStart }) {
  return (
    <div className="card scroll-fade">
      <span className="tag">Learn by Doing</span>
      <h1>Welcome to Supply Chain Builder</h1>
      <p className="lead">
        A supply chain is the entire journey a product takes before it reaches a customer — from raw
        materials, to a supplier, to a factory, to a warehouse, and finally onto a truck, ship, or
        plane headed to someone's door. Every step along that journey costs money, takes time, and
        carries some risk.
      </p>
      <p>
        In this simulation, you'll run a randomly generated company and make five real supply chain
        decisions: how many suppliers to use, where to build your factory, how to warehouse your
        goods, how to ship them, and how much inventory to keep on hand. Before every choice, we'll
        explain exactly what the concept means and why it matters — no prior business knowledge
        required.
      </p>
      <p>
        As you make decisions, you'll watch five live business metrics shift in real time: <strong>Cost
        Efficiency</strong>, <strong>Delivery Speed</strong>, <strong>Risk Control</strong>,{" "}
        <strong>Customer Satisfaction</strong>, and <strong>Sustainability</strong>. There's no single
        "correct" path — every choice is a trade-off, just like in the real world. At the end, you'll
        get a full dashboard scoring your supply chain and suggesting how to improve it.
      </p>
      <button className="btn" onClick={onStart}>Generate My Company →</button>
    </div>
  );
}

function CompanyScreen({ company, onContinue }) {
  return (
    <div className="card scroll-fade">
      <span className="tag">Your Company</span>
      <h1>{company.icon} {company.companyName}</h1>
      <p className="lead">
        You've just been placed in charge of supply chain strategy for {company.companyName}, a
        company in the <strong>{company.industry}</strong> industry that makes {company.products}.
      </p>
      <div className="explain-box">
        <p style={{margin:0, color:"var(--text)"}}>
          <span className="icon">💡</span>
          <strong>What is "demand level"?</strong> It describes how much customers want your product,
          and how predictable that demand is. Higher demand generally means more revenue potential, but
          it also means more pressure on your supply chain to keep up without running out of stock.
        </p>
      </div>
      <div className="company-grid">
        <div className="stat-box">
          <div className="label">Industry</div>
          <div className="value">{company.industry}</div>
        </div>
        <div className="stat-box">
          <div className="label">Products</div>
          <div className="value" style={{textTransform:"capitalize"}}>{company.products}</div>
        </div>
        <div className="stat-box">
          <div className="label">Countries Served</div>
          <div className="value">{company.countries.join(", ")}</div>
        </div>
        <div className="stat-box">
          <div className="label">Demand Level</div>
          <div className="value">{company.demand.level} — {company.demand.desc}</div>
        </div>
      </div>
      <div className="footer-nav">
        <button className="btn" onClick={onContinue}>Start Building the Supply Chain →</button>
      </div>
    </div>
  );
}

function DecisionScreen({ step, stepIndex, totalSteps, metrics, onChoose, selectedId, onNext, choiceMade }) {
  return (
    <div>
      <MetricsPanel metrics={metrics} />
      <div className="card scroll-fade">
        <StepIndicator steps={STEPS} currentIndex={stepIndex} />
        <span className="tag">Decision {stepIndex + 1} of {totalSteps}</span>
        <h2>{step.title}</h2>
        <div className="explain-box">
          <p style={{margin:"0 0 8px", color:"var(--text)"}}>
            <span className="icon">📦</span><strong>What is this?</strong> {step.concept}
          </p>
          <p style={{margin:0}}>
            <span className="icon">🎯</span><strong>Why it matters:</strong> {step.why}
          </p>
        </div>

        <div className="option-grid">
          {step.options.map(opt => (
            <div
              key={opt.id}
              className={"option-card" + (selectedId === opt.id ? " selected" : "")}
              onClick={() => onChoose(step, opt)}
            >
              <h4>{opt.title}</h4>
              <p>{opt.blurb}</p>
            </div>
          ))}
        </div>

        {choiceMade && (
          <div className="tradeoff-box">
            <p style={{margin:0, color:"var(--text)"}}>
              <span className="icon">⚖️</span><strong>Trade-off explained:</strong> {choiceMade.explain}
            </p>
          </div>
        )}

        <div className="footer-nav">
          <button className="btn" disabled={!choiceMade} style={!choiceMade ? {opacity:0.4, cursor:"not-allowed"} : {}} onClick={onNext}>
            {stepIndex === totalSteps - 1 ? "See Final Dashboard →" : "Next Decision →"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================= SCORING LOGIC ============================= */

function computeScore(metrics){
  // cost & risk are stored raw where higher cost value = better efficiency already (we baked sign into deltas)
  // risk: lower raw = better, so we invert for scoring
  const costScore = metrics.cost;
  const speedScore = metrics.speed;
  const riskScore = 100 - metrics.risk;
  const satisfactionScore = metrics.satisfaction;
  const sustainabilityScore = metrics.sustainability;
  const overall = (costScore + speedScore + riskScore + satisfactionScore + sustainabilityScore) / 5;
  return {
    overall: Math.round(clamp(overall)),
    breakdown: {
      "Cost Efficiency": Math.round(clamp(costScore)),
      "Delivery Speed": Math.round(clamp(speedScore)),
      "Risk Control": Math.round(clamp(riskScore)),
      "Customer Satisfaction": Math.round(clamp(satisfactionScore)),
      "Sustainability": Math.round(clamp(sustainabilityScore))
    }
  };
}

function getStrengthsWeaknesses(breakdown){
  const entries = Object.entries(breakdown);
  const sorted = [...entries].sort((a,b) => b[1] - a[1]);
  const strengths = sorted.filter(e => e[1] >= 60).slice(0,3);
  const weaknesses = sorted.filter(e => e[1] < 55).sort((a,b)=>a[1]-b[1]).slice(0,3);
  return { strengths, weaknesses };
}

function getBiggestRisk(breakdown, choices){
  const sorted = Object.entries(breakdown).sort((a,b)=>a[1]-b[1]);
  const worst = sorted[0];
  const riskMap = {
    "Cost Efficiency": "Your operating costs are high relative to the rest of your supply chain. If margins tighten or raw material prices rise, profitability could suffer quickly.",
    "Delivery Speed": "Deliveries are slower than they should be. Customers increasingly expect fast shipping, and competitors with quicker fulfillment could win business away from you.",
    "Risk Control": "Your supply chain has significant exposure to disruption — a single failure point (like one supplier or one warehouse) could halt operations with little warning.",
    "Customer Satisfaction": "Customer experience is suffering, likely due to slow delivery or unreliable stock levels. This can lead to churn and negative reviews over time.",
    "Sustainability": "Your supply chain has a heavy environmental footprint. This can create regulatory risk and may alienate increasingly eco-conscious customers."
  };
  return { area: worst[0], score: worst[1], description: riskMap[worst[0]] };
}

function getImprovements(choices, breakdown){
  const tips = [];
  const suppliers = choices.suppliers;
  const factory = choices.factory;
  const warehouse = choices.warehouse;
  const transport = choices.transport;
  const inventory = choices.inventory;

  if (suppliers === "single") {
    tips.push("Add a second supplier in a different region as a backup. This reduces the risk of a single disruption halting production, at a modest cost increase.");
  }
  if (factory === "offshore") {
    tips.push("Consider shifting a portion of production to a nearshore facility to cut delivery times and reduce exposure to long international shipping routes.");
  }
  if (warehouse === "centralized") {
    tips.push("Open a second regional warehouse closer to your largest customer base to shorten last-mile delivery times and boost satisfaction.");
  }
  if (transport === "sea") {
    tips.push("Reserve air freight for your highest-priority or time-sensitive orders, while keeping sea freight for bulk restocking — a hybrid approach balances cost and speed.");
  }
  if (transport === "air") {
    tips.push("Shift routine, non-urgent restocking to sea or rail freight to significantly cut costs and emissions, reserving air freight only for urgent orders.");
  }
  if (inventory === "low") {
    tips.push("Increase safety stock slightly for your best-selling products to reduce the risk of stockouts during demand spikes.");
  }
  if (inventory === "high") {
    tips.push("Trim excess safety stock on slower-moving products to free up cash and reduce storage costs, while keeping buffers on your top sellers.");
  }
  if (warehouse === "dropship") {
    tips.push("Introduce a small regional warehouse for your best-selling items to gain more control over packaging quality and delivery consistency.");
  }
  if (suppliers === "multiple" && tips.length < 3) {
    tips.push("Standardize quality requirements across all suppliers with a shared checklist to reduce inconsistency as you scale.");
  }

  // Fallback generic tips if not enough generated
  const fallback = [
    "Set up real-time tracking across suppliers, factories, and warehouses so disruptions can be spotted and addressed early.",
    "Negotiate flexible contracts with logistics partners so you can scale transportation up or down as demand shifts.",
    "Regularly review your supply chain metrics as a team, since trade-offs that make sense today may not make sense as the company grows."
  ];
  while (tips.length < 3) {
    const next = fallback[tips.length % fallback.length];
    if (!tips.includes(next)) tips.push(next);
    else break;
  }

  return tips.slice(0,3);
}

function DashboardScreen({ company, metrics, choices, onReplay }) {
  const { overall, breakdown } = useMemo(() => computeScore(metrics), [metrics]);
  const { strengths, weaknesses } = useMemo(() => getStrengthsWeaknesses(breakdown), [breakdown]);
  const risk = useMemo(() => getBiggestRisk(breakdown, choices), [breakdown, choices]);
  const improvements = useMemo(() => getImprovements(choices, breakdown), [choices, breakdown]);

  const [animatedScore, setAnimatedScore] = useState(0);
  useEffect(() => {
    let start = null;
    const duration = 900;
    function step(ts){
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setAnimatedScore(Math.round(progress * overall));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [overall]);

  let scoreVerdict = "Needs Improvement";
  let verdictColor = "var(--bad)";
  if (overall >= 75) { scoreVerdict = "Excellent Supply Chain"; verdictColor = "var(--good)"; }
  else if (overall >= 55) { scoreVerdict = "Solid, With Room to Grow"; verdictColor = "var(--warn)"; }

  return (
    <div className="scroll-fade">
      <div className="card">
        <span className="tag">Final Results</span>
        <h1>{company.icon} {company.companyName} — Supply Chain Report</h1>
        <p className="subhead">Here's how your five decisions shaped the overall performance of your supply chain.</p>

        <div className="score-ring-wrap">
          <div className="score-num">{animatedScore}</div>
          <div className="score-label">Overall Supply Chain Score / 100</div>
          <div className="badge" style={{marginTop:10, background:"transparent", border:`1px solid ${verdictColor}`, color:verdictColor}}>
            {scoreVerdict}
          </div>
        </div>

        <div className="glow-divider"></div>

        <h3>Metric Breakdown</h3>
        <div className="metrics-panel" style={{position:"static", marginTop:8}}>
          <Bar label="Cost Efficiency" value={metrics.cost} />
          <Bar label="Delivery Speed" value={metrics.speed} />
          <Bar label="Risk Control" value={metrics.risk} invert={true} />
          <Bar label="Satisfaction" value={metrics.satisfaction} />
          <Bar label="Sustainability" value={metrics.sustainability} />
        </div>

        <div className="dash-grid">
          <div className="card" style={{padding:20}}>
            <h3>💪 Strengths</h3>
            {strengths.length === 0 ? (
              <p>No standout strengths yet — every area has room to grow. Check the improvements below.</p>
            ) : (
              <div className="list-block">
                <ul>
                  {strengths.map(([name, score]) => (
                    <li key={name}><strong>{name}</strong> scored {score}/100 — this is a genuine competitive advantage for your business.</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="card" style={{padding:20}}>
            <h3>⚠️ Weaknesses</h3>
            {weaknesses.length === 0 ? (
              <p>No major weaknesses detected — your supply chain is well balanced across the board.</p>
            ) : (
              <div className="list-block">
                <ul>
                  {weaknesses.map(([name, score]) => (
                    <li key={name}><strong>{name}</strong> scored only {score}/100 — this is dragging down your overall performance.</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="risk-callout">
          <h3 style={{marginTop:0}}>🚨 Biggest Risk: {risk.area} ({risk.score}/100)</h3>
          <p style={{marginBottom:0}}>{risk.description}</p>
        </div>

        <div className="improve-block">
          <h3 style={{marginTop:0}}>🛠️ Three Practical Improvements</h3>
          <div className="list-block">
            <ul>
              {improvements.map((tip, i) => <li key={i}>{tip}</li>)}
            </ul>
          </div>
        </div>

        <div className="glow-divider"></div>

        <h3>Your Decisions Summary</h3>
        <div className="summary-line">
          <span>Suppliers</span>
          <span>{STEPS[0].options.find(o=>o.id===choices.suppliers)?.title}</span>
        </div>
        <div className="summary-line">
          <span>Factory Location</span>
          <span>{STEPS[1].options.find(o=>o.id===choices.factory)?.title}</span>
        </div>
        <div className="summary-line">
          <span>Warehouse Strategy</span>
          <span>{STEPS[2].options.find(o=>o.id===choices.warehouse)?.title}</span>
        </div>
        <div className="summary-line">
          <span>Transportation</span>
          <span>{STEPS[3].options.find(o=>o.id===choices.transport)?.title}</span>
        </div>
        <div className="summary-line">
          <span>Inventory Strategy</span>
          <span>{STEPS[4].options.find(o=>o.id===choices.inventory)?.title}</span>
        </div>

        <div className="footer-nav">
          <button className="btn secondary" onClick={onReplay}>↺ Replay With a New Company</button>
        </div>
      </div>
    </div>
  );
}

/* ============================= APP ROOT ============================= */

function App() {
  const [screen, setScreen] = useState("welcome"); // welcome | company | decisions | dashboard
  const [company, setCompany] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [metrics, setMetrics] = useState(BASE_METRICS);
  const [choices, setChoices] = useState({});
  const [selectedByStep, setSelectedByStep] = useState({});
  const [activeChoiceExplain, setActiveChoiceExplain] = useState(null);

  function startGame(){
    setCompany(generateCompany());
    setScreen("company");
  }

  function beginDecisions(){
    setScreen("decisions");
  }

  function handleChoose(step, option){
    // if switching selection on this step, recompute metrics from scratch based on all choices up to here
    const newSelected = { ...selectedByStep, [step.key]: option.id };
    setSelectedByStep(newSelected);
    setActiveChoiceExplain(option);

    // recompute metrics fresh from BASE up through current step index using newSelected
    let m = { ...BASE_METRICS };
    STEPS.forEach((s, idx) => {
      if (idx > stepIndex) return;
      const chosenId = newSelected[s.key];
      if (!chosenId) return;
      const opt = s.options.find(o => o.id === chosenId);
      if (opt) m = applyDelta(m, opt.delta);
    });
    setMetrics(m);

    setChoices(prev => ({ ...prev, [step.key]: option.id }));
  }

  function handleNext(){
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
      setActiveChoiceExplain(null);
    } else {
      setScreen("dashboard");
    }
  }

  function handleReplay(){
    setCompany(generateCompany());
    setStepIndex(0);
    setMetrics(BASE_METRICS);
    setChoices({});
    setSelectedByStep({});
    setActiveChoiceExplain(null);
    setScreen("company");
  }

  const currentStep = STEPS[stepIndex];
  const currentSelectedId = selectedByStep[currentStep?.key];
  const currentExplain = currentSelectedId
    ? currentStep.options.find(o => o.id === currentSelectedId)
    : null;

  return (
    <div className="app-shell">
      <div className="top-bar">
        <div className="brand">
          <span className="dot"></span>
          Supply Chain Builder
        </div>
        {company && screen !== "welcome" && (
          <div style={{color:"var(--muted)", fontSize:13}}>
            {company.icon} {company.companyName}
          </div>
        )}
      </div>

      {screen === "welcome" && <WelcomeScreen onStart={startGame} />}

      {screen === "company" && company && (
        <CompanyScreen company={company} onContinue={beginDecisions} />
      )}

      {screen === "decisions" && company && currentStep && (
        <DecisionScreen
          step={currentStep}
          stepIndex={stepIndex}
          totalSteps={STEPS.length}
          metrics={metrics}
          onChoose={handleChoose}
          selectedId={currentSelectedId}
          choiceMade={currentExplain}
          onNext={handleNext}
        />
      )}

      {screen === "dashboard" && company && (
        <DashboardScreen
          company={company}
          metrics={metrics}
          choices={choices}
          onReplay={handleReplay}
        />
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
</script>
</body>
</html>
