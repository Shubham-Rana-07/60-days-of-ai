# HireLens — Key Learnings

## 1. Start With the Problem

A useful application begins with a clear user problem.

HireLens focuses on helping users understand how their resume aligns with a target job description.

---

## 2. Build the Core Before Adding AI

The deterministic analysis pipeline was important because it provides predictable outputs.

The core includes:

- Resume parsing
- Keyword extraction
- ATS scoring
- Job matching
- Missing-skill detection

AI recommendations can then complement this foundation.

---

## 3. AI Should Have a Clear Role

Claude is useful for natural-language resume improvement suggestions.

It should not unnecessarily replace deterministic logic where predictable calculations are more appropriate.

---

## 4. External Services Can Fail

The Claude integration demonstrated that external AI services may be unavailable because of credits, configuration or other request issues.

A resilient application should handle this gracefully.

---

## 5. Testing Is Part of Development

HireLens finished with:

```text
56 passed
