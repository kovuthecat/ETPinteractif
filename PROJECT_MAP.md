# PROJECT_MAP.md

Carte synthétique du projet. Permet à ChatGPT et Claude Code de localiser vite les zones pertinentes.

> État : **lot `PLAN_modules-tabac.md` (T1-T11) terminé le 2026-06-28** — scaffolding + les 6 modules du thème tabac sont implémentés et naviguables. **`plans/PLAN_corrections-v2.md` (R1-R9) terminé le 2026-07-01** — dont R9 : ajout d'un 7ᵉ module transverse, `motivation/`. **Moteur multi-thèmes introduit le 2026-07-08** : le thème tabac a été déplacé sous `features/tabac/`, un écran de sélection de thème (`ThemeSelector`) a été ajouté, et un thème `diabete` est scaffoldé (sans contenu, en attente de cadrage). **Chantier `plans/extensions-tabac/` (X1-X7) clos le 2026-07-09** (brief `docs/BRIEF_TABAC.md`) : 8ᵉ module `plan-arret/`, 4 fiches imprimables via `FicheOverlay`, portes de fin de module via `ModuleFooterNav`, fil rouge du thème, composant `InfoHover` (créé, non câblé). **Chantier `plans/approfondissement-tabac/` (S1-S7) clos le 2026-07-10** : modèle `nicotineCurve.ts` réaliste, `SilhouetteCorps` générique, modules 9 (Ce que l'arrêt répare) et 10 (Vrai ou faux ?). **Chantier `plans/boite-a-outils/` (BO1-BO9) clos le 2026-07-10** : `craving/` remplacé par `boite-a-outils/` (14 outils filtrables, fiche « Ma boîte à outils »), refonte du module Composantes (sélection radiale de situations, `situations.ts` partagé), contexte de navigation générique (`unknown`) dans le moteur, vapoteuse réintégrée dans les Substituts, section « Si j'ai un écart » dans Plan d'arrêt, 6 nouvelles cartes Vrai/faux (21 au total), interrupteur « toniques uniquement » côté diabète/Activité. **Chantier `plans/corrections-audit-tabac/` (S1-S13) clos le 2026-07-13** : retouches UI/a11y sur 6 modules tabac + 1 composant diabète partagé (S1-S9), nouveau `src/state/SelectionContext.tsx` (état de sélection partagé **en mémoire**, S10), nouveau livret d'accompagnement imprimable `src/components/PrintableLivret.tsx` (S11, proposition livrée sans validation visuelle, à ajuster). Chantier séparé cadré `plans/aide-patient/` (T16, app patient autonome, 2ᵉ surface applicative) : cadrage produit complet, **non démarré**. **Chantier `plans/corrections-revue-guidee/` (S1-S6 + 3 correctifs de séance) validé visuellement par Thibault le 2026-07-14** (13 points d'une revue guidée, blocs A-E ; consolidation S7 en cours) : benefices-arret passe en nav par frise chronologique à hotspots + silhouette anatomique hotspot, plan-arret gagne un sélecteur de stratégie, insuline-rapide corrige son modèle « couvrir » (dose fixe) et gagne un encadré `.situationCard` + `excesGate` en lib, insuline basale perd ses onglets (écran unique), VagueCraving (Boîte à outils) passe les 4D en activation exclusive. **Chantier `plans/outils-interactifs-2026-07/` (S1-S8) clos le 2026-07-21** : 11 des 14 outils de « Stratégies & outils » rendus interactifs (registre `OUTILS_INTERACTIFS`, dossier `outils-interactifs/` ci-dessous) dans les deux bundles (consultation + patient), `outil-respiration` recâblé en consultation, persistance injectée (`outilsData` en mémoire côté consultation, `localStorage` côté patient via `usePatientStore`). **Chantier `plans/insuline-affinements-2026-07/` (S1-S6) clos le 2026-07-21** : nouveau doc d'autorité `docs/diabete/09-insuline-basale.md`, module basale enrichi (intro rôle de la lente + bloc régularité/horaire + pont vers la rapide), module rapide enrichi (slider timing ② à source de vérité unique + 5ᵉ onglet « Et si je ne mange pas ? » + pont vers la basale), garde-fou dans `glycemieCurve.ts` (`sampleRepasAvecBolus`, plus de creux sous baseline au cas adéquat). Cette carte décrit l'arborescence réelle.

---

## Vue d'ensemble

- Type : application web statique (Vite + React + TS), local-first, sans backend ni base.
- Grandes zones : un **écran de sélection de thème** (`ThemeSelector`, affiché seulement si ≥ 2 thèmes) → une **carte de modules** par thème (`Home.tsx`) → des **modules ETP** indépendants (`src/features/<theme>/<slug>/`) → une **coquille de module** générique (`ModuleShell`) rendue par `App.tsx`.
- Navigation par état dans `App.tsx` (pas de router) : `view: {type:'themes'} | {type:'home', themeId} | {type:'module', themeId, moduleId}`.
- Flux principal : le soignant ouvre l'app → (si plusieurs thèmes) choisit un thème → carte des modules du thème → clique un module → l'illustre avec le patient → revient à la carte. Aucune donnée n'est enregistrée.
- Contrainte structurante : multi-thèmes par conception. Le moteur (`src/features/types.ts`, `src/features/registry.ts`, tout `src/components/`) ne connaît **aucun thème par son nom** — `ModuleId`/`FamilleId` sont des `string` génériques, `hue` vit dans `ModuleDef`, les familles et l'eyebrow vivent dans `ThemeDef`. Chaque thème (`tabac`, `diabete`) est un dossier isolé sous `src/features/<theme>/` avec son propre `registry.ts`. Zéro persistance.

---

## Arborescence réelle

```text
src/
  main.tsx                 # entrée, import des styles globaux
  App.tsx                  # navigation par état (themes <-> home <-> module), rend ThemeSelector/Home/ModuleShell
  styles/
    tokens.css              # variables CSS (couleurs, espacements, radius, font-size)
    global.css              # reset + import des tokens
  components/               # UI partagée, générique (pas de contenu tabac/diabète)
    ThemeSelector.tsx / .module.css # accueil global : grille de cartes thème (masqué si un seul thème)
    Home.tsx / .module.css       # accueil d'un thème : grille de ModuleCard par famille + exergue (fil rouge, X6)
    ModuleShell.tsx / .module.css # en-tête (retour + titre + Sources) autour de chaque module
    Sources.tsx / .module.css     # pop-over discret des sources (placeholder si vide)
    ModuleCard.tsx / .module.css  # carte cliquable (icône + titre + résumé)
    FicheOverlay.tsx / .module.css    # fiche à emporter générique (aperçu A4 + impression, X1)
    ModuleFooterNav.tsx / .module.css # porte de fin de module générique « Continuer l'exploration » (X6)
    InfoHover.tsx / .module.css       # 2ᵉ niveau de lecture générique, survol/focus+clic verrouillant (X6, créé ; câblé diabète/alimentation)
    PrintableLivret.tsx / .module.css # livret d'accompagnement imprimable multi-pages A4 (couverture + sections
                                       # imprimables assemblées depuis SelectionContext ; consommé par le module
                                       # plan-arret tabac ; S11 corrections-audit-tabac, 2026-07-13, proposition
                                       # livrée sans validation visuelle)
  state/
    SelectionContext.tsx    # état de sélection partagé EN MÉMOIRE (jamais localStorage/sessionStorage/cookies),
                             # Provider générique indexé par themeId + hook useSelection() ; monté dans App.tsx
                             # au-dessus du switcher de vues (survit à la navigation inter-modules, se
                             # réinitialise au rechargement) ; S10 corrections-audit-tabac, 2026-07-13
  features/
    types.ts                # ModuleId/FamilleId (string génériques), Hue, ModuleDef, FamilleDef, ThemeDef, exergue?
    registry.ts              # THEMES: ThemeDef[] — registre des thèmes (tabac + diabete)
    tabac/
      registry.ts            # MODULES: ModuleDef[] — les 10 modules tabac, titres/résumés/icônes/hue
      situations.ts          # SITUATIONS: 20 situations partagées (3 piliers) + parseSelectionSituations
                              # (contexte de navigation Addiction → Stratégies & outils, BO1, 2026-07-10)
      addiction/AddictionModule.tsx              # Module 1 — composantes de l'addiction (refonte BO3 2026-07-10 :
                                                  # sélection radiale de situations, sans description ni solution à l'écran)
      nicotine/NicotineModule.tsx                # Module 2 — nicotine, frise 24 h cliquable (S4, X6 : ModuleFooterNav)
      substituts/SubstitutsModule.tsx + data.ts  # Module 3 — substituts & titration, 6 formes dont vapoteuse
                                                  # (T9, X3 : fiche, X6 : ModuleFooterNav, BO5 2026-07-10 : vapoteuse) ;
                                                  # data.ts (FORMES_DATA/FormeId/FORMES_PONCTUELLES) extrait du
                                                  # module en S11 corrections-audit-tabac, réutilisé par le livret
      nicotine-toxique/NicotineToxiqueModule.tsx # Module 4 — nicotine ≠ toxique (T10, X6 : migré sur ModuleFooterNav)
      soulagement/SoulagementModule.tsx          # Module 5 — le piège du soulagement (S7, X6 : ModuleFooterNav)
      boite-a-outils/BoiteAOutilsModule.tsx      # Module 6 — Stratégies & outils, ex-Craving (BO1-BO2, 2026-07-10) :
                                                  # 14 outils filtrables par situation, VagueCraving.tsx (4D hérité ;
                                                  # activation exclusive d'un D à la fois depuis le correctif de
                                                  # séance corrections-revue-guidee, 2026-07-14 — la vague de
                                                  # l'envie est visible par défaut, le D actif se superpose dessus),
                                                  # fiche « Ma boîte à outils », X6 : ModuleFooterNav ; toggle grille
                                                  # « Dans ma fiche » retiré (S3 corrections-revue-guidee, reste en
                                                  # vue détail) ; les 2 renvois `outils.ts` vers plan-arret retirés ;
                                                  # depuis 2026-07-21 (chantier outils-interactifs-2026-07), monte
                                                  # les outils du registre `outils-interactifs/` (ci-dessous) via
                                                  # `useConsultationStore()` au lieu du seul cas `vague4d` en dur
        outils-interactifs/                      # Socle + composants des 11 outils rendus interactifs
                                                  # (chantier outils-interactifs-2026-07, S1-S7, 2026-07-21) :
          types.ts                                 # contrat `OutilStore` (get/setList) / `OutilContexte`
                                                    # (situationsActives?, raisons?, lecture seule) / `OutilInteractifProps`
          registry.ts                              # `OUTILS_INTERACTIFS: Partial<Record<interactif, Component>>` —
                                                    # remplace le test en dur `interactif === 'vague4d'` ; wrappers
                                                    # `VagueCraving`/`RespirationGuidee` + les 9 composants ci-dessous
          useConsultationStore.ts                  # adaptateur `OutilStore` sur `useSelection()` (SelectionContext,
                                                    # mémoire de session — invariant #1 consultation maintenu)
          PlansSiAlors.tsx / .module.css           # OI5 (S2) — constructeur de plans « SI… ALORS… »
          Tirelire.tsx / .module.css               # OI6 (S3) — calculette d'économies + récompense
          OutilChecklist.tsx / .module.css         # OI7 (S4) — générique : place-nette/mains-bouche/anti-ennui/routine
          MinuteurGuide.tsx / .module.css          # OI8 (S5) — générique : bouger 10 min / surfer sur l'envie
          PlanSecours.tsx / .module.css            # OI9 (S6) — plan de secours en cas d'écart
          PhraseRefus.tsx / .module.css            # OI10 (S6) — ma phrase de refus
          GabaritJournal.tsx / .module.css         # OI11 (S7) — renvoi carnet (patient) / gabarit imprimable (consultation)
          data/checklists.ts                       # données des 4 checklists (OI7), disjointes de `outils.ts`
          data/minuteurs.ts                        # étapes/durées des 2 minuteurs (OI8), disjointes de `outils.ts`
      motivation/MotivationModule.tsx + data.ts  # Module 7 — explorer ma motivation (S9 cadran Dial, X4 : fiche, X6) ;
                                                  # data.ts (MOTIVATION_SEED/RAISON_ICONS/iconForRaison) extrait du
                                                  # module en S11 corrections-audit-tabac, réutilisé par le livret
      plan-arret/PlanArretModule.tsx + livretSections.tsx  # Module 8 — mon plan d'arrêt (X5, ajouté 2026-07-09 ;
                                                  # section 7 « Si j'ai un écart » ajoutée BO6, 2026-07-10 ; famille
                                                  # agir ; lit ET écrit SelectionContext depuis S10 (bidirectionnel) ;
                                                  # section « 1. Ma date » gagne un sélecteur de stratégie « Arrêt
                                                  # complet / Réduction progressive » (S4 corrections-revue-guidee,
                                                  # 2026-07-14 — champ `strategie` en mémoire dans SelectionContext,
                                                  # libellés conditionnels seuls, livret inchangé) ;
                                                  # livretSections.tsx = contrat PrintableSection + builder
                                                  # buildLivretSections(state) consommé par PrintableLivret, S11)
      benefices-arret/BeneficesArretModule.tsx   # Module 9 — ce que l'arrêt répare (silhouette générique + frise
                                                  # 10 jalons, S5 approfondissement-tabac) ; nav par **frise
                                                  # chronologique à hotspots** (remplace chips + compteur « Étape
                                                  # X/N ») + silhouette en **mode hotspot anatomique** (bodyImage,
                                                  # asset copié public/illustrations/tabac/silhouette-corps.png,
                                                  # ancres % dans data.ts, sans importer le wrapper diabète) ;
                                                  # illustration de détail agrandie (S1 corrections-revue-guidee,
                                                  # 2026-07-14)
      idees-recues/IdeesRecuesModule.tsx + data.ts  # Module 10 — Vrai ou faux ? (21 cartes, S6 approfondissement-tabac
                                                     # + BO4 2026-07-10 : 6 cartes poids/vapoteuse + reformulation faux-pas)
      lib/
        nicotineCurve.ts + .test.ts  # logique pure tabac : sampleCurve/toSvgPath/sampleStress, partagée Modules 2 & 5
    diabete/
      registry.ts             # MODULES: ModuleDef[] — 9 modules diabète, titres/résumés/icônes/hue/sources (S1)
      components/
        IllustrationSlot.tsx / .module.css   # composant placeholder pour illustrations (S1)
        Silhouette.tsx / .module.css         # corps humain SVG avec zones nommées + états (S3)
        CourbeGlycemie.tsx / .module.css     # rendu unique de courbe glycémie avec marqueurs (S3)
        PlaqueArtere.tsx / .module.css       # motif plaque d'athérome, variantes artère/pastille (S3)
        SignatureEvitable.tsx / .module.css  # badge « Évitable et dépistable » récurrent (S3)
      lib/
        glycemieCurve.ts / .test.ts  # logique pure diabète : paramsFromAssiette/sampleRepas/sampleActivite/sampleRecuperation/sampleJournee/tempsDansCible (S2, 50 tests) ;
                                      # S3 chantier insuline-affinements-2026-07 (2026-07-21) : garde-fou
                                      # local dans `sampleRepasAvecBolus` (l'effet bolus ne peut plus creuser
                                      # sous la baseline avant `LATENCE_REPAS` sans excès de glycémie
                                      # disponible) — API exportée inchangée, 106 tests (5 nouveaux invariants)
      mecanisme/MecanismeModule.tsx / .module.css  # Module 1 — C'est quoi le diabète (clé/serrure, 4 temps, S4)
      alimentation/AlimentationModule.tsx / .module.css / data.ts  # Module 2 — Alimentation (déroulé guidé, 4 défis + synthèse, fiche + 2ᵉ niveau, S5 + alimentation-v2 S1-S3)
      activite/ActiviteModule.tsx / .module.css / data.ts         # Module 3 — Activité physique (rayonnement, jauge, timing, S6 ;
                                                                    # interrupteur « toniques uniquement » BO8, 2026-07-10 — filtre la
                                                                    # réserve seule, ne retire jamais un choix déjà placé dans la jauge)
      risque-cardio/RisqueCardioModule.tsx / .module.css          # Module 4 — Risque cardiovasculaire (5 feux, artère, anatomie, fiche, S7)
      complications/ComplicationsModule.tsx / .module.css / data.ts  # Module 5 — Complications (silhouette, « évitable », fiche pied, S8)
      suivi/SuiviModule.tsx / .module.css / logic.ts              # Module 6 — Suivi (cadran année, fiche calendrier, S9)
      traitements/TraitementsModule.tsx / .module.css / data.ts   # Module 7 — Traitements (ordonnance ↔ silhouette, S10)
      hypoglycemie/HypoglycemieModule.tsx / .module.css           # Module 8 — Hypoglycémie (15/15, récupération/overshoot, carte, S11)
      insuline/InsulineModule.tsx / .module.css / scenarios.ts    # Module 9 — Insuline basale (traces capteur, TIR vivant, S12) ;
                                                                    # onglets retirés, **écran unique continu** (correctif de séance
                                                                    # corrections-revue-guidee, 2026-07-14 — remplace l'alignement prévu
                                                                    # sur les onglets de la rapide ; bloc « Décider » toujours visible ;
                                                                    # scenarios.ts intact, retouche présentation/nav uniquement) ; S4
                                                                    # chantier insuline-affinements-2026-07 (2026-07-21) : intro « à quoi
                                                                    # sert la lente » + carte régularité/horaire (générique, sans molécule)
                                                                    # + phrase-pont vers la rapide ajoutées en amont de la titration
                                                                    # (toujours le cœur de l'écran, inchangée) ; scenarios.ts non touché
      insuline-rapide/InsulineRapideModule.tsx / .module.css      # Module 10 — Insuline rapide pré-prandiale (4 temps : couvrir
                                                                    # le repas / bon moment / corriger / cumul → hypo ;
                                                                    # CVD3-S10, 2026-07-11 ; contenu : docs/diabete/10-insuline-rapide.md,
                                                                    # relecture finale Thibault encore attendue). S5-S6 + correctif
                                                                    # corrections-revue-guidee (2026-07-14) : temps ① dose « habituelle »
                                                                    # devenue fixe (résultat = écart dose−glucides, alignée sur temps ③) ;
                                                                    # réglages fins temps ③ ; temps ④ « redescend seule » redessinée +
                                                                    # correctif post-validation (2 courbes de base partent identiques,
                                                                    # divergent après le pic, via `excesGate` gaté post-pic dans
                                                                    # glycemieCurve.ts) ; encadré commun `.situationCard`
                                                                    # (situation→réponse→résultat) posé sur les temps ①③④, aligné sur
                                                                    # la présentation de l'insuline basale. Chantier
                                                                    # insuline-affinements-2026-07 (2026-07-21) : S2 — slider timing ②
                                                                    # refondu sur `timingPhase(delay)` (source de vérité unique, libellé
                                                                    # dynamique remplace les 4 étiquettes fixes) ; S5 — **5ᵉ temps**
                                                                    # `⑤ Et si je ne mange pas ?` (repas charge 0 + bolus → plonge,
                                                                    # renvoi module 8), positionnement après le ④ à revalider
docs/
  architecture.md
  BRIEF_TABAC.md               # brief design & pédagogie tabac (Fable, 2026-07-09) — §2 fiches rétroactives des 7
                                # modules existants, §3 spécification normative des extensions X1-X7
  contenu-modules-tabac.md    # autorité du contenu médical, thème tabac (fichier unique)
  diabete/                    # autorité du contenu médical, thème diabète (cadrage en cours)
    00-global.md               # grammaire commune, vue d'ensemble des 8 modules, journal des décisions
    09-insuline-basale.md      # doc d'autorité module 9 (rôle de la lente + régularité/horaire),
                                # créé S1 chantier insuline-affinements-2026-07, validé Thibault (G1)
    10-insuline-rapide.md      # doc d'autorité module 10 ; section « rapide sans repas » (temps ⑤)
                                # ajoutée S1 chantier insuline-affinements-2026-07, validée Thibault (G1)
    module-1-cest-quoi-le-diabete.md
    module-2-alimentation.md
    module-3-activite-physique.md
    module-4-risque-cardiovasculaire.md
    modules-5-8-cadrage.md    # modules 5-8, cadrés mais pas encore détaillés écran par écran
  evidence-diabete/           # rapports de synthèse OpenEvidence (sources probantes brutes, thème diabète)
  evidence-tabac/             # rapports de synthèse OpenEvidence (sources probantes brutes, thème tabac)
    2026-07-10-rapport-openevidence-sevrage.md  # stratégies comportementales du sevrage — autorité chiffrée
                                                 # du Module 6 (Stratégies & outils) ; chiffres jamais à l'écran
plans/
  # un dossier par chantier EN COURS (index.md + S<n>.md) ; le détail de chaque chantier clos
  # est synthétisé dans STATUS.md/TASKS.md puis le dossier est purgé (historique → git log,
  # cf. commit "chore: purge des dossiers plans/ des chantiers déjà clos", 2026-07-11)
  aide-patient/
    index.md    # cadrage complet (2026-07-13) de la future app patient autonome (2ᵉ surface applicative,
                # bundle Vite séparé, contenu générique, v1 « Mes substituts » + « Agir face à une
                # situation », QR unique) — sorti de corrections-audit-tabac (T16) ; chantier séparé,
                # sessions P1-P6 à écrire au lancement, non démarré
STATUS.md / VALIDATION.md / PROJECT_MAP.md
```

---

## Features principales

### Feature 1 — Sélection de thème + carte / menu central
Rôle : choisir un thème (si plusieurs existent) puis présenter les modules de ce thème, navigation libre non-linéaire.
Fichiers clés : `src/components/ThemeSelector.tsx`, `src/components/Home.tsx`, `src/components/ModuleCard.tsx`, `src/App.tsx`.
Points de vigilance : doit rester lisible à distance, gros éléments cliquables ; `ThemeSelector` ne s'affiche que si `THEMES.length > 1`.

### Feature 2 — Coquille de module générique
Rôle : `App.tsx` rend `ModuleShell` (titre + retour + `Sources`) autour du module sélectionné ; les modules ne rendent QUE leur contenu interactif et reçoivent `onNavigate`.
Fichiers clés : `src/components/ModuleShell.tsx`, `src/components/Sources.tsx`, `src/features/types.ts`.
Points de vigilance : généricité = clé de la réutilisation multi-thèmes ; aucun module ne duplique son propre en-tête.

### Feature 3 — Modules du thème tabac
Rôle : le contenu interactif des 10 modules (addiction, nicotine, substituts, nicotine-toxique,
soulagement, boite-a-outils, motivation, plan-arret, benefices-arret, idees-recues). `boite-a-outils`
remplace `craving` depuis le 2026-07-10 (chantier `plans/boite-a-outils/`, BO1-BO2) — le dossier
`craving/` a été supprimé après déplacement de son code (vague/4D) dans `boite-a-outils/VagueCraving.tsx`.
Fichiers clés : `src/features/tabac/<slug>/`, `src/features/tabac/situations.ts` (situations partagées
Addiction ↔ Stratégies & outils), contenu source dans `docs/contenu-modules-tabac.md` (mécaniques +
niveaux de preuve qualitatifs), `docs/evidence-tabac/` (rapports OpenEvidence, chiffres bruts jamais à
l'écran) et `docs/BRIEF_TABAC.md` (design/pédagogie + extensions X1-X7).
Points de vigilance : exactitude médicale, sources affichables (via `registry.ts` → `sources?: string[]`), sobriété visuelle, aucun dosage chiffré pour les substituts, aucun chiffre d'étude brut (OR/SMD/RR) côté patient.

### Feature 3bis — Fiches à emporter, portes de fin de module, fil rouge (extensions X1-X7 + BO2)
Rôle : `FicheOverlay` compose et imprime à la volée une feuille A4 (5 fiches : **Ma carte anti-envie**
— attachée à l'outil vague/4D de Stratégies & outils —, **Ma boîte à outils** — nouvelle, BO2 —, méthode
patch, mes raisons, mon plan d'arrêt), zéro persistance ; `ModuleFooterNav` câble des portes optionnelles
en pied de modules (dont Stratégies & outils → Plan d'arrêt/Motivation depuis BO2) ; le fil rouge du
thème (`ThemeDef.exergue`) s'affiche en exergue d'accueil et en clôture des 4 modules « Comprendre » ;
`InfoHover` généralise le tooltip de zone pour un 2ᵉ niveau de lecture, créé mais non câblé tant
qu'aucun contenu n'est validé par Thibault.
Fichiers clés : `src/components/FicheOverlay.tsx`, `src/components/ModuleFooterNav.tsx`,
`src/components/InfoHover.tsx`, `src/features/tabac/plan-arret/PlanArretModule.tsx`, `docs/BRIEF_TABAC.md`.
Points de vigilance : composants génériques, agnostiques du thème (aucun contenu en dur) ; les portes ne
sont jamais un enchaînement forcé ; ne pas câbler `InfoHover` sans validation Thibault (§5 du brief).

### Feature 3ter — État de sélection partagé + livret d'accompagnement (S10-S11, corrections-audit-tabac, 2026-07-13)
Rôle : les sélections faites dans les modules tabac (situations, forme de substitut, outils « Dans ma
fiche », raisons) survivent désormais à la navigation entre modules (perdues auparavant, chaque module
avait son state local isolé) via un état **en mémoire**, partagé et lu/écrit par « Mon plan d'arrêt » ; ces
mêmes sélections sont ensuite assemblées en un livret d'accompagnement imprimable multi-pages A4 (remplace
l'ancienne fiche récap texte de « Mon plan d'arrêt »).
Fichiers clés : `src/state/SelectionContext.tsx` (Provider générique par `themeId` + `useSelection()`,
monté dans `App.tsx`), `src/components/PrintableLivret.tsx`, `src/features/tabac/plan-arret/
livretSections.tsx` (contrat `PrintableSection` + `buildLivretSections`), `src/features/tabac/substituts/
data.ts` et `src/features/tabac/motivation/data.ts` (contenu factorisé, consommé par les modules **et** le
livret).
Points de vigilance : **zéro persistance** (Context React uniquement, jamais localStorage/sessionStorage/
cookies — se réinitialise à un rechargement de page, c'est voulu) ; le livret est une **proposition livrée
sans validation visuelle** (cf. `VALIDATION.md` §S11), à considérer comme un brouillon tant que Thibault ne
l'a pas revu à l'écran.

### Feature 4 — Thème diabète (scaffold, cadrage en cours)
Rôle : place réservée pour le 2e thème. `src/features/diabete/registry.ts` exporte `MODULES: []` ; le thème apparaît dans `ThemeSelector` avec un badge « Bientôt disponible » (non cliquable). Le cadrage clinique (4 modules sur 8 déjà spécifiés en détail) avance dans `docs/diabete/`, avant tout câblage.
Fichiers clés : `src/features/diabete/registry.ts`, `docs/diabete/00-global.md` (index + grammaire commune), `docs/diabete/module-*.md`, `docs/evidence-diabete/` (sources probantes brutes).
Points de vigilance : ne pas ajouter de module au registre avant le cadrage clinique complet avec Thibault (cf. `docs/diabete/00-global.md`, table de statut par module).

### Feature 4bis — App d'aide patient autonome (chantier aide-patient S1-S5, 2026-07-13, gates verts)
Rôle : 2ᵉ surface applicative, atteinte par un QR code posé sur les fiches/le livret, offrant au patient
**seul** (chez lui, sans soignant) « Mes substituts » (comment les utiliser) et « Agir face à une situation »
(situation → outils). Bundle Vite **séparé** de l'app de consultation (2ᵉ point d'entrée `patient.html`/
`src/patient/main.tsx`), contenu générique consommé via la couche `src/content/tabac/` partagée (source
unique, créée en S1), zéro donnée patient dans l'URL/le build/un serveur, zéro dépendance runtime ajoutée.
Fichiers clés (créés S1-S5) : `patient.html`, `src/patient/{main.tsx, PatientApp.tsx, Home.tsx,
substituts/PatientSubstituts.tsx, situations/PatientSituations.tsx}`, `src/content/patientAppUrl.ts`,
`public/qr/patient.png`, composant `QRBlock` réutilisé par fiches/livret, `vite.config.ts` (2ᵉ entrée via
`build.rollupOptions.input`). Depuis 2026-07-21 (chantier outils-interactifs-2026-07) :
`src/patient/situations/usePatientStore.ts` (adaptateur `OutilStore` sur `localStorage`, clés
`etp.tabac.<outil.id>`, miroir `useState` pour re-render) + câblage générique des outils interactifs dans
`PatientSituations.tsx` (bouton « Démarrer » dès qu'un outil a un `interactif` mappé dans le registre).
Points de vigilance : le graphe d'import de l'entrée patient ne doit **jamais** atteindre un **module** de
consultation (séparation physique du code, vérifiée grep post-build) ; textes reformulés en « voix
patient » (comment faire, pas comment le proposer), marqués `// à revalider (Thibault)` ; **validation
VISUELLE** (Thibault, `npm run dev` sur les deux apps) toujours attendue avant push (cf. `VALIDATION.md`).
**Amendement 2026-07-21** (cf. `DECISIONS.md`) : l'interdiction stricte « jamais `src/features/**` depuis
le bundle patient » est assouplie pour le seul registre partagé des outils interactifs
(`src/features/tabac/boite-a-outils/outils-interactifs/registry.ts` + `types.ts`) — conséquence assumée
de la gate G1 (tous les outils interactifs exposés côté patient) et du registre unique consommé par les
deux bundles ; `PatientSituations.tsx`/`usePatientStore.ts` importent désormais ce sous-arbre précis,
mais jamais un module de consultation ni le moteur de navigation.

---

## Fichiers transversaux importants
- Configuration : `vite.config.ts`, `tsconfig*.json`, `package.json` (scripts `dev`/`build`/`test`)
- Navigation : état local dans `src/App.tsx` (pas de router)
- État global : minimal, **éphémère uniquement** (pas de persistance ; pas de localStorage) — `src/state/SelectionContext.tsx` (thème tabac, Context React monté dans `App.tsx`, depuis S10 corrections-audit-tabac 2026-07-13). Depuis 2026-07-21 (outils-interactifs-2026-07) : champ `outilsData: Record<string, string[]>` (données perso des outils interactifs, clé = `outil.id`), exposé via `useSelection().setOutilData` et lu par `useConsultationStore()` (`src/features/tabac/boite-a-outils/outils-interactifs/useConsultationStore.ts`) — l'adaptateur `OutilStore` consommé par tout composant du registre `OUTILS_INTERACTIFS` côté consultation ; pendant patient : `usePatientStore()` (`src/patient/situations/usePatientStore.ts`) sur `localStorage`.
- API / persistance : **aucune** (décision structurante)
- UI partagée : `src/components/`
- Logique pure testée : `src/features/tabac/lib/nicotineCurve.ts` (Vitest) — spécifique au thème tabac, pas un utilitaire du moteur générique

---

## Zones à risque ou coûteuses en contexte IA
- Le moteur de module générique (impacte tous les modules et tous les thèmes) — à concevoir proprement une fois.

---

## Règles locales importantes
- **Jamais de persistance de données** (ni localStorage, ni cookies, ni envoi réseau).
- Contenu médical **sourcé** (HAS, Tabac Info Service et équivalents) et affichable dans le module.
- Garder l'interactivité (≠ diaporama) et la sobriété visuelle.
- Préserver la généricité multi-thèmes (ne pas coder « en dur » pour un thème dans le moteur : `src/components/`, `src/features/types.ts`, `src/features/registry.ts`).

---

## Comment choisir les fichiers à fournir à ChatGPT
- Produit / architecture : `PROJECT_BRIEF.md`, `STATUS.md`, `ROADMAP.md`, `PROJECT_MAP.md`
- Contenu d'un module : `docs/contenu-modules-<theme>.md` + le dossier `features/<theme>/<module>/`
- Bug : `STATUS.md`, `PROJECT_MAP.md`, logs, fichiers concernés
