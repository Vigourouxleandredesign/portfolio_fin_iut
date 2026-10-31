# L16 : fiches Lab Horizon dans l'espace jury, dernières mentions à corriger

**Exécutant :** Claude Code **Sonnet** · **Durée :** 2 h · **Dépend de :** L14 fusionné · **À lancer avant L15** (un seul dossier de travail : les lots passent l’un après l’autre) · **Branche :** `wp/L16-jury-lab-horizon`

## Partie 0 : documents et PDF

Sur `main`, avant la branche : `git add docs/ public/jury/fiches/lab-horizon/ && git commit -m "docs+jury: lots L15 à L16, fiches Lab Horizon (PDF)"`.

Les deux PDF sont déjà dans `public/jury/fiches/lab-horizon/` : `project-sheet.pdf` (3 pages, page d'introduction jusqu'à « Solution ») et `mission-reflection.pdf` (4 pages). Ne pas les régénérer.

## Partie A : Lab Horizon dans l'espace jury

Fichiers : `pages/jury/index.html`, `pages/jury/developpement-front.html`, `pages/jury/qualite-securite-performance.html`, `pages/jury/client-gestion-projet.html`, `pages/jury/strategie-analyse.html`, `docs/content/jury-content.md` (même ajout, pour garder la source à jour).

1. **Matrice** de `/jury` : nouvelle colonne **Lab Horizon**, ● (lien vers l'ancre `#lab-horizon`) sur les quatre compétences.
2. **Liens PDF** (même format que Visualcom) : « Fiche projet Lab Horizon (PDF, 3 pages) » → `/jury/fiches/lab-horizon/project-sheet.pdf` ; « Fiche de réflexion Lab Horizon (PDF, 4 pages) » → `/jury/fiches/lab-horizon/mission-reflection.pdf`.
3. **Compétences du référentiel couvertes** : ajouter « Maîtriser le génie logiciel » à la page I ; remplacer en page III la ligne « Utiliser les outils numériques de référence pour collaborer en interne et en externe » par l'intitulé complet : « Utiliser les outils numériques de référence et les règles de sécurité informatique pour acquérir, traiter, produire et diffuser de l'information ainsi que pour collaborer en interne et en externe ».
4. **Un `<article id="lab-horizon">` par page compétence**, placé en premier (projet le plus récent), titre « Lab Horizon (SAE 501, plateforme de valorisation de la recherche, 2026) », puis Preuves, Citation, Liens (fiche de réflexion PDF, fiche projet PDF, « Voir le projet sur le portfolio » → `/projects/lab-horizon`). Les citations sont mot pour mot dans la fiche : ne pas les reformuler.

| Page | Preuves | Citation (*Fiche de réflexion Lab Horizon*) |
|---|---|---|
| I Développement front | couche d'adaptateurs entre les pages et les données (données fictives, puis HAL, puis API REST) ; monorepo orchestré par Docker, choisi pour une petite équipe ; lefthook pour un dépôt à deux langages ; pipeline CI/CD et branche main protégée ; chaque fonctionnalité ou correction arrive avec au moins un test | « Sur ce projet, chaque choix d’architecture répond à une contrainte précise. » |
| II Qualité, sécurité et performance | défense en profondeur sur les secrets (commit, historique Git en CI, protection de GitHub) ; protocole de revue de sécurité avant la mise en production, avec charte signée et preuve obligatoire ; deux verdicts NO-GO, corrections, puis contrôles repris dans la pipeline ; rapports de revue volontairement non versionnés | « Pour les secrets, j’applique le principe de défense en profondeur. » |
| III Échange client et gestion de projet | dossier de passation en six documents pour une équipe qui n'a jamais vu le projet ; règle « quel document fait foi » ; cadrage UX et parcours utilisateur comme référence commune entre le front et le back ; règles communes versionnées pour les agents IA de l'équipe | « J’ai donc indiqué, pour chaque sujet, quel document fait foi : c’est la base solide sur laquelle se positionner en cas de doute. » |
| IV Stratégie, analyse et réflexion | constat de la fiche Vill'âge Jeunes repris et mis en pratique ; passage des tests à la main à des tests confiés à des machines ; portfolio utilisé comme bac à sable ; limites reconnues (tests de parcours non installés, contre-vérification non indépendante) | « Ce que j’ai mis en place reste une première réponse. » |

5. Tests : la feature des pages jury vérifie que chaque page compétence contient `#lab-horizon` et que les deux PDF Lab Horizon existent ; le test des liens PDF (s'il existe) inclut les nouveaux fichiers.

## Partie B : mentions à corriger hors pages projet

Fichiers : `pages/index.html`, `pages/projects.html`, `pages/projects/pacific-dataviz.html` (et le test qui fige ces textes, le cas échéant). **Ne pas toucher** aux autres pages projet : L15 s'en charge.

1. **Nuit de la Science** (confirmé par Léandre le 30/10 : le projet n'y a pas été présenté) : sur l'accueil et le catalogue, la ligne de la carte Micro-monde `N° III · 2026 · Nuit de la Science` devient le cartel une ligne de L14 (`N° III` puis `Projet d’équipe à l’Université de la Nouvelle-Calédonie, en 2026`). Vérifier qu'aucune carte du catalogue ou de l'accueil n'a gardé l'ancien format `N° … · … · …` ; corriger celles qui l'ont.
2. **Médaille Pacific Dataviz** (confirmé par Léandre le 30/10 : le « 2 » est une 2e place). Garder l'image de la médaille, avec `alt="Médaille de 2e place"`. Cartel une ligne : `N° VIII` puis `Pacific Dataviz Challenge, 2e de la catégorie Pacifique, en 2025`. Dans le texte de présentation (et la meta description), remplacer la seule mention « finaliste » par : « Finaliste du Pacific Dataviz Challenge 2025 : 2e de la catégorie Pacifique et 6e de la catégorie Open (internationale), en dataviz interactive. » Même cartel sur la carte du catalogue et de l'accueil si elle y figure.
3. `grep -rn "Nuit de la Science" pages/ src/` ne doit plus rien renvoyer hors `pages/projects/micromonde.html` (traitée par L15).

## Fin de lot

`npm run ci` vert ; captures 1440 et 390 px de `/jury` et d'une page compétence, en local (`npm run dev` : la protection du jury ne s'applique que sur Netlify) ; fusion sur `main` ; `git push origin main` autorisé.

## Prompt à coller

```
Tu es exécutant du lot L16 (fiches Lab Horizon dans l'espace jury, dernières mentions) du portfolio de Léandre. Applique le protocole commun de docs/work-packages/README.md. Lis la skill portfolio-da, docs/content/jury-content.md puis docs/work-packages/WP-L16-jury-lab-horizon.md et traite les parties 0, A et B dans l'ordre, un commit par partie. Les citations sont recopiées mot pour mot depuis le WP. Ne modifie aucune page projet hors pacific-dataviz.html (L15 s’en charge ensuite). Respecte les « Règles d'écriture » de AGENTS.md. Ne lis et n'affiche jamais de fichier .env ni de mot de passe. Termine par le rapport au format du README (ligne AUDIT comprise).
```
