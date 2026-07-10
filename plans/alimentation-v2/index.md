# Plan alimentation-v2 — Déroulé pédagogique, lisibilité du défi ② et 2ᵉ niveau de lecture   (rédigé par Fable)

## Objectif d'ensemble

Améliorer le **module 2 — Alimentation** du thème diabète sur trois axes, validés par Thibault le
2026-07-09 :

- **A — Déroulé pédagogique** : consigne remontée en haut de la scène, progression douce (coche par
  défi « joué » + bouton « Défi suivant → »), courbe fantôme « féculents seuls » au défi ①,
  duels suggérés au défi ②.
- **B — Lisibilité des réponses du défi ② (Qualité / comparaison)** : identité visuelle par carte
  (couleur A / couleur B à poids égal), étiquettes directes + marqueur de pic sur les courbes,
  badges de verdict francs (Bas/Moyen/Haut + ✓/✗), tracé animé au « révèle ».
- **C — 2ᵉ niveau de lecture** : données qualitatives d'affichage (portion, sel, qualité des
  graisses, oméga-3 ; fibres/protéines dérivées des grammes existants), câblage du composant
  générique `InfoHover` (survol **+ clic verrouillant**, décision Thibault) sur le garde-manger et
  les cartes du défi ②, mention « vaisseaux » (pont fil rouge → module Risque cardio).
  **+ C4** : 3 aliments porteurs d'oméga-3 ajoutés au garde-manger (sardine, saumon, noix).

## Autorités

- `docs/diabete/SPEC_outil_ETP_diabete.md` §6 — autorité pédagogique du module. **Deux écarts
  assumés** (décisions Thibault 2026-07-09, à consigner dans `DECISIONS.md` en S4) :
  la consigne passe **en haut** de la scène (la maquette la mettait en bas), et le verdict du
  « devine → révèle » devient un badge visuel fort (la maquette : ligne de texte).
- **Invariants inchangés** : le mg/dL reste au survol uniquement (SPEC §6.3) ; « pas une base de
  données nutritionnelle » → les nouvelles infos sont des **paliers qualitatifs**, jamais des
  grammes affichés (décision Thibault : option « paliers » retenue contre « chiffres par portion »).
- `CLAUDE.md` : zéro persistance, hors-ligne, aucune dépendance ajoutée, lisibilité ~1 m,
  cibles ≥ 44 px, **couleur jamais seule** (double encodage), exactitude médicale
  (signaler plutôt qu'inventer, constantes `// à revalider (Thibault)`).

## Décisions transverses

1. **`CourbeGlycemie` est consommé par 6 modules** (alimentation, activite, suivi, traitements,
   hypoglycemie, insuline + `insuline/scenarios.ts`). Toutes ses évolutions (S2) sont des **props
   optionnelles à comportement par défaut strictement identique** : aucun autre module ne change,
   ni visuellement ni en TypeScript.
2. **Couleurs d'identité du duo (défi ②)** : `duoA` = `var(--color-nav)` (bleu), `duoB` = une
   **prune définie localement** dans `CourbeGlycemie.module.css` (ex. `oklch(50% 0.11 330)`) —
   on ne touche pas `src/styles/tokens.css`, et on n'utilise **pas** confort/vigilance/toxique
   comme identité (réservées à la sémantique santé). Le désambiguïsement ne repose jamais sur la
   couleur seule : chaque courbe porte son **étiquette nominative** (double encodage).
3. **`InfoHover` reste générique** (moteur, `src/components/`) : l'évolution survol+clic est
   agnostique du thème ; tout le contenu du panneau (paliers, phrases) vit côté module alimentation.
4. **La courbe ne change pas** : les nouveaux champs de `data.ts` sont d'affichage uniquement ;
   `glycemieCurve.ts` et ses tests ne sont pas touchés. Les 3 nouveaux aliments ont une CG ~nulle
   → les seuils `PEAK_BAS_MAX`/`PEAK_HAUT_MIN` du défi ② restent valides (pas de recalibrage).

## Sessions

| Session | Titre | Modèle | Effort | Dépend de | Zone modifiée (seul écrivain) | Statut |
| --- | --- | --- | --- | --- | --- | --- |
| [S1](S1.md) | Données : champs qualitatifs + paliers dérivés + 3 aliments oméga-3 | Sonnet | medium | — | `src/features/diabete/alimentation/data.ts` | [x] |
| [S2](S2.md) | Composants partagés : `InfoHover` survol+clic · extensions optionnelles `CourbeGlycemie` | Sonnet | high | — | `src/components/InfoHover.*`, `src/features/diabete/components/CourbeGlycemie.*` | [x] |
| [S3](S3.md) | Module Alimentation : déroulé (A1-A4) + lisibilité défi ② (B1-B4) + câblage 2ᵉ niveau (C2-C3) | Sonnet | high | S1 + S2 | `src/features/diabete/alimentation/AlimentationModule.tsx` + `.module.css` | [x] |
| [S4](S4.md) | Consolidation : statuts, DECISIONS, VALIDATION, PROJECT_MAP, commits + push | Haiku | low | S3 | fichiers de contexte racine + `docs/` | [ ] |

## Ordonnancement

- **Vague 1 — 2 agents parallèles** : S1 ∥ S2 (zones strictement disjointes : `data.ts` vs
  composants). Règles vague parallèle (WORKFLOW §4d) : aucun commit, aucun fichier partagé —
  chacun consigne son statut dans son `S<k>.md`.
- **Vague 2 — solo** : S3 (seul écrivain du dossier `alimentation/` hors `data.ts`, qu'il lit
  sans le modifier).
- **Vague 3 — solo** : S4 (commits par session, messages prévus dans chaque `S<k>.md`, un seul push).

## Garde-fous transverses

- **Ne pas toucher** : `src/features/diabete/lib/**`, `src/features/tabac/**`, `src/styles/**`,
  `src/features/types.ts`, les deux `registry.ts`, `App.tsx`, les autres modules diabète,
  `FicheOverlay`/`ModuleFooterNav`/`ModuleShell`/`Sources`. Aucune dépendance ajoutée
  (l'animation du tracé = CSS pur, `pathLength` + `stroke-dashoffset`).
- **Zéro persistance** : l'état de progression (défis « joués ») est un `useState` éphémère,
  perdu à la sortie du module — c'est voulu.
- **Navigation jamais forcée** : les 5 onglets restent librement cliquables ; coche et
  « Défi suivant → » sont des invitations, pas des verrous.
- **Contenu médical** : les paliers qualitatifs (sel, graisses, oméga-3, phrases-clés) sont des
  ordres de grandeur (tables Ciqual/GI-GL, repères SFD) marqués `// à revalider (Thibault)` et
  **récapitulés dans `VALIDATION.md`** (S4) pour relecture.
- Gates de fin de session : `npx tsc --noEmit` + `npm run build` verts (+ `npm test` : la suite
  existante doit rester verte — aucune session ne modifie de fichier testé). npm parfois absent du
  PATH : `node.exe` sous `/c/Program Files/nodejs/` (cf. STATUS.md). **Visuel → consigné dans
  VALIDATION.md, jamais de navigateur côté Claude.**

## Points ouverts signalés à Thibault (n'empêchent pas d'exécuter)

1. Valeurs qualitatives sel/graisses/oméga-3 des ~27 aliments : à revalider après S1 (liste dans
   `VALIDATION.md`).
2. La bande « moyen » du défi ② est étroite (pics 47→50) : inchangée ici ; à recalibrer plus tard
   si les duels suggérés révèlent des verdicts contre-intuitifs.
3. Illustrations des 3 nouveaux aliments : placeholders `IllustrationSlot` en attendant les PNG
   (`public/illustrations/diabete/aliment-<id>.png`).
