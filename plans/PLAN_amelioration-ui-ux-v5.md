# Plan d'amélioration UI/UX et parcours ETP — v5

**Date :** 3 juillet 2026  
**Périmètre :** rendu desktop exclusivement, viewport de référence 1440 × 900  
**Base de travail :** audit visuel et fonctionnel Playwright des 7 modules  
**Objectif :** rendre le support plus lisible, plus attrayant et plus cohérent en séance, sans imposer un parcours linéaire ni stocker de données patient.

## 1. Synthèse de l'audit

Le socle est fonctionnel : les sept modules sont accessibles, les interactions principales répondent, les contenus provisoires ont été retirés et aucune erreur applicative n'a été observée. La palette, les contrôles et le ton éditorial sont cohérents avec un support d'ETP rassurant.

Les principaux écarts restants sont :

- absence de fil conducteur facultatif entre les modules ;
- absence de synthèse de fin de séance ;
- perte silencieuse de l'état lorsqu'un module est quitté ;
- grammaires d'interaction trop différentes d'un écran à l'autre ;
- hiérarchie visuelle et occupation de l'espace inégales ;
- plusieurs visualisations encore chargées ou difficiles à commenter à distance.

## 2. Principes directeurs

1. **Conserver la navigation non linéaire.** Le soignant doit rester libre de choisir le module pertinent.
2. **Ajouter du guidage sans imposer.** Une suite recommandée doit rester facultative.
3. **Uniformiser la structure pédagogique.** Chaque module suit : objectif → action → feedback → message à retenir → suite possible.
4. **Privilégier la lecture partagée.** Les informations centrales doivent être lisibles à distance sur un écran desktop.
5. **Ne pas simuler une prescription.** Les écrans cliniques doivent clairement rester des supports d'échange.
6. **Maintenir les alternatives clavier.** Aucun glisser-déposer ne doit être obligatoire.
7. **Ne stocker aucune donnée patient.** Toute synthèse éventuelle reste locale, éphémère et explicitement déclenchée.

## 3. Ordre d'exécution recommandé

### Vague 1 — Corriger les défauts de lecture

Ces changements sont prioritaires parce qu'ils affectent la compréhension immédiate des messages pédagogiques.

#### B1 — Addiction : stabiliser le diagramme actif

**Problème :** l'agrandissement d'un cercle provoque des chevauchements entre les trois titres, les libellés et le message central.

**Actions :**

- conserver une géométrie fixe pour les trois cercles ;
- signaler la sélection par contour, opacité et léger changement d'échelle, sans déplacer les autres dimensions ;
- placer les symptômes dans une zone latérale ou sous le diagramme plutôt qu'autour du cercle ;
- réduire les répétitions entre le diagramme, la légende et le bloc de stratégies.

**Critères d'acceptation :**

- aucun texte ne se chevauche dans les quatre états : initial, Physique, Psychologique et Comportementale ;
- le message « Ces dimensions s'alimentent entre elles » reste lisible ;
- l'action et le résultat restent visibles dans le premier écran à 1440 × 900 ;
- le lien vers un autre module reste accessible au clavier.

#### B2 — Soulagement : sécuriser les annotations du graphique

**Problème :** les annotations proches du début de la courbe sont petites et peuvent être coupées à gauche.

**Actions :**

- ajouter une marge interne au graphique ;
- ancrer les libellés dans les limites du SVG ;
- renforcer la différence visuelle entre nicotine et tension liée au manque ;
- limiter l'explication à deux repères numérotés correspondant à la consigne.

**Critères d'acceptation :**

- aucun libellé ne sort du graphique ;
- la chute puis la remontée sont compréhensibles sans lire le paragraphe final ;
- la comparaison avec le non-fumeur reste visible et réversible ;
- la réinitialisation restaure complètement l'état initial.

#### B3 — Motivation : rendre les cartes et le tableau réellement exploitables

**Problème :** les titres longs sont tronqués et le tableau occupe une grande surface vide.

**Actions :**

- autoriser les cartes à passer sur deux lignes ;
- adapter leur largeur au contenu dans des bornes raisonnables ;
- réduire la hauteur initiale du tableau et l'augmenter selon le nombre de cartes ;
- afficher un état vide explicite : « Glissez ici les raisons qui comptent pour vous » ;
- ajouter une petite synthèse du nombre de raisons placées.

**Critères d'acceptation :**

- les six raisons prédéfinies sont lisibles en entier ;
- le tableau vide explique l'action attendue ;
- placer, déplacer et retirer une carte fonctionne à la souris et au clavier ;
- aucune carte ne peut sortir visuellement du tableau.

#### B4 — Nicotine : clarifier la temporalité de la frise

**Problème :** les prises ajoutées au clic se concentrent au début et leurs pictogrammes deviennent difficiles à distinguer.

**Actions :**

- ajouter des repères temporels simples sur l'axe ;
- espacer automatiquement les ajouts effectués au clic ;
- afficher une infobulle ou une étiquette courte au survol et au focus ;
- regrouper la liste des prises sous la frise avec heure relative et action de suppression ;
- clarifier que « Pic atteint » correspond au maximum simulé et non à l'état instantané.

**Critères d'acceptation :**

- quatre prises successives restent identifiables ;
- chaque prise peut être retirée depuis la frise ou la liste ;
- le glisser-déposer modifie réellement la position temporelle ;
- le fallback clic et clavier reste fonctionnel.

### Vague 2 — Harmoniser l'expérience des modules

#### B5 — Créer une structure pédagogique commune

**Actions :**

- ajouter en tête de chaque module une phrase d'objectif et une consigne d'action ;
- afficher un bloc « À retenir » commun après le feedback principal ;
- ajouter une zone « Pour continuer » lorsqu'une suite pertinente existe ;
- harmoniser la terminologie des actions : explorer, essayer, comparer, recommencer.

**Critères d'acceptation :**

- chaque module répond visuellement aux cinq étapes : objectif, action, feedback, message, suite ;
- les consignes tiennent sur deux lignes maximum ;
- les blocs communs utilisent les mêmes composants et espacements.

#### B6 — Accueil : mieux équilibrer les familles

**Problème :** le regroupement est pertinent, mais les rangées incomplètes créent de grands espaces vides.

**Actions :**

- utiliser une grille adaptée au nombre de cartes de chaque famille ;
- donner à « Se motiver » un traitement transversal assumé ;
- ajouter une information courte de type d'activité : comprendre, manipuler ou réfléchir ;
- conserver les résumés mais les raccourcir à une phrase immédiatement lisible.

**Critères d'acceptation :**

- aucune famille ne semble inachevée ;
- les sept cartes restent visibles dans une page desktop sans surcharge ;
- le choix du module est compréhensible sans connaissance préalable du programme.

#### B7 — Substituts : distinguer exploration et décision clinique

**Actions :**

- afficher un encadré indiquant que la titration est un support de discussion ;
- séparer visuellement les fiches de formes et le simulateur de dose ;
- expliquer directement pourquoi le bouton `+ ¼` est désactivé ;
- maintenir les conditions « envie persistante » et « absence de surdosage » visibles près du contrôle ;
- aligner les sept formes sur une grille stable, sans bouton isolé.

**Critères d'acceptation :**

- les sept formes ont une place visuellement équivalente ;
- un contrôle désactivé expose sa raison ;
- l'interface ne peut pas être interprétée comme une prescription automatique ;
- toutes les fiches conservent leurs contenus validés.

#### B8 — Craving : préserver la lecture de la vague

**Actions :**

- déplacer les détails des outils sous ou à côté du graphique ;
- conserver la courbe visible lorsque plusieurs outils sont activés ;
- renommer l'avance rapide en « Voir la fin de la vague » ;
- distinguer clairement démonstration accélérée et exercice en temps réel ;
- proposer « Rejouer » comme action principale après la fin.

**Critères d'acceptation :**

- l'activation des quatre outils ne masque jamais le pic ni le marqueur ;
- « C'est passé » n'apparaît qu'à la fin réelle ou simulée ;
- la respiration et la prise d'eau restent utilisables indépendamment du minuteur.

#### B9 — Nicotine ≠ toxique : maintenir les deux messages simultanément

**Actions :**

- réduire l'atténuation du concept non sélectionné ;
- maintenir visibles les deux formulations : « rend malade » et « crée la dépendance » ;
- simplifier les lignes et cartouches autour de la cigarette ;
- conserver les filtres comme aide à la focalisation, pas comme changement de vérité.

**Critères d'acceptation :**

- aucun état ne donne l'impression que la nicotine est sans enjeu ;
- les quatre familles toxiques et la dépendance restent identifiables ;
- le détail ouvert ne masque pas le message « À retenir ».

### Vague 3 — Améliorer le parcours de séance

#### B10 — Ajouter une progression facultative

**Parcours suggéré :**

1. Composantes de l'addiction ;
2. Nicotine ≠ toxique ;
3. Piège du soulagement ;
4. Nicotine : cinétique et seuils ;
5. Substituts et titration ;
6. Craving ;
7. Motivation.

**Actions :**

- ajouter « Étape suivante suggérée » dans la coquille de module ;
- permettre de retourner à l'accueil à tout moment ;
- ne jamais bloquer l'accès direct à un module ;
- différencier visuellement « suite suggérée » et « autres explorations ».

**Critères d'acceptation :**

- le parcours conseillé est compréhensible mais jamais obligatoire ;
- le bouton Retour conserve son comportement actuel ;
- les navigations inter-modules conservent un historique cohérent.

#### B11 — Gérer explicitement la perte d'état

**Décision recommandée :** conserver l'état des modules uniquement pendant la séance courante en mémoire, sans persistance après rechargement.

**Actions :**

- remonter les états utiles au niveau de la session applicative ou conserver les composants visités ;
- ajouter « Recommencer le module » dans chaque écran ;
- réinitialiser toute la séance uniquement depuis une action explicite sur l'accueil ;
- ne rien écrire dans le stockage navigateur.

**Critères d'acceptation :**

- quitter puis rouvrir un module restaure son état pendant la session ;
- recharger la page efface la session ;
- une réinitialisation explicite demande confirmation si elle efface plusieurs modules.

#### B12 — Ajouter une synthèse éphémère de séance

**Actions :**

- proposer depuis l'accueil une vue « Ce que nous avons exploré » ;
- lister uniquement les modules visités et quelques résultats non sensibles ;
- permettre l'impression ou la copie uniquement sur action explicite ;
- afficher clairement que la synthèse n'est pas enregistrée.

**Critères d'acceptation :**

- aucune donnée ne persiste après rechargement ;
- la synthèse reste utile sans reproduire de données médicales personnelles ;
- son absence ne bloque jamais l'utilisation libre des modules.

## 4. Polissage visuel transversal

À réaliser après les vagues fonctionnelles pour éviter de polir des composants appelés à changer.

- renforcer la hiérarchie entre titre, consigne, interaction et message final ;
- limiter la largeur des paragraphes à une mesure confortable ;
- unifier ombres, bordures, rayons et états sélectionnés ;
- réduire les variations de styles de boutons ;
- utiliser les couleurs sémantiques existantes sans en ajouter inutilement ;
- vérifier que les textes secondaires restent lisibles à distance ;
- harmoniser les hauteurs des cartes et les espacements verticaux ;
- rendre les transitions d'état sobres et compatibles avec `prefers-reduced-motion`.

## 5. Validation requise

### Validation automatisée

- `npm run build` ;
- `npm test` ;
- audit Playwright à 1440 × 900 ;
- ouverture et retour des sept modules ;
- une interaction principale et une réinitialisation par module ;
- absence d'erreur console et d'overlay Vite ;
- absence de débordement horizontal ;
- contrôle des états actifs, désactivés et masqués ;
- vérification des alternatives clavier pour les glisser-déposer.

### Validation visuelle

- capture de l'accueil et de chaque module dans son état initial ;
- capture des états actifs présentant les risques de chevauchement ;
- contrôle du premier écran avant défilement ;
- contrôle à 1366 × 768 en complément du viewport de référence ;
- contrôle à zoom navigateur 125 % et 150 %.

### Validation humaine

- séance simulée avec un soignant ;
- observation de la compréhension des consignes sans explication préalable ;
- validation médicale des formulations liées aux substituts et à la nicotine ;
- vérification que le parcours suggéré reste compatible avec un usage non linéaire.

## 6. Découpage proposé

| Vague | Tâches | Risque | Résultat attendu |
|---|---|---|---|
| 1 | B1 à B4 | Moyen | Visualisations immédiatement lisibles |
| 2 | B5 à B9 | Moyen à élevé | Expérience homogène et messages mieux hiérarchisés |
| 3 | B10 à B12 | Élevé | Parcours de séance cohérent et état maîtrisé |
| 4 | Polissage transversal | Faible | Finition visuelle cohérente |

Ordre recommandé : **B1 → B2 → B3 → B4 → B5 → B6 → B7 → B8 → B9 → B10 → B11 → B12 → polissage → validation finale**.

## 7. Définition de terminé

L'amélioration est considérée terminée lorsque :

- les douze critères de tâches sont validés ;
- les sept modules suivent la structure pédagogique commune ;
- aucune visualisation ne présente de chevauchement ou de texte tronqué ;
- la navigation libre et le parcours suggéré coexistent sans ambiguïté ;
- l'état de séance et sa réinitialisation sont explicites ;
- les tests, le build et l'audit Playwright desktop passent ;
- les contenus cliniques modifiés ont reçu une validation humaine.
