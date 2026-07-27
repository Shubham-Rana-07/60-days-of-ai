

// ─────────────────────────────
// DATA
// ─────────────────────────────
const cityData = {
  Kanpur:    { state:'Uttar Pradesh', aqi:80,  pm25:27,  pm10:35,  no2:18,  wqi:32, wTDS:524, category:'Moderate',    envScore:38, airScore:45, waterScore:32, grade:{air:'C+',water:'D',hair:'High',skin:'High'} },
  Delhi:     { state:'Delhi NCR',     aqi:154, pm25:58,  pm10:92,  no2:42,  wqi:52, wTDS:380, category:'Unhealthy',   envScore:18, airScore:15, waterScore:28, grade:{air:'F',water:'D+',hair:'Moderate',skin:'High'} },
  Mumbai:    { state:'Maharashtra',   aqi:39,  pm25:13,  pm10:28,  no2:22,  wqi:64, wTDS:185, category:'Good',        envScore:66, airScore:72, waterScore:64, grade:{air:'B',water:'C+',hair:'Low',skin:'Moderate'} },
  Kolkata:   { state:'West Bengal',   aqi:103, pm25:38,  pm10:62,  no2:28,  wqi:48, wTDS:290, category:'Unhealthy+',  envScore:34, airScore:32, waterScore:42, grade:{air:'D+',water:'D+',hair:'Moderate',skin:'Moderate'} },
  Bangalore: { state:'Karnataka',     aqi:32,  pm25:10,  pm10:18,  no2:14,  wqi:72, wTDS:158, category:'Good',        envScore:84, airScore:88, waterScore:72, grade:{air:'A',water:'B',hair:'Low',skin:'Low'} },
  Chennai:   { state:'Tamil Nadu',    aqi:56,  pm25:19,  pm10:34,  no2:16,  wqi:60, wTDS:210, category:'Moderate',    envScore:62, airScore:65, waterScore:60, grade:{air:'B-',water:'C+',hair:'Low',skin:'Low'} },
  Hyderabad: { state:'Telangana',     aqi:35,  pm25:11,  pm10:22,  no2:12,  wqi:68, wTDS:175, category:'Good',        envScore:78, airScore:82, waterScore:68, grade:{air:'A-',water:'B-',hair:'Low',skin:'Low'} },
  Ahmedabad: { state:'Gujarat',       aqi:90,  pm25:32,  pm10:54,  no2:24,  wqi:44, wTDS:340, category:'Moderate',    envScore:42, airScore:38, waterScore:48, grade:{air:'C',water:'D',hair:'Moderate',skin:'Moderate'} },
  Pune:      { state:'Maharashtra',   aqi:23,  pm25:8,   pm10:15,  no2:10,  wqi:74, wTDS:145, category:'Good',        envScore:80, airScore:85, waterScore:74, grade:{air:'A',water:'B',hair:'Low',skin:'Low'} },
  Lucknow:   { state:'Uttar Pradesh', aqi:95,  pm25:34,  pm10:58,  no2:20,  wqi:38, wTDS:460, category:'Moderate+',   envScore:36, airScore:40, waterScore:34, grade:{air:'C',water:'D-',hair:'High',skin:'High'} },
};

const cities = Object.keys(cityData);
let selectedCity = 'Kanpur';
let compareMode = false;

// ─────────────────────────────
// AQI COLOR HELPERS
// ─────────────────────────────
function aqiColor(aqi) {
  if (aqi <= 50)  return '#22c55e';
  if (aqi <= 100) return '#84cc16';
  if (aqi <= 150) return '#f59e0b';
  if (aqi <= 200) return '#f97316';
  if (aqi <= 300) return '#ef4444';
  return '#7c2d12';
}

function aqiCategory(aqi) {
  if (aqi <= 50)  return 'Good';
  if (aqi <= 100) return 'Satisfactory';
  if (aqi <= 150) return 'Moderate';
  if (aqi <= 200) return 'Poor';
  if (aqi <= 300) return 'Very Poor';
  return 'Severe';
}

function scoreColor(s) {
  if (s >= 75) return '#22c55e';
  if (s >= 55) return '#84cc16';
  if (s >= 40) return '#f59e0b';
  if (s >= 25) return '#f97316';
  return '#ef4444';
}

function gradeColor(g) {
  if (g.startsWith('A')) return '#22c55e';
  if (g.startsWith('B')) return '#84cc16';
  if (g.startsWith('C')) return '#f59e0b';
  if (g.startsWith('D')) return '#f97316';
  return '#ef4444';
}

// ─────────────────────────────
// CITY CARDS
// ─────────────────────────────
function renderCityCards() {
  const grid = document.getElementById('cityCardsGrid');
  const riskFilter = document.getElementById('riskFilter').value;
  const maxAqi = parseInt(document.getElementById('aqiRange').value);

  grid.innerHTML = '';

  cities.forEach(name => {
    const d = cityData[name];
    if (d.aqi > maxAqi) return;

    const cat = aqiCategory(d.aqi);
    if (riskFilter === 'good' && d.aqi > 100) return;
    if (riskFilter === 'moderate' && (d.aqi <= 100 || d.aqi > 150)) return;
    if (riskFilter === 'poor' && (d.aqi <= 150 || d.aqi > 200)) return;
    if (riskFilter === 'severe' && d.aqi <= 200) return;

    const col = aqiColor(d.aqi);
    const sc = scoreColor(d.envScore);
    const isSelected = name === selectedCity;

    const card = document.createElement('div');
    card.className = 'city-card' + (isSelected ? ' selected' : '');
    card.onclick = () => selectCity(name);
    card.innerHTML = `
      <div class="city-card-header">
        <div>
          <div class="city-name">${name === selectedCity ? '📍 ' : ''}${name}</div>
          <div class="city-state">${d.state}</div>
        </div>
        <div class="aqi-badge" style="background:${col}22; color:${col}; border:1px solid ${col}44">${d.aqi}<br><span style="font-size:9px;font-weight:600;opacity:0.8">${cat}</span></div>
      </div>
      <div class="city-stats">
        <div class="stat-item"><div class="stat-val" style="color:${col}">${d.aqi}</div><div class="stat-label">AQI</div></div>
        <div class="stat-item"><div class="stat-val" style="color:#818cf8">${d.pm25}</div><div class="stat-label">PM2.5</div></div>
        <div class="stat-item"><div class="stat-val" style="color:#14b8a6">${d.pm10}</div><div class="stat-label">PM10</div></div>
      </div>
      <div class="city-health-bar"><div class="city-health-fill" style="width:${d.envScore}%; background:${sc}"></div></div>
      <div class="city-scores">
        <div class="score-chip"><div class="score-chip-val" style="color:${sc}">${d.envScore}</div><div class="score-chip-label">Env Score</div></div>
        <div class="score-chip"><div class="score-chip-val" style="color:#818cf8">${d.airScore}</div><div class="score-chip-label">Air</div></div>
        <div class="score-chip"><div class="score-chip-val" style="color:#14b8a6">${d.waterScore}</div><div class="score-chip-label">Water</div></div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ─────────────────────────────
// HEALTH IMPACT DATA
// ─────────────────────────────
function getAirImpacts(aqi) {
  const hi = aqi > 150, mid = aqi > 100, lo = aqi > 50;
  return [
    { icon:'🫁', label:'Lung Health', desc: hi ? 'Significant airway inflammation. Chronic exposure raises risk of COPD and asthma exacerbation.' : mid ? 'Mild bronchial irritation possible during prolonged exposure.' : 'Low immediate risk. Long-term exposure still warrants monitoring.', risk: hi ? 'high' : mid ? 'moderate' : 'low' },
    { icon:'😴', label:'Sleep Quality', desc: hi ? 'PM2.5 disrupts sleep patterns, increases overnight breathing resistance and snoring.' : mid ? 'Some sleep disruption possible in sensitive individuals.' : 'Minimal sleep impact at this AQI level.', risk: hi ? 'high' : mid ? 'moderate' : 'low' },
    { icon:'⚡', label:'Energy Levels', desc: hi ? 'Oxidative stress from pollutants causes fatigue, brain fog, and reduced cognitive clarity.' : mid ? 'Slight energy dip possible on prolonged outdoor exposure.' : 'No significant energy impact.', risk: hi ? 'high' : mid ? 'moderate' : 'low' },
    { icon:'🏋️', label:'Exercise Performance', desc: hi ? 'Avoid strenuous outdoor exercise. Lung efficiency drops by 15–20% in polluted air.' : mid ? 'Limit high-intensity outdoor workouts over 45 minutes.' : 'Light to moderate outdoor exercise is safe.', risk: hi ? 'high' : mid ? 'moderate' : 'low' },
    { icon:'🧬', label:'Long-term Health', desc: hi ? 'Elevated cardiovascular disease, lung cancer risk with years of daily exposure above 150 AQI.' : mid ? 'Moderate long-term risk; consistent masking and filtration advised.' : 'Long-term risk is lower but not zero.', risk: hi ? 'high' : 'moderate' },
  ];
}

function getWaterImpacts(city) {
  const d = cityData[city];
  const tds = d.wTDS;
  const whi = tds > 400, wmid = tds > 250;
  return [
    { icon:'💇', label:'Hair Fall', desc: whi ? `High mineral content (TDS ~${tds} mg/L) deposits calcium on scalp, weakens follicles, increases shedding.` : wmid ? 'Moderate hardness may increase breakage over time.' : 'Water quality supports healthy hair growth.', risk: whi ? 'high' : wmid ? 'moderate' : 'low' },
    { icon:'🌵', label:'Hair Dryness', desc: whi ? 'Hard water strips natural oils from hair cuticle, leaving it brittle, dull, and prone to frizz.' : wmid ? 'Some dryness likely without conditioning.' : 'Hair moisture retention is generally unaffected.', risk: whi ? 'high' : wmid ? 'moderate' : 'low' },
    { icon:'🦠', label:'Scalp Health', desc: whi ? 'Mineral buildup clogs scalp pores, promoting dandruff and seborrheic dermatitis flare-ups.' : wmid ? 'Mild scalp irritation possible in sensitive individuals.' : 'Scalp health largely unaffected by water quality.', risk: whi ? 'moderate' : 'low' },
    { icon:'💧', label:'Skin Dryness', desc: whi ? `Hard water (TDS ${tds} mg/L) leaves mineral film on skin, disrupting the moisture barrier.` : wmid ? 'Post-wash tightness and mild dryness common.' : 'Skin hydration minimally impacted.', risk: whi ? 'high' : wmid ? 'moderate' : 'low' },
    { icon:'😤', label:'Acne & Breakouts', desc: (city === 'Kanpur' || tds > 450) ? 'Industrial contamination risk + mineral deposits can trigger inflammatory acne, especially on jawline & back.' : whi ? 'Hard water may aggravate acne-prone skin.' : 'Water quality unlikely to trigger breakouts.', risk: (city === 'Kanpur' || city === 'Lucknow') ? 'high' : wmid ? 'moderate' : 'low' },
    { icon:'🌸', label:'Sensitive Skin', desc: (city === 'Kanpur') ? '⚠️ Chromium contamination risk from groundwater — use only certified RO-purified water for skin rinsing.' : whi ? 'Hard water irritates sensitive skin conditions like rosacea and eczema.' : 'Sensitive skin generally safe with normal precautions.', risk: (city === 'Kanpur' || city === 'Lucknow') ? 'high' : wmid ? 'moderate' : 'low' },
  ];
}

// ─────────────────────────────
// DETAIL PANEL
// ─────────────────────────────
function updateDetailPanel(city) {
  const d = cityData[city];
  const col = aqiColor(d.aqi);

  document.getElementById('detailCityName').textContent = `📍 ${city}, ${d.state}`;
  document.getElementById('detailCityMeta').textContent = `AQI ${d.aqi} · ${aqiCategory(d.aqi)} · Environmental Health Score: ${d.envScore}/100`;

  const badge = document.getElementById('detailAqiBadge');
  badge.textContent = d.aqi;
  badge.style.background = col + '22';
  badge.style.color = col;
  badge.style.border = `1px solid ${col}44`;

  // Air impacts
  const airList = document.getElementById('airImpactList');
  airList.innerHTML = '';
  getAirImpacts(d.aqi).forEach(item => {
    airList.innerHTML += `
      <div class="impact-item">
        <div class="impact-icon">${item.icon}</div>
        <div class="impact-text">
          <div class="impact-label">${item.label}</div>
          <div class="impact-desc">${item.desc}</div>
        </div>
        <div class="risk-indicator risk-${item.risk}">${item.risk === 'high' ? '🔴 High' : item.risk === 'moderate' ? '🟡 Moderate' : '🟢 Low'}</div>
      </div>`;
  });

  // Water impacts
  const waterList = document.getElementById('waterImpactList');
  waterList.innerHTML = '';
  getWaterImpacts(city).forEach(item => {
    waterList.innerHTML += `
      <div class="impact-item">
        <div class="impact-icon">${item.icon}</div>
        <div class="impact-text">
          <div class="impact-label">${item.label}</div>
          <div class="impact-desc">${item.desc}</div>
        </div>
        <div class="risk-indicator risk-${item.risk}">${item.risk === 'high' ? '🔴 High' : item.risk === 'moderate' ? '🟡 Moderate' : '🟢 Low'}</div>
      </div>`;
  });
}

// ─────────────────────────────
// REPORT CARD
// ─────────────────────────────
function updateReportCard(city) {
  const d = cityData[city];
  const sc = scoreColor(d.envScore);

  document.getElementById('reportCardTitle').textContent = `📍 ${city} Report Card`;

  // Ring animation
  const circ = 2 * Math.PI * 66;
  const offset = circ * (1 - d.envScore / 100);
  setTimeout(() => {
    document.getElementById('scoreRingFill').style.strokeDashoffset = offset;
  }, 300);
  document.getElementById('scoreRingNum').textContent = d.envScore;

  // Overall grade
  let overallGrade = 'F';
  if (d.envScore >= 90) overallGrade = 'A+';
  else if (d.envScore >= 80) overallGrade = 'A';
  else if (d.envScore >= 70) overallGrade = 'B+';
  else if (d.envScore >= 60) overallGrade = 'B';
  else if (d.envScore >= 50) overallGrade = 'C+';
  else if (d.envScore >= 40) overallGrade = 'C';
  else if (d.envScore >= 30) overallGrade = 'D+';
  else if (d.envScore >= 20) overallGrade = 'D';
  document.getElementById('scoreRingGrade').textContent = `Grade: ${overallGrade}`;
  document.getElementById('scoreRingGrade').setAttribute('fill', sc);

  // Grade cards
  const grades = [
    { label:'Air Quality', val: d.grade.air },
    { label:'Water Quality', val: d.grade.water },
    { label:'Hair Risk', val: d.grade.hair },
    { label:'Skin Risk', val: d.grade.skin },
  ];
  document.getElementById('gradeCards').innerHTML = grades.map(g => `
    <div class="grade-card">
      <div class="grade-letter" style="color:${gradeColor(g.val)}">${g.val}</div>
      <div class="grade-cat">${g.label}</div>
    </div>`).join('');

  // Score breakdown
  const bars = [
    { label:'Air Quality Score', val: d.airScore, color:'#818cf8' },
    { label:'Water Quality Score', val: d.waterScore, color:'#14b8a6' },
    { label:'PM2.5 Index', val: Math.max(0, 100 - d.pm25 * 1.5), color:'#f59e0b' },
    { label:'Overall Env. Score', val: d.envScore, color: sc },
  ];
  document.getElementById('scoreBreakdown').innerHTML = bars.map(b => `
    <div class="score-bar-item">
      <div class="score-bar-header"><span>${b.label}</span><span style="color:${b.color}">${Math.round(b.val)}/100</span></div>
      <div class="score-bar-track"><div class="score-bar-fill" style="width:${b.val}%;background:${b.color}"></div></div>
    </div>`).join('');

  // Priority alert
  const alerts = {
    Kanpur: '⚠️ <strong>Water contamination is your #1 risk.</strong> Use certified RO+UV purification. Chromium from Jajmau tanneries has historically exceeded safe limits by 120x. Get your water independently tested.',
    Delhi: '⚠️ <strong>Air quality is Unhealthy (AQI 154).</strong> Limit all outdoor activity. Use HEPA air purifier indoors. Wear N95 mask outdoors. This is a medical advisory.',
    Kolkata: '🟡 <strong>Moderate air + water risks.</strong> Monsoon helps air quality but increases waterborne disease risk. Ensure water purification and keep home ventilated.',
    Lucknow: '⚠️ <strong>UP water belt concern:</strong> High TDS (460 mg/L) similar to Kanpur. Industrial corridor proximity. RO purification essential.',
    Bangalore: '🟢 <strong>Best environmental conditions in this dataset.</strong> Maintain air purifier, use filtered water, continue regular outdoor activity.',
    Pune: '🟢 <strong>Excellent air quality.</strong> Focus on water quality maintenance. Pune\'s relatively lower TDS is a significant health advantage.',
    Hyderabad: '🟢 <strong>Good overall conditions.</strong> Monitor fluoride levels in groundwater — Telangana has localized fluorosis risk in some areas.',
    Mumbai: '🟡 <strong>Decent air, moderate water quality.</strong> Coastal humidity promotes mold — ventilate indoor spaces and use HEPA filtration.',
    Ahmedabad: '🟡 <strong>Elevated TDS from hard water + industrial particulate PM10 are main concerns.</strong> Use shower filters and RO drinking water.',
    Chennai: '🟢 <strong>Coastal air benefits are offset by water salinity risks.</strong> Monitor water TDS — Chennai desalination water can have variable quality.'
  };
  document.getElementById('priorityAlert').innerHTML = alerts[city] || alerts['Kanpur'];
}

// ─────────────────────────────
// SELECT CITY
// ─────────────────────────────
function selectCity(name) {
  selectedCity = name;
  document.getElementById('citySelect').value = name;
  renderCityCards();
  updateDetailPanel(name);
  updateReportCard(name);
  if (compareMode) renderComparePanel(name);
}

function onCityChange() {
  selectCity(document.getElementById('citySelect').value);
}

// ─────────────────────────────
// FILTERS
// ─────────────────────────────
function filterCityCards() { renderCityCards(); }

function updateRangeVal(el) {
  document.getElementById('aqiRangeVal').textContent = el.value;
}

// ─────────────────────────────
// COMPARE MODE
// ─────────────────────────────
function toggleCompare() {
  compareMode = !compareMode;
  const btn = document.getElementById('compareToggle');
  btn.classList.toggle('active', compareMode);
  const panel = document.getElementById('comparePanel');
  panel.classList.toggle('visible', compareMode);
  if (compareMode) renderComparePanel(selectedCity);
}

function renderComparePanel(city) {
  const d = cityData[city];
  const avgAqi = Math.round(cities.reduce((s,c) => s + cityData[c].aqi, 0) / cities.length);
  const avgPm25 = Math.round(cities.reduce((s,c) => s + cityData[c].pm25, 0) / cities.length);
  const avgScore = Math.round(cities.reduce((s,c) => s + cityData[c].envScore, 0) / cities.length);

  const best = cities.reduce((a,b) => cityData[a].aqi < cityData[b].aqi ? a : b);
  const worst = cities.reduce((a,b) => cityData[a].aqi > cityData[b].aqi ? a : b);

  document.getElementById('compareContent').innerHTML = `
    <div class="compare-col">
      <h4 style="color:${aqiColor(d.aqi)}">📍 ${city}</h4>
      ${[['AQI',d.aqi],['PM2.5',d.pm25+'µg/m³'],['PM10',d.pm10+'µg/m³'],['Env Score',d.envScore+'/100'],['Water TDS',d.wTDS+' mg/L']].map(([k,v])=>
        `<div class="compare-stat"><span>${k}</span><span>${v}</span></div>`).join('')}
    </div>
    <div class="compare-col">
      <h4 style="color:var(--text-secondary)">📊 10-City Average</h4>
      ${[['AQI',avgAqi],['PM2.5',avgPm25+'µg/m³'],['PM10','—'],['Env Score',avgScore+'/100'],['Water TDS','—']].map(([k,v])=>
        `<div class="compare-stat"><span>${k}</span><span>${v}</span></div>`).join('')}
    </div>
    <div class="compare-col">
      <h4 style="color:var(--aqi-good)">🌿 Best: ${best}</h4>
      ${[['AQI',cityData[best].aqi],['PM2.5',cityData[best].pm25+'µg/m³'],['PM10',cityData[best].pm10+'µg/m³'],['Env Score',cityData[best].envScore+'/100'],['Water TDS',cityData[best].wTDS+' mg/L']].map(([k,v])=>
        `<div class="compare-stat"><span>${k}</span><span>${v}</span></div>`).join('')}
    </div>
    <div class="compare-col">
      <h4 style="color:var(--aqi-verypoor)">⚠️ Worst: ${worst}</h4>
      ${[['AQI',cityData[worst].aqi],['PM2.5',cityData[worst].pm25+'µg/m³'],['PM10',cityData[worst].pm10+'µg/m³'],['Env Score',cityData[worst].envScore+'/100'],['Water TDS',cityData[worst].wTDS+' mg/L']].map(([k,v])=>
        `<div class="compare-stat"><span>${k}</span><span>${v}</span></div>`).join('')}
    </div>`;
}

// ─────────────────────────────
// CHARTS
// ─────────────────────────────
Chart.defaults.color = '#94a3b8';
Chart.defaults.borderColor = 'rgba(255,255,255,0.05)';
Chart.defaults.font.family = 'Inter, sans-serif';

let aqiChart, pm25Chart, pm10Chart, rankingChart, distributionChart;

function initCharts() {
  const labels = cities;

  // AQI Chart
  aqiChart = new Chart(document.getElementById('aqiChart'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'AQI',
        data: cities.map(c => cityData[c].aqi),
        backgroundColor: cities.map(c => aqiColor(cityData[c].aqi) + 'cc'),
        borderColor: cities.map(c => aqiColor(cityData[c].aqi)),
        borderWidth: 1.5,
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      animation: { duration: 1000, easing: 'easeOutQuart' },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0f172a',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          callbacks: {
            label: ctx => ` AQI ${ctx.raw} — ${aqiCategory(ctx.raw)}`,
            afterLabel: ctx => ` PM2.5: ${cityData[cities[ctx.dataIndex]].pm25}µg/m³`
          }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
        y: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { font: { size: 11 } },
          suggestedMax: 200
        }
      }
    }
  });

  // PM2.5
  pm25Chart = new Chart(document.getElementById('pm25Chart'), {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'PM2.5 (µg/m³)',
          data: cities.map(c => cityData[c].pm25),
          backgroundColor: '#818cf8aa',
          borderColor: '#818cf8',
          borderWidth: 1.5,
          borderRadius: 5,
        },
        {
          label: 'WHO Limit (15)',
          data: cities.map(() => 15),
          type: 'line',
          borderColor: '#ef4444',
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false,
        }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      animation: { duration: 900 },
      plugins: {
        legend: { labels: { boxWidth: 12, font: { size: 11 } } },
        tooltip: { backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 10 } } },
        y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { font: { size: 11 } } }
      }
    }
  });

  // PM10
  pm10Chart = new Chart(document.getElementById('pm10Chart'), {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'PM10 (µg/m³)',
          data: cities.map(c => cityData[c].pm10),
          backgroundColor: '#14b8a6aa',
          borderColor: '#14b8a6',
          borderWidth: 1.5,
          borderRadius: 5,
        },
        {
          label: 'WHO Limit (45)',
          data: cities.map(() => 45),
          type: 'line',
          borderColor: '#f59e0b',
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false,
        }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      animation: { duration: 900 },
      plugins: {
        legend: { labels: { boxWidth: 12, font: { size: 11 } } },
        tooltip: { backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 10 } } },
        y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { font: { size: 11 } } }
      }
    }
  });

  // Ranking (horizontal bar)
  const sortedCities = [...cities].sort((a, b) => cityData[b].envScore - cityData[a].envScore);
  rankingChart = new Chart(document.getElementById('rankingChart'), {
    type: 'bar',
    data: {
      labels: sortedCities,
      datasets: [{
        label: 'Environmental Health Score',
        data: sortedCities.map(c => cityData[c].envScore),
        backgroundColor: sortedCities.map(c => scoreColor(cityData[c].envScore) + 'aa'),
        borderColor: sortedCities.map(c => scoreColor(cityData[c].envScore)),
        borderWidth: 1.5,
        borderRadius: 5,
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true, maintainAspectRatio: false,
      animation: { duration: 1000 },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1,
          callbacks: { label: ctx => ` Score: ${ctx.raw}/100` }
        }
      },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.04)' }, max: 100, ticks: { font: { size: 11 } } },
        y: { grid: { display: false }, ticks: { font: { size: 11 } } }
      }
    }
  });

  // AQI Distribution Doughnut
  const catCounts = { Good: 0, Satisfactory: 0, Moderate: 0, Poor: 0, 'Very Poor': 0, Severe: 0 };
  cities.forEach(c => { catCounts[aqiCategory(cityData[c].aqi)]++; });
  const filteredCats = Object.entries(catCounts).filter(([,v]) => v > 0);

  distributionChart = new Chart(document.getElementById('distributionChart'), {
    type: 'doughnut',
    data: {
      labels: filteredCats.map(([k]) => k),
      datasets: [{
        data: filteredCats.map(([,v]) => v),
        backgroundColor: ['#22c55ecc','#84cc16cc','#f59e0bcc','#f97316cc','#ef4444cc','#7c2d12cc'],
        borderColor: ['#22c55e','#84cc16','#f59e0b','#f97316','#ef4444','#7c2d12'],
        borderWidth: 1.5,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      animation: { duration: 1000, animateRotate: true },
      cutout: '65%',
      plugins: {
        legend: {
          position: 'right',
          labels: { font: { size: 11 }, boxWidth: 12, padding: 12 }
        },
        tooltip: {
          backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1,
          callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw} cities` }
        }
      }
    }
  });
}

function updateCharts() {
  // Pollutant view filter
  const pollutant = document.getElementById('pollutantSelect').value;
  // Just show/hide chart cards based on selection
  const pm25card = document.getElementById('pm25Chart').closest('.chart-card');
  const pm10card = document.getElementById('pm10Chart').closest('.chart-card');
  const aqicard = document.getElementById('aqiChart').closest('.chart-card');
  pm25card.style.display = (pollutant === 'pm10' || pollutant === 'aqi') ? 'none' : '';
  pm10card.style.display = (pollutant === 'pm25' || pollutant === 'aqi') ? 'none' : '';
  aqicard.style.display = (pollutant === 'pm25' || pollutant === 'pm10') ? 'none' : '';
}

// ─────────────────────────────
// INIT
// ─────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderCityCards();
  updateDetailPanel('Kanpur');
  updateReportCard('Kanpur');
  initCharts();

  // Trigger ring animation on load
  setTimeout(() => {
    const circ = 2 * Math.PI * 66;
    document.getElementById('scoreRingFill').style.strokeDashoffset = circ * (1 - 38/100);
  }, 600);
});

