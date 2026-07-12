# Plan — Corrections audit diabète (audit 2026-07-12)   (rédigé par Opus)

> **Origine** : `Audit/audit-etp-interactif.md` (navigation manuelle Thibault sur `etp-interactif.vercel.app`,
> 12 points, sélecteurs DOM fournis). Passe **par-dessus** le chantier v3 déjà déployé
> (`plans/corrections-visuelles-diabete-v3/`, `HEAD = origin/main`), donc l'audit reflète l'état
> **post-v3** (chrome diabète déjà `wide` ~1240 px, onglets dans le header).
> **Autorités** : ce fichier · `Audit/audit-etp-interactif.md` · `PROJECT_BRIEF.md` · `DECISIONS.md` ·
> `docs/diabete/` (contenu clinique) · `plans/corrections-visuelles-diabete-v3/index.md`.
> **Exécutant** : **Sonnet** (décision Thibault). Un lot = une session.
> **Règle de validation** : **jamais** de navigateur/Playwright côté Claude. Chaque session =
> `npx tsc --noEmit` + `npm run build` + `npm test` verts + checklist **visuelle** consignée dans
> `VALIDATION.md` (validée par Thibault à l'écran, `npm run dev`). Cf. `[[feedback_validation_visuelle]]`.

## Objectif d'ensemble

Appliquer les 12 corrections de l'audit sur le thème **diabète**. Trois natures de travail :
allègement/mise en page (points 1, 3, 4, 5, 6, 7), réutilisation de composants existants (points 2, 8),
et **passage d'un affichage figé à un système d'expérimentation** sur la famille Insuline (points 9,
10, 11, 12) — le patient manipule un réglage (dose, moment, délai) et **voit l'effet en direct sur la
courbe**, plutôt qu'un texte de réponse pré-écrit (décision Thibault 2026-07-12).

## Décisions de Thibault (tranchées avant rédaction)

1. **Point 1 (zéro scroll)** : d'abord les allègements par module (S1, S3), **puis** re-mesure et
   verrouillage au cadre de consultation (S6, en dernier). Jamais rétrécir le texte sous le
   « lisible à ~1 m » (invariant 6). Cible de calibrage = **1366×768** (portable) **et 1024×768**
   (tablette paysage), comme les tours précédents — à confirmer visuellement.
2. **Points 9-12** : **système d'expérimentation**, pas de quiz « deviner → révéler ». Chaque écran de
   décision devient un réglage manipulable dont l'effet s'affiche sur la courbe. Contrôles **adaptés au
   contexte** (augmenter/pareil/baisser la dose là où c'est clinique ; moment d'injection ; délai de
   cumul) — pas de trio unique plaqué partout.
3. **Point 11** n'est **pas** un bug de composant : le paramètre `depart` est bien appliqué (test
   invariant 10 vert), mais comme **décalage vertical constant** → les 3 courbes ont la **même forme**,
   juste translatées. Correctif = **modèle** (`glycemieCurve.ts`), pas composant : l'écart de départ
   doit se **résorber** (forme convergente) et la correction d'insuline doit être expérimentable.
4. **Point 12 (cumul)** : **deux situations cliniques** (tranché 2026-07-12) — **A** la glycémie
   redescend seule → ajouter une dose avant qu'elle soit redescendue = hypo ; **B** elle reste haute
   après le délai → une 2ᵉ dose **se justifie**, mais donnée trop tôt (1ʳᵉ encore active) elle plonge
   quand même, et donnée après que la 1ʳᵉ a fini d'agir elle ramène dans la cible. Matrice complète dans
   `S5.md` T10. Lève le garde-fou « délai long = sûr ? » qui était en suspens.

## Mapping audit → sessions

| # audit | Écran | Demande | Session |
| --- | --- | --- | --- |
| 2 | Cardio ①/② | Fusionner « Les leviers » dans « L'artère », icônes sur les chips, renommer « Les facteurs de risque » | **S1** |
| 3 | Cardio ② Artère | Retirer sur-titre + compteur % + message (narration orale) | **S1** |
| 8 | Hypo ③ Ma carte | Afficher les illustrations des signes (motif `previewItem` déjà présent dans le module) | **S2** |
| 4 | Alim. Composition | Retirer le compteur, icône seule pour reset, agrandir l'assiette, courbe sous l'assiette | **S3** |
| 5 | Alim. Qualité | Retirer duels + « Vous aviez dit » + « Bonne prédiction », icône reset, remonter/agrandir la courbe | **S3** |
| 6-7 | Alim. Ordre / Repas complet | Remonter/agrandir la courbe (même correctif structurel) | **S3** |
| 9 | Insuline « Décider » | Expérimentation : ajuster la lente (−1/pareil/+1) → la dérive des nuits suivantes réagit sur la courbe | **S4** |
| 10 | Insuline rapide ①/③ | Expérimentation cohérente avec S4 (contrôles adaptés au contexte) | **S5** |
| 11 | Insuline rapide ③ | Modèle : courbes de départ **convergentes** (forme distincte), correction expérimentable | **S5** |
| 12 | Insuline rapide ④ | Cumul : deux situations expérimentables (redescend seule / reste haute) → matrice d'issues sur la courbe | **S5** |
| 1 | Toutes | Zéro scroll : tenir dans le cadre de consultation, sans rétrécir le texte | **S6** |

## Sessions

| Session | Tâches | Titre | Modèle | Effort | Dépend de | Zone modifiée (fichiers « Modifier ») | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [S1](S1.md) | T1-T2 | Cardio : fusion Leviers→Artère + retrait des 3 textes | Sonnet | high | — | `src/features/diabete/risque-cardio/RisqueCardioModule.tsx` (+`.module.css`) | [x] |
| [S2](S2.md) | T3 | Hypo : illustrations des signes dans « Ma carte » | Sonnet | medium | — | `src/features/diabete/hypoglycemie/HypoglycemieModule.tsx` (+`.module.css`) | [x] |
| [S3](S3.md) | T4-T7 | Alimentation : courbe dans la colonne + allègements | Sonnet | xhigh | — | `src/features/diabete/alimentation/AlimentationModule.tsx` (+`.module.css`) | [x] |
| [S4](S4.md) | T8 | Insuline « Décider » : expérimentation de la lente | Sonnet | high | — | `src/features/diabete/insuline/InsulineModule.tsx`, `scenarios.ts` (+`.module.css`) | [x] |
| [S5](S5.md) | T9-T10 | Insuline rapide : modèle convergent + cumul expérimentable | Sonnet | xhigh | — | `src/features/diabete/lib/glycemieCurve.ts` (+`.test.ts`), `insuline-rapide/InsulineRapideModule.tsx` (+`.module.css`) | [x] |
| [S6](S6.md) | T11 | Zéro scroll : verrouillage au cadre de consultation | Sonnet | high | S1, S3 | `src/components/ModuleShell.module.css`, `Home.module.css`, `src/styles/tokens.css` | [x] |

## Ordonnancement

- **Vague 1 — parallélisable** : **S1 · S2 · S3 · S4 · S5** — zones de « Modifier » **disjointes**
  (5 dossiers/fichiers différents). Aucune dépendance entre elles.
  - Garde-fou S5 : **n'éditer que `sampleRepasAvecBolus`** dans `glycemieCurve.ts` (module 10) —
    ne pas toucher `sampleNuits`/`sampleJournee` (lus par S4 via `scenarios.ts`) ni les autres
    fonctions (lues par S2/S3). Aucune signature existante modifiée sans nouveau paramètre optionnel.
- **Vague 2** : **S6** — après S1 **et** S3 (qui réduisent la hauteur de Cardio et Alimentation),
  car S6 **re-mesure** le débordement résiduel avant de verrouiller le cadre. Gate humaine : voir §Gates.
- **Vague 3 — consolidation** : commits **tâche par tâche** (staging explicite, jamais `git add -A`),
  statuts (`index.md`, `TASKS.md`, `STATUS.md`), `VALIDATION.md`, `DECISIONS.md`, puis **un seul push**.
  À l'humain ou session Haiku `minimal`. Cf. `WORKFLOW.md §4d`.

## Gates humaines (bloquantes)

- **Avant S6** : Thibault confirme la **résolution cible** de consultation (défaut retenu : 1366×768 +
  1024×768). S6 ne verrouille le cadre qu'après re-mesure visuelle des modules diabète post-S1/S3.
- **Après chaque session** : validation visuelle Thibault (`VALIDATION.md`) — les valeurs de px/taille
  données dans les sessions sont des **points de départ à caler à l'œil**.

## Garde-fous (toutes sessions)

- **Zéro persistance**, **zéro dépendance runtime ajoutée** (`lucide-react` déjà présent).
- **Moteur thème-agnostique** (`src/components/`, `src/features/types.ts`, `registry.ts`) : ne jamais
  coder « diabète » en dur. S6 touche le shell **partagé** → **rétro-compat tabac obligatoire**
  (un `ModuleShell` sans `wide`/`nav` doit rendre exactement comme avant).
- **Ne pas toucher au `viewBox` partagé** `640×262` de `CourbeGlycemie` (agrandir par le conteneur).
- **Aucun chiffre brut à l'écran** dans la famille Insuline (ni dose, ni minutes, ni ratio) — paliers
  qualitatifs uniquement. Constantes cliniques du modèle : `// à revalider (Thibault)`.
- **Tests** : ne casser aucun invariant de `glycemieCurve.test.ts` ; S5 **ajoute** des invariants.
- **Pas de régénération d'images** : layout/logique/CSS uniquement. Les PNG de
  `public/illustrations/diabete/` sont figés.
- **Cibles ≥ 44 px** pour tout élément interactif touché ou créé.
- **Validation visuelle = humaine** (Thibault). Ne jamais prétendre avoir vu le rendu.
