# L15 : gabarit de page projet v2 (hiérarchie, fil rouge)

**Statut : en attente de validation de Léandre** sur le canvas « Gabarit page projet v2 » (artboards **Page projet v2** et **Composants**). Ne pas lancer avant son accord.
**Exécutant :** Claude Code **Sonnet** · **Durée :** 1 journée · **Dépend de :** L14 · **Branche :** `wp/L15-gabarit-v2`

## Constat (Léandre, 26/10)

Sur les pages riches en texte (Visualcom, Vill'âge Jeunes, Lab Horizon), la disposition en bento met tout au même niveau : le lecteur ne distingue ni le début de l'histoire, ni l'essentiel, ni ce qui se lit de ce qui se clique. Il faut le guider.

## Le gabarit v2 (ordre fixe, une seule colonne de lecture)

1. **Hero** : fil d'Ariane, cartel une ligne (L14), titre, **une** phrase d'accroche, un bouton principal et un lien « Lire l'histoire » ; visuel principal à droite.
2. **L'essentiel** : bandeau de 3 faits chiffrés ou concrets maximum (gros chiffre cuivre clair + une ligne). Pas de fait inventé : chaque fait vient du brief ou de la fiche.
3. **L'histoire du projet** : chapitres numérotés I à IV le long d'un **fil vertical cuivre** (le fil rouge, littéralement) ; chaque chapitre = étiquette (Le besoin, Mes choix, Le défi, Le résultat), titre, 2 à 4 lignes, un visuel ou une citation de la fiche. Le chapitre le plus fort (le défi) est mis en avant : pastille pleine, titre plus grand.
4. **Outils** : rangée de logos (L12), en fin de récit.
5. **Aller plus loin** : cartes d'action uniquement (version longue, site en ligne, démo). C'est le seul endroit où l'on trouve des cartes d'action.
6. **Navigation** entre projets (L14).

Règles : un seul bouton principal par écran ; ce qui se clique porte une flèche gouache, ce qui se regarde n'en porte pas ; plus de grilles bento ni de cartes « En bref » à trois colonnes ; largeur de lecture ≤ 60 caractères.

## Ordre d'application

1. Visualcom (modèle de l'artboard), puis Vill'âge Jeunes. Textes : ceux déjà en ligne, redistribués dans les sections ; tout nouveau texte (titres de chapitre, faits de « L'essentiel ») est listé dans le rapport pour validation de Léandre.
2. Lab Horizon : **après** sa fiche réflexive et la réécriture de la page (27/10).
3. Micro-monde : avec les textes de `docs/content/projects/micromonde-v2.md`, une fois les questions de la section 3 tranchées.
4. Pages secondaires (MagicalLab, HyperLoop, Spring Boot, Pacific Dataviz, Borne) : même ordre de sections, sans « L'essentiel » si aucun fait chiffré n'existe.

## Prompt à coller (seulement après validation)

```
Tu es exécutant du lot L15 (gabarit de page projet v2) du portfolio de Léandre. Applique le protocole commun de docs/work-packages/README.md. Lis la skill portfolio-da, docs/work-packages/WP-L15-gabarit-projet-v2.md, puis ouvre le canvas de référence que Léandre te donne (artboards « Page projet v2 » et « Composants »). Applique le gabarit dans l'ordre de la section « Ordre d'application », un commit par page. N'invente aucun fait ni aucun texte, et respecte les « Règles d'écriture » de AGENTS.md (pas de tiret long, « et » au lieu de « & », pas d'antithèse ni de slogan du type « X sans Y » ou « X, pas Y », pas d'adjectif emphatique, pas de « je » inventé ; titres de chapitre factuels et concrets ; writing-guards vert) : liste dans ton rapport chaque nouveau titre ou fait pour validation. Termine par le rapport au format du README.
```
