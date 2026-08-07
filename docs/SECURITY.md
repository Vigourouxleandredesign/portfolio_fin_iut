# Security — Portfolio (mandatory)

**Version:** 1.0  
**Status:** Non-negotiable for all contributors and AI agents.

**Principle:** Never trust the client. Security is enforced **server-side** (Supabase RLS, Storage policies, Netlify env). The front must not contain secrets or private data in the bundle.

Read this document before any auth, evaluator area, Supabase, or private media work.

Related: [ARCHITECTURE.md](./ARCHITECTURE.md) · [AGENTS.md](../AGENTS.md)

---

## 1. Core model (Netlify + Supabase)

| Layer | Role |
|-------|------|
| **Netlify** | Static front (`dist/`) — no secrets, no private URLs in public pages |
| **Supabase Auth** | Identities, sessions, JWT — use **PKCE** for SPA |
| **Supabase DB** | Metadata only — **RLS required** on every private table |
| **Supabase Storage** | Images, video, 3D — **private buckets** + policies + signed URLs |

External API calls over HTTPS are expected. Security does not rely on hiding URLs.

---

## 2. Secrets & environment variables

| Rule | Detail |
|------|--------|
| **Anon key only in front** | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` — public by design |
| **Never `service_role` in front or Git** | Bypasses all RLS — server/Edge Functions only if ever needed |
| **Never commit `.env`** | Use `.env.example` (names only, no values) |
| **Netlify env vars** | Set in dashboard; separate **preview** vs **production** |
| **Key rotation** | Regenerate in Supabase + update Netlify if leaked |

---

## 3. Authentication (evaluator role)

| Rule | Detail |
|------|--------|
| **Individual accounts** | No shared password for evaluators in production |
| **Disable public sign-up** | Create evaluator accounts manually or via invite |
| **Email verification** | Required for evaluator accounts |
| **MFA / 2FA** | Strongly recommended for evaluator accounts |
| **Role in database** | `profiles.role` (`evaluator`, `student`) — **never** role-only in front TS |
| **Session** | Use Supabase client; logout must clear session |
| **No auth logic bypass** | Private routes load content **after** valid session check |

Future code location: `src/scripts/features/auth/`

---

## 4. Row Level Security (RLS) — mandatory

RLS must be **enabled** on every table containing private or role-gated data.

| Rule | Detail |
|------|--------|
| **Default deny** | No policy = no access |
| **Explicit policies** | Separate SELECT / INSERT / UPDATE / DELETE |
| **Public data** | Only rows explicitly marked public (e.g. `is_public = true`) |
| **Evaluator read** | Policy checks `auth.uid()` + `profiles.role = 'evaluator'` |
| **Student write** | Own rows only (`auth.uid() = owner_id`) where applicable |
| **Test all roles** | Anonymous, authenticated non-evaluator, evaluator |

Never ship private tables without RLS. Never rely on hiding table names.

---

## 5. Storage (images, video, 3D)

| Rule | Detail |
|------|--------|
| **Private buckets** | Evaluator content — not public buckets |
| **Storage policies** | Mirror RLS logic (role + ownership) |
| **Signed URLs** | Prefer time-limited URLs for video / `.glb` / large files |
| **No private media in `public/` or Git** | No private imports in Vite bundle |
| **Validate uploads** | MIME type, extension, max file size |
| **Avoid user-uploaded SVG** | XSS risk if served inline — prefer PNG/WebP or strict sanitization |

Future code location: `src/scripts/features/evaluator/`

---

## 6. Front-end (Vite / TypeScript)

| Rule | Detail |
|------|--------|
| **No private URLs in public HTML** | No hardcoded signed URLs or private paths in `pages/` (public routes) |
| **Fetch after auth** | Evaluator media loaded only post-login |
| **No `innerHTML` with user/API content** | Prevents XSS — use `textContent` or safe DOM APIs |
| **No secrets in source** | Grep for `service_role`, API keys, tokens before commit |
| **No security by obscurity** | `/evaluator` path may be known — policies must block unauthorized access |

---

## 7. Netlify headers & HTTPS

Maintain `public/_headers` for production (see file in repo).

Required headers (minimum):

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` — disable unused APIs (camera, mic, geolocation)

**CSP:** Add/update when Three.js or external scripts are integrated — restrict `script-src` and `connect-src` to self + `*.supabase.co`.

**Three.js / Rapier / Draco (2026-08-07):** the 3D hero (`features/three-scene/`) needs two narrow, justified additions — no external CDN, everything self-hosted under `public/draco/`:

- `script-src 'self' 'wasm-unsafe-eval'` — `'wasm-unsafe-eval'` (not the broader `'unsafe-eval'`) is required by some browsers to run `WebAssembly.instantiate` for the Rapier physics engine and the Draco geometry decoder. It does **not** enable JS `eval()`/`Function()` — scope stays WASM-only.
- `worker-src 'self' blob:` — `DRACOLoader` decodes meshes in a `Blob`-based Web Worker it creates itself; without `worker-src`, browsers fall back to `script-src`, which blocks `blob:` workers. `'self'` is kept alone on `script-src` for regular scripts; only `worker-src` gets `blob:`.

Both are self-hosted-only allowances (no `https:` wildcard, no external origin) — they do not weaken protection against third-party script injection.

HTTPS is enforced by Netlify in production.

---

## 8. Abuse prevention

| Risk | Mitigation |
|------|------------|
| Login brute force | Supabase rate limits; no public sign-up |
| Data scraping | RLS + signed URLs; monitor Supabase logs |
| SQL injection | Supabase client only — no raw SQL in front |
| XSS | No unsafe HTML injection; CSP headers |
| Dependency vulnerabilities | Run `npm audit`; keep Vite and `@supabase/supabase-js` updated |

---

## 9. Privacy (RGPD — school context)

| Rule | Detail |
|------|--------|
| **Data minimization** | Store only necessary personal data |
| **EU region** | Prefer Supabase region **EU (Frankfurt)** for personal data |
| **Retention** | Plan deletion of accounts and media after MIAW session |
| **Transparency** | Legal / info page: who accesses data, why, how long |

---

## 10. Git & deployment checklist

Before merge / deploy:

- [ ] No secrets in diff (`.env`, keys, tokens)
- [ ] RLS enabled and tested on new tables
- [ ] Storage buckets private with policies
- [ ] No `service_role` in client code
- [ ] Private assets not in `public/` or static imports on public pages
- [ ] `.env.example` updated if new env vars added
- [ ] Netlify env vars set for production

---

## 11. Option 1 fallback (Netlify password only)

If Supabase is not used yet:

- Acceptable only for **temporary MVP**
- Long unique password — never in Git
- Rotate after MIAW
- Do not store highly sensitive data behind password alone
- Migrate to Supabase before adding evaluator media at scale

---

## 12. Forbidden (security)

- `service_role` key in front, Git, or logs
- Private tables without RLS
- Public Storage buckets for evaluator content
- Hardcoded private media URLs in public pages or bundle
- Shared evaluator password in production (when Supabase is active)
- Trusting client-side role checks without server policy
- Committing `.env` or real keys to `.env.example`
- Skipping this document when adding auth or private content

---

## 13. Document updates

When adding Supabase, auth, or evaluator features:

1. Update this file if new patterns appear
2. Update `ARCHITECTURE.md` (structure + forbidden list)
3. Update `AGENTS.md` and `.cursor/rules/security-standards.mdc`

**Priority order if conflict:** `SECURITY.md` + RLS policies > convenience > UX shortcuts.
