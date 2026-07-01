# V1 — Addiction : agrandir le diagramme de Venn · Modèle : Haiku, effort : low

> Lire UNIQUEMENT ce fichier + les fichiers « Lire ». Design fixé par Opus. Doute → STOP.

- **Capture :** `corrections/Trop petit. Illisible.PNG`
- **But :** le diagramme de Venn 3 cercles est trop petit et illisible à ~1 m. L'agrandir
  nettement (cercles + labels + mots-clés), sans casser la sélection ni le placement des hitAreas.

## Lire
- `src/features/addiction/AddictionModule.tsx`
- `src/features/addiction/AddictionModule.module.css`

## Modifier
- `src/features/addiction/AddictionModule.module.css` (dimension du `.vennWrap` / `.venn`)
- éventuellement `src/features/addiction/AddictionModule.tsx` (constantes `VIEW_W/VIEW_H/R`,
  `font-size` des `<text>` labels/keywords) si l'agrandissement CSS ne suffit pas.

## Hors périmètre
- Ne PAS toucher au contenu (`PILLARS_DATA`), aux panneaux « Outils & stratégies », ni à la
  logique de sélection. Le menu radial des items est traité séparément en **V2**.

## Étapes
1. Augmenter la taille rendue du diagramme : élargir `.vennWrap`/`.venn` (viser une largeur
   utile ~480–560 px sur desktop, borné par `.content` 960px) et sa hauteur proportionnelle
   (le viewBox reste `600×460`, on agrandit l'échelle de rendu — pas de reflow du contenu SVG).
2. Vérifier que les `.hitArea` (positionnés en % du viewBox) restent alignés sur les cercles
   après agrandissement (ils sont déjà en %, donc suivent — juste re-vérifier).
3. Augmenter la lisibilité des textes SVG : `circleLabel` et `circleKeywords` plus grands
   (ex. via `font-size` en unités du viewBox), sans déborder des cercles.
4. Conserver la sobriété : pas d'ombres/effets nouveaux, respecter les tokens couleur.

## Validation
- **auto :** `tsc -b` + `vite build` OK.
- **visuel (→ VALIDATION.md) :** le Venn est nettement plus grand, labels lisibles à ~1 m ;
  cliquer chaque cercle sélectionne toujours le bon pilier ; pas de débordement de `.content`.

## Si bloqué
Si l'agrandissement provoque un débordement horizontal sur mobile → borner en `max-width`
et laisser le SVG se réduire proportionnellement. Sinon STOP + signaler.

## Commit
`fix(addiction): agrandir le diagramme de Venn pour lisibilité à 1 m (V1)`

## Statut
[ ] à faire
