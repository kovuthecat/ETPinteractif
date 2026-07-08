# Plan refonte-ui — Câbler l'app sur la maquette Claude Design   (rédigé par Opus)

## Objectif d'ensemble

Refondre l'UI des 7 modules ETP pour qu'ils reproduisent **fidèlement** la maquette
`maquettes/ETP Tabac - Standalone.html` (visuel **et** interactions). Concrètement : nouveau système de design
(typo serif+sans auto-hébergée, palette `oklch` crème/éditoriale, ombres brunes, primitives d'UI partagées),
appliqué à l'accueil, à la coquille et aux 7 modules. Une seule vraie réécriture de geste : **Motivation**
(cadran circulaire + flux 2 questions au lieu des curseurs). Invariants inchangés (zéro persistance, hors-ligne,
lisibilité ~1 m, couleur jamais seule).

## Autorités (lues par toutes les sessions)

- **`docs/DESIGN_REFONTE.md`** — décisions de design (tokens, typo, primitives, deltas par module). **À lire en premier.**
- **`maquettes/handoff/projet-etp-interactif/project/ETP Tabac.dc.html`** — **LE handoff Claude Design** :
  source lisible avec **toute la logique** de chaque composant (état + fonctions dans `<script data-dc-script>`)
  + styles inline exacts. **Autorité primaire.**
- **`maquettes/handoff/dc-script.extracted.js`** — le script de logique extrait seul (courbes, tension, craving, dial, données).
- **`maquettes/reference/fonts/`** — 4 woff2 à intégrer (S1) — le handoff charge les polices en CDN, interdit hors-ligne.
- *(secondaire)* `maquettes/reference/snapshot.html` — rendu aplati décodé du bundle standalone ; le `.dc.html` prime.

> ℹ️ Le handoff (source complète, avec logique) a été fourni par Thibault et extrait dans `maquettes/handoff/`.
> `support.js` = runtime du design-tool, à ignorer. Ne pas rendre ces fichiers au navigateur (tout est dans le source).

## Sessions

| Session | Tâches | Titre | Modèle | Effort | Dépend de | Zone modifiée | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [S1](S1.md) | T1-T3 | Socle : fonts + tokens `oklch` + primitives globales | Sonnet | high | — | `public/fonts/`, `src/styles/`, `index.html` | [x] |
| [S10](S10.md) | T-S10 | **Réécrire la logique des courbes** (lib + tests) — modèle 0–100 / 24 h (handoff) | Sonnet | high | — | `src/lib/nicotineCurve.ts`(+test) | [ ] |
| [S2](S2.md) | T4 | Chrome : accueil + coquille + carte + Sources | Sonnet | medium | S1 | `src/components/` | [ ] |
| [S3](S3.md) | T5 | Restyle — Addiction | Sonnet | medium | S1 | `src/features/addiction/` | [ ] |
| [S4](S4.md) | T6 | **Ré-implémenter** — Nicotine (24 h, 3 outils, dose) | Sonnet | high | S1 + **S10** | `src/features/nicotine/` | [ ] |
| [S5](S5.md) | T7 | Restyle — Substituts (+ encart technique de prise) | Sonnet | medium | S1 | `src/features/substituts/` | [ ] |
| [S6](S6.md) | T8 | Restyle — Nicotine ≠ toxique | Sonnet | medium | S1 | `src/features/nicotine-toxique/` | [ ] |
| [S7](S7.md) | T9 | **Ré-implémenter** — Soulagement (tension découplée) | Sonnet | high | S1 + **S10** | `src/features/soulagement/` | [ ] |
| [S8](S8.md) | T10 | Restyle — Craving | Sonnet | medium | S1 | `src/features/craving/` | [ ] |
| [S9](S9.md) | T11 | Motivation — restyle + cadran circulaire + flux 2 questions | Sonnet | high | S1 | `src/features/motivation/` | [ ] |
| — | T12 | Consolidation : contexte + audit Codex | Haiku / Codex | low | S2-S9 | `STATUS`/`TASKS`/`VALIDATION`/`PROJECT_MAP`/`DECISIONS` | [ ] |

## Ordonnancement

- **Vague 1 — bloquante, 2 agents parallèles** : **S1** (fige tokens/fonts/primitives) **et S10** (réécrit la
  logique des courbes + tests, modèle 0–100 / 24 h transcrit du handoff). Zones disjointes (`src/styles/` vs
  `src/lib/`) → parallélisables. Après cette vague, plus personne ne touche `src/styles/` ni `src/lib/nicotineCurve.ts`.
- **Vague 2 — parallélisable (8 agents)** : **S2 · S3 · S4 · S5 · S6 · S7 · S8 · S9**. Zones disjointes
  (`src/components/` vs `src/features/<slug>/`). S4 et S7 dépendent **en plus de S10** (elles consomment la lib
  mise à jour, sans la modifier). En vague parallèle : `git add` ciblé, pas de push, statut consigné
  dans le `S<k>.md` (cf. WORKFLOW §4d).
- **Vague 3 — consolidation (T12)** : mettre à jour `STATUS.md`, `TASKS.md`, `VALIDATION.md`, `PROJECT_MAP.md`,
  `DECISIONS.md` (§palette oklch, §fonts auto-hébergées, §primitives, §motivation) ; **audit visuel Codex**
  (Playwright, comparaison à la maquette, cf. `AGENTS.md`) ; push. Faite en solo (humain ou Haiku).

## Contrôle de parallélisme (zones disjointes vérifiées)

- S1 = seul écrivain de `src/styles/**`, `public/fonts/**`, `index.html`.
- S10 = **seul écrivain de `src/lib/nicotineCurve.ts`(+test)** — aucune autre session ne touche la lib de courbes.
- S2 = seul écrivain de `src/components/**`. S3–S9 = chacun seul écrivain de son `src/features/<slug>/**`.
- Personne d'autre que S1 ne modifie `tokens.css`/`global.css` : si un module « a besoin » d'un token
  manquant → **STOP** et signaler (ne pas éditer les styles globaux en vague 2).

## Garde-fous transverses (valent pour toutes les sessions)

- **Ne pas toucher** : `src/lib/nicotineCurve.ts`(+test), `registry.ts`, `types.ts`, `App.tsx`, la navigation.
- **Aucune dépendance** ajoutée (runtime ou dev). Pas de lib de graphe, pas de router, pas de lib d'animation.
- **Zéro persistance** : aucun `localStorage`/cookie/réseau, même pour la refonte Motivation.
- **Couleur jamais seule** : ne pas retirer les libellés/icônes/formes de double encodage existants.
- Auto-validation (gate commit) : `node_modules/.bin/tsc -b` + `vite build` (npm parfois absent du PATH —
  `node.exe` est sous `/c/Program Files/nodejs/`, cf. `STATUS.md`). Visuel → `VALIDATION.md` (jamais de navigateur côté Claude).
