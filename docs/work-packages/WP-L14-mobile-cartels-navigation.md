# L14 : mobile sans pinceau, cartels allégés, navigation gouache, texte Lab Horizon

**Exécutant :** Claude Code **Sonnet** · **Durée :** ½ journée · **Dépend de :** L12 fusionné (et L13 : s'il n'est pas fait, le faire en partie 0) · **Branche :** `wp/L14-mobile-cartels-nav`
Demandes de Léandre du 26/10 au soir. Référence visuelle validée par le chef de projet : canvas « Gabarit page projet v2 », artboard **Composants** (cartel, boutons, navigation).

## Partie 0 : documents et L13

Sur `main`, avant la branche : `git add docs/ src/assets/decor/paint/arrows/ src/assets/projects/lab-horizon/lab-horizon-arbre*.webp && git commit -m "docs+assets: lots L13 à L15, flèches gouache, visuel arbre"`.

Si `git log --oneline | grep L13` ne renvoie rien : exécuter `docs/work-packages/WP-L13-retouches.md` d'abord (visuel arbre, 5 coquilles), commit séparé.

## Partie A : pinceau désactivé sur mobile (bloquant)

Sur un vrai téléphone, le pinceau de l'accueil (`src/scripts/features/home-brush/home-brush.ts`) intercepte les gestes : `pointermove` est écouté sur `window` avec `passive: false`, ce qui bloque ou saccade le défilement au doigt (l'émulation des DevTools ne le montre pas).

1. `initHomeBrush` ne s'initialise **que** si `matchMedia('(hover: hover) and (pointer: fine)').matches` (même règle que la 3D, `bust-capability.ts`) ; sinon aucun canvas créé, aucun écouteur posé.
2. Défense en profondeur : dans les gestionnaires, ignorer tout événement dont `pointerType !== 'mouse'` (stylet et doigt n'ont jamais de pinceau) ; ne jamais appeler `preventDefault` pour un `pointerType` autre que `mouse`.
3. Le canvas du pinceau, s'il existe, garde `pointer-events: none` et `touch-action: auto`.
4. Traits de peinture **décoratifs** (images `.paint` dans les sections) : vérifier qu'aucun ne recouvre une zone interactive sur mobile (`pointer-events: none` sur toutes les images `.paint`, et masquer sous 48 rem celles qui chevauchent du texte ou un bouton).
5. Tests : unitaire (aucun écouteur `pointermove` posé quand le pointeur est grossier, aucun `preventDefault` sur un événement `touch`) ; E2E mobile (`hasTouch: true`, 390 px) : un défilement au doigt (`page.touchscreen` ou `mouse.wheel` en mode tactile) fait bien bouger la page, et aucun canvas `[data-home-brush]` n'existe.

## Partie B : Lab Horizon, ce que j'ai fait (texte de Léandre, 26/10)

| Emplacement | Après |
|---|---|
| « Ce que j'ai fait » | Développement front, UI/UX (maquettes, parcours utilisateur), architecture et documentation, et mise en place d'une chaîne CI/CD : des hooks pre-commit et pre-merge sur la branche main (production) imposent des tests automatisés, reproductibles et impossibles à contourner, contrairement à des tests lancés par une IA. |
| Récit III, texte | Le projet est remis avec un dossier de passation (lancer, maintenir, faire évoluer). Chaque commit et chaque fusion sur main passent par des hooks pre-commit et pre-merge qui lancent les tests : types, secrets, couleurs, tests unitaires, build. Le résultat est le même à chaque exécution et ne peut pas être contourné, contrairement à des tests lancés par une IA. |

Le reste de la page sera réécrit après la fiche réflexive Lab Horizon (prévue le 27/10) : ne rien toucher d'autre.

## Partie C : cartels allégés (toutes les pages projet, catalogue, carrousel)

Constat de Léandre : l'enchaînement « N° V · 2026 · ALTERNANCE VISUALCOM / WordPress · thème sur mesure · PHP · GitHub · Claude / MCP » fait machine (six éléments, deux lignes, points de séparation, capitales très espacées).

1. **Une seule ligne, deux éléments** : le numéro (`N° V`, Ubuntu Mono, or `--color-pigment-gold`, interlettrage 0.04em) puis le contexte en phrase (Ubuntu 400, `--color-text-muted`, casse normale, interlettrage normal), séparés par un espace de 14 px, **sans point**. Contextes :

| N° | Contexte |
|---|---|
| I | SAE 501, projet d'équipe, IUT de Nouvelle-Calédonie, 2026 |
| II | Projet de cours, IUT, 2026 |
| III | Projet d'équipe, Université de la Nouvelle-Calédonie, 2026 |
| IV | Alternance chez Visualcom, client Vill'âge Jeunes, 2026 |
| V | Alternance chez Visualcom, 2026 |
| VI | Devoir Angular, LP MIAW, 2026 |
| VII | TP back-end, LP MIAW, 2026 |
| VIII | Pacific Dataviz Challenge, finaliste, 2025 |
| IX | Mission chez Visualcom, 2025 |

2. **La ligne des technologies disparaît du hero** des pages projet. Elle devient une rangée de logos (composants de L12) intitulée « Outils », placée en fin de récit, avant « Aller plus loin ».
3. Cartes du catalogue et du carrousel : le cartel suit la même règle (une ligne). Les pastilles de technos restent sous le texte, **3 au maximum** par carte.
4. Plus de liseré vertical à gauche du cartel (la DA réserve les filets aux vitrines).
5. Tests : feature « aucun cartel ne contient ` · ` ni plus de deux éléments » ; mise à jour des tests qui figent les anciens cartels.

## Partie D : navigation et boutons à la gouache

Fichiers prêts dans `src/assets/decor/paint/arrows/` : `arrow-{long,short}-{copper,phtalo}-{left,right}.webp` (générés à partir des traits `underline-*` du site).

1. **Navigation entre projets** (bas de chaque page projet) : deux cartes de même hauteur sur une grille 2 colonnes (une colonne sous 48 rem). À gauche « Précédent » + nom + flèche longue cuivre vers la gauche ; à droite « Suivant » + nom + flèche vers la droite, texte aligné à droite. Survol et focus : fond `--color-surface-elevated`, bordure cuivre, flèche qui avance de 6 px (coupé en `prefers-reduced-motion`). « Tous les projets » quitte ce bloc (il reste dans le fil d'Ariane).
2. **Bouton principal** (un seul par écran) : pilule cuivre, texte sombre, flèche longue à droite (la flèche cuivre assombrie par `filter: brightness(0.25)` ou une variante sombre). **Lien secondaire** : texte clair + flèche courte. **Carte d'action** (« Aller plus loin ») : contour cuivre, titre, une ligne d'explication, flèche longue ; elle se soulève au survol.
3. **Illustrations** : jamais de contour cuivre ni de flèche ; légende en Ubuntu Mono 13 px. Règle : ce qui se clique a une flèche gouache, ce qui se regarde n'en a pas.
4. Les flèches sont décoratives (`alt=""`), le nom accessible vient du texte du lien. Hauteur de cible ≥ 44 px.
5. Tests : chaque page projet a exactement 2 liens dans `nav[aria-label="Navigation entre projets"]`, chacun avec une flèche ; aucune image d'illustration n'est dans un lien sans texte.

## Fin de lot

`npm run ci` vert ; captures 390 et 1440 px de l'accueil (sur mobile : vérifier qu'aucun pinceau n'apparaît) et de deux pages projet ; `git push origin main` autorisé. Demander à Léandre de tester l'accueil **sur son téléphone** (défilement fluide, aucun trait de pinceau).

## Prompt à coller

```
Tu es exécutant du lot L14 (mobile sans pinceau, cartels allégés, navigation gouache, texte Lab Horizon) du portfolio de Léandre. Applique le protocole commun de docs/work-packages/README.md. Lis la skill portfolio-da puis docs/work-packages/WP-L14-mobile-cartels-navigation.md et traite les parties 0, A, B, C et D dans l'ordre, un commit par partie. Ne modifie aucun autre texte que ceux cités. Tout texte écrit ou touché respecte les « Règles d'écriture » de AGENTS.md (pas de tiret long, « et » au lieu de « & », pas d'antithèse ni de slogan, pas d'adjectif emphatique, vouvoiement, minuscules, pas de « je » inventé) et le test writing-guards doit rester vert. Ne lis et n'affiche jamais de fichier .env ni de mot de passe. Termine par le rapport au format du README (ligne AUDIT comprise).
```
