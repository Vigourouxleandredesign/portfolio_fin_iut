# Lab Horizon : page v2 (30/10), textes tirés de la fiche de réflexion

**Sources :** « Fiche de réflexion : projet Lab Horizon » et « Fiche projet Lab-horizon » (Léandre, 28-30/10, `../Fiche réflexive/`), dépôt `Projet SAE 501` (README, `docs/passation/`).
**Gabarit :** L15 (canvas « Gabarit page projet v2 »). Ces textes remplacent ceux de `lab-horizon.md` pour la page publique.
**Règles :** celles de `AGENTS.md` › Règles d'écriture. Les citations entre « » sont recopiées mot pour mot de la fiche. Aucun nom de coéquipier : leurs rôles seulement.
**Mode d'emploi :** ✅ par défaut, ❌ pour refuser, ✏️ + ta version.

| ID | Emplacement | Texte | Décision |
|---|---|---|---|
| LH2-01 | Cartel | `N° I` + `SAE 501, projet d’équipe à l’IUT de Nouvelle-Calédonie, en 2026` (inchangé) | ✅ |
| LH2-02 | Accroche (hero et meta description) | Le site de valorisation de la recherche de l’Université de la Nouvelle-Calédonie : un catalogue public de publications vulgarisées et un espace chercheur, pensés pour être repris par une autre équipe. | ✅ |
| LH2-03 | Ma part (ligne mise en avant sous l’accroche) | Projet à trois. Ma part : le cadrage UX et le parcours utilisateur, le front-end, l’architecture du dépôt, la documentation de passation et la pipeline CI/CD. | ✅ |
| LH2-04 | Boutons du hero | Pas de démo publique : un seul lien, « Lire l’histoire » (ancre du récit). Pas de bouton principal. | ✅ |
| LH2-05 | L’essentiel, fait 1 | **11** · domaines scientifiques à explorer | ✅ |
| LH2-06 | L’essentiel, fait 2 | **6** · documents de passation, à lire dans l’ordre | ✅ |
| LH2-07 | L’essentiel, fait 3 | **2** · revues de sécurité avant la mise en production | ✅ |
| LH2-08 | Chapitre I, étiquette et titre | Le besoin · Une plateforme à transmettre | ✅ |
| LH2-09 | Chapitre I, texte | Les travaux des chercheurs de Nouvelle-Calédonie sont publiés dans des canaux peu accessibles au grand public. L’IUT voulait un catalogue public de publications vulgarisées, en français et en anglais, et un projet qu’une autre équipe de développement puisse reprendre sans y avoir travaillé. | ✅ |
| LH2-10 | Chapitre I, visuel | Grille des 7 domaines (existante) | ✅ |
| LH2-11 | Chapitre II, étiquette et titre | Mes choix · Séparer les pages de leurs données | ✅ |
| LH2-12 | Chapitre II, texte | J’ai conçu le parcours utilisateur, puis développé le front en React avant que le back existe : d’abord sur des données fictives, puis sur l’API publique HAL. Une couche d’adaptateurs sépare les pages de la source de données, et le passage à l’API Laravel s’est fait sans réécrire les pages. Pour que toute l’équipe travaille dans le même environnement, j’ai proposé de regrouper le front et le back dans un seul dépôt, orchestré par Docker. | ✅ |
| LH2-13 | Chapitre II, visuel | Captures « Recherche, sur ordinateur » et « Accueil, sur mobile » (existantes) | ✅ |
| LH2-14 | Chapitre III (mis en avant), étiquette et titre | Le défi · Vérifier que rien ne régresse | ✅ |
| LH2-15 | Chapitre III, texte | Plus le projet avançait, plus il devenait difficile de savoir si une modification cassait ce qui fonctionnait déjà. Deux revues de sécurité avant la mise en production ont rendu un verdict NO-GO. Une fois les corrections faites, j’ai mis en place une pipeline CI/CD : chaque commit est contrôlé, GitHub rejoue tous les tests sur une machine propre, et la branche main n’accepte que du code validé. | ✅ |
| LH2-16 | Chapitre III, citation | « Cette pipeline ne règle pas tout : elle ne vérifie que ce que j’ai prévu de vérifier, et elle n’est qu’une réponse parmi d’autres possibles à ce problème. » Légende : Extrait de ma fiche de réflexion | ✅ |
| LH2-17 | Chapitre IV, étiquette et titre | Le résultat · Une plateforme livrée avec sa passation | ✅ |
| LH2-18 | Chapitre IV, texte | Le catalogue couvre onze domaines scientifiques, et l’espace chercheur permet de gérer ses publications et de relire les vulgarisations, en français et en anglais. Le projet est remis avec un dossier de passation en six documents. L’assistant conversationnel et l’application installable (PWA) sont prévus pour une V2. | ✅ |
| LH2-19 | Chapitre IV, visuel | Capture « Domaine, sur mobile » (existante) | ✅ |
| LH2-20 | Équipe (une ligne, après le récit) | Projet à trois : un développeur back (API et base de données), un développeur chargé du modèle IA de vulgarisation, et moi. | ✅ |
| LH2-21 | Outils | React 19, TypeScript, Laravel 12, MySQL, Docker, et GitHub Actions si son logo existe dans le jeu de L12 (sinon ne pas l’ajouter) | ✅ |
| LH2-22 | Aller plus loin | Aucune carte : pas de démo publique, et les fiches restent dans l’espace jury (aucun lien public vers un PDF). Section absente. | ✅ |
| LH2-23 | « Ce que j’en retiens » | Bloc masqué (texte de Léandre attendu) | ✏️ |

Textes retirés de la page : « En bref » (trois colonnes), le chapitre « Ce qui reste à venir » (fondu dans IV), la mention « contrairement à des tests lancés par une IA » (le sujet de la page est l’architecture et la transmission, pas l’IA).
