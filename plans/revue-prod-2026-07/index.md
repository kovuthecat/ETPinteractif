# Plan revue-prod-2026-07 — Correctifs issus de la revue prod (navigateur in-app)   (rédigé par Opus)

## Objectif d'ensemble

Traiter les constats d'une revue prod complète (2026-07-21) des trois surfaces —
**consultation tabac + diabète**, **livret imprimable**, **app patient** — menée au navigateur
in-app sur `etp-interactif.vercel.app`. Deux constats structurants dominent :

1. **Les outils interactifs ne se lancent pas dans l'app patient** alors qu'ils fonctionnent en
   consultation. Racine identifiée (cf. RP1) : le bundle patient monte l'outil actif **inline, sous
   la liste des cartes**, sans overlay ni `scrollIntoView`. Seuls les outils rendus en overlay
   `position: fixed` (Respiration) sont visibles ; tous les outils inline (SI-ALORS, tirelire,
   checklists, minuteur, plan de secours, phrase de refus, journal, **4D/VagueCraving**) se montent
   hors écran → le bouton « Démarrer » semble mort. Régression de la promesse G1 du chantier
   `outils-interactifs-2026-07` (le câblage patient a été posé mais jamais rendu visible).
2. **Refonte demandée de « Mon plan d'arrêt »** (Thibault, 2026-07-21) : ne garder que les sections
   **1 (date/stratégie)** et **7 (si j'ai un écart)**, retirer les sections 2 à 6 — déjà saisies dans
   les modules amont. Vérifié cette session : le livret lit l'**état partagé** (pas l'UI du plan),
   donc la suppression ne casse pas le livret ; une réserve subsiste sur la section 4 (Parades) et le
   « + autre » des situations (cf. RP2).

Le reste = correctifs ciblés (livret/QR, ergonomie consultation) et une passe de vérification pour
les points dont le statut vs le code existant est incertain.

Traçabilité : ids `RP<n>`. Source : revue prod Opus + Thibault, 2026-07-21.

## Réconciliation avec l'existant (à NE PAS refaire)

Plusieurs constats de la revue sont **déjà traités** dans le repo (chantiers clos `revue-chrome-2026-07`
et `outils-interactifs-2026-07`, poussés sur `main`). Ils ne sont **pas** ré-ouverts ici :

| Constat revue prod | Déjà couvert par | Décision |
| --- | --- | --- |
| « Ce que l'arrêt répare » : silhouette **statique** (vérifié) vs diabète qui surligne l'organe | revue-chrome S2 a traité frise/vignettes, **pas** la silhouette elle-même | **Traité en RP6a (S5)** — cohérence entre thèmes, gate G-RP6 |
| Livret : parades = « 4D » fixe, ignore la sélection | revue-chrome S10 (D6) | **Intentionnel** — les 4D sont une unité pédagogique ; RP2 retire de toute façon la section 4 du plan |
| Livret : A5, N&B, pagination, patch page dédiée, situations par pilier | revue-chrome S9-S13 (D1-D6) | Fait |
| Substituts desktop 2 colonnes, titration extraite, carnet, respiration | revue-chrome S5/S8/S15/S16 | Fait |
| Diabète : camembert au drag, ordonnance, bulle cardio, insuline | revue-chrome S1/S18, C1-C5 | Fait |
| Outils interactifs **en consultation** | outils-interactifs-2026-07 (clos) | Fait (fonctionne) |

## Décisions structurantes (à consigner dans `DECISIONS.md` à la consolidation)

- **RP1 — parité d'affichage patient ↔ consultation.** Le bundle patient monte l'outil interactif
  actif de la **même façon** que la consultation : `BoiteAOutilsModule.tsx:78` fait un *early return*
  qui **remplace la vue** par le composant. `PatientSituations.tsx` doit adopter le même schéma
  (remplacer la liste par l'outil actif), au lieu de rendre le composant après la liste
  (`PatientSituations.tsx:202`). Aucun composant d'outil n'est modifié ; seul le point de montage
  change. Invariant : ne pas régresser le cas `journal` (câblage direct + `onOuvrirCarnet`).
- **RP2 — le plan d'arrêt devient un plan « bornes » (date + rebond).** `PlanArretModule` ne présente
  plus que la **section 1** (mode + date) et la **section 7** (gestes d'écart). Les sections 2-6
  disparaissent de l'**UI du plan** ; le **livret continue** de les afficher car il lit l'état
  partagé (`SelectionState`), alimenté par les modules amont (situations ← Composantes ; substituts ←
  module Substituts ; raisons ← Motivation). Aucune donnée n'est perdue **sauf** deux exceptions
  tranchées en gate (G-RP2).
- **RP3 — le QR du livret ne doit pas sur-promettre.** L'asset statique `public/qr/patient.png` mène
  à l'app patient **générique** ; son libellé actuel (« retrouvez mes substituts et mes parades »)
  promet une reprise personnalisée qui n'existe pas (zéro persistance + QR statique). Deux voies au
  choix (gate G-RP3) : (a) **reformuler** le libellé (« Retrouvez l'application et ses outils chez
  vous »), (b) **encoder l'état** dans le lien (QR généré). Défaut sobre = (a).
- **RP4 — vérifier avant de corriger.** Les points d'ergonomie consultation (débordement Composantes,
  sensibilité du cadran, libellé « Glissez » de l'alimentation, effet « Traitements » gaté par le nom,
  en-têtes à onglets multiples) sont d'abord **reproduits sur un build à jour** ; on ne corrige que
  ceux réellement présents, pour ne pas défaire un correctif déjà en place.

## Sessions

| Session | Tâches | Titre | Modèle | Effort | Dépend de | Zone modifiée | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [S1](S1.md) | RP1 | Patient : monter les outils interactifs (parité consultation) | Sonnet | high | — | `patient/situations/PatientSituations.tsx` (+ css) | [x] |
| [S2](S2.md) | RP2 | « Mon plan d'arrêt » réduit aux sections 1 & 7 + garde-fous routage | Sonnet | high | — | `features/tabac/plan-arret/PlanArretModule.tsx`, `content/tabac/situations.ts` (option « + autre ») | [x] |
| [S3](S3.md) | RP3a, RP3b | Livret : QR honnête + « + autre » validé au blur | Sonnet | medium | — | `plan-arret/livretSections.tsx`, `PlanArretModule.tsx`, `public/qr/` (libellé) | [x] |
| [S4](S4.md) | RP4-V, RP4a…e | Ergonomie consultation : vérifier puis corriger | Sonnet | high | — | `tabac/composantes`, `tabac/motivation`, `diabete/alimentation`, `diabete/traitements`, en-têtes modules | [x] |
| [S5](S5.md) | RP6a…d | Cohérence & finitions tabac (silhouette bénéfices, Mes raisons, quiz, troncatures) | Sonnet | medium | — | `tabac/benefices-arret`, `tabac/motivation`, module Vrai/faux | [x] |
| [S6](S6.md) | — | Consolidation (commits, statuts, contexte, push, redeploy) | Haiku | minimal | toutes | `STATUS/TASKS/VALIDATION/DECISIONS/PROJECT_MAP/index` | [x] |

## Ordonnancement

- **Vague 1 — parallélisable** (zones disjointes) : **S1** (bundle patient) · **S2** (plan-arret) ·
  **S3** (livret + asset) · **S4** (modules consultation) · **S5** (bénéfices/motivation/quiz tabac).
  Aucune ne touche les fichiers d'une autre. S2 et S3 partagent `plan-arret/` mais sur des
  fichiers/sections distincts (`PlanArretModule` UI vs `livretSections` + QR) → à séquencer S2 → S3 si
  conflit, sinon parallèle. S5 touche `tabac/motivation` (onglet Mes raisons) — disjoint de S1-S4.
- **Vague finale — consolidation** : **S6** (§4d WORKFLOW : commits tâche par tâche, staging explicite,
  statuts `index.md`/`TASKS.md`, `STATUS.md`/`VALIDATION.md`, entrées `DECISIONS.md`, un seul push ;
  **vérifier le redeploy Vercel** après push).

## Gates / décisions à valider (Thibault)

- **G-RP2 — sections retirées du plan.** ✅ demandé : ne garder que 1 & 7. Deux points à trancher :
  - **Parades (section 4)** : **aucun module amont** ne les saisit ; le livret imprime déjà les 4D
    fixes. Les retirer = parades non personnalisables (statu quo de fait). **Défaut : on retire.**
    Alternative : créer une source amont (hors périmètre).
  - **« + autre » des situations** : aujourd'hui, seule la section 3 du plan permet une situation
    **personnalisée**. Composantes n'a pas de « + autre ». **Défaut proposé : ajouter un « + autre »
    dans Composantes** (RP2b) pour ne pas perdre cette capacité. À confirmer.
- **G-RP3 — QR du livret.** (a) reformuler le libellé [défaut] ou (b) encoder l'état personnalisé.
- **G-RP4 — périmètre ergonomie.** Chaque point de S4 est **conditionné à sa reproduction** sur build
  à jour ; ceux déjà corrigés sont clos sans code (notés dans VALIDATION).
- **G-RP6 — cohérence & finitions. ✅ TRANCHÉ (2026-07-21).** Silhouette bénéfices tabac = **(a) porter
  le surlignage d'organe** (aligné sur le diabète). Quiz Vrai/faux = **(b) parti-pris non-évaluatif
  assumé** → aucun feedback à coder, décision consignée en `DECISIONS.md`. RP6b/RP6d restent
  conditionnés à reproduction.

> Les gates ne bloquent pas la Vague 1 : chaque session code le défaut sobre et marque les points G*
> « à revalider (Thibault) ». La consolidation (S6) fige les réponses.

## Roadmap / hors périmètre (décisions produit, non planifiées ici)

Constats de la revue qui relèvent d'un **choix produit** plus que d'un correctif — capturés pour ne pas
les perdre, mais **hors de ce chantier** :

- **Diabète : pas de synthèse take-home unifiée** (équivalent de « Mon plan d'arrêt ») ni de porte
  d'entrée **« Se motiver »**. Le tabac ouvre sur la motivation et se referme sur un livret ; le diabète
  disperse ses sorties (carte hypo, ordonnance, fiche cardio). Harmoniser = décision de conception.
- **Carnet patient sans agrégation** : l'intro promet « repérer vos moments à risque » mais l'écran
  n'offre qu'un historique plat. Une petite synthèse (contexte fréquent, créneaux horaires) tiendrait
  la promesse.
- **App patient limitée au tabac** : la consultation couvre les deux thèmes ; pas d'app patient diabète.

Ces points sont rappelés en tête de S6 pour trace ; à arbitrer séparément avec Thibault.

## Clôture (2026-07-21)

**Chantier clos.** S1-S5 exécutées en vague parallèle (S1/S2/S4/S5 concurrentes, S3 après S2 pour
partage de `PlanArretModule.tsx`), consolidées en S6 : `npx tsc --noEmit` + `npm run build` + `npx
vitest run` (106/106) verts sur l'arbre cumulé, 6 commits atomiques + 1 commit contexte, poussés en un
seul push vers `origin/main`. Détail des gates dans `DECISIONS.md` (2026-07-21). **Validation visuelle
humaine (Thibault, `npm run dev`) reste entièrement à faire** — checklists consolidées dans
`VALIDATION.md`.
