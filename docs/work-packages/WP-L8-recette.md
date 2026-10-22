# L8 — Recette finale

**Responsable :** Claude (chef de projet) — contrôle indépendant des exécutants · **Durée :** ½ journée · **Dépend de :** L7

## Grille de recette

| Domaine | Contrôle | Outil |
|---|---|---|
| Contenu | Chaque page = son brief (textes, crédits, années, pas de `[À CONFIRMER]` affiché) | lecture croisée briefs ↔ HTML |
| DA | Checklist `docs/DA.md` §9 sur les 15 pages (1440 et 390 px) | captures Playwright |
| Cohérence | Pigments par projet, cartels numérotés I → IX, même gabarit partout | captures |
| Accessibilité | axe (0 critique/sérieux), clavier (focus visible, ordre), contrastes, `alt`, reduced-motion | E2E + test manuel |
| Performance | Lighthouse mobile ≥ 85 perf, ≥ 95 a11y / bonnes pratiques / SEO sur accueil, une page projet, jury | Lighthouse |
| Sécurité | En-têtes, 401 jury (3 chemins), aucun secret dans le bundle, aucun texte jury dans `assets/*.js`, CSP sans violation console | curl + console |
| Liens | Aucun lien cassé (internes, démos, PDF) | crawler Playwright |
| Jury | Parcours matrice → compétence → PDF → projet → retour en ≤ 2 clics ; impression lisible | test manuel |

## Livrable

Rapport de recette (artefact) : anomalies classées bloquant / majeur / mineur, chacune avec lot responsable et correctif proposé ; correctifs passés à un exécutant le 29/10 ; re-test des bloquants avant la mise en production du 30/10.
