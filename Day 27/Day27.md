

Pa story simulator · HTML
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Prior Authorization Story Simulator</title>
<script src="https://cdn.tailwindcss.com"></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,500&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  :root{
    --ink:#0d1b2a;
    --clinic-50:#f2f7fc;
    --clinic-100:#e3eefa;
    --clinic-200:#c7defa;
    --clinic-600:#175fb0;
    --clinic-700:#0d4585;
    --clinic-900:#0b3057;
    --teal-500:#0e9488;
    --amber-500:#c2790f;
    --rose-600:#b6402f;
  }
  html,body{ font-family:'Manrope', ui-sans-serif, system-ui; background:var(--clinic-50); color:var(--ink); }
  .font-serif-narrator{ font-family:'Source Serif 4', Georgia, serif; }
  ::-webkit-scrollbar{ width:8px; }
  ::-webkit-scrollbar-thumb{ background:#c7defa; border-radius:8px; }
 
  /* Chat bubble entrance */
  @keyframes riseIn { from{opacity:0; transform:translateY(10px);} to{opacity:1; transform:translateY(0);} }
  .bubble-enter{ animation: riseIn .35s ease-out both; }
 
  @media (prefers-reduced-motion: reduce){
    .bubble-enter{ animation:none; }
  }
 
  .stage-dot{ transition: background-color .3s ease, border-color .3s ease, color .3s ease; }
 
  .choice-btn{ transition: transform .15s ease, box-shadow .15s ease, background-color .15s ease; }
  .choice-btn:hover{ transform: translateY(-2px); }
  .choice-btn:disabled{ opacity:.45; cursor:not-allowed; transform:none; }
 
  .illustrative-tag{
    font-size:.62rem; letter-spacing:.04em; text-transform:uppercase;
  }
</style>
</head>
<body class="min-h-screen">
 
<div class="max-w-3xl mx-auto px-4 pb-40">
 
  <!-- ================= HEADER / PROGRESS ================= -->
  <header class="sticky top-0 z-20 bg-[var(--clinic-50)]/95 backdrop-blur pt-5 pb-3 mb-2">
    <div class="flex items-center justify-between mb-1">
      <div>
        <h1 class="text-lg sm:text-xl font-extrabold text-[var(--clinic-900)] tracking-tight">The Prior Authorization Journey</h1>
        <p class="text-xs text-[var(--clinic-700)]/80 mt-0.5">A step-by-step story · Rahul &amp; Priya walk through how Prior Auth really works</p>
      </div>
      <span class="illustrative-tag hidden sm:inline-block bg-[var(--clinic-100)] text-[var(--clinic-700)] font-bold px-2 py-1 rounded-full border border-[var(--clinic-200)]">Educational · Not Medical Advice</span>
    </div>
 
    <!-- Progress bar -->
    <div id="progressBar" class="mt-3 flex items-center gap-1"></div>
    <div id="progressLabel" class="mt-1 text-[11px] font-semibold text-[var(--clinic-700)] uppercase tracking-wide"></div>
  </header>
 
  <!-- ================= CHAT FEED ================= -->
  <main id="chat" class="flex flex-col gap-3 pt-2"></main>
 
  <!-- ================= CHOICES (fixed footer) ================= -->
  <div id="choiceDock" class="fixed bottom-0 left-0 right-0 z-30">
    <div class="max-w-3xl mx-auto px-4 pb-4 pt-6 bg-gradient-to-t from-[var(--clinic-50)] via-[var(--clinic-50)]/95 to-transparent">
      <div id="choiceArea" class="flex flex-col sm:flex-row gap-2"></div>
    </div>
  </div>
 
</div>
 
<script>
/* =========================================================================
   PRIOR AUTHORIZATION STORY SIMULATOR
   - Append-only chat feed (createElement + appendChild only, never innerHTML
     on the chat container).
   - 8 linear scenes with a progress bar; each scene ends in 2 choices that
     flavor the following dialogue but do not branch the overall storyline
     (the PA process itself always follows the same 8 real-world steps).
   ========================================================================= */
 
const chat = document.getElementById('chat');
const choiceArea = document.getElementById('choiceArea');
const progressBar = document.getElementById('progressBar');
const progressLabel = document.getElementById('progressLabel');
 
/* -------------------------------------------------------------------------
   SCENE / PROGRESS METADATA
   ------------------------------------------------------------------------- */
const SCENES = [
  { key:'visit',    label:'Doctor Visit' },
  { key:'roadblock',label:'Insurance Roadblock' },
  { key:'whatispa', label:'What is PA?' },
  { key:'review',   label:'Insurance Review' },
  { key:'denial',   label:'Denial' },
  { key:'appeal',   label:'Appeal' },
  { key:'approval', label:'Approval' },
  { key:'takeaways',label:'Takeaways' }
];
 
let currentSceneIndex = 0;
 
function renderProgressBar(){
  progressBar.innerHTML = ''; // progress bar is decorative chrome, not the chat feed — fine to reset
  SCENES.forEach((s, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'flex-1 flex flex-col items-center gap-1';
 
    const dot = document.createElement('div');
    dot.className = 'stage-dot w-full h-1.5 rounded-full border';
    if (i < currentSceneIndex) {
      dot.style.background = 'var(--clinic-600)';
      dot.style.borderColor = 'var(--clinic-600)';
    } else if (i === currentSceneIndex) {
      dot.style.background = 'var(--teal-500)';
      dot.style.borderColor = 'var(--teal-500)';
    } else {
      dot.style.background = 'var(--clinic-100)';
      dot.style.borderColor = 'var(--clinic-200)';
    }
    wrap.appendChild(dot);
    progressBar.appendChild(wrap);
  });
  progressLabel.textContent = `Step ${currentSceneIndex + 1} of ${SCENES.length} · ${SCENES[currentSceneIndex].label}`;
}
 
/* -------------------------------------------------------------------------
   CHAT-BUILDING HELPERS
   All functions build DOM nodes with document.createElement and attach them
   with appendChild. The #chat container itself is only ever appended to.
   ------------------------------------------------------------------------- */
 
function scrollChatToBottom(){
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}
 
// Centered italic narrator / doctor line (never a chat bubble)
function addNarration(text, opts = {}){
  const row = document.createElement('div');
  row.className = 'bubble-enter w-full flex justify-center my-2';
 
  const p = document.createElement('p');
  p.className = 'font-serif-narrator italic text-[13.5px] sm:text-sm text-[var(--clinic-900)]/80 text-center max-w-xl leading-relaxed px-4';
  if (opts.speaker) {
    const strong = document.createElement('span');
    strong.className = 'not-italic font-semibold text-[var(--clinic-700)]';
    strong.textContent = opts.speaker + ': ';
    p.appendChild(strong);
    p.appendChild(document.createTextNode(text));
  } else {
    p.textContent = text;
  }
  row.appendChild(p);
  chat.appendChild(row);
  scrollChatToBottom();
}
 
// Scene divider — a small centered label marking a new chapter
function addSceneDivider(title, icon){
  const row = document.createElement('div');
  row.className = 'bubble-enter w-full flex items-center gap-3 my-5';
 
  const line1 = document.createElement('div');
  line1.className = 'flex-1 h-px bg-[var(--clinic-200)]';
  const line2 = document.createElement('div');
  line2.className = 'flex-1 h-px bg-[var(--clinic-200)]';
 
  const label = document.createElement('div');
  label.className = 'flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[var(--clinic-200)] text-[11px] font-bold uppercase tracking-wide text-[var(--clinic-700)] shadow-sm';
  label.textContent = (icon ? icon + ' ' : '') + title;
 
  row.appendChild(line1);
  row.appendChild(label);
  row.appendChild(line2);
  chat.appendChild(row);
  scrollChatToBottom();
}
 
// Chat bubble for Rahul (left) or Priya (right)
function addBubble(character, text){
  const isRahul = character === 'rahul';
  const row = document.createElement('div');
  row.className = 'bubble-enter w-full flex ' + (isRahul ? 'justify-start' : 'justify-end');
 
  const stack = document.createElement('div');
  stack.className = 'flex items-end gap-2 max-w-[85%] sm:max-w-[75%] ' + (isRahul ? 'flex-row' : 'flex-row-reverse');
 
  const avatar = document.createElement('div');
  avatar.className = 'w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-base shadow-sm border ' +
    (isRahul ? 'bg-[var(--clinic-100)] border-[var(--clinic-200)]' : 'bg-teal-50 border-teal-200');
  avatar.textContent = isRahul ? '👦' : '👧';
 
  const bubbleCol = document.createElement('div');
  bubbleCol.className = 'flex flex-col ' + (isRahul ? 'items-start' : 'items-end');
 
  const nameTag = document.createElement('span');
  nameTag.className = 'text-[10px] font-bold uppercase tracking-wide mb-1 ' +
    (isRahul ? 'text-[var(--clinic-700)]' : 'text-teal-700');
  nameTag.textContent = isRahul ? 'Rahul · Patient' : 'Priya · Healthcare Ops Specialist';
 
  const bubble = document.createElement('div');
  bubble.className = 'px-4 py-2.5 rounded-2xl text-[13.5px] sm:text-sm leading-relaxed shadow-sm border ' +
    (isRahul
      ? 'bg-white border-[var(--clinic-200)] text-[var(--ink)] rounded-bl-sm'
      : 'bg-[var(--clinic-700)] border-[var(--clinic-700)] text-white rounded-br-sm');
  bubble.textContent = text;
 
  bubbleCol.appendChild(nameTag);
  bubbleCol.appendChild(bubble);
  stack.appendChild(avatar);
  stack.appendChild(bubbleCol);
  row.appendChild(stack);
  chat.appendChild(row);
  scrollChatToBottom();
}
 
// Small info/citation card (used for stats + citations, still not a chat bubble)
function addInfoCard(title, body, tone = 'clinic'){
  const toneMap = {
    clinic: { bg:'bg-[var(--clinic-100)]', border:'border-[var(--clinic-200)]', text:'text-[var(--clinic-900)]', title:'text-[var(--clinic-700)]' },
    amber:  { bg:'bg-amber-50', border:'border-amber-200', text:'text-[var(--ink)]', title:'text-[var(--amber-500)]' },
    rose:   { bg:'bg-rose-50', border:'border-rose-200', text:'text-[var(--ink)]', title:'text-[var(--rose-600)]' },
    teal:   { bg:'bg-teal-50', border:'border-teal-200', text:'text-[var(--ink)]', title:'text-[var(--teal-500)]' },
  };
  const t = toneMap[tone] || toneMap.clinic;
 
  const row = document.createElement('div');
  row.className = 'bubble-enter w-full flex justify-center my-2';
 
  const card = document.createElement('div');
  card.className = `max-w-xl w-full ${t.bg} border ${t.border} rounded-xl px-4 py-3`;
 
  const h = document.createElement('div');
  h.className = `text-[11px] font-extrabold uppercase tracking-wide mb-1 ${t.title}`;
  h.textContent = title;
 
  const b = document.createElement('div');
  b.className = `text-[13px] leading-relaxed ${t.text}`;
  b.textContent = body;
 
  card.appendChild(h);
  card.appendChild(b);
  row.appendChild(card);
  chat.appendChild(row);
  scrollChatToBottom();
}
 
// Illustrative-example tag, used whenever "StarCare Health" is mentioned in a card context
function addIllustrativeNote(){
  const row = document.createElement('div');
  row.className = 'bubble-enter w-full flex justify-center';
 
  const tag = document.createElement('span');
  tag.className = 'illustrative-tag text-[var(--clinic-700)]/70 font-semibold';
  tag.textContent = '"StarCare Health" is an illustrative example payer — used to show how a typical insurer works, not a real company.';
  row.appendChild(tag);
  chat.appendChild(row);
  scrollChatToBottom();
}
 
// Renders the 2 choice buttons for the current scene beat
function setChoices(choices){
  choiceArea.innerHTML = ''; // choiceArea is a controls dock, not the chat feed — safe to reset each beat
  choices.forEach(choice => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn flex-1 bg-white hover:bg-[var(--clinic-100)] border border-[var(--clinic-200)] rounded-xl px-4 py-3 text-left shadow-sm';
 
    const label = document.createElement('div');
    label.className = 'text-[13px] font-bold text-[var(--clinic-900)]';
    label.textContent = choice.label;
 
    const sub = document.createElement('div');
    sub.className = 'text-[11.5px] text-[var(--clinic-700)]/70 mt-0.5';
    sub.textContent = choice.sub || '';
 
    btn.appendChild(label);
    if (choice.sub) btn.appendChild(sub);
 
    btn.addEventListener('click', () => {
      // Lock all choice buttons after a selection so the feed stays append-only
      Array.from(choiceArea.children).forEach(c => c.disabled = true);
      logChoiceEcho(choice.label);
      choice.onSelect();
    });
 
    choiceArea.appendChild(btn);
  });
}
 
// Small right-aligned "you chose" echo so the transcript reads naturally
function logChoiceEcho(labelText){
  const row = document.createElement('div');
  row.className = 'bubble-enter w-full flex justify-end my-1';
 
  const tag = document.createElement('span');
  tag.className = 'text-[11px] font-semibold text-white bg-[var(--clinic-600)]/80 px-3 py-1 rounded-full';
  tag.textContent = '✓ You chose: ' + labelText;
 
  row.appendChild(tag);
  chat.appendChild(row);
  scrollChatToBottom();
}
 
function clearChoices(){
  choiceArea.innerHTML = '';
}
 
function goToScene(index){
  currentSceneIndex = index;
  renderProgressBar();
}
 
/* =========================================================================
   SCENE 1 — DOCTOR VISIT
   ========================================================================= */
function scene1_doctorVisit(){
  goToScene(0);
  addSceneDivider('Scene 1 — Doctor Visit', '🏥');
  addNarration('Rahul has had swollen, painful joints for weeks. Today, he finally sees a specialist at City Medical Center.');
  addBubble('rahul', "Dr. Patel, my hands and knees have been stiff and swollen for almost two months now. It's worse in the mornings.");
  addNarration("Dr. Patel examines Rahul's joints and orders blood work.", { speaker: 'Dr. Patel' });
  addNarration("Your bloodwork and symptoms point to Rheumatoid Arthritis — an autoimmune condition where the immune system attacks the joints. I'm prescribing Humira, a biologic medication that can control this effectively.", { speaker: 'Dr. Patel' });
  addBubble('rahul', "Okay... is that something I just pick up at the pharmacy?");
 
  setChoices([
    {
      label: "Ask Dr. Patel why this medicine specifically",
      sub: "Understand the reasoning behind the prescription",
      onSelect: () => {
        addBubble('rahul', "Why Humira and not something simpler first?");
        addNarration("Humira is a biologic — it's very effective for aggressive RA, but it's also expensive and tightly monitored by insurers. Because of that, most insurance plans won't fill it without a special approval process first.", { speaker: 'Dr. Patel' });
        scene2_insuranceRoadblock();
      }
    },
    {
      label: "Just ask what happens next",
      sub: "Get straight to the practical next step",
      onSelect: () => {
        addBubble('rahul', "What do I need to do to actually get it?");
        addNarration("It's not quite that simple. Humira usually requires something called Prior Authorization before insurance will cover it. My office will start that process for you.", { speaker: 'Dr. Patel' });
        scene2_insuranceRoadblock();
      }
    }
  ]);
}
 
/* =========================================================================
   SCENE 2 — INSURANCE ROADBLOCK
   ========================================================================= */
function scene2_insuranceRoadblock(){
  goToScene(1);
  addSceneDivider('Scene 2 — Insurance Roadblock', '🧾');
  addNarration("Dr. Patel's office prepares a Prior Authorization (PA) request. No pharmacy is involved yet — this goes straight from the provider to the insurance company.");
  addInfoCard(
    'How this request travels',
    'Provider (City Medical Center) → PA Request → Payer (StarCare Health, illustrative example). The pharmacy is not part of this step — it only gets involved after the PA is approved.',
    'clinic'
  );
  addIllustrativeNote();
  addNarration("We've submitted the Prior Authorization request to StarCare Health on your behalf. It includes your diagnosis, my clinical notes, and the reason Humira is medically appropriate for you.", { speaker: 'Dr. Patel' });
  addBubble('rahul', "So now I just... wait? What is Prior Authorization, exactly?");
 
  setChoices([
    {
      label: "I've never heard of PA — explain it simply",
      sub: "Get the plain-language basics from Priya",
      onSelect: () => scene3_whatIsPA('beginner')
    },
    {
      label: "I've heard of PA but don't get why it exists",
      sub: "Understand the reasoning behind it",
      onSelect: () => scene3_whatIsPA('why')
    }
  ]);
}
 
/* =========================================================================
   SCENE 3 — WHAT IS PA?
   ========================================================================= */
function scene3_whatIsPA(variant){
  goToScene(2);
  addSceneDivider('Scene 3 — What is Prior Authorization?', '💡');
  addNarration("Priya, a healthcare operations specialist, joins the conversation to help Rahul understand what's happening behind the scenes.");
 
  if (variant === 'beginner') {
    addBubble('priya', "Hi Rahul! Prior Authorization — or 'PA' — is basically your insurance company saying: 'Before we pay for this, show us it's medically necessary.' It's a checkpoint, not a rejection.");
  } else {
    addBubble('priya', "Good question. PA exists because expensive or high-risk treatments need a second set of eyes — insurers use it to confirm the treatment matches accepted medical guidelines before they commit to paying for it.");
  }
 
  addBubble('rahul', "Okay, but why does that need to happen before I even start? Isn't that just extra paperwork slowing me down?");
  addBubble('priya', "It can feel that way — but for aggressive diagnoses like yours, this isn't just bureaucracy. Every week of delay can let joint damage progress further, so how smoothly this process runs actually matters for your health, not just your paperwork.");
 
  addInfoCard(
    'Worth knowing',
    'AMA 2023 PA Survey: Prior Authorization causes treatment delays in the majority of cases reported by physicians.',
    'amber'
  );
 
  addBubble('priya', "That's exactly why I do this work — making sure PA requests are complete and accurate the first time, so patients like you aren't stuck waiting longer than necessary.");
 
  setChoices([
    {
      label: "What exactly does the insurance company check?",
      sub: "Walk through the review criteria",
      onSelect: () => scene4_insuranceReview()
    },
    {
      label: "Can this go wrong? What if it's denied?",
      sub: "Prepare for the possibility of denial",
      onSelect: () => scene4_insuranceReview(true)
    }
  ]);
}
 
/* =========================================================================
   SCENE 4 — INSURANCE REVIEW
   ========================================================================= */
function scene4_insuranceReview(mentionedDenialEarly){
  goToScene(3);
  addSceneDivider('Scene 4 — Insurance Review', '🔍');
  addIllustrativeNote();
  addBubble('priya', "Let me walk you through what StarCare Health is actually checking on their end. There are four main things.");
 
  if (mentionedDenialEarly) {
    addBubble('priya', "And yes — it absolutely can come back denied. Let's go through the checks first, so you'll understand exactly why that happens if it does.");
  }
 
  addInfoCard('1. Eligibility', "Is Rahul actively enrolled in a StarCare Health plan, and does that plan cover Humira at all? If coverage isn't active, nothing else matters.", 'clinic');
  addInfoCard('2. Clinical Documentation', "Did Dr. Patel's office include exam notes, lab results, and a clear rationale? Missing notes are one of the most common reasons requests stall.", 'clinic');
  addInfoCard('3. ICD-10 Diagnosis Match', "Does the diagnosis code on file (Rheumatoid Arthritis) actually match what Humira is approved to treat? A mismatched code can trigger an automatic flag.", 'clinic');
  addInfoCard('4. Step Therapy History', "Has Rahul already tried lower-cost, standard medications first, and did they fail to work? Many plans require this 'step therapy' proof before approving a biologic like Humira.", 'clinic');
 
  addBubble('priya', "Each of these exists to confirm the treatment is necessary, appropriate, and that cheaper options were genuinely considered first — not just to add hurdles.");
  addBubble('rahul', "Hm. Step therapy... I don't think Dr. Patel mentioned me trying anything else first.");
  addBubble('priya', "That's worth flagging — let's see what StarCare Health actually comes back with.");
 
  setChoices([
    {
      label: "See what StarCare Health decides",
      sub: "Move forward to the outcome",
      onSelect: () => scene5_denial()
    },
    {
      label: "Ask if missing step therapy is a big deal",
      sub: "Get ahead of the risk",
      onSelect: () => {
        addBubble('rahul', "Is that going to be a problem?");
        addBubble('priya', "It can be — step therapy documentation is one of the top reasons PA requests get denied. Let's see what happens.");
        scene5_denial();
      }
    }
  ]);
}
 
/* =========================================================================
   SCENE 5 — DENIAL
   ========================================================================= */
function scene5_denial(){
  goToScene(4);
  addSceneDivider('Scene 5 — Denial', '⚠️');
  addNarration("A few days later, a determination letter arrives from StarCare Health.");
  addInfoCard(
    'Determination: Denied',
    'Reason: Missing documentation of step therapy — no record showing Rahul tried and failed standard, lower-cost RA medications before Humira.',
    'rose'
  );
  addBubble('rahul', "Denied?! Does that mean I just... don't get the medication?");
  addBubble('priya', "No — take a breath. A denial is not the end of the road. It almost always means something specific is missing, not that the treatment itself was rejected forever.");
  addBubble('priya', "In your case, it's very fixable: we just need documentation showing why step therapy either was tried, or why it isn't appropriate for you.");
 
  addInfoCard(
    'What this costs on the system side',
    'PA denials typically cost physician offices 2+ staff hours to resolve — gathering records, writing justifications, and refiling. That is time and effort on top of the delay you experience as a patient.',
    'amber'
  );
 
  addBubble('rahul', "So what happens now?");
 
  setChoices([
    {
      label: "Ask what Rahul needs to do next",
      sub: "Get practical next steps",
      onSelect: () => scene6_appeal()
    },
    {
      label: "Ask if this happens to a lot of people",
      sub: "Get context on how common this is",
      onSelect: () => {
        addBubble('rahul', "Does this happen to a lot of patients?");
        addBubble('priya', "More than people realize — which is exactly why the appeal process exists and works. It's a normal, expected part of the system, not a dead end.");
        scene6_appeal();
      }
    }
  ]);
}
 
/* =========================================================================
   SCENE 6 — APPEAL
   ========================================================================= */
function scene6_appeal(){
  goToScene(5);
  addSceneDivider('Scene 6 — Appeal', '📄');
  addBubble('priya', "Here's the plan: Dr. Patel's office will gather what's missing, and we'll file a formal appeal with StarCare Health.");
 
  addInfoCard('Step 1 — Gather Documents', "Full history of prior RA treatments (if any), current symptom severity, lab results, and imaging, all pulled together in one packet.", 'teal');
  addInfoCard('Step 2 — Letter of Medical Necessity', "Dr. Patel writes a formal letter explaining, in clinical terms, exactly why Humira is appropriate for Rahul now — including why step therapy isn't a safe option to delay further, given how aggressive his case is.", 'teal');
  addInfoCard('Step 3 — File the Formal Appeal', "The completed packet, plus the Letter of Medical Necessity, is submitted to StarCare Health as a formal appeal — a request to reconsider the original denial.", 'teal');
 
  addBubble('rahul', "How long does an appeal usually take?");
  addBubble('priya', "It varies by plan, but this is exactly the kind of case appeals are built for — a real clinical reason, backed by proper documentation. Let's see how StarCare Health responds.");
 
  setChoices([
    {
      label: "Submit the appeal and see the outcome",
      sub: "Move forward to the decision",
      onSelect: () => scene7_approval()
    },
    {
      label: "Ask what happens if the appeal is denied too",
      sub: "Understand the fallback options",
      onSelect: () => {
        addBubble('rahul', "And if this appeal gets denied too?");
        addBubble('priya', "Then there are further options, like an external review by an independent third party — but most well-documented appeals like yours succeed at this stage. Let's see.");
        scene7_approval();
      }
    }
  ]);
}
 
/* =========================================================================
   SCENE 7 — APPROVAL
   ========================================================================= */
function scene7_approval(){
  goToScene(6);
  addSceneDivider('Scene 7 — Approval', '✅');
  addNarration("A week later, a new letter arrives from StarCare Health.");
  addInfoCard(
    'Determination: Approved',
    'Reference Number: SC-PA-88213-RA. The Prior Authorization for Humira is approved and saved on file — no repeat PA is required for this medication going forward.',
    'teal'
  );
  addBubble('priya', "Rahul, this is great news — you're approved! With the corrected documentation, StarCare Health confirmed medical necessity.");
  addBubble('rahul', "That's such a relief. So I don't have to go through all of this again next time?");
  addBubble('priya', "Correct — this approval is saved on file. As long as you stay on this treatment and plan, you won't need to repeat the full PA process for Humira again.");
  addBubble('rahul', "Thank you for walking me through all of this, Priya. I honestly had no idea any of this was happening behind the scenes.");
 
  setChoices([
    {
      label: "Reflect on what this journey taught Rahul",
      sub: "Wrap up the patient's perspective",
      onSelect: () => scene8_takeaways()
    },
    {
      label: "Ask how health systems learn from cases like this",
      sub: "See the bigger operational picture",
      onSelect: () => {
        addBubble('rahul', "Does StarCare Health track cases like mine to improve things?");
        addBubble('priya', "They do — that's actually a big part of my job. Let me show you what that looks like.");
        scene8_takeaways();
      }
    }
  ]);
}
 
/* =========================================================================
   SCENE 8 — TAKEAWAYS
   ========================================================================= */
function scene8_takeaways(){
  goToScene(7);
  addSceneDivider('Scene 8 — Takeaways', '🎓');
  addNarration("Looking back at the journey, there are two very different — but connected — perspectives on what just happened.");
 
  addInfoCard(
    "Rahul's Perspective — The Patient",
    "PA felt confusing and slow at first, but understanding the 4 review checks, why denials happen, and that an appeal is a normal recovery path made it far less stressful. Documentation — not the diagnosis itself — was the real obstacle.",
    'clinic'
  );
 
  addInfoCard(
    "Priya's Perspective — The System",
    "Health systems like StarCare Health (illustrative example) track PA performance using a few key metrics: Denial Rate (% of PA requests denied), Appeal Rate (% of denials that get appealed), and Resolution Time (how long the full cycle takes from request to final decision). Reducing avoidable denials — like missing step therapy documentation — improves outcomes for patients and reduces staff hours spent on rework.",
    'teal'
  );
 
  addBubble('priya', "The honest takeaway is this: PA exists to check necessity and cost — but when documentation is done right the first time, it moves a lot faster than most patients expect.");
  addBubble('rahul', "I get it now. Thanks, Priya — I feel a lot more prepared for next time.");
 
  addNarration("— End of Story —");
 
  setChoices([
    {
      label: "Restart the story",
      sub: "Watch Rahul's journey again from the beginning",
      onSelect: () => {
        // Restart clears the feed via removeChild (never innerHTML) to respect append-only construction
        while (chat.firstChild) chat.removeChild(chat.firstChild);
        scene1_doctorVisit();
      }
    },
    {
      label: "Finish here",
      sub: "End the simulation",
      onSelect: () => {
        clearChoices();
        addNarration("Thanks for following Rahul's Prior Authorization journey. Reload the page any time to start again.");
      }
    }
  ]);
}
 
/* =========================================================================
   BOOT
   ========================================================================= */
renderProgressBar();
scene1_doctorVisit();
 
</script>
</body>
</html>
 
