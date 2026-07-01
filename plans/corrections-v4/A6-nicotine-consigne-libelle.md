# A6 — Nicotine : consigne d'amorce + renommer « État actuel » → « Pic » · Modèle : Sonnet, effort : low

> Lire UNIQUEMENT ce fichier + les fichiers « Lire ». Design fixé par Opus. Doute → STOP.
> **Postérieur à V3 (cumul sur axe fixe).** Ne pas revenir sur le modèle de cumul.
> ⚠ Le **drag-and-drop des items sur la frise** (audit §2) est traité séparément en **A11**
> (validé par Thibault) — **hors périmètre de cette fiche**. Faire A6 avant A11.

- **Source :** `AUDIT_UI_UX_PLAYWRIGHT.md` §2 « Nicotine : cinétique & seuils ».
- **But :** (a) ajouter une **courte consigne** d'amorce (« Ajoutez plusieurs prises et
  observez… ») ; (b) le libellé « **État actuel** » désigne en réalité le **pic** calculé → le
  renommer pour lever l'ambiguïté ; (c) améliorer la lisibilité de la frise (événements trop
  concentrés tôt sur l'axe, petits pictogrammes).

## Lire
- `src/features/nicotine/NicotineModule.tsx`
- `src/features/nicotine/NicotineModule.module.css`

## Modifier
- `src/features/nicotine/NicotineModule.tsx`
- `src/features/nicotine/NicotineModule.module.css`

## Hors périmètre
- Ne PAS toucher `src/lib/nicotineCurve.ts` ni les amplitudes (réglées en V3). Ne pas réintroduire
  d'animation/curseur. Ne pas implémenter le drag-and-drop (traité en A11). Aucune dépendance.

## Conception (fixée)
- **Consigne courte** au-dessus des contrôles : une phrase d'amorce sobre, ex. « Ajoutez des
  prises (cigarette, patch…) et observez l'évolution de la nicotinémie. »
- **Renommer le chip** : « État actuel » → « **Pic** » (ou « Pic atteint »), puisqu'il reflète la
  zone du point le plus haut (cf. décision V3). Ajuster le libellé, pas la logique.
- **Lisibilité de la frise** : si simple, mieux répartir/espacer les marqueurs d'événements et
  agrandir légèrement les pictogrammes ; éventuellement une courte **liste des prises jouées**
  (texte) sous le graphe. Ne pas complexifier — rester lisible à ~1 m.

## Étapes
1. Ajouter la phrase de consigne (au-dessus des gestes).
2. Renommer le libellé « État actuel » → « Pic » dans le TSX (et tout `aria-label` associé).
3. (Si simple) espacer les marqueurs / agrandir les pictogrammes ; ou ajouter une liste des prises.

## Validation
- **auto :** `tsc -b` + `vite build` OK.
- **visuel (→ VALIDATION.md) :** consigne visible et sobre ; le chip dit « Pic » (plus « État
  actuel ») ; les prises/pictogrammes sont plus lisibles ; comportement de cumul inchangé.

## Si bloqué
Si l'espacement des marqueurs touche la logique de placement (`nextEventTime`) → se limiter à la
consigne + renommage + liste texte, et signaler. Doute → STOP.

## Commit
`fix(nicotine): consigne d'amorce + renommer « État actuel » en « Pic », frise plus lisible (A6)`

## Statut
[ ] à faire
