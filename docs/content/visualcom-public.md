# Visualcom — texte public (case study)

**Statut :** brouillon v1 — corrections syntaxiques uniquement ; relecture auteur à venir.  
**Usage :** source de vérité texte ; intégré dans `pages/projects/visualcom.html` (garder les deux en sync lors des relectures).  
**Site :** https://visualcom.nc/

---

## Fiche de réflexion – UX/UI et Développement Front

### Problématique

Comment moderniser, adapter et rendre accessible un CMS à l’ère de l’Intelligence Artificielle, tout en conservant au maximum la sécurité et la fiabilité de l’outil ?

### Contexte et client final

L’équipe souhaitait moderniser entièrement le site de l’entreprise et pouvoir tous participer à son évolution. Ils souhaitaient également pouvoir le faire à l’aide de l’interface de Claude Desktop (l’abonnement Claude de l’entreprise). J’aurais donc 1 semaine pour mettre en place le nouveau site Visualcom sur lequel je pourrais travailler en dev (serveur dupliqué sur lequel on a redirigé le domaine par la suite).

### Process mis en place

Au travers d’une réunion, j’ai pu rassembler les demandes et souhaits de toute l’équipe en leur montrant des exemples de sites d’entreprises plus ou moins dans le même secteur d’activité afin d’avoir un plan de refonte plus net. J’ai même pu composer avec une maquette Claude faite par un de mes collaborateurs et validée en partie par l’équipe.

Le défi consistait principalement en deux choses :

- Conserver la base de données et le CMS WordPress actuel avec la centaine d’actualités déjà publiées, à moderniser. Mais aussi créer le contenu et les pages en fonction de ce sur quoi l’équipe s’était mise plus ou moins d’accord.
- Rendre accessibles à des non-développeurs et non habitués de WordPress des fonctionnalités WordPress. La réflexion que j’ai faite a été en deux temps. Pour moi, il fallait que quelqu’un de formé WordPress (3 personnes dans l’équipe) puisse intervenir si l’IA ne produisait pas correctement, mais il fallait que les non-initiés et initiés puissent utiliser Claude pour accélérer la création d’articles WordPress.

### Solution

La solution a donc été plurielle. Tout d’abord, le thème WordPress que l’on avait au départ était Astra : c’est un bon thème, le plus utilisé et solide, mais beaucoup trop générique et contraignant sur les demandes de l’équipe. En effet, il m’aurait fallu créer trop de blocs sur un thème enfant ou en snippet PHP, ce qui n’était pas adapté au besoin. J’ai donc opté pour le thème custom, qui nous oblige, à nous, à le mettre à jour si besoin de modification ou de faille, mais qui nous permettait une plus grande liberté, surtout pour les risques d’incompatibilité pour les autres solutions à suivre.

Pour nous permettre de mettre facilement et rapidement à jour le thème WordPress, j’ai dû mettre en place un plugin PHP WordPress qui permet manuellement, en un clic, de mettre à jour le thème WordPress en fonction de la dernière version présente sur la branche main du repo GitHub du thème custom.

Pour les articles comme les pages, le choix du thème custom n’est pas anodin, puisqu’il m’a permis de créer les blocs métier adaptés et modifiables, ce qui permettait à l’équipe à l’aise avec WordPress de pouvoir naviguer et modifier rapidement et facilement le site en cas de besoin.

Viennent maintenant les solutions les plus complexes, c’est-à-dire la tentative de plugin MCP, créé pour connecter le site WordPress au Claude de l’entreprise à travers un compte en éditeur uniquement pour pouvoir suivre systématiquement les modifications, et lui restreindre les accès dont lui ou les collègues non qualifiés n’ont pas besoin. L’objectif était de cadrer le tout pour éviter que l’équipe ou l’IA puisse faire de trop grosses erreurs sur un site en production (même si ce site est sauvegardé tous les jours).

Pour ce plugin, j’ai tenté plusieurs approches. La première, c’est par le MCP proposé directement par Claude, mais celui-ci demandait de se connecter avec un compte WordPress (pas un compte uniquement créé pour le site) et ce compte avait les droits super-admin. J’ai donc tenté une autre approche, celle d’utiliser un plugin WordPress prévu à cet effet. Toutefois, le plugin semblait très jeune (peu d’étoiles même s’il était mis en avant par WordPress) et donnait à l’agent beaucoup trop de droits, comme des droits de suppression ; j’ai donc décidé d’écarter cette possibilité. Enfin, puisque toute l’équipe est en Claude Desktop et peut accéder au serveur WordPress via HTTP avec une clé liée au compte éditeur, j’ai tenté cette approche ; malheureusement, par manque de temps, je n’ai pas pu aller au bout de mes tests.
