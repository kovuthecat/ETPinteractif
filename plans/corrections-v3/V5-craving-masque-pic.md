# V5 — Craving : les 4 D masquent progressivement le pic · Modèle : Sonnet, effort : medium

> Lire UNIQUEMENT ce fichier + les fichiers « Lire ». Design fixé par Opus. Doute → STOP.

- **Capture :** `corrections/Les 4 D doivent littéralement masquer de plus en plus le pic (par opacité mais tout en restant lisible) pas se positionner en dessous de la courbe.PNG`
- **But :** les cartes des 4 D ne doivent plus se ranger **sous** le graphe (ni en overlay
  décalé). Elles doivent **littéralement recouvrir le pic** de la vague, et **chaque D activé
  masque un peu plus le pic** (opacité croissante du pic derrière les cartes), tout en restant
  **lisibles**. Métaphore : les outils « occupent » l'envie jusqu'à la faire disparaître.

## Lire
- `src/features/craving/CravingModule.tsx`
- `src/features/craving/CravingModule.module.css`

## Modifier
- `src/features/craving/CravingModule.tsx`
- `src/features/craving/CravingModule.module.css`

## Hors périmètre
- Ne PAS changer la logique de la vague (`bellValue`, animation `lancerVague`, marqueur), ni
  les boutons « Une envie arrive »/« Passer 30 s », ni le contenu des cartes/widgets (respiration, eau).

## Conception (fixée)
- **Overlay centré sur le pic** : les cartes actives se positionnent **au-dessus de la zone du
  pic** (autour de `PEAK_X`, partie haute du graphe), superposées au SVG — supprimer la
  bascule `overlayZoneBelow` (« sous le graphe quand ≥2 outils ») : les cartes restent TOUJOURS
  sur le pic.
- **Masquage progressif du pic** : plus il y a de D actifs, plus le **pic est masqué**. Deux
  leviers combinés :
  1. les cartes elles-mêmes recouvrent physiquement le pic (empilées/juxtaposées sur la zone haute) ;
  2. le tracé du pic derrière est **atténué proportionnellement** au nombre de D actifs
     (opacité décroissante : 1 D → léger, 4 D → pic quasi effacé mais courbe encore devinable).
     Généraliser l'actuel `courbeAttenuee` (aujourd'hui lié au seul `distraire`) en une
     atténuation **graduée** selon `activeTools.size`.
- **Lisibilité** : les cartes gardent un fond opaque/lisible (le masquage concerne le PIC
  derrière, pas le texte des cartes). Cible tactile et texte ≥ tokens de base.
- Bornage : rester dans le cadre du graphe (`.graphWrap`), pas de débordement (invariant R3).
  Avec 4 cartes sur la zone du pic, prévoir une disposition compacte (grille 2×2 ou empilement
  léger) centrée sur `PEAK_X`, semi-recouvrante pour évoquer l'accumulation.

## Étapes
1. Supprimer la logique `trop`/`overlayZoneBelow` : un seul conteneur d'overlay, ancré sur le pic.
2. Positionner `.overlayZone` au-dessus du pic (centré horizontalement ~`PEAK_X`, calé en haut
   du `.graphWrap`), avec disposition compacte pour 1→4 cartes.
3. Remplacer `courbeAttenuee` binaire par une **opacité graduée** de la courbe/du pic pilotée
   par `activeTools.size` (ex. variable CSS `--pic-opacity` calculée en TSX, ou classes 1/2/3/4).
4. Vérifier la lisibilité des cartes (fond opaque) et l'absence de débordement du cadre.
5. Ajuster le sous-titre de la section « Les 4 D » si besoin (le message « viennent occuper le
   pic » reste valide).

## Validation
- **auto :** `tsc -b` + `vite build` OK.
- **visuel (→ VALIDATION.md) :** activer 1 D → une carte couvre le pic, pic légèrement estompé ;
  activer 2, 3, 4 → le pic est de plus en plus masqué jusqu'à quasi disparaître, cartes toujours
  lisibles ; rien ne déborde du cadre ; désactiver rétablit le pic.

## Si bloqué
Si 4 cartes ne tiennent pas sur la zone du pic sans illisibilité → réduire leur taille sur la
zone haute et/ou les faire se chevaucher partiellement (l'accumulation est voulue), en gardant
le titre de chaque carte lisible. Doute → STOP.

## Commit
`fix(craving): les 4 D recouvrent et masquent progressivement le pic (V5)`

## Statut
[x] fait
