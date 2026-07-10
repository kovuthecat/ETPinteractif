# Plan boite-a-outils — Boîte à outils du sevrage + refonte Composantes + enrichissements   (rédigé par Fable)

> Mode : **vagues parallèles** (WORKFLOW §4d). Demandé par Thibault le 2026-07-10.

## Objectif d'ensemble

Six chantiers issus du rapport OpenEvidence « stratégies comportementales du sevrage »
(`docs/evidence-tabac/2026-07-10-rapport-openevidence-sevrage.md`, ci-après « le rapport OE ») :

1. **Nouveau module « Stratégies & outils » (`boite-a-outils`)** qui **remplace le module Craving** :
   l'outil vague + 4D devient un item parmi ~14 outils simples (contrôle du stimulus, plans
   « si-alors », activité physique brève, respiration, plan de secours après un écart…). Chaque outil
   a une illustration, un détail (principe + formulation patient) et une consigne d'une ligne pour la
   **fiche imprimable « Ma boîte à outils »** personnalisée.
2. **Refonte du module Composantes (`addiction`)** : les situations de chaque pilier deviennent des
   **puces radiales sélectionnables** autour du cercle (multi-sélection), **sans description ni
   solution** sur cette page (le soignant fait la narration). Un bouton « Stratégies et outils »
   ouvre le nouveau module **filtré sur les situations sélectionnées**.
3. **Navigation contextuelle générique** : le moteur transporte un `context` optionnel et opaque
   (`unknown`) d'un module à l'autre — nécessaire au point 2, réutilisable par tout thème.
4. **Enrichissement du Vrai/faux** : 6 nouvelles cartes (poids ×3, vapoteuse ×3) + mise à jour de
   3 cartes existantes (faux pas, poids, retarget des renvois craving).
5. **Vapoteuse réintégrée dans les Substituts** (réduction des risques, technique d'utilisation
   rédigée par Fable) + **section « Si j'ai un écart » dans Mon plan d'arrêt**.
6. **Thème diabète — module Activité physique** : interrupteur pour n'afficher que les activités
   d'intensité modérée+ (adapter le discours au public).

## Autorités

- **Le rapport OE** (`docs/evidence-tabac/2026-07-10-rapport-openevidence-sevrage.md`) — source
  probante brute. Les contenus à implémenter en sont **déjà extraits et adaptés, verbatim, dans les
  `S<k>.md`** : ne pas re-synthétiser le rapport, ne rien inventer au-delà des S.
- `docs/contenu-modules-tabac.md` — autorité du contenu médical tabac (resynchronisée en S9).
- `docs/BRIEF_TABAC.md` §1 — grammaire design/pédagogie (ton, sobriété, lisibilité ~1 m).
- Sources affichables : HAS, Tabac Info Service en tête ; les références internationales du rapport
  (ACC 2018, Cochrane, NEJM) sont admises dans `sources`/`source` mais marquées
  `// à revalider (Thibault)` quand elles portent seules une affirmation.

## Décisions structurantes (fixées par Fable)

1. **Fusion Craving → Boîte à outils** : le module `craving` disparaît du registre ; `boite-a-outils`
   prend sa place (famille `agir`, hue `vigilance`). Le code vague/4D est **déplacé** (pas réécrit)
   dans le nouveau module ; la fiche « Ma carte anti-envie » (X2) reste attachée à l'outil vague.
   Tous les renvois `'craving'` du thème sont retargetés vers `'boite-a-outils'`.
2. **Contexte de navigation générique** : `ModuleProps` devient
   `{ onNavigate: (id, context?: unknown) => void; context?: unknown }` ; `App.tsx` stocke le
   contexte dans l'entrée d'historique. Le moteur ne connaît **pas** la forme du contexte (invariant
   multi-thèmes) ; chaque thème valide lui-même la forme reçue.
3. **Situations partagées** : la liste canonique des situations (3 piliers, ids stables) vit dans
   `src/features/tabac/situations.ts`, consommée par `addiction` (sélection) et `boite-a-outils`
   (filtre + badges). C'est la **colonne vertébrale** du couplage entre les deux modules.
4. **Niveaux de preuve à l'écran** : jamais de chiffre brut (OR/SMD/RR) côté patient — une mention
   sobre en 2 registres seulement : « Efficacité démontrée dans les études » / « Recommandé par les
   experts ». Les chiffres restent dans docs/ et le rapport OE.
5. **Vrai/faux** : pas de nouvelle carte « rechute » (doublon de `vf-faux-pas`) — on reformule la
   carte existante dans le style demandé par Thibault (« Si je craque pour une cigarette, c'est un
   échec ») et on l'enrichit avec les données du rapport.
6. **Vapoteuse** : réintégrée comme forme dans `SubstitutsModule` avec un traitement distinct
   (badge « réduction des risques », pas un médicament), cohérente avec la position HAS/HCSP et la
   carte `vf-vapoteuse` existante.

## Sessions

| Session | Tâche | Titre | Modèle | Effort | Dépend de | Zone modifiée | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [S1](S1.md) | BO1 | Moteur : contexte de navigation + registre + `situations.ts` + stub | Sonnet | medium | — | `src/features/types.ts`, `src/App.tsx`, `src/features/tabac/registry.ts`, `situations.ts`, stub `boite-a-outils/`, `soulagement/`, `nicotine/` (portes) | [x] |
| [S2](S2.md) | BO2 | Module « Stratégies & outils » (grille, filtres, détail, vague 4D, fiche) | Sonnet | xhigh | S1 | `src/features/tabac/boite-a-outils/**`, suppression `craving/**` | [x] |
| [S3](S3.md) | BO3 | Refonte Composantes : situations radiales sélectionnables + CTA | Sonnet | high | S1 | `src/features/tabac/addiction/**` | [x] |
| [S4](S4.md) | BO4 | Vrai/faux : 6 nouvelles cartes + 3 mises à jour + renvois | Sonnet | medium | — (id cible fixé) | `src/features/tabac/idees-recues/data.ts` | [x] |
| [S5](S5.md) | BO5 | Substituts : forme « Vapoteuse » (réduction des risques) | Sonnet | medium | — | `src/features/tabac/substituts/**` | [x] |
| [S6](S6.md) | BO6 | Plan d'arrêt : section « Si j'ai un écart » + vapoteuse dans les chips | Sonnet | medium | — | `src/features/tabac/plan-arret/**` | [x] |
| [S7](S7.md) | BO7 | Prompts d'illustrations (14 outils + vapoteuse) dans le HTML | Sonnet | low | — | `design/illustrations/prompts-illustrations-diabete.html` | [x] |
| [S8](S8.md) | BO8 | Diabète/Activité : interrupteur « activités toniques uniquement » | Sonnet | low | — | `src/features/diabete/activite/**` | [x] |
| [S9](S9.md) | BO9 | Consolidation : docs, contexte, commits, push | Sonnet | low | S1-S8 | `docs/contenu-modules-tabac.md`, `STATUS`/`TASKS`/`VALIDATION`/`PROJECT_MAP`/`DECISIONS`, `index.md` | [x] |

## Ordonnancement

- **Vague 1 — 5 agents parallèles** : S1 · S4 · S5 · S7 · S8. Zones strictement disjointes
  (moteur+registre / idees-recues / substituts / HTML / diabète-activité).
  ⚠️ S4 référence l'id `'boite-a-outils'` avant que S1 n'ait posé le stub : c'est accepté
  (`renvoi: ModuleId` est un `string`, aucun échec de typecheck ; pas de commit avant S9).
- **Vague 2 — 3 agents parallèles** : S2 · S3 · S6, chacun seul écrivain de son dossier.
- **Vague 3 — consolidation (S9, solo)** : commits atomiques par tâche, resync contexte, un seul push.
- Règles vague parallèle (WORKFLOW §4d) : aucun commit/push en vagues 1-2, aucun fichier partagé
  (`STATUS.md`, `TASKS.md`, `index.md`, `VALIDATION.md`) — statut et checklist consignés dans son `S<k>.md`.

## Contrôle de parallélisme (zones disjointes vérifiées)

- S1 = **seul écrivain** de `src/features/types.ts`, `src/App.tsx`, `src/features/tabac/registry.ts`,
  `src/features/tabac/situations.ts`, du stub `boite-a-outils/` et des retouches de portes dans
  `soulagement/SoulagementModule.tsx` et `nicotine/NicotineModule.tsx`.
- S2 = seul écrivain de `src/features/tabac/boite-a-outils/**` (écrase le stub S1, vague suivante)
  et seul à **supprimer** `src/features/tabac/craving/**`.
- S3 = seul écrivain de `src/features/tabac/addiction/**`.
- S4 = seul écrivain de `src/features/tabac/idees-recues/data.ts` (ne touche pas au composant).
- S5 = seul écrivain de `src/features/tabac/substituts/**`.
- S6 = seul écrivain de `src/features/tabac/plan-arret/**`.
- S7 = seul écrivain de `design/illustrations/prompts-illustrations-diabete.html`.
- S8 = seul écrivain de `src/features/diabete/activite/**`.
- Un token/primitive CSS global manque ? **STOP et signaler** — personne ne modifie `src/styles/**`.

## Garde-fous transverses (valent pour toutes les sessions)

- **Ne pas toucher** (hors périmètres listés) : `src/components/**`, `src/features/registry.ts`,
  `src/features/diabete/**` (sauf S8 : `activite/**`), `src/styles/**`, `index.html`.
- **Aucune dépendance ajoutée** (runtime ou dev).
- **Invariants CLAUDE.md** : zéro persistance, hors-ligne, lisibilité ~1 m, cibles ≥ 44 px, couleur
  jamais seule (double encodage forme/picto/libellé).
- **Ton** : jamais culpabilisant, jamais infantilisant, pas de score, pas de smiley. Les contenus
  des S sont **verbatim** ; en cas de doute clinique, signaler plutôt qu'inventer. Aucun chiffre
  d'étude brut à l'écran (décision 4).
- **Illustrations** : utiliser `IllustrationSlot` (tabac) — placeholder sobre, auto-remplacé quand
  `public/illustrations/tabac/<id>.png` existera. Ne jamais bloquer sur une image manquante.
  Ids canoniques définis dans `S2.md` (outils) et `S5.md` (vapoteuse), prompts en `S7.md`.
- Auto-validation (gate de fin de session) : `npx tsc --noEmit` + `npm run build` verts
  (+ `npm test` si `lib/` touché). npm parfois absent du PATH : `node.exe` sous
  `/c/Program Files/nodejs/` (cf. STATUS.md). Visuel → consigné dans le `S<k>.md`, jamais de
  navigateur côté Claude.

## Points ouverts signalés à Thibault (n'empêchent pas d'exécuter)

1. **Vapoteuse dans les substituts** (S5) : technique d'utilisation rédigée par Fable à partir des
   positions HAS/HCSP et du rapport OE — **à revalider avant usage en consultation** (constantes
   `// à revalider (Thibault)`).
2. **Nouvelles cartes vrai/faux** (S4) : sources internationales (NEJM, Cochrane 2025) en attendant
   un équivalent HAS/SPF — marquées `// à revalider (Thibault)`.
3. **Formulations patient des outils** (S2) : adaptées du rapport OE (lui-même : ACC 2018 +
   méta-analyses) ; ton et exactitude à juger à l'usage en consultation.
4. Une fois les images générées : déposer les PNG dans `public/illustrations/tabac/` avec les ids
   de S2/S5 (piège C2PA/Inkscape : ré-encoder via Pillow, cf. mode d'emploi du HTML).
5. **Occurrences résiduelles du mot « craving »**, hors zone « Modifier » de tout `S<k>.md` de ce
   chantier (signalées par S1 et S2, non corrigées ici par discipline de périmètre — cf. `DECISIONS.md`
   2026-07-10, « points ouverts ») : `src/features/registry.ts` (description libre du thème générique,
   hors zone S1/S9), `src/features/tabac/nicotine/NicotineModule.tsx` (libellé texte « Craving » dans
   une liste de signes de manque, pas un id de navigation), `src/features/tabac/plan-arret/PlanArretModule.tsx`
   (commentaire de code référençant l'ancien chemin `craving/CravingModule.tsx`, supprimé). Une session
   future pourra les nettoyer si souhaité — occurrences purement cosmétiques, sans impact fonctionnel.
6. Validation visuelle humaine (S1-S8, aucune vérifiée en navigateur côté Claude) : checklists
   complètes consolidées dans `VALIDATION.md` § « Chantier boite-a-outils (BO1-BO9) ».

## Statut du chantier

**Clos le 2026-07-10** (BO1-BO9 exécutées, gate global vert, commits atomiques BO1→BO8 + commit
contexte BO9 créés). Push non effectué — en attente de validation par Thibault.
