

Pa simulator · HTML
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Prior Authorization Workflow Simulator</title>
<style>
/* ============================================================
   GLOBAL / RESET
   ============================================================ */
* { box-sizing: border-box; margin: 0; padding: 0; }
 
body {
  font-family: 'Segoe UI', Arial, sans-serif;
  background: linear-gradient(160deg, #dbeeff 0%, #aecdf2 45%, #7fb0e6 100%);
  min-height: 100vh;
  color: #000;
  padding: 16px;
}
 
h1, h2, h3, h4 { color: #000; }
 
button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  border-radius: 8px;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
button:hover { transform: translateY(-2px); }
button:active { transform: translateY(0); }
 
.hidden { display: none !important; }
 
/* ============================================================
   APP SHELL
   ============================================================ */
#app {
  max-width: 1200px;
  margin: 0 auto;
}
 
header.top-bar {
  background: #0b3d78;
  color: #ffffff;
  border-radius: 14px;
  padding: 18px 22px;
  box-shadow: 0 6px 18px rgba(11,61,120,0.35);
  margin-bottom: 18px;
}
header.top-bar h1 {
  color: #fff;
  font-size: 1.5rem;
  letter-spacing: 0.3px;
}
header.top-bar p {
  color: #cfe3fb;
  font-size: 0.85rem;
  margin-top: 4px;
}
 
/* ============================================================
   STATS BAR
   ============================================================ */
.stats-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 18px;
}
.stat-card {
  background: #ffffff;
  border: 2px solid #bcdcff;
  border-radius: 12px;
  padding: 10px 16px;
  flex: 1 1 150px;
  text-align: center;
  box-shadow: 0 3px 8px rgba(20,60,110,0.12);
}
.stat-card .label {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: #2a5a92;
  font-weight: 700;
}
.stat-card .value {
  font-size: 1.4rem;
  font-weight: 800;
  color: #000;
  margin-top: 2px;
}
 
/* ============================================================
   PROGRESS TRACKER
   ============================================================ */
.progress-tracker {
  background: #ffffff;
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 18px;
  box-shadow: 0 3px 10px rgba(20,60,110,0.12);
  overflow-x: auto;
}
.progress-steps {
  display: flex;
  align-items: center;
  min-width: 620px;
}
.progress-step {
  flex: 1;
  text-align: center;
  position: relative;
  font-size: 0.72rem;
  font-weight: 700;
  color: #7d97b8;
}
.progress-step .dot {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #dce9f9;
  border: 3px solid #bcdcff;
  margin: 0 auto 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: #2a5a92;
  font-weight: 800;
  position: relative;
  z-index: 2;
}
.progress-step::before {
  content: "";
  position: absolute;
  top: 13px;
  left: -50%;
  width: 100%;
  height: 3px;
  background: #bcdcff;
  z-index: 1;
}
.progress-step:first-child::before { display: none; }
.progress-step.done .dot {
  background: #1f6fd6;
  border-color: #1f6fd6;
  color: #fff;
}
.progress-step.done::before { background: #1f6fd6; }
.progress-step.current .dot {
  background: #ffffff;
  border-color: #0b3d78;
  color: #0b3d78;
  box-shadow: 0 0 0 4px rgba(11,61,120,0.15);
}
.progress-step.current { color: #0b3d78; }
.progress-step.done { color: #1f6fd6; }
 
/* ============================================================
   LANES
   ============================================================ */
.lanes {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 14px;
  margin-bottom: 18px;
}
@media (max-width: 900px) {
  .lanes { grid-template-columns: 1fr; }
}
 
.lane {
  background: #ffffff;
  border-radius: 14px;
  padding: 14px;
  min-height: 360px;
  box-shadow: 0 3px 10px rgba(20,60,110,0.12);
  border-top: 6px solid #1f6fd6;
  display: flex;
  flex-direction: column;
}
.lane.patient { border-top-color: #4fa3f7; }
.lane.provider { border-top-color: #1f6fd6; }
.lane.payer { border-top-color: #0b3d78; }
 
.lane h2 {
  font-size: 1rem;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.lane .lane-sub {
  font-size: 0.72rem;
  color: #4a6b91;
  margin-bottom: 10px;
}
 
.dropzone {
  flex: 1;
  border: 2px dashed #bcdcff;
  border-radius: 10px;
  padding: 10px;
  min-height: 220px;
  background: #f4f9ff;
  transition: background 0.15s ease, border-color 0.15s ease;
}
.dropzone.dragover {
  background: #dcecff;
  border-color: #1f6fd6;
}
 
/* Case card */
.case-card {
  background: #ffffff;
  border: 2px solid #bcdcff;
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 10px;
  cursor: grab;
  box-shadow: 0 2px 6px rgba(20,60,110,0.15);
}
.case-card:active { cursor: grabbing; }
.case-card.dragging { opacity: 0.4; }
.case-card .case-title {
  font-weight: 800;
  font-size: 0.88rem;
  color: #000;
}
.case-card .case-meta {
  font-size: 0.72rem;
  color: #3a5f8a;
  margin-top: 2px;
}
.case-card .case-badge {
  display: inline-block;
  margin-top: 6px;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 20px;
  background: #eaf3ff;
  color: #1f6fd6;
  border: 1px solid #bcdcff;
}
.case-card .stage-hint {
  margin-top: 8px;
  font-size: 0.72rem;
  color: #0b3d78;
  font-style: italic;
}
.case-card .action-btn {
  margin-top: 8px;
  background: #1f6fd6;
  color: #fff;
  padding: 6px 10px;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 6px;
}
.case-card .action-btn.secondary {
  background: #ffffff;
  color: #1f6fd6;
  border: 2px solid #1f6fd6;
}
.case-card .action-btn.deny { background: #b23a3a; }
.case-card .action-btn.small { padding: 4px 8px; font-size: 0.68rem; margin-right: 6px;}
 
/* Outcome coloring */
.case-card.outcome-approved { border-color: #2fae5a; background: #f1fbf4; }
.case-card.outcome-denied { border-color: #c0392b; background: #fdf3f2; }
.case-card.outcome-pend { border-color: #d69a1d; background: #fffaf0; }
.case-card.outcome-appeal { border-color: #7d4fd6; background: #f7f3ff; }
 
/* ============================================================
   EDUCATIONAL PANEL
   ============================================================ */
.edu-panel {
  background: #eaf3ff;
  border: 2px solid #bcdcff;
  border-left: 8px solid #0b3d78;
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 18px;
  box-shadow: 0 3px 10px rgba(20,60,110,0.1);
  animation: fadeIn 0.35s ease;
}
.edu-panel h3 {
  font-size: 0.9rem;
  color: #0b3d78;
  margin-bottom: 6px;
}
.edu-panel p {
  font-size: 0.85rem;
  line-height: 1.4;
  color: #14263c;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
}
 
/* ============================================================
   MODALS
   ============================================================ */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(6, 24, 48, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 16px;
}
.modal-box {
  background: #ffffff;
  border-radius: 16px;
  max-width: 520px;
  width: 100%;
  padding: 24px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.35);
  max-height: 88vh;
  overflow-y: auto;
}
.modal-box h2 { margin-bottom: 10px; color: #0b3d78; }
.modal-box p, .modal-box li { font-size: 0.88rem; line-height: 1.5; color: #14263c; }
.modal-box ul { margin: 8px 0 8px 18px; }
.modal-box .modal-actions {
  margin-top: 16px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.modal-box button {
  padding: 10px 16px;
  font-weight: 700;
  font-size: 0.85rem;
}
.btn-primary { background: #1f6fd6; color: #fff; }
.btn-secondary { background: #eaf3ff; color: #0b3d78; border: 2px solid #bcdcff; }
.btn-danger { background: #c0392b; color: #fff; }
.btn-success { background: #2fae5a; color: #fff; }
 
.doc-checklist label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  margin: 6px 0;
  padding: 8px;
  background: #f4f9ff;
  border-radius: 8px;
  border: 1px solid #dceaff;
}
 
.necessity-options button {
  display: block;
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  margin: 6px 0;
  background: #f4f9ff;
  border: 2px solid #bcdcff;
  color: #14263c;
  font-size: 0.83rem;
}
.necessity-options button:hover { background: #dcecff; }
 
/* ============================================================
   SCENARIO PICKER
   ============================================================ */
.scenario-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 12px;
}
@media (max-width: 600px) { .scenario-grid { grid-template-columns: 1fr; } }
.scenario-card {
  border: 2px solid #bcdcff;
  border-radius: 10px;
  padding: 12px;
  cursor: pointer;
  background: #f4f9ff;
  text-align: left;
}
.scenario-card:hover { background: #dcecff; }
.scenario-card h4 { font-size: 0.88rem; color: #0b3d78; }
.scenario-card p { font-size: 0.75rem; color: #3a5f8a; margin-top: 4px; }
 
/* ============================================================
   TOP CONTROLS
   ============================================================ */
.controls-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
}
.controls-row .btn-group { display: flex; gap: 10px; flex-wrap: wrap; }
.controls-row button {
  padding: 10px 16px;
  font-weight: 700;
  font-size: 0.82rem;
}
 
/* ============================================================
   CELEBRATION
   ============================================================ */
#celebration-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1100;
  overflow: hidden;
}
.confetti-piece {
  position: absolute;
  top: -20px;
  width: 10px;
  height: 16px;
  opacity: 0.9;
  animation-name: confetti-fall;
  animation-timing-function: ease-in;
  animation-fill-mode: forwards;
}
@keyframes confetti-fall {
  to {
    transform: translateY(110vh) rotate(540deg);
    opacity: 0.2;
  }
}
 
/* ============================================================
   SUMMARY
   ============================================================ */
.summary-list { margin-top: 10px; }
.summary-list .row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eaf3ff;
  font-size: 0.85rem;
}
.summary-list .row span:first-child { color: #3a5f8a; font-weight: 600; }
.summary-list .row span:last-child { font-weight: 800; color: #000; }
 
.footer-note {
  text-align: center;
  font-size: 0.72rem;
  color: #2a5a92;
  padding: 14px 0 4px;
}
</style>
</head>
<body>
 
<div id="app">
  <header class="top-bar">
    <h1>🩺 Prior Authorization Workflow Simulator</h1>
    <p>Drag cases through the Patient → Provider → Payer journey and learn how real-world Prior Auth decisions get made.</p>
  </header>
 
  <div class="controls-row">
    <div class="btn-group">
      <button class="btn-primary" id="btnNewPatient" style="padding:10px 16px;">🆕 New Patient</button>
      <button class="btn-secondary" id="btnRestart" style="padding:10px 16px;">🔄 Restart Simulator</button>
    </div>
    <div class="btn-group">
      <button class="btn-secondary" id="btnHowTo" style="padding:10px 16px;">❓ How To Play</button>
    </div>
  </div>
 
  <div class="stats-bar">
    <div class="stat-card"><div class="label">Days Elapsed</div><div class="value" id="statDays">0</div></div>
    <div class="stat-card"><div class="label">Efficiency Score</div><div class="value" id="statEfficiency">100</div></div>
    <div class="stat-card"><div class="label">Active Cases</div><div class="value" id="statActive">0</div></div>
    <div class="stat-card"><div class="label">Cases Approved</div><div class="value" id="statApproved">0</div></div>
    <div class="stat-card"><div class="label">Cases Denied</div><div class="value" id="statDenied">0</div></div>
  </div>
 
  <div class="progress-tracker">
    <div class="progress-steps" id="progressSteps"></div>
  </div>
 
  <div class="edu-panel" id="eduPanel">
    <h3 id="eduTitle">👋 Welcome</h3>
    <p id="eduText">Click "New Patient" to begin a Prior Authorization scenario, then drag the case card between lanes to move it through the workflow.</p>
  </div>
 
  <div class="lanes">
    <div class="lane patient">
      <h2>🧑 Patient</h2>
      <div class="lane-sub">Requests care &amp; awaits outcome</div>
      <div class="dropzone" id="zone-patient" data-lane="patient"></div>
    </div>
    <div class="lane provider">
      <h2>🏥 Provider</h2>
      <div class="lane-sub">Documents necessity &amp; submits request</div>
      <div class="dropzone" id="zone-provider" data-lane="provider"></div>
    </div>
    <div class="lane payer">
      <h2>🏢 Payer</h2>
      <div class="lane-sub">Reviews &amp; issues determination</div>
      <div class="dropzone" id="zone-payer" data-lane="payer"></div>
    </div>
  </div>
 
  <div class="footer-note">Educational simulation only — not affiliated with any real insurer, EHR, or medical guidance. All data is in-memory and resets on reload.</div>
</div>
 
<div id="celebration-layer"></div>
<div id="modal-root"></div>
 
<script>
/* ================================================================
   PRIOR AUTHORIZATION WORKFLOW SIMULATOR
   Single-file vanilla JS implementation.
   All state lives in memory (the STATE object). No storage APIs used.
   ================================================================ */
 
/* ----------------------------------------------------------------
   1. SCENARIO DATA (editable)
   Each scenario represents a distinct patient/service type with its
   own documentation requirements and "true" necessity strength,
   which influences how the simulated payer decision engine behaves.
   ---------------------------------------------------------------- */
const SCENARIOS = [
  {
    id: 'elective_surgery',
    name: 'Elective Surgery',
    icon: '🦴',
    patientName: 'James Whitfield',
    age: 54,
    description: 'Candidate for elective knee replacement surgery due to chronic osteoarthritis pain.',
    service: 'Total Knee Arthroplasty (CPT 27447)',
    requiredDocs: [
      { id: 'imaging', label: 'Recent X-ray / MRI showing joint degeneration' },
      { id: 'conservative', label: 'Documentation of 6+ weeks failed conservative therapy' },
      { id: 'notes', label: 'Physician clinical notes & history' },
      { id: 'letter', label: 'Letter of medical necessity' }
    ],
    necessityStrength: 0.8, // baseline probability weighting for a strong case
    baseDays: { evaluate: 1, submit: 1, review: 3 },
    tips: {
      necessity: 'Elective surgeries usually require documented evidence that less invasive treatments (physical therapy, medication, injections) were tried first and failed.',
      submit: 'Surgical PA requests typically need imaging, conservative-treatment history, and a detailed operative plan.',
      review: 'Payers use clinical guidelines (like InterQual or MCG) to check if criteria for surgery are met before approving.'
    }
  },
  {
    id: 'mri',
    name: 'Advanced Imaging (MRI)',
    icon: '🧲',
    patientName: 'Priya Nair',
    age: 39,
    description: 'Persistent lower back pain radiating to the leg; ordering physician wants an MRI to rule out disc herniation.',
    service: 'Lumbar Spine MRI (CPT 72148)',
    requiredDocs: [
      { id: 'symptoms', label: 'Documented duration & severity of symptoms' },
      { id: 'exam', label: 'Physical exam findings (e.g., positive straight-leg raise)' },
      { id: 'conservative', label: 'Prior conservative treatment attempted (4+ weeks)' },
      { id: 'redflags', label: 'Assessment for neurological red flags' }
    ],
    necessityStrength: 0.65,
    baseDays: { evaluate: 1, submit: 1, review: 2 },
    tips: {
      necessity: 'Advanced imaging like MRI often needs "red flag" symptoms or a failed conservative-care trial to justify medical necessity — otherwise a lower-cost option (X-ray) may be requested first.',
      submit: 'Radiology-benefit managers frequently require standardized clinical criteria forms in addition to physician notes.',
      review: 'Because imaging is high volume, many MRI requests are auto-reviewed against clinical algorithms before a human ever sees them.'
    }
  },
  {
    id: 'specialty_med',
    name: 'Specialty Medication',
    icon: '💊',
    patientName: 'Marcus Bell',
    age: 61,
    description: 'Rheumatoid arthritis patient not responding to first-line DMARDs; rheumatologist wants to start a biologic.',
    service: 'Biologic Infusion Therapy (J-code)',
    requiredDocs: [
      { id: 'diagnosis', label: 'Confirmed diagnosis with lab/serology results' },
      { id: 'step', label: 'Step-therapy history: prior medications tried & failed' },
      { id: 'labs', label: 'Recent labs (TB screen, baseline bloodwork)' },
      { id: 'dosing', label: 'Proposed dosing & administration plan' }
    ],
    necessityStrength: 0.55,
    baseDays: { evaluate: 2, submit: 1, review: 4 },
    tips: {
      necessity: 'Specialty medications almost always require "step therapy" proof — showing that cheaper, standard drugs were tried first and did not work well enough.',
      submit: 'Specialty drug PAs are usually the most document-heavy: labs, step-therapy logs, and safety screenings are all required.',
      review: 'Specialty medications are expensive, so payers often route them to clinical pharmacists for detailed review, which adds time.'
    }
  },
  {
    id: 'inpatient',
    name: 'Inpatient Admission',
    icon: '🏨',
    patientName: 'Elena Rodriguez',
    age: 72,
    description: 'Admitted through the ED with pneumonia and low oxygen saturation; hospitalist requests inpatient-level authorization.',
    service: 'Inpatient Hospital Admission',
    requiredDocs: [
      { id: 'vitals', label: 'Vitals & oxygen saturation at admission' },
      { id: 'labs', label: 'Labs / imaging supporting diagnosis (e.g., chest X-ray)' },
      { id: 'severity', label: 'Severity-of-illness / intensity-of-service notes' },
      { id: 'plan', label: 'Planned treatment course & expected length of stay' }
    ],
    necessityStrength: 0.75,
    baseDays: { evaluate: 1, submit: 1, review: 2 },
    tips: {
      necessity: 'Inpatient admissions are checked against severity-of-illness criteria — if the patient could be safely treated as an outpatient or under observation, payers may push back.',
      submit: 'Hospitals often must submit within 24–48 hours of admission ("concurrent review") rather than before the service, since care is urgent.',
      review: 'Utilization review nurses check the clinical picture against admission criteria; borderline cases are common and often lead to Peer-to-Peer review.'
    }
  }
];
 
/* ----------------------------------------------------------------
   2. WORKFLOW STAGE DEFINITIONS (for the top progress tracker)
   ---------------------------------------------------------------- */
const STAGES = [
  { key: 'request',   label: 'Patient Request',   lane: 'patient'  },
  { key: 'necessity', label: 'Medical Necessity',  lane: 'provider' },
  { key: 'documents', label: 'Document Collection',lane: 'provider' },
  { key: 'submitted', label: 'Submitted to Payer', lane: 'payer'   },
  { key: 'review',    label: 'Payer Review',       lane: 'payer'   },
  { key: 'outcome',   label: 'Outcome',            lane: 'payer'   },
  { key: 'complete',  label: 'Complete',           lane: 'patient' }
];
 
/* ----------------------------------------------------------------
   3. GLOBAL STATE
   ---------------------------------------------------------------- */
let STATE = {
  daysElapsed: 0,
  efficiency: 100,
  approvedCount: 0,
  deniedCount: 0,
  cases: [],       // list of case objects currently in play
  caseSeq: 1
};
 
/* Case object shape:
{
  id, scenario, lane, stage, docsCollected: {docId:true}, necessityChosen: null|string,
  necessityCorrect: null|bool, outcome: null|'approved'|'denied'|'pend'|'appeal',
  p2pUsed: false, appealUsed: false, daysInStage: 0, history: []
}
*/
 
/* ----------------------------------------------------------------
   4. DOM REFERENCES
   ---------------------------------------------------------------- */
const zones = {
  patient: document.getElementById('zone-patient'),
  provider: document.getElementById('zone-provider'),
  payer: document.getElementById('zone-payer')
};
const modalRoot = document.getElementById('modal-root');
const eduTitle = document.getElementById('eduTitle');
const eduText = document.getElementById('eduText');
const progressStepsEl = document.getElementById('progressSteps');
 
/* ----------------------------------------------------------------
   5. UTILITIES
   ---------------------------------------------------------------- */
function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
}
 
function addDays(n) {
  STATE.daysElapsed += n;
  document.getElementById('statDays').textContent = STATE.daysElapsed;
}
 
function adjustEfficiency(delta) {
  STATE.efficiency = Math.max(0, Math.min(100, STATE.efficiency + delta));
  document.getElementById('statEfficiency').textContent = STATE.efficiency;
}
 
function setEdu(title, text) {
  eduTitle.textContent = title;
  eduText.textContent = text;
}
 
function refreshStats() {
  document.getElementById('statActive').textContent =
    STATE.cases.filter(c => c.stage !== 'complete').length;
  document.getElementById('statApproved').textContent = STATE.approvedCount;
  document.getElementById('statDenied').textContent = STATE.deniedCount;
}
 
function findCase(id) {
  return STATE.cases.find(c => c.id === id);
}
 
function stageIndex(key) {
  return STAGES.findIndex(s => s.key === key);
}
 
/* ----------------------------------------------------------------
   6. PROGRESS TRACKER RENDERING
   Shows overall progress based on the most-advanced active case,
   or the most recently completed case if none are active.
   ---------------------------------------------------------------- */
function renderProgressTracker() {
  progressStepsEl.innerHTML = '';
 
  // Determine which stage index to highlight: the furthest-along
  // non-complete case, else the last case's stage, else -1 (nothing yet)
  let activeCases = STATE.cases.filter(c => c.stage !== 'complete');
  let refCase = null;
  if (activeCases.length) {
    refCase = activeCases.reduce((a, b) =>
      stageIndex(a.stage) >= stageIndex(b.stage) ? a : b);
  } else if (STATE.cases.length) {
    refCase = STATE.cases[STATE.cases.length - 1];
  }
  const curIdx = refCase ? stageIndex(refCase.stage) : -1;
 
  STAGES.forEach((s, i) => {
    const step = el('div', 'progress-step');
    if (i < curIdx) step.classList.add('done');
    if (i === curIdx) step.classList.add('current');
    const dot = el('div', 'dot', i < curIdx ? '✓' : (i + 1));
    step.appendChild(dot);
    step.appendChild(document.createTextNode(s.label));
    progressStepsEl.appendChild(step);
  });
}
 
/* ----------------------------------------------------------------
   7. MODAL HELPERS
   ---------------------------------------------------------------- */
function openModal(contentEl) {
  const overlay = el('div', 'modal-overlay');
  const box = el('div', 'modal-box');
  box.appendChild(contentEl);
  overlay.appendChild(box);
  modalRoot.appendChild(overlay);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  return overlay;
}
function closeModal() {
  modalRoot.innerHTML = '';
}
 
/* ----------------------------------------------------------------
   8. NEW PATIENT FLOW
   ---------------------------------------------------------------- */
document.getElementById('btnNewPatient').addEventListener('click', showScenarioPicker);
document.getElementById('btnRestart').addEventListener('click', restartSimulator);
document.getElementById('btnHowTo').addEventListener('click', showHowTo);
 
function showScenarioPicker() {
  const wrap = el('div');
  wrap.appendChild(el('h2', null, '🆕 Choose a Patient Scenario'));
  wrap.appendChild(el('p', null, 'Each scenario represents a different type of care that requires Prior Authorization.'));
  const grid = el('div', 'scenario-grid');
  SCENARIOS.forEach(sc => {
    const card = el('div', 'scenario-card');
    card.innerHTML = `<h4>${sc.icon} ${sc.name}</h4><p>${sc.description}</p>`;
    card.addEventListener('click', () => {
      closeModal();
      createCase(sc);
    });
    grid.appendChild(card);
  });
  wrap.appendChild(grid);
  const actions = el('div', 'modal-actions');
  const cancel = el('button', 'btn-secondary', 'Cancel');
  cancel.addEventListener('click', closeModal);
  actions.appendChild(cancel);
  wrap.appendChild(actions);
  openModal(wrap);
}
 
function showHowTo() {
  const wrap = el('div');
  wrap.appendChild(el('h2', null, '❓ How To Play'));
  wrap.appendChild(el('p', null, `
    1. Click <strong>New Patient</strong> and pick a scenario.<br><br>
    2. The case starts in the <strong>Patient</strong> lane. Drag it into the <strong>Provider</strong> lane to begin work.<br><br>
    3. In the Provider lane, complete <strong>Medical Necessity Evaluation</strong> and <strong>Document Collection</strong> using the card's buttons.<br><br>
    4. Drag the case into the <strong>Payer</strong> lane and click <strong>Submit to Payer</strong>.<br><br>
    5. The Payer reviews and returns an outcome: <strong>Approval, Pend, Denial</strong>, which may lead to <strong>Peer-to-Peer Review</strong> or <strong>Appeal</strong>.<br><br>
    6. Drag the finished case back to the Patient lane to see the workflow summary.<br><br>
    Read the blue explanation panel after every action — it teaches you what really happens in the U.S. healthcare PA process!
  `));
  const actions = el('div', 'modal-actions');
  const ok = el('button', 'btn-primary', 'Got it');
  ok.addEventListener('click', closeModal);
  actions.appendChild(ok);
  wrap.appendChild(actions);
  openModal(wrap);
}
 
function createCase(scenario) {
  const c = {
    id: 'case-' + (STATE.caseSeq++),
    scenario,
    lane: 'patient',
    stage: 'request',
    docsCollected: {},
    necessityChosen: null,
    necessityCorrect: null,
    outcome: null,
    p2pUsed: false,
    appealUsed: false,
    pendResolved: false,
    daysInStage: 0
  };
  STATE.cases.push(c);
  addDays(1); // day 1: patient requests care
  setEdu('🧑 Patient Request Submitted',
    `${scenario.patientName} (age ${scenario.age}) needs "${scenario.service}". ${scenario.description} The journey now moves to the Provider, who must document why this service is medically necessary. Drag the case card into the Provider lane to continue.`);
  renderAll();
}
 
/* ----------------------------------------------------------------
   9. RENDERING CASE CARDS
   ---------------------------------------------------------------- */
function renderAll() {
  Object.values(zones).forEach(z => z.innerHTML = '');
  STATE.cases.forEach(c => {
    const targetLane = c.stage === 'complete' ? 'patient' : c.lane;
    zones[targetLane].appendChild(renderCaseCard(c));
  });
  refreshStats();
  renderProgressTracker();
}
 
function stageLabel(c) {
  const map = {
    request: 'Awaiting provider pickup',
    necessity: 'Needs medical necessity evaluation',
    documents: 'Needs documents collected',
    ready_submit: 'Ready — drag to Payer & submit',
    submitted: 'Submitted — awaiting review',
    review: 'Under payer review',
    pend: 'Pended — additional info requested',
    p2p: 'Peer-to-Peer review requested',
    outcome: 'Decision issued',
    appeal: 'Appeal in progress',
    complete: 'Workflow complete'
  };
  return map[c.stage] || c.stage;
}
 
function renderCaseCard(c) {
  const card = el('div', 'case-card');
  card.setAttribute('draggable', 'true');
  card.dataset.id = c.id;
 
  if (c.outcome === 'approved') card.classList.add('outcome-approved');
  if (c.outcome === 'denied') card.classList.add('outcome-denied');
  if (c.stage === 'pend') card.classList.add('outcome-pend');
  if (c.stage === 'appeal') card.classList.add('outcome-appeal');
 
  const title = el('div', 'case-title', `${c.scenario.icon} ${c.scenario.patientName}`);
  const meta = el('div', 'case-meta', `${c.scenario.service}`);
  const badge = el('div', 'case-badge', c.scenario.name);
  const hint = el('div', 'stage-hint', stageLabel(c));
 
  card.appendChild(title);
  card.appendChild(meta);
  card.appendChild(badge);
  card.appendChild(hint);
 
  // Action buttons depending on stage/lane
  const actions = el('div');
  actions.style.marginTop = '8px';
 
  if (c.lane === 'provider' && c.stage === 'necessity') {
    const btn = el('button', 'action-btn', 'Evaluate Medical Necessity');
    btn.addEventListener('click', (e) => { e.stopPropagation(); openNecessityModal(c); });
    actions.appendChild(btn);
  }
 
  if (c.lane === 'provider' && c.stage === 'documents') {
    const btn = el('button', 'action-btn', 'Collect Documents');
    btn.addEventListener('click', (e) => { e.stopPropagation(); openDocsModal(c); });
    actions.appendChild(btn);
  }
 
  if (c.lane === 'provider' && c.stage === 'ready_submit') {
    const info = el('div', 'stage-hint', 'All prep done. Drag this card to the Payer lane to submit.');
    actions.appendChild(info);
  }
 
  if (c.lane === 'payer' && c.stage === 'submitted') {
    const btn = el('button', 'action-btn', 'Submit to Payer for Review');
    btn.addEventListener('click', (e) => { e.stopPropagation(); submitToPayer(c); });
    actions.appendChild(btn);
  }
 
  if (c.lane === 'payer' && c.stage === 'review') {
    const btn = el('button', 'action-btn', 'Run Payer Review');
    btn.addEventListener('click', (e) => { e.stopPropagation(); runPayerReview(c); });
    actions.appendChild(btn);
  }
 
  if (c.lane === 'payer' && c.stage === 'pend') {
    const btn = el('button', 'action-btn', 'Provide Additional Info');
    btn.addEventListener('click', (e) => { e.stopPropagation(); resolvePend(c); });
    actions.appendChild(btn);
  }
 
  if (c.lane === 'payer' && c.stage === 'p2p') {
    const btn = el('button', 'action-btn', 'Conduct Peer-to-Peer Call');
    btn.addEventListener('click', (e) => { e.stopPropagation(); runPeerToPeer(c); });
    actions.appendChild(btn);
  }
 
  if (c.lane === 'payer' && c.stage === 'outcome' && c.outcome === 'denied' && !c.appealUsed) {
    const btn = el('button', 'action-btn deny', 'File Appeal');
    btn.addEventListener('click', (e) => { e.stopPropagation(); fileAppeal(c); });
    actions.appendChild(btn);
  }
 
  if (c.stage === 'appeal') {
    const btn = el('button', 'action-btn', 'Resolve Appeal');
    btn.addEventListener('click', (e) => { e.stopPropagation(); resolveAppeal(c); });
    actions.appendChild(btn);
  }
 
  if ((c.stage === 'outcome' || c.stage === 'appeal_resolved') && c.lane === 'payer') {
    const btn = el('button', 'action-btn secondary', 'Drag to Patient to Finish');
  }
 
  if (c.stage === 'complete') {
    const btn = el('button', 'action-btn', 'View Summary');
    btn.addEventListener('click', (e) => { e.stopPropagation(); showSummary(c); });
    actions.appendChild(btn);
  }
 
  card.appendChild(actions);
 
  // Drag events
  card.addEventListener('dragstart', (e) => {
    card.classList.add('dragging');
    e.dataTransfer.setData('text/plain', c.id);
  });
  card.addEventListener('dragend', () => card.classList.remove('dragging'));
 
  return card;
}
 
/* ----------------------------------------------------------------
   10. DRAG & DROP ZONE HANDLERS
   ---------------------------------------------------------------- */
Object.entries(zones).forEach(([laneName, zone]) => {
  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('dragover');
  });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('dragover');
    const id = e.dataTransfer.getData('text/plain');
    const c = findCase(id);
    if (!c) return;
    handleDrop(c, laneName);
  });
});
 
function handleDrop(c, targetLane) {
  if (c.lane === targetLane) return; // no-op, same lane
 
  // Enforce a sensible, gamified progression instead of free-for-all movement
  const currentLane = c.lane;
 
  // PATIENT -> PROVIDER (kicks off necessity evaluation)
  if (currentLane === 'patient' && targetLane === 'provider' && c.stage === 'request') {
    c.lane = 'provider';
    c.stage = 'necessity';
    addDays(1);
    setEdu('🏥 Case Received by Provider',
      `The provider's office has received the request for ${c.scenario.patientName}. Before anything can be submitted, the clinical team must evaluate whether the service meets medical necessity criteria. Click "Evaluate Medical Necessity" on the card.`);
    renderAll();
    return;
  }
 
  // PROVIDER -> PAYER (only once fully prepped)
  if (currentLane === 'provider' && targetLane === 'payer') {
    if (c.stage !== 'ready_submit') {
      setEdu('⚠️ Not Ready to Submit',
        `This case still needs its Medical Necessity Evaluation and full Document Collection completed before it can be submitted to the Payer. Finish those steps first.`);
      adjustEfficiency(-2);
      renderAll();
      return;
    }
    c.lane = 'payer';
    c.stage = 'submitted';
    setEdu('📤 Arrived at Payer',
      `The completed Prior Authorization packet for ${c.scenario.patientName} has arrived at the payer. Click "Submit to Payer for Review" to formally start the review clock.`);
    renderAll();
    return;
  }
 
  // PAYER -> PATIENT (only once a final outcome/appeal resolution exists)
  if (currentLane === 'payer' && targetLane === 'patient') {
    const finishable = (c.stage === 'outcome') || (c.stage === 'appeal_resolved');
    if (!finishable) {
      setEdu('⚠️ Review Still In Progress',
        `This case cannot return to the patient yet — the payer hasn't issued a usable final determination. Complete the review process first.`);
      adjustEfficiency(-2);
      renderAll();
      return;
    }
    c.lane = 'patient';
    c.stage = 'complete';
    addDays(1);
    setEdu('✅ Workflow Complete',
      `The final result has been communicated back to ${c.scenario.patientName}. Click "View Summary" on the card to review the full workflow timeline and efficiency breakdown.`);
    renderAll();
    return;
  }
 
  // Anything else (e.g., dragging backwards) is blocked with feedback
  setEdu('🚫 Invalid Move',
    `Cases generally flow Patient → Provider → Payer → Patient. This move isn't part of the standard workflow, so nothing changed. Try following the highlighted lane order.`);
  adjustEfficiency(-1);
  renderAll();
}
 
/* ----------------------------------------------------------------
   11. MEDICAL NECESSITY EVALUATION
   ---------------------------------------------------------------- */
function openNecessityModal(c) {
  const wrap = el('div');
  wrap.appendChild(el('h2', null, '🔎 Medical Necessity Evaluation'));
  wrap.appendChild(el('p', null, `For ${c.scenario.patientName}'s request (${c.scenario.service}), decide how the provider should classify this case's medical necessity based on the chart below.`));
  const detail = el('p', null, `<strong>Clinical picture:</strong> ${c.scenario.description}`);
  detail.style.marginTop = '8px';
  wrap.appendChild(detail);
 
  const options = el('div', 'necessity-options');
  options.style.marginTop = '12px';
 
  const choices = [
    { key: 'strong', label: 'Strong medical necessity — clear guideline match, submit as routine.' },
    { key: 'moderate', label: 'Moderate necessity — proceed, but flag for possible additional review.' },
    { key: 'weak', label: 'Weak/unclear necessity — service may not meet criteria yet.' }
  ];
 
  choices.forEach(choice => {
    const btn = el('button', null, choice.label);
    btn.addEventListener('click', () => {
      closeModal();
      resolveNecessity(c, choice.key);
    });
    options.appendChild(btn);
  });
  wrap.appendChild(options);
 
  const actions = el('div', 'modal-actions');
  const cancel = el('button', 'btn-secondary', 'Cancel');
  cancel.addEventListener('click', closeModal);
  actions.appendChild(cancel);
  wrap.appendChild(actions);
 
  openModal(wrap);
}
 
function resolveNecessity(c, chosenKey) {
  // Determine "correct" classification from the scenario's necessityStrength
  const strength = c.scenario.necessityStrength;
  let correctKey;
  if (strength >= 0.7) correctKey = 'strong';
  else if (strength >= 0.5) correctKey = 'moderate';
  else correctKey = 'weak';
 
  c.necessityChosen = chosenKey;
  c.necessityCorrect = (chosenKey === correctKey);
  addDays(c.scenario.baseDays.evaluate);
 
  if (c.necessityCorrect) {
    adjustEfficiency(+5);
    setEdu('✅ Necessity Classified Correctly',
      `${c.scenario.tips.necessity} You classified this case accurately, which keeps the review process smooth and avoids delays later. Next, collect the required documentation.`);
  } else {
    adjustEfficiency(-5);
    setEdu('⚠️ Necessity Classification Was Off',
      `${c.scenario.tips.necessity} Your classification didn't quite match the clinical picture — in real workflows this can lead to extra scrutiny, pends, or denials down the line. Proceed to document collection anyway.`);
  }
 
  c.stage = 'documents';
  renderAll();
}
 
/* ----------------------------------------------------------------
   12. DOCUMENT COLLECTION
   ---------------------------------------------------------------- */
function openDocsModal(c) {
  const wrap = el('div');
  wrap.appendChild(el('h2', null, '📄 Document Collection'));
  wrap.appendChild(el('p', null, `Check off every document the provider's office has gathered for ${c.scenario.patientName}. Real payers deny or pend requests when documentation is incomplete.`));
 
  const list = el('div', 'doc-checklist');
  c.scenario.requiredDocs.forEach(doc => {
    const label = el('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = !!c.docsCollected[doc.id];
    checkbox.addEventListener('change', () => {
      c.docsCollected[doc.id] = checkbox.checked;
    });
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(doc.label));
    list.appendChild(label);
  });
  wrap.appendChild(list);
 
  const actions = el('div', 'modal-actions');
  const done = el('button', 'btn-primary', 'Finish Collecting Documents');
  done.addEventListener('click', () => {
    closeModal();
    finishDocs(c);
  });
  const cancel = el('button', 'btn-secondary', 'Cancel');
  cancel.addEventListener('click', closeModal);
  actions.appendChild(done);
  actions.appendChild(cancel);
  wrap.appendChild(actions);
 
  openModal(wrap);
}
 
function finishDocs(c) {
  const total = c.scenario.requiredDocs.length;
  const collected = c.scenario.requiredDocs.filter(d => c.docsCollected[d.id]).length;
  c.docCompleteness = collected / total;
  addDays(c.scenario.baseDays.submit);
 
  if (collected === total) {
    adjustEfficiency(+8);
    setEdu('📄 Documentation Complete',
      `${c.scenario.tips.submit} All ${total} required documents were collected — this case is fully packaged and ready to submit to the payer.`);
  } else if (collected >= Math.ceil(total * 0.5)) {
    adjustEfficiency(-4);
    setEdu('📄 Documentation Partially Complete',
      `${c.scenario.tips.submit} Only ${collected} of ${total} documents were collected. Incomplete packets are one of the most common reasons real PA requests get pended for more information.`);
  } else {
    adjustEfficiency(-10);
    setEdu('📄 Documentation Largely Missing',
      `${c.scenario.tips.submit} Just ${collected} of ${total} documents were collected. In the real world, this level of missing documentation frequently leads straight to a denial or a lengthy pend.`);
  }
 
  c.stage = 'ready_submit';
  renderAll();
}
 
/* ----------------------------------------------------------------
   13. SUBMISSION TO PAYER
   ---------------------------------------------------------------- */
function submitToPayer(c) {
  c.stage = 'review';
  addDays(1);
  setEdu('📬 Submission Received',
    `The payer's utilization management team has logged the request for ${c.scenario.patientName}. Click "Run Payer Review" to see how the clinical review plays out based on the necessity and documentation quality you provided earlier.`);
  renderAll();
}
 
/* ----------------------------------------------------------------
   14. PAYER REVIEW ENGINE
   Combines: scenario necessityStrength, necessity classification
   accuracy, and document completeness into a single "case strength"
   score that drives the outcome.
   ---------------------------------------------------------------- */
function computeCaseStrength(c) {
  let score = c.scenario.necessityStrength; // 0..1 baseline
  score += c.necessityCorrect ? 0.12 : -0.12;
  score += (c.docCompleteness - 0.5) * 0.4; // reward full docs, punish missing docs
  return Math.max(0, Math.min(1, score));
}
 
function runPayerReview(c) {
  addDays(c.scenario.baseDays.review);
  const strength = computeCaseStrength(c);
  c.caseStrength = strength;
 
  if (strength >= 0.72) {
    c.stage = 'outcome';
    c.outcome = 'approved';
    STATE.approvedCount++;
    adjustEfficiency(+10);
    triggerCelebration();
    setEdu('🎉 Approved!',
      `${c.scenario.tips.review} Based on the strong necessity classification and documentation, the payer approved this request. Drag the case back to the Patient lane to finish the workflow.`);
  } else if (strength >= 0.5) {
    c.stage = 'pend';
    adjustEfficiency(-3);
    setEdu('⏳ Pended for More Information',
      `${c.scenario.tips.review} The case is borderline — the payer is requesting additional clinical information before deciding. Click "Provide Additional Info" to respond.`);
  } else if (strength >= 0.32) {
    c.stage = 'p2p';
    adjustEfficiency(-3);
    setEdu('📞 Peer-to-Peer Review Requested',
      `${c.scenario.tips.review} The payer's medical director wants to speak directly with the ordering provider before making a final call. Click "Conduct Peer-to-Peer Call" to proceed.`);
  } else {
    c.stage = 'outcome';
    c.outcome = 'denied';
    STATE.deniedCount++;
    adjustEfficiency(-8);
    setEdu('❌ Denied',
      `${c.scenario.tips.review} The documentation and necessity evidence didn't meet the payer's clinical criteria, so the request was denied. The provider can file an Appeal directly from the card.`);
  }
  renderAll();
}
 
function resolvePend(c) {
  addDays(2);
  // Providing extra info gives a modest boost to case strength, simulating
  // the value of supplemental documentation.
  c.caseStrength = Math.min(1, (c.caseStrength || 0.5) + 0.18);
  c.pendResolved = true;
  adjustEfficiency(+2);
  setEdu('📎 Additional Information Submitted',
    `The provider supplied the extra clinical detail the payer asked for. This often improves the odds of approval — the payer will now re-review the case.`);
  c.stage = 'review';
  renderAll();
}
 
function runPeerToPeer(c) {
  addDays(1);
  c.p2pUsed = true;
  // Peer-to-peer gives providers a chance to clarify clinical reasoning,
  // improving case strength somewhat.
  const boosted = Math.min(1, (c.caseStrength || 0.4) + 0.22);
  c.caseStrength = boosted;
  adjustEfficiency(+3);
 
  if (boosted >= 0.55) {
    c.stage = 'outcome';
    c.outcome = 'approved';
    STATE.approvedCount++;
    triggerCelebration();
    setEdu('🎉 Approved After Peer-to-Peer',
      `The ordering provider explained the clinical reasoning directly to the payer's medical director, who agreed the service was appropriate. Drag the case back to the Patient lane to finish.`);
  } else {
    c.stage = 'outcome';
    c.outcome = 'denied';
    STATE.deniedCount++;
    setEdu('❌ Still Denied After Peer-to-Peer',
      `Even after a direct conversation between clinicians, the payer's medical director felt the criteria weren't met. The provider can still file an Appeal.`);
  }
  renderAll();
}
 
/* ----------------------------------------------------------------
   15. APPEAL
   ---------------------------------------------------------------- */
function fileAppeal(c) {
  c.appealUsed = true;
  c.stage = 'appeal';
  addDays(3);
  adjustEfficiency(-2);
  setEdu('📝 Appeal Filed',
    `The provider has formally appealed the denial for ${c.scenario.patientName}, submitting additional clinical justification and requesting a second look from an independent reviewer. Click "Resolve Appeal" to see the outcome.`);
  renderAll();
}
 
function resolveAppeal(c) {
  addDays(2);
  // Appeals succeed more often when the underlying case wasn't hopeless.
  const base = c.caseStrength || 0.4;
  const appealStrength = Math.min(1, base + 0.25);
 
  if (appealStrength >= 0.55) {
    c.outcome = 'approved';
    STATE.approvedCount++;
    STATE.deniedCount = Math.max(0, STATE.deniedCount - 1);
    adjustEfficiency(+6);
    triggerCelebration();
    setEdu('🎉 Appeal Successful — Approved!',
      `An independent reviewer examined the full record, including the new appeal documentation, and overturned the original denial. Drag the case back to the Patient lane to finish.`);
  } else {
    c.outcome = 'denied';
    adjustEfficiency(-4);
    setEdu('❌ Appeal Upheld the Denial',
      `The independent reviewer agreed with the original decision. In the real world, patients can sometimes pursue an external review through their state's insurance department after this point.`);
  }
  c.stage = 'appeal_resolved';
  renderAll();
}
 
/* ----------------------------------------------------------------
   16. CELEBRATION ANIMATION (approval)
   ---------------------------------------------------------------- */
function triggerCelebration() {
  const layer = document.getElementById('celebration-layer');
  const colors = ['#1f6fd6', '#4fa3f7', '#0b3d78', '#2fae5a', '#ffd166', '#ffffff'];
  const pieceCount = 60;
  for (let i = 0; i < pieceCount; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    const duration = 1.8 + Math.random() * 1.4;
    piece.style.animationDuration = duration + 's';
    piece.style.animationDelay = (Math.random() * 0.4) + 's';
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    layer.appendChild(piece);
    // Clean up after animation completes
    setTimeout(() => piece.remove(), (duration + 0.6) * 1000);
  }
}
 
/* ----------------------------------------------------------------
   17. WORKFLOW SUMMARY
   ---------------------------------------------------------------- */
function showSummary(c) {
  const wrap = el('div');
  wrap.appendChild(el('h2', null, '📋 Workflow Summary'));
  wrap.appendChild(el('p', null, `${c.scenario.icon} <strong>${c.scenario.patientName}</strong> — ${c.scenario.service}`));
 
  const list = el('div', 'summary-list');
  const rows = [
    ['Scenario Type', c.scenario.name],
    ['Necessity Classification', c.necessityChosen ? capitalize(c.necessityChosen) + (c.necessityCorrect ? ' (accurate)' : ' (inaccurate)') : '—'],
    ['Documentation Completeness', c.docCompleteness !== undefined ? Math.round(c.docCompleteness * 100) + '%' : '—'],
    ['Peer-to-Peer Review Used', c.p2pUsed ? 'Yes' : 'No'],
    ['Appeal Filed', c.appealUsed ? 'Yes' : 'No'],
    ['Final Outcome', c.outcome ? capitalize(c.outcome) : '—'],
    ['Total Days Elapsed (Simulator)', STATE.daysElapsed],
    ['Current Efficiency Score', STATE.efficiency]
  ];
  rows.forEach(([label, value]) => {
    const row = el('div', 'row');
    row.appendChild(el('span', null, label));
    row.appendChild(el('span', null, String(value)));
    list.appendChild(row);
  });
  wrap.appendChild(list);
 
  const note = el('p', null, outcomeNarrative(c));
  note.style.marginTop = '12px';
  wrap.appendChild(note);
 
  const actions = el('div', 'modal-actions');
  const closeBtn = el('button', 'btn-primary', 'Close');
  closeBtn.addEventListener('click', closeModal);
  const newBtn = el('button', 'btn-secondary', 'Start Another Patient');
  newBtn.addEventListener('click', () => { closeModal(); showScenarioPicker(); });
  actions.appendChild(closeBtn);
  actions.appendChild(newBtn);
  wrap.appendChild(actions);
 
  openModal(wrap);
}
 
function outcomeNarrative(c) {
  if (c.outcome === 'approved') {
    return `This case reflects a healthy Prior Authorization journey: accurate necessity documentation and complete paperwork lead to faster, smoother approvals — which is better for patients and less costly for providers.`;
  }
  return `This case shows how incomplete documentation, weak necessity justification, or strict payer criteria can lead to denial. Understanding these levers is exactly why providers invest so much effort in getting PA submissions right the first time.`;
}
 
function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
 
/* ----------------------------------------------------------------
   18. RESTART
   ---------------------------------------------------------------- */
function restartSimulator() {
  STATE = {
    daysElapsed: 0,
    efficiency: 100,
    approvedCount: 0,
    deniedCount: 0,
    cases: [],
    caseSeq: 1
  };
  document.getElementById('statDays').textContent = 0;
  document.getElementById('statEfficiency').textContent = 100;
  closeModal();
  setEdu('👋 Welcome', 'Click "New Patient" to begin a Prior Authorization scenario, then drag the case card between lanes to move it through the workflow.');
  renderAll();
}
 
/* ----------------------------------------------------------------
   19. INITIAL RENDER
   ---------------------------------------------------------------- */
renderAll();
 
</script>
</body>
</html>
 
