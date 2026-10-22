# L6 — Captures restantes

**Exécutant :** Claude Code **Haiku** (Lab Horizon, Spring Boot) + **Léandre** (Micro-monde au téléphone — **reporté**, voir §3) · **Durée :** 1 h · **Dépend de :** rien (peut tourner dès L0) · **Branche :** `wp/L6-captures`

## 1. Lab Horizon (Haiku)

1. Docker Desktop lancé. Dans `C:\Users\Léandre\Desktop\MIAW\Projet SAE 501` : `copy .env.docker.example .env` **seulement si `.env` n’existe pas**, puis `docker compose up -d --build`. Attendre que `http://localhost:8080` réponde.
2. Dans le repo portfolio : `npm run shots -- lab-horizon` (cibles `/` et `/recherche`, déjà dans `scripts/capture-project-shots.mjs`).
3. Contrôler les images : aucune donnée de compte, aucun formulaire rempli. Convertir en WebP (Pillow, q 82) dans `src/assets/projects/lab-horizon/shots/` et supprimer les `.jpg`.
4. `docker compose down` dans le projet SAE.

## 2. Spring Boot (Haiku)

1. MySQL local lancé (base `sbdecouverte_leandre`). Dans `Liste des projets/JAVA (SpringBoot)/tdSpringBoot` : `mvnw.cmd spring-boot:run`.
2. Se connecter **manuellement** (Léandre) en admin dans le navigateur ouvert par le script `--headed` ; capturer : liste des livres, détail d’un livre, page d’administration. Décommenter la cible `back-springboot` du script, ou capturer à la main en 1440×900.
3. WebP dans `src/assets/projects/back-springboot/shots/`. Vérifier : pas d’identifiant visible.
4. Arrêter l’application.

## 3. Micro-monde (Léandre, téléphone) — **REPORTÉ (22/10)**

Ne pas bloquer le lot : L3b utilise les visuels de repli du brief `micromonde.md` (rendus 3D, fresques). Si Léandre fournit plus tard les captures, les brancher comme ci-dessous.


Sur place ou sur une fresque imprimée : 2 captures d’écran du parcours (modèle 3D affiché, panneau « science » ouvert). Les déposer dans `src/assets/projects/micromonde/shots/` sous `micromonde-parcours-ar-mobile-1.jpg` et `-2.jpg` ; Haiku les convertit en WebP.

## 4. Brancher les images

Remplacer les `<!-- TODO L6 -->` laissés par L3a/L3d par les nouvelles images (même balisage que les autres, `alt` descriptif), puis gate + commit + fusion.

## Prompt à coller (Haiku)

```
Tu es exécutant du lot L6 (captures) du portfolio de Léandre. Applique le protocole commun de docs/work-packages/README.md puis docs/work-packages/WP-L6-captures.md, parties 1, 2 (en me demandant d'intervenir pour la connexion) et 4. Ne lis jamais et n'affiche jamais le contenu des fichiers .env. Ne publie aucune image montrant un identifiant ou un formulaire rempli : en cas de doute, demande-moi. Termine par le rapport au format du README.
```
