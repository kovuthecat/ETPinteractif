# TASKS.md

Index du **backlog** : ce qu'il reste à faire. Plafond : 60 lignes (appliqué par hook).
Historique des tâches faites : `git log` + `plans/<chantier>/index.md` (statut d'un plan clos).

> **Frontières** — TASKS : le *quoi* qui reste · `plans/P<n>/index.md` : l'*avancement* des tâches
> planifiées · `STATUS.md` : l'état actuel · `VALIDATION.md` : jugement humain (N2) en attente.

## Convention

**Non planifiée** : `- [ ] T-ID — titre · modèle: X, effort: Y`.
**Entrée dans un plan** (statut dans l'`index.md` du plan, pas ici) : `- T-ID — titre · → plans/<chantier>/S<k>.md`.
Modèles/efforts : `WORKFLOW.md` §2-3. `env: Desktop` si la tâche exige le navigateur in-app (N1).

## Plan refonte-audit-2026-07 — 8/8 sessions faites

## Plan enrichissement-visuel-2026-07 — 6/6 sessions faites (S5+S6 non commités, cf. STATUS.md)

## Backlog — contenu à fournir par Thibault (non bloquant)

- [ ] Références de sources par module dans `registry.ts` (HAS / Tabac Info Service) — vérifié
  2026-08-06 : diabète 10/10 complet, **tabac 3/10** (manque addiction, nicotine, nicotine-toxique,
  soulagement, substituts, plan-arret, motivation), **cardio 0/12** · modèle: Sonnet, effort: low
- [ ] `InfoHover` (2e niveau de lecture tabac) : composant prêt (déjà câblé en diabète/cardio),
  câblage tabac dès que Thibault valide tout ou partie des 3 entrées de `docs/BRIEF_TABAC.md` §3.5 +
  leurs sources exactes · modèle: Sonnet, effort: medium

## Plan P1 — corrections de la revue d'usage 2026-10-06 (avancement : `plans/P1/index.md`)

- T-U1 — Dialogs : focus confiné, Échap, feuille défilable au clavier (8 bloquants) · → plans/P1/S2.md
- T-U2 — Contrôles à la souris seule : frises, poignées, steppers, raisons (7 bloquants, 1 majeur) · → plans/P1/S3.md
- T-U3 — États non exposés et onglets (8 bloquants, 5 majeurs) · → plans/P1/S4.md
- T-U4 — Titres de page et hiérarchie de titres (3 bloquants) · → plans/P1/S1.md
- T-U5 — Débordements : mots longs et reflow 320 px (13 majeurs) · → plans/P1/S8.md
- T-U6 — Focus visible, cibles 24 px, contraste (13 majeurs) · → plans/P1/S9.md
- T-U7 — Fonctionnel tabac (14 majeurs ; c-1-1/c-1-5 en S1, tirelire en S7) · → plans/P1/S5.md
- T-U8 — Fonctionnel diabète/cardio (14 majeurs ; c-4-58/59 → T-C1) · → plans/P1/S6.md
- T-U9 — App patient et tirelire (7 majeurs ; c-7-2 en S1) · → plans/P1/S7.md
## Backlog — courbes (plan B, après P1)
- [ ] T-C1 — Recalibrer les courbes nicotine/tension et glycémie selon le propos arrêté (yo-yo en Manque, pas de Surdosage du fumeur, titration nette, ajouts nets, basale hors cible, bande 180 mg/dL, activité) + écarts texte/courbe insulines #c-4-58 #c-4-59 #c-4-63 à 65 → cadré : `docs/decisions/2026-10-08-suites-revues-usage-et-courbes.md` · `/nouveau-plan` après le plan T-U · modèle: Opus, effort: high

## Backlog (Phases suivantes — non cadré)

- [ ] Thème diabète : finaliser le cadrage des modules 5-8 (`docs/diabete/`) avant transmission à
  Claude Design.
- [ ] Occurrences résiduelles du mot « craving » hors périmètre (`registry.ts`, `NicotineModule.tsx`,
  `PlanArretModule.tsx`) — signalées, non bloquantes.

## Archivage

Supprimer la ligne d'une tâche dès que son plan est clos — historique dans `git log` +
`plans/<chantier>/index.md`. Purgé 2026-07-29 (migration workflow) : theme-diabete, boite-a-outils,
extensions-tabac, illustrations-diabete, aide-patient, audit-diabete, illustrations-tabac,
corrections-audit-tabac, corrections-visuelles-diabete (v1/v2/v3), corrections-revue-guidee,
insuline-affinements-2026-07, outils-interactifs-2026-07, revue-prod-2026-07, revue-chrome-2026-07,
theme-cardio-2026-07, M10/revue-prod-cardio (hors plan) — tous confirmés clos par `git log` (au moins
un plan, `revue-chrome-2026-07`, était déjà terminé dans son propre `index.md` mais encore listé
comme *à faire* ici : c'est exactement la désynchronisation que la règle « un statut, un seul
endroit » élimine).
