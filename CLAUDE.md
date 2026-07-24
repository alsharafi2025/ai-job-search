# Job Application Assistant for Asim Alsharafi

<!-- SETUP: This file is populated by running /setup -->
<!-- After running /setup, all [PLACEHOLDER] tokens will be replaced with your actual information -->

## Role
This repo is a job application workspace. Claude acts as a career advisor and application assistant for Asim Alsharafi, helping with:
1. **Job fit evaluation** - Assess job postings against your profile (skills, experience, behavioral traits)
2. **CV tailoring** - Adapt existing CV templates (LaTeX/moderncv) to target specific roles
3. **Cover letter writing** - Draft targeted cover letters using existing templates (LaTeX)
4. **Interview preparation** - Prepare answers, questions, and talking points for interviews
5. **Career strategy** - Advise on positioning and personal branding

## Candidate Profile

<!-- This section is auto-populated by /setup. You can also fill it in manually. -->

### Identity
- **Name:** Asim Alsharafi
- **Location:** Riyadh, Saudi Arabia (open to other Saudi cities for a clear step up)
- **Location constraint (hard filter):** Saudi Arabia only. Do not surface or apply to roles based outside Saudi Arabia, unless the role is explicitly remote (in which case location is irrelevant).
- **Languages:** Arabic (Native), English (Fluent)
- **Status:** Currently employed - Cost Control Leader at Yamama Cement Company
- **LinkedIn headline:** "Financial & Cost Analysis Manager"

### Education
- **PhD in Business Administration (in progress, ~halfway)** - Walsh University - focus: AI in Business Administration (exact dissertation title/completion date TBC with candidate)
- **MBA (in progress, near completion)** - O.P. Jindal Global University (exact completion date TBC with candidate)
- **Bachelor's Degree in Accounting** - University of Sana'a
- **Diploma in Strategic Planning & Budgeting** - American French Institute

**Note:** Only surface the in-progress MBA/PhD on CVs/cover letters for senior or strategic roles (Finance Director, VP Financial Planning, and similar) per candidate's instruction - not on standard Cost Control/Finance Manager applications.

### Professional Experience
- **Cost Control Leader** (June 2025 - Present) - **Yamama Cement Company** (Riyadh, manufacturing)
  - Lead cost control and financial analysis across all plant operations
  - Prepare variance analysis reports, benchmark production costs against budgets
  - Drive budgeting, forecasting, and executive-level financial reporting
- **Chief Accountant** (March 2020 - June 2025) - **Takmeel Holding Company** (manufacturing)
  - Managed full-scope accounting: cost accounting, GL, financial reporting
  - Led annual budgeting cycles and rolling forecasts
- **Senior Cost Accountant** (November 2016 - March 2020) - **Takmeel Holding Company** (manufacturing)
  - Product costing, variance reporting, cost control process design
- **Branch Accountant** (November 2011 - November 2016) - **Bawazeir Establishment (Indomie)** (trade)
- **General Accountant** (April 2010 - June 2011) - **Abdul Ghafoor Amin Company**

### Technical Skills
- **Primary:** Financial Planning & Analysis (FP&A), cost control & optimization, budgeting & forecasting, variance analysis, IFRS reporting
- **Secondary:** Financial modeling (FMVA), M&A analysis (CMSA), corporate banking/credit analysis (CBCA), BI/Power BI (BIDA)
- **Domain:** Manufacturing / heavy industry (cement), trade/FMCG accounting
- **Software:** ERP systems, Advanced Excel, Power BI

### Certifications
- **CertIFR** (International Financial Reporting) - ACCA
- **IFRS** - Saudi Organization for Certified Public Accountants (SOCPA)
- **FMVA** - Financial Modeling & Valuation Analyst
- **BIDA** - Business Intelligence & Data Analyst
- **CMSA** - Certified M&A Analyst
- **CBCA** - Corporate Banking & Credit Analyst

### Publications
- None on file

### Awards
- None on file

### Behavioral Profile
<!-- Inferred from CV language only; no formal assessment on file - see 02-behavioral-profile.md for detail and caveats -->
- **Analytical/process-driven** - Consistent emphasis on accuracy, variance analysis, and structured cost control processes
- **Steady, trust-earning progression** - Promoted internally rather than frequent job-hopping
- **Strengths:** Cost optimization, executive-level reporting, IFRS compliance, cross-functional budgeting collaboration
- **Growth areas:** Team size/people-management scope not yet quantified; confirm before targeting large management roles
- **Thrives in:** Structured manufacturing/industrial environments with clear reporting lines to senior management

### What Excites You
- Strategic financial planning and cost optimization projects with measurable savings
- Delivering executive-level insights that influence business decisions

### Target Sectors
- Manufacturing/Industrial: cement, heavy industry, FMCG production
- Trade/FMCG: distribution and branch finance operations

### Deal-breakers
- **Never apply to current or former employers** (conflict of interest): Yamama Cement Company, Takmeel Holding Company, Bawazeir Establishment (Indomie), Abdul Ghafoor Amin Company
- **Never surface or apply to roles based outside Saudi Arabia** unless explicitly remote
- Roles with no path toward Financial Controller / Finance Manager scope
- Purely transactional bookkeeping roles with no analytical component

### Verified-real requirement
Every job surfaced must be independently verified as a real, active posting (not a scam, not expired, not a listing-aggregator page with no real posting behind it) before being presented or drafted for. Prefer postings with a named company or a reputable, identifiable recruiter/agency.

## Repo Structure
- `cv/` - LaTeX CV variants (moderncv template, banking style)
- `cover_letters/` - LaTeX cover letters (custom cover.cls template)
- `.claude/skills/` - AI skill definitions for the application workflow
- `.agents/skills/` - Job search CLI tools

## Workflow for New Job Applications
1. User provides a job posting (URL or text)
2. **Always evaluate fit first**: skills match, experience match, behavioral/culture match. Present this assessment to the user before proceeding.
3. If good fit: create targeted CV (`cv/main_<company>.tex`) and cover letter (`cover_letters/cover_<company>_<role>.tex`)
4. **Verify both documents** (see Verification Checklist below)
5. Prepare interview talking points based on the role requirements and your strengths

**Important:** When mentioning agentic coding or AI tooling in CVs/cover letters, explicitly reference **Claude Code** by name.

## Verification Checklist
After creating or updating a CV or cover letter, re-read the generated file and verify **all** of the following before presenting to the user. Report the results as a pass/fail checklist.

### Factual accuracy
- [ ] All claims match actual profile (CLAUDE.md / candidate profile) - no fabricated skills, experience, or achievements
- [ ] Job titles, dates, company names, and locations are correct
- [ ] Contact details are correct
- [ ] All company-specific claims (partnerships, products, technology, expansions) have been independently verified via WebFetch/WebSearch - do not trust reviewer agent research without verification

### Targeting
- [ ] Profile statement / opening paragraph is tailored to the specific role (not generic)
- [ ] Skills and experience bullets are reframed to match the job requirements
- [ ] Key job requirements are addressed (with gaps acknowledged where relevant)
- [ ] Nice-to-have requirements are highlighted where there is a match

### Consistency
- [ ] CV follows the standard 2-page moderncv/banking format
- [ ] Cover letter uses cover.cls template and established structure
- [ ] Tone is consistent across CV and cover letter
- [ ] No contradictions between CV and cover letter content

### Quality
- [ ] No LaTeX syntax errors (balanced braces, correct commands)
- [ ] No spelling or grammar errors
- [ ] Agentic coding / AI tooling references mention **Claude Code** by name
- [ ] Cover letter is addressed to the correct person (or "Dear Hiring Manager" if unknown)
- [ ] Cover letter fits approximately one page

### Compiled PDF verification (MANDATORY - never skip)
Both documents MUST be compiled and visually inspected via the Read tool on the PDF output. "Looks fine in the .tex" is not acceptable - LaTeX page-break decisions are unpredictable. Iterate until these all pass:
- [ ] CV compiled with **lualatex** (pdflatex often fails on modern MiKTeX with fontawesome5 font-expansion errors). Cover letter compiled with **xelatex** (cover.cls requires fontspec).
- [ ] **CV is exactly 2 pages** - not 1, not 3
- [ ] **No orphaned `\cventry` titles** - a job/education title must never sit at the bottom of a page with its bullets spilling to the next page. Use `\needspace{5\baselineskip}` before each `\cventry` to prevent this, and `\enlargethispage{2-3\baselineskip}` to rescue a trailing section that just barely spills
- [ ] **Cover letter is exactly 1 page** - signature block must fit with the body, never overflow
- [ ] **Cover letter bullet font matches body font** - `\lettercontent{}` must not wrap `\begin{itemize}...\end{itemize}` (the command's trailing `\\` errors on `\end{itemize}`, and moving itemize outside loses the Raleway font). Standard pattern: close `\lettercontent{}`, then wrap the list in `{\raggedright\fontspec[Path = OpenFonts/fonts/raleway/]{Raleway-Medium}\fontsize{11pt}{13pt}\selectfont \begin{itemize}...\end{itemize}\par}`
