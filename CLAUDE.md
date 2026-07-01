# CLAUDE.md

Instructions permanentes pour Claude Code (ETP interactif). Seul fichier chargé automatiquement : il pointe vers le reste.

## À lire avant une tâche importante
- `PROJECT_BRIEF.md` (objectif, périmètre, contraintes) · `DECISIONS.md` (décisions structurantes)
- `PROJECT_MAP.md` (localisation des modules) · `docs/contenu-modules.md` (contenu médical)

## Invariants non négociables
1. **Zéro donnée patient stockée** : aucune persistance (localStorage, cookies, base, réseau). Interaction éphémère.
2. **Local-first / hors-ligne** : pas de dépendance réseau au runtime.
3. **Pile runtime figée** : Vite + React + TypeScript, sans backend, **aucune dépendance runtime ajoutée**. *Exception* : devDependencies d'outillage/test (ex. Vitest) si listées dans le plan.
4. **Multi-thèmes par conception** : ne pas coder « en dur » pour le tabac dans le moteur de module générique.
5. **Exactitude médicale** : contenu sourcé (HAS, Tabac Info Service). En cas de doute clinique, signaler plutôt qu'inventer.
6. **Support de consultation** : sobriété, gros éléments lisibles à ~1 m, interactivité (≠ diaporama).

## Méthode
- Modifier le minimum de fichiers ; pas de refactor global sans demande explicite. Feature-first par module (isolé, modifiable sans charger tout le projet).
- Avant de coder : plan court (objectif, fichiers, 3-5 étapes, risques). Garder le style, éviter le cosmétique inutile.

## Validation
- **Auto (bloque le commit)** : `npm run build` + typecheck ; **tests Vitest** pour la logique pure (ex. `src/lib/nicotineCurve.ts`).
- **Visuel / UX (humain, non bloquant)** : lisibilité à ~1 m, sobriété, interactivité. Claude n'évalue PAS le rendu : il consigne une checklist dans `VALIDATION.md` (1 entrée/tâche) que Thibault déroule en `npm run dev`. Jamais de Playwright/navigateur/capture.
- Mode autonome : enchaîner les tâches (gate = Auto), accumuler `VALIDATION.md`, rendre la main en fin de lot.

## Modèles, tâches & plans
- **Opus/ChatGPT** réfléchit (architecture, contenu, arbitrages) ; **Sonnet** exécute les tâches cadrées de complexité moyenne ; **Haiku** le mécanique. Si le scope devient large/ambigu → s'arrêter, résumer, revenir en phase de réflexion.
- Backlog et tâches : `TASKS.md`. Chaque tâche porte `modèle: X, effort: Y` (`minimal·low·medium·high·max`), à vérifier avant de lancer. Plan d'une tâche active : `plans/PLAN_<id>.md`.

## Après modification
1. Mettre à jour `STATUS.md` (état) et `TASKS.md` (statut) ; les autres fichiers de contexte (`DECISIONS`, `PROJECT_MAP`, `ROADMAP`) seulement si leur contenu change.
2. `git status`, commit clair et atomique. Ne pas laisser le repo modifié non documenté.

## Rapport de fin de tâche
Fichiers modifiés · résumé · commandes lancées · à valider visuellement (→ `VALIDATION.md`) · prochaine action.
