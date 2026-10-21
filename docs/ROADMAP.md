# Roadmap — reprise du projet

**Dernière mise à jour :** 2026-10-06  
**Deadline interne :** **27 octobre 2026** (freeze + smoke test)  
**Livraison :** **28 octobre 2026**  
**Stack :** Vite + Vanilla TypeScript + CSS (MPA) · Netlify (site public ouvert + **second site** mot de passe pour les fiches enseignants). Supabase **supprimé du code** (2026-10-21).  
**Positionnement :** Creative developer — Bac+2 infographie webdesign + Bac+3 développement web

Lire avant toute reprise : `AGENTS.md` · `docs/ARCHITECTURE.md` · `docs/SECURITY.md` · `docs/DA.md`

### Briefs pages projet

Source of truth DA / copy par fiche : `docs/content/projects/<slug>.md` (ex. [`magicallab.md`](./content/projects/magicallab.md)). Un brief = une page. Ne pas laisser ces `.md` dans `public/`.

---

## ★ Sprint livraison — 3 piliers obligatoires

Tout le reste (DA étendue, GSAP, polish hero, Formax…) est **hors chemin critique** jusqu’au 27/10. On ne touche à ces sujets **que** s’il reste du buffer après les 3 piliers.

| # | Pilier | Objectif « terminé » | Fenêtre | Freeze |
|---|--------|----------------------|---------|--------|
| **1** | **P — Projets** | Catalogue figé + **chaque** fiche remplie (texte + visuels + démo si existante) + listing / accueil à jour | **2 → 13 oct** | **13 oct** |
| **2** | **B — Accès enseignants** | Second site Netlify + mot de passe dashboard + PDFs (hors Git) | **14 → 20 oct** | **20 oct** |
| **3** | **C — Déploiement & tests** | Netlify prod + tests avant / après 1er deploy + correctifs | **21 → 27 oct** | **27 oct** |

**Buffer bugs :** 25–26 oct · **Livraison :** 28 oct

### Tests anti-régression *(décision 2026-10-02)*

Source of truth : [`docs/TESTING.md`](./TESTING.md).

| Suite | Statut |
|-------|--------|
| A + B + C + E | **Actifs** — `npm run gate` après chaque change |
| D0 + D4 + D5 | **Actifs** — `npm run test:e2e` / `gate:full` |
| D1 | Dès insertion contenu projets + **avant prod** |
| D2 + D3 | **Annulés** pour octobre (pas d’auth applicative — mot de passe Netlify) |

**Règle :** pas de validation / pas de sujet suivant tant que le gate requis est rouge.

### État actuel (gap)

| Zone | Fait | Manque pour « terminé » |
|------|------|-------------------------|
| Structure pages projets | 7 HTML + gabarit ; Visualcom le plus avancé | Texte / galeries / covers encore **placeholder** sur 6 fiches ; MicroMonde **pas** encore listé |
| Accès enseignants | Décision **A** verrouillée (2026-10-06) : mot de passe Netlify | Second site + PDFs + mot de passe dashboard ; `evaluator.html` non utilisé |
| Déploiement | Docs + `_headers` / `_redirects` | Site Netlify branché, checklist sécu adaptée, tests prod |

**Inventaire sources :** [`docs/content/projects-source-inventory.md`](./content/projects-source-inventory.md)

---

### Pilier 1 — Projets (2 → 13 oct)

**Definition of Done (par projet) :** cover listing + page case study avec En bref, galerie réelle (plus d’initiales seules), version longue ou pitch solide, CTA démo/site si applicable, mockup (iframe **ou** shots).

#### P0 — Cadre *(2–3 oct)* — deadline **3 oct**
- [x] **Freeze catalogue livraison** : 7 + **MicroMonde** (`micromonde`) — Formax hors scope octobre *(validé 2026-10-02)*
- [x] **Village Jeunes** : clone Git **possible** sous conditions client — voir décisions verrouillées ; pas de dump repo dans le portfolio
- [ ] Pipeline assets : `src/assets/projects/<slug>/` + convention covers
- [ ] Valider picks à copier (inventaire) + démarrer MicroMonde listing
- [x] Fiches réflexives : source `../Fiche réflexive/` — **PDF** pour Storage (DOCX source OK)

#### P1 — Fiches à fort impact *(4–8 oct)* — deadline **8 oct**
- [x] `visualcom` — stage + mockup dual + galerie desktop homogène ; récit long OK
- [x] `magicallab` — brief `docs/content/projects/magicallab.md` ; portail/robot GLB ; pas de fiche réflexion
- [ ] `micromonde` — **créer** carte + page (captures **plus tard**, sur place)
- [ ] `hyperloop` — assets marketing branchés ; captures UI live à compléter

#### P2 — Fiches restantes *(9–12 oct)* — deadline **12 oct**
- [ ] `back-springboot` — screenshots localhost + HELP → copy HTML
- [ ] `pacific-dataviz` — récupérer visuels (legacy / ailleurs) + texte
- [ ] `borne-2bealive` — visuels + récit fusion conception / habillage
- [ ] `village-jeunes` — captures **semaine prochaine** (clone curaté client prod) + copy depuis fiches DOCX

#### P3 — Cohérence listing / accueil *(13 oct)* — deadline **13 oct**
- [ ] Covers réelles sur `projects.html` + carousel accueil (incl. MicroMonde)
- [ ] Pass QA mobile des fiches (liens, mockups, textes FR)
- [ ] Filtre domaines : garder simple ou masquer si bruit (décision rapide)

---

### Pilier 2 — Accès enseignants (14 → 20 oct) — **décision A, 2026-10-06**

Les fiches partent du portfolio après le jury : **pas de Supabase**, pas de comptes. Mot de passe Netlify sur un **second site** (le portfolio public reste ouvert). Détail : `docs/SECURITY.md` §0 et §7, spec `docs/content/teacher-site.md`.

**Definition of Done :** un enseignant ouvre l’URL privée, saisit le mot de passe Netlify, lit les PDF. Le mot de passe n’est ni dans Git ni dans le HTML public. Le site public se charge sans mot de passe.

- [x] Décision écrite (ce fichier + `SECURITY.md`)
- [ ] Site Netlify **séparé** (PDFs seulement) + Password protection dans le dashboard
- [ ] PDFs uploadés **là**, pas dans `public/` de ce repo
- [ ] Mot de passe long communiqué aux enseignants hors du repo
- [ ] Lien public discret vers cette URL (sans le mot de passe) sur les fiches qui ont une réflexion — MagicalLab : aucun
- [ ] Après le jury : supprimer le site privé ou changer le mot de passe

- [x] Code Supabase / auth / `evaluator.html` supprimé du repo (2026-10-21) — test C9 garde-fou.

---

### Pilier 3 — Déploiement & tests (21 → 27 oct)

**Definition of Done :** URL prod HTTPS, build OK, contact OK, CSP/headers OK, site enseignants (mot de passe Netlify) OK, smoke test mobile + desktop documenté.

#### C0 — Premier déploiement *(21–22 oct)* — deadline **22 oct**
- [ ] Netlify branché (build `npm run build`, publish `dist`) — site **public**, sans mot de passe
- [x] Aucune variable d’env requise (plus de Supabase)
- [ ] `_headers` / `_redirects` en prod
- [ ] **1er deploy** (preview puis prod) + journal d’erreurs

#### C1 — Tests avant / après *(23–24 oct)* — deadline **24 oct**
- [ ] `npm run build` local vert
- [ ] Parcours public : accueil → projets → 2 fiches → CV → contact
- [ ] Formulaire Netlify Forms
- [ ] Iframes / mockups (Visualcom, MagicalLab) + fallback
- [ ] Site enseignants : mot de passe Netlify OK (URL privée, portfolio public toujours ouvert)
- [ ] Mobile : MicroMonde CTA + listing
- [ ] Hero 3D : charge + fallback `prefers-reduced-motion`

#### C2 — Buffer & freeze *(25–27 oct)*
- [ ] **25–26 oct** — correctifs bloquants uniquement
- [ ] **27 oct** — freeze contenu + smoke test final + lien de livraison prêt
- [ ] **28 oct** — livraison

---

### Hors chemin critique *(buffer ou post-27/10)*

- Phase D étendue (CV/contact DA, GSAP, texture marbre)
- Affinage éclairage hero / Tweakpane
- Formax, print legacy
- MFA / multi-comptes avancés

---

### Source matérielle projets *(hors repo)*

`../Liste des projets/` — détail picks : [`docs/content/projects-source-inventory.md`](./content/projects-source-inventory.md)

| Dossier source | Slug | Notes |
|----------------|------|-------|
| `Refonte Visualcom + MCP WordPress` | `visualcom` | Site live `visualcom.nc` |
| `Village Jeunes` | `village-jeunes` | Dossier liste **vide** ; clone Git client **curaté** + fiches dans `../Fiche réflexive/` |
| `Projet MagicalLab` | `magicallab` | https://magicallab.netlify.app/ |
| `Projet HyperLoop` | `hyperloop` | PDF + assets `public/` |
| `JAVA (SpringBoot)` | `back-springboot` | Screenshots à faire |
| `Projet Micro-monde` | `micromonde` | **Dans catalogue livraison** — https://micromonde-ar.netlify.app/ |
| `Projet SAE` | — | Vide |

**Règle :** pas d’import de builds complets — uniquement picks → `src/assets/projects/<slug>/`.

---

## Comment reprendre (5 min)

1. Lire le **sprint ★** — ignorer D/GSAP tant que P/B/C ne sont pas verts.
2. `npm install` puis `npm run dev` → `/pages/index.html`.
3. Prochaine case **non cochée** du pilier en cours.
4. Ne pas casser le hero 3D ; ne pas importer le legacy tel quel.

```bash
npm install
npm run dev
npm run build
```

| Route | Fichier |
|-------|---------|
| Accueil | `/pages/index.html` |
| Projets | `/pages/projects.html` |
| CV | `/pages/cv.html` |
| Contact | `/pages/contact.html` |

---

## Priorités (non négociables)

1. **Livraison 28 oct** — 3 piliers avant tout polish.
2. **Architecture** — Vite MPA (`docs/ARCHITECTURE.md`).
3. **Catalogue numérique court** — pas de print.
4. **Décisions prises** — hero 3D, nav, typo Ubuntu + Updock, logo SVG.
5. **Sécurité** — RLS + Storage privés (`docs/SECURITY.md`).

---

## Catalogue projets *(livraison octobre)*

| Slug | Titre | Priorité contenu | Statut fiche |
|------|-------|------------------|--------------|
| `visualcom` | Refonte VisualCom | P1 | Avancée — finir galerie |
| `magicallab` | MagicalLab | P1 | Placeholder + iframe live |
| `micromonde` | MicroMonde AR | P1 | **À créer** (validé livraison) |
| `hyperloop` | HyperLoop | P1 | Placeholder |
| `back-springboot` | Projet Back | P2 | Placeholder |
| `pacific-dataviz` | Pacific Dataviz | P2 | Placeholder |
| `borne-2bealive` | Borne 2BeAlive | P2 | Placeholder |
| `village-jeunes` | Vill’âge Jeunes | P2 | Placeholder ; **client en prod** — clone prudent |

### Démos live

| Projet | URL | Intégration |
|--------|-----|-------------|
| MagicalLab | https://magicallab.netlify.app/ | Lien + iframe mockup |
| MicroMonde AR | https://micromonde-ar.netlify.app/ | CTA mobile + captures (pas d’iframe) |
| Visualcom | https://visualcom.nc/ | Mockup shots |

### Hors scope octobre

| Projet | Décision |
|--------|----------|
| **Formax** | Après livraison |
| Print / legacy | Hors liste |

### DoD fiche (rappel)

- Texte dans le HTML (SEO), galerie réelle, CTA live si pertinent
- Emplacement fiche réflexive (`data-project-slug`) branché en pilier B
- Pas d’`innerHTML` avec contenu user/API

---

## DA figée (référence — hors chemin critique)

| Élément | Intention |
|---------|-----------|
| **Marbre / antique / splash** | Fil rouge déjà amorcé sur accueil + compétences |
| **Motion GSAP** | **Différé** post-27/10 |
| **Hero 3D** | Ne pas casser ; affinage éclairage différé |

Navigation publique, compétences (ordre), moodboard : inchangés — voir historique ci-dessous si besoin.

### Compétences (ordre figé)

1. Dispositifs interactifs  
2. Développement web  
3. Webdesign & UI/UX  
4. Design produit  
5. Création 3D  
6. Animation 2D/3D  

Taxonomie : `src/data/skills.ts`.

---

## Déjà en place (V1)

| Zone | Détail |
|------|--------|
| Archi + sécurité | Docs prêts ; site statique sans backend |
| Hero 3D + brush accueil | Livrés |
| Typo / logo / pages publiques | OK |
| Fiches HTML squelette | 7 routes ; contenu à remplir (pilier P) |

---

## Phases détaillées (référence / historique)

Les checklists ci-dessous restent utiles ; **l’ordre d’exécution = sprint ★**.

### Phase U — UX *(largement fait)*

- [x] Message creative developer, parcours accueil, carousel, gabarit fiche
- [ ] Filtre domaines — trancher en P3 (13 oct)
- [ ] Copy En bref + vraies covers — **absorbé par pilier P**

### Phase P — détail technique

- [x] Cartes catalogue + liens MPA
- [x] Squelettes `pages/projects/*.html` + Visualcom texte
- [ ] Contenu + médias = **pilier 1**
- [ ] Liens réflexifs = **pilier 2 / B2**

### Phase B — détail technique

Voir **pilier 2** (site enseignants séparé, aucun code dans ce repo).

### Phase C — détail technique

Voir **pilier 3**.

### Phase D / A / E — différé

- DA CV/contact, GSAP, texture marbre, a11y/SEO fin, affinage spots hero → **après 27/10** ou buffer non bloquant
- Hero 3D core : **livré** (ne pas rouvrir sauf bug prod)

Détail technique Three.js / dépendances : inchangé dans l’historique git / conversations ; ne pas relancer Phase E avant livraison.

---

## Règle médias

| Contenu | Où |
|---------|-----|
| Public | `src/assets/` (préféré) |
| Logo / favicon | `public/` |
| Privé (fiches réflexives) | Site enseignants Netlify (mot de passe) — hors repo |
| Sources lourdes (PSD, .blend, références) | `../Sources/` — hors repo |

---

## Décisions verrouillées *(2026-10-02)*

| # | Décision | Détail |
|---|----------|--------|
| 1 | **MicroMonde** dans livraison | Oui — carte + page `micromonde` (CTA mobile, pas d’iframe) |
| 2 | **Village Jeunes** | Clone Git possible **avec précaution** : projet **entreprise / client en production**. Montrer uniquement UI / stack / récit curaté ; pas de secrets, pas de données client, pas de dump repo dans le portfolio. Sources narratives aussi dans `../Fiche réflexive/`. |
| 3 | **Comptes enseignants** | Email + mot de passe créés côté Auth ; credentials communiqués hors bande. Pas bloquant pour B0. |
| 4 | **Fiches réflexives** | Source : `../Fiche réflexive/` (sibling). Inventaire : [`docs/content/reflective-sheets-inventory.md`](./content/reflective-sheets-inventory.md). **Convertir en PDF** pour upload Storage (aperçu navigateur + signed URLs plus simples). DOCX restent la source éditable. |

Décisions différables : intensité splashs, GSAP, « Mon univers » page dédiée.
