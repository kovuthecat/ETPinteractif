# Plan insuline-affinements-2026-07 — Combler l'écart des modules Insuline basale (9) & rapide (10)   (rédigé par Opus)

## Objectif d'ensemble

Revue prod des deux modules insuline (Thibault + Opus, 2026-07-21) : modules **solides et déjà
proches de l'idéal**, courbes justes et actionnables. Restent quelques vrais trous et un peu de
polish. Ce plan traite les 6 items retenus par Thibault :

| Item | Nature | Description | Session |
| --- | --- | --- | --- |
| **1** | contenu | Basale : dimension **régularité / horaire** manquante (même heure, souplesse) | S4 |
| **2** | contenu | Rapide : scénario **« rapide sans repas / repas sauté »** (cause d'hypo n°1, absente) | S5 |
| **3** | contenu | Basale : **micro-intro « à quoi sert la lente »** avant le jeu de titration | S4 |
| **5** | technique | Rapide : **creux sous la baseline** post-repas (courbe « avec rapide ») — retouche modèle | S3 |
| **6** | technique | Rapide : slider timing — **étiquettes ≠ seuils** du message/marqueur | S2 |
| **8** | contenu | **Cohérence inter-modules** : phrase reliant la journée (basale) et le repas (rapide) | S4 + S5 |

Traçabilité : ids `IA<n>` (Insuline-Affinements). Source du besoin : revue prod Thibault 2026-07-21.

## Périmètre & hypothèses

- **Bundle consultation uniquement.** Le thème diabète n'existe pas côté app patient (aucun fichier
  diabète sous `src/patient/`) — invariant #1 (consultation : zéro persistance) s'applique, rien à
  câbler côté patient. `// à confirmer (Thibault)` si un jour le diabète passe côté patient.
- **Aucun chiffre médical à l'écran** (invariant transverse des modules 9/10) : délais, fenêtres,
  durées restent des **paliers qualitatifs**. Les valeurs sourcées ne servent qu'au calibrage.
- **Aucune dépendance runtime ajoutée** (invariant #3). Modifs = contenu (`docs/diabete/`),
  composants (`features/diabete/`), lib pédagogique (`glycemieCurve.ts`) + ses tests.

## Décisions structurantes (à consigner dans `DECISIONS.md` à la consolidation)

- **Contenu neuf sourcé AVANT code (invariant #5, précédent module 10).** Les items 1/2/3/8 ajoutent
  du contenu clinique : il est d'abord rédigé et sourcé dans `docs/diabete/`, puis **validé par
  Thibault (soignant) — gate G1** — avant toute implémentation. Source primaire : réponses
  OpenEvidence fournies par Thibault (prompt : `PROMPT-OPENEVIDENCE.md`).
- **Item 1 — message générique, sans molécule (gate tranchée 2026-07-21).** La souplesse d'horaire
  est enseignée sans sélecteur de molécule ni promesse de flexibilité (dangereuse pour la glargine
  U100). Cohérent avec le module 9 actuel, qui a justement retiré le sélecteur de profil (bande
  fixe, S3 revue-chrome-2026-07). Un renvoi « ça dépend de ton insuline → soignant » remplace la
  différenciation.
- **Item 6 — slider continu + libellé dynamique (gate tranchée 2026-07-21).** On conserve le slider
  continu (préserve le geste « course » et la grammaire partagée avec le module 3 Activité ③), mais
  on fait de la **valeur du slider la source de vérité unique** : un seul libellé dynamique sous le
  curseur, dérivé des mêmes seuils que le message et le marqueur d'injection. Fin des 4 étiquettes
  fixes équiréparties qui ne correspondaient pas aux seuils.
- **Item 5 — retouche du modèle `glycemieCurve.ts` (gate tranchée 2026-07-21).** Le creux vient de
  ce que le bolus (injecté à −15, latence 15) agit dès t=0 alors que le repas ne monte qu'à t=12.
  On corrige dans la lib partagée (alignement action bolus / montée repas), **avec mise à jour des
  invariants testés** (`glycemieCurve.test.ts`) et re-vérification des modules consommateurs (2/3/8/9).
- **Item 8 — pont porté par chaque module (pas de session dédiée).** La phrase de liaison est ajoutée
  côté basale (S4) et côté rapide (S5), formulée en S1 pour être cohérente des deux bords (basale =
  journée entière « coucher → coucher » ; rapide = zoom sur un repas −1 h/+3 h).

## Sessions

| Session | Tâches | Titre | Modèle | Effort | Dépend de | Zone modifiée | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [S1](S1.md) | IA1, IA2 | Contenu & sources : docs basale + section « rapide sans repas » (gate G1) | Opus | high | prompt OE renvoyé | `docs/diabete/09-insuline-basale.md` (créé), `docs/diabete/10-insuline-rapide.md` | [x] fait + G1 validée 2026-07-21 |
| [S2](S2.md) | IA3 | Item 6 — slider timing : libellé dynamique, source de vérité unique | Sonnet | high | — | `features/diabete/insuline-rapide/InsulineRapideModule.tsx` (+ `.module.css`) | [x] fait 2026-07-21 (gates OK) |
| [S3](S3.md) | IA4 | Item 5 — creux sous baseline : retouche modèle bolus + invariants | Sonnet | high | — | `features/diabete/lib/glycemieCurve.ts`, `glycemieCurve.test.ts` | [x] fait 2026-07-21 (gates OK) |
| [S4](S4.md) | IA5 | Basale — intro « à quoi sert la lente » (3) + régularité/horaire (1) + pont (8a) | Sonnet | high | S1/G1 | `features/diabete/insuline/InsulineModule.tsx` (+ `.module.css`), `scenarios.ts` | [x] fait 2026-07-21 (gates OK) |
| [S5](S5.md) | IA6 | Rapide — scénario « rapide sans repas » (2) + pont (8b) | Sonnet | high | S1/G1, S3 | `features/diabete/insuline-rapide/InsulineRapideModule.tsx` (+ `.module.css`) | [x] fait 2026-07-21 (gates OK) |
| [S6](S6.md) | — | Consolidation (commits, statuts, contexte, push) | Haiku | minimal | toutes | `STATUS/TASKS/VALIDATION/DECISIONS/PROJECT_MAP/index` | [x] fait 2026-07-21 |

## Ordonnancement

- **Vague 0 — contenu (gate, solo)** : **S1**. Bloquée tant que Thibault n'a pas renvoyé les réponses
  OpenEvidence ; se termine sur la validation clinique **G1**. Débloque S4 et S5.
- **Vague 1 — technique, parallélisable, indépendante du contenu** : **S2 · S3**. Zones disjointes
  (S2 = module rapide/TSX+CSS ; S3 = lib + tests). Peuvent démarrer **immédiatement**, sans attendre
  G1. Note : S2 lit la lib en lecture seule ; si S3 change la forme du bolus, revalider visuellement
  le timing en S2 à la consolidation.
- **Vague 2 — contenu implémenté (après G1)** : **S4 · S5** (disjointes : basale vs rapide). S5
  s'appuie sur la lib corrigée (après S3). Chacune ajoute le pont inter-modules de son côté (item 8).
- **Vague 3 — consolidation** : **S6** (§4d WORKFLOW : commits tâche par tâche, staging explicite,
  statuts `index.md`/`TASKS.md`, `STATUS.md`/`VALIDATION.md`, entrées `DECISIONS.md`, un seul push).

## Gates / décisions à valider (Thibault)

- **G1 — validation clinique du contenu neuf (items 1/2/3/8). ✅ TRANCHÉ (2026-07-21).** Thibault a
  relu et validé `09-insuline-basale.md` + la section « rapide sans repas » du `10` (rédigés en S1
  depuis ses réponses OpenEvidence) : rôle de la lente OK, sûreté du message d'horaire (glargine U100)
  OK, les 3 messages du scénario ⑤ OK (option post-prandiale = exception). **S4 et S5 débloquées.**
- **G2 — item 1 : message générique sans molécule. ✅ TRANCHÉ (2026-07-21).** Pas de sélecteur ;
  message unique + renvoi soignant. Reste à caler le **libellé exact** en S1/S4 (`// à revalider`).
- **G3 — item 6 : slider continu + libellé dynamique. ✅ TRANCHÉ (2026-07-21).**
- **G4 — item 5 : retouche `glycemieCurve.ts`. ✅ TRANCHÉ (2026-07-21).** Critère d'acceptation à
  figer en S3 : la courbe « avec rapide » du **cas adéquat** (repas moyen / dose habituelle, injectée
  juste avant) ne descend **pas sous la baseline** avant la montée du repas, sans casser les
  invariants des autres modules. `// à revalider (Thibault)` sur le seuil de tolérance exact.
- **G5 — item 2 : profondeur du scénario « sans repas ». ✅ TRANCHÉ (2026-07-21).** **5ᵉ onglet
  distinct** (`⑤ Et si je ne mange pas ?`), pas une variante du ④. Courbe = repas charge 0 + bolus →
  plonge sous la cible ; renvoi module 8. **Reste à caler : le positionnement de l'onglet** dans la
  barre (après le ④, ou ailleurs) — l'implémenteur propose, validation visuelle Thibault. `// à revalider`.

> Les gates techniques (G2-G4) ne bloquent pas les Vagues 1-2 : chaque session code un défaut sobre
> et marque les points `// à revalider (Thibault)`. Seule **G1** est un verrou dur (Vague 2). La
> consolidation (S6) fige les réponses dans `DECISIONS.md`.

## Clôture (S6, 2026-07-21)

**Chantier clos.** S1-S5 exécutées (S1 solo puis vagues S2‖S3 → S4‖S5), gates auto au vert sur
l'arbre consolidé (`tsc --noEmit` · `npm run build` 2 entrées · `npm test` 106/106). Détail par
session dans chaque `S<n>.md` (bilans de fin de session). Points laissés `// à revalider (Thibault)` :
bornes du slider timing (S2/IA3), critère de tolérance visuelle du garde-fou bolus (S3/IA4, aucun
seuil calibré — garantie algébrique), micro-copie intro/régularité/pont basale (S4/IA5), positionnement
du 5ᵉ onglet + note post-prandiale + micro-copie pont rapide (S5/IA6). **Les deux phrases-pont (8a/8b)
sont conceptuellement cohérentes mais pas formulées à l'identique** (cf. bilans S4/S5) — à arbitrer par
Thibault (garder chaque ton propre ou harmoniser mot pour mot), cf. `DECISIONS.md`.

**Commits** : `InsulineRapideModule.tsx`/`.module.css` sont modifiés à la fois par S2 (IA3) et S5
(IA6) — les deux vagues se sont enchaînées sans commit intermédiaire entre S2 et S5 (mode vague
parallèle, commits différés à S6), et `git add -p` n'est pas utilisable en environnement non
interactif. Les deux tâches ont donc été committées **ensemble** sur ces deux fichiers (un seul
commit couvrant IA3+IA6), au lieu d'un commit strictement par tâche — cf. `DECISIONS.md`. Toutes les
autres tâches (docs S1, S3, S4) ont un commit dédié.

Validation visuelle humaine (Thibault, `npm run dev`) entièrement à faire — cf. `VALIDATION.md`.
