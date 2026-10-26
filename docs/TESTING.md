# Testing — mandatory gate (anti-regression)

**Status:** Mandatory for contributors and AI agents (decision 2026-10-02).  
**Stack:** Vitest (unit / feature) · Playwright (E2E / a11y / perf smoke) · `tsc` + `vite build`

Related: [`ROADMAP.md`](./ROADMAP.md) · [`SECURITY.md`](./SECURITY.md) · [`AGENTS.md`](../AGENTS.md)

---

## Gate rule (non-negotiable)

After **any** code change:

1. Run the **required suite for that change** (see matrix below).
2. **All green** → change can be considered done; only then move on.
3. **Any red** → fix first; do not start another task; do not “validate” the change.

New feature / bugfix in the same PR **must** add or update ≥ 1 relevant test (E7).

---

## Commands

| Script | What |
|--------|------|
| `npm run typecheck` | A1 — `tsc --noEmit` |
| `npm run check:secrets` | A3 — no secrets patterns in tracked source |
| `npm run test` | Vitest unit + feature (B, C, parts of A) |
| `npm run build` | A2 — production build |
| `npm run format` / `format:check` | Prettier write / check (`.prettierrc.json`, `.prettierignore`) |
| `npm run lint` | ESLint (TS rules + no `innerHTML` / `outerHTML` / `insertAdjacentHTML` / `document.write` in `src/`) |
| `npm run lint:css` | Stylelint (colors only in `src/styles/variables.css`) |
| `npm run fix` | Prettier + ESLint + Stylelint auto-fix |
| `npm run gate` | typecheck (src + tests/configs) + secrets + vitest + build |
| `npm run ci` | **The pipeline:** dependency audit + format check + lint + lint:css + gate + E2E — run by the pre-commit hook and by GitHub Actions (push, PR and a daily schedule) |
| `npm run test:e2e` | Playwright against local preview (D0, D4, D5) |
| `npm run test:e2e:prod` | Playwright against `PLAYWRIGHT_BASE_URL` (post-deploy) |
| `npm run gate:full` | `gate` + local E2E |
| `npm run audit:ci` | A5 — **mandatory, blocking**: `npm audit --audit-level=high` (dev dependencies included) + `npm audit signatures`; first step of `npm run ci` and of the daily GitHub Actions run |
| `npm run audit:prod` | `npm audit --omit=dev` — production-only view, for reports |

---

## Suite matrix (what is active when)

| Suite | Status | When to run |
|-------|--------|-------------|
| **A** — typecheck, build, secrets, audit | **Active** | Every change (`gate`) |
| **B** — unit (implemented modules only) | **Active** | Every change (`gate`) |
| **C** — feature / catalog / headers / no-private-area (C9) | **Active** | Every change (`gate`) |
| **D0** — smoke public | **Active** for pages/features already shipped | `gate:full` or before handoff |
| **D1** — catalogue content regression | **Deferred until** we insert more project content; **mandatory before prod** once content work starts | Content PRs + pre-prod |
| **D2** — auth / evaluator E2E | **Removed** (no app auth; Supabase code deleted 2026-10-21 — C9 guards against its return) | — |
| **D3** — security functional | **Removed with D2** | Manual check after deploy: public site open; `/jury`, `/pages/jury/*`, `/jury/fiches/*.pdf` answer **401** without credentials (`SECURITY.md` §7). Automated part: `tests/unit/jury-auth.test.ts`, `tests/unit/edge-jury-auth.test.ts` + `check:secrets`; on a deployed site: `PLAYWRIGHT_BASE_URL=… npx playwright test tests/e2e/jury-protection.prod.spec.ts` (skipped without the variable) |
| **D4** — a11y (axe) | **Active now** | `test:e2e` / `gate:full` |
| **D5** — perf / console smoke | **Active now** | `test:e2e` / `gate:full` |
| **E** — scripts + AGENTS gate | **Active today** | Process |
| **F** — exclusions | Applied | No pixel Three.js / Rapier frame tests; no 100% coverage chase |

---

## Exclusions (F)

Do **not** add:

- Screenshot / pixel-perfect tests of the Three.js bust or Rapier frames  
- E2E for every brush stroke  
- Duplicate asserts already covered in unit **and** E2E without value  
- Tests for features **not yet implemented** (write them when the feature lands)

---

## Layout

```
tests/
  unit/           # B — mocked modules
  feature/        # C — DOM + filesystem catalog
  e2e/            # D0, D4, D5 (+ later D1)
scripts/
  check-no-secrets.mjs
```

---

## Automation (local CI = pre-commit hook)

The gate no longer depends on anyone remembering to run it:

| Layer | File | What it does |
|-------|------|--------------|
| Pre-commit hook | `.husky/pre-commit` (installed by `npm install` → `prepare: husky`) | Refuses unstaged edits / untracked source files (what is tested = what is committed), then runs `npm run ci`. Any red ⇒ commit refused. |
| Pre-merge hook | `.husky/pre-merge-commit` | Same gate on the merged tree (`git merge --no-ff wp/<id>`). |
| CI | `.github/workflows/ci.yml` | Same `npm run ci` on a clean Ubuntu runner (push to `main`, pull requests). Catches a bypassed hook or a file forgotten in a commit. |
| Agent guard | `.claude/settings.json` → `scripts/guard-git-bypass.mjs` | Blocks `--no-verify`, `git commit -n`, `HUSKY=0`, `core.hooksPath` for Claude Code agents. |

Determinism: exact tool versions (`package-lock.json`, `--save-exact`), Node from `.nvmrc`, LF line endings (`.gitattributes`), checks never modify files (`--check`), Playwright never reuses a running server and never retries (a flaky test fails instead of being hidden). Running `npm run ci` twice on the same tree gives the same result.

## AI / agent obligation

1. Stage every changed file, run `npm run fix` then `npm run ci` before `git commit` (Bash timeout ≥ 600000 ms: the hook takes ≈ 70 s).
2. Commit refused ⇒ read the failing step, fix the cause, stage, commit again. Never bypass the hook, never weaken a test to pass it.
3. Report red tests; do not claim done while red

**Deploy gate (L10):** Netlify runs `npm run audit:ci && npm run gate` before publishing (`netlify.toml`): the dependency audit, types, secrets scan, unit/feature tests and the build must all pass, otherwise nothing is deployed. E2E stay in GitHub Actions and in `npm run test:e2e:prod` after a deploy.
