# Roadmap — portfolio de fin d’année

**Mise à jour :** 2026-10-30 · **Mise en production :** samedi **31/10/2026** · **Remise au jury :** dimanche **01/11** (date décalée) · **Chef de projet :** Claude · **PO :** Léandre
**Exécution :** lots détaillés dans [`docs/work-packages/`](work-packages/README.md) (planning, dépendances, prompts, critères d’acceptation).

---

## Où on en est

| Chantier | État |
|---|---|
| Stack, CI/CD, sécurité | ✅ CI complète (audit bloquant, tests, E2E) + Dependabot + run quotidien · jury protégé par **Edge Function** (401 vérifié en prod le 26/10, contournements testés) |
| DA v3, briefs, fiches réflexives | ✅ · fiche Lab Horizon rédigée (28-30/10), PDF dans `public/jury/fiches/lab-horizon/` |
| Intégration L1 → L14 | ✅ fusionné (L13, L14 le 26/10 au soir) |
| L16 jury Lab Horizon + mentions | ⏳ à lancer en premier (30/10) |
| L15 gabarit projet v2 | ⏳ après L16 : Visualcom, Vill’âge Jeunes, Lab Horizon, Micro-monde prioritaires ; pages secondaires si le temps le permet |
| L11 production | ⏳ samedi 31/10 |
| Textes de Léandre | ⏳ « Ce que j’en retiens » (blocs masqués sans texte, non bloquant) |

## Planning

| Date | Jalon |
|---|---|
| 24-26/10 | ✅ L1 → L14 (intégration, préprod, red team, captures AR, textes sans tics d’IA, logos, cartels une ligne, navigation gouache, pas de pinceau au tactile) |
| 27-30/10 | ✅ Fiche réflexive et fiche projet Lab Horizon (compétences : génie logiciel ; outils numériques et sécurité pour collaborer ; s’autoévaluer) |
| **30/10** | **L16** (2 h) puis **L15** (soirée et samedi matin) |
| **31/10** | **L11** : vérifications, test sur téléphone, relecture des pages v2, verrouillage du déploiement Netlify |
| **01/11** | Remise au jury : lien `/jury` par e-mail, mot de passe par un autre canal |

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

## Questions ouvertes (non bloquantes, une valeur par défaut existe)

| # | Question | Défaut si pas de réponse |
|---|---|---|
| Q12 | Micro-monde présenté à la Nuit de la Science 2026 ? | Mention retirée |
| Q13 | Nommer les coéquipiers de Micro-monde ? | Rôles seulement |
| Q14 | La médaille « 2 » de Pacific Dataviz = 2e place ? | Image retirée, « finaliste » conservé |
| Q7 | « Ce que j’en retiens » des projets | Blocs masqués |

## Risques

| Risque | Parade |
|---|---|
| L15 trop long | Couper les pages secondaires ; jamais L16 ni L11 |
| Word réenregistre une ancienne version d’une fiche | Fermer le document avant toute modification par Claude |
| Faille publiée sur une dépendance | Audit bloquant + Dependabot ; `fix(deps)` |
| Exécutant qui invente du texte | Textes ligne par ligne (`*-v2.md`), règles d’écriture, test garde-fou, rapport obligatoire |
| Fuite des fiches | Edge Function sur `/jury*`, test E2E 401 sur la prod, aucun lien public vers un PDF |
