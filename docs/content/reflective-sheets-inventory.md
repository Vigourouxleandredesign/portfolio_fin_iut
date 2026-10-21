# Inventaire — fiches réflexives

**Statut :** reachable (vérifié 2026-10-02)  
**Chemin source (hors repo) :** `../Fiche réflexive/`  
**Format livré :** **PDF** (export depuis DOCX — aperçu navigateur natif). Les DOCX restent la source éditable.

**Mise en page (2026-10-02) :** fiches *mission* Visualcom + Village Jeunes — A4, marges 2,5 cm ; corps Calibri 11 **justifié** ; titres de partie Bold 14 bleu académique + filet ; sous-labels `:` Bold 11.5 ardoise. PDF exportés à côté des DOCX. Backups `*_backup.docx` conservés.

Ne **jamais** committer ces fichiers dans le portfolio public (`public/`, `src/assets/`). Destination : le **site enseignants** (Netlify séparé, mot de passe serveur) — voir `docs/content/teacher-site.md` et `docs/SECURITY.md` §0.

**⚠ À corriger avant export :** la fiche *mission Visualcom* contient un copier-coller de la fiche Vill’âge Jeunes (« staff et adhérents ») — relire et corriger.

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
teacher-site/            # dossier HORS de ce repo
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
3. Copier dans `teacher-site/fiches/<slug>/` (jamais dans ce repo).
4. Redéployer le site enseignants (Netlify drag-and-drop ou CLI) — protégé par mot de passe.
5. Page projet publique : aucun lien direct vers un PDF ; un seul lien « Espace jury » (footer/CV) vers le site enseignants.
