# Espace jury — contenu prêt à intégrer

**Statut :** validé chef de projet 2026-10-22 · **Sources :** `../Fiche réflexive/Brouillon_competences_Leandre.docx` (blocs + preuves) et les fiches PDF de `public/jury/fiches/` (extraits cités mot pour mot).
**Spec technique & UX :** `docs/content/teacher-site.md` · **Sécurité :** `docs/SECURITY.md` §0/§7.

> Règle d’intégration : ce texte va **uniquement** dans `pages/jury/*.html` (jamais dans un `.ts`/`.json`). Les citations restent entre guillemets « » avec la mention de la fiche source ; elles intègrent déjà les corrections orthographiques listées dans `reflective-sheets-inventory.md` (même texte que l’export final). Ne rien reformuler sans accord de Léandre.

---

## Fichiers PDF (liens)

| Projet | Fiche projet | Fiche de réflexion |
|---|---|---|
| Visualcom — refonte WordPress & connecteur IA | `/jury/fiches/visualcom/project-sheet.pdf` | `/jury/fiches/visualcom/mission-reflection.pdf` |
| Vill’âge Jeunes — application de gestion des adhérents | `/jury/fiches/village-jeunes/project-sheet.pdf` | `/jury/fiches/village-jeunes/mission-reflection.pdf` |

Liens PDF : `target="_blank" rel="noopener"`, libellé explicite + mention « PDF, n pages » (Visualcom fiche projet 3 p., réflexion 3 p. ; Vill’âge Jeunes fiche projet 2 p., réflexion 2 p.).

---

## Page `pages/jury/index.html` — route `/jury`

- `<title>` : `Espace jury — Léandre Vigouroux`
- `<meta name="robots" content="noindex, nofollow">`
- **Bandeau** (cartel) : `Espace jury · LP MIAW · IUT de Nouvelle-Calédonie · 2026`
- **H1** : `Mes compétences, preuve par preuve`
- **Intro** (3 phrases) :
  > Cet espace regroupe mes fiches réflexives, classées par compétence du référentiel de la LP Métiers de l’informatique : applications web. Chaque compétence renvoie aux projets qui la prouvent et à la fiche PDF correspondante. Les projets restent consultables sur le portfolio public.
- **Mode d’emploi** (liste courte) :
  1. Choisissez une compétence dans le tableau.
  2. Lisez l’argumentaire puis ouvrez la fiche réflexive (PDF).
  3. Passez à la compétence suivante ou revenez ici à tout moment.

### Matrice compétences × projets (`<table>` avec `<caption>`)

`<caption>` : `Compétences prouvées par projet`

| Compétence (lien vers la page) | Visualcom | Vill’âge Jeunes | Quintessence |
|---|---|---|---|
| Développement front — conception & réalisation | ● (lien `#visualcom`) | ● (lien `#village-jeunes`) | — |
| Qualité, sécurité & performance | ● | ● | — |
| Échange client & gestion de projet | ● | ● | ○ (sans fiche) |
| Stratégie, analyse & réflexion | ● | ● | — |

Légende sous le tableau : `● preuve détaillée dans une fiche réflexive · ○ preuve citée sans fiche`. Chaque ● est un lien vers l’ancre du projet dans la page compétence (texte accessible : « Voir la preuve Visualcom pour <compétence> »).

### Cartes (sous la matrice, même ordre)

| Carte | Phrase |
|---|---|
| Développement front | Du besoin client à l’interface en production, en passant par la maquette et le code. |
| Qualité, sécurité & performance | Garder un outil simple à utiliser sans ouvrir de brèche. |
| Échange client & gestion de projet | Écouter le terrain, cadrer avec l’équipe, accompagner après la livraison. |
| Stratégie, analyse & réflexion | Analyser, justifier ses choix, documenter pour les autres. |

---

## Gabarit commun des pages compétence

1. Fil d’Ariane : `Espace jury › <Titre>`
2. Cartel `N° <I–IV> · Compétence`
3. H1 = titre du bloc
4. « Compétences du référentiel couvertes » : liste en `Ubuntu Mono`
5. Argumentaire (paragraphe ci-dessous)
6. Une section `<article id="<slug-projet>">` par projet-preuve : titre, contexte, puces « Preuves », citation, boutons PDF + « Voir le projet sur le portfolio » (`/projects/<slug>`)
7. Navigation bas de page : `← <compétence précédente>` · `Retour au tableau` · `<compétence suivante> →` (boucle I → IV → I)

---

## I — `pages/jury/developpement-front.html` — route `/jury/developpement-front`

**H1 :** Développement front — conception & réalisation

**Compétences du référentiel couvertes**
- Analyse, conception, déploiement et maintenance d’applications, de serveurs d’applications
- Conception d’interface
- Paramétrage, prototypage et adaptation des applications
- Maîtriser la programmation
- Concevoir, déployer, gérer et faire évoluer une application

**Argumentaire**
> Sur mes deux missions en alternance chez Visualcom, j’ai porté l’interface du besoin jusqu’à la mise en production : analyse en réunion client, parcours utilisateur, zoning, wireframes et maquette, puis intégration en HTML / CSS / JavaScript. Sur WordPress, j’ai adapté l’outil au besoin réel avec un thème sur mesure et des blocs métier modifiables, plutôt que d’empiler des extensions.

**#village-jeunes — Vill’âge Jeunes (application web, 2026)**
- Preuves : analyse du besoin en réunion client et sur le terrain ; parcours utilisateur, zoning, wireframes, maquette ; développement front-end en HTML / CSS / JavaScript (vanilla) jusqu’à la mise en production ; plus de 500 inscriptions le premier mois.
- Citation : « Sur ce projet, j’ai conçu l’interface de bout en bout, depuis l’analyse du besoin et du cahier des charges jusqu’au développement front-end de l’application. » — *Fiche de réflexion Vill’âge Jeunes*
- Liens : Fiche de réflexion (PDF) · Fiche projet (PDF) · Voir le projet → `/projects/village-jeunes`

**#visualcom — Visualcom (refonte WordPress & connecteur IA, 2026)**
- Preuves : thème WordPress sur mesure à la place d’Astra ; blocs métier modifiables dans Gutenberg ; plugin de mise à jour du thème en un clic depuis la branche `main` du dépôt GitHub ; site livré en une semaine sur un serveur de travail puis basculé en production.
- Citation : « J’ai donc opté pour le thème custom, qui nous oblige à le mettre à jour nous-mêmes si besoin de modification ou de faille, mais qui nous permettait une plus grande liberté. » — *Fiche projet Visualcom*
- Liens : Fiche projet (PDF) · Fiche de réflexion (PDF) · Voir le projet → `/projects/visualcom`

---

## II — `pages/jury/qualite-securite-performance.html` — route `/jury/qualite-securite-performance`

**H1 :** Qualité, sécurité & performance

**Compétences du référentiel couvertes**
- Assurer la qualité, la sûreté, la sécurité et la performance des applications
- Appliquer les normes et standards en vigueur

**Argumentaire**
> Ma ligne : un outil doit rester simple pour l’équipe, mais le serveur reste la seule source de vérité. Chez Visualcom, j’ai refusé les plugins IA qui exigeaient des droits administrateur et mis en place des comptes nominatifs aux droits limités. Sur Vill’âge Jeunes, j’ai travaillé un front propre et léger, responsive, accessible et référencé.

**#visualcom**
- Preuves : un compte et une clé d’application par membre de l’équipe (traçabilité, isolement d’un compte compromis) ; profil équivalent éditeur **sans droit de suppression** ; plugins IA écartés pour risque d’élévation de privilège ; rotation mensuelle des clés et double authentification du connecteur prévues ; conversion des images en WebP/JPEG proposée pour préserver la performance.
- Citation : « Il m’a donc fallu réfléchir à une méthode nous permettant de verrouiller les droits par nature, avec le serveur comme seule source de vérité et l’IA avec des droits définis, limités et stricts autant que possible. » — *Fiche de réflexion Visualcom*
- Liens : Fiche de réflexion (PDF) · Fiche projet (PDF) · `/projects/visualcom`

**#village-jeunes**
- Preuves : code front structuré et léger ; bonnes pratiques web (responsive, accessibilité, SEO) ; versioning par branche de fonctionnalité ou de correction ; mesures de sécurité facilitant la maintenance après la mise en ligne.
- Citation : « Après la mise en ligne, la documentation, les bonnes pratiques de versioning et les mesures de sécurité mises en place ont permis de faciliter la maintenance de l’application. » — *Fiche de réflexion Vill’âge Jeunes*
- Liens : Fiche de réflexion (PDF) · `/projects/village-jeunes`

---

## III — `pages/jury/client-gestion-projet.html` — route `/jury/client-gestion-projet`

**H1 :** Échange client & gestion de projet

**Compétences du référentiel couvertes**
- Assistance et conseil auprès des utilisateurs
- Connaître les méthodes de gestion de projet informatique
- Travailler en équipe et en réseau ainsi qu’en autonomie et responsabilité au service d’un projet
- Utiliser les outils numériques de référence pour collaborer en interne et en externe
- Communiquer par oral et par écrit, de façon claire et non ambiguë

**Argumentaire**
> Je pars du terrain : réunions client, visite sur place, questions précises sur les tâches réelles. En équipe, je cadre la base puis je passe le relais proprement, documentation à l’appui. Après la livraison, j’accompagne : formation à WordPress, comptes et droits configurés pour chacun.

**#village-jeunes**
- Preuves : cahier des charges établi avec le client puis validé sur place ; réunion technique interne (pistes, difficultés, sécurité) ; équipe chef de projet + développeur full stack + moi (maquette, UX/UI, front) ; présentation des maquettes et échanges réguliers avec le client.
- Citation : « Ayant déjà fait de la création de parcours utilisateur, j’ai posé certaines questions précises qui m’avaient manqué sur des projets précédents, afin d’assurer la pertinence du parcours utilisateur. » — *Fiche de réflexion Vill’âge Jeunes*
- Liens : Fiche de réflexion (PDF) · Fiche projet (PDF) · `/projects/village-jeunes`

**#visualcom**
- Preuves : réunion de cadrage avec toute l’équipe à partir d’exemples de sites du secteur ; répartition décidée avec le gérant et le développeur full-stack ; comptes de l’équipe créés et droits configurés ; tâche du connecteur confiée au collègue équipé de Claude Desktop pour lever un blocage matériel.
- Citation : « Pour la partie connecteur IA, une discussion en équipe entre le gérant, le développeur full-stack et moi a permis de définir le mode de fonctionnement, les prérequis minimums à mettre en place ainsi que la répartition de la charge. » — *Fiche de réflexion Visualcom*
- Liens : Fiche de réflexion (PDF) · Fiche projet (PDF) · `/projects/visualcom`

**Quintessence (WordPress) — preuve citée, sans fiche**
- Formation et accompagnement du client à la prise en main de WordPress. *(Aucun lien PDF.)*

---

## IV — `pages/jury/strategie-analyse.html` — route `/jury/strategie-analyse`

**H1 :** Stratégie, analyse & réflexion

**Compétences du référentiel couvertes**
- Analyser et synthétiser des données en vue de leur exploitation
- Développer une argumentation avec esprit critique
- Maîtriser les méthodes et techniques de référencement de site web
- Rédiger de la documentation technique
- Analyser ses actions en situation professionnelle, s’autoévaluer pour améliorer sa pratique

**Argumentaire**
> J’analyse avant de construire et je justifie mes choix : pourquoi un thème sur mesure, pourquoi écarter un plugin, pourquoi documenter dès le début. Mes fiches se terminent toutes par une prise de recul : ce que je referais autrement, et pourquoi.

**#village-jeunes**
- Preuves : traduction des besoins en parcours UX ; documentation technique du front et du back (Documentation.js, en-tête dans chaque fichier) ; prise de recul sur le versioning, la CI/CD et des délais peu réalistes ; évolution proposée en PWA pour une V2.
- Citation : « Cette expérience m’a permis de mieux comprendre l’importance d’une documentation technique claire, mais aussi l’intérêt de la mettre en place dès le début d’un projet. » — *Fiche de réflexion Vill’âge Jeunes*
- Liens : Fiche de réflexion (PDF) · `/projects/village-jeunes`

**#visualcom**
- Preuves : comparaison argumentée de trois approches de connexion IA (MCP officiel, plugin WordPress, accès HTTP par clé éditeur) ; skill Claude pensé comme un front, avec vérifications SEO / GEO / AEO, lisibilité et accessibilité ; retour d’expérience sur le séquencement du projet.
- Citation : « Chaque piste qui a fini sur une impasse m’a permis de comprendre le problème et le projet de manière générale sous un autre angle. » — *Fiche de réflexion Visualcom*
- Liens : Fiche de réflexion (PDF) · Fiche projet (PDF) · `/projects/visualcom`

---

## Lien public vers l’espace jury

- **Footer de toutes les pages publiques** (colonne « Plan du site ») : lien `Espace jury` → `/jury`, avec `<span class="visually-hidden"> (accès protégé par mot de passe)</span>`.
- **Page CV** : bouton secondaire `Espace jury (fiches réflexives)` → `/jury`.
- Aucun lien direct vers un PDF depuis une page publique.
