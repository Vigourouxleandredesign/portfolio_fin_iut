# L13 : retouches du 26/10 (visuel Lab Horizon, dernières coquilles)

**Exécutant :** Claude Code **Sonnet** (ou Haiku) · **Durée :** 20 min · **Dépend de :** L12 fusionné · **Branche :** `wp/L13-retouches`

## 1. Visuel Lab Horizon (demande de Léandre)

L'arbre moussu de l'application Lab Horizon est bien plus parlant que l'établi de laboratoire. Le chef de projet a recomposé l'image d'origine en pleine résolution, sans l'interface de l'application (fond `hero_biodiversite_ss_arbre.webp` + calque de l'arbre du projet SAE 501) :

| Fichier (déjà dans `src/assets/projects/lab-horizon/`) | Format | Usage |
|---|---|---|
| `lab-horizon-arbre-portrait.webp` | 702×1080 | **Carte portrait du carrousel d'accueil** (remplace `hero-laboratoire.webp`) |
| `lab-horizon-arbre.webp` | 1600×900 | Carte du catalogue (remplace `hero-laboratoire.webp`) |

- `alt` : « Branche d'arbre couverte de mousse, éclairée dans une brume vert d'eau » (ou `alt=""` si l'image est purement décorative dans la carte, selon le balisage actuel du carrousel).
- `width`/`height` exacts. Le hero de la page Lab Horizon et l'image de partage (`public/og/lab-horizon.jpg`) ne changent pas.
- Mettre à jour le test du carrousel s'il fige le nom de l'image.

## 2. Dernières coquilles (relecture du site en ligne)

| Page | Avant | Après |
|---|---|---|
| MagicalLab, « Du brief à l'ambiance » | `manipuler un objet .glb à travers React et Three Fiber` | `manipuler un objet .glb avec React Three Fiber` (nom exact de la bibliothèque) |
| MagicalLab, `alt` | `MagicalLab, bibliothèque et orrery` | `MagicalLab, bibliothèque et planétaire` |
| Visualcom, version longue | `quelqu'un de formé WordPress` | `quelqu'un de formé à WordPress` |
| Visualcom, version longue | `les non-initiés et initiés puissent` | `les non-initiés comme les initiés puissent` |
| Visualcom, version longue | `toute l'équipe est en Claude Desktop` | `toute l'équipe utilise Claude Desktop` |

Ne rien modifier d'autre. Gate + E2E verts, capture 390 et 1440 px du carrousel d'accueil et du catalogue, push autorisé.

## Prompt à coller

```
Tu es exécutant du lot L13 (retouches du 26/10) du portfolio de Léandre. Applique le protocole commun de docs/work-packages/README.md puis docs/work-packages/WP-L13-retouches.md, parties 1 et 2, sans rien modifier d'autre. Les images de la partie 1 sont déjà prêtes. Vérifie le carrousel et le catalogue sur des captures 390 et 1440 px que tu ouvres réellement, puis pousse sur main. Termine par le rapport au format du README (ligne AUDIT comprise).
```
