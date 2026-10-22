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
| `npm run gate` | **Default after every change:** typecheck + secrets + vitest + build |
| `npm run test:e2e` | Playwright against local preview (D0, D4, D5) |
| `npm run test:e2e:prod` | Playwright against `PLAYWRIGHT_BASE_URL` (post-deploy) |
| `npm run gate:full` | `gate` + local E2E |
| `npm audit --omit=dev` | A5 — optional but kept available |

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
| **D3** — security functional | **Removed with D2** | Manual check after deploy: public site open; `/jury`, `/pages/jury/*`, `/jury/fiches/*.pdf` answer **401** without credentials (`SECURITY.md` §7). Automated part: `tests/unit/jury-auth.test.ts` + `check:secrets` |
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

## AI / agent obligation

Before closing a coding task that touched `pages/`, `src/`, `public/`, or config:

1. Run `npm run gate`
2. If HTML routes or public UX changed, also run `npm run test:e2e` when feasible
3. Report red tests; do not claim done while red
