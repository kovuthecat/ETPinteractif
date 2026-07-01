# A4 — Coquille : « Sources » explicite + focus clavier visible · Modèle : Sonnet, effort : low

> Lire UNIQUEMENT ce fichier + les fichiers « Lire ». Design fixé par Opus. Doute → STOP.
> **Générique (coquille)** : impacte tous les modules. Rester sobre et multi-thèmes.

- **Source :** `AUDIT_UI_UX_PLAYWRIGHT.md` §« P1 — Clarifier les affordances communes ».
- **But :** Retour et Sources apparaissent comme de petites icônes aux extrémités d'un grand
  bandeau. Le bouton **Sources** (icône `Info` seule) est facile à ignorer, alors que le
  sourçage est essentiel dans ce contexte. Renforcer aussi le **focus clavier visible**.

## Lire
- `src/components/Sources.tsx` + `src/components/Sources.module.css`
- `src/components/ModuleShell.tsx` + `src/components/ModuleShell.module.css`

## Modifier
- `src/components/Sources.tsx` + `src/components/Sources.module.css`
- éventuellement `src/components/ModuleShell.module.css` (focus du bouton Retour)

## Hors périmètre
- Ne pas changer la structure de l'en-tête (retour à gauche, titre centré, sources à droite).
  Aucune dépendance. Ne pas casser la généricité (pas de contenu tabac).

## Conception (fixée)
- **Libellé « Sources » visible** : le déclencheur affiche le mot **« Sources »** en toutes
  lettres à côté (ou à la place de) l'icône `Info` — au minimum un libellé visible au
  survol/focus. Conserver `aria-label`/`aria-expanded`. Cible ≥ 44 px.
- **Focus clavier visible** : `:focus-visible` net (contour contrasté, `outline-offset`) sur le
  bouton Sources ET le bouton Retour de `ModuleShell`, cohérent avec le style de focus déjà
  utilisé dans les modules (ex. `outline: 3px solid …; outline-offset: 2px`).
- Garder le **titre centré** et la sobriété.
- **Note (hors périmètre strict, à signaler)** : le popover affiche « Sources : à compléter »
  parce qu'aucun module ne renseigne `sources` dans `registry.ts`. Le remplissage des références
  est **autorité Thibault** (cf. `docs/contenu-modules.md`, « références de sources exactes par
  module — à fournir »). Ne pas inventer de références ici ; le signaler dans VALIDATION.md.

## Étapes
1. `Sources.tsx` : afficher le texte « Sources » (visible en permanence ou a minima au
   survol/focus) à côté de l'icône ; conserver l'accessibilité.
2. `Sources.module.css` : styliser le libellé + un `:focus-visible` marqué.
3. `ModuleShell.module.css` : renforcer le `:focus-visible` du bouton Retour.

## Validation
- **auto :** `tsc -b` + `vite build` OK.
- **visuel (→ VALIDATION.md) :** le bouton Sources se lit comme « Sources » (plus une simple
  icône) ; navigation clavier : Retour et Sources ont un focus nettement visible ; titre toujours
  centré ; signaler « références de sources à fournir par Thibault ».

## Si bloqué
Si l'ajout du libellé déséquilibre l'en-tête sur petit desktop → afficher le mot au survol/focus
seulement (garder l'icône par défaut). Doute → STOP.

## Commit
`feat(coquille): libellé « Sources » explicite + focus clavier visible (A4)`

## Statut
[ ] à faire
