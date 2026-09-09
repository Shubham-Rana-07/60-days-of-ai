# Product Requirements Document (PRD)
## HireLens — AI Job Match & Resume Analyzer

**Version:** 1.0
**Date:** August 6, 2026
**Author:** Ansh Shukla
**Status:** Approved for Development (AB Talks 60-Day Claude AI Challenge — 10-Day Capstone)

---

## 1. Executive Summary

HireLens is a portfolio-grade, single-user web application that helps Indian job seekers — students, freshers, and early-career professionals in IT and software roles — understand exactly how well their resume matches a target job description, and how to improve it.

Users upload a resume (PDF/DOCX) and paste or upload a job description. HireLens returns a rule-based ATS compatibility score, a resume-to-job match percentage, a list of missing skills and keywords, and AI-generated, personalized improvement suggestions — then lets the user download a professional PDF report summarizing everything.

HireLens combines **deterministic, algorithmic scoring** (fast, reliable, free) with **genuine AI-powered guidance** (via the Claude API, through a swappable AI provider layer) — giving users consistency and trust, while still feeling intelligent and personalized.

---

## 2. Problem Statement

Job seekers in India applying to IT roles at companies like TCS, Infosys, Wipro, Accenture, Cognizant, Capgemini, Deloitte, and product-based companies frequently have their resumes filtered out by Applicant Tracking Systems (ATS) before a human ever reads them — often due to formatting issues, missing keywords, or poor alignment with the job description.

Most candidates:
- Don't know their resume is being algorithmically filtered.
- Don't know which specific skills or keywords are missing.
- Don't have access to actionable, personalized feedback on how to fix it.
- Rely on generic "resume tips" articles instead of feedback specific to the job they're applying for.

**HireLens closes this gap** by giving candidates a fast, specific, data-backed, and AI-personalized view of how their resume performs against a real job description — before they hit submit.

---

## 3. Goals and Objectives

### 3.1 Product Goals
- Give users an accurate, explainable ATS compatibility score.
- Quantify resume-to-job fit as a clear match percentage.
- Identify specific missing skills and keywords, not vague advice.
- Provide AI-generated, actionable improvement suggestions tailored to the specific resume and job description.
- Let users walk away with a professional, shareable PDF report.

### 3.2 Capstone Goals
- Ship a fully deployed, portfolio-ready v1.0 by Day 10.
- Demonstrate strong product thinking, clean software architecture, and practical AI integration.
- Produce a project Ansh can confidently discuss in technical interviews.

### 3.3 Non-Goals (v1.0)
- This is **not** a job board, job scraper, or job application tracker.
- This is **not** a multi-user SaaS platform with accounts in v1.0.
- This is **not** a recruiter-facing tool in v1.0.

---

## 4. Target Users

### Primary Persona: "Early-Career Aditi"
- Final-year engineering/MCA student or fresher (0–2 years experience).
- Applying to Indian IT services firms and product companies.
- Has a resume but is unsure why she isn't getting callbacks.
- Comfortable using web apps; not necessarily technical.
- Wants fast, specific, trustworthy feedback — not generic advice.

### Secondary Persona: "Career-Switcher Rohan"
- 1–3 years of experience, actively job-hunting, applying to multiple roles with different JDs.
- Wants to quickly tailor his resume per job and understand skill gaps.

**Explicitly out of scope for v1.0:** recruiters, HR teams, bulk/multi-resume processing, non-Indian job markets (though the design should not block future expansion).

---

## 5. Scope

### 5.1 In Scope — v1.0

| Feature | Description |
|---|---|
| Resume Upload | Accept PDF and DOCX resume files |
| Job Description Input | Accept pasted text or uploaded JD file |
| ATS Compatibility Score | Rule-based score reflecting ATS-friendliness of resume formatting/structure |
| Resume-to-Job Match % | Rule-based algorithmic score comparing resume content to JD content |
| Missing Skills Detection | Identify skills/keywords present in JD but absent in resume |
| Keyword Analysis | Highlight matched vs. missing keywords, keyword frequency/relevance |
| AI-Powered Improvement Suggestions | Claude API-generated, structured, personalized resume feedback |
| Downloadable PDF Report | Clean, professional, single-file report with all results |
| Modern Responsive Dashboard | Clean single-page results view, works on desktop and mobile browsers |

### 5.2 Explicitly Out of Scope — v1.0 (Deferred to v2.0)

| Feature | Reason for Deferral |
|---|---|
| User authentication & accounts | Adds significant complexity; not needed for core workflow |
| Resume history / saved reports | Requires persistent storage + accounts |
| Multiple job application tracking | Product-scope expansion, not core value prop |
| Recruiter-facing dashboards | Different user, different product |
| Job scraping / live job portal integration | High complexity, fragile, unnecessary for v1.0 value |
| Real-time collaboration | Not relevant to a single-user analysis tool |
| Native mobile app | Responsive web is sufficient for v1.0 |
| Payments / subscriptions | No monetization needed for a capstone/portfolio project |

**Scope Discipline Rule:** Any feature that does not directly serve the core workflow — *Resume Upload → Job Description Input → Analysis → AI Suggestions → PDF Report* — is deferred to v2.0, regardless of how compelling it seems mid-build.

---

## 6. Core User Flow (v1.0)

1. User lands on HireLens homepage/dashboard.
2. User uploads a resume file (PDF or DOCX).
3. User pastes or uploads the target job description.
4. User clicks "Analyze."
5. System parses the resume and JD, and:
   a. Computes ATS Compatibility Score (rule-based).
   b. Computes Resume-to-Job Match % (rule-based).
   c. Detects missing skills/keywords (rule-based).
   d. Sends structured resume + JD summary to the AI layer for improvement suggestions.
6. Results dashboard displays: scores, missing skills, keyword breakdown, AI suggestions.
7. User clicks "Download Report" → receives a polished PDF summarizing all results.

---

## 7. Functional Requirements

### FR-1: Resume Upload
- Accept `.pdf` and `.docx` files only.
- Enforce a reasonable file size limit (e.g., 5MB).
- Show clear error messages for unsupported formats or corrupted files.
- Extract raw text reliably across varied resume formats (single-column, multi-column, tables where feasible).

### FR-2: Job Description Input
- Accept pasted plain text (primary path) and optionally file upload (secondary path).
- Enforce a minimum text length to ensure meaningful analysis.

### FR-3: ATS Compatibility Score (Rule-Based)
- Evaluate resume structure/formatting factors known to affect ATS parsing (e.g., presence of standard sections, absence of tables/images/columns that break parsing, contact info detectability, use of standard fonts/headings — to the extent inferable from extracted text/structure).
- Output a numeric score (e.g., 0–100) with a short breakdown of contributing factors.

### FR-4: Resume-to-Job Match Percentage (Rule-Based)
- Compare resume content against job description content using a deterministic algorithm (e.g., keyword overlap, weighted term matching).
- Output a numeric percentage with a short explanation of what drove the score.

### FR-5: Missing Skills Detection (Rule-Based)
- Extract likely required skills/technologies from the JD.
- Compare against skills detected in the resume.
- Output a clear list of missing skills, grouped sensibly (e.g., technical skills, tools, soft skills) where feasible.

### FR-6: Keyword Analysis (Rule-Based)
- Identify important keywords from the JD.
- Show which are present/absent in the resume, with enough detail to be actionable.

### FR-7: AI-Powered Improvement Suggestions
- Send a structured prompt (resume text + JD text + rule-based analysis summary) to the Claude API.
- Return structured, specific, actionable suggestions (not generic advice) — e.g., phrasing improvements, sections to strengthen, skills to highlight or reframe.
- Suggestions must follow a consistent, predictable output structure (validated/parsed reliably).
- The AI integration must be implemented behind an abstraction layer so the underlying AI provider can be swapped without touching the rest of the application.

### FR-8: PDF Report Generation
- Generate a clean, professional, well-formatted PDF containing: scores, missing skills, keyword analysis, and AI suggestions.
- Report must be downloadable directly from the results dashboard.
- Report must render correctly and consistently (tested prior to deployment).

### FR-9: Dashboard / Results UI
- Present all results in a clean, modern, responsive single-page layout.
- Must work well on both desktop and mobile browser widths.
- Must clearly communicate scores visually (not just as raw numbers).

---

## 8. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Performance** | Rule-based analysis should return in well under a few seconds; AI suggestion generation should show a clear loading state given expected API latency. |
| **Reliability** | Core scoring (ATS score, match %, missing skills) must never depend on the AI API being available — these must work even if the AI call fails. |
| **Usability** | Non-technical users should be able to complete the full flow without instructions. |
| **Portability** | Application must behave identically in local development and production deployment. |
| **Maintainability** | Codebase must be clearly structured (parsing, scoring, AI, reporting, UI as distinct, separable modules) to support v2.0 expansion. |
| **Security** | No resume/JD data should be persisted beyond the session unless explicitly required for report generation; API keys must never be exposed client-side. |
| **Extensibility** | AI provider must be swappable; architecture should not hard-block future multi-user/auth expansion, even though it's not built in v1.0. |

---

## 9. Technical Approach (High-Level, Stack-Agnostic)

Per capstone process, the specific technology stack, frameworks, and libraries will be formally selected and confirmed on **Day 2 (Design & Setup)** — not decided today, in line with a proper Requirements → Design workflow.

**Recommended direction (to be confirmed Day 2),** based on Ansh's existing skill set (Python, Flask, HTML/CSS/JS, prior AI-integrated single-file apps):
- **Backend:** Python-based web framework for orchestration, parsing, and rule-based scoring logic.
- **Resume Parsing:** Dedicated PDF and DOCX text-extraction libraries.
- **Rule-Based Scoring Engine:** Custom logic + lightweight NLP/keyword-matching techniques (no heavy ML dependency required).
- **AI Layer:** Claude API, called through a dedicated, isolated service module (provider-agnostic interface).
- **PDF Report Generation:** A Python-based PDF generation library.
- **Frontend:** Clean HTML/CSS/JS (or lightweight framework) — modern, responsive, dark-or-light professional SaaS aesthetic consistent with Ansh's prior builds.
- **Deployment:** A free-tier-friendly platform suitable for a Python web app with environment-variable-based secret management.

This section will be superseded by the finalized architecture decision recorded on Day 2.

---

## 10. Success Metrics — What "Done" Looks Like (Day 10)

HireLens v1.0 is considered successfully delivered when:

1. ✅ A fully deployed, publicly accessible web application is live.
2. ✅ A user can complete the entire flow (upload resume → input JD → get analysis → get AI suggestions → download PDF report) with no critical bugs.
3. ✅ The UI is clean, responsive, and professional across desktop and mobile widths.
4. ✅ Core scoring works reliably and consistently across at least 5–10 varied real-world resume formats.
5. ✅ AI suggestions are consistently structured, relevant, and free of major failures/hallucinated nonsense.
6. ✅ The PDF report generates correctly and looks professional, tested across multiple result scenarios.
7. ✅ A public GitHub repository exists with clean commit history, clear folder structure, and a detailed README.
8. ✅ Architecture diagrams, screenshots, and documentation clearly explain the system.
9. ✅ A 2–5 minute demo video showcasing the product exists.
10. ✅ Ansh can confidently present and discuss this project in a technical interview.

---

## 11. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Inconsistent resume formatting breaks parsing | Test early (Day 3) against multiple real resume formats (single-column, multi-column, varying section headers); use robust, well-established parsing libraries; handle parsing failures gracefully with clear user-facing errors. |
| AI suggestions are inconsistent or unpredictable | Use a tightly structured prompt with an explicit expected output format; validate/parse AI responses defensively; provide a fallback message if the AI call fails, without breaking the rest of the report. |
| Deployment behaves differently from local dev | Use environment variables consistently from Day 2 onward; test a deployed build early (not just on Day 10); document exact deployment steps. |
| PDF report formatting breaks with edge-case content (very long text, missing sections) | Test report generation with multiple result scenarios (short/long resumes, few/many missing skills) before Day 10. |
| Scope creep | Enforce the Scope Discipline Rule (Section 5.2) at every day's checkpoint; any new idea goes into a "v2.0 Ideas" backlog, not into v1.0. |

---

## 12. Future Scope (v2.0 and Beyond)

- User accounts and authentication.
- Resume history and saved reports.
- Multiple job application tracking with a personalized dashboard.
- Recruiter-facing tools (bulk resume screening, candidate ranking).
- Expansion beyond Indian IT jobs to global markets and other industries.
- Live job portal integrations.
- Resume builder/editor with real-time score feedback.

---

## 13. Open Questions / Decisions Deferred to Day 2

- Final technology stack confirmation.
- Detailed system architecture and module breakdown.
- Deployment platform selection.
- UI wireframe/design system finalization.

---

*End of Product Requirements Document — HireLens v1.0*
