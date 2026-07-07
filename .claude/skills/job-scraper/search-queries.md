# Search Queries for Job Scraper

<!-- SETUP: Customize these queries based on your skills, target roles, and location -->

## Search Sites

Primary (Saudi/Gulf job market):
- **bayt.com** - largest Gulf job board
- **gulftalent.com** - Gulf-focused professional job board
- **naukrigulf.com** - Gulf job board
- **linkedin.com/jobs** - LinkedIn job listings (filter: Saudi Arabia / Riyadh)
- **tanqeeb.com** - Saudi/Arabic-language job board

Secondary (company career pages via Google):
- Direct Google searches with `site:` filters for known target companies

## Query Categories

Queries are grouped by priority. Each query should be combined with location terms ("Riyadh", "Saudi Arabia") where the site supports it.

### Priority 1: Cost Control / Financial Controller

These match the strongest and most desired career direction.

```
site:bayt.com "Cost Control Manager" Riyadh
site:gulftalent.com "Financial Controller" Saudi Arabia
site:linkedin.com/jobs "Cost Control Manager" Saudi Arabia
```

### Priority 2: Chief Accountant / Finance Manager (domain expertise: manufacturing/industrial)

These match domain expertise in manufacturing and industrial cost accounting.

```
site:gulftalent.com "Chief Accountant" Riyadh OR Saudi Arabia
site:naukrigulf.com "Finance Manager" manufacturing Saudi Arabia
site:linkedin.com/jobs "Chief Accountant" manufacturing Riyadh
```

### Priority 3: FP&A Manager / Senior Financial Analyst

Adjacent roles to pivot into using FP&A and financial modeling skills.

```
site:bayt.com "FP&A Manager" Saudi Arabia
site:gulftalent.com "Financial Planning and Analysis" Riyadh
```

### Priority 4: Broader Finance / M&A

Wider net using CMSA/CBCA credentials.

```
site:gulftalent.com "M&A Analyst" Saudi Arabia
site:bayt.com "Corporate Banking" credit analyst Riyadh
```

## Location Filter

When evaluating results, verify the job location is within reasonable commute distance from home base. Define acceptable areas:
- Riyadh and surrounding areas (ideal)
- Other major Saudi cities (Jeddah, Dammam, Khobar) - acceptable if role is a clear step up
- Other GCC countries - borderline, discuss relocation terms before applying
- Outside GCC - too far, exclude unless user specifies otherwise

## Excluded Employers (hard filter - current/former employers)

Never surface or apply to:
- Yamama Cement Company
- Takmeel Holding Company
- Bawazeir Establishment (Indomie)
- Abdul Ghafoor Amin Company

## Date Filter

Only include jobs posted within the last 14 days, or with an application deadline that has not yet passed. If a posting date cannot be determined, include it but flag as "date unknown".

## Adapting Queries

If the user specifies a focus area, select queries from the matching category and also generate 2-3 custom queries for that focus. For example:
- "/scrape [focus_area]" -> relevant category queries + custom focus-specific queries
