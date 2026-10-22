# Security — Portfolio (mandatory)

**Version:** 2.1 (2026-10-21 — single Netlify site, jury area behind server-side Basic-Auth)  
**Status:** Non-negotiable for all contributors and AI agents.

**Principle:** one **static, backend-less** Netlify site. Everything is public except the **jury area** (`/jury/*`: competence pages + reflective PDFs), locked **server-side** by Netlify Basic-Auth. The password exists only in a Netlify environment variable — never in Git, HTML or JS.

Related: [ARCHITECTURE.md](./ARCHITECTURE.md) · [AGENTS.md](../AGENTS.md) · [TESTING.md](./TESTING.md)

---

## 0. Decision — one Netlify site, jury area behind a server-side password (locked 2026-10-21)

Supabase is **out** and its code was **deleted** on 2026-10-21. Do not recreate Supabase, app auth, RLS or an `evaluator.html` page.
**Revision 2026-10-21 (Léandre):** no second site — the reflective sheets live **in this site**, under `/jury/`, password-protected by Netlify.

| Zone | URL | Protection | Contents |
|------|-----|------------|----------|
| **Public portfolio** | `/`, `/projects/*`, `/cv`, `/contact` | None (open) | Home, case studies, CV, contact. |
| **Jury area** | `/jury`, `/jury/*`, `/pages/jury/*` | **Basic-Auth** (Netlify, server-side) | One page per competence (`pages/jury/*.html`) + PDFs (`public/jury/fiches/<slug>/*.pdf`). Spec: `docs/content/teacher-site.md`. |

How the lock works:

1. Netlify env var **`JURY_BASIC_AUTH`** = `jury:<password ≥ 16 chars>` (Site configuration › Environment variables, scope *Builds*). Never in Git.
2. `netlify.toml` runs `npm run build && node scripts/inject-jury-auth.mjs`: the script appends `Basic-Auth` + `noindex` + `no-store` rules for the 3 jury paths to **`dist/_headers`** (build output only).
3. On Netlify, a missing or weak credential **fails the build** — the jury area can never ship unprotected. Locally it only warns.
4. Basic-Auth via `_headers` is available on **all** Netlify plans.

Rules:

- The **GitHub repo must be private**: the PDFs are committed under `public/jury/`, so a public repo would expose them without password.
- Jury text lives **only in the jury HTML pages**. Never import jury content into TS/JSON: `/assets/*.js` bundles are public.
- Never link a PDF from a public page. Public pages may link to `/jury` (one « Espace jury » link in footer + CV) — the URL is not a secret, the password is the lock.
- Never a client-side password, JS check or « secret » URL.
- Never password-protect the public portfolio.
- After the jury: remove `public/jury/`, the env var and the public link (or rotate the password).

---

## 1. Secrets & environment variables

| Rule | Detail |
|------|--------|
| **No secret in the front** | Anything `VITE_*` is compiled into the public bundle. The only secret is `JURY_BASIC_AUTH` (no `VITE_` prefix → never bundled; read only by `scripts/inject-jury-auth.mjs` at build time). |
| **Never commit `.env`** | `.gitignore` covers `.env`, `.env.*` (except `.env.example`, names only). |
| **Guard** | `npm run check:secrets` (part of `npm run gate`) scans sources + `netlify.toml` for keys/tokens and for any committed `Basic-Auth: user:pass` / `JURY_BASIC_AUTH=` value. `tests/unit/jury-auth.test.ts` checks the lock. |
| **Netlify** | `netlify.toml` (build + jury lock). `JURY_BASIC_AUTH` set in the dashboard, scope *Builds*. |

---

## 2. Content & privacy (curation rules)

| Source | Rule |
|--------|------|
| **Vill’âge Jeunes** (client app in production) | Only curated, anonymised screenshots. No repo dump, no real member data, no admin screens. |
| **Lab Horizon (SAE 501)** | Never publish the seed accounts / `.env` of the SAE repo. Screens captured from a local Docker run must not show credentials. |
| **Visualcom / clients** | Public pages only; logos used with the employer’s agreement. |
| **Images** | Export as WebP/JPG through the pipeline (strips EXIF/GPS). No personal documents (ID, payslips…) anywhere. |
| **Reflective sheets** | `/jury/` only, behind Basic-Auth (§0). Private GitHub repo. |

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

## 7. Jury area (password-protected)

- Pages `pages/jury/*.html` (built to `/pages/jury/`, pretty routes `/jury`, `/jury/<competence>` in `public/_redirects`); PDFs in `public/jury/fiches/<slug>/`.
- Lock = §0 (Basic-Auth injected at build). All three path families are protected: `/jury`, `/jury/*`, `/pages/jury/*`.
- Extra headers on those paths: `X-Robots-Tag: noindex, nofollow`, `Cache-Control: private, no-store`. `robots.txt` adds `Disallow: /jury`.
- Jury pages load only shared CSS/JS (no jury text in bundles) and no third-party resource.
- Long unique password, shared with the jury out of band (e-mail) — never in Git, HTML, issues or chat logs.
- Verify after each deploy (private window): `/jury` → 401 prompt; `/jury/fiches/visualcom/mission-reflection.pdf` → 401 without credentials; `/pages/jury/index.html` → 401.

---

## 8. Deployment checklist

Before merge / deploy:

- [ ] `npm run gate` green (typecheck + secrets + tests + build)
- [ ] `npm run audit:prod` — no high/critical
- [ ] No secret or password in the diff; PDFs only under `public/jury/fiches/`
- [ ] `JURY_BASIC_AUTH` set on Netlify; post-deploy 401 checks of §7 done
- [ ] New iframe origin → `frame-src` + test updated
- [ ] Screens of client apps are curated/anonymised (§2)
- [ ] `.env.example` updated if a `VITE_*` var is added (names only)

---

## 9. Forbidden

- Any secret, token or password in front code, Git, `.env.example` values or logs
- The jury password anywhere but the Netlify env var; reflective PDFs outside `public/jury/`; jury text in JS bundles; a public GitHub repo while PDFs are committed
- Client-side password or hidden URL as an access control
- `frame-src https:` wildcard, inline scripts/styles, third-party script CDNs
- Raw dumps of client projects (Vill’âge Jeunes) or SAE credentials (Lab Horizon)
- Re-adding Supabase/auth without a new written decision in §0

**Priority order if conflict:** `SECURITY.md` > convenience > UX shortcuts.
