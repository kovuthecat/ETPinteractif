# A3 — Accueil : grille intentionnelle par familles · Modèle : Sonnet, effort : medium

> Lire UNIQUEMENT ce fichier + les fichiers « Lire ». Design fixé par Opus. Doute → STOP.

- **Source :** `AUDIT_UI_UX_PLAYWRIGHT.md` §« P1 — Rendre l'accueil plus intentionnel » + §Accueil.
- **But :** les 7 modules forment 2 rangées de 3 + une carte isolée → « Explorer ma motivation »
  a un statut visuel **accidentel**. Les résumés sont utiles mais petits et denses. Donner une
  **structure assumée** (familles) et une meilleure lisibilité à ~1 m.

## Lire
- `src/components/Home.tsx` + `src/components/Home.module.css`
- `src/components/ModuleCard.tsx` + `src/components/ModuleCard.module.css`
- `src/features/registry.ts` + `src/features/types.ts`

## Modifier
- `src/features/types.ts` (ajouter un champ `famille` à `ModuleDef`)
- `src/features/registry.ts` (renseigner la famille de chaque module)
- `src/components/Home.tsx` + `src/components/Home.module.css`
- éventuellement `src/components/ModuleCard.module.css` (corps/interligne du résumé)

## Hors périmètre
- Ne PAS coder « tabac » en dur dans le moteur : le regroupement se fait par **donnée**
  (`famille` dans le registre), pas par `if (id === …)` dans `Home`. Aucune dépendance runtime.
  Ne pas toucher au contenu interactif des modules.

## Conception (fixée)
- **Trois familles** (regroupement pédagogique), portées par `ModuleDef.famille`:
  - **Comprendre** : addiction, nicotine, nicotine-toxique, soulagement.
  - **Agir** : substituts, craving.
  - **Se motiver** : motivation.
- **Rendu** : `Home` groupe `MODULES` par `famille` (ordre stable défini par une constante
  `FAMILLES` d'ordre), un petit intertitre discret par famille au-dessus de sa rangée de cartes.
  Motivation devient une **famille assumée** (plus une carte « orpheline »).
- **Résumés** : augmenter légèrement `font-size`/`line-height` du résumé dans `ModuleCard`
  (lisibilité partagée à distance) ; ne pas raccourcir le sens, mais tolérer un résumé plus court
  si Thibault le fournit (le texte vit dans `registry.ts`).
- **(Optionnel, si simple)** indiquer le **type d'activité** par une micro-étiquette
  (ex. « manipulation », « échelle », « repères ») via un champ optionnel — sinon laisser pour
  un lot ultérieur (ne pas bloquer).
- Sobriété : réutiliser les tokens ; cibles cliquables inchangées (cartes entièrement cliquables).

## Étapes
1. `types.ts` : ajouter `famille: string` (ou union `'comprendre' | 'agir' | 'motivation'`) à `ModuleDef`.
2. `registry.ts` : renseigner `famille` pour les 7 modules (voir répartition ci-dessus).
3. `Home.tsx` : définir l'ordre des familles + libellés, grouper et rendre une section par famille
   avec un intertitre.
4. `Home.module.css` : styliser les intertitres (discrets) et les rangées ; garder une grille
   responsive lisible à ~1 m.
5. `ModuleCard.module.css` : augmenter légèrement corps/interligne du résumé.

## Validation
- **auto :** `tsc -b` + `vite build` OK.
- **visuel (→ VALIDATION.md) :** trois familles distinctes et titrées ; plus de carte
  « orpheline » ; Motivation a un statut assumé ; résumés lisibles à ~1 m ; cartes toujours
  entièrement cliquables.

## Si bloqué
Si l'union de familles complique la généricité multi-thèmes → utiliser une simple `string` libre
+ un ordre déclaré dans `Home`. Doute → STOP.

## Commit
`feat(accueil): regrouper les modules par familles (Comprendre / Agir / Se motiver) (A3)`

## Statut
[ ] à faire
