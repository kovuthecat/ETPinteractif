# CLAUDE.md

Instructions permanentes pour Claude Code dans ce projet (ETP interactif).

## À lire avant toute tâche importante
- `PROJECT_BRIEF.md` (objectif, périmètre, contraintes)
- `DECISIONS.md` (décisions structurantes)
- `PROJECT_MAP.md` (localisation des modules)
- `docs/contenu-modules.md` (contenu médical des modules)

## Invariants non négociables du projet
1. **Zéro donnée patient stockée** : aucune persistance (pas de localStorage, cookies, base, ni envoi réseau). Toute interaction est éphémère.
2. **Local-first / hors-ligne** : pas de dépendance réseau au runtime.
3. **Stack figée** : Vite + React + TypeScript, sans backend. Ne pas changer sans validation.
4. **Multi-thèmes par conception** : ne pas coder « en dur » pour le tabac dans le moteur de module générique.
5. **Exactitude médicale** : tout contenu médical doit être sourcé (HAS, Tabac Info Service). En cas de doute clinique, signaler plutôt qu'inventer.
6. **Support de consultation** : sobriété visuelle, gros éléments lisibles à distance, interactivité (≠ diaporama).

## Méthode
- Modifier le minimum de fichiers ; pas de refactor global sans demande explicite.
- Architecture feature-first par module : chaque module isolé, modifiable sans charger tout le projet.
- Avant de coder : plan court (objectif, fichiers concernés, 3–5 étapes, risques).
- Conserver le style existant ; éviter les changements cosmétiques inutiles.

## Après chaque modification
1. Mettre à jour les fichiers de contexte pertinents (`STATUS.md`, `TASKS.md`, `DECISIONS.md`, `PROJECT_MAP.md`, `ROADMAP.md` si besoin).
2. `git status`, puis commit clair et atomique. Ne pas laisser le repo modifié non documenté.

## Rapport de fin de tâche
Fichiers modifiés · résumé · commandes lancées · points à vérifier manuellement · prochaine action recommandée.

## Séparation des rôles
ChatGPT/Opus réfléchit (architecture, contenu, arbitrages) ; Claude Code exécute des tâches ciblées.
Si le scope devient large ou ambigu, s'arrêter, résumer, proposer un retour en phase de réflexion.
