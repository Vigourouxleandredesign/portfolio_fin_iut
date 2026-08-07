# Supabase — setup & official documentation

**Status:** Mandatory reading before configuring auth, Storage, or the evaluator area.

Security rules: [SECURITY.md](./SECURITY.md) · Architecture: [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## 0. Project status (keep in sync)

| Area | Status |
|------|--------|
| **Supabase project** | Configured (schema, RLS, bucket `evaluator-assets`) |
| **Evaluator users** | **Later** — create in Auth when evaluators are known; set `profiles.role = 'evaluator'` |
| **Private assets** | **Later** — upload to **Storage** + row in **`project_assets`** (not Git / not `public/`) |
| **Front priority now** | Public site: hero, sections, **Three.js**, etc. |
| **Evaluator UI** | Implemented (`pages/evaluator.html`) — usable once users + assets exist |

**Rule for all future work:** public portfolio media → `src/assets/` or `Assets/`; **evaluator-only** media (full videos, 3D files, dossiers complets) → **Supabase Storage** + metadata in `project_assets`. See [§2.5 Storage layout](#25-storage-layout) below.

---

## 1. Official Supabase documentation

| Topic | Official link |
|-------|----------------|
| **Documentation home** | https://supabase.com/docs |
| **Dashboard** | https://supabase.com/dashboard |
| **JavaScript client** | https://supabase.com/docs/reference/javascript/introduction |
| **Auth — overview** | https://supabase.com/docs/guides/auth |
| **Auth — PKCE flow (SPA / Vite)** | https://supabase.com/docs/guides/auth/sessions/pkce-flow |
| **Auth — password sign-in** | https://supabase.com/docs/reference/javascript/auth-signinwithpassword |
| **Auth — sign out** | https://supabase.com/docs/reference/javascript/auth-signout |
| **Auth — MFA** | https://supabase.com/docs/guides/auth/auth-mfa |
| **Row Level Security (RLS)** | https://supabase.com/docs/guides/database/postgres/row-level-security |
| **Storage — overview** | https://supabase.com/docs/guides/storage |
| **Storage — access control** | https://supabase.com/docs/guides/storage/security/access-control |
| **Signed URLs** | https://supabase.com/docs/reference/javascript/storage-from-createsignedurl |
| **SQL Editor** | https://supabase.com/docs/guides/database/overview |
| **Regions (EU / RGPD)** | https://supabase.com/docs/guides/platform/regions |

### Related (not Supabase)

| Topic | Link |
|-------|------|
| **Vite environment variables** | https://vitejs.dev/guide/env-and-mode.html |
| **Netlify environment variables** | https://docs.netlify.com/environment-variables/overview/ |

---

## 2. Project setup (step by step)

### 2.1 Create project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → **New project**.
2. Choose **Region: EU (Frankfurt)** if storing personal data (RGPD).
3. Save the database password securely (not in Git).

### 2.2 Run database migration

1. Dashboard → **SQL Editor** → **New query**.
2. Paste the contents of:

   `supabase/migrations/00001_evaluator_schema.sql`

3. Click **Run**.

This creates:

- `profiles` (roles: `student`, `evaluator`)
- `project_assets` (metadata for media)
- RLS policies on all private tables
- Private Storage bucket `evaluator-assets`

### 2.3 Auth settings

1. Dashboard → **Authentication** → **Providers** → **Email** — enable.
2. **Authentication** → **Settings**:
   - Enable **Confirm email** for evaluator accounts.
   - **Disable public sign-up** (recommended): disable “Allow new users to sign up” or do not expose sign-up in the front (this project: login only).
3. Create evaluator accounts: **Authentication** → **Users** → **Add user** (invite email).
4. Set evaluator role in SQL (replace `USER_UUID`):

```sql
update public.profiles
set role = 'evaluator'
where id = 'USER_UUID';
```

Or use **Table Editor** → `profiles` → set `role` to `evaluator`.

5. **MFA** (recommended for evaluators): [Auth MFA guide](https://supabase.com/docs/guides/auth/auth-mfa).

### 2.4 API keys (front only)

1. Dashboard → **Project Settings** → **API**.
2. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`
3. **Never** put the `service_role` key in the front or Git.

Local `.env` (not committed):

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Netlify: **Site configuration** → **Environment variables** — same names for Production (and Preview if needed).

### 2.5 Storage layout

Private bucket: `evaluator-assets`

Path convention:

```
evaluator-assets/
  {user_id}/
    hero.webp
    demo.mp4
    scene.glb
```

Register metadata in `project_assets` with matching `storage_path` (e.g. `{user_id}/demo.mp4`).

### 2.6 Redirect URLs (auth)

Dashboard → **Authentication** → **URL Configuration**:

| Environment | Site URL / Redirect URLs |
|-------------|--------------------------|
| Local dev | `http://localhost:5173` |
| Production | `https://your-site.netlify.app` |

Add `/evaluator.html` path if using email magic links later.

---

## 3. Front-end integration (this repo)

| File | Role |
|------|------|
| `src/scripts/modules/supabase-client.ts` | Singleton client (PKCE) |
| `src/scripts/features/auth/` | Login, session, sign-out |
| `src/scripts/features/evaluator/` | Dashboard, signed URLs |
| `pages/evaluator.html` | Evaluator route |
| `src/scripts/entries/evaluator.ts` | Page entry |

Access control is enforced by **RLS** and **Storage policies**, not by hiding the page URL.

---

## 4. Adding a private asset (manual test)

1. Upload file to Storage: `evaluator-assets` / `{student_user_id}/demo.mp4`
2. Insert row in `project_assets`:

```sql
insert into public.project_assets (
  owner_id,
  title,
  description,
  asset_type,
  storage_path,
  is_public
) values (
  'STUDENT_USER_UUID',
  'Demo video',
  'Project walkthrough',
  'video',
  'STUDENT_USER_UUID/demo.mp4',
  false
);
```

3. Log in as **evaluator** on `/evaluator.html` — asset appears with signed URL.

---

## 5. Deploy checklist

See [SECURITY.md §10](./SECURITY.md#10-git--deployment-checklist).

- [ ] Migration applied in Supabase
- [ ] RLS enabled (verify in Table Editor → RLS enabled)
- [ ] Bucket `evaluator-assets` is **private**
- [ ] Evaluator accounts created + `role = evaluator`
- [ ] Public sign-up disabled or unused
- [ ] `VITE_*` vars set on Netlify
- [ ] Redirect URLs configured
- [ ] No `service_role` in repository

---

## 6. Troubleshooting

| Issue | Check |
|-------|--------|
| “Supabase not configured” on evaluator page | `.env` locally or Netlify env vars |
| Login works but “access denied” | `profiles.role` must be `evaluator` |
| Empty asset list | Rows in `project_assets`; RLS allows evaluator SELECT |
| Storage 403 | Path must start with `{owner_id}/`; policies applied |
| CORS / blocked requests | Site URL in Supabase Auth settings |

Official support: https://supabase.com/docs/guides/platform/troubleshooting
