# Documentation standards

All source files must be documented with file headers and JSDoc on public exports. Optional later: [documentation.js](https://github.com/documentation-js/documentation) for generated API docs.

---

## 1. Mandatory file header (line 1)

Every file in `pages/`, `src/styles/`, `src/scripts/`, and `src/data/` starts with a documentation block.

### TypeScript

```ts
/**
 * @file Hero reveal — canvas brush mask
 * @module features/hero-reveal
 * @description Initializes scratch reveal on `[data-hero-reveal]`. SEO text stays in HTML.
 * @see {@link ../../docs/ARCHITECTURE.md}
 */
```

### CSS

```css
/**
 * @file Hero — layout and visual states (non-canvas)
 * @description Styles for `.hero`. Colors via `var(--color-*)` only.
 * @requires variables.css, tokens.css (via entry import order)
 */
```

### HTML

```html
<!--
  @file Home page
  @description Landing page with hero reveal and portfolio sections.
  @route /
-->
```

### Required fields

| Field | Required |
|-------|----------|
| `@file` / title | Yes |
| `@description` | Yes |
| `@module` | TS features and entries |
| `@see` | Link to ARCHITECTURE when useful |
| `@route` | HTML pages |

---

## 2. Public exports (TypeScript)

Document every **exported** function, type, and constant:

```ts
/**
 * Mounts the hero brush effect on the given root element.
 * @param root - Element with `[data-hero-reveal]`
 * @returns Teardown function (removes listeners, cancels RAF)
 */
export function initHeroReveal(root: HTMLElement): () => void {
  // ...
}
```

Do not JSDoc every private helper — only public API and file headers.

---

## 3. Generate docs (optional, later)

When needed, install `documentation` and add a `docs` script to `package.json`. Output can go to `docs/api/` (gitignored).

Until then, file headers + JSDoc in the repo are sufficient.

---

## 4. Human docs

| File | Role |
|------|------|
| `docs/ARCHITECTURE.md` | Structure, rules, naming |
| `docs/SECURITY.md` | Security (auth, RLS, storage, headers) |
| `docs/DOCUMENTATION.md` | This file |
| `README.md` | Install, dev, build, deploy |

File headers complement these; they do not replace them.

---

## 5. Language

- **Code comments & JSDoc:** English
- **User-facing HTML text:** French (or as designed)
- **docs/*.md for humans:** French allowed; keep technical identifiers in English
