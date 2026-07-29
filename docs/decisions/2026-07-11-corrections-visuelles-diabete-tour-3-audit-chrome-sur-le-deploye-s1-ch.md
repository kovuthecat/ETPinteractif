# 2026-07-11 — Corrections visuelles diabète, tour 3 (audit Chrome sur le déployé) — S1 : chrome élargi via délégation du rendu du shell

**Contexte** — Décision Thibault : côté diabète uniquement, la barre d'onglets de chaque module
doit vivre sur la même ligne que le titre (pas empilée dessous) et le contenu doit être
nettement plus large (~1240px cible provisoire au lieu de 980px partout). `ModuleShell` est
partagé avec le tabac et doit rester thème-agnostique (invariant 4) : la largeur et le slot de
navigation devaient donc être des props génériques, jamais un test sur le nom du thème.

**Découverte en cours de route** — Le plan supposait que chaque module diabète appelait déjà
`<ModuleShell>` lui-même. En réalité, seul `App.tsx` le fait : il enveloppe génériquement
`<Component>` (le module) dans `<ModuleShell>`, et la barre d'onglets de chaque module vit à
l'intérieur du `Component`, donc dans les `children` de `ModuleShell` — pas dans son `header`.
Pour remonter cette barre dans un slot `nav` rendu par le `header` (un ancêtre), il fallait soit
un portail DOM (complexité/fragilité de timing), soit inverser qui rend `ModuleShell`.

**Décision** — `ModuleDef` gagne un champ générique optionnel `rendersOwnShell?: boolean`
(aucun nom de thème). Quand il est vrai, `App.tsx` ne wrap plus le module : il lui passe
`titre`/`sources`/`onBack` via un nouveau champ optionnel `ModuleProps.shell`, et c'est le module
qui appelle lui-même `<ModuleShell shell.titre ... wide nav={<sa barre d'onglets>}>`. Les 9
modules diabète passent `rendersOwnShell: true` ; le tabac ne le passe jamais (`undefined` →
falsy) donc `App.tsx` garde exactement son ancien chemin (`<ModuleShell><Component/></ModuleShell>`)
— rendu tabac inchangé au pixel par construction, pas seulement par CSS inchangée.

**Largeur retenue** — `wide` (prop booléenne de `ModuleShell`) porte une classe CSS
`.headerWide`/`.contentWide` à `max-width: 1240px` (contre 980px par défaut), marquée
`// à caler visuellement (Thibault)` — valeur de départ, pas un choix définitif validé.

**Modules avec barre remontée dans `nav`** (6/9, ceux qui ont une bascule de vue de premier
niveau) : risque-cardio, alimentation, suivi, hypoglycémie, insuline, activité. **Modules qui
gardent leur contrôle dans le contenu** (3/9, profitent seulement de `wide`) : mécanisme (les
boutons de mode sont du contenu pédagogique, pas une bascule de vue), complications (pas de
barre de premier niveau), traitements (bascule ligne/tous = contrôle interne au module).

**Conséquences** — Toute future prop de mise en page pour un thème passera par ce même schéma
(champ générique sur `ModuleDef`/`ModuleProps`, jamais un `theme === 'x'` dans
`src/components/`). Un nouveau module diabète (cf. S10) doit passer `rendersOwnShell: true` et
suivre le même patron pour bénéficier de `wide`/`nav`.

