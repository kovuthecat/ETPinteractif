# Plan approfondissement-tabac — Courbes réalistes + 2 nouveaux modules + illustrations   (rédigé par Fable)

## Objectif d'ensemble

Trois chantiers sur le thème tabac, demandés par Thibault le 2026-07-09 :

1. **Courbes plus réalistes** : refondre le modèle de `nicotineCurve.ts` pour qu'il colle aux ordres
   de grandeur pharmacologiques réels (demi-vie ≈ 2 h, accumulation en journée, clairance nocturne,
   montée lente du patch, saturation/tolérance) **tout en servant le propos pédagogique** (les 3
   zones MANQUE / CONFORT / SURDOSAGE et leurs messages restent le cœur). Même démarche que
   `glycemieCurve.ts` côté diabète : chaque affirmation pédagogique devient un invariant testé.
2. **Module « Ce que l'arrêt répare »** (bénéfices de l'arrêt) : réutilise la **silhouette du thème
   diabète**, promue en composant générique, avec une frise de jalons (20 min → 10-15 ans) qui
   « rallume » le corps organe par organe. Famille Se motiver.
3. **Module « Vrai ou faux ? »** (idées reçues) : cartes d'affirmations sur le tabac et le sevrage,
   révélation nuancée et sourcée. **Ton informatif, jamais culpabilisant ni infantilisant.**
   Famille Comprendre.

Chaque nouveau module prévoit ses **illustrations à générer**, dont les prompts sont ajoutés à
`design/illustrations/prompts-illustrations-diabete.html` (S4).

## Autorités

- `docs/contenu-modules-tabac.md` — autorité du contenu médical tabac (sera étendue en S7 avec les
  2 nouveaux modules).
- `docs/BRIEF_TABAC.md` §1 — grammaire design/pédagogie du thème (ton, sobriété, 2ᵉ niveau de lecture).
- **Le contenu médical des nouveaux modules est fourni verbatim dans `S5.md` et `S6.md`** (jalons,
  affirmations, explications, sources). Ne pas inventer au-delà ; tout point marqué
  `// à revalider (Thibault)` reste isolé dans une constante commentée.

## Décision courbes (S3, transverse aux modules Nicotine & Soulagement)

Le modèle actuel (réécrit à la refonte-ui) est pédagogiquement juste mais pharmacologiquement
approximatif : demi-vie cigarette 1,2 h (réel ≈ 2 h), patch en rampe linéaire de 30 min puis plateau
infini (réel : montée en 2-4 h), tension du manque déconnectée du niveau de nicotine. S3 refond le
modèle en conservant **l'API gelée à l'identique** (mêmes exports, mêmes signatures — les modules
Nicotine et Soulagement ne changent pas, ou à la marge) :

- **une élimination commune** (même molécule ⇒ même demi-vie ≈ 2 h, quelle que soit la forme) ;
- des **profils d'absorption par source** (cigarette : pic < 10 min ; forme orale : pic ≈ 30 min ;
  patch : montée exponentielle, plateau vers 3-4 h) ;
- une **saturation de type Emax** qui traduit la tolérance (l'enchaînement rapproché plafonne vers
  le surdosage au lieu d'exploser) ;
- une **tension du manque dérivée du niveau de nicotine** (le manque suit la chute de la
  nicotinémie — cohérence Nicotine ↔ Soulagement, réalisme accru).

⚠️ Reste un **modèle pédagogique, pas un simulateur** : échelle 0-100 sans unité, mention
« schéma illustratif » conservée. Les amplitudes exactes sont libres, les **invariants testés** (S3)
sont l'autorité.

## Décision silhouette (S2)

La silhouette diabète (`src/features/diabete/components/Silhouette.tsx`) est un corps SVG générique +
des zones cliquables : rien de spécifique au diabète sauf la liste des zones. S2 la **promeut en
composant générique** `src/components/SilhouetteCorps.tsx` (zones passées en données : id, libellé,
ancre, état) — conforme à l'invariant multi-thèmes (le moteur ne connaît aucun thème). La silhouette
diabète devient un **wrapper fin à API strictement inchangée** (les 9 modules diabète ne bougent pas).
Le module « Ce que l'arrêt répare » (S5) consomme le composant générique avec ses propres zones.

## Sessions

| Session | Tâche | Titre | Modèle | Effort | Dépend de | Zone modifiée | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [S1](S1.md) | AP1 | Socle : registre +2 modules, stubs, `IllustrationSlot` tabac | Sonnet | low | — | `src/features/tabac/registry.ts`, stubs `benefices-arret/` + `idees-recues/`, `src/features/tabac/components/` | [x] |
| [S2](S2.md) | AP2 | Silhouette générique `SilhouetteCorps` + wrapper diabète | Sonnet | medium | — | `src/components/SilhouetteCorps.*`, `src/features/diabete/components/Silhouette.*` | [x] |
| [S3](S3.md) | AP3 | **Refonte réaliste `nicotineCurve.ts`** + tests d'invariants | Sonnet | high | — | `src/features/tabac/lib/` | [x] |
| [S4](S4.md) | AP4 | Prompts d'illustrations des 2 nouveaux modules dans le HTML | Sonnet | low | — | `design/illustrations/prompts-illustrations-diabete.html` | [x] |
| [S5](S5.md) | AP5 | Module « Ce que l'arrêt répare » (silhouette + frise de jalons) | Sonnet | high | S1+S2 | `src/features/tabac/benefices-arret/` | [x] |
| [S6](S6.md) | AP6 | Module « Vrai ou faux ? » (idées reçues, cartes) | Sonnet | high | S1 | `src/features/tabac/idees-recues/` | [x] |
| [S7](S7.md) | AP7 | Consolidation : docs, contexte, commits, push | Haiku | low | S1-S6 | `docs/contenu-modules-tabac.md`, `STATUS`/`TASKS`/`VALIDATION`/`PROJECT_MAP`/`DECISIONS`, `index.md` | [x] |

## Ordonnancement

- **Vague 1 — 4 agents parallèles** : S1 · S2 · S3 · S4. Zones strictement disjointes :
  S1 = registre tabac + stubs + `features/tabac/components/` ; S2 = `src/components/SilhouetteCorps.*`
  et `features/diabete/components/Silhouette.*` (personne d'autre n'y touche) ; S3 = `features/tabac/lib/`
  (les modules nicotine/soulagement ne sont modifiés par personne d'autre) ; S4 = le HTML des prompts
  uniquement.
- **Vague 2 — 2 agents parallèles** : S5 · S6, chacun seul écrivain de son dossier
  `src/features/tabac/<slug>/` (stub posé par S1 inclus).
- **Vague 3 — consolidation (S7, solo)** : commits atomiques par tâche, resync contexte, un seul push.
- Règles vague parallèle (WORKFLOW §4d) : aucun commit/push en vagues 1-2, aucun fichier partagé
  (`STATUS.md`, `TASKS.md`, `index.md`, `VALIDATION.md`) — statut et checklist consignés dans son `S<k>.md`.

## Contrôle de parallélisme (zones disjointes vérifiées)

- S1 = **seul écrivain** de `src/features/tabac/registry.ts`, des 2 stubs et de
  `src/features/tabac/components/**`.
- S2 = seul écrivain de `src/components/SilhouetteCorps.*` et `src/features/diabete/components/Silhouette.*`.
- S3 = seul écrivain de `src/features/tabac/lib/**` (+ retouches éventuelles limitées à
  `nicotine/NicotineModule.tsx` et `soulagement/SoulagementModule.tsx`, qu'aucune autre session ne touche).
- S4 = seul écrivain de `design/illustrations/prompts-illustrations-diabete.html`.
- S5 / S6 = chacun seul écrivain de son `src/features/tabac/<slug>/**`.
- Un token/primitive CSS global manque ? **STOP et signaler** — personne ne modifie `src/styles/**`.

## Garde-fous transverses (valent pour toutes les sessions)

- **Ne pas toucher** (hors périmètres listés ci-dessus) : `src/components/**` (sauf S2 :
  `SilhouetteCorps.*` uniquement), `src/features/types.ts`, `src/features/registry.ts`,
  `src/features/diabete/**` (sauf S2 : `components/Silhouette.*` uniquement), `src/styles/**`,
  `App.tsx`, `index.html`.
- **Aucune dépendance ajoutée** (runtime ou dev).
- **Invariants CLAUDE.md** : zéro persistance, hors-ligne, lisibilité ~1 m, cibles ≥ 44 px, couleur
  jamais seule (double encodage forme/picto/libellé).
- **Ton** : jamais culpabilisant, jamais infantilisant, pas de score/note, pas de smiley. Les
  formulations des S5/S6 sont **verbatim** ; en cas de doute clinique, signaler plutôt qu'inventer.
- **Illustrations** : les modules utilisent `IllustrationSlot` (tabac, S1) — placeholder sobre,
  auto-remplacé quand `public/illustrations/tabac/<id>.png` existera. Ne jamais bloquer sur une
  image manquante. Les ids canoniques sont définis dans `S4.md`.
- Auto-validation (gate de fin de session) : `npx tsc --noEmit` + `npm run build` verts
  (+ `npm test` pour S2/S3). npm parfois absent du PATH : `node.exe` sous `/c/Program Files/nodejs/`
  (cf. STATUS.md). Visuel → consigné dans le `S<k>.md`, jamais de navigateur côté Claude.

## Points ouverts signalés à Thibault (n'empêchent pas d'exécuter)

1. **Chiffres des jalons de l'arrêt** (S5) : formulations calées sur Tabac Info Service / OMS,
   à revalider avant usage en consultation (constantes `// à revalider (Thibault)`).
2. **Cartes vrai/faux sensibles** (S6) : vapoteuse (n° 14) et « réduire protège déjà » (n° 15)
   **actives** (décision Thibault 2026-07-10) — contenu marqué `// à revalider (Thibault)`,
   jugement après usage.
3. **Mention du graphe nicotine** : S3 propose une mention actualisée (« ordres de grandeur réels,
   pas un dosage ») — l'ancienne reste par défaut si non validée.
4. Une fois les images générées : déposer les PNG dans `public/illustrations/tabac/` avec les ids
   de `S4.md` (piège C2PA/Inkscape : ré-encoder via Pillow, cf. mode d'emploi du HTML).
