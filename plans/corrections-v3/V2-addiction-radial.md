# V2 — Addiction : items « De quoi parle-t-on » en menu radial · Modèle : Sonnet, effort : medium

> Lire UNIQUEMENT ce fichier + les fichiers « Lire ». Design fixé par Opus. Doute → STOP.
> **Dépend de V1** (même composant) : faire V2 après V1.

- **Capture :** `corrections/Les items de quoi parle ton doit se disposer autour du cercle (un peu comme un menu radial) et pas le recouvrir ni masque les autres.PNG`
- **But :** quand un cercle est sélectionné, ses `exemples` doivent se disposer **en arc/menu
  radial autour du cercle sélectionné**, sans recouvrir ce cercle ni masquer les autres.
  Aujourd'hui ils s'empilent en liste et recouvrent le diagramme.

## Lire
- `src/features/addiction/AddictionModule.tsx`
- `src/features/addiction/AddictionModule.module.css`

## Modifier
- `src/features/addiction/AddictionModule.tsx` (rendu des bulles d'exemples)
- `src/features/addiction/AddictionModule.module.css` (styles des bulles radiales)

## Hors périmètre
- Ne PAS modifier le contenu des `exemples` ni le panneau « Outils & stratégies » (reste en
  flux sous le diagramme). Ne pas ré-agrandir le Venn (fait en V1).

## Conception (fixée)
- Au clic sur un pilier, calculer pour chacun de ses `exemples` une position sur un **arc
  centré sur le cercle sélectionné**, rayon légèrement > R (bulles hors du cercle).
- **Choix du secteur d'arc** selon le pilier, pour s'éloigner des deux autres cercles :
  - `physique` (haut-gauche, cx=210) → arc ouvert vers la **gauche/haut** (≈ 120°→240°).
  - `psychologique` (haut-droite, cx=390) → arc vers la **droite/haut** (≈ -60°→60°).
  - `comportementale` (bas, cy=300) → arc vers le **bas** (≈ 30°→150°, en bas).
- Répartir les N exemples régulièrement sur le secteur ; un trait/segment discret peut relier
  la bulle au bord du cercle (optionnel, sobre). Bulles reprennent `--pillar-color`.
- Positionnement : en % du `.vennWrap` (comme les `.hitArea`) pour rester alignées quelle que
  soit la taille rendue. Le cercle sélectionné passe déjà au premier plan (`renderOrder`).

## Étapes
1. Remplacer le bloc `.explorePanel`/`.bubbleRow` (liste sous forme de panneau) par un rendu
   **positionné autour du cercle sélectionné** dans `.vennWrap`.
2. Ajouter une fonction utilitaire calculant `(left%, top%)` de chaque bulle à partir de
   l'angle sur le secteur du pilier + rayon, dérivée de `p.cx/p.cy/R` et `VIEW_W/VIEW_H`.
3. Styler les bulles (`position:absolute`, `transform: translate(-50%,-50%)`, fond clair
   `--pillar-color-soft`, bordure `--pillar-color`, texte lisible, cible tactile correcte).
4. Garder un titre discret « De quoi parle-t-on ? — {label} » (au-dessus ou dans le flux),
   sans recouvrir le diagramme.
5. Vérifier qu'aucune bulle ne masque un autre cercle ni les hitAreas actives.

## Validation
- **auto :** `tsc -b` + `vite build` OK.
- **visuel (→ VALIDATION.md) :** sélectionner chaque pilier → ses items s'affichent en
  éventail autour du bon cercle, lisibles, sans recouvrir les autres cercles ; désélection
  les retire ; pas de chevauchement gênant sur mobile.

## Si bloqué
Si 7 items ne tiennent pas sur un secteur sans se chevaucher → augmenter le rayon et/ou
élargir le secteur ; en dernier recours réduire à un secteur plus large (jusqu'à ~300°) mais
en laissant libre le côté des cercles voisins. Si toujours impossible proprement → STOP + signaler.

## Commit
`fix(addiction): disposer les items en menu radial autour du cercle sélectionné (V2)`

## Statut
[x] fait
