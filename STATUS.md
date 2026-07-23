# STATUS.md

État à l'instant T : ce qui marche, ce qui casse. Historique détaillé : `git log`.

> **Frontières** — STATUS : état actuel · `TASKS.md` : backlog + tâches · `plans/` : plan d'une tâche active · `VALIDATION.md` : checklist visuelle.
>
> **Dernière mise à jour :** 2026-07-23 (revue prod cardio — 5 modules retouchés après la 1ʳᵉ passe
> de validation visuelle de Thibault + généralisation du camembert à 3 frontières au module diabète
> Alimentation)

**Revue prod cardio — 1ʳᵉ passe de retouches post-chantier (2026-07-23)** — 8 commits hors plan
initial `theme-cardio-2026-07`, issus d'une revue de Thibault sur le déployé après le pilote M1-M3
(gates auto restées vertes à chaque commit, non reconsolidés en session dédiée) :

- **M2 « Mon risque global »** : le facteur poids/tour de taille (doublon avec « mes 3 chiffres » du
  suivi) remplacé par sédentarité/inactivité ; tabac devenu **binaire** (vert/rouge, pas de palier
  orange — cliniquement pas de niveau intermédiaire) ; retrait du message « robinet sucre » (renvoi
  Diabète) et de la fiche imprimable (cockpit « pour voir », rien à emporter).
- **Renvois inter-modules retirés** (M1 artère, M3 territoires, M4 tension, M5 cholestérol, M7
  bouger, M11 traitements) : les boutons de renvoi en pied d'écran vers un autre module supprimés —
  redondants, le soignant navigue lui-même depuis l'accueil du thème.
- **M6 « Le tabac »** : frise de réversibilité retirée (dupliquait la barre de risque, mêmes 2 états
  Fumeur/Arrêté, aucun jalon temporel réel) — la barre de risque seule porte le message désormais.
- **M8 « Manger pour ses artères »** : « Fritures » → « Graisses saturées » (catégorie plus large) ;
  « Huile d'olive » → « Huiles végétales » (distingue huile d'olive quotidienne / huiles oméga-3
  colza-lin-noix à froid) ; assiette repensée — chaque catégorie-cœur (légumes/féculents/protéines)
  représentée par un aliment concret choisi par glisser-déposé (image affichée dans sa part) ; camembert
  généralisé à **3 frontières indépendantes** réglables (une par paire de catégories voisines, au lieu
  de 2 + un point fixe) ; analyse d'équilibre réutilise désormais les messages de l'onglet Familles.
- **M9 « Les autres leviers »** : alcool — slider nu (supposait une consommation quotidienne implicite)
  remplacé par icônes de verre cliquables + sélecteur de fréquence, message nommant explicitement le
  volet du repère SPF concerné (dose/jours sans alcool/cumul hebdo) ; stress — curseur + chiffre brut
  remplacés par une échelle visuelle analogique (confort→vigilance→toxique, ancres textuelles) + message
  fixe sur l'impact CV du stress chronique, sans RR chiffré ; retrait des renvois inline vers
  tension/bouger.
- **M12 « Mon suivi »** : « Mes 3 chiffres à suivre » listait encore tension/LDL/tour de taille, devenu
  orphelin depuis le remplacement du facteur M2 correspondant — remplacé par glycémie (correspond à l'une
  des 5 stations de la grille) ; icônes des 3 chiffres dérivées des stations (source unique), reprises en
  en-tête de chaque station ; phrase d'ouverture ajoutée (absente jusqu'ici).
- **`docs/cardio/CONTENU_cardio.md` resynchronisé** sur toutes ces corrections (M2/M6/M8/M12) — reste
  l'autorité de contenu clinique du thème.
- **Diabète — module Alimentation, défi Proportion** : camembert généralisé à 3 frontières indépendantes
  (même patron que M8 cardio), en miroir à la demande de Thibault ; bug de bornage corrigé au passage
  (une catégorie à 0 % bloquait le calcul d'empan de la frontière voisine — dérivé désormais de la
  fraction de la catégorie intacte plutôt que d'une différence d'angles ambiguë).

Ces 8 commits n'avaient pas été resynchronisés dans `STATUS.md`/`TASKS.md`/`DECISIONS.md` au moment où
ils ont été faits (session précédente) — resynchronisation faite le 2026-07-23, aucun changement de code
dans cette passe de resync. **Validation visuelle humaine des modules retouchés (Thibault, `npm run dev`)
reste à faire** — cf. `VALIDATION.md`.

**Nouveau thème « Prévention cardiovasculaire » — 12 modules (2026-07-22)** — chantier
`plans/theme-cardio-2026-07/` (index + S1-S14), 3ᵉ thème du moteur multi-thèmes (après tabac et
diabète), câblé à partir d'un handoff Claude Design (`design/Mosule cardio ETP interactif-handoff.zip`,
prototype `ETP Cardio - Prototype.dc.html`) et du brief/evidence cliniques (`docs/cardio/`).
Prévention **primaire** uniquement (secondaire hors v1).

- **Contenu clinique avant code (gate G1)** : `docs/cardio/CONTENU_cardio.md` distille le brief +
  les 2 rapports OpenEvidence (socle/complément) en un doc par module (message écran/2ᵉ niveau/
  calibrage/pièges/sources). **G1 validée par Thibault le 2026-07-22**, avec 6 arbitrages cliniques
  structurants : **jamais de cible LDL/tension chiffrée à l'écran** (seuils modulés selon le risque
  CV, hors écran) ; **AMT < 135/85 conservé** (le seuil « consultation < 140/90 » du brief retiré,
  non sourcé — message « une seule mesure ne suffit pas ») ; **sel** = message qualitatif seul,
  jamais de g/j ; **alcool** = repères SPF verbatim (« moins de 2/jour, ≤ 10/semaine », sans
  affirmation plus forte que le rapport, courbe en J restée non tranchée) ; **aspirine jamais
  mentionnée** (modules 10 et 11 — contre-indiquée si l'accident est un AVC hémorragique) ; **M12 =
  « mes 3 chiffres »** (grille légère) plutôt que le cadran annuel du diabète (fréquences de suivi
  restent `// à revalider (Thibault — HAS)`, non bloquant).
- **Socle** : entrée `cardio` dans `THEMES` (`src/features/registry.ts`), `src/features/cardio/registry.ts`
  (12 `ModuleDef`, 3 familles Comprendre/Agir/Se soigner), lib pure testée
  `src/features/cardio/lib/risqueCardio.ts` (plaque réversible + **cumul multiplicatif** des
  facteurs — le cœur pédagogique du thème, 21 invariants), 4 composants cardio-owned
  (`ArtereCoupe`, `CockpitFeux`, `Silhouette`, `IllustrationSlot`) découplés du diabète mais
  réutilisant le moteur générique (`SilhouetteCorps`, `ModuleShell`, `FicheOverlay`) — décision
  actée avec Thibault (généralisation différable, pas de duplication du diabète cette fois).
- **Assets** : 46 PNG réutilisés (artère, silhouette, activités, aliments) copiés dans
  `public/illustrations/cardio/` depuis `illustrations/diabete/` ; prompts des assets neufs (pictos
  VITE, signes infarctus, artère tabac 2 états, brassard automesure) ajoutés à
  `design/illustrations/prompts-illustrations-diabete.html` — génération encore à faire (placeholders
  natifs en attendant, aucune régression).
- **Pilote (M1-M3) puis fan-out (M4-M12)** : M1 « L'artère qui s'encrasse » (séquence 4 temps
  réversible), M2 « Mon risque global » (cockpit de feux + cumul multiplicatif + fiche), M3 « Où
  l'accident frappe » (silhouette 4 territoires) ont servi de moule visuel, **validés par Thibault**
  après une correction (silhouette M3 portée de 380 → 560 px, alignée sur l'anatomie du module
  Risque CV diabète — zones trop petites/imprécises à l'écran). Les 9 modules restants ont suivi le
  moule en parallèle : M4 tension, M5 cholestérol (LDL), M6 tabac (pont vers le thème Tabac, repli
  visuel — porte inter-thèmes réelle jugée hors v1), M7 bouger (jauge sans plafond), M8 manger
  (familles + assiette), M9 autres leviers (alcool/sommeil-SAOS/stress), M10 reconnaître l'alerte
  (**carte VITE, seul objet neuf du thème** + signes d'infarctus + bandeau 15, aucune aspirine), M11
  mes traitements (ordonnance ↔ silhouette protégée, aspirine retirée de la table des classes), M12
  mon suivi (« mes 3 chiffres » + grille de voyants, jamais de rouge).
- **Incident d'infra en cours de fan-out** : 5 agents sur 8 ont calé simultanément (timeout de flux,
  incident transitoire, pas un bug applicatif). Récupéré sans perte de contenu — 3 modules
  (cholestérol, tabac, traitements) avaient en fait fini d'écrire avant le stall ; le CSS manquant du
  module suivi a été complété directement ; bouger et manger ont été relancés avec succès en plus
  faible concurrence.

Gate finale (S1-S14, 18 commits atomiques) : `npx tsc --noEmit` ✓ · `npm run build` ✓ (2 entrées,
bundle consultation 348 Ko gzippé 101 Ko) · `npm test` ✓ **127/127** (dont les 21 invariants de
`risqueCardio.test.ts`), aucune dépendance runtime ajoutée. Vérifications G1 post-fan-out (grep) :
aucune occurrence affichée d'« aspirine » (seulement en commentaires de maintenance), aucun g/L/mmHg
affiché, aucun token `toxique` (rouge) dans le module Suivi. **Points `// à revalider (Thibault)`**
restants : formulation des signes atypiques d'infarctus (M10), position du repère « > 5 min » (M10,
mis en sous-texte toujours visible faute de survol adapté à une carte de survie), accroche d'ouverture
de M8 (message patient non fourni par le rapport, proposition à juger), fréquences de suivi de M12
(confirmation HAS). **Validation visuelle humaine des modules M4-M12 (Thibault, `npm run dev`) reste
à faire** — le pilote M1-M3 est déjà validé — cf. `VALIDATION.md`.

**Revue prod — navigateur in-app (2026-07-21)** — chantier `plans/revue-prod-2026-07/` (index + S1-S6),
issu d'une revue prod complète de Thibault + Opus sur `etp-interactif.vercel.app` (consultation tabac +
diabète, livret imprimable, app patient). Deux constats structurants, plus des correctifs ciblés :

- **RP1 — outils interactifs invisibles côté patient (régression du chantier `outils-interactifs-2026-07`)** :
  l'app patient montait l'outil actif **après** la liste des cartes, sans overlay ni scroll — seul
  `RespirationGuidee` (overlay `position: fixed`) restait visible ; tous les autres outils (SI-ALORS,
  tirelire, checklists, minuteur, plan de secours, phrase de refus, journal, 4D) se montaient hors
  écran, le bouton « Démarrer » semblait mort. `PatientSituations.tsx` adopte désormais le même schéma
  *early-return* que la consultation (`BoiteAOutilsModule.tsx`) : l'outil actif remplace la liste, `backRow`
  conservée. Aucun composant d'outil modifié.
- **RP2 — « Mon plan d'arrêt » devient un plan « bornes »** (demande explicite Thibault) : l'UI du plan
  n'affiche plus que la section 1 (stratégie + date) et la section « Si j'ai un écart » (ex-section 7) ;
  les sections substituts/situations/parades/raisons/autour-de-moi disparaissent de l'écran **seulement**
  — `livretSections.tsx` (non touché) continue de lire l'état partagé (`SelectionState`) en entier, le
  livret imprimé reste complet. Gate G-RP2 (« + autre » situation) tranchée **oui** : un champ « + autre »
  ajouté dans le module Composantes (`AddictionModule.tsx`) pousse dans `state.situationsLibres`, même
  canal que l'ancien « + autre » retiré, déjà lu par le livret (bucket « Autres »).
- **RP3 — livret honnête + saisies non perdues** : le QR du livret sur-promettait (« retrouvez mes
  substituts et mes parades ») alors qu'il mène à l'app patient générique (zéro persistance + QR
  statique) — reformulé (« Retrouvez l'application et ses outils chez vous ») dans le composant partagé
  `QRBlock.tsx` (aussi utilisé par les fiches individuelles, sur-promesse corrigée au passage). Les champs
  « + autre » restants (gestes d'écart du plan, situation personnalisée de Composantes) valident
  désormais l'entrée au **blur** en plus de la touche Entrée, pour ne pas perdre une saisie tapée juste
  avant d'imprimer.
- **RP4 — ergonomie consultation, vérifiée puis corrigée (règle « reproduire avant de corriger »)** :
  les 5 points étaient tous réellement présents dans le code à jour (aucun déjà traité par un chantier
  antérieur) : clamp des positions de bulles dans Composantes (débordement horizontal des piliers
  Physique/Psychologique) ; tolérance d'anneau + seuil de déplacement sur le cadran de motivation (un
  simple tap ne change plus la note) ; libellé « Glissez » d'Alimentation aligné sur l'interaction réelle
  au clic (« Touchez ... pour l'ajouter ») ; « Voir l'effet » de Traitements déclenché dès la classe
  choisie (au lieu d'exiger le nom de molécule) ; en-tête commun (`ModuleShell`) aligné en haut
  (`flex-start`) pour ne plus faire flotter Accueil/Sources sur les modules à onglets multiples.
- **RP6 — cohérence & finitions tabac** : la silhouette de « Ce que l'arrêt répare » surligne désormais
  l'organe concerné au repère temporel sélectionné (gate G-RP6, option **a** — réutilise le moteur de halo
  déjà partagé avec le diabète, `SilhouetteCorps.tsx`, sans réplication) ; affordance renforcée du tableau
  « Mes raisons » (bordure pointillée + icône, zone vide perçue comme zone de dépôt) ; troncature des
  titres de la boîte à outils élargie (line-clamp 2→3) pour ne perdre aucun mot-clé. Le quiz Vrai/Faux
  reste **volontairement non-évaluatif** (gate G-RP6, option **b** — posture ETP sans jugement assumée,
  aucun code).

Gate finale (S1-S6) : `npx tsc --noEmit` ✓ · `npm run build` ✓ (2 entrées `consultation.html`/
`patient.html`) · `npm test` ✓ **106/106**, aucune dépendance runtime ajoutée. 6 commits atomiques par
sujet (2 fichiers partagés par plusieurs sessions — `PlanArretModule.tsx` et `AddictionModule.tsx` —
regroupés en un commit chacun, messages composés en conséquence) + 1 commit contexte. **Validation
visuelle humaine (Thibault, `npm run dev`, les deux bundles) reste entièrement à faire** — cf.
`VALIDATION.md`.

**Insuline basale/rapide — affinements de revue prod (2026-07-21)** — chantier
`plans/insuline-affinements-2026-07/` (index + S1-S6), issu d'une revue prod de Thibault sur les deux
modules diabète Insuline basale (9) et rapide (10), jugés solides mais avec quelques trous et un peu
de polish restant. 6 items traités :

- **Contenu sourcé avant code (S1, gate G1)** : `docs/diabete/09-insuline-basale.md` créé (rôle de la
  lente, régularité/horaire) + section « rapide sans repas » ajoutée à `docs/diabete/10-insuline-rapide.md`,
  depuis les réponses OpenEvidence de Thibault. **G1 validée par Thibault le jour même.**
- **Item 6 — slider timing rapide (S2)** : le slider de l'onglet ② « Le bon moment » avait 4 étiquettes
  fixes équiréparties incohérentes avec les seuils réels du message/marqueur. Nouvelle fonction
  `timingPhase(delay)` = source de vérité unique (mêmes seuils que `timingHint` et le marqueur
  Injection) ; étiquettes fixes remplacées par un libellé dynamique centré sous le curseur. Slider
  continu conservé (gate G3).
- **Item 5 — creux sous baseline (S3, lib partagée `glycemieCurve.ts`)** : la courbe « avec rapide »
  plongeait sous la baseline juste après le repas dans le cas adéquat (artefact d'alignement
  bolus/repas, pas un problème de dose). Garde-fou local dans `sampleRepasAvecBolus` : l'effet du
  bolus ne peut plus creuser sous la baseline avant `LATENCE_REPAS` quand aucun excès de glycémie
  n'est disponible pour le justifier — préserve intacts le sur-dosage, le cumul (temps ④) et la
  correction départ-haut (temps ③). 5 nouveaux invariants de test, aucun invariant existant assoupli.
- **Item 3 + 1 — module basale (S4)** : intro courte « à quoi sert la lente » (frein hépatique, sucre
  de fond ≠ repas) + bloc régularité/horaire générique (« même heure, souplesse → à voir avec le
  soignant », **aucune molécule, aucun chiffre** — gate G2) ajoutés en amont du jeu de titration
  existant, qui reste inchangé et toujours le cœur de l'écran.
- **Item 2 — module rapide (S5)** : 5ᵉ onglet distinct `⑤ Et si je ne mange pas ?` (gate G5, pas une
  variante du ④) — courbe plate (sans repas) vs courbe qui plonge (rapide injectée quand même),
  message de sécurité + renvoi module 8 (hypoglycémie), option post-prandiale en exception.
  Positionnement (après le ④) `// à revalider (Thibault)`.
- **Item 8 — pont inter-modules (S4+S5)** : une phrase de chaque côté reliant la basale (journée
  entière, coucher→coucher) et la rapide (un repas). Les deux formulations sont **conceptuellement
  cohérentes mais pas identiques mot pour mot** — arbitrage Thibault en attente (garder ou harmoniser).

Gate finale (S1-S6) : `npx tsc --noEmit` ✓ · `npm run build` ✓ (2 entrées) · `npm test` ✓ **106/106**,
aucune dépendance runtime ajoutée. Points `// à revalider (Thibault)` : bornes du slider timing (S2),
tolérance visuelle du garde-fou bolus (S3, garantie algébrique donc pas de seuil calibré), micro-copie
intro/régularité/pont basale (S4), positionnement du 5ᵉ onglet + note post-prandiale + micro-copie
pont rapide (S5). **Validation visuelle humaine (Thibault, `npm run dev`) reste entièrement à faire**
— cf. `VALIDATION.md`.

**Boîte à outils tabac rendue interactive (2026-07-21)** — chantier `plans/outils-interactifs-2026-07/`
(index + S1-S8), issu d'une revue produit de Thibault (2026-07-21) : sur les 14 outils de « Stratégies &
outils », un seul était réellement interactif (`outil-vague-4d`) et un second à moitié (`outil-respiration`,
câblé côté patient seulement) — les 12 autres n'étaient que des fiches à lire. Objectif atteint : **14
outils sur 14** sont désormais soit interactifs, soit un renvoi assumé (`outil-substituts`), dans **les
deux bundles** (consultation + app patient) :

- **Socle (S1, OI1-OI4, solo)** : registre `OUTILS_INTERACTIFS: Record<interactif, Component>`
  (`src/features/tabac/boite-a-outils/outils-interactifs/registry.ts`) remplace le test en dur
  `interactif === 'vague4d'` de `BoiteAOutilsModule.tsx`. Contrat `OutilInteractifProps` (`types.ts`) :
  `store` (persistance injectée, `get`/`setList` sur `string[]`) + `contexte?` (lecture seule :
  situations actives, raisons) + `onClose`. `SelectionState` gagne `outilsData: Record<string, string[]>`
  (+ action `SET_OUTIL_DATA`, mémoire de session, invariant #1 consultation) ; deux adaptateurs
  `useConsultationStore`/`usePatientStore` (ce dernier sur `localStorage`, clés `etp.tabac.<outil.id>`).
  Les deux bundles affichent désormais un bouton « Lancer l'outil » / « Démarrer » dès qu'un outil a un
  `interactif` mappé. La fiche « Ma boîte à outils » affiche les lignes personnalisées de l'outil
  (`outilsData[outil.id]`) si non vides, sinon la `consigneFiche` générique (comportement d'origine).
  `outil-respiration` (jusqu'ici câblé patient seulement) est désormais lançable en **consultation** aussi.
- **OI5 — Constructeur « SI… ALORS… »** (S2, `PlansSiAlors.tsx`) : le patient compose 3 à 5 plans à
  partir de ses situations sélectionnées (chips + saisie libre) et de parades reliées aux autres outils de
  la boîte (bouger, respiration, eau, phrase de refus, surfer + saisie libre) ; persistance `store`, ligne
  fiche `SI …, ALORS ….`
- **OI6 — Tirelire** (S3, `Tirelire.tsx`) : calculette d'économies (jour/semaine/mois/an) à partir de
  cigs/jour, prix du paquet (défaut 12 €, G3) et cigs/paquet (défaut 20, G3) + champ « Ma récompense »
  libre ; ligne de synthèse persistée pour la fiche.
- **OI7 — `OutilChecklist` générique** (S4, `OutilChecklist.tsx` + `data/checklists.ts`) : un seul
  composant sert 4 outils — place-nette (groupes Maison/Voiture), mains-bouche, anti-ennui (cible ~10,
  indicateur non bloquant), routine (paires rituel → substitution éditable) — items suggérés pré-remplis
  (G4) + ajout libre, persistance `store`.
- **OI8 — `MinuteurGuide` générique** (S5, `MinuteurGuide.tsx` + `data/minuteurs.ts`) : un seul composant
  sert `bouger` (minuteur 10 min + rappel d'exercices de repli) et `surfer` (invites d'observation de
  l'envie qui défilent, ~3 min) ; phases idle/active/done, pas de persistance (rien à mémoriser).
- **OI9 — Plan de secours** (S6, `PlanSecours.tsx`) : carte d'action immédiate (pas une fiche) — les 3
  gestes du `proposition` cochables (état éphémère, non persisté — geste d'urgence), contact 39 89, rappel
  des raisons d'arrêter déjà saisies (`contexte.raisons`) ou invite à les noter.
- **OI10 — Ma phrase de refus** (S6, `PhraseRefus.tsx`) : 4 variantes courtes sélectionnables (dont la
  phrase verbatim du `proposition`) + saisie libre, persistée pour la fiche ; astuce comportementale +
  rappel de vigilance alcool verbatim.
- **OI11 — Journal** (S7, `GabaritJournal.tsx`) : ne duplique pas un journal — côté patient, renvoie vers
  le carnet existant (`PatientCarnet`, bouton « Ouvrir mon carnet », navigation via un nouveau prop
  `onNavigate` sur `PatientSituations`/`PatientApp`) ; côté consultation (zéro persistance), gabarit
  hebdomadaire imprimable (heure/lieu/activité/ressenti, 15 lignes) via `FicheOverlay`.

**Gates G1-G5 tranchées le 2026-07-21** (cf. `DECISIONS.md`) : G1 — tous les outils interactifs exposés
côté patient (extension du cadrage « lecture seule » v1) ; G2 — déclencheurs SI = situations
sélectionnées + saisie libre, parades ALORS reliées aux autres outils ; G3 — tirelire 12 €/paquet, 20
cigs/paquet (défaut `cigsParJour` = 10, détail mineur non tranché par la gate, choisi par l'exécutant) ;
G4 — items de checklist pré-remplis + ajout libre (place-nette : Maison/Voiture seulement, pas de 3ᵉ
groupe Travail — point à revalider si un 3ᵉ groupe était réellement voulu) ; G5 — journal = renvoi carnet
patient + gabarit imprimable consultation.

**Tension d'architecture assumée** (cf. `DECISIONS.md`) : le registre partagé (`OUTILS_INTERACTIFS`) et
son contrat de types sont désormais importés par le bundle patient (`PatientSituations.tsx`,
`usePatientStore.ts`) depuis `src/features/tabac/boite-a-outils/outils-interactifs/`, alors qu'un
principe antérieur (`plans/aide-patient/index.md`) interdisait au bundle patient d'importer
`src/features/**`. Assumé comme évolution d'architecture (registre partagé entre bundles + gate G1),
documenté explicitement, pas une anomalie.

Gate finale (S1-S8) : `npx tsc --noEmit` ✓ · `npm run build` ✓ (2 entrées `consultation.html`/
`patient.html`) · `npm test` ✓ **101/101**, aucune dépendance runtime ajoutée. 11 commits atomiques
OI1-OI11 (un par tâche, dans l'ordre S1→S7) + consolidation contexte. **Validation visuelle humaine
(Thibault, `npm run dev`, les deux bundles) reste entièrement à faire** — cf. `VALIDATION.md`.

**Corrections revue guidée — Tabac A-D + Diabète E (2026-07-14)** — chantier
`plans/corrections-revue-guidee/` (index + S1-S7), 13 points d'une revue guidée de l'app par Thibault
(auteur, sur `etp-interactif.vercel.app`), reconstruite dans `rapport-ameliorations-etp-interactif.md`,
traités en **vague parallèle multi-agent** (S1-S5) + solo (S6, même fichier que S5) + consolidation (S7).
**Validé visuellement par Thibault le jour même** (`npm run dev`).

- **S1** (tabac « Ce que l'arrêt répare ») : retrait du compteur « Étape X/N » ; barre de chips + flèches +
  footer « Recommencer » remplacés par une **frise chronologique à hotspots** (axe 20 min → 10-15 ans,
  `jalonIndex`/`selectionnerJalon` conservés, `aria-current="step"`) ; silhouette schématique + cercles
  blancs → **silhouette anatomique en mode hotspot** (`SilhouetteCorps` générique via sa prop `bodyImage`,
  **sans importer** le wrapper diabète — asset copié dans `public/illustrations/tabac/silhouette-corps.png`,
  ancres des 7 zones en % dans `benefices-arret/data.ts`) ; illustration de détail agrandie (96→160px) et
  centrée. **+ correctif post-validation** : silhouette (`.silhouetteCol` 260→380px desktop / 300→420px
  mobile) et illustration de détail (160→220px) jugées encore trop petites, réagrandies.
- **S2** (tabac Substituts) : technique de prise « Vapoteuse » (illustration + info clé) rendue visible sans
  défiler — compactage des espacements (`.module`/`.section`/`.panels`) + `scrollIntoView({block:
  'nearest'})` en filet sur changement de forme, `prefers-reduced-motion` respecté ; les 5 autres formes
  non dégradées.
- **S3** (tabac Boîte à outils) : retrait du toggle « Dans ma fiche » des cartes de la **grille** (conservé
  en vue détail, `toggleFiche` toujours utilisé) ; retrait des **deux** renvois redondants vers le plan
  d'arrêt (« Les inscrire… » / « Le préparer… ») dans `src/content/tabac/outils.ts` — app patient
  (`PatientSituations.tsx`) vérifiée par grep, ne rend aucun `renvoi`, donc non impactée.
- **S4** (tabac Plan d'arrêt) : **sélecteur de stratégie « Arrêt complet / Réduction progressive »**
  (`role="radiogroup"`) dans la section « 1. Ma date » ; champ `strategie: 'complet' | 'progressive' |
  null` ajouté à `SelectionContext` **en mémoire uniquement** (zéro persistance, inclus dans le reset) ;
  **libellés conditionnels seuls** (aucun protocole/palier chiffré inventé — titre de section + aide de la
  date s'ajustent au choix), textes annotés `// à revalider (Thibault)` ; livret (`buildLivretSections`)
  **inchangé** en v1.
- **S5** (diabète Insuline rapide) : cohérence pédagogique des courbes de `glycemieCurve.ts`/
  `InsulineRapideModule.tsx` — temps ① « couvrir » : dose « habituelle » devient **fixe** (calée sur un
  repas moyen, `DOSE_ADEQUATE × DOSE_FACTOR`, comme le temps ③) au lieu de se recaler sur la charge du
  repas ; le résultat suit désormais l'écart **(dose − glucides)** (Peu+Habituelle → hypo,
  Beaucoup+Habituelle → reste haut sans plonger) ; `messageCouvrir` réécrit en matrice 9 cases. Temps ③ :
  réglages fins (départ « Haute » nettement dans le rouge, creux « cible+habituelle » recalé dans le vert,
  « basse+moins » amorce un retour cible). Temps ④ « redescend toute seule » : la base sans dose est
  redessinée pour montrer une **montée post-prandiale nette puis un retour spontané en cible** (au lieu
  d'un quasi-plat). Temps ④ : résultat + bouton « le réflexe » compactés pour rester visibles sans défiler.
  Constantes recalées (`REPAS_CRANS`, `DOSE_ADEQUATE`, `DEPART_OPTIONS`), toutes `// à revalider
  (Thibault)` ; `glycemieCurve.ts`/`.test.ts` **non touchés** par S5 lui-même (levier resté au niveau module).
- **S6** (diabète Insuline rapide) : encadré commun **situation → réponse → résultat** (nouvelle classe
  `.situationCard`, reprise de la basale) posé sur les temps ①③④ (chips + sélecteur de dose + courbe +
  message dans un même conteneur) ; temps ② inchangé (pas de chips situation) ; accessibilité (`radiogroup`/
  `radio`/`aria-pressed`, cibles ≥ 44px) préservée à l'identique, seul l'enveloppement DOM a changé.

**Correctifs de séance (hors plan initial, décidés par Thibault en cours de validation visuelle, 2026-07-14)** :

- **Courbes temps ④** (diabète Insuline rapide + lib) : les 2 courbes de base (« redescend seule » /
  « reste haute », option sans dose ajoutée) **partent identiques** (creux initial supprimé, même dose de
  repas/même repas — `REPAS_CUMUL`, `DOSE_BASE_CUMUL`) et montent en un **pic marqué dans le rouge et
  étalé** (≈69, au-dessus du haut de cible), puis **divergent après le pic** (l'une redescend en cible vers
  +2,5-3h, l'autre plafonne). Levier lib jugé **indispensable** : nouvelle fonction `excesGate(params, t)`
  dans `src/features/diabete/lib/glycemieCurve.ts` — l'excès de la situation « reste haute » n'est plus un
  décalage constant mais **gaté post-pic** (nul avant/au pic) ; `exces` n'est consommé **que** par
  `sampleRepasAvecBolus` / ce module (8 autres modules diabète non impactés). **+1 invariant** de test
  « excès nul avant le pic » dans `glycemieCurve.test.ts` (les invariants existants restent verts, 96/96).
  Constantes du module recalées (`REPAS_CUMUL`, `DOSE_BASE_CUMUL`, `DOSE_RECORRECTION`,
  `EXCES_SITUATION_B`, `RECORR_DELAIS`), toutes `// à revalider (Thibault)`.
- **Les 4D** (tabac Boîte à outils, `VagueCraving.tsx` + `.module.css`) : les 4 D (Différer/Détourner/Se
  détendre/D'eau) ne s'affichent plus tous en permanence — par défaut la **vague de l'envie** est dégagée +
  4 pastilles compactes (titres seuls) ; **activation exclusive** (état `activeDs: Set` devenu
  `activeD: DKey | null`, un seul D actif à la fois), le D actif s'affiche **superposé sur la vague**,
  re-clic → retour à la vague seule. Contenu (`D_INFO`, fiche « Ma carte anti-envie ») inchangé.
- **Insuline basale en écran unique** (diabète, `InsulineModule.tsx` + `.module.css`) : décision Thibault —
  au lieu d'aligner la nav de la basale sur les onglets de la rapide (idée initiale du rapport, point 10),
  **retrait complet des onglets** de la basale (les 2 « temps » étaient un découpage artificiel, la courbe
  restant toujours visible) ; machinerie `tablist`/`tab`/`tabpanel` retirée, prop `nav` de `ModuleShell` non
  passée, bloc « Décider » (situations) désormais **toujours visible** en un seul écran continu ; CSS
  d'onglets nettoyé ; `scenarios.ts` (logique métier) **intact**. Insuline **rapide** reste le module de
  référence, inchangée par ce correctif.

Gate finale du chantier (S1-S6 + les 3 correctifs de séance) : `npx tsc --noEmit` ✓ · `npm run build` ✓ ·
`npm test` ✓ **96/96**, aucune dépendance runtime ajoutée. **Validation visuelle humaine (Thibault, `npm run
dev`) faite le 2026-07-14** — seule la consolidation contexte + commits/push (S7) reste à finaliser. Points
encore à revalider **cliniquement** (rendu visuel déjà validé, contenu chiffré non tranché) : libellés de
stratégie d'arrêt (S4, `// à revalider`) et l'ensemble des constantes de courbe d'insuline rapide
(`REPAS_CRANS`, `DOSE_ADEQUATE`, `DEPART_OPTIONS`, `REPAS_CUMUL`, `DOSE_BASE_CUMUL`, `DOSE_RECORRECTION`,
`EXCES_SITUATION_B`, `RECORR_DELAIS`, `excesGate` — S5 + correctifs de séance).

**Corrections audit Chrome — thème Tabac + 2 retours Diabète (2026-07-13)** — chantier
`plans/corrections-audit-tabac/` (index + S1-S13), 16 points d'un audit navigateur manuel de Thibault
(Claude in Chrome sur le déployé, reconstruit dans `rapport-bugs-etp-tabac.md` + `rapport-bugs-etp-diabete.md`)
traités : 15 côté tabac (T1-T15, sessions S1-S9 en vague parallèle + S10-S11 en solo) + 1 côté diabète
(AT-D1, déjà fait antérieurement — Hypoglycémie en dernier + renommage « Insuline : adapter les doses » →
« Insuline basale »). **Retouches UI/tailles/icônes** (S1-S9) : titration du patch conditionnée à la forme
Patch + illustration vapoteuse responsive (S1) ; grille Vrai/faux modernisée + fix a11y `role="listitem"`
posé à tort sur un `<button>` + illustration détail agrandie (S2) ; case « Dans ma fiche » en icône Lucide
compacte + illustrations agrandies + overlay des 4 D rendu transparent au-dessus de la courbe de l'envie
(S3) ; anti-débordement du cercle « Comportementale » (viewBox agrandi) + retrait de la légende redondante
(S4) ; box de courbe Nicotine agrandie et modernisée (S5) ; illustrations d'organes désormais visibles dans
la vue frise « Ce que l'arrêt répare », pas seulement au clic d'un organe (S6) ; marqueurs Repas/Injection
de `CourbeGlycemie` (composant diabète **partagé** par tous les onglets Insuline) passés en icônes Lucide
`Utensils`/`Syringe` (S7) ; icônes Lucide en tête des cartes-raisons Motivation (S8) ; ordre des familles de
l'accueil tabac réordonné « Se motiver → Comprendre → Agir » (S9, thème diabète intact).

**Socle d'état partagé en mémoire (S10, T11)** — nouveau `src/state/SelectionContext.tsx` : Provider React
générique (indexé par `themeId`) + hook `useSelection()`, monté dans `App.tsx` **au-dessus du switcher de
vues** — survit à la navigation inter-modules (contrairement au state local des modules) mais se
réinitialise à un rechargement de page (comportement éphémère voulu, conforme à l'invariant « zéro
persistance » : jamais de `localStorage`/`sessionStorage`/cookies). Câblé en écriture depuis Composantes
(situations), Substituts (forme, via un nouveau toggle « Retenir pour mon plan »), Boîte à outils (outils
« Dans ma fiche ») et Motivation (raisons) ; « Mon plan d'arrêt » lit **et** écrit désormais toutes ses
sections (bidirectionnel) + `dateArret` + un nouveau bouton « Réinitialiser mon plan ». Grep de persistance
vérifié clean sur le diff.

**Livret d'accompagnement (S11, T14, proposition)** — « Mon plan d'arrêt » n'imprime plus un récapitulatif
texte mais un **livret multi-pages A4 illustré** (`src/components/PrintableLivret.tsx` + builder
`src/features/tabac/plan-arret/livretSections.tsx`) : couverture → Comprendre (situations) → Mes substituts
(forme + bonnes pratiques + illustration) → Mes parades & outils (outils illustrés + parades 4D) → Mes
raisons (icônes) → Si j'ai un écart → Ce que l'arrêt répare (7 zones) → Contacts (39 89). Factorisation au
passage pour éviter la duplication de contenu clinique : `FORMES_DATA`/`FormeId`/`FORMES_PONCTUELLES`
extraits vers `tabac/substituts/data.ts`, `MOTIVATION_SEED`/`RAISON_ICONS`/`iconForRaison` vers
`tabac/motivation/data.ts` (supprime une duplication `RAISONS` préexistante dans `PlanArretModule`). **Livré
sans validation visuelle** (demande explicite de Thibault, « on ajustera après ») — points ouverts consignés
dans `VALIDATION.md` (bouton « Imprimer mon plan » remplacé par « Imprimer mon livret complet » : plus de
fiche « plan » courte isolée ; « Mes bénéfices »/« Contacts » toujours des sections fixes ; pagination A4
fine à valider en aperçu Ctrl+P ; illustration substituts affichée aussi pour le patch, alors que le module
lui-même n'en montre pas).

**App d'aide patient autonome (chantier aide-patient, T16 du chantier corrections-audit-tabac) — vagues V1-V4
(2026-07-13)** — 2ᵉ surface applicative autonome : 2ᵉ point d'entrée Vite (`patient.html` + `src/patient/main.tsx`)
dans le même repo, bundle isolé qui n'importe **jamais** le registre ni un module de consultation. Contenu
**générique** (aucune donnée patient) : v1 = deux écrans seulement (« Mes substituts » + « Agir face à une
situation ») + un QR statique unique. Couche partagée nouvelle : `src/content/tabac/` (substituts/situations/outils,
sources de vérité pour consultation + patient, relativisés du repositionnement S1). **Vagues complètes et gates
verts** : V1 = S1 (relocalisation contenus) ✓ · V2 = S2 (2ᵉ entrée Vite + coquille app) ✓ · V3 = S3·S4·S5
(substituts, situations, QR) ✓ · V4 = S6 (consolidation contexte) → en cours. **Validation VISUELLE** (Thibault,
`npm run dev`, deux apps) encore entièrement à faire. Reste différable : hébergement de l'URL patient (2ᵉ projet
Vercel ou sous-domaine), régénération `public/qr/patient.png` à l'URL définitive.

Gate finale du chantier (S1-S11 + S13) : `npx tsc --noEmit` OK · `npm run build` OK · `npm test` 95/95 OK,
aucune dépendance runtime ajoutée. **La validation VISUELLE humaine (Thibault, `npm run dev`) reste
entièrement à faire**, session par session (cf. `VALIDATION.md`) — aucune vérification navigateur n'a été
faite côté Claude. Le « ménage du dépôt » du 2026-07-13 ci-dessous reste par ailleurs **non committé**, à
trancher par Thibault avant tout commit/push groupé de ce chantier.

**Ménage du dépôt (2026-07-13)** — nettoyage technique, aucun changement fonctionnel :

- **Purge des 5 derniers dossiers `plans/` de chantiers clos** (`audit-diabete`, `corrections-visuelles-diabete`,
  `-v2`, `-v3`, `illustrations-diabete`) — même traitement que la purge du 2026-07-11 (`extensions-tabac`,
  `approfondissement-tabac`, `boite-a-outils`, etc.) : contenu déjà synthétisé dans `STATUS.md`/`TASKS.md`,
  détail complet retrouvable via `git log`. `plans/` est désormais vide (attend le prochain chantier).
- **Scories techniques supprimées** : `.audit-temp/` (captures + specs Playwright ad hoc, suivies par erreur
  dans git, contenu jamais référencé), `.codex-tmp/` (cache d'outil Codex), `dist/` (build, régénérable),
  `test-results/` et `output/playwright/` — sauf les captures de l'audit diabète 2026-07-12, **déplacées vers
  `Audit/evidence-audit-diabete/`** pour rester à côté du rapport qui les référence (`Audit/AUDIT-DIABETE.md`,
  chemins mis à jour).
- **`Audit/`** (rapports d'audit manuel, jusqu'ici non suivi par git par oubli) **ajouté au suivi git** —
  c'est le dépôt permanent désigné pour ces rapports depuis la purge des audits racine du 2026-07-12.
  Vérification point par point avant purge (ne pas supprimer un audit sur la seule foi de sa date) :
  - **Supprimés, entièrement traités** — `audit-etp-interactif.md` (source des 12 points du chantier
    `audit-diabete` T1-T11, clos) et `audit chrome.md` (source 1:1 des 10 sections du chantier
    `corrections-visuelles-diabete-v3` S1-S10, clos, vérifié point par point).
  - **Conservés** — `audit-etp-interactif-iteration2.md` (6 points corrigés en working tree mais
    **jamais committés**, en attente de la validation visuelle Thibault — cf. `VALIDATION.md`) ;
    `AUDIT-DIABETE.md` (audit Chromium/Playwright distinct, thème diabète) dont le tableau de synthèse
    contient plusieurs points **encore non traités par aucun chantier** : chiffres/dosages bruts à
    l'écran (`CG`, `mg/dL`, `15 g`, `%` — Alimentation/Activité/Hypoglycémie/Insuline/Sources,
    contredit l'invariant « pas de texte médical chiffré brut »), animation Mécanisme non pilotable
    par temps pédagogique, libellé « Accueil » vs « Retour aux modules », zones Complications déjà
    vues dès l'état initial. **Reste un backlog réel** (candidat à un futur chantier), pas une simple
    scorie — évidence déplacée vers `Audit/evidence-audit-diabete/` (voir plus bas).
- **`.gitignore`** : ajout de `.audit-temp/`, `.codex-tmp/`, `output/`, `test-results/` pour éviter que ces
  scories reviennent (les rapports d'audit vivent dans `Audit/`, pas dans les dossiers de sortie d'outils).
- **`PROJECT_MAP.md`** : référence morte à `PLAN_modules-tabac.md` (supprimé depuis le 2026-06-28) retirée ;
  section `plans/` généralisée pour ne plus lister de chantiers nommés (source de péremption à chaque purge).
- **`maquettes/` supprimé en entier** (handoffs Claude Design tabac + diabète, zips + extraits + snapshot de
  référence) — les deux chantiers de câblage sont clos (`refonte-ui` S1-S10 pour le tabac 2026-07-08, `theme-diabete`
  D1-D14 pour le diabète 2026-07-09) et l'UI a depuis largement divergé du maquette d'origine via 3 tours de
  corrections visuelles ; plus aucune valeur de référence active. Historique complet → `git log`.

**Illustrations tabac (2026-07-12)** — le thème tabac n'avait **aucune** illustration (tous les
`IllustrationSlot` en placeholder depuis leur création). Thibault a livré un lot de sources dans
`Downloads\illustration ETP\` couvrant à la fois des compléments diabète (déjà tous absorbés par le
chantier `illustrations-diabete`, aucune action côté diabète) et, pour la première fois, un lot
tabac complet. Nouveau script `design/illustrations/build_assets_tabac.py` (même pipeline Pillow/
numpy que le diabète : flood-fill transparent 8 points de bord, palette adaptative 256 couleurs) →
**42 PNG** déposés dans `public/illustrations/tabac/` (3,2 Mo au total) :
- **Bénéfices de l'arrêt** (7/8 zones) : `benef-cerveau/bouche/coeur/poumons/sang/peau/jambes` —
  mappées par correspondance de libellé (`benefices-arret/data.ts`) ; `benef-horizon` (dernier
  jalon) reste en placeholder, aucune image dédiée dans le lot.
- **Boîte à outils** (14/14, couverture complète) : chaque outil retrouve son illustration par titre
  exact ou quasi-exact (ex. « Une semaine d'observation » → `outil-journal`, « Traiter le manque » →
  `outil-substituts`).
- **Idées reçues** (15/21) : mapping par contenu de l'affirmation (ex. « Ça commence en 20mn » →
  `vf-20min`) ; 6 cartes sans image dédiée dans le lot restent en placeholder (`vf-poids-coeur`,
  `vf-fumer-mince`, `vf-poids-regime`, `vf-vape-aide`, `vf-double-usage`, `vf-vapeur-eau`) — un seul
  visuel « poids » existait dans le lot, affecté à `vf-poids` (le mythe le plus central), à
  revalider par Thibault si un autre choix était voulu (cf. `DECISIONS.md`).
- **Substituts — techniques de prise** (6/6) : `TechniqueIllustration.tsx` réécrit pour consommer
  `public/illustrations/tabac/substitut-<forme>.png` (comme suggéré par le commentaire déjà présent
  dans le code depuis BO5) au lieu de sa table `ILLUSTRATIONS` figée à `null` ; taille 900px (scènes
  larges 16:7) au lieu de 512px (icônes carrées des autres slots).

`IllustrationSlot` gérait déjà nativement la couverture partielle (fallback `onError` → placeholder,
jamais une erreur) : aucune régression sur les ids sans image dédiée. Gate : `tsc --noEmit` ✓ ·
`npm run build` ✓ · `npm test` ✓ (95/95, aucune régression). Échantillon relu à l'œil (organe,
scène technique large, icônes + objet, personnage) : flood-fill propre, aucun artefact.

**Audit-diabete itération 2 (2026-07-12)** — 6 points d'une 2ᵉ navigation manuelle de Thibault sur le
déployé (`Audit/audit-etp-interactif-iteration2.md`), corrigés en une passe (Opus), tous sur la famille
Insuline. **Module 9 « Décider »** (`insuline/scenarios.ts` + `InsulineModule.tsx`) : l'ancien couple
`AJUSTEMENT_RESULT`→scénario + `outcomeMessage(scénario)` est remplacé par une table unique
`DECIDER_MATRICE` `{situation, choix} → {courbe, message, ton}` — le message était dérivé du seul
scénario résultant, ce qui plaquait un même texte sur deux couples opposés (baisser une lente déjà
faible ≠ monter une lente déjà forte). Points 1/3 (messages inversés) et 4 (situation « déjà haut »
totalement inerte, courbe + message figés) réglés ; point 2 : les 3 descriptions narratives qui
donnaient la réponse sont retirées. **Module 10 « Insuline rapide »** (`insuline-rapide/`) : sélecteur
de dose mutualisé (`DoseSelector`, crans −/habituelle/+ en facteur `DOSE_FACTOR`) ajouté aux onglets
① Couvrir le repas et ③ Corriger, croisé avec les crans existants → 9 combinaisons de courbe chacun
(points 5/6) ; l'ancien toggle ad hoc « Ajouter une correction » du départ haut disparaît.
**Lib `glycemieCurve.ts`** : 3 scénarios nocturnes ajoutés (`derive_haute_forte`, `haut_puis_monte`,
`haut_puis_descend`) pour porter l'aggravation et la réactivité de la situation « déjà haut » ; 3
invariants de test ajoutés. Constantes cliniques (facteurs de dose, amplitudes) `// à revalider
(Thibault)`. **Aucun commit** (working tree, en attente de la validation visuelle Thibault, cf.
`VALIDATION.md §Audit diabète itération 2`). Gate : `tsc --noEmit` ✓ · `npm run build` ✓ ·
`npm test` ✓ (95/95).

**Audit-diabete (2026-07-12)** — 6 sessions, 11 tâches (T1-T11), 12 points d'un audit manuel de
Thibault sur le déployé corrigés : Cardio (fusion Leviers→Artère, retrait de 3 textes), Hypo
(illustrations des signes dans la carte-réflexe), Alimentation (courbe remontée dans la colonne de
chaque défi + allègements Composition/Qualité), Insuline « Décider » (réglage de la lente devenu
expérimentable), Insuline rapide (départ convergent + cumul à 6 cases expérimentable — 3 tentatives
de modélisation, mécanisme d'excès persistant/IOB retenu, cf. `DECISIONS.md`), zéro scroll
(resserrement du cadre partagé + mesure des résiduels). Détail complet en `## Phase 14` ci-dessous.
Chantier `audit-diabete` (S1-S6) **clos**.

**S10 (2026-07-11)** — 10ᵉ module diabète, `insuline-rapide/InsulineRapideModule.tsx` : 4 temps
(couvrir le repas / le bon moment / corriger avant le repas / le piège du cumul), modèle
`sampleRepasAvecBolus` ajouté à `glycemieCurve.ts` (86 tests verts, dont 6 nouveaux). Implémenté
sur instruction explicite de Thibault, **avant que le statut « relecture finale » du contenu
source (`docs/diabete/10-insuline-rapide.md`) n'ait été formellement levé** — reste à confirmer
a posteriori. `BOLUS_DUREE` calibré à 180 min (borne basse de la fourchette sourcée) pour éviter
qu'une dose unique bien dosée ne creuse artificiellement sous la baseline (cf. `DECISIONS.md`).
Le thème diabète compte désormais **10 modules**, tous opérationnels. Chantier
`corrections-visuelles-diabete-v3` (S1-S10) **clos**.

## Phase actuelle

**Phase 9** (`plans/theme-diabete/`, câblage du thème diabète sur maquette Claude Design, 2026-07-09) : **plan S13 consolidation complet (D1-D13)**, puis **S14 — corrections de la revue visuelle de Thibault sur build local** (7 bugs, 5 modules + lib). Thème diabète opérationnel : 9 modules (Mécanisme/Alimentation/Activité physique/Risque cardiovasculaire/Complications/Suivi/Traitements/Hypoglycémie/Insuline) + lib `glycemieCurve` (modèle physiologique + tests 61/61 verts) + 4 composants transversaux (Silhouette/CourbeGlycemie/PlaqueArtere/SignatureEvitable). Gate finale : `npx tsc --noEmit` + `npm run build` + `npm test` tous verts.

**S14 (2026-07-09)** — évolutions notables :

- **Lib `glycemieCurve.ts`** : `paramsFromAssiette` dérive désormais la courbe de la **composition réelle approximative** du repas (charge glycémique, fibres, protéines, lipides — `AlimentRepas { cg, fibres, proteines, lipides }`) plutôt que d'heuristiques de familles + proximité à une assiette-modèle. `Famille` et les proportions sortent de la lib (ne vivent plus que côté `alimentation/data.ts` et modules). L'ordre du féculent devient gradué (`Assiette.ordreFeculent?: number`, 0→1) — l'ancien booléen `ordreFeculentDernier` disparaît, aucune compatibilité. Le scénario nocturne `ScenarioTrace = 'nuit_isolee'` est remplacé par `'descend_hypo_matinale'` ; le raccord nuit→jour de `sampleJournee` est désormais continu (plus de saut brutal au passage minuit).
- **`alimentation/data.ts`** : la table `FOODS` passe des CG relatives (échelle 0-100) aux **charges glycémiques réelles par portion usuelle** + nouveaux champs `fibres`/`proteines`/`lipides` (grammes réels) — seuils `cgTier` recalibrés (vert ≤10, orange 11-19, rouge ≥20). `// à revalider (Thibault)`.
- **Module 6 Suivi — inversion de la décision D9 n°2** : le cadran démarre désormais **vide** au montage (l'utilisateur le construit élément par élément), au lieu du pré-peuplement automatique posé en S9.
- Détail complet des 7 bugs (B1-B8) et invariants de tests dans `plans/theme-diabete/S14.md`.

Contexte resynchronisé (S13 puis S14) : `index.md` (S1-S14 cochées [x]), `TASKS.md` (D1-D14 [x] avec résumés de gate), `STATUS.md` (cette entrée), `DECISIONS.md`, `VALIDATION.md` (checklists visuelles mises à jour, statut « à valider par Thibault »). À compléter/revalider (Thibault) : **fréquences module 6** (ADA/HAS-SFD), **seuils module 4** (HbA1c/TA/LDL), **table CG/fibres/protéines/lipides module 2** (ordres de grandeur plausibles, révisée en S14), **phrases cliniques module 7** (8 classes, `// à revalider`), **illustrations diabete** (`design/illustrations/prompts-illustrations-diabete.html` → `public/illustrations/diabete/<id>.png`, convention d'ids dans `S1.md`).

## Phase actuelle (suite)

Phase 1 (squelette + 6 modules tabac) terminée. Phase 2 (corrections UX, `plans/PLAN_corrections-ux.md`) : C1-C9 faits, reste **C10** (bloqué sur contenu à fournir par Thibault). Phase 3 (`plans/PLAN_corrections-v2.md`, captures Thibault 2026-07-01) : R1-R9 faits. Phase 4 (`plans/corrections-v3/`) : V1-V8 faits. **Phase 5** (`plans/corrections-v4/`, audit Playwright 2026-07-01) : A1-A12 faits (12 correctifs UX). **Phase 6** (`plans/refonte-ui/`, refonte visuelle sur la maquette Claude Design, cf. `docs/DESIGN_REFONTE.md`) : S1-S10 + S2-S9 exécutés, T12 consolidation faite. Vague 1 (S1) : socle (fonts auto-hébergées, tokens oklch, primitives globales). Vague 2 (S10 + S2-S9 en parallèle) : restyle complète de tous les modules + réécriture logique des courbes (S4, S7). Résultat : palette crème/éditoriale, typographie Source Serif 4 / Work Sans, nouvelle grille de module 0–100 / 24 h. **Phase 7** (2026-07-08) : **introduction du moteur multi-thèmes**. Le thème tabac déménage sous `src/features/tabac/` (7 modules + `nicotineCurve.ts`, inchangés fonctionnellement), le moteur (`types.ts`, `registry.ts`, `src/components/`) devient générique (plus aucun id/nom de thème en dur), un écran `ThemeSelector` apparaît car un 2e thème `diabete` est scaffoldé (vide, `enConstruction: true`, badge « Bientôt disponible »). Le contenu clinique du diabète est en cours de cadrage avec Thibault (cf. `docs/diabete/00-global.md`) : 4 des 8 modules déjà spécifiés en détail (module, sources probantes brutes dans `docs/evidence-diabete/`), reste à finaliser avant transmission à Claude Design. **Phase 8** (`plans/extensions-tabac/`, brief Fable `docs/BRIEF_TABAC.md`) — **chantier initial clos le 2026-07-09
(X1-X7), complété le même jour par X8** (extension fiche patch demandée par Thibault hors brief initial)
: **X1** — socle générique `FicheOverlay` (aperçu A4 + impression) et CSS d'impression +
blocs typographiques de fiche, préalable bloquant aux 4 fiches concrètes (X2-X5) et au module « Mon plan
d'arrêt » (X5). **X2-X4** — les 3 fiches « Ma carte anti-envie » (Craving), « Ma méthode patch »
(Substituts), « Mes raisons » (Motivation), chacune via `FicheOverlay`. **X5** — nouveau module tabac
`plan-arret/` (8ᵉ module, famille Agir, `id: 'plan-arret'`) + sa fiche « Mon plan d'arrêt ». **X6** —
`ModuleFooterNav` générique (extrait de nicotine-toxique) câblé en pied de 6 modules (portes §3.3), fil
rouge « fumée / manque / ça se traite » posé en exergue d'accueil + clôture des 4 modules Comprendre +
pieds des 4 fiches (§3.4), composant `InfoHover` créé mais **non câblé** (aucune entrée du 2ᵉ niveau §3.5
validée par Thibault à ce stade, cf. §5 du brief — comportement attendu, confirmé encore vrai en X7).
**X7** — resynchronisation de `docs/contenu-modules-tabac.md`, `STATUS.md`, `PROJECT_MAP.md`, `TASKS.md`
sur l'état réel du code (aucun fichier `src/` modifié). X1-X6 codés mais **non commités** au moment de X7
(cf. `git status` — normal, contexte de session en cours). `tsc --noEmit` + `vite build` verts pour
l'ensemble ; `vitest run` (20 tests) vert.

## Phase actuelle (suite)

**Phase 9 (approfondissement-tabac)** — **Chantier multi-agents S1-S6 + consolidation S7 (2026-07-09/10)** :
Trois domaines d'amélioration du thème tabac lancés le 2026-07-09 pour approfondir la compréhension clinique :
1. **Courbes réalistes** (S3) : refonte du modèle `nicotineCurve.ts` pour refléter les ordres de grandeur
   pharmacologiques réels (demi-vie ≈ 2 h, pic cigarette < 10 min, patch 2-4 h, saturation/tolérance, tension
   du manque liée à la nicotinémie) tout en préservant la pédagogie des 3 zones. API gelée. 37 invariants testés
   → 78/78 tests verts (S3).
2. **Silhouette générique** (S2) : promotion du composant diabète en `src/components/SilhouetteCorps` générique
   (zones en données, états `actif`/`ouvert`/`allume`/`verrouille`/`masque`, motif vaisseaux optionnel) ; wrapper
   diabète en `src/features/diabete/components/Silhouette.tsx` iso-API (aucun module diabète ne change).
3. **Deux nouveaux modules tabac** (S1 socle, S5-S6 implémentation) :
   - **Module 9 — Ce que l'arrêt répare** (S5) : silhouette générique + frise de 10 jalons (20 min → 10-15 ans)
     rallumant le corps zone par zone — registre exclusivement positif (jamais l'organe malade). Famille Se motiver.
     Chiffres à revalider (source : Tabac Info Service / OMS).
   - **Module 10 — Vrai ou faux ?** (S6) : 15 cartes d'idées reçues, verdict factuel + nuancé + sourcé (livrées
     toutes actives, cartes 4/14/15 flaggées `// à revalider (Thibault)` pour revue clinique réelle avant
     usage en consultation). Famille Comprendre. Ton informatif, jamais culpabilisant.
4. **Prompts d'illustrations** (S4) : section « Tabac — bénéfices » (8 vignettes d'organes) + « Tabac — vrai/faux »
   (15 vignettes affirmations) dans `design/illustrations/prompts-illustrations-diabete.html` + nouveau style
   carré `tabacsq` (palette crème/kraft, format 1:1).

**Points à revalider par Thibault** (non bloquants pour S7, livrés avec la liasse de commits) :
- **Jalons S5** : chiffres et formulations (source Tabac Info Service / OMS, constantes commentées `// à revalider`).
- **Cartes sensibles S6** : vapoteuse (n° 14) et réduction (n° 15) — contenu marqué `// à revalider`, statut
  `actif: true` actuellement pour permettre revue réelle en usage. Retrait possible sans code change.
- **Carte S6 supplémentaire** : n° 4 « Quelques cigarettes » — marquée `// à revalider` sur la source, formulée
  sur Santé publique France (vérifier actualité).
- **Mention du graphe S3** : `NicotineModule.tsx` dispose d'une mention actualisée (« ordres de grandeur réels »)
  **derrière une constante avec `// à revalider (Thibault)`** ; l'ancienne mention reste par défaut.
- **Illustrations tabac** : PNG à générer selon les prompts S4 et déposer dans `public/illustrations/tabac/<id>.png`
  (piège C2PA/Inkscape : ré-encoder via Pillow ; convention d'ids dans `plans/approfondissement-tabac/S4.md`).

**Gate consolidation S7 (avant commit)** : `npx tsc --noEmit` ✓ · `npm run build` ✓ (1855 modules) ·
`npm test` ✓ (78/78 tests). Commits S1-S6 créés atomiquement (5 fichiers) + commit docs
(contenu-modules-tabac.md) + commit contexte (STATUS/TASKS/VALIDATION/PROJECT_MAP/DECISIONS/index.md).
Aucun push (attente validation orchestrateur).

## Phase actuelle (suite)

**Phase 10 (`plans/boite-a-outils/`)** — **Chantier vagues parallèles BO1-BO8 + consolidation BO9
(2026-07-10)**, issu du rapport OpenEvidence « stratégies comportementales du sevrage »
(`docs/evidence-tabac/2026-07-10-rapport-openevidence-sevrage.md`) :

1. **Fusion Craving → Stratégies & outils** (BO1-BO2) : le module `craving` disparaît du registre ;
   `boite-a-outils` prend sa place (famille agir, hue vigilance). L'outil vague/4D est déplacé (pas
   réécrit) dans `boite-a-outils/VagueCraving.tsx` — mécanique et fiche « Ma carte anti-envie »
   inchangées — et devient un outil parmi **14**, filtrables par situation (union : transverse, ou
   intersection avec les chips actives). Fiche « Ma boîte à outils » (nouvelle) composée des outils
   cochés. `src/features/tabac/craving/**` supprimé après déplacement du code.
2. **Contexte de navigation générique** (BO1) : `ModuleProps` gagne `context?: unknown` (moteur agnostique
   de sa forme) ; `App.tsx` le transporte dans l'historique. Réutilisable par tout thème futur.
3. **Refonte du module Composantes** (BO3) : `AddictionModule.tsx` devient une page de repérage pur —
   situations de `situations.ts` (20 situations, 3 piliers, partagées avec Stratégies & outils) en
   **menu radial sélectionnable**, aucune description ni solution à l'écran (narration = soignant), CTA
   contextuel unique « Stratégies et outils (n) » vers `boite-a-outils` avec la sélection en contexte.
4. **Vrai/faux enrichi** (BO4) : 6 nouvelles cartes (poids ×3, vapoteuse ×3) + reformulation de la carte
   faux pas + retarget des renvois `craving` → `boite-a-outils` — **21 cartes** au total (contre 15).
5. **Vapoteuse réintégrée dans les Substituts** (BO5) : 6ᵉ forme, badge « Réduction des risques »,
   encart de statut « pas un médicament » — revient partiellement sur le retrait du 2026-07-08.
6. **Plan d'arrêt — section « Si j'ai un écart »** (BO6) : 7ᵉ section (3 gestes de secours) + reprise
   sur la fiche imprimée + « Vapoteuse » ajoutée aux chips substituts.
7. **Prompts d'illustrations** (BO7) : section « Tabac — Stratégies & outils » (14 outils + vapoteuse)
   dans `design/illustrations/prompts-illustrations-diabete.html`.
8. **Diabète/Activité — filtre « toniques uniquement »** (BO8) : interrupteur qui masque les activités
   légères de la **réserve** sans jamais retirer un choix déjà placé dans la jauge.

**Points à revalider par Thibault** (non bloquants, livrés avec la liasse de commits) :
- **Vapoteuse (Substituts, BO5)** : technique d'utilisation rédigée par Fable (HAS/HCSP + rapport OE).
- **11 des 21 cartes Vrai/faux** (BO4) : sources internationales (NEJM, Cochrane 2025, ACC, JAMA) ou
  Santé publique France, en attendant un équivalent HAS/Tabac Info Service.
- **Formulations patient des 14 outils** (BO2) : adaptées du rapport OE — à juger à l'usage.
- **Occurrences résiduelles du mot « craving »** hors zone de tout `S<k>.md` de ce chantier (non
  corrigées, signalées) : `src/features/registry.ts` (description libre du thème, signalé dès BO1),
  `nicotine/NicotineModule.tsx` (libellé texte, pas un id de navigation), `plan-arret/PlanArretModule.tsx`
  (commentaire de code référençant l'ancien chemin `craving/`, signalé dès BO2). Détail dans
  `DECISIONS.md` (2026-07-10, points ouverts).
- **Illustrations tabac (BO7)** : 15 PNG à générer (14 outils + vapoteuse) et déposer dans
  `public/illustrations/tabac/<id>.png`.

**Gate consolidation BO9 (avant commit)** : `npx tsc --noEmit` ✓ · `npm run build` ✓ · `npm test` ✓.
Commits BO1-BO8 créés atomiquement (par tâche) + commit contexte
(docs/STATUS/TASKS/VALIDATION/PROJECT_MAP/DECISIONS/index.md). Aucun push (attente validation Thibault).

## Phase actuelle (suite)

**Phase 11 (`plans/illustrations-diabete/`)** — **S1 : pipeline d'assets + silhouette partagée
`bodyImage`/hotspots (2026-07-10)**, premier virage « illustration-driven » du thème diabète
(abandon de la vectorisation, cf. `index.md` §1) :

1. **`design/illustrations/build_assets.py`** (outil local Pillow+numpy, hors `package.json`) :
   `build_opaque`/`build_transparent` — ré-encodage (élimine les chunks C2PA), recadrage optionnel,
   flood-fill de transparence (8 points de bord, seuil 42, préserve l'intérieur clair fermé),
   **palette adaptative 256 couleurs** (RGB seul pour les overlays, alpha préservé en pleine
   résolution) pour tenir sous ~90 Ko/asset — les illustrations sources étant en aplats, la perte est
   visuellement nulle (vérifié à l'œil sur chaque sortie).
2. **7 assets déposés** dans `public/illustrations/diabete/` : `silhouette.png` (26 Ko, opaque),
   `organe-yeux.png` (39 Ko), `organe-reins.png` (38 Ko), `organe-nerfs.png` (62 Ko),
   `pied-auto-examen.png` (50 Ko), `plaque.png` (36 Ko), `artere-saine.png` (73 Ko).
3. **`SilhouetteCorps.tsx`** (générique) : nouvelle prop `bodyImage?string` — si fournie, le
   conteneur passe en carré (1:1), rend `<img>` au lieu du corps SVG codé, et les zones basculent en
   **mode hotspot** (bouton transparent, halo radial doux au survol/actif — `--color-nav-soft` puis
   `--color-confort-soft` si ouvert/allumé —, **aucun cercle ni icône permanents**). Sans `bodyImage`,
   rendu strictement inchangé (corps SVG + pastilles pleines, tabac intact).
4. **Wrapper diabète (`Silhouette.tsx`)** : passe `bodyImage={silhouette.png}` ; `SILHOUETTE_ANCHORS`
   recalibrées en **pourcentages de l'image carrée** (repère différent du pixel `SILHOUETTE_VIEWBOX`
   340×760 utilisé par le corps codé tabac), valeurs de l'index §7 — le nerf est positionné sur la
   main (validé au prototypage). `RisqueCardioModule.tsx` (M4) ajusté en conséquence pour son overlay
   plaque existant (positionnement seulement — le recâblage complet de la plaque en illustration reste
   S3).

**Points à revalider par Thibault** (non bloquants) : alignement fin des hotspots sur les organes de
l'illustration (validation visuelle humaine, `npm run dev`, cf. `VALIDATION.md`) ; le recâblage réel
des modules M4/M5/M7 (overlays, panneaux) reste à faire en S2/S3/S5.

**Gate S1** : `npx tsc --noEmit` ✓ · `npm run build` ✓ · `npm test` ✓ (78/78 tests, aucune régression).

**S2 (2026-07-10) — M5 Complications** : `ComplicationsModule.tsx` affiche désormais l'illustration de
l'organe (`organe-yeux/reins/nerfs.png` ou `pied-auto-examen.png`) en tête du panneau détail, à côté du
titre (104 px, cadre doux `--color-bg`/bordure fine — `.organeHead` dans le CSS module), pour les 4
organes explorables (yeux/reins/nerfs/pied) ; cœur/cerveau restent verrouillés, inchangés. Aucune
donnée texte modifiée (`complications/data.ts` intact) ; `SignatureEvitable` reste codé. Gate :
`tsc --noEmit` ✓ · `npm run build` ✓ · `npm test` ✓ (78/78).

**S3 (2026-07-10) — M4 Risque cardiovasculaire** :
- **`PlaqueArtere.tsx` réécrit** : ne dessine plus le vaisseau (paroi/lumière codées) mais **seulement
  le dépôt qui grossit** (une ellipse transparente, même courbe `pot = encrassement^0.75` et mêmes
  paliers de teinte qu'avant), destinée à être posée en overlay sur une illustration. Nouvel export pur
  `plaquePassagePct(encrassement)` (% de lumière ouverte, indépendant du tracé).
- **Vue ② « L'artère »** : le vaisseau codé est remplacé par `artere-saine.png` (S1) en fond, avec
  `PlaqueArtere` en overlay absolu (`.artereOverlay`, rotation ≈ -25° calée sur l'axe de l'illustration
  par analyse PCA des pixels non transparents) qui grossit par-dessus. Le texte « Passage du sang : X % »
  reste affiché sous l'image (`plaquePassagePct`).
- **Vue ③ « L'anatomie »** : les pastilles de plaque codées (variante `pastille` de `PlaqueArtere`,
  supprimée) sont remplacées par l'image `plaque.png` (26×26 px, transparente), positionnée et pivotée
  par territoire (`PLAQUE_OVERLAYS` : cou 50/17 rot 90°, cœur 49/26 rot 0°, jambes 46/63 rot 90° —
  index illustrations-diabete §7) directement sur la silhouette `bodyImage`.
- **5 feux → lucide** : `IllustrationSlot` remplacé par `Droplet`/`Gauge`/`Droplets`/`Cigarette`/
  `Armchair` dans un cadre circulaire neutre (`--color-bg`/bordure, icône `--color-nav`) — la
  sémantique vert/ambre/rouge de l'état reste portée par la carte (bordure + bouton d'état), jamais par
  l'icône elle-même, conformément au garde-fou du plan.

⚠️ Point à revalider visuellement (Thibault, `npm run dev`) : l'alignement précis de la plaque overlay
(vue ②, angle/position) et des pastilles `plaque.png` (vue ③) sur l'illustration — calculs faits par
analyse d'image hors navigateur, jamais vérifiés à l'écran par Claude (règle projet). Un ajustement de
coordonnées (`.artereOverlay` en %, `PLAQUE_OVERLAYS` en %) peut être nécessaire après cette revue.

Gate S3 : `tsc --noEmit` ✓ · `npm run build` ✓ · `npm test` ✓ (78/78).

**S4 (2026-07-10) — M1 Mécanisme** : `MecanismeModule.tsx` réécrit en intégralité (remplace le
wizard codé 4-temps/5-cellules par une **animation illustration-driven à 4 modes**, contrôle **par
cellule** — 3 cellules, pas 5), portée fidèlement du prototype validé `proto-m1-anim2.html` :
- **Sélecteur de mode** (Sans diabète / Insulinopénie / Insulinorésistance / Mixte) persistant, pas
  de navigation linéaire next/prev.
- **Boucle de 3 phases** (400 → 1600 → 2700 ms, relance à 4900 ms) : clés qui partent du pancréas
  vers les serrures → serrures qui réagissent (ouverte/fermée/rouillée, images crossfadées) →
  sucre qui se dépose ou se vide dans une artère codée sous les cellules (jetons `sugar.png`,
  8 max, libellé tricolore confort/vigilance/toxique).
- **6 nouveaux assets** (`design/illustrations/build_assets.py` étendu, table `ASSETS` avec
  support multi-dossier source `base=` pour les régénérations 2026-07-11 à la racine de
  Downloads) : `cell-closed/open/rusty.png`, `key.png`, `sugar.png`, `pancreas.png` (recadré
  moitié haute « en forme »).
- **`prefers-reduced-motion`** : un hook dédié (`usePrefersReducedMotion`) coupe la boucle de
  `setTimeout` et affiche directement l'état final du mode (clés insérées visibles, pas
  invisibles) — la neutralisation CSS globale seule ne suffisait pas ici (elle accélère les
  transitions mais la scène aurait continué à changer d'état toutes les ~1 s).
- **Option écartée** : l'artère sous les cellules reste la **barre codée** (comme le prototype
  validé), pas `artere-saine.png` étirée — l'idée (notée « à tester » dans le plan) n'a pas été
  retenue faute de pouvoir A/B tester visuellement (pas de navigateur côté Claude) ; l'illustration
  compacte du M4 risquait de se déformer sur une largeur ~4× plus grande que sa proportion native.

⚠️ Point à revalider visuellement (Thibault, `npm run dev`) : positions/rotations des clés
volantes et proportions de la scène (boîte de référence 1060×340 en %, jamais vérifiée à l'écran).

Gate S4 : `tsc --noEmit` ✓ · `npm run build` ✓ · `npm test` ✓ (78/78).

**S5 (2026-07-10) — M7 Traitements** : **vérification, aucun code modifié**. `TraitementsModule.tsx`
consommait déjà `Silhouette` sans coordonnées en dur ; depuis S1 le wrapper diabète passe
systématiquement `bodyImage`, donc M7 affichait déjà la silhouette-image + hotspots sans recâblage.
Confirmé : cœur/reins `allume` (halo confort) selon la ligne d'ordonnance sélectionnée, 6 autres
zones `masque`, halo « sucre » CSS existant compatible avec le conteneur carré, pictos déjà lucide.

**S6 (2026-07-10) — M6 Suivi** : les 9 icônes de station du cadran (`suivi-stethoscope`,
`suivi-prise-de-sang`, `suivi-organe-<protects>` ×7) passent d'`IllustrationSlot` (jamais générées)
à un composant local `StationIcon` — lucide dans un cadre circulaire/arrondi neutre (`--color-bg`/
bordure, icône `--color-nav`), aux 3 tailles déjà utilisées (34/38/44 px cadran+panneau, 160 px
porte « Ce que ça garde »). Mapping : stéthoscope/prise de sang/vaisseaux/cœur/yeux/défenses
(index §4) + **pied → `Footprints`** (non listé dans le plan, ajout évident) + **rein → reste
l'image `organe-reins.png`** (S1, seule exception « tout lucide », lucide n'a pas de rein) +
**dentiste (protège « bouche ») → `Smile`** (décidé). `IllustrationSlot` n'est plus importé dans
ce module ; le cadran, l'aiguille et le centre (motif fil rouge) restent codés (inchangés).

⚠️ Écart mineur au libellé du plan : « vaccins → Syringe » est repris tel quel pour la clé
`defenses` (le seul examen protégeant les « défenses immunitaires » est justement Vaccins dans le
code actuel — une seule icône, pas deux) — préféré à `ShieldPlus` (aussi suggéré) pour rester
littéral avec l'exam concret que voit le patient. Détail dans `DECISIONS.md`.

Gate S6 : `tsc --noEmit` ✓ · `npm run build` ✓ · `npm test` ✓ (78/78).

**S7 (2026-07-10) — Vignettes M2/M3/M8, chantier illustrations-diabete clos** : lot quasi complet
de sources retrouvé dans Downloads (généré côté Thibault en parallèle des sessions S1-S6) —
**62 nouvelles vignettes** déposées via `build_assets.py` (table étendue à 75 entrées au total) :
- **M2 Alimentation** (33) : les 28 aliments déjà en données + **5 nouveaux** ajoutés à
  `alimentation/data.ts` (`pates-blanches`, `pates-completes`, `couscous-complet`,
  `banane-plantain`, `haricots-rouges`, famille féculents, `// à revalider (Thibault)`) — seuils
  du défi ② (`PEAK_BAS_MAX`/`PEAK_HAUT_MIN`) non affectés (constantes indépendantes du nombre
  d'aliments, comme pour l'ajout oméga-3 C4).
- **M3 Activité physique** (18) : centre + 4 rayons + les 12 activités existantes + **`sol`**
  (« Se relever du sol », ajouté à `activite/data.ts`).
- **M8 Hypoglycémie** (11) : les 7 signes + 4 resucrages, aucune donnée à ajouter (ids déjà présents).

Échantillon relu à l'œil (légumineuses texturées lentilles/haricots rouges, huile d'olive, figure
activité, signe, resucrage) : flood-fill propre, aucune perte de détail, poids raisonnable (22-140
Ko, quelques assets riches en couleurs — pâtes complètes 131 Ko, couscous complet 140 Ko —
légèrement au-dessus de la cible ~90 Ko mais non bloquant). `public/illustrations/diabete/` compte
désormais **75 fichiers**. Session marquée récurrente dans l'index (§8) : à rouvrir à chaque futur
lot de vignettes.

Gate S7 : `tsc --noEmit` ✓ · `npm run build` ✓ · `npm test` ✓ (78/78, y compris `glycemieCurve.test.ts`
inchangé malgré les 5 nouveaux aliments).

**Chantier `illustrations-diabete` (S1-S7) clos ce jour** — voir `plans/illustrations-diabete/`
pour le détail complet. Points ouverts non bloquants : alignement visuel de la plaque overlay (S3)
et des clés volantes (S4) jamais vérifié à l'écran par Claude ; toutes les valeurs nutritionnelles
`// à revalider (Thibault)`.

## Phase actuelle (suite)

**Phase 12 (`plans/corrections-visuelles-diabete/`)** — **Chantier de correction visuelle en cours
(2026-07-11)**, issu de la revue de Thibault sur le déployé (13 captures annotées → 5 causes-racines :
A silhouette trop petite/halo invisible, B courbe glycémie peu lisible, C mise en page petite/vide/
débordante, D trop de texte, E cercle blanc Activité). Mode solo (Sonnet), 8 sessions S1-S8, commits +
push groupés en fin de plan (cf. `index.md`).

- **S1 (2026-07-11) — Silhouette partagée** : mode hotspot (`bodyImage`) de `SilhouetteCorps` agrandi
  (`.wrapImage` 340→460px max-width), halo « allumé » franc (anneau plein `--color-confort` +
  `box-shadow` + `scale(1.05)`, `prefers-reduced-motion` neutralisé) + anneau pointillé discret au
  repos (découvrabilité). Zones `verrouille` restent cliquables en mode hotspot (ouvrent leur panneau
  « déjà vu ») — seul le mode pastille (tabac) garde `disabled`. Traitements/Complications/Risque
  cardio ③ : silhouette portée à ~400-420px, boutons/chips organe redondants retirés (sélection
  directe sur la silhouette). Gate : `tsc --noEmit` ✓ · `npm run build` ✓ · `npm test` ✓ (78/78).
  Visuel → `VALIDATION.md` §Corrections visuelles diabète.

- **S2 (2026-07-11) — Courbe glycémie** : `glycemieCurve.ts` désaturé conjointement
  (`K_CHARGE` 60→20, `K_FREIN` 6→20, `K_RETARD` 5→14 — baisser `K_CHARGE` seul aurait laissé
  le frein cumulé rattraper le gain de charge) + effet d'ordre amplifié (`ORDRE_FREIN_BONUS`
  0.45→0.6, `ORDRE_RETARD_BONUS` 0.35→0.5) : un féculent seul culmine désormais ~80/100, trois
  cumulés ~90/100 (contre ~55/67 avant). `bandeToY` déplacé de `insuline/scenarios.ts` vers
  `CourbeGlycemie.tsx` (export générique `levelMax` par défaut 100) et câblé en bande-cible sur
  toutes les courbes du module 2. Défi ① : fantôme « féculents seuls » visible dès ≥1 féculent
  (sauf assiette 100% féculents). Défi ④ : nouvelle courbe fantôme « féculents seuls ». Défi ③ :
  libellés explicites premier/milieu/dernier. `PEAK_BAS_MAX`/`PEAK_HAUT_MIN` (défi ②)
  recalibrés (47/50 → 55/74) par ré-échantillonnage du garde-manger complet (33 aliments) — les
  4 duels du brief (baguette/pain complet, riz blanc/basmati, riz blanc/lentilles,
  dattes/pastèque) donnent désormais des tiers différenciés. 2 tests ajoutés (pic 3 féculents >
  1 seul ; delta ordre ≥ 15). Gate : `tsc --noEmit` ✓ · `npm run build` ✓ · `npm test` ✓ (80/80).
  Visuel → `VALIDATION.md` §Corrections visuelles diabète (amplitudes `// à revalider`).

- **S3 (2026-07-11) — Layout Alimentation** : passe purement dimensionnelle (aucune logique
  touchée) sur `AlimentationModule.module.css`/`.tsx` — assiette défi ① 300→400px, cartes défi
  ② 320→380px (réparties `space-around` au lieu de `center`), bouchées défi ③ 150→190px
  (`space-around`), camembert défi ④ 240→300px, vignettes garde-manger 92→104px, jetons
  synthèse 100→120px ; 5 tailles `size={}` d'`IllustrationSlot` relevées en proportion. Gate :
  `tsc --noEmit` ✓ · `npm run build` ✓ · `npm test` ✓ (80/80). Visuel → `VALIDATION.md`.

- **S4 (2026-07-11) — Suivi Parcours** : `.parcours` toujours empilé (fin du côte-à-côte
  `flex-direction: row` ≥860px, qui débordait à droite, capture #3) ; `consultRow`/`examRow`
  réduits à 4-5 zones lisibles (`icône+nom` · `un seul stepper de fréquence` · `statut` ·
  `Placer sur le cadran`), les groupes de chips de fréquences (3 puis 4 boutons) remplacés par
  un stepper `‹ valeur ›` (`cycleValue`) ; polices relevées ≥14px partout (`examProtects`
  10→14, `stepper span` 12→15, `examStatus` 12→15) ; bouton dédié « Ce que ça garde » retiré,
  son rôle repris par l'icône de ligne (devenue cliquable). Le réglage fin du mois de départ
  (steppers `STEP_CONSULT_START`/`STEP_EXAM_MONTH`) est retiré avec son UI — décision
  documentée dans `DECISIONS.md`. Gate : `tsc --noEmit` ✓ · `npm run build` ✓ · `npm test` ✓
  (80/80). Visuel → `VALIDATION.md`.

- **S5 (2026-07-11) — Activité ① Rayonnement** : le nœud n'est plus un disque crème qui
  écrase l'image (capture #4) — `.node` devient un simple point d'ancrage (position +
  `aspect-ratio` carré, préservé pour ne pas décaler le centrage), `.nodeButton` porte
  l'anneau d'état (`overflow: hidden`, bordure repos/allumé/sucre) et l'image plein cadre
  (44→104px rayons, 56→128px centre) ; label/hint/suite regroupés dans un nouveau bloc
  `.nodeBelow` positionné sous le cercle (n'agrandit plus la boîte centrée). Nœud centre
  restructuré en `<div>` (ancrage) + `<button>` interne (clic), au lieu d'un seul élément
  combinant les deux. Gate : `tsc --noEmit` ✓ · `npm run build` ✓ · `npm test` ✓ (80/80).
  Visuel → `VALIDATION.md`.

- **S6 (2026-07-11) — Mécanisme, option B** : la boucle auto-relancée (relance à 4900ms,
  ~2,2s de tenue sur l'état final, capture #11) devient une séquence jouée **une fois**
  (500→2000→3400ms) puis figée sur l'état final indéfiniment ; bouton « Rejouer » sous la
  légende (masqué si `prefers-reduced-motion`), nouveau state `replayKey` pour permettre de
  relancer même en recliquant le mode déjà actif. Décision (option B vs A) documentée dans
  `DECISIONS.md`. Gate : `tsc --noEmit` ✓ · `npm run build` ✓ · `npm test` ✓ (80/80).
  Visuel → `VALIDATION.md`.

- **S7 (2026-07-11) — Plaque d'athérome en croissant** : `PlaqueArtere.tsx` remplace l'ellipse
  centrée (blob flottant, capture #13) par un dépôt en **croissant** collé à la paroi
  (`crescentPath`, Bézier quadratique plate aux extrémités, bombée au centre), 2ᵉ dépôt sur la
  paroi opposée à `encrassement > 0.5` (rétrécissement bilatéral). Même courbe de croissance
  (`pot = encrassement^0.75`), mêmes paliers de teinte, `plaquePassagePct` non modifiée (la
  profondeur du croissant dérive de la même formule pour rester cohérente avec le texte
  affiché). ⚠️ Alignement dans la lumière de `artere-saine.png` jamais vérifié à l'écran
  (`.artereOverlay` laissé inchangé, déjà calé en S3 illustrations-diabete). Gate :
  `tsc --noEmit` ✓ · `npm run build` ✓ · `npm test` ✓ (80/80). Visuel → `VALIDATION.md`.

- **S8 (2026-07-11) — Passe « moins de texte » agressive (9 modules)** : intros/consignes de
  tête de module, bandes de légende explicatives en bas d'écran et hints redondants retirés
  sur les 9 modules diabète, selon la règle de tri du plan (coupe l'ambiant, garde les
  eyebrows courts et tout texte sortie d'une interaction). Onglet ③ Insuline renommé
  `'③ Décider'` (était `'③ 2 situations'`, trompeur — la carte ① a 3 chips). Bundle JS réduit
  (459,9→455,0 kB) sans perte de fonctionnalité. Détail des 9 modules et des textes
  coupés/gardés dans `plans/corrections-visuelles-diabete/S8.md` et `DECISIONS.md`. Gate :
  `tsc --noEmit` ✓ · `npm run build` ✓ · `npm test` ✓ (80/80). Visuel → `VALIDATION.md`.

**Chantier `corrections-visuelles-diabete` (S1-S8) clos ce jour** — voir
`plans/corrections-visuelles-diabete/` pour le détail complet. Points ouverts non bloquants
(validation visuelle humaine requise, `npm run dev`) : intensité du halo « allumé » de la
silhouette (S1), amplitudes de la courbe glycémie et seuils du défi ② (S2), alignement de la
plaque d'athérome dans la lumière de l'artère (S7).

## Phase 12 (suite) — 2ᵉ tour (`plans/corrections-visuelles-diabete-v2/`)

**Chantier `corrections-visuelles-diabete-v2` (2026-07-11)** — 2ᵉ revue visuelle de Thibault sur
le déployé, par-dessus S1-S8 ci-dessus (déjà committés) : le tour 1 a atterri mais reste
**insuffisant** sur les tailles (« encore trop petite »), + nouveaux points (feux cardio, Suivi
side-by-side, dégraissage Insuline). Mode solo (Sonnet), 6 sessions S1-S6, commits par tâche en
fin de plan, push en attente de validation Thibault.

- **S1-v2** — Silhouettes vraiment dominantes : `.wrapImage` 460→640px (composant partagé
  `SilhouetteCorps`), hosts Traitements/Complications/Risque cardio ③ 420/400/400→560px.
  Traitements : le panneau texte (eyebrow + carte) disparaît entièrement tant qu'aucune ligne
  n'est sélectionnée, au lieu de garder une phrase de guidage ambiante. Risque cardio ③ :
  correction de bug — la plaque (`plaque.png`) se déposait sur les 3 territoires dès qu'un feu
  passait au rouge au lieu du seul territoire sélectionné (`zoneActive`).
- **S2-v2** — Feux cardio : `feuIconFrame` devient le `<button>` cliquable (icône colorée par
  état + bordure d'épaisseur croissante 2/3/4px selon vert/orange/rouge, repère non
  chromatique), bouton texte séparé retiré. Artère : dépôt bilatéral recalibré
  (`oppositeDepthFactor(e) = 0.5 + 0.5·e`, continu au seuil existant) pour qu'au score max la
  lumière visuelle corresponde enfin aux ~30 % déjà annoncés par `plaquePassagePct`.
- **S3-v2** — Suivi : repasse en côte-à-côte (`flex-direction: row` ≥860px, l'inverse du tour 1
  S4) ; lignes d'examen dégraissées (libellés de fréquence raccourcis, colonne « statut » texte
  → pastille compacte `examStatusDot`) pour tenir dans la demi-largeur ; boutons « Placer/Retirer
  du cadran » → icône Lucide `MapPin`/`MapPinOff` (`aria-label` complet conservé).
- **S4-v2** — Insuline : l'onglet ① Zone-cible disparaît, remplacé par un toggle de profil
  permanent près de la courbe (2 onglets restants renumérotés ①/②) ; narration retirée (titre du
  graphique raccourci, bloc `.caption` supprimé) ; barre TIR cantonnée à l'onglet ② Décider ;
  titre trompeur retiré de la carte des 3 situations (présentées à plat).
- **S5-v2** — Activité : `.rayonWrap` 480→640px (icônes 104/128→140/176px en proportion) ;
  débordement de la grille Volume corrigé (cause identifiée : grid `auto-fill` dans un enfant
  flex sans `min-width: 0`, blowout classique) ; rythme visuel introduit (cartes « modérée »
  légèrement plus grandes) ; micro-coupures 30→44px.
- **S6-v2** — Alimentation : passe défensive sur défis ②/③ (largeurs fixes redondantes avec
  `flex-basis` retirées, `min-width: 0`) — mécanisme exact du débordement **non confirmé** par
  analyse statique (pas de navigateur côté Claude), signalé comme point prioritaire à revalider.
  LA COURBE : plancher partagé `min-width: 440px` posé dans `CourbeGlycemie.module.css` (profite
  aux 4 modules consommateurs sans duplication) + plafond Alimentation 760→900px.

**Points ouverts** (non bloquants sauf mention contraire) : tailles cibles exactes « à caler à
l'œil » par décision Thibault (silhouettes/courbe/rayonnement, cf. index v2 §4) ; **S3-v2 et
S6-v2 portent chacun un critère explicitement bloqué du plan** (non-débordement à 1024×768) non
vérifiable par Claude — priorité de revue à `npm run dev`.

## Phase 13 — 3ᵉ tour (`plans/corrections-visuelles-diabete-v3/`)

**Chantier `corrections-visuelles-diabete-v3` (2026-07-11)** — 3ᵉ revue, cette fois un audit
visuel réalisé dans Chrome sur le déployé, par-dessus le tour 2 (déjà déployé) : quand l'audit
pointe un défaut que le tour 2 prétendait corriger, c'est que le correctif tour 2 est
visuellement inopérant (cas le plus net : bug Bézier de la plaque d'artère, jamais identifié par
le tour 2). Décisions Thibault tranchées avant rédaction : retrait total de `ModuleFooterNav`
(diabète + tabac), refonte du chrome diabète (onglets sur la ligne du titre + contenu élargi),
nouveau module « Insuline rapide (pré-prandial) ». Mode solo (Sonnet), 10 sessions S1-S10,
commits par tâche en fin de plan.

- **S1-v3** — Fondation chrome diabète : `ModuleShell` gagne 2 props génériques `nav`/`wide`
  (aucun thème en dur). Contrainte découverte en cours de route : les modules diabète ne
  rendaient pas eux-mêmes `ModuleShell` (c'était `App.tsx` qui les enveloppait) — pour remonter
  chaque barre d'onglets dans le slot `nav` du header, `ModuleDef` gagne un flag générique
  `rendersOwnShell` qui fait qu'`App.tsx` délègue le rendu du shell au module (reçoit
  `titre`/`sources`/`onBack` via `ModuleProps.shell`). Câblé sur les 9 modules diabète ; le tabac
  ne passe jamais ce flag → chemin `App.tsx` historique strictement inchangé. 6 des 9 modules
  (risque-cardio, alimentation, suivi, hypoglycemie, insuline, activite) remontent leur barre
  d'onglets dans `nav` ; les 3 autres (mecanisme, complications, traitements) gardent leur
  contrôle interne, profitent seulement de `wide`.
- **S2-v3** — Retrait total de `ModuleFooterNav` (composant + CSS supprimés), 17 usages (9
  diabète + 8 tabac). Décision Thibault : le parcours repasse exclusivement par l'accueil/carte.
- **S3-v3** — Risque cardio : feux 3/2 (`.feuxRow` plafonnée) ; **bug Bézier de la plaque
  d'artère identifié et corrigé** (le point de contrôle de la Bézier quadratique était utilisé à
  la place de l'apex réel, divisant la profondeur visuelle du dépôt par deux — jamais détecté par
  le tour 2, qui n'avait corrigé que la symétrie des deux dépôts) ; pin découplé de l'état des
  feux (silhouette, vue anatomie) ; texte de résultat agrandi et repositionné à côté de la
  silhouette sur écran large.
- **S4-v3** — Alimentation : LA COURBE (résultat clé) sort de `.stage` et passe pleine largeur
  sous shelf/assiette (5 appels `CourbeSection` regroupés en un seul emplacement, gardes
  conservées) ; Qualité (2 cartes) et Ordre (3 cartes) recalibrés pour tenir sur une ligne
  (`min-width:0` seul, posé au tour 2, était inopérant — `flex-wrap` décide sur la `flex-basis`
  déclarée, pas la taille rétrécie) ; assiette du défi ① réduite 400→320px avec chips
  proportionnellement réduits pour continuer à contenir les 10 aliments max sans déborder.
- **S5-v3** — Activité ② Volume : grille enfin « dé-grillée » (v2 n'avait ajouté que
  `align-items:start`, jamais changé la structure) — `.volumeLayout` passe en colonne (grille
  pleine largeur au-dessus, total en bandeau horizontal dessous) au lieu de côte-à-côte, ce qui
  rendait la grille étroite (3-4 colonnes pour 13 activités → 4-5 rangées, débordement).
  Cartes compactées (padding, bump « modérée » retiré, `.checkMark` sorti du flux, steppers
  24px avec cible tactile 44×44 via `::before` invisible).
- **S6-v3** — Suivi ① Parcours : `.dialWrap` 480→560px (v2 le rétrécissait à 420px dès le
  côte-à-côte, contre-intuitif) ; `.examList` perd `max-height`/`overflow` (cause du double
  scroll) ; breakpoint `.parcours`/`.panel` remonté 860→1200px (empilé plus longtemps = cadran
  ET examens à pleine largeur, résout littéralement les deux objectifs à la fois).
- **S7-v3** — Traitements : `.grid` colonne gauche élargie (460→640px max) pour arrêter de
  tronquer nom de molécule/classe ; nouvel axe `data.ts.picto` (`'serrure' | 'cle'`, optionnel)
  reliant chaque classe de traitement à la métaphore du module Mécanisme, affiché en pastille
  verte (Lock/KeyRound) dans le panneau d'effet en mode ligne. **Classement iDPP4/aGLP1 en
  « sécrétion » à valider cliniquement par Thibault** (marqué `// à revalider` dans `data.ts`).
- **S8-v3** — Hypoglycémie : bug corrigé — le preview « Mes signes précoces » n'affichait que le
  dernier signe cliqué (état séparé `lastSigneClicked`, jamais vidé à la désélection) au lieu de
  tous les signes sélectionnés. Preview relié à `mySignes` (déjà calculée, jamais utilisée ici) ;
  état mort supprimé.
- **S9-v3** — Insuline : retrait propre de la barre « Temps dans la cible » (onglet ② Décider,
  jugée sans intérêt). `tempsDansCible` (`lib/glycemieCurve.ts`) et son test conservés
  (fonction encore couverte par `glycemieCurve.test.ts`), juste plus référencée depuis le
  module.
- **S10-v3 (bloquée)** — Nouveau module « Insuline rapide (pré-prandial) » : contenu désormais
  **sourcé** (`docs/diabete/10-insuline-rapide.md`). Décisions Thibault du 2026-07-11 : périmètre
  **DT2** basal-bolus, déroulé en **4 temps** (dont timing d'injection et cumul de bolus). §5
  réécrit avec les **sources OpenEvidence** (ADA 2026 §9/§5/§7, consensus ADA/EASD, AACE, Endocrine
  Society ; essais DT2 : Bergenstal 2008, Christensen 2021, PRONTO-T2D, TeleDiab-2 ; timing :
  Slattery 2018, Luijf 2010 ; cumul : Heise & Meneghini 2014, Walsh 2014). Aucune ligne de code
  écrite (garde-fou du plan). **Reste la relecture finale du contenu par Thibault** avant que
  l'implémentation démarre — dernier verrou.

**Chantier `corrections-visuelles-diabete-v3` : S1-S9 faites et gates verts (2026-07-11) ; S10
bloquée en attente de validation de contenu par Thibault — c'est la seule session encore
ouverte.**

## Phase 14 (`plans/audit-diabete/`)

**Chantier `audit-diabete` (S1-S6, 2026-07-12)** — 12 points d'un audit manuel de Thibault sur le
déployé (`Audit/audit-etp-interactif.md`, sélecteurs DOM), par-dessus le chantier
`corrections-visuelles-diabete-v3` déjà déployé. Trois natures de travail : allègement/mise en page
(Cardio, Alimentation), réutilisation de composant existant (illustrations Hypo), et passage d'un
affichage figé à un **système d'expérimentation** sur la famille Insuline (le patient manipule un
réglage — dose, moment, délai — et voit l'effet en direct sur la courbe, plutôt qu'une réponse
pré-écrite). Mode vague parallèle (S1-S5, zones disjointes) puis S6 solo (transversal, après
S1 + S3). 6 sessions, 11 tâches (T1-T11), commits/push en fin de plan.

- **S1 — Risque cardio** (T1-T2, audit #2-3) : fusion « ① Les leviers » dans « ② L'artère » →
  « ① Les facteurs de risque » (icônes lucide portées sur les chips, tooltip de seuils reporté) ;
  retrait des 3 textes explicatifs sous l'artère (sur-titre, compteur « Passage du sang : X % »,
  message d'état — narration désormais orale, seuls l'image et l'overlay de plaque restent).
- **S2 — Hypoglycémie** (T3, audit #8) : le bloc « Mes signes » de la carte-réflexe (temps ③)
  affiche désormais les illustrations des signes (motif `previewItem` du temps ①, `size={64}`,
  nouvelles classes `.cartePreview`/`.cartePreviewItem`) au lieu de chips texte-seul ; la fiche
  imprimable garde ses chips texte (hors périmètre, inchangée).
- **S3 — Alimentation** (T4-T7, audit #4-7) : la carte « Glycémie après le repas » sort de sous
  `.layout` et vit désormais **dans la colonne de chaque défi** (`.stage`), agrandie (`.courbeCard`
  passe de 900px centré à `width:100%`), visible sans scroll — corrige d'un coup les 4 points
  structurels de l'audit. Composition : compteur retiré, reset en icône, assiette agrandie
  (320→400px). Qualité : rangée de duels + verdicts textuels retirés (seul le badge « Pic … »
  reste), reset en icône. Ordre/Repas complet : vérifiés par lecture de code, aucune retouche
  supplémentaire jugée nécessaire au-delà de T4.
- **S4 — Insuline « Décider »** (T8, audit #9) : le réglage de la lente devient expérimentable —
  3 boutons (Baisser/Laisser pareil/Monter) après le choix d'une situation, qui sélectionnent un
  scénario existant (`ScenarioTrace`, table de correspondance `AJUSTEMENT_RESULT` dans
  `scenarios.ts`) et font réagir en direct la courbe des nuits suivantes + la flèche de tendance.
  `glycemieCurve.ts` non touché (scénarios déjà existants réutilisés).
- **S5 — Insuline rapide** (T9-T10, audit #10-12) : onglet ③, l'écart de glycémie de départ
  (Basse/Cible/Haute) **se résorbe** désormais (`DEPART_RESORPTION`, forme convergente au lieu d'un
  décalage constant), avec une correction de rapide expérimentable qui ramène la courbe « Haute »
  dans la cible. Onglet ④, la matrice de cumul (2 situations × 3 recorrections, 6 cases) est
  entièrement expérimentable — **3 tentatives de modélisation** ont été nécessaires (2 rejetées par
  preuve numérique — grid search exhaustif —, cf. `DECISIONS.md` 2026-07-12 pour le détail) avant
  qu'un mécanisme d'excès de glycémie persistant, résorbé par l'insuline encore active (IOB) de la
  1ʳᵉ dose (proposé et vérifié numériquement par le modèle Fable sollicité spécifiquement pour cette
  réflexion, implémenté par Sonnet), ne fasse fonctionner les 6 cases. Nouveaux champs optionnels
  `exces?`/`doseCorrection?` sur `BolusParams` (comportement strictement inchangé quand absents),
  nouvelle fonction privée `fractionEffetDelivree` ; 55 tests `glycemieCurve.test.ts` (dont 4
  nouveaux), `bolusEffet` non modifiée.
- **S6 — Zéro scroll** (T11, audit #1) : resserrement du rythme vertical du cadre partagé
  (`ModuleShell`, `Home`) — paddings/marges réduits (~90-110 px récupérés par page), `.shell` passe
  en `min-height: 100dvh`, aucun `overflow:hidden` ni hauteur figée ajoutés, rétro-compat tabac
  respectée (abstention délibérée sur `tokens.css`, réductions locales seulement). Mesure (par
  lecture de code, pas de rendu navigateur) des 10 modules diabète + accueil aux résolutions
  1366×768 et 1024×768 : résiduels identifiés et priorisés, cf. ci-dessous.

**Résiduels non résolus par ce chantier** (à traiter en micro-session dédiée, hors périmètre S6) :

1. **Débordement zéro-scroll persistant** sur les modules **Suivi** (« Le parcours », breakpoint
   côte-à-côte mal calé pour 1024px, empilement au lieu du côte-à-côte prévu, +~615px estimé) et
   **Traitements** (grille ordonnance/silhouette empilée sous 1100px, +~300-550px estimé à 1024px)
   — cause structurelle : deux breakpoints de layout mal calés, pas un manque de resserrement de
   padding (chiffres détaillés dans le bilan de `S6.md`). `CourbeGlycemie` sans plafond de hauteur
   est une 2ᵉ cause transversale identifiée (4 modules touchés : Alimentation, Hypoglycémie,
   Insuline, Insuline rapide).
2. **Constantes `// à caler (Thibault)` introduites par ce chantier**, non cliniquement validées :
   `CORRECTION_DOSE` (S5/T9), `EXCES_SITUATION_B`/`EXCES_CONSOMMATION` (S5/T10),
   `DEPART_RESORPTION` (S5/T9), le mapping situation×ajustement de `insuline/scenarios.ts` (S4/T8).

Gate consolidation : `npx tsc --noEmit` ✓ · `npm run build` ✓ · `npm test` ✓ (92/92, dont 55
`glycemieCurve.test.ts` — 4 nouveaux — et 37 `nicotineCurve.test.ts`), vérifié session par session
puis par l'orchestrateur sur l'intégralité des changements fusionnés. Visuel → checklists
consolidées dans `docs/diabete/VALIDATION.md` (nouveau, cf. §Cadre transverse pour le détail des
résiduels par module à 1366×768/1024×768).

## Ce qui fonctionne

- **Moteur multi-thèmes** (2026-07-08) : navigation à 3 niveaux (thèmes → accueil du thème → module,
  pile d'historique éphémère) ; `ThemeSelector` (nouveau) affiche une carte par thème, masqué si un
  seul thème existe ; `Home.tsx`, `ModuleCard.tsx` génériques (aucun id/nom de thème en dur).
- **Scaffolding** Vite + React + TS ; navigation carte ↔ module (pile d'historique éphémère) ; accueil grille familles (Comprendre / Agir / Se motiver, A3) responsive.
- **Coquille partagée** : `ModuleShell`, `Sources` (libellé « Sources » visible + focus clavier A4), `ModuleCard`. Registre + `famille` par module (A3).
- **Les 10 modules du thème tabac** implémentés (plus aucun stub) — descriptions resynchronisées sur le
  code en BO9 (2026-07-10) :
  1. **Composantes de l'addiction** (`addiction/`) — *refonte BO3, 2026-07-10* : diagramme de Venn à géométrie fixe, clic sur un pilier → ses situations (`situations.ts`) en **menu radial sélectionnable** (bouton-puce à bascule, double encodage), sélection persistante entre piliers, **aucune description ni solution à l'écran** ; CTA unique « Stratégies et outils (n) » → `boite-a-outils` avec la sélection en contexte de navigation ; plus de panneau latéral ni de navigation directe.
  2. **Nicotine** (`nicotine/`) — frise 24 h cliquable (modèle réécrit en S4, 2026-07-08) : 3 outils (Cigarette / Patch / Substitut), clic sur la frise = pose un événement à cet instant, clic sur un marqueur = le retire ; patch réglable en **quarts de dose ±¼** ; chip « Pic atteint : \<zone> » ; tooltips signes de manque/surdosage au survol/focus des libellés de zone ; `ModuleFooterNav` (X6) → Substituts, Soulagement.
  3. **Substituts & titration** (`substituts/`) — **6 formes** (patch, gomme, pastille, comprimé sublingual, spray buccal, **vapoteuse** — réintégrée BO5, 2026-07-10, badge « Réduction des risques » + encart de statut, `// à revalider`), toutes avec contenu médical (bonnes pratiques + erreurs) ; inhaleur reste retiré (2026-07-08) ; titration : bouton « + ¼ (tous les 3 jours) » + aide de condition + bannière surdosage détaillée ; aucun dosage chiffré ; fiche « Ma méthode patch » (X3) ; `ModuleFooterNav` (X6) → Plan d'arrêt, Nicotine.
  4. **Nicotine ≠ toxique** (`nicotine-toxique/`) — scène SVG, hotspots, filtres ; atténuation légère de l'autre groupe + double encodage non chromatique (icônes ⚠/🧠 + libellés de rôle) (A7) ; contenu médical (regroupements toxiques + formulation nicotine) validé par Thibault le 2026-07-08 ; bloc « Continuer l'exploration » migré sur `ModuleFooterNav` (X6) → Substituts, Nicotine, sans changement visuel.
  5. **Piège du soulagement** (`soulagement/`) — frise 24 h cliquable (modèle réécrit en S7, 2026-07-08) : clic = dépose une cigarette (chute puis remontée de la tension liée au manque), clic sur un repère = le retire, toggle « Comparer au non-fumeur » ; amplitudes du récit chiffré illustratif validées par Thibault le 2026-07-08 ; `ModuleFooterNav` (X6) → Substituts, Stratégies & outils.
  6. **Stratégies & outils** (`boite-a-outils/`, *ex-Craving, fusionné BO1-BO2, 2026-07-10*) — grille de **14 outils** filtrables par situation (union : transverse ou intersection avec les chips actives, pré-filtrée si arrivée depuis Composantes) ; panneau de détail (principe + « comment le proposer », mention de preuve qualitative, jamais de chiffre) ; outil `outil-vague-4d` → **compte à rebours réel de 3 min** (3:00 → 0:00, `CRAVING_DURATION = 180`, code hérité de l'ancien module Craving), 3 phases idle/active/done, 4 cartes D (Différer / Détourner l'attention / Se détendre — respirez / D'eau), fiche « Ma carte anti-envie » inchangée ; fiche « Ma boîte à outils » (nouvelle) composée des outils cochés ; `ModuleFooterNav` (X6) → Plan d'arrêt, Motivation.
  7. **Explorer ma motivation** (`motivation/`) — 2 onglets : « Où en êtes-vous ? » (flux de 2 questions au **cadran circulaire** `Dial` 0–10, Importance puis Confiance, relances EM, écran de synthèse) et « Mes raisons » (réserve de cartes seed → clic = ajout au tableau, **repositionnement au pointeur**, clic sans déplacement = édition, « + une raison ») ; cartes seed et libellés d'échelle validés par Thibault le 2026-07-08 ; fiche « Mes raisons » (X4) ; `ModuleFooterNav` (X6) → Plan d'arrêt.
  8. **Mon plan d'arrêt** (`plan-arret/`, ajouté X5, 2026-07-09) — famille Agir, **7 sections** (date, substituts — dont vapoteuse depuis BO6 —, situations à risque, parades, raisons, « autour de moi » fixe, **« Si j'ai un écart »** ajoutée BO6 2026-07-10) en chips multi-sélection + champs libres ; fiche « Mon plan d'arrêt » (bouton « Imprimer mon plan », actif dès qu'une section est renseignée) ; aucun `ModuleFooterNav` (volontairement — la fiche est la sortie du module).
  9. **Ce que l'arrêt répare** (`benefices-arret/`, ajouté S5 approfondissement-tabac, 2026-07-09-10) — famille Se motiver, silhouette générique + frise de 10 jalons (20 min → 10-15 ans), registre exclusivement positif ; chiffres à revalider (Tabac Info Service/OMS).
  10. **Vrai ou faux ?** (`idees-recues/`, ajouté S6 approfondissement-tabac + enrichi BO4, 2026-07-09-10) — famille Comprendre, **21 cartes** (15 initiales + 6 poids/vapoteuse ajoutées BO4), carte à la fois, verdict + explication + source + renvoi éventuel ; 11 cartes marquées `// à revalider (Thibault)` (sources internationales ou SPF).
- **Logique pure** : `src/features/tabac/lib/nicotineCurve.ts` (`sampleCurve`, `classifyZone`, `toSvgPath`, `sampleStress`), couverte par Vitest (`nicotineCurve.test.ts`, 20 tests verts — dont l'invariant R5 « creux fumeur > basal non-fumeur », la monotonie creux/rebond, et les 3 invariants de cumul V3).
- **Styles / accessibilité** : `tokens.css` (palette sémantique confort/toxique/vigilance/nav), `global.css` (cibles ≥ 44 px, `.activeDoubled`, `prefers-reduced-motion`).
- **Socle fiches à emporter** (X1, 2026-07-09) : `src/components/FicheOverlay.tsx` — composant générique
  (props `eyebrow`/`titre`/`footer`/`onClose`/`children`, zéro contenu en dur) rendu via `createPortal`
  sur `document.body` ; feuille A4 portrait (`fiche-sheet`), fond assombri cliquable + Échap pour fermer,
  focus initial sur « Fermer », en-tête eyebrow/titre serif/date du jour, pied mention fixe
  « rien n'est enregistré », barre d'actions hors feuille (Imprimer / Fermer, `data-no-print`).
  CSS d'impression (`@page A4`, `@media print` masque `#root` + `[data-no-print]`) et blocs
  typographiques réutilisables (`.fiche-titre-xl`, `.fiche-bloc`, `.fiche-signaletique` + pastilles
  numérotées, `.fiche-contact` bandeau 39 89) dans `src/styles/global.css` (section « Fiches »).
- **Les 5 fiches concrètes** (X2-X5 + BO2, 2026-07-09/10), chacune via `FicheOverlay` + `.fiche-filrouge`
  en pied : **Ma carte anti-envie** (attachée à l'outil `outil-vague-4d` de Stratégies & outils, bouton
  « Préparer ma carte », boucle signalétique 1-2-3 + 4D cochables + bandeau 39 89, contenu inchangé
  depuis l'ancien module Craving) ; **Ma boîte à outils** (nouvelle, BO2 2026-07-10 — bouton « Imprimer
  ma boîte à outils (n) », titre + consigne d'une ligne par outil coché) ; **Ma méthode patch**
  (Substituts, bouton « Imprimer ma méthode », les 3 règles + dose du moment en quarts jour/nuit —
  **étendue en X8**, 2026-07-09 : dose de jour en vert + marge de quarts vides coloriables au stylo
  (patch en cours complété + 1 patch), impression forcée des aplats (`print-color-adjust: exact`) ;
  bloc optionnel « Ma prise ponctuelle » via un sélecteur dédié à la fiche (gomme/pastille/sublingual/
  spray) affichant `TechniqueIllustration` (image-ready, placeholder tant qu'aucune image fournie) +
  bonnes pratiques de la forme) ; **Mes raisons** (Motivation, bouton « Imprimer mes raisons », cartes
  du tableau + échelles si renseignées) ; **Mon plan d'arrêt** (module `plan-arret`, bouton « Imprimer
  mon plan », les sections renseignées uniquement — dont la nouvelle section « Si j'ai un écart »).
- **Portes de fin de module + fil rouge + `InfoHover`** (X6, 2026-07-09 ; retargetées vers Stratégies &
  outils en BO1-BO2, 2026-07-10) :
  - `src/components/ModuleFooterNav.tsx` — bloc générique « Continuer l'exploration » (titre + boutons
    `{label →}`), extrait de nicotine-toxique (qui migre dessus sans changement visuel) ; câblé en pied
    de Nicotine, Soulagement, Stratégies & outils, Substituts, Motivation avec les libellés/ids verbatim
    du brief §3.3 (`craving` → `boite-a-outils` partout) — jamais un enchaînement forcé. Addiction et
    Plan d'arrêt n'ont volontairement aucune porte (Addiction a un CTA contextuel dédié, cf. Module 1).
  - Fil rouge « C'est la fumée qui rend malade. C'est le manque qui fait fumer. Et le manque, ça se
    traite. » — champ générique `exergue?: string` sur `ThemeDef` (rendu par `Home.tsx` sous le titre),
    câblé sur le thème tabac uniquement ; classe globale `.filrouge` en clôture des 4 modules
    « Comprendre » (Addiction, Nicotine, Nicotine ≠ toxique — qui remplace son ancien « À retenir »,
    Soulagement) ; classe `.fiche-filrouge` en pied des 5 `FicheOverlay` (carte anti-envie, boîte à
    outils, substituts, motivation, plan-arret).
  - `src/components/InfoHover.tsx` — généralisation du pattern tooltip de zone du module Nicotine
    (survol + focus clavier), composant créé et fonctionnel mais **non câblé sur aucun contenu** :
    aucune des 3 entrées du 2ᵉ niveau de lecture (`docs/BRIEF_TABAC.md` §3.5 — substituts/nicotine/
    stratégies & outils) n'est marquée validée au §5 du brief à ce stade. C'est le comportement par
    défaut attendu, pas un point bloquant.

- **Thème diabète — audit 2026-07-12** (`plans/audit-diabete/`, 12 corrections, détail en
  `## Phase 14`) : la famille Insuline passe à un système d'**expérimentation** (réglage → effet
  direct sur la courbe) sur les modules Insuline (lente, S4) et Insuline rapide (départ convergent +
  correction + cumul, S5). `glycemieCurve.ts` (`sampleRepasAvecBolus`) gagne 2 champs optionnels
  `exces?`/`doseCorrection?` sur `BolusParams` (comportement strictement inchangé quand absents) et
  une nouvelle fonction privée `fractionEffetDelivree`, pour modéliser un excès de glycémie
  persistant résorbé uniquement par une dose de correction réelle pondérée par l'insuline encore
  active (IOB) d'une dose antérieure — détail de la décision de modélisation (3 tentatives) dans
  `DECISIONS.md` 2026-07-12. **Résiduels connus** : débordement zéro-scroll persistant sur Suivi et
  Traitements à 1024×768 (breakpoints de layout, cf. `## Phase 14`) ; plusieurs constantes
  `// à caler (Thibault)` du modèle de cumul non cliniquement validées.

## Ce qui n'est pas fait / à compléter (non bloquant)

- **Thème diabète** : scaffold vide (`src/features/diabete/registry.ts`, `MODULES: []`) — cadrage du
  contenu clinique en cours avec Thibault (4/8 modules spécifiés en détail dans `docs/diabete/`,
  sources probantes brutes dans `docs/evidence-diabete/`), reste à finaliser les modules 5-8 puis
  transmettre à Claude Design avant tout développement.
- **Validation visuelle/UX humaine** des modules et de C8-C9 : pas encore faite (cf. `VALIDATION.md`).
- **C10 (partiel)** : sources exactes par module dans `registry.ts` — **seul point de contenu encore en attente** de Thibault (l'encart « Sources » affiche « à compléter » tant qu'elles manquent).
- **2ᵉ niveau de lecture (X6, `InfoHover`)** : contenu à câbler dès que Thibault valide tout ou partie
  des 3 entrées de `docs/BRIEF_TABAC.md` §3.5 (substituts, nicotine, Stratégies & outils) + leurs sources
  exactes (§5 du brief). Le composant générique est prêt ; il ne reste qu'à passer `content`/`children`
  dans les 3 modules concernés une fois validé.
- Dépouillement des questions de contenu le **2026-07-08** : regroupements toxiques + formulation nicotine (Module 4), amplitudes du soulagement (Module 5), cartes seed + libellés d'échelle motivation (Module 7) **validés par Thibault** ; inhaleur + vapoteuse **retirés** du Module 3 (vapoteuse réintégrée le 2026-07-10, cf. `DECISIONS.md`) ; enrichissement « outils & stratégies » Module 1 (R6) clos sans ajout. Il ne reste que les sources exactes (ci-dessus).
- **Occurrences résiduelles du mot « craving »** hors périmètre du chantier `boite-a-outils` (signalées,
  non corrigées — cf. `DECISIONS.md` 2026-07-10 « points ouverts ») : `src/features/registry.ts`
  (description libre du thème générique), `nicotine/NicotineModule.tsx` (libellé texte, pas un id de
  navigation), `plan-arret/PlanArretModule.tsx` (commentaire de code référençant l'ancien chemin).

## Dette technique / complexité

- Faible : 10 modules tabac indépendants (dont `boite-a-outils` et `idees-recues` partagent
  `situations.ts`/registres), logique pure isolée. Aucune zone difficile identifiée.
