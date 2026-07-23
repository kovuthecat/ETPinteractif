# Plan enrichissement-visuel-2026-07 — Finition visuelle & garde-manger de l'app consultation   (rédigé par Opus)

## Objectif d'ensemble

Donner à l'app de consultation un **rendu pro et esthétique partout**, où le visuel **sert le propos
pédagogique**. Issu de l'audit `rapport-audit-consultation-2026-07.md`. Trois axes :

1. **Finir les illustrations déjà prévues** (Cardio Alerte, Tabac Vrai/faux) — génération pilotée par
   **Thibault** ; le rôle de Claude est de préparer les prompts (fait) puis de vérifier le câblage.
2. **Enrichir le garde-manger** (légumes, diversité culturelle, aliments-situations) et ajouter des
   **presets « repas-types »** — côté **cardio ET diabète** — pour illustrer des situations réelles
   de la population MSP.
3. **Finitions de cohérence** (écran de choix de thème, pictos des familles d'aliments cardio).

Traçabilité : ids `V<n>` (Visuel). Autorité contenu : `docs/diabete/`, `docs/cardio/CONTENU_cardio.md`.

## Répartition du travail

- **Thibault** : génère les illustrations à partir des prompts
  (`design/illustrations/prompts-illustrations-diabete.html`), les passe dans le pipeline Pillow
  (`build_assets.py`) pour la transparence, et les dépose dans `public/illustrations/<theme>/`.
- **Claude** : data + câblage + finitions (sessions ci-dessous). **Ne génère aucune image.**

## Périmètre & invariants (rappel)

- **Bundle consultation uniquement.** Zéro persistance (invariant #1) — les compositions d'assiette et
  presets restent en mémoire de session, jamais sur disque.
- **Aucune dépendance runtime ajoutée** (invariant #3). Aucun chiffre médical brut à l'écran
  (paliers qualitatifs) — les valeurs nutritionnelles nourrissent la logique, jamais l'affichage.
- **Généricité multi-thèmes préservée** (invariant #4) : le moteur (`src/components/`, `types.ts`,
  `registry.ts`) ne connaît aucun thème par son nom.
- **Le design est fixé.** On câble sur les patrons existants (`MangerModule` cardio, `AlimentationModule`
  diabète), on ne réinvente pas la mécanique.
- **`IllustrationSlot` gère nativement la couverture partielle** (fallback placeholder) : les data
  peuvent référencer un aliment avant que son PNG existe — aucune régression, juste un placeholder
  transitoire.

## Décisions structurantes (à consigner dans `DECISIONS.md` à la consolidation)

**D1 — Prompts d'illustration : ajoutés le 2026-07-23 (V0, fait).** 23 prompts neufs dans
`prompts-illustrations-diabete.html` : 6 `vf-*` tabac (section `tabac-vf`), 10 légumes
(`gm-legumes-enrichi`), 7 aliments-situations (`gm-situations`). Les 11 prompts Alerte cardio
existaient déjà. Chaque aliment partagé est **déposé dans les deux dossiers** `diabete/` ET `cardio/`
(un seul visuel).

**D2 — Enrichissement garde-manger : appliqué aux DEUX thèmes.** Les nouveaux aliments entrent dans
`features/diabete/alimentation/data.ts` (`FOODS`, avec `cg/fibres/proteines/lipides` + champs 2ᵉ
niveau) **et** `features/cardio/manger/data.ts` (`ALIMENTS_PLATEAU`, avec `sel/graisses`
qualitatifs). Toutes les valeurs neuves sont `// à revalider (Thibault)` (ordres de grandeur
Ciqual/GI-GL, jamais des repères cliniques validés). **Gate G-nutrition.**

**D3 — Diversité culturelle cardio : par copie d'assets, pas de nouveau prompt.** Les féculents
culturels déjà générés côté diabète (`manioc`, `igname`, `banane-plantain`, `couscous-complet`,
`dattes`, `galette-riz`) sont copiés `diabete/ → cardio/` et ajoutés à `ALIMENTS_PLATEAU`.

**D4 — Presets « repas-types » : mécanique partagée, effet spécifique par thème.** Source de vérité
unique (nouveau `src/content/repas-types.ts` : liste de repas → aliments + proportions cibles).
Côté **cardio** (`MangerModule`) : pré-remplit `repFood` + `extras` + les 3 frontières du camembert.
Côté **diabète** (`AlimentationModule`) : pré-remplit l'assiette et **alimente la courbe glycémie**
(`paramsFromAssiette`). Un bouton « Charger un repas-type » ; l'assiette reste ensuite modifiable.
**Gate G-repas** (liste + composition + calibrage clinique = Thibault). Zéro persistance.

**D5 — Familles cardio : picto par repère, sous réserve.** Remplacer la flamme unique de `RepereCard`
par un `IllustrationSlot` `repere-<id>` (nouveaux assets `cardio/repere-*.png`). **Gate G-familles**
(Thibault valide l'approche → Claude ajoute les prompts `repere-*` → Thibault génère → câblage).
Repli sûr si non retenu : garder la flamme, différencier au moins par une teinte/forme.

**D6 — Écran de choix de thème : icône + grille équilibrée.** `ThemeSelector` affiche l'icône
signature de chaque thème (ajouter un champ `icon`/`hue` au besoin dans `ThemeDef`/`registry.ts`,
en restant générique) et équilibre la grille (3 colonnes ou 3 cartes alignées).

## Sessions

| Session | Tâches | Titre | Modèle | Effort | Dépend de | Zone modifiée | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- |
| V0 | — | Prompts d'illustration ajoutés au HTML (6 vf + 10 légumes + 7 situations) | Opus | — | — | `design/illustrations/prompts-illustrations-diabete.html` | [x] fait 2026-07-23 |
| [S1](S1.md) | V1 | Data garde-manger enrichie (légumes + culturel + situations) — diabète + cardio | Sonnet | high | V0 | `features/diabete/alimentation/data.ts`, `features/cardio/manger/data.ts`, copie `public/illustrations/cardio/**` | [x] fait 2026-07-23 · commit `31d92a9` · **G-nutrition** (valeurs `// à revalider`) |
| [S2](S2.md) | V2 | Cardio Manger : garde-manger à onglets de catégories (absorber l'enrichissement) | Sonnet | medium | S1 | `features/cardio/manger/MangerModule.tsx` + `.module.css` | [x] fait 2026-07-23 · commit `78931ce` |
| [S3](S3.md) | V3 | Presets « repas-types » (source partagée + câblage cardio + diabète) | Sonnet | high | S1, **G-repas** | `src/content/repas-types.ts` (créé), `features/cardio/manger/**`, `features/diabete/alimentation/**` | [x] fait 2026-07-23 · commit `bc3577c` · **G-repas** (composition/calibrage `// à revalider`) |
| [S4](S4.md) | V4 | Finition écran « Choisir un thème » (icônes + grille) | Sonnet | low | — | `components/ThemeSelector.tsx` + css, `features/registry.ts`/`types.ts` si champ ajouté | [x] fait 2026-07-23 · commit `09a6cd1` |
| V0-bis | — | Nettoyage prompts : 71 retirés, 23+11 cardio+6 tabac conservés/ajoutés | Opus | low | V0 | `design/illustrations/prompts-illustrations-diabete.html` | [x] fait 2026-07-23 · commit `164886b` |
| [S5](S5.md) | V5 | Familles cardio : picto par repère (remplace la flamme) | Sonnet | medium | **G-familles** + assets `repere-*` générés | `features/cardio/manger/MangerModule.tsx` + css | [ ] pending — bloqué **G-familles** (approche à trancher Thibault) |
| [S6](S6.md) | V6 | Câblage/vérif des illustrations générées (Alerte, vf, aliments) | Haiku | low | Thibault a généré les PNG | `public/illustrations/**` (dépôt), aucune modif code attendue (IllustrationSlot résout par id) | [ ] pending — dépend PNG Thibault (17 aliments + 11 cardio Alerte + 6 tabac vf) |
| [S7](S7.md) | V7 | Consolidation (commits par tâche, statuts, contexte, push) | Haiku | minimal | S1-S4 + V0-bis + STATUS/VALIDATION/DECISIONS/PROJECT_MAP | `STATUS/TASKS/DECISIONS/PROJECT_MAP/VALIDATION/index` + remise en ordre du plan | [x] fait 2026-07-23 (cette consolidation) · commit à venir |

> Les fichiers `S1.md`–`S7.md` se rédigent au lancement de chaque vague (le détail n'est pas figé
> tant que les gates G-repas / G-familles ne sont pas tranchées). Ils sont **cadrés ici** (colonnes
> + §Spécification).

## Ordonnancement

- **Vague 0 — prompts (fait)** : V0. Débloque la génération d'illustrations par Thibault, qui court
  en parallèle de tout le reste (les data peuvent référencer les aliments avant que les PNG existent).
- **Vague 1 — data (débloque le rendu des nouveaux aliments)** : **S1**. Prérequis de S2/S3.
- **Vague 2 — UI indépendantes (parallèle, zones disjointes)** : **S2** (onglets garde-manger cardio)
  · **S4** (écran thèmes). Démarrent après S1 (S2) / immédiatement (S4).
- **Vague 3 — gated** : **S3** (repas-types, après **G-repas**) · **S5** (pictos familles, après
  **G-familles** + assets générés). Les plus lourds/sensibles, tranchés avec Thibault avant code.
- **Vague 4 — assets** : **S6**, dès que Thibault a produit les PNG (Alerte, vf, aliments) — dépôt +
  validation visuelle. Peut chevaucher les autres vagues.
- **Vague 5 — consolidation** : **S7** (commits tâche par tâche, statuts, `STATUS`/`VALIDATION`/
  `PROJECT_MAP`, entrées `DECISIONS`, un seul push).

## Spécification par session

- **S1 `data`** : ajouter à `FOODS` (diabète) et `ALIMENTS_PLATEAU` (cardio) : **10 légumes** (tomate,
  courgette, aubergine, poivron, épinards, haricots-verts, oignon, gombo, potiron, chou) + **7
  aliments-situations** (thon, merguez, fromage, feta, olives, houmous, pois-casses) ; côté cardio,
  ajouter aussi les **féculents culturels** (manioc, igname, banane-plantain, couscous-complet,
  dattes, galette-riz) et **copier leurs PNG** `diabete/ → cardio/`. Valeurs = ordres de grandeur
  `// à revalider (Thibault)`. Vérifier que `REPERE_PAR_ALIMENT` (cardio) reste cohérent (associer
  olives/houmous à un repère si pertinent). Gate auto : `tsc`/`build`/`test`.
- **S2 `onglets cardio`** : le garde-manger cardio scrolle déjà long avec 26 items ; avec
  l'enrichissement il faut le **patron à onglets de catégories** du diabète (`AlimentationModule` :
  chips Féculents/Légumes/Protéines/Lipides/Fruits/Laitiers filtrant la liste). Réutiliser la
  mécanique, ne pas dupliquer. A11y préservée.
- **S3 `repas-types`** : `src/content/repas-types.ts` = `RepasType[] { id, label, aliments[],
  proportionsCibles }`. Bouton « Charger un repas-type » dans les deux modules. Cardio : mappe vers
  `repFood`/`extras`/angles du camembert. Diabète : mappe vers l'assiette + `paramsFromAssiette`
  (courbe). **Composition clinique/culturelle = Thibault (G-repas)** ; commencer par 2-3 presets
  pilotes validés avant les 6.
- **S4 `écran thèmes`** : icône par thème + grille équilibrée dans `ThemeSelector`. Garder le moteur
  générique (le champ éventuel vit dans `ThemeDef`, pas en dur).
- **S5 `familles cardio`** : `RepereCard` → `IllustrationSlot repere-<id>` (10 assets). Conditionné à
  G-familles + génération. Repli : conserver la flamme.
- **S6 `assets`** : déposer les PNG générés (Alerte cardio, 6 vf tabac, légumes, situations) ;
  `IllustrationSlot` les résout par id — aucune modif code sauf `benef-horizon` si retenu. Validation
  visuelle Thibault.

## Gates / décisions à valider (Thibault)

- **G-nutrition** — valeurs `cg/fibres/proteines/lipides` (diabète) et `sel/graisses` (cardio) des
  aliments neufs. `// à revalider` ; non bloquant pour le rendu, bloquant pour la justesse.
- **G-repas** ⛔ — **liste + composition des repas-types + calibrage de la courbe glycémie (diabète)**.
  Verrou de S3. Repas ancrés sur la population MSP (Maghreb / Afrique / Antilles).
- **G-familles** — approche « picto par famille » remplaçant la flamme unique (S5). Si oui → Claude
  ajoute les prompts `repere-*`, Thibault génère.
- **G-visuel** — validation à l'écran de tout l'enrichissement (`npm run dev`), comme d'habitude —
  cf. `VALIDATION.md` (règle : validation visuelle = humaine).

## Références (lecture d'Opus au cadrage, ne pas recopier dans les sessions)

- Audit source : `rapport-audit-consultation-2026-07.md`.
- Garde-manger existant : `features/diabete/alimentation/{data.ts, AlimentationModule.tsx}`
  (patron onglets + courbe), `features/cardio/manger/{data.ts, MangerModule.tsx}` (patron camembert
  3 frontières). Lib courbe : `features/diabete/lib/glycemieCurve.ts` (`paramsFromAssiette`).
- Illustrations : `design/illustrations/prompts-illustrations-diabete.html` (prompts + styles
  `DEFAULT_FOOD`/`DEFAULT_CARDIO`/`DEFAULT_TABAC_SQ`), `design/illustrations/build_assets.py`
  (pipeline transparence), `src/features/*/components/IllustrationSlot.tsx` (résolution id → PNG).
- Moteur : `features/registry.ts`, `features/types.ts` (`ThemeDef`), `components/ThemeSelector.tsx`.

## Clôture (S7)

### Sessions consolidées (2026-07-23)

- [x] **V0** : Prompts ajoutés au HTML (6 vf tabac + 10 légumes + 7 situations + 11 cardio Alerte préexistants).
- [x] **S1** : Data enrichie (commit `31d92a9`). Valeurs `// à revalider (Thibault)`.
- [x] **S2** : Cardio Manger en onglets (commit `78931ce`).
- [x] **S3** : Repas-types partagés (commit `bc3577c`). Composition/proportions/calibrage glycémie `// à revalider`.
- [x] **S4** : Écran thèmes avec icônes (commit `09a6cd1`).
- [x] **V0-bis** : Nettoyage prompts (commit `164886b`).
- [ ] **S5** : Familles cardio (picto par repère) — **PENDING** — bloqué **G-familles** (approche à trancher).
- [ ] **S6** : Câblage assets générés — **PENDING** — dépend PNG Thibault (17 aliments + 11 cardio Alerte + 6 tabac vf).

### Gates finales

- `npx tsc --noEmit` ✓
- `npm run build` ✓ (2 entrées `consultation.html` / `patient.html`)
- `npm test` ✓ **127/127**, aucune dépendance runtime ajoutée

### Points ouverts / À revalider (Thibault)

**Données nutritionnelles (G-nutrition)** — toutes marquées `// à revalider` dans le code :
- 10 légumes neufs : tomate, courgette, aubergine, poivron, épinards, haricots-verts, oignon, gombo, potiron, chou.
- 7 aliments-situations : thon, merguez, fromage, féta, olives, houmous, pois cassés.
- CG/fibres/protéines/lipides (diabète) et sel/graisses (cardio) = ordres de grandeur Ciqual — à revalider cliniquement.
- 6 féculents cardio (réutilisés diabète) : manioc, igname, banane-plantain, couscous-complet, dattes, galette-riz.

**Composition repas-types (G-repas)** — toutes marquées `// à revalider` dans `src/content/repas-types.ts` :
- 5 presets : couscous-merguez, riz-poisson thiéboudienne, poulet-plantain, lentilles-œuf, petit-déj méditerranéen.
- Portion/proportion cible par aliment + calibrage courbe glycémie (diabète) à valider.

**Familles cardio (G-familles)** — proposée mais non exécutée (S5 bloquée) :
- Approche « picto par repère » (remplace la flamme unique de `RepereCard` manger cardio).
- À trancher avec Thibault avant code.

**Illustrations à générer** — prompts prêts, génération en attente Thibault (S6) :
- 17 aliments garde-manger (10 légumes + 7 situations) : sections `gm-legumes-enrichi` + `gm-situations`.
- 11 cardio Alerte (4 VITE + 7 infarctus) : section `cardio-vite` + `cardio-inf` + `cardio-inf-atypique`.
- 6 tabac vrai/faux : section `tabac-vf`.

### Commits

- `31d92a9` — feat(garde-manger) : data enrichie S1
- `78931ce` — feat(cardio-manger) : onglets S2
- `bc3577c` — feat(repas-types) : presets S3
- `09a6cd1` — feat(theme-selector) : icônes S4
- `164886b` — chore(illustrations) : nettoyage prompts V0-bis

### Validation visuelle humaine

**Entièrement à faire par Thibault** (`npm run dev`) — cf. `VALIDATION.md` pour la checklist complète :
- Écran sélection de thème : grille, icônes, équilibre.
- Garde-manger diabète : aliments neufs, intégration courbe.
- Garde-manger cardio : onglets, aliments enrichis, assiette.
- Presets repas-types : chargement, modifiabilité, cohérence.
- Illustrations placeholders : aucune cassure, structure intacte.

**Non bloquant** : génération PNG (S6) à valider visuellement après dépôt Thibault.

### Chantier non clos

- **S5/S6 pendantes** : à débloquer selon décisions G-familles + génération PNG.
- **Statut consolidation** : S1-S4 + V0-bis engagés, contexte mis à jour (`STATUS/TASKS/DECISIONS/PROJECT_MAP/VALIDATION/plans/index`), commit S7 à créer.
