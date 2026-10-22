# Espace jury (`/jury`) — spécification

**Statut :** spec validée 2026-10-21 (révisée : **même site Netlify** que le portfolio, zone protégée par mot de passe) · Sécurité : `docs/SECURITY.md` §0 et §7.

## Objectif

Les évaluateurs veulent lire **les fiches réflexives classées par compétence**, rien d’autre. Le site doit leur permettre de :

1. voir d’un coup d’œil quelles compétences sont couvertes et par quels projets (matrice) ;
2. ouvrir une compétence → lire l’argumentaire court + ouvrir les fiches PDF qui la prouvent ;
3. passer **d’une compétence à l’autre** et **d’une fiche au projet public** (et retour) sans chercher.

Seules les compétences réellement travaillées sont présentées (le référentiel UNC sert de référence, pas de checklist).

## Compétences retenues (source : `../Fiche réflexive/Brouillon_competences_Leandre.docx`)

| Slug | Bloc | Compétences UNC (LP MIAW) couvertes | Projets-preuves |
|------|------|--------------------------------------|-----------------|
| `developpement-front` | Développement front (conception & réalisation) | Analyse, conception, déploiement et maintenance d’applications · Conception d’interface · Paramétrage, prototypage et adaptation · Maîtriser la programmation · Concevoir, déployer, gérer et faire évoluer une application | Vill’âge Jeunes, Visualcom |
| `qualite-securite-performance` | Qualité, sécurité et performance | Assurer la qualité, la sûreté, la sécurité et la performance · Appliquer les normes et standards | Vill’âge Jeunes, Visualcom |
| `client-gestion-projet` | Échange client & gestion de projet | Assistance et conseil auprès des utilisateurs · Méthodes de gestion de projet · Travailler en équipe et en autonomie · Outils numériques et collaboration · Communication écrite et orale | Vill’âge Jeunes, Quintessence (WordPress) |
| `strategie-analyse` | Stratégie, analyse & réflexion | Analyser et synthétiser des données · Argumentation avec esprit critique · Référencement (SEO) · Rédaction de documentation technique | Vill’âge Jeunes, Visualcom |

À compléter par Léandre si d’autres fiches arrivent (MagicalLab, Lab Horizon…) : ajouter une ligne projet, jamais une compétence non prouvée.

## Fiches disponibles

| Projet | Fichier (dans `fiches/<slug>/`) | Source |
|--------|----------------------------------|--------|
| Visualcom | `mission-reflection.pdf`, `project-sheet.pdf` | `Fiche de reflexion mission Refonte Visualcom` (**⚠ paragraphe « Conception d’interface » copié de Vill’âge Jeunes — voir `reflective-sheets-inventory.md`**), `Fiche projet refonte site Visualcom` |
| Vill’âge Jeunes | `mission-reflection.pdf`, `project-sheet.pdf` | `Fiche de reflexion mission Village jeunes`, `Fiche projet Village Jeunes` |

## Arborescence (dans ce repo)

```
pages/jury/
  index.html                         # /jury — intro 3 lignes + matrice compétences × projets
  developpement-front.html           # /jury/developpement-front
  qualite-securite-performance.html
  client-gestion-projet.html
  strategie-analyse.html
public/jury/fiches/
  visualcom/{mission-reflection,project-sheet}.pdf
  village-jeunes/{mission-reflection,project-sheet}.pdf
src/scripts/entries/jury.ts          # styles + nav/footer communs, AUCUN texte jury
src/styles/pages/jury.css
```

- `vite.config.ts` : ajouter les entrées `pages/jury/*.html` (même principe que `projectDetailPageInputs`).
- `public/_redirects` : `/jury  /pages/jury/index.html  200` puis une ligne par compétence (`/jury/<slug>  /pages/jury/<slug>.html  200`). Pas de joker `/jury/*` (il masquerait les PDF).
- `public/robots.txt` : `Disallow: /jury` et `Disallow: /pages/jury`.
- **Tout le texte jury vit dans le HTML** (jamais dans un `.ts`/`.json` : les bundles `/assets/*.js` sont publics).
- Verrou : `scripts/inject-jury-auth.mjs` (déjà en place, testé) ajoute le Basic-Auth au build Netlify à partir de la variable `JURY_BASIC_AUTH`.

## Gabarits

### `index.html` — Matrice

- En-tête du site (nav commune) + bandeau « Espace jury — Léandre Vigouroux, LP MIAW 2026 », lien « ← Retour au portfolio ».
- Intro (3 lignes) : comment lire le site.
- **Matrice** (`<table>` accessible, `<th scope>`): lignes = compétences, colonnes = projets ; cellule = ● lien vers la section du projet dans la page compétence. Ligne cliquable → page compétence.
- 4 cartes compétence (titre, 1 phrase, nb de preuves) — même ordre que la matrice.

### `pages/jury/<slug>.html` — Compétence

- Fil d’Ariane : `Espace jury › Compétences › <Bloc>`.
- Titre du bloc + compétences UNC couvertes (liste, `Ubuntu Mono`, style cartel).
- **Argumentaire** (≤ 120 mots, repris du brouillon).
- Par projet-preuve, un **cartel** :
  - nom du projet, contexte (alternance / client / SAE), année ;
  - 2-4 preuves (puces reprises du brouillon) ;
  - boutons : « Lire la fiche réflexive (PDF) » (`target="_blank"`), « Fiche projet (PDF) », « Voir le projet sur le portfolio » (`/projects/<slug>`, même onglet). Les PDF : `/jury/fiches/<slug>/<fichier>.pdf`.
- Pied de page : **← compétence précédente · Retour à la matrice · compétence suivante →** (boucle).
- Ancre par projet (`#visualcom`, `#village-jeunes`) pour que la matrice pointe directement dessus.

## DA (version sobre du site public)

- Fond `--color-bg`, texte `--color-text`, filets `--color-border`, accent unique `--color-pigment-gold` (titres, liens au survol) ; pas de 3D, pas de pinceau, pas de décor peinture lourd (au plus un `underline-copper.webp` sous le titre, `bloom-trio.webp` en fond à ≤ 0,35).
- Typo : Ubuntu (titres/corps), Ubuntu Mono (cartels, compétences UNC). Pas d’Updock.
- Lisibilité d’abord : corps 18 px, mesure 68 ch, contraste AA, focus visible, `@media print` propre (le jury peut imprimer une page compétence).

## Sécurité & déploiement

- Même site Netlify que le portfolio, déployé depuis GitHub. **Le repo GitHub doit être privé** (les PDF sont commités dans `public/jury/`).
- Mot de passe : variable Netlify `JURY_BASIC_AUTH` = `jury:<mot de passe ≥ 16 caractères>` (*Site configuration › Environment variables*, portée *Builds*). Sans elle, le build Netlify échoue volontairement.
- Mot de passe envoyé au jury par e-mail, séparément du lien.
- Le portfolio public affiche **un seul** lien « Espace jury » (footer + page CV) vers `/jury`.
- Après le jury : retirer `public/jury/`, la variable et le lien (ou changer le mot de passe).

## Definition of Done

- [ ] `/jury`, `/jury/<slug>` et `/pages/jury/index.html` demandent identifiant/mot de passe (navigation privée).
- [ ] Matrice → compétence → PDF → projet public → retour : tout en ≤ 2 clics, au clavier aussi.
- [ ] `/jury/fiches/visualcom/mission-reflection.pdf` sans mot de passe → **401**.
- [ ] Aucun mot de passe dans le repo (`npm run gate` : `check:secrets` + `jury-auth.test.ts`), aucun texte jury dans `dist/assets/*.js`.
