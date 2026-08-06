# STATUS.md

Photo à l'instant T : ce qui marche, ce qui casse. Mis à jour en fin de session.
Plafond : 80 lignes (appliqué par hook). Historique détaillé : `git log` + `docs/decisions/`.

> **Frontières** — STATUS : état actuel · `TASKS.md` : backlog + tâches · `plans/` : plan d'une
> tâche active · `VALIDATION.md` : jugement humain (N2) en attente.
>
> **Dernière mise à jour :** 2026-08-06

## Phase actuelle

Consolidation multi-thèmes (3 thèmes : tabac, diabète, cardio) — enrichissement du contenu
pédagogique (garde-manger, repas-types) et correctifs issus des audits/revues de production.

## Ce qui fonctionne

- **Thème tabac** : 10/10 modules opérationnels (Composantes, Nicotine, Substituts, Nicotine≠toxique,
  Soulagement, Stratégies & outils, Motivation, Plan d'arrêt, Bénéfices de l'arrêt, Idées reçues).
  14/14 outils interactifs de la boîte à outils câblés (consultation + app patient). Livret A4
  illustré, fiches à emporter (5). Illustrations : couverture complète (48 PNG, dont les 6 vrai/faux
  du 2026-08-06).
- **Thème diabète** : 10 modules (dont Insuline basale/rapide en système d'expérimentation,
  Alimentation avec défi Proportion à 3 frontières). Garde-manger : 33 aliments illustrés (21 neufs
  déposés 2026-08-06). Module Suivi/Traitements : résiduel de débordement zéro-scroll à 1024×768,
  connu, non bloquant.
- **Thème cardio** : 12/12 modules câblés (pilote M1-M3 validé, fan-out M4-M12 aligné). Module Alerte
  (M10) et garde-manger (M8) : illustrations complètes depuis le 2026-08-06 (plus de placeholder).
  Familles (M8, onglet Familles) : 10 repères avec icône Lucide distincte chacun (G-familles tranchée
  2026-08-06, remplace la flamme unique). Gate contenu G1 validée (jamais de chiffre LDL/tension à
  l'écran, aspirine jamais mentionnée, alcool = repères SPF qualitatifs).
- **Socle partagé** : moteur multi-thèmes agnostique (aucun id de thème en dur), `SelectionContext`
  (mémoire de session, zéro persistance côté consultation), fiches à emporter génériques, mécanisme
  « repas-types » partagé cardio/diabète (5 presets), garde-manger enrichi (2 thèmes).
- Gate systématique : `npx tsc --noEmit` ✓ · `npm run build` ✓ · `npm test` ✓ **127/127**, aucune
  dépendance runtime ajoutée depuis le scaffold initial.

## Ce qui casse / n'est pas testé

- Débordement zéro-scroll persistant, Suivi et Traitements (diabète) à 1024×768 — breakpoints de
  layout à revoir.
- **Validation visuelle/UX humaine** (N2) en retard sur les autres chantiers récents (revue-prod tabac,
  insuline-affinements, refonte-audit diabète/cardio, repas-types) — cf. `VALIDATION.md`. Les
  illustrations du 2026-08-06 (Alerte cardio, garde-manger, vrai/faux tabac) sont validées ; les
  icônes de repères cardio (S5) sont déployées mais pas encore vues à l'écran par Thibault.
- **Rien n'est commité** depuis le dépôt des 62 PNG + le swap d'icônes S5 (2026-08-06) — en attente
  d'accord pour committer/pousser.
- Illustration `infarctus-atypique-nausees.png` déposée (lot 2026-08-06) mais **orpheline** : la carte
  « nausées isolées » a été retirée du code cardio M10 (**G-M10-nausées**, 2026-07-24) — fichier
  inutilisé, aucune action requise sauf si Thibault souhaite la restaurer.

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
