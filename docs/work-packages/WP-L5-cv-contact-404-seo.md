# L5 — CV, contact, page 404, SEO

**Exécutant :** Cursor (agent) ou Claude Code Sonnet · **Durée :** ½ journée · **Dépend de :** L1 (idéalement après L2/L3 pour le sitemap complet) · **Branche :** `wp/L5-cv-seo`

## Périmètre

`pages/cv.html` · `pages/contact.html` · créer `pages/404.html` + `src/scripts/entries/not-found.ts` + `src/styles/pages/not-found.css` · `src/styles/pages/cv.css`, `contact.css`, `src/styles/components/timeline.css`, `contact-form.css`, `contact-card.css` · `vite.config.ts` (entrée `notFound`) · `public/_redirects` (dernière ligne) · créer `public/sitemap.xml` · `public/robots.txt` (ligne `Sitemap:`) · tests `tests/feature/cv-seo.test.ts`.

## Étapes

1. **CV** : réécrire `cv.html` d’après `docs/content/cv.md` (DA v3, timeline en cartels, bouton PDF `download`, bouton secondaire « Espace jury »). Rien de la section « Hors page ».
2. **Contact** : migration DA v3 ; **conserver** le formulaire Netlify (`data-netlify="true"`, honeypot `bot-field`, testés en E2E) ; libellés et erreurs accessibles.
3. **404** : page « Salle introuvable » (header et footer communs, donc lien « Espace jury » — test C12) — logo or + un geste `splat-copper.webp`, phrase `Cette salle n’existe pas (encore).`, liens Accueil / Mes projets. Ajouter **en dernière ligne** de `_redirects` : `/*    /pages/404.html    404`.
4. **SEO** : `public/sitemap.xml` avec les routes publiques propres (`/`, `/projects`, `/projects/<9 slugs>`, `/cv`, `/contact`) et **sans** `/jury` ; `robots.txt` : `Sitemap: https://<domaine>/sitemap.xml` (domaine : `<!-- TODO L7 -->` → placeholder `https://REMPLACER-PAR-LE-DOMAINE` à remplacer en L7). Vérifier sur chaque page publique : `<title>` unique, `<meta name="description">`, `og:title`, `og:description`, `og:image`, `lang="fr"`, `<link rel="canonical">` (même placeholder de domaine).
5. Tests `cv-seo.test.ts` : lien `/documents/cv.pdf` + fichier présent ; sitemap sans `/jury` et avec les 9 projets ; chaque page publique a `title`, `description`, `og:image`, `canonical` ; 404 présente et `_redirects` se termine par la règle 404.
6. Gate + E2E + captures.

## Prompt à coller

```
Tu es exécutant du lot L5 (CV, contact, 404, SEO) du portfolio de Léandre. Applique le protocole commun de docs/work-packages/README.md. Lis la skill portfolio-da, docs/content/cv.md puis docs/work-packages/WP-L5-cv-contact-404-seo.md. Le formulaire Netlify et son honeypot doivent rester intacts. Aucune donnée personnelle hors de ce que cv.md autorise. Termine par le rapport au format du README.
```
