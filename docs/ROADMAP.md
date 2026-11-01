# Roadmap — portfolio de fin d’année

**Statut :** remis au jury le 01/11/2026 · **Mise en production :** 31/10-01/11/2026 · **Chef de projet :** Claude · **PO :** Léandre
**Exécution :** le projet a été découpé en lots confiés à des assistants IA, chacun validé par la chaîne de contrôle (hook pre-commit et GitHub Actions). Les lots et les rapports de red team (25/10 et 01/11) sont conservés hors du dépôt.

---

## Où on en est

| Chantier | État |
|---|---|
| Stack, CI/CD, sécurité | ✅ CI complète (audit bloquant, tests, E2E) + Dependabot + run quotidien · jury protégé par **Edge Function** (401 vérifié en prod, contournements testés le 26/10 et le 01/11) |
| DA v3, fiches réflexives | ✅ · fiche Lab Horizon rédigée (28-30/10), PDF dans `public/jury/fiches/lab-horizon/` |
| Intégration L1 → L18 | ✅ fusionné et en production (L16 jury Lab Horizon, L15 gabarit v2 sur les 4 pages prioritaires, L17 textes finaux et accès au jury sur mobile, L18 espace jury par fiche réflexive) |
| Pages projet secondaires (MagicalLab, HyperLoop, Spring Boot, Borne) | Ancien gabarit conservé, migration v2 après la soutenance |
| Performance mobile de l’accueil | Lighthouse 63, alléger le buste 3D et la physique après la soutenance |
| Textes de Léandre | « Ce que j’en retiens » (blocs masqués sans texte, non bloquant) |

## Planning

| Date | Jalon |
|---|---|
| 24-26/10 | ✅ L1 → L14 (intégration, préprod, red team, captures AR, textes sans tics d’IA, logos, cartels une ligne, navigation gouache, pas de pinceau au tactile) |
| 27-30/10 | ✅ Fiche réflexive et fiche projet Lab Horizon (compétences : génie logiciel ; outils numériques et sécurité pour collaborer ; s’autoévaluer) |
| 01/11 | ✅ L16, L15, L17, L18 ; red team de la production ; remise au jury (lien `/jury` par e-mail, mot de passe par un autre canal) |

## Décisions (journal)

| Date | Décision |
|---|---|
| 06/10 | Supabase abandonné ; fiches réflexives protégées par mot de passe Netlify |
| 21/10 | DA v3 validée (nuit, lumière de feu, gouache cuivre / or / phtalo, étalonnage Odyssée, cartels « musée ») |
| 21/10 | **Un seul site Netlify** ; zone `/jury` protégée ; dépôts GitHub privés (sauf MagicalLab) |
| 22/10 | 4 projets vedettes en accueil : Lab Horizon, MagicalLab, Micro-monde, Vill’âge Jeunes ; espace jury en 4 compétences |
| 25/10 | **Incident sécurité** : Basic-Auth de `_headers` ignoré sur l’offre gratuite → Edge Function (erreur de conception du chef de projet) ; red team : contournements `//jury`, `/JURY/…` corrigés, 39 tests E2E prod |
| 26/10 | Pas de buste 3D au tactile ; logos officiels ; relecture de tous les textes générés par IA (règles d’écriture dans `AGENTS.md`, test garde-fou) ; pinceau désactivé sur vrai mobile ; cartels sur une ligne ; navigation et boutons à la gouache ; **gabarit de page projet v2 validé** (fil rouge, « L’essentiel », chapitres I-IV) |
| 28/10 | Fiche Lab Horizon : sujet = choix d’architecture et transmission, l’IA n’est qu’un contexte ; texte au « je » ; ton humble (solutions = première réponse) ; problématique : « En quoi les choix d’architecture et d’organisation d’un projet web en équipe conditionnent-ils sa fiabilité et sa transmission à une nouvelle équipe ? » |
| 28/10 | Rapports de revue de sécurité Lab Horizon : jamais publiés (diffusion limitée), seul le processus est cité (deux NO-GO, corrections, pipeline) ; aucun travail de coéquipier mis en porte-à-faux, coéquipiers cités par leur rôle |
| 30/10 | Remise décalée au dimanche 01/11 ; lots passés l’un après l’autre (un seul dossier de travail) ; Micro-monde : décisions par défaut (Nuit de la Science retirée, coéquipiers sans nom) ; médaille Pacific Dataviz retirée sauf confirmation d’une 2e place |
| 30/10 | Dossier de conception MicroMonde corrigé (tics d’IA, « MMI » → LP MIAW, brouillons, incohérences, mise en page violette) : fichier livré à Léandre, hors portfolio |
| 01/11 | Pacific Dataviz : 2e de la catégorie Pacifique et 6e de la catégorie Open, médaille rétablie ; Micro-monde : textes revalidés par Léandre (sans « je » écrit à sa place) ; « Espace jury » ajouté à la navigation principale (introuvable sur téléphone) |
| 01/11 | Espace jury réorganisé par fiche réflexive (L18) : le tableau croise les compétences mises en avant dans chaque fiche, un point ouvre le passage de la fiche, le nom d’un projet ouvre sa page ; les fiches se lisent en entier sur le site ; Quintessence retiré (pas de fiche) |
| 01/11 | Dépôt rendu public (décision de Léandre, avec l’accord de l’évaluateur) : la protection du jury porte sur le site ; rapports de red team et lots de travail conservés hors du dépôt |

## Questions ouvertes

| # | Question | État |
|---|---|---|
| Q12 | Micro-monde présenté à la Nuit de la Science 2026 ? | Mention retirée |
| Q13 | Nommer les coéquipiers de Micro-monde ? | Rôles seulement |
| Q14 | La médaille « 2 » de Pacific Dataviz = 2e place ? | ✅ Confirmé (01/11) |
| Q7 | « Ce que j’en retiens » des projets | Blocs masqués |

## Risques

| Risque | Parade |
|---|---|
| L15 trop long | Couper les pages secondaires ; jamais L16 ni L11 |
| Word réenregistre une ancienne version d’une fiche | Fermer le document avant toute modification par Claude |
| Faille publiée sur une dépendance | Audit bloquant + Dependabot ; `fix(deps)` |
| Exécutant qui invente du texte | Textes validés ligne par ligne, règles d’écriture, test garde-fou, rapport obligatoire |
| Fuite des fiches | Edge Function sur `/jury*`, test E2E 401 sur la prod, aucun lien public vers un PDF |
