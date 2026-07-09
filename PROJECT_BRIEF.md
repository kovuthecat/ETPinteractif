# PROJECT_BRIEF.md

## Objectif du projet

Application web interactive servant de **support d'éducation thérapeutique du patient (ETP)** en consultation. Le soignant et le patient explorent ensemble, sur un même écran/tablette, des modules visuels et interactifs (et non un diaporama linéaire). Premier thème traité : le **sevrage tabagique**. L'outil est conçu pour être **multi-thèmes** à terme (le sevrage tabagique est le premier socle).

## Usage prévu

- Usage personnel : oui (outil professionnel du soignant)
- Usage local : oui (fonctionnement hors-ligne souhaité, poste/tablette de consultation)
- Déploiement prévu : oui (web statique, ex. Vercel) — mais doit aussi tourner en local
- Utilisateurs autres que moi : oui, indirectement (les patients regardent, le soignant pilote ; potentiellement d'autres soignants)

## Fonctionnalités MVP

1. Une **carte/menu central** de modules thématiques sur le sevrage tabagique, navigable librement et dans n'importe quel ordre (non-linéaire).
2. Plusieurs **modules interactifs visuels** (schémas, animations légères, illustrations cliquables) plutôt que du texte à lire — le soignant commente, l'écran illustre.
3. Au moins un **module avec interaction de saisie éphémère** (ex. calculateur d'économies, balance décisionnelle) dont le résultat s'affiche à l'écran mais **n'est jamais persisté**.

## Hors périmètre v1

- Tout stockage de données patient (aucune persistance, aucune base, aucun compte).
- Contenu clinique du 2e thème (diabète) : le moteur multi-thèmes et le scaffold `src/features/diabete/`
  existent depuis le 2026-07-08 (cf. `DECISIONS.md`), mais le cadrage du contenu (modules, interactions,
  sources) reste à faire avec Thibault avant tout développement de module diabète.
- Questionnaire de profilage imposé / parcours auto-adaptatif (navigation = choix libre par centres d'intérêt).
- Authentification, comptes, suivi longitudinal.

## Stack technique

- Frontend : **Vite + React + TypeScript**
- Backend : aucun (local-first, full statique)
- Base de données : aucune (zéro persistance, RGPD-by-design)
- Authentification : aucune
- Hébergement : statique (Vercel ou équivalent) + exécution locale possible
- Autres services : aucun en v1

## Contraintes produit et techniques

- **Aucune donnée patient stockée** : toute interaction est éphémère (réinitialisée à la fermeture/au rechargement).
- Conçu pour un **écran partagé en consultation** : gros visuels, peu de texte, lisible à 1 m, le soignant garde la main.
- Doit fonctionner **hors-ligne** (pas de dépendance réseau au runtime).
- Simplicité prioritaire, faible coût, maintenabilité.
- Contenu médical : doit s'appuyer sur des **références validées** (HAS, Tabac Info Service, recommandations sevrage). À tracer dans les modules.
- Pas de dépendance lourde sans justification ; pas de refactor global sans bénéfice clair.

## Contraintes IA

- Minimiser les coûts Claude Code, tâches courtes et ciblées.
- Architecture **feature-first par module** : chaque module ETP est isolé et modifiable sans charger tout le projet.
- Maintenir `PROJECT_MAP.md` pour localiser vite les modules.
- Conserver un projet lisible rapidement par ChatGPT et Claude Code.

## Priorités

1. Fonctionnel
2. Simple
3. Maintenable
4. Documenté (contenu médical sourcé)
5. Extensible (multi-thèmes) seulement quand nécessaire

## Risques connus

- **Exactitude médicale du contenu** : le contenu doit être validé/sourcé pour éviter toute erreur dans un cadre de soin.
- **Tentation de surcharger** : le risque est de retomber dans un « diaporama riche » ; garder l'interactivité et la sobriété visuelle.
- **Réutilisabilité multi-thèmes** : sous-estimer la généricité du moteur de modules rendrait l'ajout du 2e thème coûteux.
