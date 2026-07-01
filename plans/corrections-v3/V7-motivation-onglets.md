# V7 — Motivation : scinder en 2 onglets · Modèle : Sonnet, effort : low

> Lire UNIQUEMENT ce fichier + les fichiers « Lire ». Design fixé par Opus. Doute → STOP.
> **V8 dépend de V7** (même composant) : faire V7 avant V8.

- **Capture :** `corrections/A scinder en deux onglets. Deux etapes distinctes.PNG`
- **But :** le module empile aujourd'hui « Où en êtes-vous ? » (2 échelles) puis « Mes raisons »
  (tableau) sur une même page. Les présenter comme **2 étapes distinctes via des onglets**.

## Lire
- `src/features/motivation/MotivationModule.tsx`
- `src/features/motivation/MotivationModule.module.css`

## Modifier
- `src/features/motivation/MotivationModule.tsx`
- `src/features/motivation/MotivationModule.module.css`

## Hors périmètre
- Ne PAS modifier le contenu des échelles ni la logique du tableau (le tableau est refondu en
  **V8**). Ne pas ajouter de dépendance. Zéro persistance (l'onglet actif est un état éphémère).

## Conception (fixée)
- Un sélecteur d'onglets en haut du module, 2 onglets :
  1. **« Où en êtes-vous ? »** → la `<section>` des 2 échelles.
  2. **« Mes raisons »** → la `<section>` du tableau blanc.
- État local `onglet: 'echelles' | 'raisons'` (défaut `echelles`). Un seul panneau rendu à la fois.
- Accessibilité : rôle `tablist`/`tab`/`tabpanel`, `aria-selected`, navigation clavier de base ;
  cibles ≥ 44 px, lisibles à ~1 m. Sobriété (tokens existants).

## Étapes
1. Ajouter l'état `onglet` et une barre d'onglets (2 boutons) en tête de `.module`.
2. Rendre conditionnellement chaque `<section>` selon l'onglet actif.
3. Styler la barre d'onglets (`.tabs`, `.tab`, `.tabActive`) dans le CSS module.
4. Vérifier que passer d'un onglet à l'autre **conserve** les valeurs des échelles et l'état du
   tableau (les états vivent dans le composant, ne pas les remonter/démonter inutilement — garder
   les deux sections montées et masquer via CSS **ou** conserver les états au niveau composant).

## Validation
- **auto :** `tsc -b` + `vite build` OK.
- **visuel (→ VALIDATION.md) :** deux onglets visibles ; bascule fluide ; les curseurs et les
  cartes gardent leur état en changeant d'onglet ; lisible à ~1 m.

## Si bloqué
Si le démontage d'une section fait perdre l'état (curseurs/cartes) → masquer par CSS plutôt que
démonter, ou hisser l'état dans le composant parent. Doute → STOP.

## Commit
`feat(motivation): scinder en deux onglets (échelles / raisons) (V7)`

## Statut
[ ] à faire
