# Bibliothèque Spring Boot — brief page projet

| Champ | Valeur |
|---|---|
| Slug / route | `back-springboot` · `/projects/back-springboot` → `pages/projects/back-springboot.html` (à **réécrire**) |
| Statut | Secondaire n° VII — montre le back-end en complément du profil front |
| Pigment | `--color-project-secondary` |
| Année · contexte | 2026 · TP Spring Boot, LP MIAW |
| Démo | Aucune (local `mvnw.cmd spring-boot:run` → `localhost:8080`) |
| Sources | `Liste des projets/JAVA (SpringBoot)/tdSpringBoot/HELP.md`, `pom.xml` |

## Contenu prêt à coller

**Cartel :** `N° VII · 2026 · TP back-end — LP MIAW` · stack `Java · Spring Boot · Spring Security · Spring Data JPA · Thymeleaf · MySQL`

**H1 :** Bibliothèque Spring Boot

**Accroche :**
> Côté serveur aussi : une application de gestion de bibliothèque en Spring Boot, avec rôles, mots de passe chiffrés et rendu serveur.

**En bref**
- **Le sujet** — Gérer des livres, des auteurs, des mots-clés et des marque-pages.
- **Ce que j’ai fait** — Modèle JPA sur MySQL, pages Thymeleaf, authentification Spring Security avec deux rôles (utilisateur, administrateur) et mots de passe hachés en BCrypt.
- **Pourquoi c’est là** — Pour montrer que je comprends ce qui se passe derrière l’interface : données, droits, sécurité.

**Récit (1 bloc)** — **Des droits par rôle** : un utilisateur consulte livres et auteurs ; seul l’administrateur gère les mots-clés, les marque-pages et l’administration. Les droits sont vérifiés côté serveur, pas seulement masqués dans l’interface.

## Visuels

À produire (lot L6) : `src/assets/projects/back-springboot/shots/` — liste des livres, détail d’un livre, page d’administration (connecté en admin **local**). Avant capture : aucune donnée personnelle, URL `localhost` masquée par le cadre navigateur générique.

## Interdits

**Ne jamais** publier les identifiants de `HELP.md` (comptes michel/admin, MySQL root), ni l’écran de login rempli.
