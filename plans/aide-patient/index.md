# Plan — App d'aide patient autonome (QR, surface séparée)   (rédigé par Opus)

> **Origine** : point T16 de l'audit Chrome 2026-07-13 (`rapport-bugs-etp-tabac.md` §T16), sorti du chantier
> `corrections-audit-tabac` (session S12, note de cadrage) en **chantier séparé** car c'est une **nouvelle surface
> applicative**, pas une correction. Le cadrage a été complété avec Thibault le 2026-07-13 (arbitrages ci-dessous).
> **Autorités** : ce fichier · `rapport-bugs-etp-tabac.md` §T16 · `plans/corrections-audit-tabac/S12.md` (note de
> cadrage d'origine) · `CLAUDE.md` (invariants) · `DECISIONS.md` · `docs/contenu-modules-tabac.md` (contenu clinique).
> **Exécutant** : **Sonnet** par défaut ; **Opus** conseillé pour P1 (extraction de contenu, refactor à risque de régression).
> **Règle de validation** : **jamais** de navigateur/Playwright côté Claude. Chaque session = `npx tsc --noEmit` +
> `npm run build` (les **deux** entrées, consultation + patient) + `npm test` verts + checklist visuelle consignée dans
> son `P<n>.md` + `VALIDATION.md`, validée par Thibault à l'écran (`npm run dev`). Cf. `[[feedback_validation_visuelle]]`.

## Objectif d'ensemble

Offrir au patient une **web app autonome, générique et éphémère**, atteinte par **un QR code** posé sur les fiches/le
livret imprimés en consultation. Le patient y retrouve, seul et chez lui, **« Mes substituts »** (comment les utiliser)
et **« Agir face à une situation »** (situation → stratégies & outils adaptés). Cette app est une **surface distincte**
de l'outil soignant : elle ne contient **pas** le code de consultation, et ne reçoit **aucune** donnée patient.

## Décisions de Thibault (tranchées — cadrage 2026-07-13)

1. **Contenu générique.** Le QR renvoie vers un contenu **identique pour tous**, jamais les choix d'un patient →
   **aucune donnée patient** dans l'URL, le build ou un serveur (donnée de santé, RGPD). Invariant « zéro persistance »
   inchangé, y compris côté patient.
2. **Surface séparée = bundle séparé.** L'app patient n'est **pas** une route de l'app de consultation : c'est un
   **2ᵉ point d'entrée Vite** dont le graphe d'import ne touche **jamais** les modules soignant. « Le patient n'accède
   jamais seul à l'outil complet » se traduit par une **séparation physique du code**, pas par une route masquée.
3. **Périmètre v1** : uniquement **« Mes substituts »** et **« Agir face à une situation »**. Pas de motivation ni de
   bénéfices en v1.
4. **QR = un seul, vers la racine de l'app patient** (pas un QR par écran). → **une image statique unique**, générée
   une fois, posée à l'identique sur chaque fiche/le livret. **Aucune dépendance** (ni runtime ni build) : on ne génère
   rien au runtime, et comme il n'y a pas de deep-link par écran, **aucun slug d'URL n'est requis** — la navigation
   interne se fait **par état** (comme l'app principale, cohérent avec « pas de router »).
5. **Contenu patient = réutilisation + habillage auto-portant, proposé par Claude, validé par Thibault.** Les textes de
   consultation sont **délibérément sobres** (« narration = soignant ») ; le patient étant **seul**, chaque écran reçoit
   une **phrase de cadrage auto-portante** que Claude rédige en proposition (`// à revalider (Thibault)`). Point de
   vigilance : les textes outils sont en **voix soignant** (« comment le **proposer** ») → à reformuler en **voix
   patient** (« comment **faire** »).

## À trancher — différable au déploiement (ne bloque pas l'exécution)

- **Hébergement de l'URL séparée** : 2ᵉ **projet Vercel** avec sa propre URL `*.vercel.app`, **ou** vrai **sous-domaine**
  sur domaine custom. Ne change **pas le code** (seulement la cible de build/déploiement) — décision au moment de déployer.
  ⚠️ Ne jamais toucher/supprimer un `vercel.json` sans vérifier (cf. `[[feedback_vercel_json]]` — vaut pour d'autres repos,
  mais réflexe à garder ici aussi si un fichier de déploiement apparaît).

## Architecture cible

- **Couche de contenu partagée `src/content/`** — **source de vérité unique** consommée par l'app consultation **ET**
  l'app patient (ne jamais dupliquer) : formes de substituts (bonnes pratiques + technique + illustration),
  `situations` (déjà partagé via `src/features/tabac/situations.ts`), mapping **situation → outils** + fiches d'outils
  (libellé, illustration, conseils). L'extraction est un **pur déplacement** : le rendu de l'app consultation doit
  rester **strictement identique** (aucun changement fonctionnel).
- **Deux entrées, un repo, deux bundles** :
  - `index.html` + `src/main.tsx` → app **consultation** (existante, inchangée).
  - `patient.html` + `src/patient/main.tsx` → app **patient** (nouvelle). Configurée via
    `build.rollupOptions.input` dans `vite.config.ts`. **Contrainte dure** : le graphe d'import de l'entrée patient ne
    doit **jamais** atteindre `src/features/*/registry.ts` ni un module de consultation — seulement `src/content/` +
    primitives `src/components/` réutilisables.
- **App patient** : petite **home** (2 cartes : « Mes substituts », « Agir face à une situation ») + navigation **par
  état** (retour), même esthétique « papier crème » (tokens/primitives partagés). Aucune persistance.
- **QR** : une image statique unique (racine app patient) posée sur les fiches/le livret (`FicheOverlay` /
  `PrintableLivret` de **S11**), avec `print-color-adjust: exact`.

## Sessions (à écrire au lancement de l'exécution)

| Session | Tâche | Titre | Modèle | Effort | Dépend de | Zone | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- |
| P1 | Socle | Extraction `src/content/` (refactor pur, rendu consultation identique) | Opus | high | chantier `corrections-audit-tabac` commité | `src/content/` + substituts/boîte-à-outils/situations | [ ] |
| P2 | Coquille | 2ᵉ entrée Vite + app patient (home + nav par état), bundle séparé | Sonnet | high | P1 | `patient.html`, `src/patient/`, `vite.config.ts` | [ ] |
| P3 | Écran | « Mes substituts » (voix patient, habillage proposé) | Sonnet | medium | P1·P2 | `src/patient/substituts/` | [ ] |
| P4 | Écran | « Agir face à une situation » (situation → outils, voix patient) | Sonnet | high | P1·P2 | `src/patient/situations/` | [ ] |
| P5 | QR | QR unique (racine patient) + pose sur fiches/livret | Sonnet | low | **S11** (chantier courant) + P2 | `public/qr/`, `FicheOverlay`/`PrintableLivret` | [ ] |
| P6 | Conso | Contexte + commits par tâche + note déploiement | Haiku | low | tout | STATUS/TASKS/VALIDATION/DECISIONS/PROJECT_MAP | [ ] |

## Ordonnancement

```
P1                      (solo, bloquant — refactor de contenu)
P2                      (solo, après P1)
P3 · P4                 (parallèle, après P2 — écrans, zones disjointes)
P5                      (après S11 mergé + P2)
P6                      (consolidation)
```

## Gates humaines (bloquantes)

- **Avant de démarrer** : chantier `corrections-audit-tabac` **commité et stable** (P1 retouche substituts + boîte-à-outils,
  tout juste modifiés par S1/S3 — ne pas re-churner du non-commité).
- **Avant P5** : S11 (livret + fiches) mergé, car le QR se pose sur ces surfaces.
- **Après chaque session** : validation visuelle Thibault (`npm run dev` **sur les deux apps**), checklist dans `P<n>.md` + `VALIDATION.md`.
- **Contenu patient** : tout habillage auto-portant proposé par Claude est `// à revalider (Thibault)` (autorité clinique).

## Garde-fous (toutes sessions)

- **Zéro persistance**, y compris côté patient (ni localStorage/sessionStorage/cookies/réseau ; aucune donnée patient dans l'URL).
- **Zéro dépendance runtime ajoutée** — le QR est une **image statique**, pas une lib. `lucide-react` déjà présent.
- **Séparation stricte des bundles** : l'entrée patient n'importe jamais le registre ni un module de consultation.
  Vérifier après build que le bundle patient ne contient pas le code soignant (taille + inspection d'import).
- **`src/content/` = source unique** : ne jamais dupliquer un texte entre consultation et patient — les deux lisent la même couche.
- **Moteur thème-agnostique** : `src/components/`, `types.ts`, `registry.ts` ne connaissent aucun thème en dur (l'app patient v1
  est tabac, mais la couche `src/content/` doit rester structurée pour accueillir d'autres thèmes plus tard).
- **Voix patient** : reformuler tout texte en « comment faire » (jamais « comment le proposer »). Cibles interactives ≥ 44 px.
- **Validation visuelle = humaine.** Ne jamais prétendre avoir vu le rendu.

### Statut du chantier

[ ] **Cadré, non démarré.** Cadrage produit complet (contenu générique · surface/bundle séparé · v1 substituts+situations ·
QR unique vers racine · contenu réutilisé + habillage proposé). Reste différable : hébergement de l'URL (au déploiement).
→ Écrire les `P<n>.md` et lancer **après** le push du chantier `corrections-audit-tabac`.
