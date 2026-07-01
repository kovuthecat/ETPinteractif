# Audit UI et parcours utilisateur — desktop

**Date :** 1er juillet 2026  
**Périmètre :** `http://localhost:5173/`, accueil et 7 modules  
**Configuration :** Chromium headless via Playwright 1.61.1, viewport 1440 × 900  
**Angle :** ergonomie, esthétique, cohérence fonctionnelle et adéquation avec l'objectif pédagogique d'un échange soignant–patient.

## Synthèse

L'outil possède une base visuelle solide : palette calme, vocabulaire graphique cohérent, grands contrôles, navigation simple et absence d'erreur console. Les meilleurs modules transforment correctement une notion abstraite en manipulation visible, notamment **Nicotine**, **Nicotine ≠ toxique** et **Craving**.

L'audit ne peut toutefois pas être considéré comme pleinement satisfaisant en l'état. Deux problèmes prioritaires affectent directement le discours pédagogique :

1. **Motivation : les deux panneaux d'onglet restent visibles simultanément.** L'onglet actif change bien sémantiquement, mais le contenu inactif n'est pas masqué. La page atteint 1 688 px de hauteur et mélange deux temps d'entretien censés être séparés.
2. **Substituts : les fiches de bonnes pratiques et d'erreurs affichent « À compléter ».** Le module promet un apprentissage qu'il ne délivre pas et peut donner une impression de prototype au patient.

**Appréciation globale : 6,5/10.** Bonne direction esthétique et interactive, mais une correction fonctionnelle et une complétion éditoriale sont nécessaires avant usage réel en séance.

## Résultats techniques

| Vérification | Résultat |
|---|---|
| Chargement de l'accueil et identité de page | Réussi |
| Ouverture des 7 modules | Réussie |
| Interactions principales et changements d'état | Réussis |
| Erreurs ou avertissements console | Aucun |
| Overlay Vite / page blanche | Aucun |
| Débordement horizontal à 1440 px | Aucun |
| Contrôles principaux sous 44 px | Aucun bouton concerné |
| Cohérence réelle des onglets Motivation | Échec |
| Contenu pédagogique finalisé | Échec dans Substituts |

## Problèmes prioritaires

### P0 — Finaliser le contenu du module Substituts

Après sélection de « Patch (24 h / 16 h) », les deux cartes affichent « À compléter ». Le même contenu provisoire est défini pour les différentes formes. C'est le défaut le plus risqué : l'écran ressemble à une fiche clinique opérationnelle, alors que son contenu central est absent.

**Recommandation :** masquer temporairement la section ou publier des contenus validés et sourcés pour chaque forme. Ajouter une consigne d'usage très courte avant les boutons et faire apparaître clairement la relation entre la forme choisie et les deux cartes de résultat.

### P0 — Corriger le masquage des panneaux Motivation

Au chargement, l'onglet « Où en êtes-vous ? » est actif, mais la section « Mes raisons » est également rendue à l'écran. Après clic sur « Mes raisons », les échelles restent visibles. L'état ARIA change correctement, mais pas l'affichage visuel.

**Impact :** surcharge, hiérarchie trompeuse, entretien moins progressif, scroll inutile et perte de la promesse « à son rythme ».

**Recommandation :** garantir que `[hidden]` impose `display: none`, ou ne rendre que le panneau actif. Vérifier ensuite le clic et la navigation clavier gauche/droite.

### P1 — Rendre l'accueil plus intentionnel

L'accueil est propre et immédiatement compréhensible, avec de grandes cartes entièrement cliquables. Toutefois, les sept modules forment deux rangées de trois puis une carte isolée, ce qui donne à « Explorer ma motivation » un statut visuel accidentel. Les résumés sont utiles au soignant mais assez petits et denses pour une lecture partagée à distance.

**Recommandation :** distinguer visuellement les familles « Comprendre », « Agir » et « Se motiver », ou donner à Motivation une rangée transverse assumée. Raccourcir les résumés et augmenter légèrement leur corps/interligne.

### P1 — Clarifier les affordances communes

Le retour et les sources sont cohérents d'un module à l'autre, mais ils apparaissent surtout comme des icônes discrètes aux extrémités d'un très grand bandeau. Le bouton Sources est particulièrement facile à ignorer alors que le sourçage est essentiel dans ce contexte.

**Recommandation :** conserver la sobriété, mais afficher « Sources » en toutes lettres ou un libellé au survol/focus. Renforcer le focus clavier visible et conserver le titre centré.

## Analyse par écran

### Accueil

**Points forts :** hiérarchie nette, cartes généreuses, icônes homogènes, ton non culpabilisant, entrée non linéaire adaptée au choix partagé.  
**À améliorer :** grille déséquilibrée, faible différenciation entre objectifs pédagogiques, textes secondaires petits, absence d'indication sur la durée ou le type d'activité.

### 1. Composantes de l'addiction

**Points forts :** la métaphore des trois cercles imbriqués soutient très bien le message ; le clic révèle symptômes et stratégies ; les passerelles vers d'autres modules rendent le parcours vivant.  
**À améliorer :** une fois un cercle agrandi, son libellé chevauche visuellement les autres cercles et certaines bulles s'éloignent beaucoup de leur source. L'ensemble devient spectaculaire mais un peu chargé. Remplacer « Touchez » par « Cliquez » dans un usage desktop exclusif. Prévoir une transition ou une légende plus explicite reliant couleur, symptômes et stratégies.Supprimer "nicotinique" du titre de la composante physique

### 2. Nicotine : cinétique & seuils

**Points forts :** excellent bac à sable ; l'état « Manque / Confort / Trop haut » fournit un feedback immédiat ; le graphisme des zones et la remise à zéro sont cohérents. Le passage testé « cigarette + patch » fait évoluer l'état vers « Confort ».  
**À améliorer :** les événements se concentrent très tôt sur l'axe et leurs petits pictogrammes sont difficiles à distinguer. Ajouter une courte consigne (« Ajoutez plusieurs prises et observez… »), une chronologie plus lisible et éventuellement une liste des actions jouées. Le terme « État actuel » désigne en réalité le pic calculé, ce qui peut prêter à confusion.
Remplacer le simple clic sur un item (cigarette par ex) par un drag and drop des items sur le timeline)

### 3. Substituts & titration

**Points forts :** structure en deux temps pertinente ; formes faciles à sélectionner ; métaphore des quarts de patch immédiatement lisible ; alertes jour/nuit bien visibles.  
**À améliorer :** contenu central incomplet (P0). Le contrôle de titration ressemble à une prescription précise alors que l'écran invite à expérimenter : ajouter un cadre d'accompagnement clinique et expliciter les conditions qui activent `+ ¼` ou `− ¼`. Le bouton désactivé gagnerait à expliquer pourquoi il l'est.

### 4. Nicotine ≠ toxique

**Points forts :** message principal très fort et mémorable ; opposition rouge/vert cohérente ; la combustion domine volontairement la scène ; le rappel final reformule sans moraliser. Les liens de poursuite sont utiles.  
**À améliorer :** le mode sélectionné atténue fortement l'autre concept, au risque de faire croire que la nicotine isolée est sans enjeu. Maintenir lisible le rôle de dépendance dans les deux états et ne pas reposer uniquement sur rouge/vert. La scène est dense mais reste maîtrisée sur desktop.

### 5. Piège du soulagement

**Points forts :** le mécanisme cyclique est mis en action plutôt que simplement expliqué ; comparaison au non-fumeur pertinente ; formulation finale claire.  
**À améliorer :** le graphe associe simultanément nicotine, stress et soulagement, ce qui exige une médiation orale. Ajouter une consigne de lecture en deux étapes et faire ressortir visuellement le délai entre chute puis remontée. Le terme « stress » pourrait être qualifié comme tension liée au manque pour éviter une généralisation clinique.

### 6. Craving (4D)

**Points forts :** c'est le parcours le plus directement actionnable ; la vague, l'état temporel et les outils se renforcent mutuellement ; le bouton « Passer 30 s » facilite la démonstration ; feedback d'activation très visible.  
**À améliorer :** après « Passer 30 s », activer « Différer » affiche immédiatement « C'est passé », ce qui réduit l'intérêt de l'outil : encourager l'activation pendant la montée ou au pic. 

### 7. Motivation

**Points forts :** langage bienveillant, relances d'entretien motivationnel pertinentes, double modalité glisser/bouton accessible, possibilité d'ajouter et détailler ses propres raisons.  
**À améliorer :** défaut d'onglet P0. La réserve coupe visuellement certains libellés longs dans les champs. Le tableau blanc est très haut et presque vide avec une seule carte : réduire sa hauteur initiale ou l'adapter au nombre de cartes. 
Les cartes sont etroites et ne permettent pas d'afficher leur titre en entier.
Remplacer "ajouter" et "retirer" par un systeme de drag and drop
Les sliders ont une grande largeur mais une piste visuellement fine ; renforcer la préhension et afficher les bornes 0/10.

## Cohérence esthétique et pédagogique

La palette crème, le bleu d'action, le vert de confort et le rouge de vigilance forment un système stable. Les cartes blanches, bordures douces et icônes linéaires donnent une impression rassurante, adaptée à un sujet potentiellement culpabilisant. Le ton éditorial est globalement respectueux et orienté vers l'autonomie.

La cohérence baisse lorsque les modules inventent chacun leur propre grammaire d'interaction sans phrase d'amorce constante. Une micro-structure commune aiderait : **objectif en une phrase → action attendue → feedback → message à retenir → suite possible**. Les modules Nicotine ≠ toxique et Craving s'en approchent le mieux.

## Plan d'action recommandé

1. **Avant toute démonstration :** corriger les panneaux Motivation et retirer/finaliser tous les « À compléter ».
2. **Itération courte :** améliorer la grille d'accueil, rendre Sources explicite, harmoniser les phrases de consigne et remplacer le vocabulaire tactile par du vocabulaire desktop.
3. **Polissage pédagogique :** ajouter une progression commune, rendre les états désactivés explicables et réduire la densité des visualisations Addiction/Motivation.
4. **Validation finale :** rejouer chaque scénario avec un soignant et un patient, clavier seul inclus, puis vérifier contraste, zoom navigateur 125–150 % et résolution desktop plus compacte (1366 × 768).

## Parcours Playwright exercés

- Accueil → chaque carte → module correspondant.
- Addiction → sélection de la dimension physique → apparition des symptômes et outils.
- Nicotine → ajout d'une cigarette puis d'un patch → passage à l'état Confort.
- Substituts → sélection d'une forme → révélation des bonnes pratiques/erreurs.
- Nicotine ≠ toxique → mise en évidence des toxiques de combustion.
- Soulagement → ajout d'une cigarette → mise à jour du graphe.
- Craving → lancement → avance rapide → activation de Différer.
- Motivation → changement d'onglet → placement d'une raison → ajout d'une raison.

Limites : audit exclusivement desktop, Chromium headless, sans test utilisateur réel ni validation médicale du contenu.
