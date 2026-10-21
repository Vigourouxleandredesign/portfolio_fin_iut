# Security — Portfolio (mandatory)

**Version:** 2.0 (2026-10-21 — Supabase removed from the codebase)  
**Status:** Non-negotiable for all contributors and AI agents.

**Principle:** the public site is a **static, backend-less** build. Nothing private ever enters this repo or its bundle. The only private content (reflective sheets) lives on a **separate** Netlify site protected **server-side** by Netlify’s password.

Related: [ARCHITECTURE.md](./ARCHITECTURE.md) · [AGENTS.md](../AGENTS.md) · [TESTING.md](./TESTING.md)

---

## 0. Decision — Netlify password (locked 2026-10-06)

Supabase is **out** and its code was **deleted** on 2026-10-21 (client, auth, evaluator page, SQL migration, tests, CSP origins). Do not recreate Supabase, app auth, RLS, or an `evaluator.html` page. Git history keeps the old design if a future decision reopens a backend.

| Site | Protection | Contents |
|------|------------|----------|
| **Public portfolio** (this repo) | None (open) | Home, projects, CV, contact. No reflective PDFs, no password, no private URL. |
| **Teacher site** (`docs/content/teacher-site.md`) | Netlify **Password protection** (dashboard, server-side) | One page per competence + the reflective PDFs. Password shared with teachers out of band. |

Rules:

- Never put the password or the PDFs in this repo, in `public/`, or in any Vite import.
- Never password-protect the **public** portfolio.
- Never replace the Netlify password by a client-side form, a JS check or a “secret” URL.
- The public site may link **to** the teacher site (the link is not a secret — the password is the lock).
- After the jury: delete the teacher site (or rotate the password) and remove the public link.

---

## 1. Secrets & environment variables

| Rule | Detail |
|------|--------|
| **No secret in the front** | Anything `VITE_*` is compiled into the public bundle. There is currently **no** env var required. |
| **Never commit `.env`** | `.gitignore` covers `.env`, `.env.*` (except `.env.example`, names only). |
| **Guard** | `npm run check:secrets` (part of `npm run gate`) scans tracked sources for keys/tokens (`scripts/check-no-secrets.mjs`). |
| **Netlify** | Build settings only; no secret needed for a static build. |

---

## 2. Content & privacy (curation rules)

| Source | Rule |
|--------|------|
| **Vill’âge Jeunes** (client app in production) | Only curated, anonymised screenshots. No repo dump, no real member data, no admin screens. |
| **Lab Horizon (SAE 501)** | Never publish the seed accounts / `.env` of the SAE repo. Screens captured from a local Docker run must not show credentials. |
| **Visualcom / clients** | Public pages only; logos used with the employer’s agreement. |
| **Images** | Export as WebP/JPG through the pipeline (strips EXIF/GPS). No personal documents (ID, payslips…) anywhere. |
| **Reflective sheets** | Teacher site only (§0). |

---

## 3. Front-end (Vite / TypeScript)

| Rule | Detail |
|------|--------|
| **No `innerHTML` with dynamic content** | Use `textContent` / DOM APIs. Static template strings authored in code are fine. |
| **No inline `<script>` / `style=""`** | CSP forbids them (`script-src 'self'`, `style-src 'self'`). Use classes + tokens; set dynamic values with `element.style.setProperty('--x', …)` from TS. |
| **External links** | `target="_blank"` always with `rel="noopener noreferrer"`. |
| **Debug tooling** | Tweakpane is lazy-loaded only with `?debug` — never in the main bundle. |
| **Third-party scripts** | None (no analytics, no CDN). Fonts and decoders are self-hosted (`@fontsource/*`, `public/draco/`). |

---

## 4. Netlify headers (`public/_headers`)

Current policy (tested by `tests/feature/catalog-and-headers.test.ts`, C8/C9):

- `X-Frame-Options: DENY` + CSP `frame-ancestors 'none'` — no one can frame the portfolio.
- `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`.
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()`.
- `Strict-Transport-Security` (1 year, preload) + CSP `upgrade-insecure-requests`.
- `Cross-Origin-Opener-Policy: same-origin`.
- **CSP:** `default-src 'self'`; `connect-src 'self'`; `img-src 'self' data: blob:`; `font-src 'self' data:`; `object-src 'none'`; `base-uri 'self'`; `form-action 'self'`.
- `/assets/*` — immutable long cache (Vite hashes file names).

**Three.js / Rapier / Draco (2026-08-07):** `script-src 'self' 'wasm-unsafe-eval'` (WASM only — does **not** allow JS `eval`) and `worker-src 'self' blob:` (Draco’s blob worker). Self-hosted only.

**Iframes (project previews):** each embedded origin is listed explicitly in `frame-src` (`https://visualcom.nc`, `https://magicallab.netlify.app`, `https://*.figma.site`) — never `frame-src https:`. Remote sites may refuse embedding; the UI keeps an “Ouvrir le site” fallback. Shot-mode mockups need no `frame-src`. Adding an iframe = adding its origin here **and** in the test.

---

## 5. Contact form

Netlify Forms (`data-netlify="true"`) with a honeypot field (`bot-field`, tested in E2E smoke). No custom endpoint, no email address exposed by JS.

---

## 6. Supply chain

| Rule | Detail |
|------|--------|
| **Minimal dependencies** | Runtime: `three`, `@dimforge/rapier3d-compat`, `@fontsource/*`, `tweakpane` (debug, lazy). Any new runtime dependency must be justified in the PR. |
| **Lockfile committed** | `package-lock.json` — install with `npm ci` on Netlify/CI. |
| **Audit** | `npm run audit:prod` before each deploy; fix `high`/`critical`. |
| **Pinned 3D stack** | `three` pinned (`0.185.1`) — upgrade deliberately, re-test the hero. |

---

## 7. Teacher site (password-protected)

- Separate Netlify site, separate folder **outside** this repo (see `docs/content/teacher-site.md`).
- Server-side lock: Netlify **Password protection** (dashboard, Pro plan) **or** `Basic-Auth` in that site’s `_headers` (all plans). The `_headers` file stays in the local teacher folder (drag-and-drop deploy, no Git) — never a JS gate.
- Long unique password, shared out of band (email to the jury) — never in Git, HTML, issues or chat logs.
- Its own `_headers`: `X-Robots-Tag: noindex, nofollow`, `X-Frame-Options: DENY`, same strict CSP.
- One shared password is acceptable: temporary pack, low sensitivity.
- Delete the site or rotate the password after the jury.

---

## 8. Deployment checklist

Before merge / deploy:

- [ ] `npm run gate` green (typecheck + secrets + tests + build)
- [ ] `npm run audit:prod` — no high/critical
- [ ] No secret, PDF or password in the diff
- [ ] New iframe origin → `frame-src` + test updated
- [ ] Screens of client apps are curated/anonymised (§2)
- [ ] `.env.example` updated if a `VITE_*` var is added (names only)

---

## 9. Forbidden

- Any secret, token or password in front code, Git, `.env.example` values or logs
- Reflective PDFs or teacher password in this repo / bundle
- Client-side password or hidden URL as an access control
- `frame-src https:` wildcard, inline scripts/styles, third-party script CDNs
- Raw dumps of client projects (Vill’âge Jeunes) or SAE credentials (Lab Horizon)
- Re-adding Supabase/auth without a new written decision in §0

**Priority order if conflict:** `SECURITY.md` > convenience > UX shortcuts.
