# Comprehensive Assignment 1: MariaDB Setup and SQL Fundamentals

Week 3 assignment (Walsh College). This folder is self-contained and has no
connection to the rest of the repository.

## Contents

| File | Purpose |
|------|---------|
| `Comprehensive_Assignment_1.docx` | The report, ready to edit in Word. Sections 3–8 are complete; Sections 1–2 contain yellow slots for your own screenshots. |
| `Comprehensive_Assignment_1_DRAFT_preview.pdf` | A preview of the current draft (not committed, because the repository ignores `*.pdf`; see *Rebuilding* below). **Do not submit it**: Sections 1–2 still contain placeholders. |
| `Comprehensive_Assignment_1.sql` | Every statement for Sections 3–8, grouped by figure, for re-running on your own computer. |
| `screenshots/` | The 26 terminal screenshots used in Sections 3–8 (`fig_<section>_<n>.png`). |
| `build/` | The scripts that captured the screenshots and built the Word file, plus the full session transcript. |

The course PDFs (assignment brief and MariaDB guide) are intentionally not
included: they are licensed for personal use only.

## What is already done

- **Sections 3–8 (130 of the 150 rubric points: 20 + 15 + 15 + 15 + 15 + 50)**:
  every statement in the course guide was executed against a real MariaDB
  server, in the guide's order, with zero errors and zero warnings. Each task
  has the statement, a screenshot of the statement and the server's response,
  and a short interpretation.
- **Sections 1–2**: the text for all 12 installation steps and all 4 command
  prompt steps is written; only the screenshots are missing, because they
  must show your own Windows installation.
- Introduction, conclusion and APA references.

## What you still need to do (about 30 minutes)

1. **Free port 3306.** If XAMPP is installed, open the XAMPP Control Panel and
   stop the *MySQL* module. Otherwise the installer stops with "The TCP Port
   you selected is already in use"; if you see that, stop XAMPP's MySQL or
   type `3307` as the port.
2. **Download** MariaDB Server from <https://mariadb.org/download/>: the latest
   LTS release (12.3 at the time of writing), *Windows*, *x86_64*, *MSI*. The
   report names version 12.3; if you install a different one, update it with
   Ctrl + H (find `12.3`, replace with your version).
3. **Install it and take the 12 screenshots for Section 1** (Win + Shift + S,
   then paste over the matching yellow slot in Word):
   - Step 6: set a root password you will remember; leave remote root access unchecked.
   - Step 7: keep service name `MariaDB` and port `3306`.
   - Steps 8 and 9: current installers go straight from *Database settings* to
     *Ready to install* (the guide's Feedback page no longer exists). Take one
     screenshot when *Ready to install* appears (Step 8) and one with the
     pointer on *Install* (Step 9).
   - Step 10: the progress bar is quick, so be ready to capture it.
   - Step 12: press Win + R, type `services.msc`, and capture the *MariaDB*
     service with the status *Running*.
4. **Take the 4 screenshots for Section 2**: Start ▸ All apps ▸
   *MariaDB 12.3 (x64)* ▸ *Command Prompt (MariaDB 12.3 (x64))*, type
   `mysql -u root -p`, enter the password.
5. **Recommended: replace the Section 3–8 screenshots with your own.** Keep the
   same window open and run the blocks in `Comprehensive_Assignment_1.sql` one
   figure at a time (they must run in order). Capture each result with
   Win + Shift + S, click the existing screenshot in Word and paste yours over
   it. The output will be identical apart from the timings, and every
   screenshot in the report will then come from your own computer, consistent
   with Sections 1–2.
6. **Fill in the title page** (the bracketed fields: name, course, instructor, due date).
7. **Check for leftovers**: Ctrl + F for `Insert screenshot` should find nothing.
8. **Export**: File ▸ Save As ▸ PDF, named exactly `Comprehensive_Assignment_1.pdf`.

## Points where the course guide needs care

- `UPDATE book SET name = “MariaDB Book1”` is printed with curly quotes; type
  straight quotes (`"MariaDB Book1"`), or the statement fails.
- Two ORDER BY statements print the pattern as `'2%.'`; the period is a
  typo. `'2%.'` returns an empty set, and `'2%'` (as in the guide's own
  screenshots) returns the expected three rows.
- The guide was written for MariaDB 10.3. In current versions the default
  service name is `MariaDB` (not `MySQL`), the separate Feedback page (the
  guide's Step 8) is gone, and versions 11.8 and later no longer show the
  "Use UTF8" check box. These differences are explained in the report.
- On Windows, `Book` and `book` name the same table because
  `lower_case_table_names` defaults to 1 there. On Linux the default is 0 and
  the guide's mixed-case statements would fail.

## How the Section 3–8 screenshots were produced

The screenshots are genuine captures of a real session, not mock-ups:

- MariaDB Server 10.11.14 on Ubuntu 24.04 in a cloud sandbox, configured with
  `lower_case_table_names = 1` to reproduce the Windows default, so every
  statement from the guide runs exactly as printed.
- The real `mariadb` command-line client ran inside a real `xterm`; each
  statement was typed line by line (so the `->` continuation prompts are
  real), and the window was captured with ImageMagick and trimmed.
- `build/session_transcript.txt` is the client's own log of the whole session.
  Every result matches the output shown in the course guide.

Because they were captured in that sandbox rather than on your PC, step 5
above recommends re-capturing them on your own machine.

## Rebuilding the Word file

```bash
node build/build_docx.js        # needs the "docx" npm package
soffice --headless --convert-to pdf Comprehensive_Assignment_1.docx   # optional preview
```

The script reads `screenshots/` and writes `Comprehensive_Assignment_1.docx`.
The repository's `.gitignore` excludes `*.png`, so the screenshots were added
explicitly with `git add -f`; the ignore rules themselves are unchanged.
