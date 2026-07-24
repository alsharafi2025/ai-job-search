# Job Evaluation Framework

<!-- SETUP: Skill match areas and career goals are personalized by running /setup -->

## Scoring Dimensions

Evaluate each job posting against these five dimensions:

### 1. Technical Skills Match (0-100)
How well do the required/preferred skills align with the candidate's capabilities?

| Score | Meaning |
|-------|---------|
| 80-100 | Core requirements are primary skills |
| 60-79 | Most requirements match, 1-2 gaps that are learnable |
| 40-59 | Partial match, significant upskilling needed |
| 0-39 | Fundamental mismatch |

**Strong match areas:** Cost control & optimization, FP&A, budgeting & forecasting, variance analysis, IFRS reporting, financial modeling, manufacturing/industrial cost accounting
**Moderate match areas:** Financial controllership, M&A analysis (CMSA), corporate banking/credit analysis (CBCA), BI/Power BI reporting
**Weak match areas:** Treasury management, tax specialization, listed-company investor relations, technology/SaaS domain finance

### 2. Experience Match (0-100)
Does work history align with what they're looking for?

| Score | Meaning |
|-------|---------|
| 80-100 | Direct experience in the same domain and role type |
| 60-79 | Related experience, transferable skills clear |
| 40-59 | Adjacent experience, would need to make the case |
| 0-39 | Unrelated experience |

**Strong:** Cost Control Manager/Leader, Chief Accountant, Senior Cost Accountant, Financial Controller, FP&A Manager - manufacturing/industrial sector (cement, heavy industry)
**Moderate:** Finance Manager / General Finance Manager roles in trade or FMCG sector, M&A analyst support roles
**Entry-level:** CFO / Group Finance Director (16 years experience supports a stretch application, but treat as a stretch, not a baseline)

### 3. Behavioral/Culture Fit (0-100)
Does the role and company culture match the behavioral profile?

| Score | Meaning |
|-------|---------|
| 80-100 | Culture strongly matches behavioral preferences |
| 60-79 | Mixed signals but mostly compatible |
| 40-59 | Some friction areas |
| 0-39 | Significant culture mismatch |

**Red flags to research:** Department disorganization, work dominated by maintenance over development, poor chemistry with leadership, culture mismatches. Check reviews, media coverage, LinkedIn connections, and network contacts for insider perspective.

### 4. Location, Nationality & Logistics (Pass/Fail + Notes) — HARD GATE, evaluate first
- **Job based in Saudi Arabia** (any city): PASS
- **Explicitly remote** (no Saudi presence required): PASS regardless of employer location
- **Job based outside Saudi Arabia and not remote**: FAIL — do not proceed to scoring or drafting, do not present to the user as a candidate option
- **Posting explicitly requires Saudi nationality/citizenship** (e.g. "Saudi nationals only", citizenship required as a stated qualification): FAIL — candidate is not a Saudi national. A general Saudization-quota mention (e.g. company complying with Nitaqat) that does not exclude expatriate applicants is NOT a fail.
- Frequent international travel from a Saudi base: FLAG (discuss with user), does not itself fail the gate

This gate is checked before any other dimension. A FAIL here ends the evaluation immediately regardless of how strong the other dimensions look.

### 5. Career Alignment & Motivation (0-100)
Does this role advance career goals and contain tasks that energize?

| Score | Meaning |
|-------|---------|
| 80-100 | Strongly aligned with career direction, clear growth path |
| 60-79 | Good role but only partially aligned with long-term goals |
| 40-59 | Decent job but doesn't build toward career goals |
| 0-39 | Dead end or backwards step |

**Career goals:**
- Move into a Financial Controller / Finance Manager title with broader P&L and team leadership scope
- Build toward Group Finance Director / CFO track in manufacturing or industrial sectors within 3-5 years
- Deepen FP&A and M&A/valuation exposure (already invested in FMVA/CMSA certifications toward this)

**Motivation filter:** Evaluate not just whether you *can* do the tasks, but whether the tasks will *energize* you. Consider:
- Tasks that energize: strategic financial planning, executive-level reporting, cost optimization projects with measurable savings, mentoring/leading a finance team
- Tasks that drain: routine transactional bookkeeping with no analytical component, roles with no path to management
- Non-task factors: leadership style, department culture, company values, degree of autonomy

**Life situation alignment:** Consider personal constraints:
- **Security**: Currently employed - can be selective; no urgency to accept a lateral or downgrade move
- **Flexibility**: Riyadh-based; open to other Saudi cities only if role is clearly a step up
- **Professional development**: Prioritize employers investing in further certifications (CMA, CFA) and clear promotion paths

**Exclusion rule (hard filter):** Never shortlist or apply to Yamama Cement Company, Takmeel Holding Company, Bawazeir Establishment (Indomie), or Abdul Ghafoor Amin Company - current/former employers, conflict of interest.

### 6. Salary Benchmark (Optional)

If the salary lookup tool is configured (`salary_data.json` exists), look up the company:
```
python salary_lookup.py "<Company Name>" --json
```

If a city is known from the posting, add `--city "<City>"` to narrow results.

Present findings as:
```
### Salary Benchmark
| Metric | Value |
|--------|-------|
| [Category] index | XX.X (+/-X.X% vs baseline) |
| Overall index | XX.X (+/-X.X% vs baseline) |
```

Interpret results relative to the baseline defined in the data file's metadata. For index-based data, higher typically means above-market compensation.

If the salary tool is not configured, skip this section.

## Output Format

Present the evaluation as:

```
## Job Fit Evaluation: [Role] at [Company]

| Dimension | Score | Notes |
|-----------|-------|-------|
| Technical Skills | XX/100 | [brief note] |
| Experience Match | XX/100 | [brief note] |
| Behavioral Fit | XX/100 | [brief note] |
| Location | PASS/FAIL | [brief note] |
| Career Alignment | XX/100 | [brief note] |

**Overall Score: XX/100** (weighted average of scored dimensions)

### Verdict: [Strong Fit / Good Fit / Moderate Fit / Weak Fit / Poor Fit]

### Key Strengths for This Role
- [bullet points]

### Gaps to Address
- [bullet points]

### Recommendation
[1-2 sentences: apply/skip/apply with caveats]

### Company Research Checklist
- [ ] Checked company website (mission, values, recent news)
- [ ] Checked review sites (Glassdoor, Jobindex, etc.)
- [ ] Checked LinkedIn for team size, recent hires, connections
- [ ] Checked media for restructuring, growth, or workplace issues
- [ ] Identified network contacts who may know the team/manager
```

## Weighting
- Technical Skills: 30%
- Experience Match: 25%
- Behavioral Fit: 15%
- Career Alignment: 30%

(Location is pass/fail, not weighted)

## Thresholds
- **Strong Fit** (75+): Definitely apply, tailor everything
- **Good Fit** (60-74): Apply, address gaps in cover letter
- **Moderate Fit** (45-59): Consider carefully, discuss with user
- **Weak Fit** (30-44): Probably skip unless strategic reasons
- **Poor Fit** (<30): Skip

## Verified-Real-Posting Check (mandatory, before scoring)
Before evaluating a posting, confirm it is real and worth spending effort on:
- [ ] Posting is either on a reputable job board (Bayt, GulfTalent, NaukriGulf, LinkedIn, company's own careers page) or via a named, verifiable recruiter/agency
- [ ] If the employer name is disclosed, a quick web check confirms the company actually exists and operates in the claimed sector
- [ ] Not a stale/expired listing-aggregator page with no live posting behind it
- [ ] Not a "too good to be true" red flag (no interview, upfront payment requested, personal banking details requested before an offer)

Skip and do not present postings that fail this check.

## Application Tracker
Every job that reaches at least "Moderate Fit" and gets a drafted CV/cover letter should be logged in `job_search_tracker.csv` (repo root, gitignored - personal data) with columns: `date_found, company, role, source_url, fit_score, verdict, cv_file, cover_letter_file, status, date_applied, outcome, notes`. Create the file with a header row if it does not exist yet. Update the `status`/`outcome` columns whenever the user reports progress (applied, interview, rejected, offer). This gives a single source of truth for the whole pipeline instead of re-deriving it from conversation history each time.

## Pre-Application: Call the Employer (Best Practice)

Before writing the application, consider whether the candidate should call the contact person listed in the posting. **Only call if there are substantive questions** - never call just to "be remembered."

### When to Suggest Calling
- The posting has unclear or ambiguous requirements
- It's unclear which competencies are essential vs. nice-to-have
- The role description is vague about day-to-day tasks
- There's a named contact person who invites questions

### Good Questions to Ask
- "What are the primary challenges in this role?"
- "How is time typically divided across the listed responsibilities?"
- "Which competencies are most critical for success in this position?"
- "What does success look like in the first 6-12 months?"

### Rules for the Call
- Prepare a 30-second "elevator pitch" about your background in case they ask
- The call's purpose is **gathering information**, not delivering a pitch
- Take notes - use what you learn to tailor the application
- Reference the conversation naturally in the cover letter ("After speaking with [name], I was especially drawn to...")
