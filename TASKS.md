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

### Moteur multi-thèmes (2026-07-08) · plan: → C:\Users\kovu\.claude\plans\elegant-fluttering-dragon.md
- [x] M1 — Déplacer le thème tabac sous `src/features/tabac/` (7 modules + `nicotineCurve.ts`), généraliser
  `types.ts`/`registry.ts` (ModuleId/FamilleId en `string`, `Hue` dans `ModuleDef`, `ThemeDef`), navigation
  à 3 niveaux dans `App.tsx`, nouveau `ThemeSelector`, scaffold vide `src/features/diabete/` · modèle: Sonnet,
  effort: high (auto OK : tsc + vite build + vitest verts ; visuel → VALIDATION.md)

### Alimentation-v2 — amélioration module 2 diabète (2026-07-10) · plan: → plans/alimentation-v2/ (index + S1-S4)
- [x] S1 — Données : champs qualitatifs + paliers dérivés + 3 aliments oméga-3 · modèle: Sonnet, effort: medium · plan: → plans/alimentation-v2/S1.md (auto OK : tsc+vite build+vitest 61 tests verts)
- [x] S2 — Composants partagés : `InfoHover` survol+clic · extensions optionnelles `CourbeGlycemie` · modèle: Sonnet, effort: high · plan: → plans/alimentation-v2/S2.md (auto OK : tsc+vite build+vitest 61 tests verts)
- [x] S3 — Module Alimentation : déroulé guide + lisibilité défi ② + 2ᵉ niveau InfoHover · modèle: Sonnet, effort: high · plan: → plans/alimentation-v2/S3.md (auto OK : tsc+vite build+vitest 61 tests verts)
- [x] S4 — Consolidation : contexte (index/STATUS/TASKS/VALIDATION/DECISIONS/PROJECT_MAP) + commits (S1/S2/S3/contexte) · modèle: Haiku, effort: low · plan: → plans/alimentation-v2/S4.md (auto OK : tsc+vite build+vitest 61 tests verts)
  - Vagues : V1 = S1·S2 (parallèles, zones disjointes) → V2 = S3 (solo) → V3 = S4 (solo). **Chantier clos 2026-07-10.**
  - ⚠️ Points ouverts Thibault : valeurs qualitatives sel/graisses/oméga-3 (à revalider), bande moyen étroite défi ② (recalibrage futur), illustrations 3 aliments (placeholders).

### Approfondissement tabac (2026-07-09, refonte courbe + 2 modules + prompts) · plan: → plans/approfondissement-tabac/ (index + S1-S7)
- [x] AP1 — Registre +2 modules (benefices-arret, idees-recues) + stubs + IllustrationSlot tabac · modèle: Sonnet, effort: low · plan: → plans/approfondissement-tabac/S1.md (auto OK : tsc --noEmit + vite build verts)
- [x] AP2 — Silhouette générique SilhouetteCorps + wrapper diabète iso-API · modèle: Sonnet, effort: medium · plan: → plans/approfondissement-tabac/S2.md (auto OK : tsc --noEmit + vite build + vitest 61 tests verts)
- [x] AP3 — Refonte nicotineCurve.ts (demi-vie 2h, Bateman, saturation, tension) + tests invariants · modèle: Sonnet, effort: high · plan: → plans/approfondissement-tabac/S3.md (auto OK : tsc --noEmit + vite build + vitest 78 tests verts)
- [x] AP4 — Prompts illustrations tabac (bénéfices + vrai/faux) + style carré tabacsq · modèle: Sonnet, effort: low · plan: → plans/approfondissement-tabac/S4.md (verification statique OK)
- [x] AP5 — Module 9 « Ce que l'arrêt répare » (silhouette + frise 10 jalons) · modèle: Sonnet, effort: high · plan: → plans/approfondissement-tabac/S5.md (auto OK : tsc --noEmit + vite build verts)
- [x] AP6 — Module 10 « Vrai ou faux ? » (15 idées reçues sourcées, toutes actives) · modèle: Sonnet, effort: high · plan: → plans/approfondissement-tabac/S6.md (auto OK : tsc --noEmit + vite build verts)
- [x] AP7 — Consolidation docs + contexte + 8 commits (S1-S6 + docs + contexte) · modèle: Haiku, effort: low · plan: → plans/approfondissement-tabac/S7.md (auto OK : tsc --noEmit + vite build + vitest 78 tests verts)
  - Vagues : V1 = S1·S2·S3·S4 parallèles → V2 = S5·S6 parallèles → V3 = S7 solo. **Chantier clos 2026-07-10.**
  - ⚠️ Points ouverts Thibault : jalons S5 chiffres (Tabac Info Service/OMS) ; cartes S6 n°4/14/15 à revalider ; mention graphe S3 actualisée (derrière `// à revalider`) ; illustrations tabac → `public/illustrations/tabac/<id>.png`.

### Boîte à outils du sevrage + refonte Composantes + enrichissements (2026-07-10) · plan: → plans/boite-a-outils/ (index + S1-S9)
- [x] BO1 — Moteur : contexte de navigation générique + registre + `situations.ts` + stub `boite-a-outils/` · modèle: Sonnet, effort: medium · plan: → plans/boite-a-outils/S1.md (auto OK : tsc --noEmit + vite build verts)
- [x] BO2 — Module « Stratégies & outils » (14 outils, filtres, vague 4D héritée, fiche imprimable) · modèle: Sonnet, effort: xhigh · plan: → plans/boite-a-outils/S2.md (auto OK : tsc --noEmit + vite build verts ; `craving/` supprimé sans import cassé)
- [x] BO3 — Composantes : situations radiales sélectionnables + CTA contextuel · modèle: Sonnet, effort: high · plan: → plans/boite-a-outils/S3.md (auto OK : tsc --noEmit + vite build verts)
- [x] BO4 — Vrai/faux : 6 nouvelles cartes (poids/vapoteuse) + reformulation faux-pas + renvois · modèle: Sonnet, effort: medium · plan: → plans/boite-a-outils/S4.md (auto OK : tsc --noEmit vert ; `npm run build` bloqué par des erreurs pré-existantes hors zone diabète/activité d'une autre session de la même vague, sans lien avec `idees-recues`)
- [x] BO5 — Substituts : forme « Vapoteuse » (réduction des risques) · modèle: Sonnet, effort: medium · plan: → plans/boite-a-outils/S5.md (auto OK : tsc --noEmit + vite build verts)
- [x] BO6 — Plan d'arrêt : section « Si j'ai un écart » + vapoteuse dans les chips · modèle: Sonnet, effort: medium · plan: → plans/boite-a-outils/S6.md (auto OK : tsc --noEmit + vite build verts)
- [x] BO7 — Prompts d'illustrations (14 outils + vapoteuse) dans le HTML · modèle: Sonnet, effort: low · plan: → plans/boite-a-outils/S7.md (vérification statique OK)
- [x] BO8 — Diabète/Activité : interrupteur « activités toniques uniquement » · modèle: Sonnet, effort: low · plan: → plans/boite-a-outils/S8.md (auto OK : tsc --noEmit + vite build + npm test 78/78 verts)
- [x] BO9 — Consolidation : docs (`contenu-modules-tabac.md`) + contexte + 9 commits (BO1-BO8 + contexte) · modèle: Sonnet, effort: low · plan: → plans/boite-a-outils/S9.md (auto OK : tsc --noEmit + vite build + npm test verts)
  - Vagues : V1 = BO1·BO4·BO5·BO7·BO8 parallèles (5 agents, zones disjointes) → V2 = BO2·BO3·BO6 parallèles (3 agents) → V3 = BO9 solo. **Chantier clos 2026-07-10.**
  - ⚠️ Points ouverts Thibault (n'empêchent pas d'exécuter) : vapoteuse substituts (BO5, technique à revalider) ; 11/21 cartes Vrai/faux à revalider (BO4, sources internationales) ; formulations patient des 14 outils (BO2, à juger à l'usage) ; illustrations 14 outils + vapoteuse à générer (BO7 → `public/illustrations/tabac/<id>.png`) ; occurrences résiduelles du mot « craving » hors périmètre (`src/features/registry.ts`, `nicotine/NicotineModule.tsx`, `plan-arret/PlanArretModule.tsx` — cf. `DECISIONS.md`).

### Illustrations diabète (2026-07-10, virage illustration-driven) · plan: → plans/illustrations-diabete/ (index + S1-S7)
- [x] S1 — Pipeline d'assets (`build_assets.py`) + silhouette partagée `bodyImage`/hotspots · modèle: Sonnet, effort: xhigh · plan: → plans/illustrations-diabete/S1.md (auto OK : tsc --noEmit + vite build + npm test 78/78 verts). 7 assets déposés dans `public/illustrations/diabete/` (silhouette + organes yeux/reins/nerfs + pied auto-examen + plaque + artère saine), palette adaptative 256 couleurs pour tenir sous ~90 Ko/asset. `SilhouetteCorps` reçoit `bodyImage?` (mode hotspot, rétro-compat tabac stricte) ; wrapper diabète recalibré en % de l'image carrée (index §7) ; `RisqueCardioModule.tsx` (M4) ajusté pour son overlay plaque existant. Visuel → VALIDATION.md.
- [x] S2 — M5 Complications : illustration d'organe en tête du panneau détail · modèle: Sonnet, effort: xhigh · plan: → plans/illustrations-diabete/S2.md (auto OK : tsc --noEmit + vite build + npm test 78/78 verts). `ComplicationsModule.tsx` affiche `organe-yeux/reins/nerfs.png` ou `pied-auto-examen.png` (104 px, cadre doux) à côté du titre pour les 4 organes explorables ; cœur/cerveau (verrouillés) inchangés ; aucune donnée texte modifiée. Visuel → VALIDATION.md.
- [x] S3 — M4 Risque CV : artère illustrée + plaque codée croissante, plaque image sur silhouette, feux → lucide · modèle: Sonnet, effort: xhigh · plan: → plans/illustrations-diabete/S3.md (auto OK : tsc --noEmit + vite build + npm test 78/78 verts). `PlaqueArtere.tsx` réécrit (dépôt seul, plus de vaisseau codé) ; vue ② artère = `artere-saine.png` + overlay `PlaqueArtere` (rotation ≈-25° par PCA) ; vue ③ anatomie = `plaque.png` posée/pivotée par territoire (`PLAQUE_OVERLAYS`) ; 5 feux = icônes lucide (Droplet/Gauge/Droplets/Cigarette/Armchair). ⚠️ alignement fin de l'overlay à revalider visuellement (jamais vérifié à l'écran par Claude). Visuel → VALIDATION.md.
- [x] S4 — M1 Mécanisme : animation illustration-driven à 4 modes, contrôle par cellule · modèle: Sonnet, effort: xhigh · plan: → plans/illustrations-diabete/S4.md (auto OK : tsc --noEmit + vite build + npm test 78/78 verts). `MecanismeModule.tsx` réécrit (remplace le wizard 4-temps/5-cellules) : sélecteur de mode (sain/pénie/résistance/mixte), boucle 3 phases (clés → serrures → sang), 6 nouveaux assets (cellules/clé/jeton/pancréas), `prefers-reduced-motion` géré en JS (état final statique). Artère sous les cellules restée codée (option image écartée, cf. DECISIONS.md). ⚠️ positions/rotations des clés jamais vérifiées à l'écran. Visuel → VALIDATION.md.
- [x] S5 — M7 Traitements : vérification silhouette `bodyImage` + halo · modèle: Sonnet, effort: high · plan: → plans/illustrations-diabete/S5.md (aucun changement de code : déjà satisfait par le passage générique `bodyImage` de S1 ; gates inchangés verts). Cœur/reins `allume` (halo confort) selon la ligne sélectionnée, 6 autres zones masquées, halo « sucre » CSS existant compatible avec le conteneur carré.
- [x] S6 — M6 Suivi : stations/organes du cadran → lucide · modèle: Sonnet, effort: medium · plan: → plans/illustrations-diabete/S6.md (auto OK : tsc --noEmit + vite build + npm test 78/78 verts). Composant local `StationIcon` remplace 9 `IllustrationSlot` (`suivi-*`) par des icônes lucide (stéthoscope/prise de sang/vaisseaux/cœur/yeux/défenses/pied) dans un cadre neutre ; rein reste l'image `organe-reins.png` (S1, exception assumée) ; dentiste → `Smile`. Cadran/aiguille/centre restent codés.
- [x] S7 — Vignettes M2/M3/M8 (session récurrente, lot complet) · modèle: Sonnet, effort: medium · plan: → plans/illustrations-diabete/S7.md (auto OK : tsc --noEmit + vite build + npm test 78/78 verts). 62 nouvelles vignettes déposées (33 aliments M2 dont 5 nouveaux · 18 activité M3 dont `sol` nouveau · 11 hypoglycémie M8) ; `alimentation/data.ts` et `activite/data.ts` mis à jour (`// à revalider`). `public/illustrations/diabete/` : 75 fichiers au total. Session marquée récurrente (index §8) — à rouvrir au prochain lot.
  - **Chantier `illustrations-diabete` (S1-S7) clos le 2026-07-10.** Points ouverts non bloquants : alignement plaque overlay M4 (S3) et clés volantes M1 (S4) jamais vérifiés à l'écran ; valeurs nutritionnelles `// à revalider (Thibault)`.

### Reliquat v1
- [~] C10 — Compléter le contenu non bloquant · modèle: Sonnet, effort: low · plan: → plans/PLAN_corrections-ux.md
  - [ ] Références de sources par module (HAS / Tabac Info Service) dans `registry.ts`
  - [ ] « Bonnes pratiques / erreurs fréquentes » par forme de substitut (Module 3-A)
  - **Bloqué** : en attente du contenu à fournir par Thibault.
- [ ] T-301 — Passe de validation visuelle/UX par Thibault (`npm run dev`, cf. `VALIDATION.md`) · humain

### Backlog — thème diabète
- [x] D0 — Cadrage du contenu du thème diabète avec Thibault · humain + Sonnet · **clos le 2026-07-09** :
  SPEC consolidée (`docs/diabete/SPEC_outil_ETP_diabete.md`, 9 modules) + brief design
  (`docs/diabete/BRIEF_DESIGN_diabete.md`) + **maquette Claude Design reçue** (handoff
  `maquettes/Maquette handsoff diabete/extracted/`, 9 pages `.dc.html`). Suite → plan theme-diabete.

### Thème diabète — câblage (2026-07-09, maquette Claude Design) · plan: → plans/theme-diabete/ (index + S1-S13)
- [x] D1 — Socle thème : registre 9 modules + familles + stubs + `IllustrationSlot` · modèle: Sonnet, effort: medium · plan: → plans/theme-diabete/S1.md (auto OK : tsc+vite build verts)
- [x] D2 — Lib courbe de glycémie (`glycemieCurve.ts` + tests) — modèle physiologique (note Thibault : courbes réalistes M2/M3/M9) · modèle: Sonnet, effort: high · plan: → plans/theme-diabete/S2.md (auto OK : npm test 50 verts ; tsc+vite build verts)
- [x] D3 — Objets transversaux SVG : Silhouette, CourbeGlycemie, PlaqueArtere, SignatureEvitable · modèle: Sonnet, effort: high · plan: → plans/theme-diabete/S3.md (auto OK : tsc+vite build verts)
- [x] D4 — Module 1 « C'est quoi le diabète » (clé/serrure, 4 temps) · modèle: Sonnet, effort: medium · plan: → plans/theme-diabete/S4.md (auto OK : tsc+vite build verts)
- [x] D5 — Module 2 « Alimentation » (4 défis + synthèse, courbe physiologique, fiche assiette) · modèle: Sonnet, effort: high · plan: → plans/theme-diabete/S5.md (auto OK : npm test 50 verts ; tsc+vite build verts)
- [x] D6 — Module 3 « Activité physique » (rayonnement, jauge ouverte, timing sur la courbe) · modèle: Sonnet, effort: high · plan: → plans/theme-diabete/S6.md (auto OK : npm test 50 verts ; tsc+vite build verts)
- [x] D7 — Module 4 « Risque cardiovasculaire » (5 feux, artère réversible, anatomie, fiche) · modèle: Sonnet, effort: high · plan: → plans/theme-diabete/S7.md (auto OK : tsc+vite build verts)
- [x] D8 — Module 5 « Complications » (silhouette, signature « évitable », fiche pied) · modèle: Sonnet, effort: medium · plan: → plans/theme-diabete/S8.md (auto OK : tsc+vite build verts)
- [x] D9 — Module 6 « Suivi » (cadran de l'année + fiche calendrier frigo) · modèle: Sonnet, effort: high · plan: → plans/theme-diabete/S9.md (auto OK : tsc+vite build verts)
- [x] D10 — Module 7 « Traitements » (ordonnance ↔ silhouette, double protection) · modèle: Sonnet, effort: medium · plan: → plans/theme-diabete/S10.md (auto OK : tsc+vite build verts)
- [x] D11 — Module 8 « Hypoglycémie » (15/15, récupération/overshoot, carte-réflexe) · modèle: Sonnet, effort: medium · plan: → plans/theme-diabete/S11.md (auto OK : npm test 50 verts ; tsc+vite build verts)
- [x] D12 — Module 9 « Insuline » (traces capteur générées, TIR vivant, 3 situations) · modèle: Sonnet, effort: high · plan: → plans/theme-diabete/S12.md (auto OK : npm test 50 verts ; tsc+vite build verts)
- [x] D13 — Consolidation : contexte + commits par tâche + audit Codex + push · modèle: Haiku (+Codex), effort: low · plan: → plans/theme-diabete/S13.md (auto OK : tsc+vite build+npm test verts ; 13 commits atomiques D1-D13 réalisés)
  - Vagues : V1 = S1·S2·S3 (parallèles, zones disjointes) → V2 = S4-S12 (9 agents parallèles, un module chacun) → V3 = S13 (solo).
  - ⚠️ Points ouverts Thibault (n'empêchent pas d'exécuter) : familles d'accueil, illustrations à générer (`design/illustrations/prompts-illustrations-diabete.html` → `public/illustrations/diabete/`), fréquences module 6 + seuils module 4 à revalider.
- [x] D14 — Corrections bugs revue visuelle du 2026-07-09 (7 bugs, 5 modules + lib) · modèle: Sonnet, effort: high · plan: → plans/theme-diabete/S14.md (auto OK : tsc+vite build+npm test 61 tests verts). Lib `glycemieCurve.ts` : modèle repas par **composition réelle** (CG/fibres/protéines/lipides, remplace les heuristiques de familles + proximité à l'assiette-modèle), `ordreFeculent` gradué (remplace le booléen `ordreFeculentDernier`), assiette vide → courbe plate, scénario nocturne `nuit_isolee` → `descend_hypo_matinale`, raccord nuit→jour continu. **B1** défi 1 Alimentation : assiette libre (vide au montage, toutes familles + doublons, plafond 10). **B2** défi 3 Ordre : courbe graduée + aliments remplaçables + carte courbe bornée 760px. **B3** défi 4 Proportion : portions réelles (aliment répété par portion). **B4** Activité : `z-index` au survol/focus des rayons. **B5** Suivi : cadran vide au montage (**inverse D9 n°2**), grille une-ligne-par-examen. **B6** Hypoglycémie : `.panel[hidden]{display:none}`. **B7** Insuline : chip « nuit isolée » retiré, chip « Ça descend la nuit » ajouté. **B8** `IllustrationSlot` : libellé placeholder tronqué + masqué sous 56px. Visuel → `VALIDATION.md` (thème diabète) + checklist détaillée dans `S14.md`.

### Extensions tabac (2026-07-09, analyse Fable vs brief diabète) · plan: → plans/extensions-tabac/ · autorité: docs/BRIEF_TABAC.md
- [x] X1 — Socle fiches : `FicheOverlay` générique + CSS impression A4 · modèle: Sonnet, effort: high · plan: → plans/extensions-tabac/X1.md (auto OK : tsc --noEmit + vite build verts ; visuel → VALIDATION.md §X1)
- [x] X2 — Fiche « Ma carte anti-envie » (Craving, référence + D perso) · modèle: Sonnet, effort: medium · plan: → plans/extensions-tabac/X2.md (plan marqué fait le 2026-07-09 ; code vérifié X7 : `FicheOverlay` câblé dans `CravingModule.tsx`, bouton « Préparer ma carte » ; visuel → VALIDATION.md)
- [x] X3 — Fiche « Ma méthode patch » (Substituts, règles + dose du moment) · modèle: Sonnet, effort: medium · plan: → plans/extensions-tabac/X3.md (plan marqué fait le 2026-07-09 ; code vérifié X7 : `FicheOverlay` câblé dans `SubstitutsModule.tsx`, bouton « Imprimer ma méthode » ; visuel → VALIDATION.md)
- [x] X4 — Fiche « Mes raisons » (Motivation, cartes + échelles) · modèle: Sonnet, effort: medium · plan: → plans/extensions-tabac/X4.md (plan marqué fait le 2026-07-09 ; code vérifié X7 : `FicheOverlay` câblé dans `MotivationModule.tsx`, bouton « Imprimer mes raisons » ; visuel → VALIDATION.md)
- [x] X5 — Nouveau module « Mon plan d'arrêt » + fiche (famille Agir) · modèle: Sonnet, effort: high · plan: → plans/extensions-tabac/X5.md (plan marqué fait le 2026-07-09 ; code vérifié X7 : `plan-arret/PlanArretModule.tsx` au registre tabac, `id: 'plan-arret'`, famille `agir`, `FicheOverlay` câblé ; visuel → VALIDATION.md)
- [~] X6 — Portes de fin de module + fil rouge + 2ᵉ niveau (InfoHover) · modèle: Sonnet, effort: high · plan: → plans/extensions-tabac/X6.md (auto OK : tsc --noEmit + vite build + vitest 20 tests verts ; `ModuleFooterNav`/fil rouge câblés et vérifiés en X7 ; **T4 InfoHover livré seul, non câblé** — aucune entrée §3.5 validée dans `BRIEF_TABAC.md` §5, reconfirmé encore vrai en X7 (comportement attendu, pas un défaut) ; visuel → VALIDATION.md §X6)
- [x] X7 — Resynchroniser les docs sur le code (contenu-modules, STATUS, PROJECT_MAP, TASKS) · modèle: Sonnet, effort: low · plan: → plans/extensions-tabac/X7.md (auto OK : tsc --noEmit + vite build verts, aucun fichier `src/` modifié)
  - Vagues : V1 = X1 (bloquante) → V2 = X2-X5 en parallèle (fichiers disjoints, X5 seul sur `registry.ts`) → V3 = X6 → V4 = X7. **Chantier clos le 2026-07-09.**
  - ⚠️ Avant/pendant : validations Thibault listées dans `docs/BRIEF_TABAC.md §5` (fil rouge, contenus 2ᵉ niveau + sources, libellés plan d'arrêt) — le fil rouge et le plan d'arrêt sont partis sur la v1 proposée ; le 2ᵉ niveau (InfoHover) reste non câblé faute de validation, cf. X6 ci-dessus.
- [x] X8 — Fiche patch : marge « à colorier » + prise ponctuelle (demande Thibault 2026-07-09, hors brief initial) · modèle: Sonnet, effort: medium · plan: → plans/extensions-tabac/X8.md (auto OK : tsc --noEmit + vite build + vitest 50 tests verts). `PatchQuarts` accepte `quartsVides` (dose de jour affichée en vert + marge = patch en cours complété + 1 patch vide, coloriable au stylo à l'impression via contour pointillé + `print-color-adjust: exact`) ; nouveau composant `TechniqueIllustration` (table `ILLUSTRATIONS` toute à `null`, image-ready) partagé écran/fiche ; sélecteur dédié fiche « Ajouter une prise ponctuelle » (gomme/pastille/sublingual/spray, indépendant de la forme explorée à l'écran) → bloc optionnel « Ma prise ponctuelle » sur la fiche. `BRIEF_TABAC.md §3.1` resynchronisé ; visuel (aplat vert imprimé, tenue 1 page A4) → VALIDATION.md §X8.

### Corrections visuelles diabète (revue Thibault 2026-07-11, 13 captures → 5 causes-racines) · plan: → plans/corrections-visuelles-diabete/ (index + S1-S8)
- [x] CVD-S1 — Silhouette partagée : agrandir + halo « allumé » franc + retrait boutons organe (Traitements/Complications/Risque cardio ③) · modèle: Sonnet, effort: xhigh · plan: → plans/corrections-visuelles-diabete/S1.md (auto OK : tsc + vite build + npm test 78/78 verts ; visuel → VALIDATION.md)
- [x] CVD-S2 — Courbe glycémie : désaturer K_CHARGE, amplifier l'ordre, bande-cible module 2, comparaison fantôme systématique · modèle: Sonnet, effort: xhigh · plan: → plans/corrections-visuelles-diabete/S2.md (auto OK : tsc + vite build + npm test 80/80 verts ; visuel → VALIDATION.md)
- [x] CVD-S3 — Layout Alimentation : scène pleine largeur, éléments agrandis (dépend de S2) · modèle: Sonnet, effort: xhigh · plan: → plans/corrections-visuelles-diabete/S3.md (auto OK : tsc + vite build + npm test 80/80 verts ; visuel → VALIDATION.md)
- [x] CVD-S4 — Suivi : refonte Parcours (empilé, lisible, plus de débordement) · modèle: Sonnet, effort: xhigh · plan: → plans/corrections-visuelles-diabete/S4.md (auto OK : tsc + vite build + npm test 80/80 verts ; visuel → VALIDATION.md)
- [x] CVD-S5 — Activité ① Rayonnement : l'image remplit le nœud · modèle: Sonnet, effort: xhigh · plan: → plans/corrections-visuelles-diabete/S5.md (auto OK : tsc + vite build + npm test 80/80 verts ; visuel → VALIDATION.md)
- [x] CVD-S6 — Mécanisme : ralentir l'animation + tenir l'état final · modèle: Sonnet, effort: xhigh · plan: → plans/corrections-visuelles-diabete/S6.md (auto OK : tsc + vite build + npm test 80/80 verts ; visuel → VALIDATION.md)
- [x] CVD-S7 — Plaque d'athérome : dépôt en croissant collé à la paroi · modèle: Sonnet, effort: xhigh · plan: → plans/corrections-visuelles-diabete/S7.md (auto OK : tsc + vite build + npm test 80/80 verts ; visuel → VALIDATION.md, alignement à caler par Thibault)
- [x] CVD-S8 — Passe « moins de texte » agressive (9 modules) + libellé Insuline ③ (dépend de toutes) · modèle: Sonnet, effort: xhigh · plan: → plans/corrections-visuelles-diabete/S8.md (auto OK : tsc + vite build + npm test 80/80 verts, bundle réduit ; visuel → VALIDATION.md)
  - Ordre : S1 → S2 → S3 → S4 → S5 → S6 → S7 → S8. **Chantier clos 2026-07-11** (les 8 sessions faites). Mode solo (Sonnet), commits + push groupés en fin de plan.

### Corrections visuelles diabète, tour 2 (revue Thibault 2026-07-11, par-dessus S1-S8 ci-dessus) · plan: → plans/corrections-visuelles-diabete-v2/ (index + S1-S6)
- [x] CVD2-S1 — Silhouettes vraiment dominantes (560/640px) + plaque localisée à la zone active + retrait texte Traitements · modèle: Sonnet, effort: xhigh · plan: → plans/corrections-visuelles-diabete-v2/S1.md (auto OK : tsc + vite build + npm test 80/80 verts ; visuel → VALIDATION.md)
- [x] CVD2-S2 — Feux cardio : icône = bouton coloré (bordure = sévérité, nom accessible) + artère ~30% de lumière au max · modèle: Sonnet, effort: xhigh · plan: → plans/corrections-visuelles-diabete-v2/S2.md (auto OK : tsc + vite build + npm test 80/80 verts ; visuel → VALIDATION.md)
- [x] CVD2-S3 — Suivi : cadran + examens side-by-side (≥860px) sans déborder, icône Lucide « placer/retirer » · modèle: Sonnet, effort: xhigh · plan: → plans/corrections-visuelles-diabete-v2/S3.md (auto OK : tsc + vite build + npm test 80/80 verts ; visuel → VALIDATION.md, critère bloquant non-débordement à revalider)
- [x] CVD2-S4 — Insuline : profil en toggle permanent, onglet lecture dégraissé, décider sans titre trompeur · modèle: Sonnet, effort: xhigh · plan: → plans/corrections-visuelles-diabete-v2/S4.md (auto OK : tsc + vite build + npm test 80/80 verts ; visuel → VALIDATION.md)
- [x] CVD2-S5 — Activité : rayonnement 480→640px, volume dé-grillé (rythme visuel) + débordement corrigé, micro-coupures 44px · modèle: Sonnet, effort: xhigh · plan: → plans/corrections-visuelles-diabete-v2/S5.md (auto OK : tsc + vite build + npm test 80/80 verts ; visuel → VALIDATION.md)
- [x] CVD2-S6 — Alimentation : débordements Qualité/Ordre (passe défensive CSS) + plancher/plafond partagé de LA COURBE · modèle: Sonnet, effort: xhigh · plan: → plans/corrections-visuelles-diabete-v2/S6.md (auto OK : tsc + vite build + npm test 80/80 verts ; visuel → VALIDATION.md, critère bloquant non-débordement à revalider en priorité — cause exacte non confirmée sans navigateur)
  - Ordre : S1 → S2 (même fichier), puis S3/S4/S5/S6 indépendants. **Chantier clos 2026-07-11** (les 6 sessions faites). Mode solo (Sonnet), commits par tâche en fin de plan, push en attente de validation Thibault.

### Corrections visuelles diabète, tour 3 (audit Chrome déployé 2026-07-11, par-dessus S1-S6 tour 2) · plan: → plans/corrections-visuelles-diabete-v3/ (index + S1-S10)
- [x] CVD3-S1 — Fondation chrome diabète : `ModuleShell` gagne `nav`/`wide` (agnostiques) ; 9 modules diabète câblés (barre d'onglets → header pour 6 d'entre eux, `wide` partout) · modèle: Sonnet, effort: xhigh · plan: → plans/corrections-visuelles-diabete-v3/S1.md (auto OK : tsc + vite build + npm test 80/80 verts ; visuel → VALIDATION.md)
- [x] CVD3-S2 — Retrait de `ModuleFooterNav` partout (9 diabète + 8 tabac) + suppression composant/CSS/données · modèle: Sonnet, effort: xhigh · plan: → plans/corrections-visuelles-diabete-v3/S2.md (auto OK : tsc + vite build + npm test 80/80 verts, grep 0 résultat ; visuel → VALIDATION.md)
- [x] CVD3-S3 — Risque cardio : feux 3/2, fix Bézier plaque (lumière ~30% réelle), pin découplé des feux · modèle: Sonnet, effort: xhigh · plan: → plans/corrections-visuelles-diabete-v3/S3.md (auto OK : tsc + vite build + npm test 80/80 verts ; visuel → VALIDATION.md)
- [x] CVD3-S4 — Alimentation : courbe pleine largeur, Qualité côte à côte, Ordre sur une ligne · modèle: Sonnet, effort: xhigh · plan: → plans/corrections-visuelles-diabete-v3/S4.md (auto OK : tsc + vite build + npm test 80/80 verts ; visuel → VALIDATION.md)
- [x] CVD3-S5 — Activité ② Volume : grille pleine largeur + total en bandeau, tient sans scroll · modèle: Sonnet, effort: xhigh · plan: → plans/corrections-visuelles-diabete-v3/S5.md (auto OK : tsc + vite build + npm test 80/80 verts ; visuel → VALIDATION.md)
- [x] CVD3-S6 — Suivi ① Parcours : cadran agrandi + plus de double scroll (breakpoint remonté) · modèle: Sonnet, effort: xhigh · plan: → plans/corrections-visuelles-diabete-v3/S6.md (auto OK : tsc + vite build + npm test 80/80 verts ; visuel → VALIDATION.md)
- [x] CVD3-S7 — Traitements : ordonnance élargie (colonne grid) + picto clé/serrure par mécanisme · modèle: Sonnet, effort: xhigh · plan: → plans/corrections-visuelles-diabete-v3/S7.md (auto OK : tsc + vite build + npm test 80/80 verts ; visuel → VALIDATION.md, classement clinique iDPP4/aGLP1 à valider)
- [x] CVD3-S8 — Hypoglycémie : preview affiche tous les signes sélectionnés (retrait état mort) · modèle: Sonnet, effort: xhigh · plan: → plans/corrections-visuelles-diabete-v3/S8.md (auto OK : tsc + vite build + npm test 80/80 verts ; visuel → VALIDATION.md)
- [x] CVD3-S9 — Insuline : retrait propre de « Temps dans la cible » · modèle: Sonnet, effort: xhigh · plan: → plans/corrections-visuelles-diabete-v3/S9.md (auto OK : tsc + vite build + npm test 80/80 verts ; visuel → VALIDATION.md)
- [x] CVD3-S10 — Nouveau module « Insuline rapide (pré-prandial) » — implémenté sur feu vert explicite de
  Thibault (2026-07-11), **avant la relecture finale formelle** du contenu `docs/diabete/10-insuline-rapide.md`
  (statut du doc encore « en attente de relecture » — reste à confirmer a posteriori) : modèle
  `sampleRepasAvecBolus` (`lib/glycemieCurve.ts`, PK/PD qualitative d'un bolus rapide, `BOLUS_DUREE`
  recalibré 240→180 min pour qu'une dose unique bien dosée ne creuse pas artificiellement sous la baseline),
  10ᵉ module `insuline-rapide/InsulineRapideModule.tsx` (4 temps : couvrir le repas / le bon moment /
  corriger avant le repas / le piège du cumul), enregistré dans `registry.ts` (famille « soigner », après
  le module 9) · modèle: Sonnet, effort: xhigh · plan: → plans/corrections-visuelles-diabete-v3/S10.md +
  S10-implementation.md (auto OK : tsc + vite build + npm test 86/86 verts ; visuel → VALIDATION.md ;
  contenu → relecture finale Thibault toujours attendue)
  - Ordre : S1 (fondation, fait) → S2 indépendante → S3-S9 indépendantes entre elles (fichiers disjoints) → S10 en dernier (contenu à sourcer). Mode solo (Sonnet). **S1-S9 faites et gates verts (2026-07-11) ; S10 bloquée en attente de validation du contenu par Thibault.** Commit/push en fin de plan une fois toutes les sessions faites et validées par Thibault.

### Audit diabète — 12 corrections (audit manuel Thibault sur le déployé, 2026-07-12) · plan: → plans/audit-diabete/ (index + S1-S6)
- [x] S1 — Cardio : fusion « ① Les leviers » dans « ② L'artère » → « ① Les facteurs de risque » (audit #2, T1) + retrait des 3 textes explicatifs sous l'artère — narration orale (audit #3, T2) · modèle: Sonnet, effort: high · plan: → plans/audit-diabete/S1.md (auto OK : tsc + vite build + npm test 86/86 verts ; visuel → docs/diabete/VALIDATION.md)
- [x] S2 — Hypo : illustrations des signes (motif `previewItem`) dans le bloc « Mes signes » de la carte-réflexe (audit #8, T3) · modèle: Sonnet, effort: medium · plan: → plans/audit-diabete/S2.md (auto OK : tsc + vite build + npm test 86/86 verts ; visuel → docs/diabete/VALIDATION.md)
- [x] S3 — Alimentation : la courbe « Glycémie après le repas » sort de sous `.layout` et vit dans la colonne de chaque défi, agrandie (audit #4/5/6/7, T4) + Composition sans compteur/reset en icône/assiette agrandie (audit #4, T5) + Qualité sans duels ni verdicts textuels (audit #5, T6) + Ordre/Repas complet vérifiés (audit #6-7, T7) · modèle: Sonnet, effort: xhigh · plan: → plans/audit-diabete/S3.md (auto OK : tsc + vite build + npm test 86/86 verts ; visuel → docs/diabete/VALIDATION.md)
- [x] S4 — Insuline « Décider » : réglage manipulable de la lente (−1/pareil/+1 cran) qui fait réagir en direct la courbe des nuits suivantes, réutilise des scénarios existants (audit #9, T8) · modèle: Sonnet, effort: high · plan: → plans/audit-diabete/S4.md (auto OK : tsc + vite build + npm test 86/86 verts, `glycemieCurve.test.ts` non touché ; visuel → docs/diabete/VALIDATION.md)
- [x] S5 — Insuline rapide : onglet ③ courbes de départ convergentes + correction expérimentable (audit #10-11, T9) + onglet ④ cumul à 2 situations × 3 recorrections expérimentable, 6 cases (audit #12, T10 — **3 tentatives de modélisation**, 2 rejetées par preuve numérique avant le mécanisme d'excès persistant/IOB proposé par Fable, cf. `DECISIONS.md`) · modèle: Sonnet, effort: xhigh · plan: → plans/audit-diabete/S5.md (auto OK : tsc + vite build + npm test 92/92 verts, 55 `glycemieCurve.test.ts` dont 4 nouveaux ; visuel → docs/diabete/VALIDATION.md)
- [x] S6 — Zéro scroll : resserrement du rythme vertical du cadre partagé (`ModuleShell`, `Home` — paddings/marges, `min-height: 100dvh`, aucun `overflow:hidden` ajouté, rétro-compat tabac respectée) + mesure des 10 modules diabète + accueil à 1366×768/1024×768 (audit #1, T11) · modèle: Sonnet, effort: high · plan: → plans/audit-diabete/S6.md (auto OK : tsc + vite build + npm test 88/88 verts à l'exécution de cette session ; visuel → docs/diabete/VALIDATION.md)
  - Vagues : V1 = S1·S2·S3·S4·S5 (parallèles, zones disjointes) → V2 = S6 (solo, après S1+S3) → V3 = consolidation contexte (Haiku/orchestrateur). **Chantier clos 2026-07-12** (12 points d'audit traités via 11 tâches T1-T11).
  - ⚠️ Points ouverts Thibault : débordement zéro-scroll résiduel sur Suivi (« Le parcours », +~615px estimé à 1024×768) et Traitements (avec panneau, +~500-550px estimé à 1024×768) — cause : breakpoints de layout mal calés, pas un manque de resserrement (cf. `STATUS.md`, `S6.md` bilan) ; constantes `// à caler (Thibault)` non cliniquement validées : `CORRECTION_DOSE` (S5/T9), `EXCES_SITUATION_B`/`EXCES_CONSOMMATION` (S5/T10), `DEPART_RESORPTION` (S5/T9), mapping situation×ajustement de `insuline/scenarios.ts` (S4/T8).
