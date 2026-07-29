# STATUS.md

Photo à l'instant T : ce qui marche, ce qui casse. Mis à jour en fin de session.
Plafond : 80 lignes (appliqué par hook). Historique détaillé : `git log` + `docs/decisions/`.

> **Frontières** — STATUS : état actuel · `TASKS.md` : backlog + tâches · `plans/` : plan d'une
> tâche active · `VALIDATION.md` : jugement humain (N2) en attente.
>
> **Dernière mise à jour :** 2026-07-24

## Phase actuelle

Consolidation multi-thèmes (3 thèmes : tabac, diabète, cardio) — enrichissement du contenu
pédagogique (garde-manger, repas-types) et correctifs issus des audits/revues de production.

## Ce qui fonctionne

- **Thème tabac** : 10/10 modules opérationnels (Composantes, Nicotine, Substituts, Nicotine≠toxique,
  Soulagement, Stratégies & outils, Motivation, Plan d'arrêt, Bénéfices de l'arrêt, Idées reçues).
  14/14 outils interactifs de la boîte à outils câblés (consultation + app patient). Livret A4
  illustré, fiches à emporter (5). Illustrations : couverture quasi complète (42 PNG).
- **Thème diabète** : 10 modules (dont Insuline basale/rapide en système d'expérimentation,
  Alimentation avec défi Proportion à 3 frontières). Module Suivi/Traitements : résiduel de
  débordement zéro-scroll à 1024×768, connu, non bloquant.
- **Thème cardio** : 12/12 modules câblés (pilote M1-M3 validé, fan-out M4-M12 aligné). Gate
  contenu G1 validée (jamais de chiffre LDL/tension à l'écran, aspirine jamais mentionnée, alcool =
  repères SPF qualitatifs).
- **Socle partagé** : moteur multi-thèmes agnostique (aucun id de thème en dur), `SelectionContext`
  (mémoire de session, zéro persistance côté consultation), fiches à emporter génériques, mécanisme
  « repas-types » partagé cardio/diabète (5 presets), garde-manger enrichi (2 thèmes).
- Gate systématique : `npx tsc --noEmit` ✓ · `npm run build` ✓ · `npm test` ✓ **127/127**, aucune
  dépendance runtime ajoutée depuis le scaffold initial.

## Ce qui casse / n'est pas testé

- Débordement zéro-scroll persistant, Suivi et Traitements (diabète) à 1024×768 — breakpoints de
  layout à revoir.
- **G-familles cardio** (pictos par repère, famille Manger) : non tranchée, session bloquée.
- Illustrations en attente de génération par Thibault : 17 aliments garde-manger, 11 VITE/infarctus
  cardio, 6 vrai/faux tabac (prompts prêts, `design/illustrations/prompts-illustrations-diabete.html`).
- **Validation visuelle/UX humaine** (N2) très en retard sur l'ensemble des chantiers récents —
  cf. `VALIDATION.md`.

## Bugs connus

- Occurrences résiduelles du mot « craving » hors périmètre (registry.ts, NicotineModule.tsx,
  PlanArretModule.tsx) — signalées, non bloquantes, non corrigées.
- `InfoHover` (2e niveau de lecture tabac) : composant prêt, non câblé (contenu non encore validé
  par Thibault, `docs/BRIEF_TABAC.md` §3.5).

## Dette technique

- Faible : thème tabac = 10 modules indépendants, logique pure isolée, aucune zone difficile
  identifiée.
- Thème diabète : scaffold modules 5-8 pas encore spécifiés en détail (`docs/diabete/`).
- Toutes les valeurs nutritionnelles/cliniques des contenus récents restent `// à revalider
  (Thibault)` — ordres de grandeur pédagogiques, pas des données validées cliniquement.

## Comment vérifier l'état réel

```bash
npm test
npx tsc --noEmit
npm run build
```
