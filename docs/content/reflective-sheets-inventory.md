# Inventaire — fiches réflexives

**Statut :** reachable (vérifié 2026-10-02)  
**Chemin source (hors repo) :** `../Fiche réflexive/`  
**Format livré :** **PDF** (export depuis DOCX — aperçu navigateur natif). Les DOCX restent la source éditable.

**Mise en page (2026-10-02) :** fiches *mission* Visualcom + Village Jeunes — A4, marges 2,5 cm ; corps Calibri 11 **justifié** ; titres de partie Bold 14 bleu académique + filet ; sous-labels `:` Bold 11.5 ardoise. PDF exportés à côté des DOCX. Backups `*_backup.docx` conservés.

Ne **jamais** placer ces fichiers ailleurs (`src/assets/`, autre dossier de `public/`). Destination : la zone **`/jury`** du site (`public/jury/fiches/<slug>/`, protégée par mot de passe Netlify) — voir `docs/content/teacher-site.md` et `docs/SECURITY.md` §0. Seul ce dossier peut contenir des PDF de fiches.

**✓ Copier-coller corrigé par Léandre (2026-10-22)** dans les deux fiches Visualcom (paragraphe « Conception d’interface » réécrit : skill.md pensé comme un front).

**PDF en place (2026-10-22)** dans `public/jury/fiches/` : `visualcom/` et `village-jeunes/`, chacun `project-sheet.pdf` (page d’intro → Solution, **sans** le brouillon entre parenthèses « CF : Fiche de réflexion ( … ) ») + `mission-reflection.pdf`. **Corrections orthographe / syntaxe appliquées le 22/10** (tableaux ci-dessous) dans les `.docx` de `Fiche réflexive/` ; originaux sauvegardés en `… _avant-corrections.docx`. Les PDF Visualcom (×2) et la fiche projet Vill’âge Jeunes ont été régénérés à partir des versions corrigées (LibreOffice) ; `village-jeunes/mission-reflection.pdf` (aucune faute relevée) reste l’export Word d’origine. **Facultatif** : réexporter depuis Word pour un rendu identique à l’original, avec exactement ces noms de fichiers. **Recommandé** : supprimer des fiches projet le brouillon entre parenthèses après « CF : Fiche de réflexion » (non corrigé, exclu des PDF).

### Coquilles à corriger avant l’export final (relecture chef de projet)

**Fiche projet refonte site Visualcom**
| Texte actuel | Correction |
|---|---|
| tout en concervant … un cms | tout en conservant … un CMS |
| pouvoir le faire à l’aide depuis l’interface | pouvoir le faire depuis l’interface |
| J’aurai donc 1 semaine … je pourrais travailler … (server dupliqué | J’avais donc une semaine … je pouvais travailler … (serveur dupliqué |
| un plan de refonte plus nette | un plan de refonte plus net |
| une maquette Claude … validé en parti | une maquette Claude … validée en partie |
| WordPress actuelle avec la centaine d’actualité déjà publié | WordPress actuels avec la centaine d’actualités déjà publiées |
| à des non-développer | à des non-développeurs |
| La réflexion que j’ai faite été en deux temps | La réflexion que j’ai menée s’est faite en deux temps |
| les non-initié et initiés | les non-initiés comme les initiés |
| La solution a donc été pluriel … au départ été Astra … il m’aurait fallut | La solution a donc été plurielle … au départ était Astra … il m’aurait fallu |
| qui nous oblige à nous, le mettre à jour | qui nous oblige à le mettre à jour nous-mêmes |
| le theme WordPress, j’ai du mettre … sur a branch main | le thème WordPress, j’ai dû mettre … sur la branche main |
| les blocs métier adaptés et modifiable | les blocs métier adaptés et modifiables |
| Viens maintenant les solutions les complexes | Viennent maintenant les solutions les plus complexes |
| L’objectif été … sauvegardé tout les jours | L’objectif était … sauvegardé tous les jours |
| celui-ci demandé de se connecter | celui-ci demandait de se connecter |
| peu d’étoile … une clé lié au compte | peu d’étoiles … une clé liée au compte |

**Fiche de réflexion mission Visualcom** (et même paragraphe dans la fiche projet)
| Texte actuel | Correction |
|---|---|
| l’interface a été réfléchi différemment | l’interface a été réfléchie différemment |
| avec les même contraintes | avec les mêmes contraintes |
| les mêmes limitations seront appliqués | les mêmes limitations seront appliquées |
| utilisables et agréable à modifier | utilisables et agréables à modifier |
| un membre de l’équipe former à WordPress | un membre de l’équipe formé à WordPress |

**Fiche projet Vill’âge Jeunes** : partie conservée propre. Supprimer dans le .docx le bloc brouillon « CF : Fiche de réflexion ( … ) » (doublon de la fiche de réflexion) avant l’export final.

---

## Fichiers présents

| Fichier | ~KB | Mapping slug | Rôle |
|---------|-----|--------------|------|
| `Fiche de reflexion mission Refonte Visualcom.docx` | 18 | `visualcom` | Fiche **réflexion mission** |
| `Fiche projet refonte site Visualcom.docx` | 21 | `visualcom` | Fiche **projet** (complément) |
| `Fiche de reflexion mission Village jeunes.docx` | 17 | `village-jeunes` | Fiche **réflexion mission** |
| `Fiche projet Village Jeunes.docx` | 20 | `village-jeunes` | Fiche **projet** (complément) |
| `Brouillon_competences_Leandre.docx` | 32 | — | Transversal compétences (pas un slug) |
| `UNC-Competences-LP-MIAW (1).pdf` | 123 | — | Référentiel UNC / MIAW (contexte) |
| `desktop.ini` | — | — | Ignorer |

---

## Arborescence cible (site enseignants)

```
public/jury/            # zone protégée (Basic-Auth Netlify)
  fiches/
    visualcom/
      mission-reflection.pdf
      project-sheet.pdf
    village-jeunes/
      mission-reflection.pdf
      project-sheet.pdf
    <slug>/
      mission-reflection.pdf   # dès qu’une fiche existe
```

---

## Pas encore de fiche dans ce dossier

| Slug | Action |
|------|--------|
| `magicallab` | À ajouter (DOCX → PDF) |
| `micromonde` | À ajouter |
| `hyperloop` | À ajouter |
| `back-springboot` | À ajouter |
| `pacific-dataviz` | À ajouter |
| `borne-2bealive` | À ajouter |

Le site enseignants démarre avec **Visualcom + Vill’âge Jeunes** ; les autres suivent dès que les DOCX arrivent.

---

## Workflow

1. Rédiger / finaliser en **DOCX** dans `../Fiche réflexive/`.
2. Exporter **PDF** (même contenu, nom kebab-case ci-dessus).
3. Copier dans `public/jury/fiches/<slug>/` (repo GitHub **privé**).
4. Commit + push → Netlify redéploie ; le mot de passe vient de `JURY_BASIC_AUTH`.
5. Page projet publique : aucun lien direct vers un PDF ; un seul lien « Espace jury » (footer/CV) vers `/jury`.
