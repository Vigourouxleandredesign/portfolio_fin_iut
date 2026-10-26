# L11 — Mise en production (mercredi 28/10) et remise au jury

**Responsables :** **Léandre** (Netlify, envoi au jury) + Claude Code **Haiku** (vérifications) + Claude chef de projet (validation finale) · **Durée :** 1 h · **Dépend de :** L10 (au moins parties 1 à 3)

## 1. Vérifications (Haiku)

```bash
URL=https://vigourouxleandre.netlify.app
git switch main && git pull --ff-only && git status --short          # vide ; local = origin
npm run audit:ci                                                      # 0 haute/critique
PLAYWRIGHT_BASE_URL=$URL npm run test:e2e:prod                        # tout vert, jury 401 compris
curl -sI $URL/ | grep -iE "content-security-policy|strict-transport|x-frame-options"
curl -s  $URL/sitemap.xml | grep -c "<loc>"                           # 13
npx lighthouse $URL/ --quiet --chrome-flags="--headless" --only-categories=performance,accessibility,best-practices,seo   # ×3, médiane
```
Plus : dernier run GitHub Actions sur `main` vert (onglet *Actions*, Léandre le confirme si `gh` n'est pas connecté).

## 2. Vérifications humaines (Léandre, 10 min)

- [ ] Sur **ton téléphone** : accueil (buste en image, pas de 3D), un projet, le CV PDF, la page Micro-monde.
- [ ] Sur ordinateur : accueil (buste 3D), MagicalLab, la page 404 (`/nimportequoi`).
- [ ] `/jury` dans une **fenêtre privée** : la boîte de connexion apparaît ; avec ton mot de passe, tout s'ouvre, y compris un PDF ; fermer la fenêtre privée.
- [ ] Partage : coller l'URL d'un projet dans une conversation (Messenger, WhatsApp, LinkedIn…) → l'aperçu avec image s'affiche.

## 3. Geler la production

- Netlify › *Deploys* › le déploiement validé › **Lock to stop auto publishing** : jusqu'au 30/10, un push ne remplace plus la version vue par le jury sans ton accord. Pour publier une mise à jour validée (textes « Ce que j'en retiens ») : *Publish deploy* sur le nouveau déploiement, puis re-verrouiller.

## 4. Remise au jury (au plus tard le 30/10)

- Message 1 (e-mail) : lien du portfolio `https://vigourouxleandre.netlify.app` et de l'espace jury `https://vigourouxleandre.netlify.app/jury`, identifiant `jury`.
- Message 2, **par un autre canal** (SMS, messagerie de l'IUT) : le mot de passe seul.
- Ne jamais envoyer lien + mot de passe dans le même message.

## 5. Après la soutenance (rappel `SECURITY.md` §0)

Changer le mot de passe ou retirer `public/jury/` du site ; garder le dépôt privé.

## Prompt à coller (Haiku, partie 1)

```
Tu es exécutant du lot L11 (vérifications de mise en production) du portfolio de Léandre. Exécute uniquement la partie 1 de docs/work-packages/WP-L11-mise-en-production.md, sans rien modifier dans le dépôt. Ne lis et n'affiche jamais de fichier .env ni de mot de passe ; n'utilise jamais d'identifiants jury. Rapporte chaque résultat face au résultat attendu, la médiane Lighthouse de l'accueil, puis la liste de ce que Léandre doit vérifier lui-même (partie 2).
```
