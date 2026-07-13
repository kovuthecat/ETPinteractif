# Plan — App d'aide patient autonome (QR, surface séparée)   (rédigé par Opus)

> **Origine** : point T16 de l'audit Chrome 2026-07-13 (`rapport-bugs-etp-tabac.md` §T16), sorti du chantier
> `corrections-audit-tabac` (S12, note de cadrage) en **chantier séparé** car c'est une **nouvelle surface
> applicative**, pas une correction. Cadrage complété avec Thibault le 2026-07-13.
> **Autorités** : ce fichier · `rapport-bugs-etp-tabac.md` §T16 · `CLAUDE.md` (invariants) · `DECISIONS.md` ·
> `docs/contenu-modules-tabac.md` (contenu clinique) · `WORKFLOW.md` (format des plans).
> **Règle de validation** : **jamais** de navigateur/Playwright côté Claude. Chaque session = `npx tsc --noEmit`
> + `npm run build` (les **deux** entrées) + `npm test` verts + checklist visuelle dans son `S<k>.md` +
> `VALIDATION.md`, validée par Thibault à l'écran (`npm run dev`). Cf. `[[feedback_validation_visuelle]]`.

## Objectif d'ensemble

Offrir au patient une **web app autonome, générique et éphémère**, atteinte par **un QR code** posé sur les
fiches/le livret imprimés en consultation. Il y retrouve, seul et chez lui, **« Mes substituts »** (comment les
utiliser) et **« Agir face à une situation »** (situation → stratégies & outils adaptés). Cette app est une
**surface distincte** de l'outil soignant : elle ne contient **pas** le code de consultation, et ne reçoit
**aucune** donnée patient.

## Décisions de Thibault (tranchées — cadrage 2026-07-13)

1. **Contenu générique.** Le QR renvoie vers un contenu **identique pour tous**, jamais les choix d'un patient →
   **aucune donnée patient** dans l'URL, le build ou un serveur (RGPD). Invariant « zéro persistance » inchangé.
2. **Surface séparée = bundle séparé.** L'app patient n'est **pas** une route de l'app de consultation : c'est un
   **2ᵉ point d'entrée Vite** dont le graphe d'import ne touche **jamais** les modules soignant (registre + `.tsx`
   de module). Séparation **physique** du code, pas une route masquée.
3. **Périmètre v1** : uniquement **« Mes substituts »** et **« Agir face à une situation »**. Pas de motivation ni
   de bénéfices en v1.
4. **QR = un seul, vers la racine de l'app patient** → **une image statique unique**, générée une fois hors-app,
   posée à l'identique sur chaque fiche/le livret. **Aucune dépendance** (ni runtime ni build) ; pas de deep-link
   par écran → **aucun slug d'URL requis**, navigation interne **par état** (comme l'app principale, « pas de router »).
5. **Contenu patient = réutilisation + habillage auto-portant, proposé par Claude, validé par Thibault.** Les textes
   de consultation sont **délibérément sobres** (« narration = soignant ») ; le patient étant **seul**, chaque écran
   reçoit une **phrase de cadrage auto-portante** que Claude rédige en proposition (`// à revalider (Thibault)`).
   Point de vigilance : le champ `proposition` des outils est en **voix soignant** (« comment le **proposer** ») →
   à reformuler en **voix patient** (« comment **faire** »).

## À trancher — différable au déploiement (ne bloque pas l'exécution)

- **Hébergement de l'URL séparée** : 2ᵉ **projet Vercel** avec sa propre URL `*.vercel.app`, **ou** vrai
  **sous-domaine** sur domaine custom. Ne change **pas le code** (seulement la cible de build/déploiement) —
  décision au moment de déployer. ⚠️ Ne jamais toucher/supprimer un `vercel.json` (cf. `[[feedback_vercel_json]]`).

## Maquette (gate de conception)

Surface patient **neuve** → une **maquette Claude Design** serait la voie nominale (`README.md` §4). **Retenu par
défaut : v1-directe sans maquette** — précédent `extensions-tabac` (`DECISIONS.md` §2026-07-09 : composition depuis
le design system existant, la validation visuelle humaine sert de filet) : l'app patient réutilise tokens,
primitives et contenu déjà maquettés. Thibault peut demander une maquette avant S3/S4 s'il veut cadrer le visuel
d'abord (alors : `ARCHITECTURE.md` §Maquette → `design/maquettes/`, puis S3/S4 câblent dessus).

## Architecture cible

- **Couche de contenu partagée `src/content/tabac/`** — **source de vérité unique** consommée par l'app consultation
  **ET** l'app patient. Bonne nouvelle : le contenu est **déjà en fichiers `data.ts` purs** — `substituts/data.ts`
  (`FORMES_DATA`), `situations.ts` (`SITUATIONS` + `parseSelectionSituations`), `boite-a-outils/data.ts` (`OUTILS`,
  chaque `Outil` porte `situations: string[]` + `transverse`, plus `PREUVE_LABELS`). S1 les **relocalise** sous
  `src/content/tabac/` (déplacement pur, imports consultation mis à jour, rendu identique).
- **Deux entrées, un repo, deux bundles** :
  - `index.html` + `src/main.tsx` → app **consultation** (existante, inchangée).
  - `patient.html` + `src/patient/main.tsx` → app **patient** (nouvelle), via `build.rollupOptions.input`
    (`vite.config.ts`). **Contrainte dure** : le graphe d'import de l'entrée patient ne doit **jamais** atteindre
    `src/features/*/registry.ts` ni un module de consultation — seulement `src/content/tabac/` + primitives
    `src/components/` réutilisables + tokens/`global.css`.
- **App patient** : petite **home** (2 cartes : « Mes substituts », « Agir face à une situation ») + navigation
  **par état** (retour), même esthétique « papier crème ». Aucune persistance.
- **QR** : une image statique unique (racine app patient) posée sur les fiches/le livret (`FicheOverlay` /
  `PrintableLivret`), avec `print-color-adjust: exact`.

## Sessions

| Session | Tâches | Titre | Modèle | Effort | Dépend de | Zone modifiée (« Modifier ») | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [S1](S1.md) | T1 | Couche `src/content/tabac/` (relocalisation données partagées, déplacement pur) | Sonnet | high | corrections-audit-tabac commité | `src/content/tabac/`, importeurs `src/features/tabac/**` | [x] |
| [S2](S2.md) | T2 | 2ᵉ entrée Vite + coquille app patient (home + nav par état, bundle isolé) | Sonnet | high | S1 | `patient.html`, `src/patient/`, `vite.config.ts` | [x] |
| [S3](S3.md) | T3 | Écran « Mes substituts » (voix patient) | Sonnet | medium | S1·S2 | `src/patient/substituts/` | [x] |
| [S4](S4.md) | T4 | Écran « Agir face à une situation » (situation → outils, voix patient) | Sonnet | high | S1·S2 | `src/patient/situations/` | [x] |
| [S5](S5.md) | T5 | QR unique (racine patient) + pose sur fiches/livret | Sonnet | low | S2 | `public/qr/`, `FicheOverlay`, `PrintableLivret`, `plan-arret/` | [x] |
| [S6](S6.md) | — | Consolidation : contexte + commits par tâche + note déploiement | Haiku | low | tout | STATUS/TASKS/VALIDATION/DECISIONS/PROJECT_MAP/index | [ ] |

## Ordonnancement

- **Vague 1 — solo (bloquant)** : **S1**. Refactor de contenu ; tout le reste en dépend.
- **Vague 2 — solo** : **S2** (après S1). Établit l'entrée + la coquille patient dont S3/S4 héritent.
- **Vague 3 — parallélisable (zones disjointes)** : **S3 · S4 · S5**. S3 = `src/patient/substituts/`, S4 =
  `src/patient/situations/`, S5 = `public/qr/` + composants d'impression consultation — aucune collision.
- **Vague 4 — consolidation** : **S6**.

```
V1: S1                 (solo, bloquant)
V2: S2                 (solo, après S1)
V3: S3 · S4 · S5       (parallèle, après S2, zones disjointes)
V4: S6                 (consolidation)
```

## Gates humaines (bloquantes)

- **Avant S1** : chantier `corrections-audit-tabac` **commité et stable** (S1 retouche les importeurs de
  substituts/boîte-à-outils, tout juste modifiés) — ✅ fait (poussé `origin/main`).
- **Avant S3/S4** : décider maquette vs v1-directe (voir §Maquette ci-dessus) — défaut = v1-directe.
- **Après chaque session** : validation visuelle Thibault (`npm run dev` **sur les deux apps** : `/` et
  `/patient.html`), checklist dans le `S<k>.md` + `VALIDATION.md`.
- **Contenu patient** : tout habillage auto-portant proposé par Claude est `// à revalider (Thibault)`.

## Garde-fous (toutes sessions)

- **Zéro persistance**, y compris côté patient (ni localStorage/sessionStorage/cookies/réseau ; aucune donnée
  patient dans l'URL). **Zéro dépendance runtime ajoutée** — le QR est une **image statique**, pas une lib.
- **Séparation stricte des bundles** : l'entrée patient n'importe jamais le registre ni un module de consultation
  (vérif après build : inspecter que le bundle patient ne contient pas le code soignant).
- **`src/content/tabac/` = source unique** : ne jamais dupliquer un texte entre consultation et patient.
- **Moteur thème-agnostique** : `src/components/`, `types.ts`, `registry.ts` sans thème en dur ; `src/content/`
  structuré pour accueillir d'autres thèmes plus tard.
- **Voix patient** : « comment faire », jamais « comment le proposer ». Cibles interactives ≥ 44 px.
- **Validation visuelle = humaine.** Ne jamais prétendre avoir vu le rendu.

## Commits & fin de plan (cf. `WORKFLOW.md` §4d)

Pas de commit/push pendant les sessions (statut + checklist visuelle dans chaque `S<k>.md`). **En fin de plan
(S6)** : commit **tâche par tâche** (staging explicite, jamais `git add -A`), messages fournis par chaque `T<n>`,
mise à jour des statuts + contexte, puis **un seul push**.

### Statut du chantier

[ ] **Cadré, non démarré.** Sessions S1-S6 rédigées. Démarrer par S1 quand Thibault le décide. Reste différable :
hébergement de l'URL (au déploiement) ; maquette éventuelle avant S3/S4.
