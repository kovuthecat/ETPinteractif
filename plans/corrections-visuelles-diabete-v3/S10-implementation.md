# S10 — Plan d'implémentation détaillé : module « Insuline rapide (pré-prandial) »

> **Mode** : solo · **Exécutant** : Sonnet · **Effort** : xhigh · **Dépend de** : S1 (chrome
> `wide`/`nav`, fait) + **contenu validé** `docs/diabete/10-insuline-rapide.md` (périmètre DT2,
> déroulé 4 temps, sources OpenEvidence).
> **À lire avant de coder** : `docs/diabete/10-insuline-rapide.md` (autorité contenu) ·
> `src/features/diabete/insuline/InsulineModule.tsx` (module frère, même famille `soigner`) ·
> `src/features/diabete/components/CourbeGlycemie.tsx` (props, repère, `bandeToY`) ·
> `src/features/diabete/lib/glycemieCurve.ts` (`sampleRepas`, `repasLevelAt`, `sampleActivite`
> comme modèle d'un effet multiplicatif, `toSvgPath`, `BANDE_CIBLE_DEFAUT`, `LEVEL_MAX`,
> `BASELINE`) · `src/features/diabete/registry.ts` · un des 6 modules diabète à onglets pour le
> pattern S1 (`shell`/`nav`), ex. `hypoglycemie/HypoglycemieModule.tsx`.

> ⚠️ **Garde-fou contenu** : les constantes cliniques du modèle (amplitudes, délais, seuil
> d'hypo) restent `// à revalider (Thibault)`. **Aucun chiffre affiché à l'écran** (pas de dose,
> pas de minutes, pas de ratio) — que des paliers/gestes qualitatifs, comme le module 9.

---

## 0. Vue d'ensemble

Un 10ᵉ module diabète, dans la famille **`soigner`**, juste après le module 9 (`insuline`). Même
grammaire que les autres : `ModuleShell wide` + barre d'onglets dans le slot `nav` (pattern S1),
`CourbeGlycemie` comme objet central, `IllustrationSlot` pour tout visuel (placeholders), zéro
persistance, zéro dépendance runtime ajoutée.

**4 temps** (cf. `10-insuline-rapide.md §3`) :

1. **Couvrir le repas** — plus de glucides → plus de rapide pour couvrir le pic.
2. **Le bon moment** — injecter avant le repas couvre le pic ; trop tard le laisse passer.
3. **Corriger avant le repas** — glycémie pré-repas basse/cible/haute déplace le point de départ.
4. **Le piège du cumul** — 2ᵉ dose alors que la 1ʳᵉ agit encore → plonge sous la cible (hypo).

Le cœur technique est **une nouvelle fonction dans `glycemieCurve.ts`** qui modélise l'effet d'un
bolus rapide sur une courbe de repas, **accompagnée de tests** (invariants qualitatifs, comme
l'existant). Tout le reste est de l'assemblage React/CSS calqué sur les modules frères.

---

## 1. Modèle physiologique — `glycemieCurve.ts` (+ tests)

Ajouter **une seule** fonction exportée `sampleRepasAvecBolus`, sur le patron de `sampleActivite`
(qui applique déjà un facteur multiplicatif à l'excès au-dessus de `BASELINE`). Ne **rien**
modifier des fonctions existantes ni du `viewBox`/repère partagé.

### 1.1 Types & signature (à ajouter après le bloc « Activité »)

```ts
export type BolusParams = {
  /** Quantité de rapide, qualitative [0,1] : 0 = pas de bolus, ~0.5 = couvre un repas moyen,
   *  1 = forte dose. Jamais convertie en unités affichées. */
  dose: number;
  /** Instant d'injection en minutes relatives au repas (t=0). Négatif = avant le repas
   *  (ex. -15 = 15 min avant). // à revalider (Thibault) : -15 = optimum analogue rapide. */
  tInjection: number;
  /** Glycémie de départ avant le repas, échelle 0–100 (défaut BASELINE). Sert au temps ③
   *  (correction) : point de départ plus haut/bas. */
  depart?: number;
  /** Instant d'une 2ᵉ dose de correction (minutes, t=0 = repas). Absent = pas de cumul.
   *  Sert au temps ④ : une 2ᵉ dose rapprochée creuse sous la cible. */
  tSecondeDose?: number;
};
```

### 1.2 Courbe d'activité insulinique (PK/PD qualitative)

Modéliser l'**effet hypoglycémiant** d'un bolus injecté à `tInj` comme une cloche : nulle avant
`tInj + latence`, montée jusqu'à un pic, puis décroissance sur la durée d'action. Valeurs de
départ (analogue rapide, `// à revalider`, cf. `10-insuline-rapide.md §5` — Slattery 2018, De
Block 2022, Walsh 2014) :

```ts
const BOLUS_LATENCE = 15;      // début d'action ~15 min après injection
const BOLUS_PIC = 60;          // pic d'action ~60 min après injection
const BOLUS_DUREE = 240;       // durée d'action ~4 h (activité clinique 3-4 h)
const BOLUS_EFFET_MAX = 55;    // baisse max (points d'échelle 0–100) à dose=1 // à caler

/** Effet hypoglycémiant instantané d'un bolus (points 0–100 soustraits), à `dtDepuisInjection`
 *  minutes de l'injection. Cloche : 0 avant la latence, monte jusqu'au pic, décroît à 0 en fin
 *  de durée d'action. `dose` [0,1] met à l'échelle l'amplitude. */
function bolusEffet(dtDepuisInjection: number, dose: number): number {
  if (dose <= 0 || dtDepuisInjection <= BOLUS_LATENCE || dtDepuisInjection >= BOLUS_DUREE) return 0;
  const montee = BOLUS_PIC - BOLUS_LATENCE;
  const descente = BOLUS_DUREE - BOLUS_PIC;
  const f = dtDepuisInjection <= BOLUS_PIC
    ? ease((dtDepuisInjection - BOLUS_LATENCE) / montee)
    : 1 - ease((dtDepuisInjection - BOLUS_PIC) / descente);
  return dose * BOLUS_EFFET_MAX * f;
}
```

`ease` est déjà défini dans le fichier (fonction lissante réutilisée par `repasLevelAt`).

### 1.3 Assemblage `sampleRepasAvecBolus`

```ts
export function sampleRepasAvecBolus(params: RepasParams, bolus: BolusParams): Point[] {
  const depart = bolus.depart ?? BASELINE;
  const decalageDepart = depart - BASELINE; // temps ③ : correction du point de départ
  const tEnd = Math.max(180, (bolus.tSecondeDose ?? 0) + BOLUS_DUREE);
  return sampleRange(-20, tEnd, 1, (t) => {
    const repas = repasLevelAt(params, t) + decalageDepart;
    let effet = bolusEffet(t - bolus.tInjection, bolus.dose);
    if (bolus.tSecondeDose !== undefined) {
      // 2ᵉ dose de correction (même dose qualitative que la principale, à défaut d'un réglage) :
      effet += bolusEffet(t - bolus.tSecondeDose, bolus.dose);
    }
    return clampRange(repas - effet, 0, LEVEL_MAX);
  });
}
```

`sampleRange`, `repasLevelAt`, `clampRange`, `LEVEL_MAX`, `BASELINE` sont déjà dans le fichier.

### 1.4 Tests — `glycemieCurve.test.ts` (invariants qualitatifs, jamais de valeur exacte figée)

Ajouter un `describe('sampleRepasAvecBolus', …)` avec au moins ces invariants (aligner le style
sur les tests existants — comparer des pics/minima, pas des valeurs précises) :

1. **Continuité** : `dose: 0` → courbe identique (aux arrondis près) à `sampleRepas(params)` sur
   le domaine commun. *(Le bolus nul ne change rien.)*
2. **Couverture** : un bolus adéquat (`dose ~0.5`, `tInjection: -15`) → pic **strictement plus
   bas** que sans bolus. *(La rapide couvre le repas — temps ①.)*
3. **Timing** : à dose égale, `tInjection: -15` → pic **plus bas** que `tInjection: +30`.
   *(Injecter avant couvre mieux qu'injecter en retard — temps ②.)*
4. **Correction** : `depart` élevé → toute la courbe décalée vers le haut vs `depart = BASELINE`,
   à bolus égal. *(Point de départ plus haut — temps ③.)*
5. **Cumul → hypo** : une `tSecondeDose` rapprochée (ex. 2ᵉ dose ~30 min après la 1ʳᵉ) fait
   passer le **minimum de la courbe sous `BASELINE`** (voire sous un seuil hypo), alors qu'une
   dose unique adéquate ne descend pas sous `BASELINE`. *(Le stacking creuse — temps ④.)*
6. **Bornes** : toutes les valeurs restent dans `[0, LEVEL_MAX]`.

> **Ne pas** toucher aux tests existants ni à `tempsDansCible` (invariant du plan v3). La suite
> doit rester verte (80 tests + les nouveaux).

---

## 2. Composant — `src/features/diabete/insuline-rapide/`

Créer le dossier avec `InsulineRapideModule.tsx` + `InsulineRapideModule.module.css`.

### 2.1 Squelette (pattern S1 — copier la structure de `HypoglycemieModule.tsx`)

- Signature `export default function InsulineRapideModule({ onNavigate, shell }: ModuleProps)`.
- `if (!shell) return null;` avant le rendu.
- Construire `navBar` = la barre des 4 onglets (classes `.tabs`/`.tab`/`.tabActive` locales, même
  style que les autres modules — copier depuis `HypoglycemieModule.module.css`).
- Retour :
  ```tsx
  return (
    <ModuleShell titre={shell.titre} sources={shell.sources} onBack={shell.onBack} wide nav={navBar}>
    <div className={styles.module}>
      {/* temps ① … ④, rendus conditionnels comme HypoglycemieModule */}
    </div>
    </ModuleShell>
  );
  ```
- État local (éphémère, jamais persisté) : `temps: 1|2|3|4`, plus les curseurs qualitatifs de
  chaque temps (voir ci-dessous). Aucune saisie stockée.

### 2.2 Les 4 temps

Chaque temps rend un `CourbeGlycemie` (bande-cible via `bandeToY(BANDE_CIBLE_DEFAUT)`, marqueur
repas `R` à `t` correspondant à t=0 sur l'axe, `axeLabels` type `['Repas','+1h','+2h','+3h']`).
Construire les chemins via `toSvgPath(points, { width: COURBE_GRAPH_WIDTH, height:
COURBE_GRAPH_HEIGHT, tMin, tMax })` — **mêmes options que les modules frères**, ne pas toucher au
viewBox. Mémoïser les échantillonnages (`useMemo`) comme dans les autres modules.

- **① Couvrir le repas** — un contrôle qualitatif à 3 crans « peu / repas moyen / beaucoup » de
  glucides (mappé sur `RepasParams` : ex. charge 0.35 / 0.55 / 0.8 — réutiliser des valeurs déjà
  présentes, ex. `REPAS_JOURNEE`). Deux courbes superposées : **sans bolus** (variante `fantome`)
  et **avec bolus adéquat** (`dose` proportionnelle au repas, `tInjection: -15`, variante
  `principale`). Message : « plus de glucides → plus de rapide pour couvrir ». **Pont module 2** :
  bouton ghost « Composer ce repas dans l'assiette » → `onNavigate('alimentation')` (option, cf.
  §3 du contenu — à confirmer avec Thibault, sinon un simple curseur suffit pour la v1).
- **② Le bon moment** — slider de délai d'injection (grammaire du module 3 Activité ③ : `<input
  type="range">` déjà stylé là-bas, copier `.slider`/`.sliderTicks`). Repas fixe, `dose` fixe
  adéquate ; faire varier `tInjection` de « bien avant » à « après le repas ». Courbe **avec**
  (principale) vs **sans** bolus (estompée). Marqueur d'injection sur la courbe (réutiliser un
  `MarqueurDef` type `resucrage`/`activite` pour matérialiser l'instant). Message : la rapide se
  prépare **avant** de manger.
- **③ Corriger avant le repas** — toggle 3 états « glycémie avant repas : basse / dans la cible /
  haute » → `depart` (ex. BASELINE−10 / BASELINE / BASELINE+30, `// à caler`). Message : glycémie
  haute → un peu plus de rapide ; glycémie basse → prudence, **traiter l'hypo d'abord** →
  bouton/porte `onNavigate('hypoglycemie')`.
- **④ Le piège du cumul** — bouton « et si j'en remets trop tôt ? » (toggle booléen) qui ajoute
  une `tSecondeDose` rapprochée. Courbe qui plonge **sous la bande-cible** (motif overshoot
  inversé). Message de patience : l'insuline agit encore, on n'empile pas, on attend, on
  recontrôle → porte `onNavigate('hypoglycemie')`.

### 2.3 Refrain & interdits

- Refrain de sécurité en pied (classe globale `.filrouge`, comme le module 9) :
  « La bonne dose, c'est celle de votre protocole — ici on apprend le raisonnement, pas les
  chiffres. » *(libellé à confirmer Thibault.)*
- **Pas de `FicheOverlay`** dans ce module (interdiction explicite du contenu §3 : pas de fiche
  d'ajustement de doses, dangereuse hors contexte).
- **Aucun nombre** rendu (ni mg/dL imposé, ni minutes, ni dose). Le `mg` optionnel de
  `CourbeDef` (survol 2ᵉ niveau) peut rester **non renseigné** ici pour éviter toute lecture
  chiffrée d'une dose.

---

## 3. Enregistrement — `src/features/diabete/registry.ts`

Ajouter l'import et une entrée dans `MODULES`, **juste après** `insuline` (garder le
regroupement famille `soigner`) :

```ts
import InsulineRapideModule from './insuline-rapide/InsulineRapideModule';
// …
{
  id: 'insuline-rapide',
  famille: 'soigner',
  titre: 'Insuline rapide (avant le repas)',   // libellé à confirmer Thibault
  resume: 'Comprendre comment la rapide couvre le repas — le bon moment, la bonne mesure, sans empiler.',
  sources: ['ADA Standards of Care 2026', 'Consensus ADA/EASD', 'Slattery 2018 (timing)'], // à confirmer
  Icon: Utensils,                              // lucide, distinct de Syringe (module 9) — à confirmer
  Component: InsulineRapideModule,
  hue: 'nav',
  rendersOwnShell: true,                       // OBLIGATOIRE (pattern S1)
},
```

Ajouter `Utensils` à l'import lucide en tête de `registry.ts`. Vérifier l'ordre/regroupement sur
l'accueil diabète (le module doit apparaître dans « Se soigner », après « Insuline : adapter les
doses »).

---

## 4. CSS — `InsulineRapideModule.module.css`

Repartir des classes des modules frères (ne rien inventer de neuf) : `.module` (flex column,
gap), `.tabs`/`.tab`/`.tabActive` (copier depuis `HypoglycemieModule.module.css`), `.slider`/
`.sliderTicks` (depuis `ActiviteModule.module.css`) pour le temps ②, une carte `.courbeCard` (card
+ padding) autour de chaque `CourbeGlycemie`. Cibles interactives ≥ 44 px (steppers, toggles,
slider). Contenu large : le chrome `wide` (S1) donne déjà ~1240 px, la courbe pleine largeur
s'affiche sans réglage supplémentaire.

---

## 5. Vérifs & clôture

- `tsc --noEmit` + `npm run build` + `npm test` verts (**dont les nouveaux tests
  `sampleRepasAvecBolus`** et les 80 existants inchangés).
- Checklist `VALIDATION.md § S10-v3` (remplacer la checklist « contenu » actuelle par la
  checklist visuelle une fois implémenté) :
  - Le module apparaît sur la carte diabète (famille « Se soigner », après le module 9), s'ouvre,
    est interactif, sobre, **sans aucun chiffre**.
  - Temps ① : plus de glucides → courbe « avec bolus » plus haute mais couverte ; distincte de
    « sans bolus ».
  - Temps ② : injecter avant le repas couvre le pic ; en retard, le pic s'échappe.
  - Temps ③ : glycémie de départ haute → toute la courbe décalée ; renvoi hypo si basse.
  - Temps ④ : la 2ᵉ dose rapprochée fait plonger la courbe sous la cible ; porte vers module 8.
  - Chrome `wide` + onglets dans le header (comme les 6 autres modules à onglets) ; lisible à
    ~1 m ; cibles ≥ 44 px ; pas de scroll horizontal à 1024×768.
- `DECISIONS.md` (nouveau module + modèle `sampleRepasAvecBolus` + constantes `// à revalider`) ·
  `PROJECT_MAP.md` (localiser `src/features/diabete/insuline-rapide/`) · `STATUS.md`/`TASKS.md` ·
  `/fin-de-tache`.

## 6. Garde-fous (rappel)

- **Contenu sourcé** = `docs/diabete/10-insuline-rapide.md` fait autorité ; toute constante
  clinique `// à revalider (Thibault)`. Signaler plutôt qu'inventer.
- **Zéro chiffre brut à l'écran** ; paliers/gestes qualitatifs uniquement.
- **Pas de fiche imprimable** (interdiction explicite).
- Moteur thème-agnostique inchangé ; tout le neuf vit sous `src/features/diabete/` ; `ModuleShell`
  non modifié (les props `wide`/`nav` de S1 suffisent).
- **Ne pas** modifier le `viewBox` partagé de `CourbeGlycemie` ni les fonctions existantes de
  `glycemieCurve.ts` (seulement **ajouter** `sampleRepasAvecBolus` + ses tests).
- Zéro persistance, zéro dépendance runtime ajoutée (lucide déjà présent).

## 7. Commits prévus

1. `docs(diabete): contenu + plan d'implémentation insuline rapide (S10-v3)` *(déjà en partie
   fait : `10-insuline-rapide.md` + ce fichier).*
2. `feat(diabete): modèle dose→courbe insuline rapide + tests (S10-v3)` *(glycemieCurve.ts).*
3. `feat(diabete): module « Insuline rapide (pré-prandial) » + registre (S10-v3)` *(composant,
   CSS, registry).*

*(Regroupables selon la convention du plan v3 : commits par tâche en fin de plan, un seul push.)*
