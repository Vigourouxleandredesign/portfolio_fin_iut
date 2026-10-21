# Site enseignants (« Espace jury ») — spécification

**Statut :** spec validée 2026-10-21 · **À construire hors de ce repo** (dossier voisin `../Site enseignants/`) · Sécurité : `docs/SECURITY.md` §0 et §7.

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
| Visualcom | `mission-reflection.pdf`, `project-sheet.pdf` | `Fiche de reflexion mission Refonte Visualcom` (**⚠ corriger le copier-coller « staff et adhérents »**), `Fiche projet refonte site Visualcom` |
| Vill’âge Jeunes | `mission-reflection.pdf`, `project-sheet.pdf` | `Fiche de reflexion mission Village jeunes`, `Fiche projet Village Jeunes` |

## Arborescence

```
Site enseignants/                 # HORS du repo public, jamais commité avec lui
  index.html                      # Accueil jury : intro 3 lignes + matrice compétences × projets
  competences/
    developpement-front.html
    qualite-securite-performance.html
    client-gestion-projet.html
    strategie-analyse.html
  fiches/
    visualcom/{mission-reflection,project-sheet}.pdf
    village-jeunes/{mission-reflection,project-sheet}.pdf
  assets/
    site.css                      # copie des tokens DA (variables.css + tokens.css) + styles du mini-site
    logo-leandre.svg
    fonts/                        # Ubuntu + Ubuntu Mono woff2 (copiés depuis node_modules/@fontsource)
  _headers                        # Basic-Auth + noindex + CSP (voir plus bas)
  robots.txt                      # Disallow: /
```

HTML statique pur (pas de build, pas de JS requis). Un seul CSS.

## Gabarits

### `index.html` — Matrice

- En-tête : logo LV, « Espace jury — Léandre Vigouroux, LP MIAW 2026 », lien « ← Portfolio public ».
- Intro (3 lignes) : comment lire le site.
- **Matrice** (`<table>` accessible, `<th scope>`): lignes = compétences, colonnes = projets ; cellule = ● lien vers la section du projet dans la page compétence. Ligne cliquable → page compétence.
- 4 cartes compétence (titre, 1 phrase, nb de preuves) — même ordre que la matrice.

### `competences/<slug>.html` — Compétence

- Fil d’Ariane : `Espace jury › Compétences › <Bloc>`.
- Titre du bloc + compétences UNC couvertes (liste, `Ubuntu Mono`, style cartel).
- **Argumentaire** (≤ 120 mots, repris du brouillon).
- Par projet-preuve, un **cartel** :
  - nom du projet, contexte (alternance / client / SAE), année ;
  - 2-4 preuves (puces reprises du brouillon) ;
  - boutons : « Lire la fiche réflexive (PDF) » (`target="_blank"`), « Fiche projet (PDF) », « Voir le projet sur le portfolio ↗ » (`https://<portfolio>/projects/<slug>`).
- Pied de page : **← compétence précédente · Retour à la matrice · compétence suivante →** (boucle).
- Ancre par projet (`#visualcom`, `#village-jeunes`) pour que la matrice pointe directement dessus.

## DA (version sobre du site public)

- Fond `--color-bg`, texte `--color-text`, filets `--color-border`, accent unique `--color-pigment-gold` (titres, liens au survol) ; pas de 3D, pas de pinceau, pas de décor peinture lourd (au plus un `underline-copper.svg` sous le titre).
- Typo : Ubuntu (titres/corps), Ubuntu Mono (cartels, compétences UNC). Pas d’Updock.
- Lisibilité d’abord : corps 18 px, mesure 68 ch, contraste AA, focus visible, `@media print` propre (le jury peut imprimer une page compétence).

## Sécurité & déploiement

- **Netlify, second site**, déploiement par glisser-déposer du dossier (pas de dépôt Git).
- **Accès** : Netlify Pro → *Site configuration › Access & security › Password protection*. Plan gratuit → `Basic-Auth` dans `_headers` (disponible sur tous les plans) :

  ```
  /*
    Basic-Auth: jury:<MOT_DE_PASSE_LONG>
    X-Robots-Tag: noindex, nofollow
    X-Frame-Options: DENY
    X-Content-Type-Options: nosniff
    Referrer-Policy: no-referrer
    Content-Security-Policy: default-src 'self'; img-src 'self' data:; font-src 'self'; style-src 'self'; script-src 'none'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'none'
  ```

  Le `_headers` reste **uniquement** dans ce dossier local (jamais dans un repo, jamais copié dans le portfolio public). Mot de passe envoyé au jury par mail, séparément du lien.
- Le portfolio public affiche **un seul** lien « Espace jury » (footer + page CV) vers l’URL du site — sans mot de passe.
- Après le jury : supprimer le site Netlify (ou changer le mot de passe) et retirer le lien public.

## Definition of Done

- [ ] L’URL demande identifiant/mot de passe (tester en navigation privée).
- [ ] Matrice → compétence → PDF → projet public → retour : tout en ≤ 2 clics, au clavier aussi.
- [ ] `https://<site>/fiches/visualcom/mission-reflection.pdf` sans mot de passe → **401**.
- [ ] Aucun PDF ni mot de passe dans le repo public (`npm run gate` + test C9).
