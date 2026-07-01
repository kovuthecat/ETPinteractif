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
- [ ] V3 — Nicotine : cumul sur axe fixe (supprime balayage/curseur) + retune amplitudes · modèle: Sonnet, effort: high · plan: → plans/corrections-v3/V3-nicotine-cumul.md
- [ ] V4 — Soulagement : clic → chute/remontée figée, plus de curseur · modèle: Sonnet, effort: medium · plan: → plans/corrections-v3/V4-soulagement-clic.md
- [ ] V5 — Craving : les 4 D masquent progressivement le pic (opacité) · modèle: Sonnet, effort: medium · plan: → plans/corrections-v3/V5-craving-masque-pic.md
- [ ] V6 — Nicotine-toxique : « Mélange chimique » reformulé avec conséquence · modèle: Haiku, effort: low · plan: → plans/corrections-v3/V6-toxique-melange.md
- [ ] V7 — Motivation : scinder en 2 onglets · modèle: Sonnet, effort: low · plan: → plans/corrections-v3/V7-motivation-onglets.md
- [ ] V8 — Motivation : tableau agrandi + cartes en réserve à glisser · modèle: Sonnet, effort: high · plan: → plans/corrections-v3/V8-motivation-reserve.md
  - Ordre recommandé : V6 → V1 → V2 → V5 → V7 → V8 → V3 → V4. Dépendances : V2 après V1, V8 après V7, V4 après V3 (lib partagée).

### Reliquat v1
- [~] C10 — Compléter le contenu non bloquant · modèle: Sonnet, effort: low · plan: → plans/PLAN_corrections-ux.md
  - [ ] Références de sources par module (HAS / Tabac Info Service) dans `registry.ts`
  - [ ] « Bonnes pratiques / erreurs fréquentes » par forme de substitut (Module 3-A)
  - **Bloqué** : en attente du contenu à fournir par Thibault.
- [ ] T-301 — Passe de validation visuelle/UX par Thibault (`npm run dev`, cf. `VALIDATION.md`) · humain
