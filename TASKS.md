# TASKS.md

Index des tâches : backlog + actives. Historique des tâches faites : `git log`.

> **Frontières** — TASKS : le quoi · `STATUS.md` : l'état · `plans/` : le comment · `VALIDATION.md` : visuel.
> Convention : `- [statut] T-ID — titre · modèle: X, effort: Y · plan: <lien ou —>`
> effort : `minimal · low · medium · high · max` (à vérifier avant de lancer la session).

## Tâches

### Corrections v2 (2026-07-01, captures Thibault) · plan: → plans/PLAN_corrections-v2.md
- [~] R1 — Borner contenu + graphiques SVG (anti-débordement) · modèle: Sonnet, effort: low (auto en attente : npm indispo dans cet env ; visuel → VALIDATION.md)
- [~] R2 — Nicotine-toxique : étiquettes alignées + pop-up ancré · modèle: Sonnet, effort: medium (auto en attente : npm indispo dans cet env ; visuel → VALIDATION.md)
- [~] R3 — Craving : cartes 4D dans le cadre (overlay borné) · modèle: Sonnet, effort: medium (auto en attente : npm indispo dans cet env ; visuel → VALIDATION.md)
- [x] R4 — Nicotine : cinétique temps réel au clic + refonte visuelle · modèle: Sonnet, effort: high (auto OK : tsc+vite build+vitest verts ; visuel → VALIDATION.md)
- [x] R5 — Soulagement : temps réel + repère non-fumeur superposé · modèle: Sonnet, effort: high *(récit à valider Thibault)* (auto OK : tsc+vite build+vitest 17 tests verts ; visuel → VALIDATION.md)
- [~] R6 — Addiction : exploration lisible + outils enrichis · modèle: Sonnet, effort: medium (auto OK ; visuel → VALIDATION.md ; enrichissement outils au-delà de la source non fait, cf. VALIDATION.md)
- [~] R7 — Craving : courbe « vague » plus expressive · modèle: Haiku, effort: low (auto OK ; visuel → VALIDATION.md)
- [~] R8 — Substituts : refonte ergonomique de la titration · modèle: Sonnet, effort: medium (auto OK ; visuel → VALIDATION.md)
- [x] R9 — Nouveau module M7 « Explorer ma motivation » (échelles + tableau blanc) · modèle: Sonnet, effort: high *(contenu à valider Thibault)* (auto OK : tsc+vite build+vitest 17 tests verts ; visuel → VALIDATION.md)
  - Ordre recommandé : R1 → R3 → R2 → R7 → R6 → R8 → R4 → R5 → R9.

### Corrections v3 (2026-07-01, captures Thibault) · plan: → plans/corrections-v3/ (1 fichier/étape)
- [x] V1 — Addiction : agrandir le diagramme de Venn (lisibilité) · modèle: Haiku, effort: low · plan: → plans/corrections-v3/V1-addiction-agrandir.md
- [x] V2 — Addiction : items « De quoi parle-t-on » en menu radial autour du cercle · modèle: Sonnet, effort: medium · plan: → plans/corrections-v3/V2-addiction-radial.md (auto OK : tsc+vite build verts ; visuel → VALIDATION.md)
- [x] V3 — Nicotine : cumul sur axe fixe (supprime balayage/curseur) + retune amplitudes · modèle: Sonnet, effort: high · plan: → plans/corrections-v3/V3-nicotine-cumul.md (auto OK : tsc+vite build+vitest 20 tests verts ; visuel → VALIDATION.md)
- [x] V4 — Soulagement : clic → chute/remontée figée, plus de curseur · modèle: Sonnet, effort: medium · plan: → plans/corrections-v3/V4-soulagement-clic.md (auto OK : tsc+vite build+vitest 20 tests verts ; visuel → VALIDATION.md)
- [x] V5 — Craving : les 4 D masquent progressivement le pic (opacité) · modèle: Sonnet, effort: medium · plan: → plans/corrections-v3/V5-craving-masque-pic.md (auto OK : tsc+vite build verts ; visuel → VALIDATION.md)
- [x] V6 — Nicotine-toxique : « Mélange chimique » reformulé avec conséquence · modèle: Haiku, effort: low · plan: → plans/corrections-v3/V6-toxique-melange.md (auto OK : tsc+vite build verts ; texte à valider Thibault → VALIDATION.md)
- [x] V7 — Motivation : scinder en 2 onglets · modèle: Sonnet, effort: low · plan: → plans/corrections-v3/V7-motivation-onglets.md (auto OK : tsc+vite build verts ; visuel → VALIDATION.md)
- [x] V8 — Motivation : tableau agrandi + cartes en réserve à glisser · modèle: Sonnet, effort: high · plan: → plans/corrections-v3/V8-motivation-reserve.md (auto OK : tsc+vite build verts ; drag limité au repositionnement intra-tableau, boutons Placer/Retirer pour changer de zone → VALIDATION.md)
  - Ordre recommandé : V6 → V1 → V2 → V5 → V7 → V8 → V3 → V4. Dépendances : V2 après V1, V8 après V7, V4 après V3 (lib partagée).

### Corrections v4 (2026-07-02, audit Playwright 2026-07-01) · plan: → plans/corrections-v4/ (1 fichier/étape)
- [x] A1 — Substituts : contenu validé (5 formes) + repli « en rédaction » + titration précisée · modèle: Sonnet, effort: medium · plan: → plans/corrections-v4/A1-substituts-contenu.md (auto OK ; visuel → VALIDATION.md §A1)
- [x] A2 — Motivation : corriger masquage onglets (`.section[hidden] { display: none }`) · modèle: Haiku, effort: minimal · plan: → plans/corrections-v4/A2-motivation-masquage.md (auto OK ; visuel → VALIDATION.md §A2)
- [x] A3 — Accueil : grille par familles (Comprendre / Agir / Se motiver) · modèle: Sonnet, effort: medium · plan: → plans/corrections-v4/A3-accueil-grille.md (auto OK ; visuel → VALIDATION.md §A3)
- [x] A4 — Coquille : libellé « Sources » explicite + focus clavier visible · modèle: Sonnet, effort: low · plan: → plans/corrections-v4/A4-affordances-sources.md (auto OK ; visuel → VALIDATION.md §A4)
- [x] A5 — Addiction : vocabulaire desktop + titre physique + légende couleur/symptômes/stratégies · modèle: Sonnet, effort: medium · plan: → plans/corrections-v4/A5-addiction-desktop-legende.md (auto OK ; visuel → VALIDATION.md §A5)
- [x] A6 — Nicotine : consigne d'amorce + chip « Pic atteint » + frise plus lisible · modèle: Sonnet, effort: low · plan: → plans/corrections-v4/A6-nicotine-consigne-libelle.md (auto OK ; visuel → VALIDATION.md §A6)
- [x] A7 — Nicotine-toxique : double encodage non chromatique + atténuation légère · modèle: Sonnet, effort: medium · plan: → plans/corrections-v4/A7-toxique-equilibre.md (auto OK ; visuel → VALIDATION.md §A7)
- [x] A8 — Soulagement : consigne 2 temps + annotation délai chute/remontée + « tension liée au manque » · modèle: Sonnet, effort: low · plan: → plans/corrections-v4/A8-soulagement-lecture.md (auto OK ; visuel → VALIDATION.md §A8)
- [x] A9 — Craving : « C'est passé » réservé à la fin réelle de la vague (3 états) · modèle: Sonnet, effort: medium · plan: → plans/corrections-v4/A9-craving-timing.md (auto OK ; visuel → VALIDATION.md §A9)
- [x] A10 — Motivation : cartes élargies (220–280 px) + sliders épaissis + bornes 0/10 + tableau moins haut · modèle: Sonnet, effort: medium · plan: → plans/corrections-v4/A10-motivation-cartes-sliders.md (auto OK ; visuel → VALIDATION.md §A10)
- [x] A11 — Nicotine : drag-and-drop des prises sur la frise (position = temps) + fallback clic/clavier · modèle: Sonnet, effort: high · plan: → plans/corrections-v4/A11-nicotine-drag-frise.md (auto OK ; visuel → VALIDATION.md §A11)
- [x] A12 — Motivation : placer/retirer les cartes par drag-and-drop HTML5 (réserve ↔ tableau) + Entrée/Suppr · modèle: Sonnet, effort: high · plan: → plans/corrections-v4/A12-motivation-drag-drop.md (auto OK : tsc+vite build verts ; visuel → VALIDATION.md §A12)
  - Ordre : Wave 1 (A1–A9 en parallèle, 9 agents) → Wave 2 (A10+A11, 2 agents) → Wave 3 (A12). 3 commits.

### Amélioration UI/UX v5 (2026-07-03) · plan: → plans/PLAN_amelioration-ui-ux-v5.md
- [x] B1 — Addiction : stabiliser le diagramme actif · modèle: Codex, effort: medium (Playwright ciblé 1440 × 900 OK ; npm run build OK ; npm test 20/20 OK)

### Refonte UI (2026-07-06, maquette Claude Design) · plan: → plans/refonte-ui/ (index + S1–S9) · design: → docs/DESIGN_REFONTE.md
- [x] S1 — Socle : fonts auto-hébergées + tokens oklch + primitives globales · modèle: Sonnet, effort: high · plan: → plans/refonte-ui/S1.md (auto OK : tsc+vite build+vitest 20 tests verts ; visuel → VALIDATION.md)
- [x] S10 — Réécrire la logique des courbes (nicotineCurve.ts + tests) — modèle 0–100 / 24 h (handoff) · modèle: Sonnet, effort: high · plan: → plans/refonte-ui/S10.md
- [x] S2 — Chrome : accueil + coquille + carte + Sources · modèle: Sonnet, effort: medium · plan: → plans/refonte-ui/S2.md
- [x] S3 — Restyle Addiction · modèle: Sonnet, effort: medium · plan: → plans/refonte-ui/S3.md
- [x] S4 — Ré-implémenter Nicotine (24 h, 3 outils, dose ; nouveau modèle) · modèle: Sonnet, effort: high · plan: → plans/refonte-ui/S4.md
- [x] S5 — Restyle Substituts (+ encart technique de prise) · modèle: Sonnet, effort: medium · plan: → plans/refonte-ui/S5.md
- [x] S6 — Restyle Nicotine ≠ toxique · modèle: Sonnet, effort: medium · plan: → plans/refonte-ui/S6.md
- [x] S7 — Ré-implémenter Soulagement (tension découplée ; nouveau modèle) · modèle: Sonnet, effort: high · plan: → plans/refonte-ui/S7.md
- [x] S8 — Restyle Craving (4D) · modèle: Sonnet, effort: medium · plan: → plans/refonte-ui/S8.md
- [x] S9 — Motivation : cadran circulaire + flux 2 questions (réécriture d'interaction) · modèle: Sonnet, effort: high · plan: → plans/refonte-ui/S9.md
- [x] T12 — Consolidation : contexte (STATUS/TASKS/VALIDATION/PROJECT_MAP/DECISIONS) + audit Codex + push · modèle: Haiku/Codex, effort: low
  - Vagues : V1 = S1 (bloquante) → V2 = S2–S9 en parallèle (8 agents, zones disjointes) → V3 = T12. **Complètes, 2026-07-08**.

### Reliquat v1
- [~] C10 — Compléter le contenu non bloquant · modèle: Sonnet, effort: low · plan: → plans/PLAN_corrections-ux.md
  - [ ] Références de sources par module (HAS / Tabac Info Service) dans `registry.ts`
  - [ ] « Bonnes pratiques / erreurs fréquentes » par forme de substitut (Module 3-A)
  - **Bloqué** : en attente du contenu à fournir par Thibault.
- [ ] T-301 — Passe de validation visuelle/UX par Thibault (`npm run dev`, cf. `VALIDATION.md`) · humain
