# Plan theme-diabete — Câbler le thème diabète sur la maquette Claude Design   (rédigé par Fable)

## Objectif d'ensemble

Implémenter les **9 modules du thème diabète** dans le moteur multi-thèmes existant, fidèlement à la
maquette Claude Design (handoff du 2026-07-09) et à la SPEC pédagogique. Deux fondations transverses
d'abord : une **lib de courbe de glycémie** physiologiquement plausible (demande explicite de Thibault :
les courbes des modules Alimentation / Activité physique / Insuline doivent coller à la réalité et aux
situations illustrées, pas un simple « score » qui gonfle une bosse) et les **objets visuels partagés**
(silhouette-corps, composant courbe, plaque d'athérome). Réutilise tel quel le socle refonte-ui
(tokens, fonts, `ModuleShell`, `FicheOverlay`, `ModuleFooterNav`).

## Autorités (par ordre de préséance)

- **`docs/diabete/SPEC_outil_ETP_diabete.md`** — autorité pédagogique (le *pourquoi*). En cas de doute
  d'intention, elle prime.
- **`docs/diabete/BRIEF_DESIGN_diabete.md`** — intentions visuelles, objets partagés (§1), pièges par module.
- **La maquette** (le *à quoi ça ressemble*, une page HTML autoportante par module) :
  `maquettes/Maquette handsoff diabete/extracted/brief-du-module-diab-te/project/Module <n> - <titre>.dc.html`
  — logique dans `<script data-dc-script>` (état + `renderVals()`), styles inline exacts.
- **Exception voulue à la maquette** : la logique des courbes (fonction `curvePath(score)` des modules
  2/3, `dayPath` du 9, `recoveryPath` du 8) est **remplacée** par la lib de S2 — cf. « Décision courbes »
  ci-dessous. Tout le reste (zones, objets, états, textes, séquences) se câble sur la maquette.

> ℹ️ Dans les `.dc.html` : ignorer `support.js` / `image-slot.js` (runtime du design-tool) et les fonts
> CDN (interdites — l'app est hors-ligne). Ne pas rendre ces fichiers au navigateur : tout est lisible
> dans le source. Le canvas fixe 1920×1080 scalé de la maquette n'est **pas** repris : on adapte chaque
> écran au layout responsive `ModuleShell` existant (même démarche que refonte-ui) ; la fidélité porte
> sur structure, contenus, états et interactions — pas le pixel.

## Décision courbes (note Thibault, transverse aux modules 2 · 3 · 8 · 9)

La maquette pilote ses courbes par un scalaire abstrait (`score` 0-1 → hauteur/position d'une bosse
unique). C'est insuffisant : mêmes causes → même dessin, aucun lien visible entre la situation illustrée
et la forme de la courbe. **S2 crée `src/features/diabete/lib/glycemieCurve.ts`** (+ tests Vitest),
modèle temporel paramétrique sur le patron de `nicotineCurve.ts` : temps réel en abscisse, baseline,
repas comme événement, effets composition/ordre/activité/resucrage/scénarios nocturnes avec les bons
ordres de grandeur qualitatifs. Chaque affirmation pédagogique du brief devient un **invariant testé**
(détail dans `S2.md`). Les modules 2, 3, 8 et 9 consomment cette lib sans la modifier — une seule
identité de courbe (brief §1.2), rendue par le composant partagé `CourbeGlycemie` (S3).
⚠️ Reste un **modèle pédagogique, pas un simulateur** : fidèle au *sens* des variations, mg/dL indicatifs
au survol uniquement (SPEC §6.3).
**Évolution 2026-07-09 (S14, demande Thibault)** : le repas n'est plus agrégé par heuristiques de
familles + proximité à l'assiette-modèle, mais par la **composition réelle approximative** des aliments
(CG, fibres, protéines, lipides — cf. `S14.md` §0.c). Ordre du féculent gradué (0→1), scénario nocturne
`nuit_isolee` remplacé par `descend_hypo_matinale`.

## Sessions

| Session | Tâche | Titre | Modèle | Effort | Dépend de | Zone modifiée | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [S1](S1.md) | D1 | Socle thème : registre 9 modules + familles + stubs + `IllustrationSlot` | Sonnet | medium | — | `src/features/diabete/registry.ts` + stubs `<slug>/`, `src/features/registry.ts`, `components/IllustrationSlot.*` (diabete) | [x] |
| [S2](S2.md) | D2 | **Lib courbe de glycémie** (`glycemieCurve.ts` + tests) — modèle physiologique | Sonnet | high | — | `src/features/diabete/lib/` | [x] |
| [S3](S3.md) | D3 | Objets transversaux SVG : `Silhouette`, `CourbeGlycemie`, `PlaqueArtere`, `SignatureEvitable` | Sonnet | high | — | `src/features/diabete/components/` (hors IllustrationSlot) | [x] |
| [S4](S4.md) | D4 | Module 1 — C'est quoi le diabète (clé/serrure, 4 temps) | Sonnet | medium | S1 | `src/features/diabete/mecanisme/` | [x] |
| [S5](S5.md) | D5 | Module 2 — Alimentation (garde-manger, 4 défis + synthèse, fiche) | Sonnet | high | S1+S2+S3 | `src/features/diabete/alimentation/` | [x] |
| [S6](S6.md) | D6 | Module 3 — Activité physique (rayonnement, jauge, timing sur la courbe) | Sonnet | high | S1+S2+S3 | `src/features/diabete/activite/` | [x] |
| [S7](S7.md) | D7 | Module 4 — Risque cardiovasculaire (5 feux, artère réversible, anatomie, fiche) | Sonnet | high | S1+S3 | `src/features/diabete/risque-cardio/` | [x] |
| [S8](S8.md) | D8 | Module 5 — Complications (silhouette, « évitable », fiche pied) | Sonnet | medium | S1+S3 | `src/features/diabete/complications/` | [x] |
| [S9](S9.md) | D9 | Module 6 — Suivi (cadran de l'année + fiche calendrier) | Sonnet | high | S1+S3 | `src/features/diabete/suivi/` | [x] |
| [S10](S10.md) | D10 | Module 7 — Traitements (ordonnance ↔ silhouette) | Sonnet | medium | S1+S3 | `src/features/diabete/traitements/` | [x] |
| [S11](S11.md) | D11 | Module 8 — Hypoglycémie (profil, 15/15, récupération/overshoot, carte) | Sonnet | medium | S1+S2+S3 | `src/features/diabete/hypoglycemie/` | [x] |
| [S12](S12.md) | D12 | Module 9 — Insuline (courbe capteur, 3 situations, TIR vivant) | Sonnet | high | S1+S2+S3 | `src/features/diabete/insuline/` | [x] |
| [S13](S13.md) | D13 | Consolidation : contexte + commits + audit Codex + push | Haiku (+Codex) | low | S4-S12 | `STATUS`/`TASKS`/`VALIDATION`/`PROJECT_MAP`/`DECISIONS`/`docs/diabete/` | [x] |
| [S14](S14.md) | D14 | **Corrections bugs revue visuelle 2026-07-09** (7 bugs : M2 ×3, M3, M6, M8, M9 + lib courbe) | Sonnet | high | S13 | `lib/`, `alimentation/`, `activite/`, `suivi/`, `hypoglycemie/`, `insuline/`, `components/IllustrationSlot.*` | [x] |

## Ordonnancement

- **Vague 1 — 3 agents parallèles, bloquante** : **S1 · S2 · S3**. Zones disjointes :
  S1 = registres + stubs + `IllustrationSlot` ; S2 = `lib/` ; S3 = `components/` du thème (hors
  `IllustrationSlot`). S3 ne dépend pas de S2 : `CourbeGlycemie` reçoit des paths/bandes précalculés
  en props, sans importer la lib. Après cette vague, plus personne ne touche ces zones.
- **Vague 2 — 9 agents parallèles** : **S4 … S12**, un module chacun, chacun seul écrivain de son
  `src/features/diabete/<slug>/`. Personne ne touche `registry.ts` (S1 a tout câblé via les stubs),
  ni `lib/`, ni `components/`, ni quoi que ce soit hors de son dossier. Règles vague parallèle
  (WORKFLOW §4d) : aucun commit/push, aucun fichier partagé (`STATUS.md`, `TASKS.md`, `index.md`,
  `VALIDATION.md`) — statut et checklist visuelle consignés dans son `S<k>.md`.
- **Vague 3 — consolidation (S13, solo)** : commits tâche par tâche (messages prévus dans chaque
  `S<k>.md`, staging explicite), statuts (`index.md`, `TASKS.md`), `STATUS.md`, `VALIDATION.md`,
  `PROJECT_MAP.md`, `DECISIONS.md`, colonne Design de la SPEC, **un seul push**. Puis audit visuel
  Codex (Playwright, cf. `AGENTS.md`) — jamais Claude pour le visuel.

## Contrôle de parallélisme (zones disjointes vérifiées)

- S1 = **seul écrivain** de `src/features/registry.ts`, `src/features/diabete/registry.ts`, des 9 stubs
  `<slug>/<X>Module.tsx` (que la vague 2 remplacera *dans leur dossier*) et de `IllustrationSlot.*`.
- S2 = seul écrivain de `src/features/diabete/lib/**`.
- S3 = seul écrivain de `src/features/diabete/components/**` **sauf** `IllustrationSlot.*` (S1).
- S4-S12 = chacun seul écrivain de son `src/features/diabete/<slug>/**` (le stub posé par S1 inclus).
- Un token/primitive CSS global manque ? **STOP et signaler** — personne ne modifie `src/styles/**`.

## Garde-fous transverses (valent pour toutes les sessions)

- **Ne pas toucher** : `src/components/**`, `src/features/types.ts`, `src/features/tabac/**`,
  `src/styles/**`, `App.tsx`, `index.html`.
- **Aucune dépendance ajoutée** (runtime ou dev). Pas de lib de graphe, d'anim, de dates. Pas de
  nouvelle police (l'effet « manuscrit » du module 7 se rend en Source Serif 4 italique).
- **Invariants CLAUDE.md** : zéro persistance, hors-ligne, lisibilité ~1 m, cibles ≥ 44 px,
  couleur jamais seule (double encodage forme/picto/libellé — daltonisme, brief §1.1).
- **Grammaire des feux** : le rouge est réservé à l'état de santé (modules 4, bandes du 9, pastilles CG
  du 2) — **jamais** pour une tâche non faite (module 6 : ambre + horloge).
- **Illustrations** : la maquette utilise des `image-slot` (placeholders). Partout → composant
  `IllustrationSlot` de S1 (placeholder sobre auto-remplacé par `public/illustrations/diabete/<id>.png`
  quand le fichier existera). Ne jamais bloquer sur une image manquante.
- **Exactitude médicale** : textes repris **verbatim** de la maquette/SPEC ; en cas de doute clinique,
  signaler plutôt qu'inventer. Les fréquences d'examens (module 6) et seuils (module 4) sont à
  revalider par Thibault → les isoler dans des constantes commentées `// à revalider (Thibault)`.
- Auto-validation (gate de fin de session) : `npx tsc --noEmit` + `npm run build` verts
  (+ `npm test` pour S2/S5/S6/S11/S12). npm parfois absent du PATH : `node.exe` est sous
  `/c/Program Files/nodejs/` (cf. STATUS.md). Visuel → consigné, jamais de navigateur côté Claude.

## Points ouverts signalés à Thibault (n'empêchent pas d'exécuter)

1. **Familles d'accueil** retenues : Comprendre (M1·M4·M5) / Agir au quotidien (M2·M3) /
   Se soigner (M6·M7·M8·M9) — à confirmer, changement trivial dans `registry.ts`.
2. **Illustrations** : les prompts existent (`design/illustrations/prompts-illustrations-diabete.html`) ;
   à générer puis déposer dans `public/illustrations/diabete/` (convention d'ids dans `S1.md`).
3. **Fréquences ADA/HAS-SFD** (module 6) et **seuils** (module 4) : à revalider avant usage en
   consultation (brief §Module 6 le demande explicitement).
