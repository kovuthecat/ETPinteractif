# A10 — Motivation : cartes plus larges + sliders bornés 0/10 · Modèle : Sonnet, effort : medium

> Lire UNIQUEMENT ce fichier + les fichiers « Lire ». Design fixé par Opus. Doute → STOP.
> **Postérieur à A2 (masquage) et à V7/V8 (onglets + réserve).** Faire A2 avant.
> ⚠ Remplacer « Placer/Retirer » par du **drag-and-drop** (audit §7) est traité séparément en
> **A12** (validé par Thibault). Cette fiche **garde les boutons** ; A12 les retirera **après**.
> Faire A10 avant A12.

- **Source :** `AUDIT_UI_UX_PLAYWRIGHT.md` §7 « Motivation ».
- **But :** (a) les cartes sont **étroites** → le titre est **tronqué** ; la réserve coupe les
  libellés longs ; (b) les sliders ont une **piste visuellement fine** et n'affichent pas les
  bornes **0 / 10** ; (c) le tableau blanc est **très haut** et presque vide.

## Diagnostic (déjà fait)
- Carte placée : `.carte { width: 200px }` ; réserve : `.carteInputReserve { width: 180px }`
  (cf. `MotivationModule.module.css` l.183-195, l.138-147) → titres longs tronqués
  (ex. « Retrouver le goût et l'odorat », « Ne plus dépendre de la cigarette »).
- Sliders : `.slider { width: 100%; accent-color: … }` sans indication des bornes (l.72-77) ; la
  valeur « N / 10 » est affichée mais pas les extrémités 0 et 10.
- Tableau : `.whiteboard { min-height: min(70vh, 640px) }` (l.174-181) → très haut même vide.

## Lire
- `src/features/motivation/MotivationModule.tsx`
- `src/features/motivation/MotivationModule.module.css`

## Modifier
- `src/features/motivation/MotivationModule.tsx`
- `src/features/motivation/MotivationModule.module.css`

## Hors périmètre
- Ne PAS retirer les boutons « Placer » / « Retirer » ici (c'est A12 qui le fera). Ne pas casser le
  drag intra-tableau ni le nudge clavier (V8). Aucune dépendance. Zéro persistance.

## Conception (fixée)
- **Cartes plus larges / titre entier** : élargir `.carte` (ex. `width` plus grande ou
  `min-width` + `max-width` avec retour à la ligne) pour que les titres seed s'affichent en
  entier ; l'`input` de titre ne doit pas rogner le texte (autoriser le wrap ou augmenter la
  largeur). Idem `.carteReserve` / `.carteInputReserve` dans la réserve.
- **Sliders** : renforcer la préhension (piste plus épaisse / pouce plus grand, via une hauteur de
  piste et un style de `range` cohérents avec les tokens) et **afficher les bornes 0 et 10** de
  part et d'autre du curseur (petit rang « 0 … 10 » sous la piste), en plus de la valeur courante.
  Cibles ≥ 44 px, lisible à ~1 m.
- **Hauteur du tableau** : rendre `.whiteboard` **moins haut au départ** / adaptatif (réduire la
  `min-height`, ou l'ajuster selon qu'il y a des cartes placées) pour éviter le grand vide.
- Sobriété : réutiliser les tokens ; ne pas introduire de nouvelle palette.

## Étapes
1. CSS : élargir `.carte` et permettre le titre complet (wrap ou largeur) ; idem réserve.
2. CSS : épaissir la piste du `.slider` et agrandir le pouce (styles `range` cross-navigateur
   sobres) ; ajouter un rang de bornes « 0 / 10 » sous chaque échelle (TSX + CSS).
3. CSS : réduire/adapter `min-height` de `.whiteboard`.
4. Vérifier que le drag intra-tableau et le nudge clavier restent OK avec les cartes élargies
   (bornes `MARGIN`/clamp inchangées).

## Validation
- **auto :** `tsc -b` + `vite build` OK.
- **visuel (→ VALIDATION.md) :** les titres de cartes s'affichent en entier (tableau ET réserve) ;
  les sliders ont une piste franche + bornes 0 et 10 visibles ; le tableau n'est plus
  excessivement haut/vide ; drag et clavier toujours fonctionnels ; lisible à ~1 m.

## Si bloqué
Si l'élargissement des cartes provoque des débordements du tableau → borner via `max-width` et
autoriser le wrap du titre plutôt qu'agrandir sans fin ; signaler. Doute → STOP.

## Commit
`fix(motivation): cartes élargies (titre entier), sliders épais + bornes 0/10, tableau adapté (A10)`

## Statut
[ ] à faire
