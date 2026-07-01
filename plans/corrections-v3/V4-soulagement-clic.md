# V4 — Soulagement : clic → chute/remontée figée (plus de curseur) · Modèle : Sonnet, effort : medium

> Lire UNIQUEMENT ce fichier + les fichiers « Lire ». Design fixé par Opus. Doute → STOP.
> **Faire APRÈS V3** (même modèle, `nicotineCurve.ts` déjà retuné en V3).

- **Capture :** `corrections/Pas de curseur bleu glissant comme pour la nicotine.PNG`
- **But :** aligner Soulagement sur le nouveau modèle nicotine (V3) : supprimer le **curseur
  bleu glissant** et le balayage automatique. Un clic « Fumer une cigarette » **dépose une
  prise sur la frise statique** ; le stress **chute au pic de nicotine puis remonte**, et la
  courbe cumulée reste figée. « Comparer au non-fumeur » (ligne repère) est conservé.

## Lire
- `src/features/soulagement/SoulagementModule.tsx`
- `src/features/soulagement/SoulagementModule.module.css`
- `src/lib/nicotineCurve.ts` (déjà modifié en V3 — ne pas re-modifier ici)

## Modifier
- `src/features/soulagement/SoulagementModule.tsx`
- `src/features/soulagement/SoulagementModule.module.css`

## Hors périmètre
- Ne PAS toucher `nicotineCurve.ts` (fait en V3). Ne pas modifier la formule du stress.
  Conserver le bouton « Comparer au non-fumeur » et son invariant (repère toujours sous le
  creux du fumeur).

## Conception (fixée)
- **Suppressions** : état `now`, boucle `requestAnimationFrame`, `<line cursor>`, hook
  `useReducedMotion` s'il devient inutile.
- **Placement des prises** : `fumerCigarette` ajoute l'événement via `nextEventTime`
  (frise statique), comme V3.
- **Rendu** : tracer les courbes **complètes** (nicotine repère pointillé + stress trait plein)
  sur toute la frise, plus seulement la portion « écoulée ». L'annotation « soulagement du
  manque » se place au **creux le plus bas** du stress (logique `troughIndex` conservée, mais
  calculée sur la courbe complète).
- Le repère non-fumeur et la légende restent inchangés.

## Étapes
1. Retirer boucle rAF, curseur, `now`/`resetTick` liés au balayage.
2. `fumerCigarette` place la prise via `nextEventTime` ; `reset` vide les événements.
3. Calculer `nicotinePath`/`stressPath` sur les tableaux **complets** (`nicotineYs`/`stressYs`),
   plus les tranches « elapsed ».
4. Recaler `troughIndex`/annotation sur la courbe complète.
5. Nettoyer le CSS du curseur devenu inutile.

## Validation
- **auto :** `tsc -b` + `vite build` + `vitest run` verts (les tests d'invariant
  fumeur/non-fumeur de `nicotineCurve.test.ts` doivent rester verts après le retune V3).
- **visuel (→ VALIDATION.md) :** aucun curseur bleu ; cliquer « Fumer une cigarette » fait
  chuter le stress au pic de nicotine puis remonter, courbe figée ; « Comparer » superpose la
  ligne non-fumeur toujours sous le creux ; enchaîner des cigarettes cumule les dents de scie.

## Si bloqué
Si le retune V3 rend le creux de stress trop plat pour être lisible → signaler dans
VALIDATION.md (arbitrage d'amplitude), ne pas re-modifier la lib sans accord. Doute → STOP.

## Commit
`fix(soulagement): supprimer le curseur/balayage, aligner sur le modèle cumul (V4)`

## Statut
[ ] à faire
