# Roadmap — portfolio de fin d’année

**Mise à jour :** 2026-10-25 · **Mise en production :** mercredi **28/10/2026** · **Remise au jury :** au plus tard le 30/10 · **Chef de projet :** Claude · **PO :** Léandre
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
| Intégration (accueil, pages projet, jury, CV) | ✅ L1 → L5 fusionnés et poussés (24/10) · ⏳ L5b finitions (inspection du 25/10) |
| Captures | ⏳ L6 (Lab Horizon, Spring Boot ; AR Micro-monde reportée) |
| Déploiement & recette | ⏳ lots L7 → L8 |

## Planning

Voir le tableau de [`work-packages/README.md`](work-packages/README.md). Jalons :

| Date | Jalon |
|---|---|
| 24/10 | ✅ L1 → L5 fusionnés, `main` poussé sur GitHub (CI GitHub Actions active) |
| 25/10 | ✅ Inspection chef de projet → lots **L5b** (finitions) et **L5c** (audit des dépendances) · L5c à lancer dès aujourd’hui |
| 26/10 | L5b (Sonnet) ∥ L6 captures (Haiku + Léandre) · soir : L7 préprod Netlify |
| 27/10 | L8 recette + correctifs — **gel des fonctionnalités** |
| **28/10** | **Mise en production** |
| 29–30/10 | Marge d’urgence · textes « Ce que j’en retiens » projet par projet (mises à jour à chaud) · remise au jury du lien `/jury` et, séparément, du mot de passe |

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
| 24/10 | Historique git nettoyé (sauvegarde `backup-git-avant-nettoyage-historique-2026-10-24.bundle` hors dépôt) ; outillage CI ajouté (Prettier, ESLint, Stylelint, Husky, GitHub Actions) ; L1 → L5 livrés |
| 25/10 | Inspection : 3 bloquants/majeurs (Visualcom hero + texte « Phase B », sous-titre accueil mobile, cohérence catalogue) → L5b |
| 25/10 | **Incident sécurité** (préprod Netlify) : la règle `Basic-Auth` de `_headers` est ignorée sur l'offre gratuite de Netlify (réservée Pro/Enterprise) → `/jury` et les PDF répondaient 200. Correctif L7s : Edge Function d'authentification (offre gratuite), test E2E de non-régression sur la prod. Erreur de conception du chef de projet. |
| 25/10 | Mise en production avancée au **mercredi 28/10** (2 jours de marge) ; sous-domaine Netlify (pas de nom de domaine) ; téléphone conservé dans le pied de page ; robot Komov : provenance citée, sans lien ; **audit des dépendances obligatoire et bloquant** dans la CI (pre-commit + GitHub Actions quotidien + Dependabot) → L5c ; textes « Ce que j’en retiens » rédigés par Léandre projet par projet la semaine du 26/10 |

## Questions ouvertes (bloquent un texte, pas un lot)

| # | Question | Impact |
|---|---|---|
| Q7 | « Ce que j’en retiens », projet par projet (semaine du 26/10) : valider ceux de Micro-monde et Vill’âge Jeunes (rédigés d’après tes fiches) ; fournir ceux de Lab Horizon, HyperLoop, Spring Boot, Borne (facultatifs : bloc masqué sans texte) | Pages projet — non bloquant pour la mise en prod |

Q1 à Q5 réglées le 22/10 ; Q6, Q8, Q9 réglées le 25/10 (voir journal).

## Risques

| Risque | Parade |
|---|---|
| Lot en retard | Couper les points mineurs de L5b en premier ; 29–30/10 en tampon après la mise en prod |
| Faille publiée sur une dépendance | Audit bloquant (pre-commit + CI quotidienne) + Dependabot ; correction dans un commit `fix(deps)` |
| Exécutant qui invente du texte ou casse un test | Briefs mot pour mot, tests garde-fous (C10–C13, jury), rapport obligatoire, recette indépendante L8 |
| Fuite des fiches | Repo privé, **Edge Function** d'authentification sur `/jury*` et `/pages/jury*` (L7s), build qui échoue sans mot de passe, test E2E 401 sur la prod, test « texte jury hors bundle » |
| Captures impossibles (Docker, MySQL, téléphone) | Images de repli prévues dans les briefs |
