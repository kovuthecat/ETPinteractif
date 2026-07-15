# Plan revue-chrome-2026-07 — Vague de corrections (revue Chrome Thibault)   (rédigé par Opus)

## Objectif d'ensemble

Traiter la vague de corrections issue de la revue navigateur (rapports « Vague de correction
module tabac / diabète / app patient » + captures). Trois périmètres — **tabac** (consultation +
livret imprimable), **diabète** (consultation), **app patient mobile** — plus deux évolutions de
cadrage de l'app patient (persistance locale + interactivité). Priorité : d'abord les correctifs
sûrs et parallélisables, puis les refactos, puis les chaînes dépendantes (titration, livret), enfin
les features gated (assets, respiration, carnet).

Traçabilité : les ids de tâches reprennent les codes des rapports source (C1, A2, D5, E4…) pour
coller aux réponses point-par-point de Thibault (séance du 2026-07-15).

## Décisions structurantes (à consigner dans `DECISIONS.md` à la consolidation)

- **A5 partout.** `@page` global `A4 portrait → A5` (`src/styles/global.css`). Assumé pour livret,
  carte-réflexe hypo et fiche méthode (une seule règle `@page` dans le dépôt).
- **localStorage autorisé dans l'app patient uniquement.** Outil personnel du patient sur son mobile
  (titration, carnet). Le socle **consultation reste zéro-persistance** (invariant #1 de `CLAUDE.md`
  maintenu côté consultation). Évolution assumée du cadrage aide-patient v1 « lecture seule / zéro
  persistance ».
- **Dose de titration côté consultation = `SelectionContext`, mémoire de session.** Mémorisée comme
  le reste des données extraites pour le livret, le temps de la session ; pas de persistance durable.
- **Outil de titration extrait en composant partagé paramétré par les données.** Réutilisé par la
  consultation (state → `SelectionContext`) et par le patient (state → localStorage), variante
  patient allégée (sans picker de forme orale ni bouton « Imprimer ma méthode »). Jour/nuit conservé.
- **Le patch occupe une page dédiée dans le livret**, avec sa dose choisie (quarts jour/nuit).
- **Situations du livret regroupées par composante de l'addiction** = les 3 piliers du module
  Addiction (`physique / psychologique / comportementale`). Le champ `pilier` existe déjà dans
  `src/content/tabac/situations.ts` — simple *group-by*, aucune nouvelle taxonomie.
- **Bande-cible basale alignée sur la rapide** : `{ basse: 25, haute: 60 }` → bandes 80/70/50 (et non
  110/46/44). Repères verticaux basale : « Coucher » / « Réveil ».
- **Priorisation des outils par pilier de la situation** (Stress ne renvoie plus les 4D en tête).
- **Reformulation** « Ce que la cigarette apporte » → **« Émotions propices au tabac »** (à revalider).
- **Illustrations substituts patient** : séparer visuel produit (vignette grille) et schéma
  d'utilisation (détail). Nouveaux assets produit générés par Thibault (prompts fournis en S14).
- **Camembert « Proportion » : réglage au drag, modèle en % continu.** Les proportions passent de
  compteurs entiers à des pourcentages continus (source de vérité), pilotés par le drag des frontières
  entre secteurs ; les compteurs d'aliments de la **courbe glycémie** sont dérivés par arrondi au plus
  fort reste sur un total fixe (préserve la simulation). Suppression des boutons ± / encadré latéral,
  icônes Lucide + % par secteur. Desktop/souris uniquement, pas de clavier (assumé).

## Sessions

| Session | Tâches | Titre | Modèle | Effort | Dépend de | Zone modifiée | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [S1](S1.md) | C1, C3, C4 | Diabète : donut→camembert, ordonnance vide, bulle cardio | Sonnet | medium | — | `diabete/alimentation`, `diabete/traitements`, `diabete/risque-cardio` | [ ] |
| [S2](S2.md) | A1, A2, A3, A4 | « Ce que l'arrêt répare » : halos, illus, frise, doublon | Sonnet | medium | — | `tabac/benefices-arret` | [ ] |
| [S3](S3.md) | C5 | Insuline basale : retrait profil + harmonisation courbe | Sonnet | high | — | `diabete/insuline` | [ ] |
| [S4](S4.md) | C6 | Carte-réflexe hypo : illustrations signes + resucrage | Sonnet | medium | — | `diabete/hypoglycemie` | [ ] |
| [S5](S5.md) | B1 | Substituts desktop : 2 colonnes (anti-scroll) | Sonnet | medium | — | `tabac/substituts` (layout) | [ ] |
| [S6](S6.md) | E2, E5 | Patient : schéma agrandi + label reformulé | Sonnet | low | — | `patient/substituts` (css), `patient/situations` (string) | [ ] |
| [S7](S7.md) | E4 | Outils : pertinence par pilier (Stress ≠ 4D en tête) | Sonnet | high | — | `content/tabac/outils.ts` (+ tri) | [ ] |
| [S8](S8.md) | E3a | Titration : extraction composant partagé paramétré | Sonnet | high | S5 | `components/TitrationPatch`, `tabac/substituts` | [ ] |
| [S9](S9.md) | D1, D2 | Livret : format A5 + N&B + pagination | Sonnet | medium | — | `styles/global.css`, `PrintableLivret.module.css` | [ ] |
| [S10](S10.md) | D3, D6, D4 | Livret : ordre + « 4D » + situations par composante | Sonnet | high | — | `plan-arret/livretSections.tsx` | [ ] |
| [S11](S11.md) | E3b | Titration → `SelectionContext` (consultation) | Sonnet | medium | S8 | `state/SelectionContext`, `TitrationPatch` | [ ] |
| [S12](S12.md) | E3c | Titration app patient + localStorage | Sonnet | high | S8 | `patient/substituts`, `patient/lib` | [ ] |
| [S13](S13.md) | D5 | Livret : substituts `contain` + carte patch dédiée (dose) | Sonnet | high | S10, S11 | `PrintableLivret.*`, `livretSections.tsx` | [ ] |
| [S14](S14.md) | E1 | Patient : visuels produit substituts (assets fournis) | Sonnet | medium | — | `patient/substituts` (assets déjà placés) | [ ] |
| [S15](S15.md) | E6 | Respiration guidée interactive | Sonnet | high | *déc. rythme* | `patient` (nouveau composant) | [ ] |
| [S16](S16.md) | E7 | Carnet de suivi (localStorage) | Sonnet | high | S12, *déc. champs* | `patient` (nouvel écran) | [ ] |
| [S18](S18.md) | C2 | Camembert : réglage des proportions au drag | Sonnet | high | S1 | `diabete/alimentation` | [ ] |
| [S17](S17.md) | — | Consolidation (commits, statuts, contexte, push) | Haiku | minimal | toutes | `STATUS/TASKS/VALIDATION/DECISIONS/PROJECT_MAP/index` | [ ] |

## Ordonnancement

- **Vague 1 — parallélisable** (zones disjointes, prêtes) : **S1 · S2 · S3 · S4 · S5 · S6**.
- **Vague 2 — parallélisable** : **S7 · S8** (S8 après S5) **· S9 · S10** (zones disjointes :
  `outils.ts` · `substituts`+nouveau composant · CSS print · `livretSections`).
- **Vague 3** : **S11 ∥ S12** (tous deux après S8, zones disjointes : consultation vs bundle patient)
  → **S13** (après S10 pour `livretSections`, après S11 pour la dose en contexte).
- **Vague 4 — gated / features** : **S14** (dès les 6 assets fournis) · **S15** (dès le rythme tranché) ·
  **S16** (après S12 pour l'util storage, dès les champs tranchés) · **S18** (après S1 ; zone alimentation
  disjointe → parallélisable dès que S1 est fait). Zones ~disjointes → parallèles.
- **Vague finale — consolidation** : **S17** (§4d WORKFLOW : commits tâche par tâche, staging
  explicite, statuts `index.md`/`TASKS.md`, `STATUS.md`/`VALIDATION.md`, entrées `DECISIONS.md`,
  un seul push).

## Gates / décisions — TOUS RÉSOLUS (2026-07-15)

- **S14 (E1)** : ✅ 6 visuels produit fournis, normalisés et placés dans `public/illustrations/tabac/`
  (`produit-*.png`). Session ramenée au câblage code.
- **S15 (E6)** : ✅ **les deux rythmes au choix** (cohérence cardiaque 5/5 ET 4-7-8), sélecteur en tête.
- **S16 (E7)** : ✅ carnet = suivi de la consommation, une entrée = une consommation, champs
  **date et heure (défaut maintenant) · contexte · ressenti** ; accès depuis l'accueil patient.
- **Gouvernance** : l'invariant #1 de `CLAUDE.md` (« zéro persistance ») doit être **scopé** à la
  consultation ; l'app patient persiste localement (localStorage). Amendement fait en S17 (+ `DECISIONS.md`).
