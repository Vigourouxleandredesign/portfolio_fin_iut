# Roadmap — portfolio de fin d’année

**Mise à jour :** 2026-10-26 · **Mise en production :** mercredi **28/10/2026** · **Remise au jury :** au plus tard le 30/10 · **Chef de projet :** Claude · **PO :** Léandre
**Exécution :** lots détaillés dans [`docs/work-packages/`](work-packages/README.md) (planning, dépendances, prompts, critères d’acceptation).

---

## Où on en est

| Chantier | État |
|---|---|
| Stack, CI/CD, sécurité | ✅ CI complète (audit bloquant, 305 tests, E2E) + Dependabot + run quotidien · jury protégé par **Edge Function** (401 vérifié en prod le 26/10, contournements testés) |
| DA v3, briefs, fiches réflexives | ✅ |
| Intégration (L1 → L5, L5b finitions, L5c audit) | ✅ fusionné et en ligne |
| Recette L8 + red team | ✅ rapports `docs/RECETTE.md`, `docs/REDTEAM-2026-10-25.md` · reste : perf mobile accueil / MagicalLab (46/100) |
| Captures | ✅ Lab Horizon · ✅ AR Micro-monde (préparées 26/10, intégration **L9**) · ⏳ Spring Boot (repli « B ») |
| Préprod | ✅ https://vigourouxleandre.netlify.app (domaine posé, partage OK) |
| Textes de Léandre | ⏳ « Ce que j’en retiens » (5 projets), Visualcom MCP (après mise en ligne) |

## Planning

Voir le tableau de [`work-packages/README.md`](work-packages/README.md). Jalons :

| Date | Jalon |
|---|---|
| 24/10 | ✅ L1 → L5 fusionnés, `main` poussé (CI GitHub Actions) |
| 25/10 | ✅ L5c, L5b, L8 recette, L6 Lab Horizon, L7 préprod, L7s + red team (jury, domaine, poids) |
| 26/10 | ✅ **L9** : captures AR Micro-monde, pas de 3D au tactile, correctifs rapides red team · ✅ **L10** (avancé au 26/10) : déploiement conditionné aux contrôles, URL canoniques, accueil sans JS, MagicalLab différé, typographie |
| 26-27/10 | **L12** : textes sans tics d’IA (relecture `docs/content/relecture-textes.md`), logos officiels des technos, section domaines cliquable, retouche mobile · puis **gel du contenu** |
| **28/10** | **L11 — mise en production** : vérifications, test sur ton téléphone, verrouillage du déploiement Netlify |
| 29–30/10 | Marge · textes « Ce que j’en retiens » · remise au jury du lien `/jury` et, séparément, du mot de passe |

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
| 26/10 | **Décisions Léandre** : pas de buste 3D sur appareil tactile (accessibilité et UX d’abord : image `bust-designer.jpg`) ; `bust-designer.jpg` validé tel quel (exception DA) ; mot de passe jury changé après l’incident `/JURY/…` |
| 26/10 | Captures AR Micro-monde fournies (14 photos, surtout paysage) : 6 retenues et préparées (UI Safari rognée, WebP) ; écartées : celles où le panneau affiche « PLACEHOLDER » |
| 25/10 | **Red team de la préprod** : contournements du verrou jury (`//jury`, `/JURY/…` servaient pages et PDF) → Edge Function sur `/*` avec chemin normalisé, 39 tests E2E prod ; domaine de production posé (`https://vigourouxleandre.netlify.app`) dans canonical, partage (og:image absolues, `public/og/`), sitemap, robots ; buste 7,9 → 1,2 Mo ; **voile d’ouverture** (écran d’entrée DA) + 3D lancée après chargement. Pour changer de domaine : `grep -rli "vigourouxleandre.netlify.app" pages public` puis remplacer. |
| 26/10 | **L9 + L10 exécutés** : AR Micro-monde intégrée ; pas de 3D au tactile ; une URL par page (301) ; accueil lisible sans JS ; MagicalLab chargé à la demande ; typographie française ; Netlify ne publie que ce qui passe `audit:ci` + `gate` ; le mot de passe jury n’est plus écrit dans `dist/_headers`. |
| 26/10 | **Décisions Léandre** : logos officiels des technos (couleurs officielles) sur cartes, carrousel et domaines ; section « Ce que je sais faire » transformée en 5 raccourcis vers le catalogue filtré (Animation fusionnée dans Création 3D), bande vide supprimée ; **relecture de tous les textes générés ou corrigés par IA** (tirets longs, &, formules, majuscules), tableau avant/après validé par Léandre, garde-fou de test + règles d’écriture dans `AGENTS.md` ; « Ce que j’en retiens » de Micro-monde et Vill’âge Jeunes masqués jusqu’aux textes de Léandre ; fichiers des lots terminés supprimés |
| 26/10 | **L12 exécuté** : relecture des textes appliquée (zéro tiret long, « et », vouvoiement, anglicismes), logos officiels des technologies, section « Ce que je sais faire » = 5 plaques cliquables vers le catalogue filtré (`?domaine=`), bande vide supprimée, accueil mobile sans vide, garde-fous d’écriture + règles dans `AGENTS.md`. Mesuré en production : Lighthouse mobile de l’accueil 54 → 74 (médiane), MagicalLab 46 → 93, jury et URL canoniques 55/55, tests publics 26/26. |

## Questions ouvertes (bloquent un texte, pas un lot)

| # | Question | Impact |
|---|---|---|
| Q7 | « Ce que j’en retiens », projet par projet (semaine du 26/10) : valider ceux de Micro-monde et Vill’âge Jeunes (rédigés d’après tes fiches) ; fournir ceux de Lab Horizon, HyperLoop, Spring Boot, Borne (facultatifs : bloc masqué sans texte) | Pages projet — non bloquant pour la mise en prod |

Q1 à Q5 réglées le 22/10 ; Q6, Q8, Q9 le 25/10 ; Q10, Q11 le 26/10 (voir journal).

## Risques

| Risque | Parade |
|---|---|
| Lot en retard | Couper les points mineurs de L5b en premier ; 29–30/10 en tampon après la mise en prod |
| Faille publiée sur une dépendance | Audit bloquant (pre-commit + CI quotidienne) + Dependabot ; correction dans un commit `fix(deps)` |
| Exécutant qui invente du texte ou casse un test | Briefs mot pour mot, tests garde-fous (C10–C13, jury), rapport obligatoire, recette indépendante L8 |
| Fuite des fiches | Repo privé, **Edge Function** d'authentification sur `/jury*` et `/pages/jury*` (L7s), build qui échoue sans mot de passe, test E2E 401 sur la prod, test « texte jury hors bundle » |
| Captures impossibles (Docker, MySQL, téléphone) | Images de repli prévues dans les briefs |
| Perf mobile faible (accueil, MagicalLab : 46/100) | L9 (voile allégé au tactile) ; décision « pas de 3D d’accueil au tactile » ; MagicalLab GLB au défilement (tampon 29/10) |
