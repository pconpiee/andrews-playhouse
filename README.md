# Nursing in America — Scholarship & Application Roadmap

A static, no-build website for international students from English-medium high schools who want to study nursing in the USA on scholarship, targeting the Fall 2027 admissions cycle.

## What's here

- **Scholarship database** — curated, with eligibility, deadlines, and source links.
- **School Explorer** — ~25 hand-picked BSN programs filtered by faith affiliation, region, and international-aid friendliness.
- **Application Guide** — phase-by-phase checklist (May 2026 through Fall 2027) with localStorage persistence.
- **Essay Cheat Sheet** — personal-statement structure, common prompts, anti-patterns.
- **Interview Prep** — including MMI format and sample questions.
- **AI Helpers** — copy-paste prompts for Claude / ChatGPT.
- **Resources** — Ethiopia-specific and USA-side hubs.

## Editing

All content is hand-curated:
- Schools live in `assets/data/schools.json`.
- Scholarships live in `assets/data/scholarships.json`.
- Timeline + next-actions live in `assets/data/timeline.json`.
- AI prompts live in `assets/data/prompts.json`.
- Prose pages (`essays.html`, `interview-prep.html`, `application-guide.html`) are hand-written HTML.

Per-school detail pages live in `schools/<id>.html` using a shared template.

## Local preview

`fetch` of partials doesn't work from `file://`. Serve over HTTP locally:

```bash
python3 -m http.server 8000
# then open http://localhost:8000/
```

## Deployment

Auto-deployed to GitHub Pages on every push to the deploy branch via `.github/workflows/pages.yml`.

Final URL: `https://pconpiee.github.io/andrews-playhouse/`

One-time setup (repo Settings → Pages):
- **Source: GitHub Actions** (not "Deploy from a branch").

## Stack

Plain HTML/CSS/JS. No framework, no build step, no dependencies. CSS budget ~30 KB total.

## Disclaimer

Deadlines, costs, and aid eligibility change. Every claim in this site is cited, but **verify with the school or sponsor before applying**. Last-updated date is shown in the site footer.
