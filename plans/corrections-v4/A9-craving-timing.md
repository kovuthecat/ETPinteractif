# A9 — Craving : ne pas afficher « C'est passé » dès l'activation d'un outil · Modèle : Sonnet, effort : medium

> Lire UNIQUEMENT ce fichier + les fichiers « Lire ». Design fixé par Opus. Doute → STOP.
> **Postérieur à V5 (les 4 D masquent le pic).** Ne pas revenir sur l'opacité du pic.

- **Source :** `AUDIT_UI_UX_PLAYWRIGHT.md` §6 « Craving (4D) ».
- **But :** après « Passer 30 s », activer « Différer » affiche **immédiatement** « C'est passé »,
  ce qui **vide l'outil de son intérêt**. Encourager l'activation **pendant la montée / au pic**.

## Diagnostic (déjà fait)
`passerVague()` pose `progress = 1` (cf. `CravingModule.tsx` l.133-139). Le détail de la carte
« Différer » calcule `remainingS = ceil((1 - progress) * DURATION_MS / 1000)` (l.159) → **0** dès
que `progress === 1`, donc « C'est passé. » (l.171-174). L'outil activé après la vague n'a plus
rien à « différer ».

## Lire
- `src/features/craving/CravingModule.tsx`
- `src/features/craving/CravingModule.module.css`

## Modifier
- `src/features/craving/CravingModule.tsx`
- éventuellement `src/features/craving/CravingModule.module.css`

## Hors périmètre
- Ne pas changer la courbe/`bellValue`, l'opacité du pic (V5) ni la durée. Aucune dépendance.
  Zéro persistance.

## Conception (fixée)
- **Distinguer « vague en cours » de « vague déjà passée / pas lancée »** pour le détail de
  « Différer » : au lieu d'afficher « C'est passé. » quand la vague **n'est pas active**, inviter
  à la lancer et à différer **pendant** qu'elle monte, ex. :
  - vague pas encore lancée **ou** déjà passée (`!running` et (`progress === 0` ou `progress >= 1`))
    → « Lancez la vague et différez pendant qu'elle monte. »
  - vague en cours (`running`) → garder le compte à rebours « Encore N s… », puis « C'est passé. »
    seulement lorsque la vague **se termine réellement en cours d'usage**.
- **Inciter au bon timing** : quand un outil est activé alors que la vague n'est pas en cours,
  proposer un rappel discret « Déclenchez “Une envie arrive” pour voir l'effet » (ou, au choix de
  Thibault, **relancer** la vague à l'activation d'un outil depuis l'état idle/passé — décision à
  valider, ne pas l'imposer).
- Cohérent avec le sous-titre existant : « ils viennent occuper le pic de la vague, qui continue
  de redescendre derrière ».

## Étapes
1. Introduire un booléen dérivé `vagueEnCours = running` (et un état « passée » = `!running &&
   progress >= 1`).
2. Adapter le détail de la carte « Différer » selon l'état (voir Conception) — ne plus afficher
   « C'est passé. » quand la vague n'a pas réellement été différée en direct.
3. (Optionnel, si validé) petit indice invitant à lancer la vague quand un outil est activé hors
   vague.

## Validation
- **auto :** `tsc -b` + `vite build` OK.
- **visuel (→ VALIDATION.md) :** activer « Différer » juste après « Passer 30 s » n'affiche PAS
  « C'est passé » d'emblée, mais invite à différer pendant la montée ; en lançant la vague puis en
  différant, le compte à rebours s'écoule et « C'est passé » n'apparaît qu'à la fin réelle.

## Si bloqué
Si la logique d'états devient confuse → se limiter à remplacer le « C'est passé » prématuré par le
message d'invitation quand `!running`, et signaler. Doute → STOP.

## Commit
`fix(craving): « Différer » n'affiche « C'est passé » que si la vague a réellement été différée (A9)`

## Statut
[ ] à faire
