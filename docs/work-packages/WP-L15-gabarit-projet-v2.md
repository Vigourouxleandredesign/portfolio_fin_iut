# L15 : gabarit de page projet v2 (hiérarchie, fil rouge)

**Statut : gabarit validé par Léandre le 26/10** (canvas « Gabarit page projet v2 », artboards **Page projet v2** et **Composants**). **Textes prêts le 30/10** pour Lab Horizon et Micro-monde.
**Exécutant :** Claude Code **Sonnet** · **Durée :** ½ journée pour les 4 pages prioritaires · **Dépend de :** L16 fusionné (il commite les documents de ce lot) · **Branche :** `wp/L15-gabarit-v2`

## Constat (Léandre, 26/10)

Sur les pages riches en texte (Visualcom, Vill'âge Jeunes, Lab Horizon), la disposition en bento met tout au même niveau : le lecteur ne distingue ni le début de l'histoire, ni l'essentiel, ni ce qui se lit de ce qui se clique. Il faut le guider.

## Le gabarit v2 (ordre fixe, une seule colonne de lecture)

1. **Hero** : fil d'Ariane, cartel une ligne (L14), titre, **une** phrase d'accroche, un bouton principal (s'il existe une démo ou un site) et un lien « Lire l'histoire » ; visuel principal à droite.
2. **L'essentiel** : bandeau de 3 faits chiffrés ou concrets maximum (gros chiffre cuivre clair + une ligne). Pas de fait inventé : chaque fait vient du brief ou de la fiche.
3. **L'histoire du projet** : chapitres numérotés I à IV le long d'un **fil vertical cuivre** ; chaque chapitre = étiquette (Le besoin, Mes choix, Le défi, Le résultat), titre, 2 à 4 lignes, un visuel ou une citation de la fiche. Le chapitre le plus fort (le défi) est mis en avant : pastille pleine, titre plus grand.
4. **Outils** : rangée de logos (L12), en fin de récit.
5. **Aller plus loin** : cartes d'action uniquement (version longue, site en ligne, démo). Seul endroit où l'on trouve des cartes d'action. Section absente s'il n'y a rien à proposer.
6. **Navigation** entre projets (L14).

Règles : un seul bouton principal par écran ; ce qui se clique porte une flèche gouache, ce qui se regarde n'en porte pas ; plus de grilles bento ni de cartes « En bref » à trois colonnes ; largeur de lecture ≤ 60 caractères. Les visuels et captures existants sont réutilisés, aucun nouveau visuel n'est créé.

## Ordre d'application (un commit par page)

**Prioritaires (à faire en entier avant la mise en production) :**
1. **Visualcom** : textes de `docs/content/projects/visualcom-v2.md` (maquette validée).
2. **Vill'âge Jeunes** : textes déjà en ligne, redistribués dans les sections. Faits de « L'essentiel » : uniquement ceux de la page actuelle (500 inscriptions en un mois, par exemple). Tout nouveau titre de chapitre est listé dans le rapport.
3. **Lab Horizon** : textes de `docs/content/projects/lab-horizon-v2.md`, ligne par ligne (✅ = appliquer tel quel, ❌ = garder l'existant, ✏️ = texte de Léandre ou bloc masqué).
4. **Micro-monde** : textes de `docs/content/projects/micromonde-v2.md` (§2), avec les décisions de la §4 (confirmées le 30/10). La mention « Nuit de la Science » disparaît de la page, de sa meta et du commentaire d'en-tête.

**Si le temps le permet (sinon, s'arrêter et le signaler dans le rapport) :**
5. Pages secondaires (MagicalLab, HyperLoop, Spring Boot, Borne) : même ordre de sections, sans « L'essentiel » si aucun fait chiffré n'existe. **Ne pas toucher `pacific-dataviz.html`** (L16).

## Tests

Feature : chaque page traitée a dans l'ordre hero, (essentiel), récit avec chapitres, outils, navigation ; aucune page traitée ne contient de bloc « En bref » ; Lab Horizon et Micro-monde ne contiennent ni « Nuit de la Science » ni nom de coéquipier. Mettre à jour dans le même commit les tests qui figent l'ancienne structure.

## Fin de lot

`npm run ci` vert ; captures 1440 et 390 px des pages traitées ; fusion sur `main` ; `git push origin main` autorisé.

## Prompt à coller

```
Tu es exécutant du lot L15 (gabarit de page projet v2) du portfolio de Léandre. Applique le protocole commun de docs/work-packages/README.md. Lis la skill portfolio-da, docs/work-packages/WP-L15-gabarit-projet-v2.md, docs/content/projects/lab-horizon-v2.md et docs/content/projects/micromonde-v2.md, docs/content/projects/visualcom-v2.md, puis le canvas de référence si Léandre te le donne (artboards « Page projet v2 » et « Composants »). Applique le gabarit dans l'ordre de la section « Ordre d'application », un commit par page, en commençant par les quatre pages prioritaires. N'invente aucun fait ni aucun texte, respecte les « Règles d'écriture » de AGENTS.md, et liste dans ton rapport chaque nouveau titre ou fait pour validation. Ne touche pas pacific-dataviz.html ni les pages jury (déjà traités par L16). Termine par le rapport au format du README.
```
