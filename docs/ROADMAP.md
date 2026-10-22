# Roadmap — portfolio de fin d’année

**Mise à jour :** 2026-10-22 · **Livraison :** vendredi **30/10/2026** · **Chef de projet :** Claude · **PO :** Léandre
**Exécution :** lots détaillés dans [`docs/work-packages/`](work-packages/README.md) (planning, dépendances, prompts, critères d’acceptation).

---

## Où on en est

| Chantier | État |
|---|---|
| Stack & sécurité (Vite MPA statique, un seul site Netlify, `/jury` en Basic-Auth injecté au build) | ✅ prêt — `docs/SECURITY.md` v2.1, `netlify.toml`, `scripts/inject-jury-auth.mjs`, tests |
| Nettoyage (Supabase, évaluateur, hero archivé, sources lourdes hors repo) | ✅ fait (Haiku, 21/10) · L0 ✅ fusionné 22/10 |
| DA v3 « Le Sanctuaire nocturne » | ✅ validée — `docs/DA.md`, skill `portfolio-da`, planche DA, tokens, 13 gestes de peinture |
| Kit d’assets projets | ✅ — `docs/content/assets-kit.md` (reste : captures Lab Horizon / Spring Boot en L6 ; captures AR Micro-monde reportées) |
| Briefs de contenu | ✅ — `docs/content/projects/*.md`, `home.md`, `cv.md`, `jury-content.md` |
| Fiches réflexives | ✅ orthographe corrigée (22/10), originaux sauvegardés, PDF régénérés — réexport Word facultatif |
| Intégration (accueil, pages projet, jury, CV) | ⏳ lots L0 → L5 |
| Déploiement & recette | ⏳ lots L7 → L8 |

## Planning

Voir le tableau de [`work-packages/README.md`](work-packages/README.md). Jalons :

| Date | Jalon |
|---|---|
| 23/10 | Socle DA en place (L0 + L1) |
| 24/10 | Accueil + espace jury (L2 ∥ L4) |
| 26/10 | Toutes les pages projet (L3a → L3b ∥ L3c ∥ L3d) + captures (L6) |
| 27/10 | CV / contact / 404 / SEO (L5) — **gel des fonctionnalités** |
| 28/10 | Préprod Netlify (L7) |
| 29/10 | Recette + correctifs (L8) — journée tampon |
| 30/10 | Production, envoi au jury du lien `/jury` et, séparément, du mot de passe |

## Décisions (journal)

| Date | Décision |
|---|---|
| 06/10 | Supabase abandonné ; fiches réflexives protégées par mot de passe Netlify |
| 21/10 | DA v3 validée (nuit, lumière de feu, gouache cuivre / or / phtalo, étalonnage Odyssée, cartels « musée ») |
| 21/10 | Code Supabase / évaluateur / hero archivé supprimé ; sources lourdes dans `../Sources/` |
| 21/10 | **Un seul site Netlify** ; zone `/jury` protégée (Basic-Auth via variable `JURY_BASIC_AUTH`) ; dépôts GitHub privés (sauf MagicalLab, public, sans risque) |
| 21/10 | Gestes de peinture refaits d’après les 6 références (textures WebP + silhouettes SVG) |
| 22/10 | 4 projets vedettes en accueil : Lab Horizon, MagicalLab, Micro-monde, Vill’âge Jeunes ; Visualcom = majeur ; HyperLoop, Spring Boot = secondaires ; Pacific Dataviz, Borne = bonus |
| 22/10 | Espace jury : 4 compétences (brouillon de compétences de Léandre), preuves Visualcom + Vill’âge Jeunes (+ Quintessence citée sans fiche) |
| 22/10 | Rôle Lab Horizon fixé ; robot MagicalLab = Komov (Sketchfab) ; récit Pacific Dataviz fourni ; `@fontsource/ubuntu-mono` validé (auto-hébergé) ; captures AR Micro-monde reportées (visuels de repli) ; fiches réflexives corrigées ; HyperLoop : tous les visuels sont IA (mention sous la galerie) |
| 22/10 | L0 fusionné dans `main` (nettoyage, WebP, skill DA, gestes de peinture versionnés, H1 MagicalLab accessible) |

## Questions ouvertes (bloquent un texte, pas un lot)

| # | Question | Impact |
|---|---|---|
| Q1b | Lab Horizon : « ce que j’en retiens » (facultatif — sans réponse, le bloc n’est pas affiché) | Page Lab Horizon |
| Q6 | Licence du robot Komov (page Sketchfab) : lien obligatoire ? | Crédit MagicalLab (L8) |

Q1, Q2, Q3, Q4, Q5 : réglées le 22/10 (voir journal).

## Risques

| Risque | Parade |
|---|---|
| Lot en retard | Couper L3d (pages bonus) en premier ; 29/10 en tampon |
| Exécutant qui invente du texte ou casse un test | Briefs mot pour mot, tests garde-fous (C10–C13, jury), rapport obligatoire, recette indépendante L8 |
| Fuite des fiches | Repo privé, Basic-Auth sur 3 chemins, build qui échoue sans mot de passe, test « texte jury hors bundle » |
| Captures impossibles (Docker, MySQL, téléphone) | Images de repli prévues dans les briefs |
