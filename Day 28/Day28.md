<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Hospital Admission Readiness Simulator</title>
<script src="https://cdn.tailwindcss.com"></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  :root{
    --bg:#F3F6F7;
    --surface:#FFFFFF;
    --ink:#0F1B22;
    --navy:#123C5C;
    --navy-deep:#0B283F;
    --teal:#0D7C77;
    --teal-soft:#E4F2F1;
    --amber:#9C6B0E;
    --amber-soft:#FBF1DC;
    --red:#A6291E;
    --red-soft:#FBE7E4;
    --green:#1D7A46;
    --green-soft:#E5F3EA;
    --line:#DCE4E8;
    --muted:#5B6B76;
  }
  html,body{background:var(--bg); color:var(--ink); font-family:'IBM Plex Sans',sans-serif;}
  .font-display{font-family:'Space Grotesk',sans-serif;}
  .font-mono{font-family:'IBM Plex Mono',monospace;}
  ::selection{background:var(--teal-soft);}
  .chart-tab{position:relative;}
  .chart-tab::before{
    content:attr(data-tab);
    position:absolute; top:-1px; left:14px;
    transform:translateY(-100%);
    font-family:'IBM Plex Mono',monospace;
    font-size:10px; letter-spacing:.08em;
    background:var(--navy); color:#fff;
    padding:3px 8px 4px;
    border-radius:4px 4px 0 0;
  }
  .ekg-line{
    background-image: linear-gradient(to bottom, var(--line) 2px, transparent 2px);
    background-size: 2px 10px;
    background-repeat: repeat-y;
    background-position: center;
  }
  .fade-in{animation:fadeIn .35s ease both;}
  @keyframes fadeIn{from{opacity:0; transform:translateY(6px);} to{opacity:1; transform:translateY(0);}}
  .grow-bar{transition:width .5s cubic-bezier(.4,0,.2,1);}
  input[type=text], input[type=date], select{
    font-family:'IBM Plex Sans',sans-serif;
  }
  .focus-ring:focus-visible{outline:2px solid var(--teal); outline-offset:2px;}
  @media (prefers-reduced-motion: reduce){
    .fade-in{animation:none;}
    .grow-bar{transition:none;}
  }
</style>
</head>
<body class="min-h-screen">

<div id="app" class="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12"></div>

<script>
(function(){

  /* ---------------- State ---------------- */
  const DIAGNOSES = ["Acute MI","CHF","Pneumonia","Elective Surgery","Hip Fracture"];
  const ADMISSION_TYPES = ["Inpatient","Observation","Emergency","ICU","Same-Day Surgery"];
  const PA_INPUT_STATUSES = ["Approved","Pending","Denied"];

  let state = null; // set on submit
  let screen = "setup"; // setup | workflow

  function rand(min,max){ return Math.round(min + Math.random()*(max-min)); }
  function clamp(v,min,max){ return Math.max(min, Math.min(max, v)); }
  function pct(v){ return Math.round(v); }

  function genCaseId(dateStr){
    const d = dateStr ? dateStr.replace(/-/g,"") : "00000000";
    return "ADM-" + d + "-" + Math.random().toString(36).slice(2,6).toUpperCase();
  }

  function initState(form){
    const paVal = form.paStatus === "Approved" ? rand(82,92)
                : form.paStatus === "Pending" ? rand(35,55)
                : rand(5,18);

    const components = {
      pa: paVal,
      doc: rand(25,58),
      orders: rand(28,58),
      insurance: rand(30,65),
      consent: rand(20,55),
      bed: rand(28,62)
    };

    const weights = { pa:.25, doc:.20, orders:.20, insurance:.15, consent:.10, bed:.10 };

    let total = weightedTotal(components, weights);
    // Initial reveal must sit between 30-60%, decision withheld.
    total = clamp(total, 30, 60);

    return {
      caseId: genCaseId(form.admissionDate),
      form,
      weights,
      components,
      initialTotalClamped: total,
      analyzed: false,
      paSubStatus: form.paStatus, // Approved | Pending | Denied
      paFlags: { reasonReviewed:false, insuranceContacted:false, appealAttempts:0 },
      actionsLog: [],
      flags: { nursingNotified:false, patientArrivalPrepared:false },
      milestones: {
        paReview:false, insuranceVerification:false, bedAssignment:false,
        documentation:false, consent:false, patientArrival:false,
        registration:false, clinicalAssessment:false, admissionComplete:false
      },
      finalized:false,
      finalOutcome:null // 'admit' | 'not_ready'
    };
  }

  function weightedTotal(c,w){
    return c.pa*w.pa + c.doc*w.doc + c.orders*w.orders + c.insurance*w.insurance + c.consent*w.consent + c.bed*w.bed;
  }

  function isICUDeniedLock(){
    return state.form.paStatus === "Denied" && state.form.admissionType === "ICU" && state.paSubStatus === "Denied";
  }

  function currentScore(){
    if(!state.analyzed) return state.initialTotalClamped;
    let t = weightedTotal(state.components, state.weights);
    if(isICUDeniedLock()) t = Math.min(t, 69);
    return clamp(t,0,100);
  }

  function statusLabel(key, val){
    const bands = {
      pa: [[0,25,"Denied / Unresolved"],[25,60,"Pending"],[60,101,"Approved"]],
      doc: [[0,45,"Incomplete"],[45,80,"Partial"],[80,101,"Complete"]],
      orders: [[0,45,"Pending"],[45,80,"Partial"],[80,101,"Confirmed"]],
      insurance: [[0,45,"Unverified"],[45,80,"Verifying"],[80,101,"Verified"]],
      consent: [[0,45,"Not Signed"],[45,80,"Pending Signature"],[80,101,"Signed"]],
      bed: [[0,45,"Unassigned"],[45,80,"Pending Assignment"],[80,101,"Assigned"]]
    };
    for(const [lo,hi,label] of bands[key]){
      if(val>=lo && val<hi) return label;
    }
    return "—";
  }

  function statusTone(val){
    if(val>=80) return "green";
    if(val>=45) return "amber";
    return "red";
  }

  function toneClasses(tone){
    return {
      green:{bg:"var(--green-soft)",fg:"var(--green)"},
      amber:{bg:"var(--amber-soft)",fg:"var(--amber)"},
      red:{bg:"var(--red-soft)",fg:"var(--red)"}
    }[tone];
  }

  /* ---------------- Actions ---------------- */
  function log(msg){
    state.actionsLog.unshift({t: new Date(), msg});
  }

  function bumpPA(amount, subStatusIfPending){
    state.components.pa = clamp(state.components.pa + amount, 0, 96);
    if(state.paSubStatus === "Pending" && state.components.pa >= 88){
      state.paSubStatus = "Approved";
      log("PA follow-up resolved — status converted to Approved.");
    }
  }

  function paAction(action){
    if(state.paSubStatus === "Pending"){
      if(action==="followup"){ bumpPA(rand(18,26)); log("Followed up with payer on pending PA."); }
      if(action==="upload"){ bumpPA(rand(18,26)); log("Uploaded supporting documentation for PA review."); }
      if(action==="contact"){ bumpPA(rand(18,26)); log("Contacted physician to clarify PA request."); }
    } else if(state.paSubStatus === "Denied"){
      if(action==="review"){ state.paFlags.reasonReviewed = true; log("Reviewed denial reason with UR."); }
      if(action==="contactIns"){ state.paFlags.insuranceContacted = true; state.components.pa = clamp(state.components.pa+6,0,40); log("Contacted insurance regarding denial."); }
      if(action==="appeal"){
        state.paFlags.appealAttempts += 1;
        const success = Math.random() < 0.68;
        if(success){
          state.paSubStatus = "Approved";
          state.components.pa = rand(88,95);
          log("Appeal submitted — payer overturned denial. PA now Approved.");
        } else {
          state.components.pa = clamp(state.components.pa+4,0,35);
          log("Appeal submitted — payer upheld denial. Consider escalation.");
        }
      }
    }
    render();
  }

  function workflowAction(action){
    if(action==="bed"){ state.components.bed = 100; state.milestones.bedAssignment = true; log("Bed assigned."); }
    if(action==="insurance"){ state.components.insurance = 100; state.milestones.insuranceVerification = true; log("Insurance verified."); }
    if(action==="docs"){ state.components.doc = clamp(state.components.doc+34,0,100); if(state.components.doc>=90) state.milestones.documentation = true; log("Documentation uploaded."); }
    if(action==="consent"){ state.components.consent = 100; state.milestones.consent = true; log("Consent completed."); }
    if(action==="physician"){ state.components.orders = clamp(state.components.orders+34,0,100); log("Contacted attending physician re: orders."); }
    if(action==="nursing"){ state.flags.nursingNotified = true; log("Nursing notified of pending admission."); }
    if(action==="arrival"){
      state.flags.patientArrivalPrepared = true;
      state.milestones.patientArrival = true;
      log("Patient arrival preparations completed.");
    }
    if(state.paSubStatus==="Approved" || state.components.pa>=88) state.milestones.paReview = true;
    render();
  }

  function finalize(){
    state.finalized = true;
    const s = currentScore();
    if(s>=90){
      state.finalOutcome = "admit";
      state.milestones.registration = true;
      state.milestones.clinicalAssessment = true;
      state.milestones.admissionComplete = true;
    } else {
      state.finalOutcome = "not_ready";
    }
    render();
  }

  function riskLevel(val){
    if(val>=75) return {label:"High", tone:"red"};
    if(val>=50) return {label:"Elevated", tone:"amber"};
    if(val>=25) return {label:"Moderate", tone:"amber"};
    return {label:"Low", tone:"green"};
  }

  function computeRisks(){
    const c = state.components;
    const clinicalWeighted = ["Acute MI","CHF"].includes(state.form.diagnosis) || state.form.admissionType==="ICU";
    const docRisk = 100-c.doc;
    const insRisk = 100-c.insurance;
    const bedRisk = 100-c.bed;
    let clinicalRisk = 100 - ((c.doc + c.orders)/2);
    clinicalRisk = clinicalWeighted ? clamp(clinicalRisk*1.4,0,100) : clinicalRisk;
    return {
      Documentation: docRisk,
      Insurance: insRisk,
      Bed: bedRisk,
      Clinical: clinicalRisk
    };
  }

  /* ---------------- Render ---------------- */
  function el(html){
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  function render(){
    const app = document.getElementById('app');
    app.innerHTML = "";
    app.appendChild(screen==="setup" ? renderSetup() : renderWorkflow());
    bindEvents();
    window.scrollTo({top:0, behavior:'instant' in window ? 'instant':'auto'});
  }

  function renderSetup(){
    return el(`
    <div class="fade-in">
      <div class="flex items-center gap-2 mb-1">
        <span class="font-mono text-[11px] tracking-widest uppercase" style="color:var(--muted)">Admission Coordination Console</span>
      </div>
      <h1 class="font-display text-2xl sm:text-3xl font-semibold mb-2" style="color:var(--navy-deep)">Hospital Admission Readiness Simulator</h1>
      <p class="text-sm mb-8 max-w-xl" style="color:var(--muted)">Enter case details to begin the readiness review. Provider and payer names shown throughout are illustrative training data only.</p>

      <form id="setupForm" class="bg-white border rounded-xl p-6 sm:p-8" style="border-color:var(--line)">
        <div class="grid sm:grid-cols-2 gap-5">
          <div class="sm:col-span-2">
            <label class="block text-xs font-semibold uppercase tracking-wide mb-1.5" style="color:var(--muted)">Provider <span class="font-normal normal-case">(illustrative)</span></label>
            <input required name="provider" type="text" placeholder="e.g. Riverside Regional Medical Center" class="w-full border rounded-lg px-3 py-2.5 text-sm focus-ring" style="border-color:var(--line)">
          </div>
          <div class="sm:col-span-2">
            <label class="block text-xs font-semibold uppercase tracking-wide mb-1.5" style="color:var(--muted)">Attending Physician <span class="font-normal normal-case">(illustrative)</span></label>
            <input required name="attending" type="text" placeholder="e.g. Dr. A. Whitfield, Internal Medicine" class="w-full border rounded-lg px-3 py-2.5 text-sm focus-ring" style="border-color:var(--line)">
          </div>
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wide mb-1.5" style="color:var(--muted)">Diagnosis</label>
            <select required name="diagnosis" class="w-full border rounded-lg px-3 py-2.5 text-sm focus-ring bg-white" style="border-color:var(--line)">
              <option value="" disabled selected>Select diagnosis</option>
              ${DIAGNOSES.map(d=>`<option value="${d}">${d}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wide mb-1.5" style="color:var(--muted)">Admission Type</label>
            <select required name="admissionType" class="w-full border rounded-lg px-3 py-2.5 text-sm focus-ring bg-white" style="border-color:var(--line)">
              <option value="" disabled selected>Select admission type</option>
              ${ADMISSION_TYPES.map(d=>`<option value="${d}">${d}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wide mb-1.5" style="color:var(--muted)">Prior Authorization Status</label>
            <select required name="paStatus" class="w-full border rounded-lg px-3 py-2.5 text-sm focus-ring bg-white" style="border-color:var(--line)">
              <option value="" disabled selected>Select PA status</option>
              ${PA_INPUT_STATUSES.map(d=>`<option value="${d}">${d}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wide mb-1.5" style="color:var(--muted)">Admission Date</label>
            <input required name="admissionDate" type="date" class="w-full border rounded-lg px-3 py-2.5 text-sm focus-ring" style="border-color:var(--line)">
          </div>
        </div>

        <div id="obsNotice"></div>

        <button type="submit" class="mt-7 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-colors" style="background:var(--navy)">
          🏥 Analyze Admission Readiness
        </button>
      </form>
    </div>
    `);
  }

  function obsNoticeHTML(){
    return `
    <div class="mt-5 rounded-lg border px-4 py-3 text-sm" style="border-color:var(--amber); background:var(--amber-soft); color:#5b4207">
      <strong class="font-semibold">CMS 2-Midnight Rule applies</strong> — different cost-sharing, SNF eligibility, and billing than inpatient. Medicare patients require written MOON notification.
    </div>`;
  }

  function criteriaNoteHTML(){
    return `
    <div class="rounded-lg border px-4 py-3 text-sm" style="border-color:var(--navy); background:var(--teal-soft); color:var(--navy-deep)">
      <strong class="font-semibold">InterQual/Milliman thresholds apply</strong> — ensure documentation meets medical necessity standards before UR review.
    </div>`;
  }

  function progressBar(val, tone){
    const c = toneClasses(tone);
    return `
    <div class="h-1.5 rounded-full w-full" style="background:var(--line)">
      <div class="h-1.5 rounded-full grow-bar" style="width:${pct(val)}%; background:${c.fg}"></div>
    </div>`;
  }

  function badge(text, tone){
    const c = toneClasses(tone);
    return `<span class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold" style="background:${c.bg}; color:${c.fg}">${text}</span>`;
  }

  function renderWorkflow(){
    const s = state;
    const score = currentScore();
    const scoreTone = score>=90?"green":score>=70?"amber":"red";
    const comps = [
      {key:"pa", label:"PA Status", weight:25, tab:"PA"},
      {key:"insurance", label:"Insurance", weight:15, tab:"IN"},
      {key:"bed", label:"Bed", weight:10, tab:"BD"},
      {key:"doc", label:"Clinical Documentation", weight:20, tab:"DC"},
      {key:"orders", label:"Physician Orders", weight:20, tab:"PO"},
      {key:"consent", label:"Consent", weight:10, tab:"CN"}
    ];

    const showGovernance = score>=75;
    const risks = computeRisks();

    const milestoneList = [
      ["paReview","PA Review"],
      ["insuranceVerification","Insurance Verification"],
      ["bedAssignment","Bed Assignment"],
      ["documentation","Documentation"],
      ["consent","Consent"],
      ["patientArrival","Patient Arrival"],
      ["registration","Registration"],
      ["clinicalAssessment","Clinical Assessment"],
      ["admissionComplete","Admission Complete"]
    ];

    const wrap = el(`<div class="fade-in pb-16"></div>`);

    wrap.innerHTML = `
      <!-- Header -->
      <div class="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <div class="font-mono text-[11px] tracking-widest uppercase mb-1" style="color:var(--muted)">Case ${s.caseId} · illustrative training data</div>
          <h1 class="font-display text-xl sm:text-2xl font-semibold" style="color:var(--navy-deep)">${s.form.diagnosis} — ${s.form.admissionType} Admission</h1>
          <div class="text-sm mt-1" style="color:var(--muted)">${escapeHTML(s.form.provider)} · ${escapeHTML(s.form.attending)} · Admit date ${s.form.admissionDate}</div>
        </div>
        <button id="startOverBtn" class="text-xs font-semibold px-3 py-2 rounded-lg border" style="border-color:var(--line); color:var(--muted)">↺ New Case</button>
      </div>

      ${s.form.admissionType==="Observation" ? `<div class="mb-6">${obsNoticeHTML()}</div>` : ""}
      ${["Acute MI","CHF"].includes(s.form.diagnosis) ? `<div class="mb-6">${criteriaNoteHTML()}</div>` : ""}

      <!-- Score -->
      <div class="chart-tab bg-white border rounded-xl p-6 mb-6" data-tab="READINESS" style="border-color:var(--line)">
        <div class="flex flex-wrap items-end justify-between gap-3 mb-3">
          <div>
            <div class="text-xs font-semibold uppercase tracking-wide mb-1" style="color:var(--muted)">${s.finalized ? "Final" : (s.analyzed ? "Current" : "Initial")} Readiness Score</div>
            <div class="font-display font-semibold text-4xl" style="color:${toneClasses(scoreTone).fg}">${pct(score)}%</div>
          </div>
          <div class="text-right text-xs max-w-xs" style="color:var(--muted)">
            Weighting — PA 25% · Doc 20% · Orders 20% · Insurance 15% · Consent 10% · Bed 10%
          </div>
        </div>
        <div class="h-2.5 rounded-full w-full mb-2" style="background:var(--line)">
          <div class="h-2.5 rounded-full grow-bar" style="width:${pct(score)}%; background:${toneClasses(scoreTone).fg}"></div>
        </div>
        ${!s.analyzed ? `<div class="text-xs mt-2" style="color:var(--muted)">Full admission determination is withheld pending status resolution.</div>` : ""}
        ${isICUDeniedLock() ? `<div class="mt-3 text-xs rounded-lg px-3 py-2 font-medium" style="background:var(--red-soft); color:var(--red)">ICU admission with a denied PA cannot exceed 69% from administrative tasks alone — PA resolution is required.</div>` : ""}
      </div>

      <!-- Status grid -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        ${comps.map(c=>{
          const val = s.components[c.key];
          const tone = statusTone(val);
          return `
          <div class="chart-tab bg-white border rounded-xl p-4" data-tab="${c.tab}" style="border-color:var(--line)">
            <div class="flex items-center justify-between mb-2">
              <div class="text-sm font-semibold" style="color:var(--ink)">${c.label}</div>
              <span class="font-mono text-[10px]" style="color:var(--muted)">${c.weight}%</span>
            </div>
            ${badge(statusLabel(c.key,val), tone)}
            <div class="mt-3">${progressBar(val,tone)}</div>
          </div>`;
        }).join('')}
      </div>

      <!-- PA Branch panel -->
      ${renderPAPanel()}

      <!-- Workflow actions -->
      <div class="chart-tab bg-white border rounded-xl p-5 mb-6" data-tab="WORKFLOW" style="border-color:var(--line)">
        <div class="text-sm font-semibold mb-3" style="color:var(--navy-deep)">Workflow Actions</div>
        <div class="grid sm:grid-cols-2 gap-2.5">
          ${actionButton("bed","Assign Bed")}
          ${actionButton("insurance","Verify Insurance")}
          ${actionButton("docs","Upload Documentation")}
          ${actionButton("consent","Complete Consent")}
          ${actionButton("physician","Contact Physician")}
          ${actionButton("nursing","Notify Nursing")}
          ${actionButton("arrival","Prepare Patient Arrival", !(score>=75 && s.flags.nursingNotified))}
        </div>
      </div>

      <!-- Risk tracking -->
      <div class="chart-tab bg-white border rounded-xl p-5 mb-6" data-tab="RISK" style="border-color:var(--line)">
        <div class="text-sm font-semibold mb-3" style="color:var(--navy-deep)">Risk Tracking</div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          ${Object.entries(risks).map(([label,val])=>{
            const r = riskLevel(val);
            return `
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-xs font-semibold" style="color:var(--ink)">${label} Risk</span>
              </div>
              ${badge(r.label, r.tone)}
              <div class="mt-2">${progressBar(val, r.tone)}</div>
            </div>`;
          }).join('')}
        </div>
        ${(["Acute MI","CHF"].includes(s.form.diagnosis) || s.form.admissionType==="ICU") ? `<div class="text-xs mt-3" style="color:var(--muted)">Clinical Risk is weighted higher for Acute MI, CHF, and ICU admissions.</div>` : ""}
      </div>

      ${showGovernance ? `
      <div class="chart-tab rounded-xl p-5 mb-6" data-tab="BENCHMARKS" style="background:var(--navy); color:#fff">
        <div class="text-sm font-semibold mb-1.5">Governance Snapshot</div>
        <div class="text-xs opacity-90 leading-relaxed font-mono">
          Industry benchmarks (estimates only): PA turnaround 3–5 days · Inpatient denial rate ~8–10% (CMS) · PA rework cost ~$11/transaction (CAQH)
        </div>
      </div>` : ""}

      <!-- Care coordination -->
      <div class="mb-6">
        <div class="text-sm font-semibold mb-3" style="color:var(--navy-deep)">Care Coordination</div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          ${careCard("Attending", escapeHTML(s.form.attending), "Ordering provider of record for this admission.")}
          ${careCard("Case Manager", "M. Alvarez, RN-CM", "Coordinates level-of-care and discharge readiness.")}
          ${careCard("Nursing", s.flags.nursingNotified?"Notified":"Not yet notified", "Unit staffing and bed-ready confirmation.")}
          ${careCard("Utilization Review", "Concurrent Review Active", "Concurrent review and denial risk identification against InterQual and Milliman criteria.")}
          ${careCard("Discharge Planner", "T. Okafor, LSW", "Anticipated discharge needs and post-acute planning.")}
        </div>
      </div>

      <!-- Timeline -->
      <div class="chart-tab bg-white border rounded-xl p-5 mb-6" data-tab="TIMELINE" style="border-color:var(--line)">
        <div class="text-sm font-semibold mb-4" style="color:var(--navy-deep)">Admission Timeline</div>
        <div class="relative pl-6 ekg-line">
          ${milestoneList.map(([key,label],i)=>{
            const done = s.milestones[key];
            return `
            <div class="relative pb-5 last:pb-0">
              <div class="absolute -left-6 top-0.5 w-3 h-3 rounded-full border-2" style="background:${done?'var(--teal)':'#fff'}; border-color:${done?'var(--teal)':'var(--line)'}"></div>
              <div class="flex items-center gap-2">
                <span class="text-sm ${done?'font-semibold':''}" style="color:${done?'var(--ink)':'var(--muted)'}">${label}</span>
                ${done ? `<span class="font-mono text-[10px]" style="color:var(--teal)">COMPLETE</span>` : ""}
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>

      <!-- Finalize -->
      <div class="flex justify-end mb-6">
        <button id="finalizeBtn" class="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white" style="background:var(--navy)">
          Finalize Admission Review
        </button>
      </div>

      ${s.finalized ? renderFinalDecision(score, risks) : ""}
    `;

    return wrap;
  }

  function careCard(role, primary, desc){
    return `
    <div class="bg-white border rounded-xl p-4" style="border-color:var(--line)">
      <div class="text-xs font-semibold uppercase tracking-wide mb-1" style="color:var(--muted)">${role}</div>
      <div class="text-sm font-semibold mb-1" style="color:var(--ink)">${primary}</div>
      <div class="text-xs leading-relaxed" style="color:var(--muted)">${desc}</div>
    </div>`;
  }

  function actionButton(action,label,disabled){
    return `
    <button data-workflow="${action}" ${disabled?'disabled':''} class="text-left text-sm font-medium rounded-lg border px-3.5 py-2.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--teal-soft)]" style="border-color:var(--line); color:var(--ink)">
      ${label}
    </button>`;
  }

  function renderPAPanel(){
    const s = state;
    if(s.paSubStatus === "Approved"){
      return `
      <div class="chart-tab bg-white border rounded-xl p-5 mb-6" data-tab="PA REVIEW" style="border-color:var(--line)">
        <div class="text-sm font-semibold mb-1" style="color:var(--navy-deep)">Prior Authorization</div>
        <div class="text-xs" style="color:var(--muted)">Approved — no further PA action required. Continue with remaining workflow items.</div>
      </div>`;
    }
    if(s.paSubStatus === "Pending"){
      return `
      <div class="chart-tab bg-white border rounded-xl p-5 mb-6" data-tab="PA REVIEW" style="border-color:var(--line); border-left:3px solid var(--amber)">
        <div class="text-sm font-semibold mb-1" style="color:var(--navy-deep)">Prior Authorization — Pending</div>
        <div class="text-xs mb-3" style="color:var(--muted)">Payer has not returned a determination. Choose an action to progress the request.</div>
        <div class="grid sm:grid-cols-3 gap-2.5">
          ${paActionButton("followup","Follow Up")}
          ${paActionButton("upload","Upload Docs")}
          ${paActionButton("contact","Contact Physician")}
        </div>
      </div>`;
    }
    // Denied
    const s2 = s;
    const canAppeal = s2.paFlags.reasonReviewed && s2.paFlags.insuranceContacted;
    return `
    <div class="chart-tab bg-white border rounded-xl p-5 mb-6" data-tab="PA REVIEW" style="border-color:var(--line); border-left:3px solid var(--red)">
      <div class="text-sm font-semibold mb-1" style="color:var(--navy-deep)">Prior Authorization — Denied</div>
      <div class="text-xs mb-3" style="color:var(--muted)">Review the denial and pursue appeal before this component can clear.</div>
      <div class="grid sm:grid-cols-3 gap-2.5">
        <button data-pa="review" class="text-left text-sm font-medium rounded-lg border px-3.5 py-2.5 hover:bg-[var(--teal-soft)]" style="border-color:var(--line)">${s2.paFlags.reasonReviewed?'✓ ':''}Review Reason</button>
        <button data-pa="contactIns" class="text-left text-sm font-medium rounded-lg border px-3.5 py-2.5 hover:bg-[var(--teal-soft)]" style="border-color:var(--line)">${s2.paFlags.insuranceContacted?'✓ ':''}Contact Insurance</button>
        <button data-pa="appeal" ${canAppeal?'':'disabled'} class="text-left text-sm font-medium rounded-lg border px-3.5 py-2.5 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--teal-soft)]" style="border-color:var(--line)">Submit Appeal ${s2.paFlags.appealAttempts?`(attempt ${s2.paFlags.appealAttempts+1})`:''}</button>
      </div>
      ${!canAppeal ? `<div class="text-xs mt-2" style="color:var(--muted)">Complete Review Reason and Contact Insurance before appealing.</div>`:""}
    </div>`;
  }

  function paActionButton(action,label){
    return `<button data-pa="${action}" class="text-left text-sm font-medium rounded-lg border px-3.5 py-2.5 hover:bg-[var(--teal-soft)]" style="border-color:var(--line)">${label}</button>`;
  }

  function renderFinalDecision(score, risks){
    const s = state;
    if(s.finalOutcome === "admit"){
      return `
      <div class="chart-tab rounded-xl p-6" data-tab="DECISION" style="background:var(--green-soft); border:1px solid var(--green)">
        <div class="text-lg font-display font-semibold mb-1" style="color:var(--green)">✅ Admit</div>
        <div class="text-sm mb-4" style="color:var(--ink)">Case ${s.caseId} meets readiness criteria at ${pct(score)}%. All required components have cleared for admission.</div>
        <div class="grid sm:grid-cols-2 gap-3 text-sm">
          <div><span class="font-semibold">Diagnosis:</span> ${s.form.diagnosis}</div>
          <div><span class="font-semibold">Admission Type:</span> ${s.form.admissionType}</div>
          <div><span class="font-semibold">Attending:</span> ${escapeHTML(s.form.attending)}</div>
          <div><span class="font-semibold">Admit Date:</span> ${s.form.admissionDate}</div>
        </div>
      </div>`;
    }
    const comps = [
      {key:"pa", label:"PA Status"},
      {key:"insurance", label:"Insurance"},
      {key:"bed", label:"Bed"},
      {key:"doc", label:"Clinical Documentation"},
      {key:"orders", label:"Physician Orders"},
      {key:"consent", label:"Consent"}
    ];
    const missing = comps.filter(c=>s.components[c.key] < 90);
    const remainingRisks = Object.entries(risks).filter(([_,v])=>v>=25);
    return `
    <div class="chart-tab rounded-xl p-6" data-tab="DECISION" style="background:var(--amber-soft); border:1px solid var(--amber)">
      <div class="text-lg font-display font-semibold mb-1" style="color:var(--amber)">⚠ Not Ready</div>
      <div class="text-sm mb-4" style="color:var(--ink)">Case ${s.caseId} is at ${pct(score)}% readiness — below the 90% threshold required for admission.</div>

      <div class="mb-4">
        <div class="text-xs font-semibold uppercase tracking-wide mb-2" style="color:var(--muted)">Missing / Incomplete Items</div>
        ${missing.length ? `<ul class="text-sm space-y-1 list-disc list-inside">${missing.map(m=>`<li>${m.label} — ${statusLabel(m.key, s.components[m.key])}</li>`).join('')}</ul>` : `<div class="text-sm" style="color:var(--muted)">None — all components above 90%, but overall weighted score remains below threshold.</div>`}
      </div>

      <div class="mb-4">
        <div class="text-xs font-semibold uppercase tracking-wide mb-2" style="color:var(--muted)">Required Actions</div>
        <ul class="text-sm space-y-1 list-disc list-inside">
          ${s.paSubStatus!=="Approved" ? `<li>Resolve Prior Authorization (${s.paSubStatus})</li>`:""}
          ${missing.filter(m=>m.key!=="pa").map(m=>`<li>Progress ${m.label.toLowerCase()}</li>`).join('')}
          ${isICUDeniedLock() ? `<li>ICU admission requires PA resolution — administrative tasks alone cannot clear this case.</li>`:""}
        </ul>
      </div>

      <div>
        <div class="text-xs font-semibold uppercase tracking-wide mb-2" style="color:var(--muted)">Remaining Risks</div>
        ${remainingRisks.length ? `<div class="flex flex-wrap gap-2">${remainingRisks.map(([label,val])=>badge(`${label}: ${riskLevel(val).label}`, riskLevel(val).tone)).join('')}</div>` : `<div class="text-sm" style="color:var(--muted)">No elevated risks remaining.</div>`}
      </div>
    </div>`;
  }

  function escapeHTML(str){
    return (str||"").replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  /* ---------------- Events ---------------- */
  function bindEvents(){
    const setupForm = document.getElementById('setupForm');
    if(setupForm){
      const admissionTypeSel = setupForm.querySelector('[name=admissionType]');
      admissionTypeSel.addEventListener('change', ()=>{
        const notice = document.getElementById('obsNotice');
        notice.innerHTML = admissionTypeSel.value === "Observation" ? obsNoticeHTML() : "";
      });
      setupForm.addEventListener('submit', (e)=>{
        e.preventDefault();
        const fd = new FormData(setupForm);
        const form = {
          provider: fd.get('provider').trim(),
          attending: fd.get('attending').trim(),
          diagnosis: fd.get('diagnosis'),
          admissionType: fd.get('admissionType'),
          paStatus: fd.get('paStatus'),
          admissionDate: fd.get('admissionDate')
        };
        state = initState(form);
        state.analyzed = true;
        screen = "workflow";
        render();
      });
    }

    const startOver = document.getElementById('startOverBtn');
    if(startOver) startOver.addEventListener('click', ()=>{ screen="setup"; state=null; render(); });

    document.querySelectorAll('[data-pa]').forEach(btn=>{
      btn.addEventListener('click', ()=> paAction(btn.getAttribute('data-pa')));
    });
    document.querySelectorAll('[data-workflow]').forEach(btn=>{
      btn.addEventListener('click', ()=> workflowAction(btn.getAttribute('data-workflow')));
    });
    const finalizeBtn = document.getElementById('finalizeBtn');
    if(finalizeBtn) finalizeBtn.addEventListener('click', finalize);
  }

  render();
})();
</script>
</body>
</html>
