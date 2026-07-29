# 2026-07-09 — Extensions tabac au niveau du brief diabète, en v1 directe sans maquette

### Décision

Suite à l'analyse comparative code tabac ↔ brief diabète (session Fable du 2026-07-09), lancer
5 chantiers d'extension du thème tabac, **sans passage par Claude Design** (v1 directe composée
depuis le design system existant) :

1. **Fiches à emporter imprimables** (4 : carte anti-envie, méthode patch, mes raisons, plan
   d'arrêt) via un composant générique `FicheOverlay` — impression à la volée, zéro persistance.
2. **Nouveau module « Mon plan d'arrêt »** (famille Agir) — le module d'application qui clôt
   l'arc, fiche « frigo » à ROI maximal.
3. **Généralisation des portes de fin de module** (`ModuleFooterNav`, extrait de nicotine-toxique)
   et du **2ᵉ niveau de lecture** (`InfoHover`, extrait des tooltips de zones de nicotine).
4. **Fil rouge** du thème : « C'est la fumée qui rend malade. C'est le manque qui fait fumer.
   Et le manque, ça se traite. » (exergue accueil + clôtures Comprendre + pieds de fiches).
5. **`docs/BRIEF_TABAC.md`** : nouveau référentiel design/pédagogie du thème (rédigé par Fable,
   le code faisant foi pour l'existant) + resynchronisation des docs dépassées.

### Contexte

Le brief diabète (`docs/diabete/BRIEF_DESIGN_diabete.md`) a posé une barre de conception
(fiches à emporter, personnalisation, fil rouge, ponts scénarisés, 2ᵉ niveau au survol) que le
thème tabac — construit avant — n'atteint pas, alors que le code tabac contient déjà des embryons
de ces mécanismes (portes de nicotine-toxique, tooltips de zones de nicotine). Constat clé :
le thème tabac est 100 % démonstration/exploration, sans module d'application ni artefact emporté.

### Alternatives envisagées

- **Maquette Claude Design d'abord** (pipeline Templates habituel pour toute UI nouvelle) —
  écartée pour cette v1 : le module Plan d'arrêt est compositionnel (réutilise chips, quarts de
  patch, 4D, cartes raisons déjà dessinés) et le design system est documenté (`DESIGN_REFONTE.md`).
  Recours possible : repasser par Claude Design si la validation visuelle humaine déçoit.
- Import automatique des raisons (module Motivation → Plan d'arrêt) — écarté : zéro persistance
  inter-modules ; la re-sélection par chips se fait en parlant.

### Raison du choix

Coût d'essai faible (validation visuelle humaine = filet existant), vitesse, et cohérence garantie
par la composition de primitives déjà maquettées.

### Conséquences

- Plans exécutables Sonnet : `plans/extensions-tabac/X1..X7` (vagues : X1 → X2-X5 parallèles → X6 → X7).
- Nouveau référentiel `docs/BRIEF_TABAC.md` ; `contenu-modules-tabac.md` et `STATUS.md` seront
  resynchronisés en X7 (des dérives doc/code y sont recensées).
- Validations Thibault en attente listées dans `BRIEF_TABAC.md §5` (libellé fil rouge, contenus
  2ᵉ niveau + sources, libellés plan d'arrêt) — le 2ᵉ niveau n'est câblé qu'après validation.

### Impact IA

- Pour toute modification du thème tabac : lire `docs/BRIEF_TABAC.md` (design/pédagogie) en plus
  de `contenu-modules-tabac.md` (contenu médical). **Le code reste la source de vérité de
  l'existant** tant que X7 n'a pas resynchronisé les docs.
- `FicheOverlay`, `ModuleFooterNav`, `InfoHover` sont des composants **moteur** (génériques,
  multi-thèmes) : ne jamais y coder de contenu tabac en dur — le thème diabète les réutilisera.

