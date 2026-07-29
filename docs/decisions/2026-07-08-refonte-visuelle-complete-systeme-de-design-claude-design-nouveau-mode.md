# 2026-07-08 — Refonte visuelle complète : système de design Claude Design + nouveau modèle de courbes (S1-S10 + S2-S9)

### Décision

Refonte complète de l'UI de l'ETP interactif basée sur la maquette Claude Design (`maquettes/ETP Tabac - Standalone.html`),
exécutée en **deux vagues parallèles** :

**Vague 1 (S1, socle bloquant) :**
1. **Polices** : auto-hébergement de Source Serif 4 (titres) + Work Sans (corps) en `public/fonts/` (`@font-face` dans
   `global.css`, préchargement dans `index.html`) — fin du chargement CDN Google Fonts, fonctionnement garanti hors-ligne.
2. **Tokens CSS** : remplacement complet de la palette hex par tokens `oklch` sémantiques — fonds crème, texte brun éditoriale,
   séries confort/toxique/vigilance/nav, alpha soft (ex. `--zone-confort: oklch(70% 0.05 120)`), rayons `sm/·/lg/pill`,
   ombres brunes 1/2/3. Noms historiques (`--color-accent`, `--color-warn`) conservés pour compatibilité.
3. **Primitives globales** dans `global.css` : `.eyebrow`, `.btn` (4 variantes : primary/ghost/tertiary/danger),
   `.chip`, `.card`, `.panel`, `.callout`, `.alert`, classes d'annotation `.zone-fill--*` / `.zone-label--*` pour
   codification de zones de graphe (confort/toxique/vigilance).

**Vague 2 (S10 + S2-S9 en parallèle, 8 agents) :**
- **S10** : réécriture de `src/lib/nicotineCurve.ts` + tests — nouveau modèle 0–100 / 24 h transcrit du handoff
  (vs. ancien modèle 0–10 / heures arbitraires). Affects Module 2 (Nicotine) et Module 5 (Soulagement).
- **S2-S9** : restyle de tous les modules (accueil, coquille, Addiction, Nicotine, Substituts, Nicotine-toxique,
  Soulagement, Craving) + réécriture Motivation (cadran circulaire + interaction simplifiée). Toutes les zones
  consomment les primitives S1, aucun override local de `tokens.css`/`global.css`.

### Contexte

Maquette Claude Design fournie par Thibault (2026-07-06), validée pour capturer le système de design complet (typo,
couleurs, composants, interactions). Objectif : réaliser fidèlement le design visuel et interactif du handoff, débranchant
l'ancienne palette ad-hoc et l'ergonomie piecemeal des phases antérieures (R1-R9, V1-V8, A1-A12).

### Alternatives envisagées

- Rester sur la palette hex + bootstrap-like : écartée (rupture avec la direction du design Thibault, pas de cohérence
  sémantique, plus coûteux à maintenir).
- Implémenter la refonte par modules (par exemple S2 une semaine, puis S3 la semaine d'après) : écartée au profit de
  l'exécution parallèle vague 2 (accélère le time-to-delivery, zones disjointes = pas de conflits merge).

### Raison du choix

Maximiser la fidélité au design tout en minimisant la refonte incrementale coûteuse. Un socle S1 figé permet à S2-S9
de progresser en parallèle sans débordement de tokens ou de composants. Le nouveau modèle de courbes S10 est nécessaire
pour que S4/S7 implémentent fidèlement le handoff (grille 0–100/24h vs. ancien schéma arbitraire).

### Conséquences

- **Tous les modules** sont redessinés ; aucune dépendance visuelle sur l'ancienne palette.
- `src/lib/nicotineCurve.ts` rebasé sur la grille handoff ; interfaces Modules 2/5 restent stables (mêmes props),
  logique interne transformée. Tests Vitest couvrent les invariants (monotonie, cumul, stress-basal).
- `npm run dev` + `npm run build` et `npm run test` doivent passer après chaque session ; validation visuelle déléguée
  à Thibault (passe de review de la maquette vs. rendu produit).
- Pas d'ajout de dépendances runtime (animation, router, libs de design). Primitives générées manuellement en CSS.

### Impact IA

- Contexts complexe mais bien scopé par design (`docs/DESIGN_REFONTE.md` + `maquettes/handoff/` autorités primaires).
- Zones disjointes → travail parallèle à bas risque de merge conflict.
- Validation gate (`tsc -b`, `vite build`, `vitest run`) automatique ; validation visuelle humaine non bloquante
  pour commit mais signalée dans `VALIDATION.md`.
- Si correction ultérieure : localiser le `.module.css` du module impacté dans `src/features/<slug>/` ou la règle
  dans `global.css` (primitives) / `tokens.css` (variables). Modifications de `nicotineCurve.ts` affectent S4/S7 seulement.

