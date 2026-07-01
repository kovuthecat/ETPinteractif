# A5 — Addiction : vocabulaire desktop + légende couleur↔symptômes↔stratégies · Modèle : Sonnet, effort : medium

> Lire UNIQUEMENT ce fichier + les fichiers « Lire ». Design fixé par Opus. Doute → STOP.
> **Postérieur à V1 (Venn agrandi) et V2 (radial).** Ne pas refaire ces deux points.

- **Source :** `AUDIT_UI_UX_PLAYWRIGHT.md` §1 « Composantes de l'addiction ».
- **But :** (a) usage **desktop exclusif** → remplacer le vocabulaire tactile « Touchez » par
  « Cliquez » ; (b) **retirer « nicotinique »** du titre de la composante physique ; (c) une fois
  un cercle agrandi, son libellé **chevauche** les autres et des bulles s'éloignent de leur
  source → ajouter une **légende/transition** reliant couleur, symptômes et stratégies.

## Lire
- `src/features/addiction/AddictionModule.tsx`
- `src/features/addiction/AddictionModule.module.css`
- `docs/contenu-modules.md` §Module 1 (dimensions physique / psycho / comportementale)

## Modifier
- `src/features/addiction/AddictionModule.tsx`
- `src/features/addiction/AddictionModule.module.css`

## Hors périmètre
- Ne pas refaire l'agrandissement (V1) ni le menu radial (V2). Aucune dépendance. Ne pas inventer
  de contenu clinique (rester dans `docs/contenu-modules.md`).

## Conception (fixée)
- **Vocabulaire desktop** : remplacer toute occurrence « Touchez » / « touchez » par « Cliquez »
  (rechercher aussi « appuyez », « tapez » le cas échéant). L'app est desktop-only (audit).
- **Titre composante physique** : retirer « nicotinique » (ex. « Dépendance physique
  nicotinique » → « Dépendance physique »). Vérifier la cohérence avec le contenu source.
- **Légende / lisibilité** : ajouter une **légende explicite** reliant, pour la dimension
  sélectionnée : sa **couleur** → ses **symptômes** → ses **stratégies**. Réduire le
  chevauchement des libellés quand un cercle est agrandi (positionnement du libellé, ou fond/halo
  derrière le texte pour le détacher ; rapprocher les bulles de symptômes/stratégies de leur
  cercle source, ou les ancrer visuellement par un trait/liseré de la couleur de la dimension).
- Sobriété : réutiliser les tokens de couleur existants ; lisible à ~1 m.

## Étapes
1. TSX : remplacer « Touchez » → « Cliquez » (tous emplacements). Retirer « nicotinique » du
   libellé de la composante physique (données + éventuels textes associés).
2. TSX/CSS : ajouter une légende couleur → symptômes → stratégies (bloc discret sous/à côté de la
   scène) pour la dimension active.
3. CSS : atténuer le chevauchement des libellés agrandis (halo/fond, z-index, ou repositionnement)
   et rattacher visuellement les bulles à leur cercle (couleur/liseré).

## Validation
- **auto :** `tsc -b` + `vite build` OK.
- **visuel (→ VALIDATION.md) :** plus aucun « Touchez » (desktop) ; le titre physique ne dit plus
  « nicotinique » ; cercle agrandi = libellé lisible sans chevauchement gênant ; la relation
  couleur ↔ symptômes ↔ stratégies est explicite ; lisible à ~1 m.

## Si bloqué
Si le repositionnement des libellés est trop invasif → privilégier un **fond/halo** derrière le
texte agrandi (correctif local) + la légende, et signaler le reste. Doute → STOP.

## Commit
`fix(addiction): vocabulaire desktop, titre physique, légende couleur/symptômes/stratégies (A5)`

## Statut
[ ] à faire
