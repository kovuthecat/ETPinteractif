# A11 — Nicotine : glisser-déposer les prises sur la frise · Modèle : Sonnet, effort : high

> Lire UNIQUEMENT ce fichier + les fichiers « Lire ». Design fixé par Opus. Doute → STOP.
> **Postérieur à V3 (cumul sur axe fixe) et à A6 (consigne + libellé).** Décision validée par
> Thibault (2026-07-01) : remplacer le clic par un **drag-and-drop des items sur la frise**.

- **Source :** `AUDIT_UI_UX_PLAYWRIGHT.md` §2 (« Remplacer le simple clic … par un drag and drop
  des items sur la timeline ») + arbitrage Thibault (VALIDÉ).
- **But :** aujourd'hui, cliquer un geste ajoute une prise au **temps suivant** automatique
  (`nextEventTime`, cf. `NicotineModule.tsx` l.116-118). L'utilisateur ne choisit pas **quand**.
  Permettre de **glisser** un item (cigarette / substitut ponctuel / vapoteuse / patch) et de le
  **déposer sur la frise** au moment (position horizontale = temps `t`) choisi.

## Lire
- `src/features/nicotine/NicotineModule.tsx`
- `src/features/nicotine/NicotineModule.module.css`
- `src/lib/nicotineCurve.ts` (type `CurveEvent = { kind, t }`, `sampleCurve`)

## Modifier
- `src/features/nicotine/NicotineModule.tsx`
- `src/features/nicotine/NicotineModule.module.css`

## Hors périmètre
- Ne PAS toucher `nicotineCurve.ts` ni les amplitudes (V3). Ne pas réintroduire d'animation/curseur.
  **Aucune dépendance** (drag natif HTML5 `draggable` + `onDragStart/onDragOver/onDrop`, ou pointer
  events ; pas de lib DnD). Zéro persistance.

## Conception (fixée)
- **Items déplaçables** : les 4 gestes (`EVENTS_DEF`) deviennent des **vignettes déplaçables**
  (`draggable`), portant leur `kind`. Au `dragstart`, stocker le `kind` (dataTransfer ou état).
- **Zone de dépôt = la frise** : le `<svg>` (ou un calque de dépôt au-dessus) accepte le drop.
  Au `drop`, calculer `t` à partir de la position X relative :
  `t = clamp((clientX - svgLeft) / svgWidth, FIRST_EVENT_T, MAX_EVENT_T)` ; ajouter
  `{ kind, t }` à `events`. La courbe cumulée se recalcule (inchangé).
- **Retrait d'une prise** : permettre de **retirer** une prise déposée (ex. clic sur son
  pictogramme sous l'axe, ou re-glisser hors frise) → cohérent avec « Réinitialiser » qui vide tout.
- **Fallback accessibilité (obligatoire, desktop clavier)** : garder un moyen **non-drag**
  d'ajouter une prise — au minimum un clic/Enter sur l'item qui la dépose au **temps suivant**
  (`nextEventTime`, logique actuelle conservée en fallback). Les items sont des contrôles
  focusables ; `aria-label` explicite (« Glisser une cigarette sur la frise, ou activer pour
  l'ajouter à la suite »).
- **Indice visuel de dépôt** : au survol de la frise pendant un drag, un repère vertical (ligne
  fantôme) indique où la prise tombera. Sobriété, tokens existants.
- Conserver le pictogramme sous l'axe à la position `t` de chaque prise (déjà rendu l.201-209).

## Étapes
1. Rendre chaque item de `.gestes` déplaçable (`draggable`), transmettre son `kind` au dragstart.
2. Ajouter les handlers `onDragOver` (preventDefault + repère) et `onDrop` sur la frise ; calculer
   `t` depuis la position X et pousser l'événement.
3. Ajouter le retrait d'une prise (clic sur pictogramme, ou re-glisser dehors).
4. Conserver le fallback clic/clavier (ajout au temps suivant) + `aria-label` clairs.
5. CSS : styles des items déplaçables (curseur `grab`), du repère de dépôt, des pictogrammes
   retirables ; cibles ≥ 44 px.
6. Vérifier le cumul : plusieurs prises rapprochées cumulent toujours vers le haut (V3 inchangé).

## Validation
- **auto :** `tsc -b` + `vite build` OK (pas de test lib touché).
- **visuel (→ VALIDATION.md) :** on glisse une cigarette sur la frise et la prise apparaît **là où
  on la dépose** ; déposer plusieurs prises proches fait cumuler la courbe ; on peut retirer une
  prise ; le fallback clavier/clic ajoute encore une prise ; aucun curseur qui défile.

## Si bloqué
Si le drop précis sur le `<svg>` est fragile (coordonnées/scale du viewBox) → utiliser un calque
HTML de dépôt superposé au SVG (mêmes dimensions) pour lire `clientX` proprement, et convertir en
`t`. Si le drag natif reste instable → pointer events avec un « fantôme » suivant le curseur.
Signaler le choix dans VALIDATION.md. Doute → STOP.

## Commit
`feat(nicotine): glisser-déposer les prises sur la frise (position = temps), fallback clavier (A11)`

## Statut
[ ] à faire
