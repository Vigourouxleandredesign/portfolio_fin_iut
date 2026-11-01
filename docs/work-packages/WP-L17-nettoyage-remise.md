# L17 : derniers textes, nettoyage du dépôt pour l'évaluateur technique, mise en ligne

**Exécutant :** Claude Code **Sonnet** · **Durée :** 1 h 30 · **Dépend de :** L15, L16 fusionnés · **Branche :** `wp/L17-nettoyage`
**Contexte :** remise au jury le 01/11. L'évaluateur technique lira le dépôt en détail : il doit être propre, cohérent et sans document de travail interne. Ce lot est le dernier : il supprime lui-même `docs/work-packages/` à la fin.

## Partie 0

Sur `main` : `git add docs/ README.md public/jury/fiches/lab-horizon/mission-reflection.pdf && git commit -m "docs: lot L17, fiche de réflexion Lab Horizon exportée depuis Word"` (ce WP, le nouveau README et le PDF de la fiche réexporté par Léandre, toujours 4 pages). Puis la branche.

## Partie A : derniers textes (validés par Léandre le 01/11)

### A1. Micro-monde (`pages/projects/micromonde.html`, ligne de carte dans `pages/index.html` et `pages/projects.html`)

L15 a appliqué l'ancienne version des textes, écrite à la première personne à la place de Léandre. Remplacer mot pour mot :

| Emplacement | Avant (en ligne) | Après |
|---|---|---|
| Ma part | …les trois modèles 3D animés, leur pose sur les fresques dans 8th Wall, l’interface et l’identité visuelle. | Projet à trois. Ma part : les trois modèles 3D animés, leur intégration dans 8th Wall, l’interface et l’identité visuelle. |
| Chapitre I, titre | Trois animaux, modélisés pour le plein air | Trois modèles 3D animés |
| Chapitre I, texte | J’ai modélisé et animé la tortue verte… face au mur. | Modélisation et animation dans Blender de la tortue verte, du loriquet à tête bleue et de l’hibiscus. Les modèles sont en low-poly pour rester fluides sur un téléphone. |
| Chapitre II, titre | L’animal sort du mur | Les modèles dans 8th Wall |
| Chapitre II, texte | Dans 8th Wall, j’ai calé chaque modèle sur sa fresque… sort du cadre. | Chaque modèle est placé sur sa fresque dans 8th Wall. Une fois l’image reconnue, l’animal apparaît devant le mur et reste en place quand on se déplace. |
| Chapitre III, titre | Une interface qui laisse voir l’œuvre | L’interface |
| Chapitre III, texte | …avec un bouton audio. L’interface reste discrète pour ne pas masquer le mur. | Supprimer la dernière phrase : « …avec un bouton audio. » |
| Chapitre IV, titre | Une identité bois et nature | L’identité visuelle |
| Chapitre IV, texte | Vert olive, taupe… accordée aux fresques de Kuby Kolor. J’ai aussi rédigé les contenus de l’hibiscus. | Vert olive, taupe, bois et sable, titres en Fleur De Leah et textes en Quicksand. Rédaction des contenus de l’hibiscus. |
| Ligne de la carte (accueil, catalogue, carrousel) | texte actuel | Fresques du campus en réalité augmentée : modèles 3D et interface. |

Le reste de la page (L’essentiel, équipe sans nom, état du projet, crédits) ne change pas.

### A2. Pacific Dataviz, résultat réel

- Catalogue (`pages/projects.html`) et accueil s'il y figure : « Finaliste 2025 » → « 2e de la catégorie Pacifique, 2025 ».
- CV (`pages/cv.html`), rubrique Reconnaissance : « Finaliste du Pacific Dataviz Challenge 2025 » → « Pacific Dataviz Challenge 2025 : 2e de la catégorie Pacifique et 6e de la catégorie Open (internationale), en dataviz interactive ». Ne pas toucher `public/documents/cv.pdf`.

### A3. Espace jury, une phrase Lab Horizon à la fin de chaque argumentaire

| Page | Phrase ajoutée à la fin de l'argumentaire |
|---|---|
| I `developpement-front.html` | Sur Lab Horizon, j’ai conçu l’architecture du front pour qu’elle absorbe les changements du projet sans réécrire les pages. |
| II `qualite-securite-performance.html` | Sur Lab Horizon, j’ai cherché à appliquer la défense en profondeur et à mettre en place des revues de sécurité, que j’ai améliorées, pour livrer le code le plus sain possible avant la mise en production. |
| III `client-gestion-projet.html` | Sur Lab Horizon, j’ai rédigé la documentation de passation pour permettre à une équipe complètement étrangère au projet de le reprendre le plus facilement possible. |
| IV `strategie-analyse.html` | Sur Lab Horizon, j’analyse comment ma façon de vérifier le code a évolué, et ce qui reste à améliorer. |

### A4. Accès au jury visible sur mobile (bloquant, constaté par Léandre sur téléphone)

Sur téléphone, depuis une page projet, on ne trouve ni l'espace jury ni les fiches réflexives : le lien n'existe que dans le pied de page et sur le CV.

1. **Navigation principale** (en-tête de toutes les pages publiques, menu mobile compris) : ajouter une entrée « Espace jury » → `/jury`, en dernier, avec une icône de cadenas décorative (`aria-hidden="true"`) et le texte accessible « Espace jury (accès protégé par mot de passe) ». Sur mobile, elle doit être visible dans le menu ouvert sans défilement horizontal, cible ≥ 44 px.
2. **Pages projet qui ont une fiche** (Visualcom, Vill'âge Jeunes, Lab Horizon) : une carte d'action dans « Aller plus loin » (la créer sur Lab Horizon, où la section n'existe pas encore) : titre « Lire mes fiches réflexives », ligne « Dans l'espace jury, protégé par mot de passe », lien vers `/jury`. Jamais de lien direct vers un PDF.
3. Tests : E2E en 390 px, depuis `/projects/lab-horizon` et `/projects/village-jeunes`, on atteint un lien vers `/jury` visible (menu ouvert ou carte) ; la feature « aucun lien public vers un PDF du jury » reste verte.

Commit `content(L17-A): …`, tests mis à jour si un test fige ces textes.

## Partie B : nettoyage du dépôt

Avant chaque suppression : `git grep -n "<nom du fichier>"` dans `tests/`, `scripts/`, `src/`, `pages/`, `vite.config.ts`, `netlify.toml`. Un fichier référencé par un test ou le build n'est **pas** supprimé : le signaler dans le rapport.

1. **Rapports de red team hors du dépôt** (cohérence avec la fiche de réflexion Lab Horizon : un document qui liste des failles, même corrigées, n'a pas sa place dans le dépôt). Copier `docs/REDTEAM-2026-10-25.md` et `docs/REDTEAM-2026-11-01.md` dans `../Rapports hors dépôt/` (dossier voisin du dépôt, à créer), puis `git rm` les deux. Relire `docs/RECETTE.md` : s'il décrit une faille de sécurité (contournement, fuite), le traiter de la même façon ; sinon le garder.
2. **Documents de travail internes** : `git rm -r docs/content/` (les pages HTML sont désormais la source des textes) sauf si un test le lit (voir ci-dessus).
3. **`.gitkeep` inutiles** : supprimer ceux des dossiers qui contiennent d'autres fichiers suivis (`public/documents/.gitkeep`, `src/assets/.gitkeep`, et `src/scripts/features/three-scene/.gitkeep`, `src/scripts/modules/.gitkeep` si leur dossier contient d'autres fichiers ; un dossier vide qui ne sert à rien est supprimé avec son `.gitkeep`).
4. **Fichiers non utilisés** : `src/assets/clients/logo-hyper-u.gif` et tout fichier de `src/assets/` ou `public/` qu'aucune page, aucun CSS, aucun TS et aucun test ne référence. Lister dans le rapport ce qui a été supprimé.
5. **Références périmées** à corriger (pas de suppression de contenu utile) :
   - `CLAUDE.md` : remplacer « no private media (reflective sheets) in this repo or its bundle » par la règle réelle : les fiches PDF vivent seulement dans `public/jury/fiches/`, servies uniquement après authentification par l'Edge Function, jamais importées dans le bundle ; dépôt privé.
   - `AGENTS.md` : retirer « Current focus: delivery 30 Oct 2026 — work is split into lots… » et toute mention de `docs/work-packages/` ou de `docs/content/relecture-textes.md` (garder les « Règles d'écriture » elles-mêmes, sans le lien).
   - `docs/ROADMAP.md` : en tête, « **Statut :** remis au jury le 01/11/2026 » ; supprimer les liens vers `docs/work-packages/` et vers les rapports déplacés (les remplacer par « rapports conservés hors du dépôt »). Le journal des décisions reste.
   - `docs/SECURITY.md` : ajouter une ligne « Les rapports de red team (25/10 et 01/11) sont conservés hors du dépôt : un document qui liste des failles, même corrigées, n'a pas sa place dans le dépôt. »
   - `git grep -n "work-packages\|REDTEAM\|relecture-textes\|docs/content"` ne doit plus rien renvoyer hors historique.
6. **Code** : `git grep -nE "console\.(log|debug)|debugger|TODO|FIXME|XXX" src/ pages/ netlify/ scripts/` ; supprimer les traces de débogage, et pour chaque TODO restant soit le traiter s'il est trivial, soit le lister dans le rapport.
7. **Dépendances** : `npm audit` ; si des vulnérabilités modérées de dev ont un correctif sans changement majeur, `npm audit fix` (jamais `--force`) dans un commit `fix(deps): …` ; sinon les décrire en une ligne dans `docs/SECURITY.md`.
8. **README** : le nouveau `README.md` est déjà en place (partie 0). Vérifier que chaque commande citée existe dans `package.json` et que chaque lien pointe vers un fichier existant ; corriger le README s'il le faut.
9. **Dépôt rendu public** (décision de Léandre, avec l'accord de l'évaluateur) : mettre à jour tout ce qui affirme le contraire. `README.md` (retirer « Le dépôt doit rester privé » s'il reste une telle mention), `CLAUDE.md` (règle des fiches : « dépôt public : les fiches PDF sont lisibles sur GitHub, la protection du jury porte sur le site »), `docs/SECURITY.md` (la section qui exige un dépôt privé : noter la décision du 01/11 et sa conséquence). Vérifier une dernière fois qu'aucun secret n'est suivi : `npm run check:secrets` et `git log -p | grep -iE "JURY_BASIC_AUTH=|password|token" | head` (rien d'autre que des noms de variables).
10. **Dernier commit de la partie B** : `git rm -r docs/work-packages/` (ce WP compris), message `chore(L17-B): clean repository for review`.

## Partie C : mise en ligne et contre-vérification

1. `npm run ci` vert ; fusion sur `main` ; `git push origin main`.
2. **Branches** : supprimer les branches locales `wp/*` fusionnées (`git branch --merged main | grep wp/ | xargs git branch -d`). Côté GitHub, `git ls-remote --heads origin` : supprimer les `wp/*` distantes déjà fusionnées (`git push origin --delete <branche>`). Ne jamais supprimer `main`.
3. Attendre le déploiement Netlify (2 à 3 min), puis `PLAYWRIGHT_BASE_URL=https://vigourouxleandre.netlify.app npm run test:e2e:prod` : tout vert, 401 du jury compris.
4. `git status` vide, `git log origin/main -1` = `git log main -1`.

## Rapport

Format du README des lots (que tu viens de supprimer : le recopier depuis l'historique si besoin), avec en plus : liste des fichiers supprimés ou déplacés, branches supprimées, sortie de `npm audit`, résultat de l'E2E de production.

## Prompt à coller

```
Tu es exécutant du lot L17 (derniers textes, nettoyage du dépôt, mise en ligne) du portfolio de Léandre. C'est le jour de la remise : précision avant vitesse. Lis AGENTS.md, le protocole commun de docs/work-packages/README.md, puis docs/work-packages/WP-L17-nettoyage-remise.md, et traite les parties 0, A, B et C dans l'ordre. Les textes de la partie A sont recopiés mot pour mot. Avant toute suppression, vérifie qu'aucun test ni le build ne référence le fichier. Ne réécris pas l'historique Git, n'utilise jamais --force, --no-verify ni d'identifiants jury. Ne lis et n'affiche jamais de fichier .env ni de mot de passe. Termine par le rapport demandé.
```
