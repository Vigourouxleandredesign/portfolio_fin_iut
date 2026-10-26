# Relecture des textes du site (26/10/2026)

**Auteur :** Claude, chef de projet · **Relecteur :** Léandre · **Appliqué par :** lot L12 (`docs/work-packages/WP-L12-textes-logos-domaines.md`)

## Mode d'emploi

- Chaque ligne a une décision : **✅** (par défaut) = la version « Après » est appliquée telle quelle ; **❌** = on garde « Avant » ; **✏️** = tu écris ta version dans la colonne « Après » (remplace mon texte) puis tu mets ✏️.
- Tu peux modifier ce fichier directement dans Cursor. L'exécutant n'applique **que** ce tableau, rien d'autre.
- Les citations de tes fiches réflexives (entre « guillemets » dans l'espace jury) ne sont **pas** touchées : ce sont tes mots.

---

## 1. Critique : ce qui fait « texte d'IA » et pourquoi

La grande majorité de ces textes vient de **mes** briefs. Je les ai validés sur le fond (exactitude, ton positif) sans les relire sur la forme. Voici ce que j'aurais dû voir.

| Tic | Mesure sur le site | Pourquoi ça se voit | Règle retenue |
|---|---|---|---|
| **Tiret long « — »** | 113 occurrences (76 sur les pages publiques) | En français, le tiret d'incise existe mais reste rare. Employé partout, comme connecteur universel, c'est la marque n° 1 des textes générés (calque de l'anglais). | Zéro tiret long. On utilise la virgule, les deux-points, la parenthèse ou deux phrases. Le trait d'union reste (« a-t-il », « peut-être », « front-end », « 2021-2022 »). Dans les cartels, le séparateur est « · ». |
| **Esperluette « & » dans les phrases** | Titres jury, CV, sous-titre d'accueil | Anglicisme typographique. Acceptable dans un logo, pas dans une phrase française. | « et » partout. |
| **Formules slogan et antithèses** | « Deux métiers, une seule exigence », « Un produit, pas une maquette », « jamais pour alourdir la page », « séduisant sur le papier mais inutilisé », « imaginaire mais crédible » | Construction « X, pas Y » répétée : effet publicitaire, ton grandiloquent. | Une affirmation simple et concrète. |
| **« Du X au Y » en série** | 9 fois (du concept au prototype, du croquis à l'usine, du papier au code, du brief à l'ambiance, du dispositif interactif au code…) | Un tic de structure : utile une fois, mécanique au-delà. | Deux au maximum sur tout le site (« Du croquis à l'usine » pour la borne, « Du papier au code » pour Vill'âge Jeunes). |
| **Mots emphatiques répétés** | « exigence / exigeant » ×5, « lisible » ×4, « brèche » ×3, « dialoguer avec toute la chaîne » ×2, « immersif », « assumée », « par conviction », « enfin » | Adjectifs qui affirment une qualité au lieu de la montrer. Le lecteur les ignore, ou pire, se méfie. | Montrer par un fait (un chiffre, une techno, un résultat), pas par un adjectif. |
| **Énumérations par trois** | « une question, un projet, une collaboration », « données, droits, sécurité », « le contexte, les choix et le résultat » | Rythme ternaire systématique, très reconnaissable. | Garder quand la liste est réelle, couper quand c'est un effet de style. |
| **Métaphores internes à la DA** | « Le sanctuaire s'éveille », « Six matières suspendues », « La preuve du travail » | Le nom de code de la DA (« sanctuaire ») n'a aucun sens pour un visiteur. | Le décor reste visuel ; le texte reste concret. Le musée (« Salle », 404) est conservé là où il est compréhensible. |
| **Tutoiement / vouvoiement mélangés** | « ouvre une fiche » (accueil) contre « Entrez », « Scannez », « Choisissez » partout ailleurs | Incohérence de voix, typique d'un assemblage de textes générés séparément. | Vouvoiement partout. |
| **Anglicismes évitables** | desktop, live, mockup, staff, process, Email | Mélange de registres. | « ordinateur », « en ligne », « aperçu », « l'équipe », « démarche », « E-mail ». Les termes techniques sans équivalent courant restent (front-end, back, CI/CD, UI/UX). |
| **Instructions au visiteur** | « Cliquez sur le mockup pour ouvrir… », « Captures desktop… même format pour une lecture homogène » | Texte qui décrit l'interface au lieu de parler du projet. | Supprimé : le bouton suffit. |
| **Mots mis dans ta bouche** | « Ce que j'en retiens » de Micro-monde et de Vill'âge Jeunes | **Le plus grave.** Je les ai rédigés « d'après tes fiches », à la première personne. Un jury qui t'interroge dessus entendra la différence. | Masqués jusqu'à ce que tu écrives les tiens (section 3). |
| **Majuscules inutiles** | « Clic droit » en milieu de phrase, « Intelligence Artificielle », « Creative Developer » dans un texte alternatif, « Applications web » / « applications web » selon les pages | Majuscule de titre à l'anglaise. | Minuscule sauf nom propre et début de phrase. Le nom officiel de la licence est écrit d'une seule façon : « licence professionnelle Métiers de l'informatique : applications web (MIAW) », abrégé « LP MIAW ». |
| **Majuscules de mise en forme (CSS)** | Cartels, boutons, petites étiquettes en capitales | Choix de DA (cartels de musée), pas un tic d'écriture. | **Conservées.** |

**Ce qui est bien et reste :** tes propres textes (MagicalLab, version longue Visualcom, citations des fiches), les faits chiffrés (500 inscriptions, six langues, une dizaine de bornes), les titres de récit simples (« Partir du terrain », « Modéliser léger », « Penser au visiteur étranger »).

---

## 2. Tableau des corrections

Convention : « · » = séparateur de cartel. Les règles globales (G) s'appliquent à toutes les pages, les lignes suivantes précisent les cas particuliers.

### Règles globales

| ID   | Avant                                                                                                                                                                                                                                  | Après                                                                                                   | Pourquoi                                    | Décision                        |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------- | ------------------------------- |
| G-01 | Tout « — » dans un cartel, ex. `SAE 501 — IUT de Nouvelle-Calédonie`, `Projet front — IUT`, `Devoir Angular — LP MIAW`, `TP back-end — LP MIAW`, `Challenge — finaliste`, `Nuit de la Science — UNC`, `Alternance Visualcom — client…` | Même texte avec « · » : `SAE 501 · IUT de Nouvelle-Calédonie`, `Pacific Dataviz Challenge · finaliste`… | Séparateur unique des cartels               | : ou , en fonction de la phrase |
| G-02 | Liens des cartes et du carrousel : `Lab Horizon — Voir le projet` (×13)                                                                                                                                                                | `Voir le projet Lab Horizon`                                                                            | Tiret ; nom de lien plus naturel à l'écoute | ✅                               |
| G-03 | `© 2026 Léandre — Creative developer` (pied de page, toutes les pages)                                                                                                                                                                 | `© 2026 Léandre Vigouroux, creative developer`                                                          | Tiret ; nom complet                         | ✅                               |
| G-04 | `Hâte de collaborer avec vous sur des projets exigeants.` (pied de page)                                                                                                                                                               | `Ouvert aux échanges, aux missions et aux opportunités.`                                                | « exigeant » ×5 ; formule creuse            | ✅                               |
| G-05 | `UX/UI` (étiquettes, textes)                                                                                                                                                                                                           | `UI/UX`                                                                                                 | Une seule graphie                           | ✅                               |
| G-06 | `&` dans un texte ou un titre (`Webdesign & UI/UX`, `Design & création`, `3D & AR`, titres jury…)                                                                                                                                      | `et`                                                                                                    | Anglicisme                                  | ✅                               |
| G-07 | Alt et aria avec tiret : `Visualcom — page d'accueil desktop`, `Visualcom — aperçu du site`, `Aperçu… — ordinateur et téléphone`                                                                                                       | `Visualcom, page d'accueil sur ordinateur`, `Aperçu du site Visualcom`, `… sur ordinateur et téléphone` | Tiret ; anglicisme                          | ✅                               |
| G-08 | `VisualCom` (alt du logo client)                                                                                                                                                                                                       | `Visualcom`                                                                                             | Graphie unique                              | ✅                               |

### Accueil (`pages/index.html`)

| ID | Avant | Après | Pourquoi | Décision |
|---|---|---|---|---|
| ACC-01 | meta : `Portfolio creative developer — infographiste webdesigner et développeur web. Front-end par intérêt, design et code.` | `Portfolio de Léandre Vigouroux, infographiste webdesigner et développeur web front-end à Nouméa : projets web, 3D et dispositifs interactifs.` | Tiret, formule | ✅ |
| ACC-02 | Voile d'ouverture : `Le sanctuaire s'éveille` | *(supprimer le texte, le voile reste visuel ; garder un libellé accessible « Chargement de la page »)* | Nom interne de la DA, sans sens pour le visiteur | ✅ |
| ACC-03 | `Clic gauche : peindre — Clic droit : tourner le buste` | `Clic gauche pour peindre, clic droit pour tourner le buste` | Tiret, majuscule | ✅ |
| ACC-04 | `Léandre Vigouroux — développeur web & webdesigner, Nouméa` | `Léandre Vigouroux, développeur web et webdesigner à Nouméa` | Tiret, & | ✅ |
| ACC-05 | `La preuve du travail — ouvre une fiche pour le contexte, les choix et le résultat.` | `Mes projets les plus récents. Chaque fiche présente le contexte, mes choix et le résultat.` | Formule, tiret, tutoiement | ✅ |
| ACC-06 | Carrousel : `La recherche calédonienne rendue lisible.` | `La recherche calédonienne expliquée au grand public.` | « lisible » ×4 | ✅ |
| ACC-07 | Carrousel : `Laboratoire 3D immersif en React Three Fiber.` | `Un laboratoire en 3D à explorer, codé en React Three Fiber.` | « immersif » | ✅ |
| ACC-08 | `Entreprises avec qui j'ai pu travailler` | `Entreprises avec lesquelles j'ai travaillé` | Tournure plus directe | ✅ |
| ACC-09 | `Deux métiers, une seule exigence` | `Designer et développeur` | Slogan | ✅ |
| ACC-10 | `Infographiste webdesigner diplômé et développeur en licence professionnelle Applications web. Creative developer par conviction : le front par intérêt, la 3D par passion, des bases back (Spring Boot, Symfony) pour dialoguer avec toute la chaîne.` | `Infographiste webdesigner diplômé, je prépare la licence professionnelle MIAW (applications web) en alternance. Je développe surtout côté front, je crée en 3D, et j'ai les bases du back (Spring Boot, Symfony) pour travailler avec toute l'équipe technique.` | Formule en trois « par… », répétition | ✅ |
| ACC-11 | Concevoir : `Direction artistique, maquettes et design system. Une intention claire avant la première ligne de code.` | `Direction artistique, maquettes et design system : la direction visuelle est posée avant d'écrire le code.` | Formule | ✅ |
| ACC-12 | Développer : `Front-end exigeant — HTML sémantique, CSS structuré, TypeScript. Les bases du back pour dialoguer avec toute la chaîne.` | `HTML sémantique, CSS structuré et TypeScript, avec les bases du back pour échanger avec les développeurs serveur.` | Tiret, « exigeant », répétition | ✅ |
| ACC-13 | Animer : `Canvas, 3D temps réel et micro-interactions, utilisés pour servir le propos — jamais pour alourdir la page.` | `Canvas, 3D temps réel et micro-interactions, quand ils aident à comprendre et sans alourdir la page.` | Antithèse, tiret | ✅ |
| ACC-14 | Bouton `Découvrir mes compétences` | `Parcourir par domaine` (ancre vers la section domaines) | Suit la refonte de la section (L12 partie C) | ✅ |
| ACC-15 | Intro section : `Six matières suspendues — du dispositif interactif au code.` | `Choisissez un domaine pour voir les projets qui s'y rattachent.` | Métaphore, tiret ; la section devient utile | ✅ |
| ACC-16 | Plaque Dispositifs interactifs : `Bornes, interfaces embarquées et expériences tactiles — du concept au prototype.` | `Bornes, interfaces tactiles et parcours en réalité augmentée.` | Tiret, « du X au Y » | ✅ |
| ACC-17 | Plaque Développement web : `Front-end exigeant, intégration soignée, bases back pour dialoguer avec toute la chaîne.` | `Sites et applications web, surtout côté front, avec les bases du back.` | « exigeant », répétition | ✅ |
| ACC-18 | Plaque Webdesign : `Interfaces sur mesure, design systems et parcours utilisateurs clairs.` | `Maquettes, design systems et parcours utilisateur.` | Adjectifs vides | ✅ |
| ACC-19 | Plaque Design produit : `Conception d'objets et de supports, du croquis au prototype 3D.` | `Croquis, modélisation et fichiers de fabrication d'objets réels.` | « du X au Y » | ✅ |
| ACC-20 | Plaques Création 3D + Animation 2D/3D (fusionnées) : `Modélisation, rendu et intégration temps réel sur le web.` / `Habillages animés, transitions et micro-interactions.` | Une seule plaque **Création 3D** : `Modélisation, animation et rendu, jusqu'à l'intégration en temps réel sur le web.` | Fusion décidée le 26/10 | ✅ |
| ACC-21 | Numéros des plaques : `01 — Interactif` … `06 — Motion` | Remplacés par le nombre de projets du domaine, ex. `3 projets` | Tiret ; information utile | ✅ |
| ACC-22 | CTA : `Design, développement front, 3D ou les trois à la fois — parlons-en.` | `Un site, une application ou un projet en 3D ? Écrivez-moi.` | Tiret, formule | ✅ |
| ACC-23 | alt du buste : `Buste sculpté fracturé, Creative Developer` | `Buste sculpté fracturé, éclaboussé de peinture` | Majuscules ; décrit l'image | ✅ |

### Catalogue (`pages/projects.html`)

| ID | Avant | Après | Pourquoi | Décision |
|---|---|---|---|---|
| CAT-01 | meta : `Projets — dispositifs interactifs, développement web, webdesign, design produit, 3D et animation.` | `Mes projets : développement web, webdesign, 3D, design produit et dispositifs interactifs.` | Tiret | ✅ |
| CAT-02 | `Sélection de projets numériques — développement, dispositifs interactifs et dataviz. Chaque carte ouvre la fiche complète.` | `Neuf projets, en alternance et en formation. Filtrez par domaine ou ouvrez une fiche.` | Tiret, phrase descriptive de l'interface | ✅ |
| CAT-03 | Carte Lab Horizon : `La recherche calédonienne, enfin lisible : catalogue de publications vulgarisées et espace chercheur.` | `La recherche calédonienne expliquée au grand public : catalogue de publications vulgarisées et espace chercheur.` | « enfin lisible » | ✅ |
| CAT-04 | Carte MagicalLab : `Un laboratoire 3D immersif en React Three Fiber : entrez par le portail.` | `Un laboratoire en 3D à explorer au clavier, codé en React Three Fiber.` | « immersif » | ✅ |
| CAT-05 | Carte HyperLoop : `Un site vitrine Angular traduit en six langues, pour un réseau imaginaire mais crédible.` | `Un site vitrine Angular en six langues pour un réseau de trains fictif en Nouvelle-Calédonie.` | Antithèse | ✅ |
| CAT-06 | Carte Spring Boot : `Côté serveur : rôles, mots de passe chiffrés et rendu serveur en Spring Boot.` | `Une application de bibliothèque en Spring Boot : rôles, mots de passe chiffrés et rendu serveur.` | « serveur » ×2 | ✅ |

### CV (`pages/cv.html`)

| ID | Avant | Après | Pourquoi | Décision |
|---|---|---|---|---|
| CV-01 | meta + chapeau : `… Je mêle design, 3D et développement front pour concevoir des expériences sur mesure — avec une exigence technique assumée.` | `… Je combine design, 3D et développement front.` | Tiret, « exigence assumée » | ✅ |
| CV-02 | Dates : `Janv. 2026 — aujourd'hui` · `Sept. 2024 — déc. 2025` · `Sept. 2023 — févr. 2024` · `2021 — 2022` | `Depuis janv. 2026` · `Sept. 2024 à déc. 2025` · `Sept. 2023 à févr. 2024` · `2021-2022` | Tirets | ✅ |
| CV-03 | `Commercial — hôte d'accueil` | `Commercial et hôte d'accueil` | Tiret | ✅ |
| CV-04 | `CQPT — Certificat de qualification professionnelle des télécommunications` | `CQPT (certificat de qualification professionnelle des télécommunications)` | Tiret, majuscule | ✅ |
| CV-05 | `Projets web de bout en bout, du cadrage au déploiement, à la formation et au support client.` | `Projets web complets : cadrage, développement, déploiement, formation et support client.` | « de bout en bout » + « du X au Y » | ✅ |
| CV-06 | `Workflow de publication sécurisé via LLM, avec tests de non-régression et contrôles de sécurité.` | `Publication de contenus assistée par IA, sécurisée par des tests de non-régression et des contrôles de sécurité.` | Anglicismes | ✅ |
| CV-07 | Titres `Design & création`, `3D & AR` | `Design et création`, `3D et réalité augmentée` | & | ✅ |

### Contact (`pages/contact.html`) et 404

| ID | Avant | Après | Pourquoi | Décision |
|---|---|---|---|---|
| CT-01 | meta + chapeau : `Une question, un projet, une collaboration — écrivez-moi. Je réponds sous 48 heures.` | `Une question, un projet ou une proposition de collaboration : écrivez-moi, je réponds sous 48 heures.` | Tiret, rythme ternaire | ✅ |
| CT-02 | Étiquette `Email` | `E-mail` | Anglicisme | ✅ |
| 404-01 | `Cette salle n'existe pas (encore).` | *(inchangé : clin d'œil musée compréhensible)* | Gardé | ✅ |

### Lab Horizon

| ID | Avant | Après | Pourquoi | Décision |
|---|---|---|---|---|
| LH-01 | meta + chapeau : `La recherche calédonienne, enfin lisible. Un catalogue public de publications vulgarisées, un espace chercheur pour les relire, et toute la plateforme qui se relance en une commande.` | `La recherche calédonienne expliquée au grand public : un catalogue de publications vulgarisées, un espace chercheur pour les relire, et une plateforme qui s'installe en une seule commande.` | « enfin lisible », jargon | ✅ |
| LH-02 | `Le visiteur explore par domaine — biologie, chimie, géosciences, histoire, informatique, mathématiques, physique… — sans créer de compte.` | `Le visiteur explore par domaine (biologie, chimie, géosciences, histoire, informatique, mathématiques, physique) sans créer de compte.` | Double tiret | ✅ |
| LH-03 | Titre `Un produit, pas une maquette` | `Une plateforme complète` | Antithèse | ✅ |
| LH-04 | Légendes `Recherche — desktop` · `Accueil — mobile` · `Domaine — mobile` | `Recherche, sur ordinateur` · `Accueil, sur mobile` · `Domaine, sur mobile` | Tiret, anglicisme | ✅ |
| LH-05 | `Développement front, UX/UI (maquettes, …)` | `Développement front, UI/UX (maquettes, …)` | G-05 | ✅ |

### MagicalLab (ton texte : seules les marques de forme sont touchées)

| ID | Avant | Après | Pourquoi | Décision |
|---|---|---|---|---|
| ML-01 | `La caméra le suit, pour une immersion simple mais déjà complète.` | `La caméra suit le personnage.` | Ajout de ma part (antithèse) | ✅ |
| ML-02 | Bloc « En bref » : `À la base, c'est un simple projet de front de l'IUT. L'objectif était… pousser l'expérience plus loin.` | *(supprimer ce paragraphe, garder les 3 puces)* : il répète mot pour mot le début de « Du brief à l'ambiance » | Doublon | ✅ |
| ML-03 | Légendes `Atelier · orrery` · `Interaction · F` | `Atelier et planétaire` · `Interaction (touche F)` | Anglicisme | ✅ |

### Micro-monde

| ID | Avant | Après | Pourquoi | Décision |
|---|---|---|---|---|
| MM-01 | meta + chapeau : `Scannez une fresque, et un petit monde en sort. Une tortue, un loriquet, un hibiscus prennent vie en 3D sur les murs du campus — directement dans le navigateur du téléphone.` | `Scannez une fresque et un petit monde en sort : une tortue, un loriquet et un hibiscus apparaissent en 3D sur les murs du campus, directement dans le navigateur du téléphone.` | Tiret, « prennent vie » | ✅ |
| MM-02 | `Propositions de fresques — Kuby Kolor` | `Propositions de fresques de Kuby Kolor` | Tiret | ✅ |
| MM-03 | « Ce que j'en retiens » (rédigé par moi) | **Masquer le bloc** jusqu'à ton texte (section 3) | Mots mis dans ta bouche | ✅ |

### Vill'âge Jeunes

| ID | Avant | Après | Pourquoi | Décision |
|---|---|---|---|---|
| VJ-01 | meta + chapeau : `Dématérialiser les inscriptions d'une association pour rendre du temps à l'humain. Une application web livrée en production, utilisée chaque jour par toute l'équipe.` | `Une application web qui remplace les inscriptions papier d'une association. En production, elle sert chaque jour à toute l'équipe.` | « rendre du temps à l'humain » | ✅ |
| VJ-02 | `… ont évité un parcours séduisant sur le papier mais inutilisé.` | `… ont permis de construire un parcours adapté à leur quotidien.` | Antithèse | ✅ |
| VJ-03 | `staff` (×2 : « écouter les adhérents et le staff », « utilisée par tout le staff ») | `l'équipe` | Anglicisme | ✅ |
| VJ-04 | « Ce que j'en retiens » (rédigé par moi) | **Masquer le bloc** jusqu'à ton texte (section 3) | Mots mis dans ta bouche | ✅ |

### Visualcom

| ID | Avant | Après | Pourquoi | Décision |
|---|---|---|---|---|
| VC-01 | meta : `Refonte WordPress, thème custom, déploiement GitHub et connexion Claude — projet Visualcom.` | `Refonte du site WordPress de Visualcom : thème sur mesure, déploiement depuis GitHub et connexion sécurisée à Claude.` | Tiret | ✅ |
| VC-02 | Chapeau : `Refonte WordPress sur mesure — thème custom, déploiement GitHub et réflexion Claude / MCP, sans perdre l'historique éditorial.` | `Refonte du site WordPress avec un thème sur mesure, un déploiement depuis GitHub et une réflexion sur la connexion à Claude, sans perdre les actualités existantes.` | Tiret | ✅ |
| VC-03 | `Cliquez sur le mockup pour ouvrir https://visualcom.nc dans une nouvelle fenêtre. Les écrans affichés sont des captures figées (haut de page) — naviguez librement sur le site live.` | *(supprimer : le bouton « Voir le site » suffit)* | Instruction d'interface | ✅ |
| VC-04 | `… et préparer l'usage de Claude Desktop sans ouvrir des brèches sur le site live.` | `… et préparer l'usage de Claude Desktop sans mettre en danger le site en ligne.` | « brèche » ×3 | ✅ |
| VC-05 | Puces : `Réunion de cadrage + exemples de sites du secteur et maquette interne` · `Thème custom à la place d'Astra — blocs métier modifiables dans l'éditeur` · `Connexion Claude : MCP natif et plugins tiers écartés (droits trop larges) ; piste HTTP + compte éditeur non finalisée` | `Réunion de cadrage avec des exemples de sites du secteur et une maquette interne` · `Thème sur mesure à la place d'Astra, avec des blocs métier modifiables dans l'éditeur` · `Connexion à Claude : MCP natif et plugins tiers écartés (droits trop larges), piste HTTP avec un compte éditeur non finalisée` | « + », tiret | ✅ |
| VC-06 | `Pour le détail de ma réflexion — problématique, process et essais MCP — la fiche complète est juste en dessous…` | `Le détail de ma réflexion (problématique, démarche, essais MCP) est dans la fiche complète, plus bas.` | Double tiret | ✅ |
| VC-07 | `Captures desktop du site live — même format pour une lecture homogène.` | `Captures du site en ligne, sur ordinateur.` | Tiret, phrase méta | ✅ |
| VC-08 | Légendes `Desktop` · `Mobile` | `Ordinateur` · `Mobile` | Anglicisme | ✅ |
| VC-09 | `Ton d'origine conservé — pour celles et ceux qui veulent suivre le raisonnement pas à pas.` | `Mon texte d'origine, pour suivre le raisonnement étape par étape.` | Tiret | ✅ |
| VC-10 | Version longue : `à l'ère de l'Intelligence Artificielle` | `à l'ère de l'intelligence artificielle` | Majuscules | ✅ |
| VC-11 | Version longue : `qui nous oblige, à nous, à le mettre à jour` | `qui nous oblige à le mettre à jour nous-mêmes` | Aligné sur la fiche corrigée du 22/10 | ✅ |

### HyperLoop, Spring Boot, Pacific Dataviz, Borne

| ID | Avant | Après | Pourquoi | Décision |
|---|---|---|---|---|
| HL-01 | meta + chapeau : `… Un site vitrine Angular, traduit en six langues, pour un réseau imaginaire mais crédible.` | `… Un site vitrine Angular, traduit en six langues, pour un réseau de trains fictif.` | Antithèse | ✅ |
| HL-02 | `… à partir de données JSON — et penser au tourisme.` | `…, à partir de données JSON, en pensant aussi aux touristes.` | Tiret | ✅ |
| SB-01 | Étiquette `Pourquoi c'est là` | `Pourquoi ce projet` | Tournure orale maladroite | ✅ |
| PD-01 | `climat, océan, développement centré sur les personnes, technologie…` | `climat, océan, développement centré sur les personnes et technologie.` | Points de suspension décoratifs | ✅ |

### Espace jury (argumentaires et titres rédigés par moi ; citations intactes)

| ID | Avant | Après | Pourquoi | Décision |
|---|---|---|---|---|
| JY-01 | Titres des compétences (titre de page, h1, tableau, navigation) : `Développement front — conception & réalisation` · `Qualité, sécurité & performance` · `Échange client & gestion de projet` · `Stratégie, analyse & réflexion` | `Développement front : conception et réalisation` · `Qualité, sécurité et performance` · `Échange client et gestion de projet` · `Stratégie, analyse et réflexion` | Tiret, & (les adresses `/jury/...` ne changent pas) | ✅ |
| JY-02 | `Mes compétences, preuve par preuve` | `Mes compétences et leurs preuves` | Formule | ✅ |
| JY-03 | Attribution sous les citations : `— Vill'âge Jeunes, nouvel onglet` (lien vers la fiche) | `Fiche Vill'âge Jeunes (PDF, nouvel onglet)` ; idem Visualcom | Tiret | ✅ |
| JY-04 | `Ma ligne : un outil doit rester simple pour l'équipe, mais le serveur reste la seule source de vérité.` | `Mon principe : l'outil reste simple pour l'équipe, et le serveur garde le contrôle des données.` | « Ma ligne », antithèse | ✅ |
| JY-05 | Résumé compétence II : `Garder un outil simple à utiliser sans ouvrir de brèche.` | `Un outil simple à utiliser et sûr.` | « brèche » ×3 | ✅ |
| JY-06 | `Quintessence (WordPress) — preuve citée, sans fiche` | `Quintessence (WordPress), preuve citée sans fiche` | Tiret | ✅ |
| JY-07 | `équipe chef de projet + développeur full stack + moi (maquette, UX/UI, front)` | `une équipe avec un chef de projet, un développeur full stack et moi (maquette, UI/UX, front)` | « + » | ✅ |
| JY-08 | `Visualcom (refonte WordPress & connecteur IA, 2026)` | `Visualcom (refonte WordPress et connecteur IA, 2026)` | & | ✅ |

---

## 3. À écrire par toi (non bloquant pour mercredi)

Ces textes doivent venir de toi. Tant qu'ils n'existent pas, le bloc correspondant est masqué (aucun texte d'attente affiché).

| Page | Texte attendu | Repère |
|---|---|---|
| Micro-monde | « Ce que j'en retiens » : 1 à 2 phrases | Ce que tu as appris en concevant pour un lieu réel ? |
| Vill'âge Jeunes | « Ce que j'en retiens » | Ta fiche parle de documentation dès le début et de versioning |
| Lab Horizon, HyperLoop, Spring Boot, Borne | « Ce que j'en retiens » (facultatif) | |
| Visualcom | Une phrase sur l'état actuel du connecteur MCP (la puce dit « non finalisée », le bloc « Ce que j'ai livré » parle de comptes en place : à mettre d'accord) | Point M2 de la recette |

Écris-les directement dans ce fichier sous chaque ligne ; un exécutant les intègre en 10 minutes, même après la mise en ligne.
