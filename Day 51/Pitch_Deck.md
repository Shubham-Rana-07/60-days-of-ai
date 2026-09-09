# HireLens
## AI Job Match & Resume Analyzer

*Pitch Deck — AB Talks 60-Day Claude AI Challenge, 10-Day Capstone*
*Ansh Shukla*

---

## Slide 1 — Title

# HireLens
### See your resume the way an ATS — and a recruiter — sees it.

An AI-powered resume analyzer that shows job seekers exactly how well they match a job, and how to improve.

---

## Slide 2 — The Problem

### Great candidates are getting filtered out before a human ever reads their resume.

- Most mid-to-large companies (TCS, Infosys, Wipro, Accenture, Cognizant, Capgemini, Deloitte, and product companies) use Applicant Tracking Systems (ATS) to filter resumes automatically.
- Candidates rarely know **why** they were rejected — was it formatting? Missing keywords? Poor alignment with the role?
- Generic "resume tips" articles don't address the *specific* job a candidate is applying to.
- The result: qualified candidates lose opportunities not because they lack skills, but because their resume isn't communicating them in a way the system — or the recruiter — can see.

---

## Slide 3 — Target Users

### Built for the people who need it most right now.

**Primary: Early-career job seekers in Indian IT**
- Final-year students, MCA/B.Tech graduates, freshers (0–2 years experience)
- Applying to IT services firms and product companies
- Motivated, but without access to personalized resume coaching

**Secondary: Early-career professionals switching roles**
- 1–3 years of experience, applying to multiple roles with different JDs
- Need to quickly understand skill gaps per opportunity

**v1.0 focus:** Indian IT job market — the same market Ansh is personally navigating, ensuring every design decision is grounded in real, first-hand context.

---

## Slide 4 — The Solution

### One workflow. Real answers. No guesswork.

1. **Upload your resume** (PDF or DOCX)
2. **Paste the job description** you're applying to
3. **Get instant, explainable analysis:**
   - ATS Compatibility Score
   - Resume-to-Job Match Percentage
   - Missing Skills & Keywords
4. **Get AI-powered, personalized suggestions** — not generic advice, but specific improvements grounded in your actual resume and this actual job
5. **Download a professional PDF report** to guide your revisions

No accounts. No friction. Just a clear, honest picture of where you stand — and how to improve.

---

## Slide 5 — Key Features

| Feature | What It Does |
|---|---|
| 📄 **Smart Resume Parsing** | Reliable text extraction from PDF and DOCX resumes, tested across real-world formatting variations |
| ✅ **ATS Compatibility Score** | Rule-based evaluation of how ATS-friendly your resume structure is |
| 🎯 **Resume-to-Job Match %** | Deterministic scoring of how well your resume aligns with a specific job description |
| 🔍 **Missing Skills Detection** | A clear, categorized list of skills the job wants that your resume doesn't currently show |
| 🧠 **AI-Powered Suggestions** | Claude-generated, structured, actionable feedback — grounded in your real gaps, not generic tips |
| 📥 **Downloadable PDF Report** | A clean, professional report you can save, revisit, or share |
| 📱 **Modern Responsive Dashboard** | A polished experience on both desktop and mobile |

---

## Slide 6 — Technical Approach

### Reliability where it matters. Intelligence where it counts.

**A deliberate hybrid architecture:**

- **Rule-based core (fast, free, always available):** ATS scoring, match percentage, and missing-skills detection run on deterministic algorithms — no dependency on an external API, no unpredictability, consistent results every time.
- **AI-powered layer (genuine intelligence):** Personalized improvement suggestions and career advice are generated via the Claude API, using a tightly structured prompt for consistent, parseable, high-quality output.
- **Provider-agnostic AI service layer:** The AI integration is isolated behind a clean interface — the underlying AI provider can be swapped in the future without touching the rest of the application.
- **Graceful degradation:** If the AI service is ever unavailable, the core scoring workflow still works — the product never fully breaks.

**Engineering principles applied throughout:**
- Clear separation of concerns (parsing / scoring / AI / reporting / UI as independent modules)
- Defensive error handling at every external boundary (file uploads, AI calls)
- Environment-based secrets management
- Structured testing across real-world resume and job description variations

*(Full technology stack finalized during the Design phase — Day 2 — following proper requirements-first engineering practice.)*

---

## Slide 7 — Why This Approach Works

### Best of both worlds.

| | Pure Rule-Based | Pure AI-Based | HireLens (Hybrid) |
|---|---|---|---|
| Consistent scoring every time | ✅ | ❌ | ✅ |
| Works even if AI API is down | ✅ | ❌ | ✅ |
| Genuinely personalized feedback | ❌ | ✅ | ✅ |
| Low operating cost | ✅ | ❌ | ✅ |
| Reliable for live demos | ✅ | ⚠️ | ✅ |

HireLens isn't "AI for AI's sake." Every part of the architecture is chosen deliberately based on what that specific task actually needs.

---

## Slide 8 — v1.0 Scope Discipline

### Shipped, not stretched.

**In v1.0:** A single, complete, polished workflow — resume upload → job description input → analysis → AI suggestions → PDF report — with no login required.

**Deliberately excluded from v1.0** (to protect quality and guarantee delivery):
- User accounts & authentication
- Resume history / saved reports
- Recruiter-facing tools
- Job scraping / live job portal integrations
- Payments or subscriptions
- Native mobile app

This wasn't a limitation — it was a decision. **A smaller, fully-finished product beats a bigger, half-built one.**

---

## Slide 9 — Future Scope (v2.0 and Beyond)

### Where HireLens goes next.

- 🔐 **User accounts** — save history, track progress over time
- 📊 **Personalized dashboards** — multiple job applications tracked side-by-side
- 🏢 **Recruiter tools** — bulk resume screening, candidate ranking
- 🌍 **Global expansion** — beyond Indian IT into other markets and industries
- 🔗 **Live job portal integrations** — analyze against real, live job postings
- ✍️ **Resume builder** — real-time score feedback while editing

The v1.0 architecture is intentionally designed so these additions extend the system rather than requiring a rebuild.

---

## Slide 10 — Vision

### Every job seeker deserves to know exactly where they stand — and exactly how to improve.

HireLens started as a 10-day capstone, but it's built on a real, personally-felt problem: talented candidates losing opportunities to invisible, unexplained filters.

The long-term vision is a product that gives every candidate — starting with Indian IT job seekers, and eventually far beyond — the same clarity and coaching that only well-connected candidates typically get access to.

**HireLens: Clarity before you click submit.**

---

## Slide 11 — Thank You

# HireLens
### AI Job Match & Resume Analyzer

**Built by Ansh Shukla**
*AB Talks 60-Day Claude AI Challenge — 10-Day Capstone*

🔗 Live Demo: *[link added Day 10]*
💻 GitHub: *[link added Day 10]*
🎥 Demo Video: *[link added Day 10]*

---

*End of Pitch Deck — HireLens v1.0*
