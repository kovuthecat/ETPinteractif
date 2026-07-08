# STATUS.md

État à l'instant T : ce qui marche, ce qui casse. Historique détaillé : `git log`.

> **Frontières** — STATUS : état actuel · `TASKS.md` : backlog + tâches · `plans/` : plan d'une tâche active · `VALIDATION.md` : checklist visuelle.
>
> **Dernière mise à jour :** 2026-07-08 (refonte-ui complète : S1-S10 + S2-S9 exécutés, T12 consolidation)

## Phase actuelle

Phase 1 (squelette + 6 modules tabac) terminée. Phase 2 (corrections UX, `plans/PLAN_corrections-ux.md`) : C1-C9 faits, reste **C10** (bloqué sur contenu à fournir par Thibault). Phase 3 (`plans/PLAN_corrections-v2.md`, captures Thibault 2026-07-01) : R1-R9 faits. Phase 4 (`plans/corrections-v3/`) : V1-V8 faits. **Phase 5** (`plans/corrections-v4/`, audit Playwright 2026-07-01) : A1-A12 faits (12 correctifs UX). **Phase 6** (`plans/refonte-ui/`, refonte visuelle sur la maquette Claude Design, cf. `docs/DESIGN_REFONTE.md`) : **S1-S10 + S2-S9 exécutés, consolidation T12 en cours**. Vague 1 (S1) : socle (fonts auto-hébergées, tokens oklch, primitives globales). Vague 2 (S10 + S2-S9 en parallèle) : restyle complète de tous les modules + réécriture logique des courbes (S4, S7). Résultat : palette crème/éditoriale, typographie Source Serif 4 / Work Sans, nouvelle grille de module 0–100 / 24 h. `tsc -b` + `vite build` + `vitest run` verts. **T12** (consolidation) : mise à jour STATUS/TASKS/DECISIONS + audit Codex en cours.

## Ce qui fonctionne

- **Scaffolding** Vite + React + TS ; navigation carte ↔ module (pile d'historique éphémère) ; accueil grille familles (Comprendre / Agir / Se motiver, A3) responsive.
- **Coquille partagée** : `ModuleShell`, `Sources` (libellé « Sources » visible + focus clavier A4), `ModuleCard`. Registre + `famille` par module (A3).
- **Les 6 modules du thème tabac + 1 module transverse** implémentés (plus aucun stub) :
  1. **Addiction** (`addiction/`) — diagramme de Venn à géométrie fixe, sélection par contour/opacité/échelle légère + panneau latéral unique signes/pistes et renvois (B1) ; message central toujours visible.
  2. **Nicotine** (`nicotine/`) — frise temporelle statique (V3) ; consigne d'amorce + chip « Pic atteint » + pictogrammes agrandis + liste prises (A6) ; drag-and-drop des prises sur la frise (position = temps), ligne fantôme, retrait par clic, fallback clic/clavier (A11).
  3. **Substituts & titration** (`substituts/`) — 7 formes ; contenu médical validé pour 5 formes (bonnes pratiques + erreurs), repli « en rédaction » pour inhaleur/vapoteuse (A1) ; titration : bouton « + ¼ (tous les 3 jours) » + aide de condition + bannière surdosage détaillée ; aucun dosage chiffré.
  4. **Nicotine ≠ toxique** (`nicotine-toxique/`) — scène SVG, hotspots, filtres ; atténuation légère de l'autre groupe + double encodage non chromatique (icônes ⚠/🧠 + libellés de rôle) (A7) ; contenu médical à valider.
  5. **Piège du soulagement** (`soulagement/`) — frise temporelle statique (V4) ; consigne 2 temps encadrée + annotation délai chute/remontée + « tension liée au manque » partout (A8) ; récit chiffré illustratif à valider.
  6. **Craving / 4D** (`craving/`) — vague de l'envie (~30 s), 4D en bascules (V5) ; « C'est passé » réservé à la fin réelle de la vague (3 états : idle/en cours/passée) (A9).
  7. **Explorer ma motivation** (`motivation/`) — 2 onglets (V7) ; réserve de cartes (V8) ; masquage onglets corrigé (A2) ; drag HTML5 réserve↔tableau + Entrée/Suppr (A12, remplace boutons Placer/Retirer) ; cartes 220–280 px + sliders épaissis + bornes 0/10 + tableau moins haut (A10).
- **Logique pure** : `src/lib/nicotineCurve.ts` (`sampleCurve`, `classifyZone`, `sampleStress`, `toSvgPath`), couverte par Vitest (`nicotineCurve.test.ts`, 20 tests verts — dont l'invariant R5 « creux fumeur > basal non-fumeur », la monotonie creux/rebond, et les 3 invariants de cumul V3).
- **Styles / accessibilité** : `tokens.css` (palette sémantique confort/toxique/vigilance/nav), `global.css` (cibles ≥ 44 px, `.activeDoubled`, `prefers-reduced-motion`).

## Ce qui n'est pas fait / à compléter (non bloquant)

- **Validation visuelle/UX humaine** des modules et de C8-C9 : pas encore faite (cf. `VALIDATION.md`).
- **C10 (partiel)** : sources exactes par module dans `registry.ts` — toujours à fournir par Thibault. Contenu bonnes pratiques/erreurs substituts : fait pour 5 formes (A1) ; reste inhaleur + vapoteuse.
- Contenus **en attente de validation Thibault** : récit chiffré du stress (C4), regroupements toxiques (C7), enrichissement des « outils & stratégies » du Module 1 au-delà des 2 items existants par pilier (R6), contenu de départ du Module 7 (libellés d'échelles + liste seed « Mes raisons », R9) — cf. `VALIDATION.md`.

## Dette technique / complexité

- Faible : 6 modules indépendants, logique pure isolée. Aucune zone difficile identifiée.
