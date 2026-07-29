# 2026-07-21 — Chantier outils-interactifs-2026-07 : registre d'outils interactifs, persistance injectée, gates G1-G5

### Décision

Rendre interactifs 11 des 14 outils de « Stratégies & outils » (thème tabac), jusqu'ici de simples fiches
à lire (seul `outil-vague-4d` était réellement interactif, `outil-respiration` à moitié — câblé côté
patient seulement). Décisions structurantes (détail complet dans
`plans/outils-interactifs-2026-07/index.md` §Décisions structurantes) :

1. **Registre `interactif → composant`.** `OUTILS_INTERACTIFS: Partial<Record<Outil['interactif'],
   ComponentType<OutilInteractifProps>>>` (`src/features/tabac/boite-a-outils/outils-interactifs/
   registry.ts`) remplace le test en dur `interactif === 'vague4d'` de `BoiteAOutilsModule.tsx`. Les deux
   bundles (consultation, patient) consomment ce même registre pour afficher le bouton de lancement et
   monter le composant avec leur propre `store`.
2. **Composants bundle-agnostiques + persistance injectée.** Chaque outil interactif reçoit une prop
   `store: OutilStore` (`get(key)`/`setList(key, values)` sur des `string[]`) fournie par le bundle :
   consultation → `useConsultationStore` (adaptateur sur `SelectionContext`, mémoire de session, invariant
   #1 maintenu) ; patient → `usePatientStore` (adaptateur sur `localStorage`, clés `etp.tabac.<clé>`).
   Précédent d'extraction paramétrée : `TitrationPatch` (revue-chrome-2026-07).
3. **Un seul champ de données perso générique.** `SelectionState` gagne `outilsData: Record<string,
   string[]>` (+ action `SET_OUTIL_DATA`), clé = `outil.id` (ou `outil.id.sous-clé`) — au lieu d'un champ
   dédié par outil. Côté patient, mêmes clés sous `etp.tabac.<clé>` en `localStorage`.
4. **Contexte injecté en lecture seule.** `OutilInteractifProps.contexte?: { situationsActives?,
   raisons? }`, rempli par le bundle (consultation depuis `SelectionState` ; patient depuis l'écran
   courant) — jamais d'écriture par ce canal, l'écriture passe exclusivement par `store`.
5. **La fiche imprimée affiche le perso.** Dans « Ma boîte à outils », un outil coché dont
   `outilsData[outil.id]` est non vide affiche ces lignes ; sinon repli sur `consigneFiche` (comportement
   d'origine).
6. **Gates G1-G5, toutes tranchées le 2026-07-21** :
   - **G1** — tous les outils interactifs exposés côté app patient (extension du cadrage « lecture seule
     sauf respiration » de la v1 patient, `revue-chrome-2026-07/S15`).
   - **G2** — SI… ALORS… : déclencheurs « SI » = situations sélectionnées par le patient + saisie libre ;
     parades « ALORS » = suggestions reliées aux autres outils de la boîte + saisie libre.
   - **G3** — Tirelire : prix du paquet par défaut 12 €, `cigsParPaquet` défaut 20.
   - **G4** — Checklists : items suggérés pré-remplis (restructurés depuis `proposition`) + ajout libre,
     listes figées.
   - **G5** — Journal : app patient → renvoi vers le carnet existant (`PatientCarnet`, pas de doublon) ;
     consultation → gabarit hebdo imprimable, aucune persistance.

### Contexte

Source du besoin : revue produit de Thibault sur l'app déployée (2026-07-21) — 12 des 14 outils de la
boîte à outils n'étaient que des fiches à lire, sans que le patient « fasse » quelque chose. Chantier
exécuté en 3 vagues : S1 (socle, solo) → S2-S7 (un outil/archétype par session, parallèles) → S8
(consolidation, cette session).

### Alternatives envisagées

- Un champ de persistance dédié par outil (plutôt qu'`outilsData` générique) → écarté : aurait multiplié
  les champs de `SelectionState` à chaque nouvel outil interactif futur, alors qu'une seule map indexée par
  `outil.id` suffit et généralise sans reconception.
- Garder l'app patient « lecture seule » (hors respiration) → écarté par la gate G1 : incohérent avec un
  registre partagé entre les deux bundles (un outil interactif dans un seul bundle aurait nécessité un
  second mécanisme de câblage, plus de complexité pour moins de valeur patient).

### Raison du choix

Un seul registre + un seul contrat de persistance injectée permettent d'ajouter un futur outil interactif
sans toucher au moteur (`BoiteAOutilsModule.tsx`, `PatientSituations.tsx`) : créer un composant + une
entrée de registre suffit.

### Conséquences

- 14 outils sur 14 sont désormais soit interactifs (13, dont les 2 préexistants), soit un renvoi assumé
  (`outil-substituts`, vers le module Substituts).
- Aucune dépendance runtime ajoutée ; gate finale `tsc --noEmit` + `npm run build` (2 entrées) + `npm test`
  101/101 verts.
- Trois points remontés par les exécutants pendant l'exécution, non couverts par l'index, consignés
  ci-dessous.

### Impact IA

- Ajouter un futur outil interactif : créer un composant respectant `OutilInteractifProps` + une entrée
  dans `registry.ts` + un marqueur `interactif` sur l'`Outil` concerné dans `outils.ts` — aucune
  modification du moteur (`BoiteAOutilsModule.tsx`/`PatientSituations.tsx`) n'est nécessaire.
- `registry.ts` est stable depuis OI3 (S1) : aucune session S2-S7 n'y a retouché — seul le fichier du
  composant change quand son corps métier est implémenté.

---

### a. Tension d'architecture assumée : le bundle patient importe désormais `src/features/tabac/**`

**Constat.** `PatientSituations.tsx` (et le nouveau `usePatientStore.ts`) importent depuis
`src/features/tabac/boite-a-outils/outils-interactifs/` (le registre `OUTILS_INTERACTIFS` + le type
`OutilStore`), alors qu'un principe antérieur documenté dans `plans/aide-patient/index.md` §Architecture
cible interdisait à l'app patient d'importer `src/features/**` (séparation physique du code, vérifiée par
grep post-build, pour garantir que l'entrée patient ne tire jamais un module de consultation).

**Décision.** C'est une conséquence **assumée** de ce plan, pas une anomalie : le registre partagé entre
les deux bundles (décision structurante n°1 ci-dessus) et la gate G1 (tous les outils interactifs exposés
côté patient) n'ont de sens que si les deux bundles consomment le **même** registre — dupliquer le
registre côté patient aurait signifié maintenir deux listes d'outils interactifs en parallèle, source de
divergence future. `VagueCraving` (déjà sous `src/features/tabac/...` depuis le chantier `boite-a-outils`)
devient d'ailleurs lui aussi un outil patient via ce même registre, ce qui n'aurait aucun sens sans cet
import.

**Portée de l'amendement.** Strictement limitée au sous-arbre `outils-interactifs/` (registre + types +
composants) : l'interdiction reste entière pour tout **module** de consultation (`src/features/tabac/
<module>/*Module.tsx`) et pour le moteur de navigation (`src/features/registry.ts`, `App.tsx`) — le grep
post-build de vérification (mentionné dans `PROJECT_MAP.md` Feature 4bis) doit désormais exclure
`outils-interactifs/` de son périmètre d'alerte, pas être supprimé.

**Impact IA.** Si un futur outil interactif a besoin d'un composant vraiment spécifique à la consultation
(jamais monté côté patient), il doit vivre hors de `outils-interactifs/` et ne pas entrer dans le registre
partagé — sinon il sera importé par les deux bundles.

### b. Checklist « place-nette » : pas de 3ᵉ groupe « Travail » — point ouvert

**Constat.** La section « Décision clé » de `plans/outils-interactifs-2026-07/S4.md` mentionnait des
groupes « Maison / Voiture / Travail » pour la checklist place-nette, mais la liste concrète tranchée
(« Listes figées (G4) », étape 1 du même fichier) ne détaille que Maison et Voiture — cohérent avec
`outil-place-nette` dans `content/tabac/outils.ts`, qui ne parle pas du travail.

**Décision.** L'exécutant de S4 a suivi la liste concrète, plus récente et explicitement marquée
« G4 TRANCHÉ », plutôt que d'inventer un contenu « Travail » non sourcé. `data/checklists.ts` ne contient
donc que 2 groupes pour `place-nette`.

**Point ouvert — à revalider (Thibault)** : si un 3ᵉ groupe « Travail » était réellement voulu, il reste à
définir son contenu (items suggérés) et à l'ajouter à `CHECKLISTS['place-nette'].groupes` dans
`data/checklists.ts` — changement localisé, aucune reconception du composant `OutilChecklist`.

### c. Tirelire — valeur par défaut de `cigsParJour` non tranchée par la gate G3

**Constat.** La gate G3 (`plans/outils-interactifs-2026-07/index.md`) tranche le prix du paquet par
défaut (12 €) et le nombre de cigarettes par paquet (20), mais pas la valeur de démarrage de
`cigsParJour` (le premier champ que voit le patient à l'ouverture de l'outil).

**Décision.** L'exécutant de S3 a choisi **10** comme valeur neutre de démarrage, ajustable immédiatement
par les boutons ± ou par saisie directe — sans incidence sur le calcul ni sur la validation humaine du
plan (qui teste explicitement à 15 cig/j).

**Portée.** Détail mineur, non bloquant : à ajuster si Thibault préfère une autre valeur de départ (la
constante `DEFAULT_CIGS_PAR_JOUR` dans `Tirelire.tsx` est le seul point à changer).

