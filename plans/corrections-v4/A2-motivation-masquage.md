# A2 — Motivation : corriger le masquage des onglets · Modèle : Haiku, effort : minimal

> Lire UNIQUEMENT ce fichier + les fichiers « Lire ». Design fixé par Opus. Doute → STOP.
> **P0 — bug d'affichage.** One-liner CSS. Faire AVANT A10 (même composant).

- **Source :** `AUDIT_UI_UX_PLAYWRIGHT.md` §« P0 — Corriger le masquage des panneaux Motivation ».
- **But :** les deux panneaux d'onglet (`Où en êtes-vous ?` / `Mes raisons`) restent visibles
  **simultanément**. L'état ARIA change bien (`aria-selected`, `hidden={…}`), mais le contenu
  inactif n'est pas masqué → page de ~1 688 px, deux temps d'entretien mélangés.

## Diagnostic (déjà fait)
Le JSX pose bien `hidden={onglet !== '…'}` sur chaque `<section className={styles.section}>`
(cf. `MotivationModule.tsx` l.194 et l.253). Mais `MotivationModule.module.css` définit
`.section { display: flex }` (l.7). **Les règles d'auteur battent la règle UA
`[hidden] { display: none }`** → `display:flex` gagne, le panneau « caché » reste affiché.

## Lire
- `src/features/motivation/MotivationModule.module.css`

## Modifier
- `src/features/motivation/MotivationModule.module.css`

## Hors périmètre
- Ne PAS toucher le TSX (le `hidden={…}` est correct). Ne pas démonter les sections (les états
  échelles/cartes doivent survivre au changement d'onglet). Aucune dépendance.

## Conception (fixée)
Ajouter une règle qui rétablit le masquage pour l'élément porteur de `hidden`, avec une
spécificité au moins égale à `.section` :

```css
.section[hidden] {
  display: none;
}
```

(Alternative équivalente et générique si Thibault préfère : `[hidden] { display: none !important }`
dans `global.css` — mais rester **local au module** est plus sûr et suffit ici.)

## Étapes
1. Ajouter `.section[hidden] { display: none; }` dans `MotivationModule.module.css`.
2. Vérifier qu'aucune autre règle `.section` ne réintroduit un `display` plus spécifique.

## Validation
- **auto :** `tsc -b` + `vite build` OK.
- **visuel (→ VALIDATION.md) :** au chargement, seul « Où en êtes-vous ? » est visible ; cliquer
  « Mes raisons » masque les échelles et n'affiche que le tableau ; retour inverse ; la
  navigation clavier gauche/droite entre onglets bascule bien le contenu ; les valeurs des
  échelles et l'état des cartes sont **conservés** en changeant d'onglet.

## Si bloqué
Si le masquage casse un état (ne devrait pas, les sections restent montées) → STOP et signaler.

## Commit
`fix(motivation): masquer réellement le panneau d'onglet inactif (.section[hidden]) (A2)`

## Statut
[ ] à faire
