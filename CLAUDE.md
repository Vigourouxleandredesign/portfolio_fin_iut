# Claude / AI instructions

**Read `AGENTS.md`, `docs/ARCHITECTURE.md`, `docs/SECURITY.md` and — for anything visual — `docs/DA.md` before any change.**

Security and reliability come first: static site, no backend, no secrets. The reflective PDFs live only in `public/jury/fiches/`, served only after authentication by the Edge Function, never imported into the bundle. Public repository since 01/11/2026: the PDFs are readable on GitHub, the jury protection applies to the site. Run `npm run gate` before calling a task done.
