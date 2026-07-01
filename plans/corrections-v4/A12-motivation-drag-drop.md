# A12 — Motivation : placer/retirer par glisser-déposer · Modèle : Sonnet, effort : high

> Lire UNIQUEMENT ce fichier + les fichiers « Lire ». Design fixé par Opus. Doute → STOP.
> **Postérieur à A2 (masquage), V7/V8 (onglets + réserve) et A10 (cartes/sliders).** Décision
> validée par Thibault (2026-07-01) : remplacer les boutons « Placer » / « Retirer » par un
> **glisser-déposer** réserve ↔ tableau.

- **Source :** `AUDIT_UI_UX_PLAYWRIGHT.md` §7 (« Remplacer “ajouter” et “retirer” par un système
  de drag and drop ») + arbitrage Thibault (VALIDÉ).
- **But :** V8 avait gardé les boutons « Placer » / « Retirer » (drag inter-conteneurs au pointer
  natif jugé fragile, cf. §Si bloqué de V8). On passe maintenant au **glisser-déposer** :
  glisser une carte de la **réserve** vers le **tableau** la place ; la glisser **hors** du tableau
  la renvoie à la réserve.

## Lire
- `src/features/motivation/MotivationModule.tsx`
- `src/features/motivation/MotivationModule.module.css`

## Modifier
- `src/features/motivation/MotivationModule.tsx`
- `src/features/motivation/MotivationModule.module.css`

## Hors périmètre
- **Aucune dépendance** (drag natif HTML5 pour le transfert inter-zones ; pas de lib DnD). Zéro
  persistance. Ne pas toucher aux échelles (V7). Ne pas casser A2 (masquage) ni A10 (cartes/sliders).

## Conception (fixée)
- **Transfert réserve ↔ tableau via HTML5 drag natif** (plus robuste que la capture pointeur entre
  deux conteneurs DOM — cause de l'échec V8) :
  - Cartes de la réserve : `draggable`, transmettent leur `id` au `dragstart`.
  - Le **tableau** (`.whiteboard`) est zone de dépôt (`onDragOver` preventDefault + `onDrop`) :
    au drop, `placed=true` + `x/y` calculés au point de dépôt (réutiliser `pointerPct` /
    `getBoundingClientRect`, borné par `MARGIN`).
  - La **réserve** est aussi zone de dépôt : y déposer une carte placée → `placed=false` (retour
    au bac). Alternative : drop **hors** du tableau → retour réserve (comme `handlePointerUp`).
- **Repositionnement dans le tableau** : conserver le drag pointeur existant (`handlePointerDown/
  Move/Up` sur la poignée) qui fonctionne déjà pour les cartes placées.
- **Supprimer les boutons** « Placer » / « Retirer » (demande Thibault). Les remplacer par une
  **accessibilité clavier** équivalente (obligatoire, ne pas régresser l'a11y) :
  - carte de réserve focusable : **Entrée/Espace** = placer sur le tableau (position par défaut) ;
  - carte placée : conserver les **flèches** (nudge, déjà présent) et ajouter **Suppr/Retour
    arrière** = renvoyer à la réserve.
  - `aria-label` explicites décrivant l'action clavier ET le glisser.
- **Indice visuel** : surbrillance de la zone de dépôt (tableau / réserve) pendant un drag.
- Sobriété + cibles ≥ 44 px ; lisible à ~1 m.

## Étapes
1. Rendre les cartes de la réserve `draggable` + `dragstart` (porte l'`id`).
2. `.whiteboard` : `onDragOver`/`onDrop` → `placed=true` + `x/y` au point de dépôt.
3. Retour réserve : soit `.reserve` reçoit le drop (`placed=false`), soit drop hors tableau (réutiliser
   la logique `dansLeTableau` de `handlePointerUp`).
4. Supprimer les boutons « Placer » / « Retirer » et leurs styles ; ajouter les raccourcis clavier
   (Entrée = placer, Suppr = retirer) avec `aria-label` mis à jour.
5. Conserver le drag pointeur intra-tableau + le nudge flèches.
6. CSS : styles `draggable` (curseur `grab`), surbrillance des zones de dépôt.

## Validation
- **auto :** `tsc -b` + `vite build` OK.
- **visuel (→ VALIDATION.md) :** glisser une carte de la réserve au tableau la place au point de
  dépôt ; la glisser hors du tableau (ou dans la réserve) la renvoie au bac ; plus de boutons
  « Placer / Retirer » ; au clavier, Entrée place une carte de réserve et Suppr retire une carte
  placée ; repositionnement intra-tableau et nudge flèches toujours OK ; utilisable à ~1 m.

## Si bloqué
Si le transfert HTML5 pose problème (image de drag, `dataTransfer` sur certains éléments) →
stocker l'`id` glissé dans un état React au `dragstart` plutôt que dans `dataTransfer`. Si le drag
inter-zones reste instable malgré HTML5 → **ne pas supprimer** le fallback clavier et signaler à
Thibault avant de retirer toute alternative souris. Doute → STOP.

## Commit
`feat(motivation): placer/retirer les cartes par glisser-déposer (réserve ↔ tableau) + clavier (A12)`

## Statut
[ ] à faire
