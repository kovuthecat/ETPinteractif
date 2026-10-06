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

## Backlog — revue d'usage 2026-10-06 (`docs/revues/2026-10-06-usage.md`, regroupé par cause)

- [ ] T-U1 — Dialogs aria-modal (livret, fiches, respiration, gabarit, pied, « Ce que ça garde », règle des 3, carte-réflexe) : 8 bloquants (2.4.3 focus non confiné ; 2.1.1 feuille non défilable au clavier) → #c-3-31 #c-3-55 #c-3-66 #c-3-82 #c-4-12 #c-4-45 #c-5-7 #c-6-20 · modèle: Sonnet, effort: medium · env: Desktop
- [ ] T-U2 — Contrôles à la souris seule : frises nicotine et soulagement, raisons (motivation), poignées de proportions (diabète, cardio), steppers d'Activité : 7 bloquants, 1 majeur (2.1.1, 2.5.8) → #c-2-13 #c-2-24 #c-2-25 #c-3-1 #c-4-11 #c-4-29 #c-6-11 #c-6-12 · modèle: Sonnet, effort: high · env: Desktop
- [ ] T-U3 — États non exposés et onglets : silhouettes/zones (tabac, diabète, cardio), puces à 3 niveaux, segments d'insuline, « Autres idées » patient, onglets dont le focus ne suit pas : 8 bloquants, 5 majeurs (4.1.2) → #c-3-11 #c-4-1 #c-4-2 #c-4-13 #c-4-57 #c-5-1 #c-5-6 #c-7-19 #c-2-17 #c-3-14 #c-4-60 #c-4-73 #c-6-25 · modèle: Sonnet, effort: medium · env: Desktop
- [ ] T-U4 — Titres : `document.title` identique (consultation, app patient), saut H1→H3 (Substituts) : 3 bloquants (2.4.2, 1.3.1) → #c-1-2 #c-7-1 #c-3-21 · modèle: Sonnet, effort: low
- [ ] T-U5 — Débordements : mot long sans césure (5 champs) et reflow 320 px (8 écrans) : 13 majeurs (1.4.10) → #c-2-1 #c-3-3 #c-3-33 #c-3-44 #c-7-11 #c-3-32 #c-4-3 #c-4-4 #c-4-48 #c-4-61 #c-5-8 #c-5-11 #c-6-33 · modèle: Sonnet, effort: medium · env: Desktop
- [ ] T-U6 — Focus visible, cibles, contraste : champs et SVG sans outline, cibles de 16 à 23 px, contraste 3,65:1 des cartes : 13 majeurs (2.4.7, 2.5.8, 1.4.3) → #c-2-15 #c-3-72 #c-4-16 #c-4-49 #c-4-62 #c-2-2 #c-4-15 #c-4-44 #c-6-1 #c-6-3 #c-6-32 #c-1-3 #c-1-4 · modèle: Sonnet, effort: medium · env: Desktop
- [ ] T-U7 — Fonctionnel tabac : pas de retour au sélecteur, module ouvert au scrollY de la carte, pastilles qui posent un patch, 2 images 404 (`benef-horizon.png`, `aliment-pates-blanches.png`), titre vide accepté, livret sans stratégie, plan sans récapitulatif, tirelire qui arrondit 6,5, retraits de fiche perdus, 14 cases « Dans ma fiche » au même nom, zones de silhouette qui se chevauchent, éditeur hors focus : 14 majeurs → #c-1-1 #c-1-5 #c-2-14 #c-2-16 #c-3-2 #c-3-12 #c-3-13 #c-6-24 #c-3-15 #c-3-34 #c-3-35 #c-3-45 #c-3-71 #c-3-81 · modèle: Sonnet, effort: medium · env: Desktop
- [ ] T-U8 — Fonctionnel diabète/cardio : Suivi (fréquences, statut unique, station groupée), nom de molécule libre qui reçoit un effet (invariant 5), résultats sous le pli, analyse d'assiette incohérente, régularité en image seule, zones qui se chevauchent : 16 majeurs ; les 2 écarts texte/courbe des insulines (#c-4-58 #c-4-59) d'abord arbitrés par Thibault → #c-4-40 #c-4-41 #c-4-42 #c-4-43 #c-4-46 #c-4-47 #c-4-14 #c-4-17 #c-6-2 #c-6-13 #c-6-14 #c-6-21 #c-6-22 #c-6-23 · modèle: Sonnet, effort: high · env: Desktop
- [ ] T-U9 — App patient : précédent qui quitte l'app, « cf. titration » sans écran, tirelire qui arrondit 6,5 et persiste la valeur fausse, récompense effacée à la réouverture (dev, StrictMode — vérifier en build de prod), pas d'effacement des outils, boutons du carnet au même nom, édition hors écran : 7 majeurs → #c-7-2 #c-7-3 #c-7-12 #c-7-18 #c-8-1 #c-8-2 #c-8-3 · modèle: Sonnet, effort: medium · env: Desktop

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
