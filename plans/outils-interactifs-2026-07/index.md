# Plan outils-interactifs-2026-07 — Rendre la boîte à outils tabac vraiment interactive   (rédigé par Opus)

## Objectif d'ensemble

Le module « Stratégies & outils » (tabac) compte 14 outils, mais **1 seul est réellement
interactif** (`outil-vague-4d`, minuteur + courbe + 4D) et 1 l'est à moitié (`outil-respiration`,
câblé côté patient seulement). Les 12 autres sont des **fiches à lire**. Objectif : en faire de
vrais outils d'accompagnement — que le patient *fasse* quelque chose (compose, coche, calcule,
minute) et reparte avec un contenu **personnalisé** dans sa fiche imprimée, dans **les deux
bundles** (consultation + app patient).

Approche : d'abord un socle générique (registre + persistance injectée + champs de fiche), puis un
outil interactif par archétype réutilisable, tous parallélisables une fois le socle posé.

Traçabilité : ids `OI<n>` (Outil Interactif). Source du besoin : revue prod Thibault (2026-07-21).

## Décisions structurantes (à consigner dans `DECISIONS.md` à la consolidation)

- **Registre `interactif → composant`.** On remplace le test en dur `interactif === 'vague4d'`
  (`BoiteAOutilsModule.tsx:124`) par un registre `OUTILS_INTERACTIFS: Record<string, ComponentType>`.
  Ajouter un outil interactif = créer un composant + une entrée. Les deux bundles (consultation +
  patient) consomment ce registre pour afficher le bouton « Lancer l'outil » / « Démarrer » et monter
  le composant. Fin du couplage en dur.
- **Composants bundle-agnostiques + persistance injectée.** Chaque outil interactif est un composant
  autonome (comme `RespirationGuidee`, déjà dans `src/components/`) qui reçoit une prop `store`
  (`get(key) / set(key, values)` sur des `string[]`). Le **bundle** fournit l'adaptateur :
  - **Consultation** → adaptateur sur `SelectionContext` (**mémoire de session, zéro persistance
    disque** — invariant #1 maintenu côté consultation).
  - **Patient** → adaptateur sur `localStorage` via `src/patient/lib/storage.ts`.
  Précédent : extraction paramétrée de `TitrationPatch` (revue-chrome-2026-07 / S8).
- **Contexte injecté (lecture seule).** `OutilInteractifProps` porte un `contexte?: { situationsActives?:
  SituationDef[]; raisons?: string[] }`, rempli par le bundle : consultation depuis `SelectionState`
  (`situations` → `situationsActives`, `raisons`), patient depuis l'écran courant (situation active) /
  état local. Sert à personnaliser SI-ALORS (G2 : « SI » = situations sélectionnées) et le plan de
  secours (rappel des raisons). Jamais d'écriture via ce canal — l'écriture passe par `store`.
- **Un seul champ de données perso générique.** `SelectionState` gagne `outilsData: Record<string,
  string[]>` (+ action `SET_OUTIL_DATA`), au lieu d'un champ par outil. Clé = `<outil.id>` (ou
  `<outil.id>.<sous-clé>`). Côté patient, mêmes clés sous `etp.tabac.<clé>` en localStorage.
- **La fiche imprimée affiche le perso.** Dans « Ma boîte à outils », pour un outil coché, si
  `outilsData[outil.id]` est non vide → afficher ces lignes ; sinon repli sur `consigneFiche`
  (comportement actuel). Le patient repart avec **ses** plans, pas une consigne générique.
- **Contenu médical NON reformulé.** Les composants **restructurent en interaction le texte existant**
  de `src/content/tabac/outils.ts` (`principe` / `proposition`, verbatim OpenEvidence — cf. en-tête du
  fichier). Micro-copie d'interface (libellés de boutons, hints, suggestions de checklist) autorisée
  et **sobre** ; toute suggestion clinique ambiguë → gate (ci-dessous), on ne tranche pas seul.
- **Données d'interaction par outil = fichier propre.** Les items suggérés (checklists), étapes de
  minuteur, variantes de phrase… vivent dans le fichier du composant (ou un `data.ts` adjacent), **pas**
  dans `outils.ts` — pour que les sessions par-outil restent en zones disjointes (parallélisables).
- **Extension du cadrage app patient.** L'app patient était « lecture seule sauf respiration »
  (revue-chrome-2026-07 / S15). On assume l'extension : **tous** les outils interactifs sont
  disponibles côté patient (persistés en local). Évolution de cadrage — cf. gate G1.
- **Archétypes réutilisables** : `RespirationGuidee` (existe) · `OutilChecklist` (générique, S4) ·
  `MinuteurGuide` (générique, S5) · bespoke `PlansSiAlors`, `Tirelire`, `PlanSecours`, `PhraseRefus`.
  Le carnet (`outil-journal`) **ne crée pas de nouvel outil** : renvoi vers `PatientCarnet` existant
  (patient) + gabarit imprimable (consultation).

## Sessions

| Session | Tâches | Titre | Modèle | Effort | Dépend de | Zone modifiée | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [S1](S1.md) | OI1-OI4 | Socle : registre + persistance injectée + fiche perso + respiration consultation | Sonnet | high | — | `content/tabac/outils.ts`, `features/tabac/boite-a-outils/`, `patient/situations/`, `state/SelectionContext.tsx` | [x] |
| [S2](S2.md) | OI5 | Constructeur « SI… ALORS… » (flagship, efficacité démontrée) | Sonnet | high | S1 | `features/tabac/boite-a-outils/outils-interactifs/PlansSiAlors.*` | [x] |
| [S3](S3.md) | OI6 | Calculette « tirelire » (économies + paliers) | Sonnet | medium | S1 | `.../outils-interactifs/Tirelire.*` | [x] |
| [S4](S4.md) | OI7 | `OutilChecklist` générique → place-nette, mains-bouche, anti-ennui, routine | Sonnet | high | S1 | `.../outils-interactifs/OutilChecklist.*` + `.../data/` | [x] |
| [S5](S5.md) | OI8 | `MinuteurGuide` générique → bouger 10 min, surfer sur l'envie | Sonnet | high | S1 | `.../outils-interactifs/MinuteurGuide.*` + `.../data/` | [x] |
| [S6](S6.md) | OI9, OI10 | Plan de secours (écart) + Ma phrase de refus | Sonnet | medium | S1 | `.../outils-interactifs/PlanSecours.*`, `.../PhraseRefus.*` | [x] |
| [S7](S7.md) | OI11 | Journal : renvoi carnet (patient) + gabarit imprimable (consultation) | Sonnet | medium | S1 | `patient/` (PatientApp/PatientSituations), `.../outils-interactifs/GabaritJournal.*` | [x] |
| [S8](S8.md) | — | Consolidation (commits, statuts, contexte, push) | Haiku | minimal | toutes | `STATUS/TASKS/VALIDATION/DECISIONS/PROJECT_MAP/index` | [x] |

## Ordonnancement

- **Vague 1 — socle (solo)** : **S1**. Touche les fichiers partagés (registre, modules des deux
  bundles, `SelectionContext`) et crée des composants *stub* pour tous les outils à venir → doit
  précéder tout le reste. Aucune autre session en parallèle.
- **Vague 2 — parallélisable** (toutes après S1, zones disjointes : chacune ne remplit que le corps de
  son/ses composant(s) + ses données) : **S2 · S3 · S4 · S5 · S6 · S7**. S7 est la seule à re-toucher
  le bundle patient (renvoi carnet) → disjointe des S2-S6 (qui n'ajoutent que des fichiers de
  composant), mais après S1.
- **Vague 3 — consolidation** : **S8** (§4d WORKFLOW : commits tâche par tâche, staging explicite,
  statuts `index.md`/`TASKS.md`, `STATUS.md`/`VALIDATION.md`, entrées `DECISIONS.md`, un seul push).

## Gates / décisions à valider (Thibault) — à trancher avant / pendant Vague 2

- **G1 — extension du cadrage patient. ✅ TRANCHÉ (2026-07-21).** **Tous** les outils interactifs
  sont exposés côté app patient (pas seulement en consultation), persistés en local. Évolution
  assumée du cadrage « lecture seule » de l'app patient v1.
- **G2 — SI… ALORS… (S2). ✅ TRANCHÉ (2026-07-21).** Déclencheurs « SI » = **les situations que le
  patient a sélectionnées dans le module Composantes** (consultation : `SelectionState.situations` ;
  patient : la situation active de `PatientSituations`) + saisie libre. Parades « ALORS » = suggestions
  **reliées aux autres outils de la boîte** (« je bouge 10 min », « je respire 4-7-8 », « je bois un
  verre d'eau », « ma phrase de refus », « je surfe sur l'envie »…) + saisie libre. Format ligne fiche :
  `SI …, ALORS ….` → **impose d'injecter le contexte dans les composants** (cf. décision structurante
  ci-dessous : `OutilInteractifProps.contexte`).
- **G3 — Tirelire (S3). ✅ TRANCHÉ (2026-07-21).** Prix du paquet par défaut = **12 €**
  (`cigsParPaquet` défaut 20) ; paliers de récompense affichés (jour / semaine / mois / an).
- **G4 — Checklists (S4). ✅ TRANCHÉ (2026-07-21).** **Items suggérés pré-remplis** (restructurés
  depuis `proposition`) + ajout libre. Listes figées en S4 (place-nette Maison/Voiture ; mains-bouche ;
  anti-ennui cible 10 ; routine paires rituel→substitution).
- **G5 — Journal (S7). ✅ TRANCHÉ (2026-07-21).** App patient → renvoi vers le carnet existant
  (`PatientCarnet`, pas de doublon) ; consultation → gabarit hebdo imprimable (colonnes Heure · Où ·
  Ce que je fais · Ce que je ressens, aucune persistance).

> Les gates ne bloquent pas la Vague 2 : chaque session code un défaut sobre et marque les points G*
> « à revalider (Thibault) » comme ailleurs dans le dépôt. La consolidation (S8) fige les réponses.
